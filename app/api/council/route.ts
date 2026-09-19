import { authenticateCouncil, CouncilError, councilAct, councilView, createCouncilRoom, joinCouncilRoom } from '@/server/council-engine.mjs';
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
    if (!data || typeof data !== 'object') throw new CouncilError('Requête invalide.');
    const result = await transaction((rooms: Record<string, ReturnType<typeof createCouncilRoom>>) => {
      if (data.action === 'create') {
        if (Object.keys(rooms).length >= 500) throw new CouncilError('Trop de salons ouverts. Réessaie plus tard.');
        const room = createCouncilRoom(data.name);
        while (rooms[room.code]) room.code = createCouncilRoom(data.name).code;
        rooms[room.code] = room;
        return { room: councilView(room, room.players[0]), token: room.players[0].token };
      }
      const code = typeof data.code === 'string' ? data.code.toUpperCase() : '';
      const room = rooms[code];
      if (!room || room.kind !== 'last-council') throw new CouncilError('Assemblée introuvable ou expirée. Vérifie le code.');
      if (data.action === 'join') { const p = joinCouncilRoom(room, data.name); room.updatedAt = Date.now(); return { room: councilView(room,p), token: p.token }; }
      const p = authenticateCouncil(room, request.headers.get('authorization')?.replace(/^Bearer /, ''));
      if (data.action !== 'state') councilAct(room,p,data.action,data);
      if (data.action === 'leave') { if (!room.players.length) delete rooms[code]; return { room: null }; }
      return { room: councilView(room,p) };
    });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof SyntaxError) return Response.json({ error: 'Requête invalide.' }, { status: 400 });
    if (error instanceof CouncilError) return Response.json({ error: String(error) }, { status: 400 });
    console.error('Council request failed', error);
    return Response.json({ error: 'Le serveur est momentanément indisponible.' }, { status: 500 });
  }
}
