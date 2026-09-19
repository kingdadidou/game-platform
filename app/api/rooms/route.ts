import { act, authenticate, createRoom, GameError, joinRoom, view } from '@/server/engine.mjs';
import { transaction } from '@/server/store.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Origine non autorisée.' }, { status: 403 });
    const raw = await request.text();
    if (raw.length > 4096) return Response.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') throw new GameError('Requête invalide.');
    const result = await transaction((rooms: Record<string, ReturnType<typeof createRoom>>) => {
      if (data.action === 'create') {
        if (Object.keys(rooms).length >= 500) throw new GameError('Trop de salons ouverts. Réessaie plus tard.');
        const room = createRoom(data.name);
        while (rooms[room.code]) room.code = createRoom(data.name).code;
        rooms[room.code] = room;
        return { room: view(room, room.players[0]), token: room.players[0].token };
      }
      const code = typeof data.code === 'string' ? data.code.toUpperCase() : '';
      const room = rooms[code];
      if (!room || room.kind === 'last-council' || room.kind === 'metropole') throw new GameError('Salon introuvable ou expiré. Vérifie le code.');
      if (data.action === 'join') {
        const p = joinRoom(room, data.name); room.updatedAt = Date.now();
        return { room: view(room, p), token: p.token };
      }
      const p = authenticate(room, request.headers.get('authorization')?.replace(/^Bearer /, ''));
      if (data.action !== 'state') act(room, p, data.action, data);
      if (data.action === 'leave') { if (!room.players.length) delete rooms[code]; return { room: null }; }
      return { room: view(room, p) };
    });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: 'Requête invalide.' }, { status: 400 });
    if (error instanceof GameError) return Response.json({ error: String(error) }, { status: 400 });
    console.error('Room request failed', error);
    return Response.json({ error: 'Le serveur est momentanément indisponible.' }, { status: 500 });
  }
}
