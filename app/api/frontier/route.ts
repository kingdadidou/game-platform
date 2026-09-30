import { authenticateFrontier, createFrontierRoom, FrontierError, frontierAct, frontierView, joinFrontierRoom } from '@/server/frontier-engine.mjs';
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
    if (!data || typeof data !== 'object') throw new FrontierError('Requête invalide.');
    const result = await transaction((rooms: Record<string, ReturnType<typeof createFrontierRoom>>) => {
      if (data.action === 'create') {
        if (Object.keys(rooms).length >= 500) throw new FrontierError('Trop de campagnes ouvertes.');
        const room = createFrontierRoom(data.name);
        while (rooms[room.code]) room.code = createFrontierRoom(data.name).code;
        rooms[room.code] = room;
        return { room: frontierView(room, room.players[0]), token: room.players[0].token };
      }
      const code = typeof data.code === 'string' ? data.code.toUpperCase() : '';
      const room = rooms[code];
      if (!room || room.kind !== 'frontier-express') throw new FrontierError('Campagne introuvable ou expirée. Vérifie le code.');
      if (data.action === 'join') { const player = joinFrontierRoom(room, data.name); room.updatedAt = Date.now(); return { room: frontierView(room, player), token: player.token }; }
      const player = authenticateFrontier(room, request.headers.get('authorization')?.replace(/^Bearer /, ''));
      if (data.action !== 'state') frontierAct(room, player, data.action, data);
      if (data.action === 'leave') { if (!room.players.length) delete rooms[code]; return { room: null }; }
      return { room: frontierView(room, player) };
    }, { readOnly: data.action === 'state' });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: 'Requête invalide.' }, { status: 400 });
    if (error instanceof FrontierError) return Response.json({ error: String(error).replace(/^Error: /, '') }, { status: 400 });
    console.error('Frontier request failed', error);
    return Response.json({ error: 'Le quartier général est momentanément indisponible.' }, { status: 500 });
  }
}
