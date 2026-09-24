import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const ROOMS_KEY = "entre-nous:rooms";
const LOCK_KEY = `${ROOMS_KEY}:lock`;
const LOCK_TTL_MS = 5000;
const LOCK_ATTEMPTS = 40;

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function readRooms() {
  const stored = await redis.get(ROOMS_KEY);
  return stored && typeof stored === "object" ? stored : {};
}

async function acquireLock() {
  const token = randomUUID();
  for (let attempt = 0; attempt < LOCK_ATTEMPTS; attempt += 1) {
    const acquired = await redis.set(LOCK_KEY, token, { nx: true, px: LOCK_TTL_MS });
    if (acquired === "OK") return token;
    await wait(35 + Math.floor(Math.random() * 50));
  }
  throw new Error("Le stockage est occupé. Réessaie dans un instant.");
}

async function releaseLock(token) {
  await redis.eval(
    "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
    [LOCK_KEY],
    [token],
  );
}

export async function transaction(fn, { readOnly = false } = {}) {
  if (readOnly) return fn(await readRooms());

  const lockToken = await acquireLock();
  try {
    const rooms = await readRooms();
    const now = Date.now();
    for (const [code, room] of Object.entries(rooms)) {
      if (now - room.updatedAt > 86400000) delete rooms[code];
    }
    const result = await fn(rooms);
    await redis.set(ROOMS_KEY, rooms);
    return result;
  } finally {
    await releaseLock(lockToken);
  }
}
