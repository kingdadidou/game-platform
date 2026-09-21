import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const ROOMS_KEY = "entre-nous:rooms";

export async function transaction(fn) {
  // Récupère les salons depuis Redis
  let rooms = await redis.get(ROOMS_KEY);

  if (!rooms || typeof rooms !== "object") {
    rooms = {};
  }

  // Supprime les salons inactifs depuis plus de 24 heures
  const now = Date.now();

  for (const [code, room] of Object.entries(rooms)) {
    if (now - room.updatedAt > 86400000) {
      delete rooms[code];
    }
  }

  // Exécute exactement la même logique qu'avant
  const result = await fn(rooms);

  // Sauvegarde le nouvel état dans Redis
  await redis.set(ROOMS_KEY, rooms);

  return result;
}