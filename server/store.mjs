import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

// One Node process only. The shared queue also survives development hot reloads.
const key = Symbol.for('entre-nous.store');
const state = globalThis[key] ??= { queue: Promise.resolve() };
const folder = path.join(process.cwd(), '.data');
const file = path.join(folder, 'rooms.json');
export function transaction(fn) {
  const task = state.queue.then(async () => {
    await mkdir(folder, { recursive: true });
    let rooms;
    try { rooms = JSON.parse(await readFile(file, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; rooms = {}; }
    for (const [code, room] of Object.entries(rooms)) if (Date.now() - room.updatedAt > 86400000) delete rooms[code];
    const result = fn(rooms);
    await writeFile(file + '.tmp', JSON.stringify(rooms), { mode: 0o600 });
    await rename(file + '.tmp', file);
    return result;
  });
  state.queue = task.catch(() => {});
  return task;
}
