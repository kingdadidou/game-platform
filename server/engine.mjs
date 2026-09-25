import { randomBytes, randomInt, randomUUID } from 'node:crypto';

export class GameError extends Error {}
const requireThat = (condition, message) => { if (!condition) throw new GameError(message); };
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export function player(name) {
  name = clean(name, 20);
  requireThat(name.length >= 2, 'Choisis un pseudo de 2 à 20 caractères.');
  return { id: randomUUID(), token: randomBytes(32).toString('hex'), name, ready: false };
}
export function createRoom(name) {
  const p = player(name);
  return { kind: 'shadows', code: randomBytes(4).toString('hex').toUpperCase(), host: p.id, players: [p], messages: [], game: null, updatedAt: Date.now() };
}
export function joinRoom(room, name) {
  requireThat(room.kind !== 'last-council' && room.kind !== 'metropole' && room.kind !== 'traitor-aboard', 'Ce code appartient à un autre jeu.');
  requireThat(!room.game, 'La partie a déjà commencé.');
  requireThat(room.players.length < 10, 'Ce salon est complet.');
  const p = player(name);
  requireThat(!room.players.some(x => x.name.toLowerCase() === p.name.toLowerCase()), 'Ce pseudo est déjà utilisé dans ce salon.');
  room.players.push(p);
  return p;
}
export function authenticate(room, token) {
  const p = room.players.find(x => x.token === token);
  requireThat(p, 'Session introuvable. Rejoins le salon à nouveau.');
  return p;
}
const sizes = { 5: [2,3,2,3,3], 6: [2,3,4,3,4], 7: [2,3,3,4,4], 8: [3,4,4,5,5], 9: [3,4,4,5,5], 10: [3,4,4,5,5] };
export function teamSize(room) { return sizes[room.players.length]?.[room.game?.results.length ?? 0]; }
function finishRound(room) {
  const g = room.game;
  const failures = Object.values(g.missionVotes).filter(v => v === false).length;
  g.results.push({ success: failures === 0, failures, team: [...g.team] });
  const wins = g.results.filter(r => r.success).length;
  if (wins >= 3 || g.results.length - wins >= 3) { g.phase = 'finished'; g.winner = wins >= 3 ? 'agents' : 'ombres'; }
  else nextLeader(room);
}
function nextLeader(room) {
  const g = room.game;
  g.leader = (g.leader + 1) % room.players.length;
  g.phase = 'nomination'; g.team = []; g.votes = {}; g.missionVotes = {};
}
export function act(room, p, action, data = {}) {
  const g = room.game;
  if (action === 'chat') {
    const text = clean(data.text, 400);
    requireThat(text, 'Le message est vide.');
    requireThat(!p.lastMessage || Date.now() - p.lastMessage >= 800, 'Attends un instant avant de renvoyer un message.');
    p.lastMessage = Date.now();
    room.messages.push({ id: randomUUID(), name: p.name, text });
    room.messages = room.messages.slice(-80);
  } else if (action === 'leave') {
    requireThat(!g || g.phase === 'finished', 'Une partie est en cours : reste dans le salon pour la terminer.');
    room.players = room.players.filter(x => x.id !== p.id);
    if (room.host === p.id) room.host = room.players[0]?.id ?? '';
    if (g) room.game = null;
    room.players.forEach(x => { x.ready = false; });
  } else if (action === 'ready') {
    requireThat(!g, 'La partie a déjà commencé.'); p.ready = !p.ready;
  } else if (action === 'start') {
    requireThat(p.id === room.host, 'Seul l’hôte peut lancer la partie.');
    requireThat(!g, 'La partie a déjà commencé.');
    requireThat(room.players.length >= 5 && room.players.every(x => x.ready), 'Il faut au moins 5 joueurs, tous prêts.');
    const ids = room.players.map(x => x.id);
    for (let i = ids.length - 1; i > 0; i--) { const j = randomInt(i + 1); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    const count = room.players.length === 10 ? 4 : room.players.length >= 7 ? 3 : 2;
    room.game = { phase: 'nomination', leader: randomInt(ids.length), spies: ids.slice(0,count), team: [], votes: {}, missionVotes: {}, results: [], rejected: 0, history: [] };
  } else if (action === 'reset') {
    requireThat(p.id === room.host && g?.phase === 'finished', 'La revanche est disponible pour l’hôte après la partie.');
    room.game = null; room.players.forEach(x => { x.ready = false; });
  } else {
    requireThat(g && g.phase !== 'finished', 'Aucune partie en cours.');
    requireThat(data.round === g.results.length && data.rejected === g.rejected, 'La partie a avancé. Réessaie après la synchronisation.');
    if (action === 'nominate') {
      requireThat(g.phase === 'nomination' && room.players[g.leader].id === p.id, 'Seul le capitaine peut proposer une équipe.');
      requireThat(Array.isArray(data.team) && data.team.length === teamSize(room) && new Set(data.team).size === data.team.length && data.team.every(id => room.players.some(x => x.id === id)), 'Sélectionne le bon nombre de joueurs.');
      g.team = [...data.team]; g.phase = 'vote';
    } else if (action === 'vote') {
      requireThat(g.phase === 'vote' && !(p.id in g.votes) && typeof data.approve === 'boolean', 'Vote impossible ou déjà enregistré.');
      g.votes[p.id] = data.approve;
      if (Object.keys(g.votes).length === room.players.length) {
        const approved = Object.values(g.votes).filter(Boolean).length > room.players.length / 2;
        g.history.push({ team: [...g.team], votes: { ...g.votes }, approved });
        if (approved) { g.phase = 'mission'; g.rejected = 0; }
        else { g.rejected++; if (g.rejected >= 5) { g.phase = 'finished'; g.winner = 'ombres'; } else nextLeader(room); }
      }
    } else if (action === 'mission') {
      requireThat(g.phase === 'mission' && g.team.includes(p.id) && !(p.id in g.missionVotes) && typeof data.success === 'boolean', 'Action impossible ou déjà enregistrée.');
      requireThat(data.success || g.spies.includes(p.id), 'Un agent ne peut pas saboter une mission.');
      g.missionVotes[p.id] = data.success;
      if (Object.keys(g.missionVotes).length === g.team.length) finishRound(room);
    } else throw new GameError('Action inconnue.');
  }
  room.updatedAt = Date.now();
}
export function view(room, p) {
  const g = room.game;
  return { code: room.code, host: room.host, me: p.id, players: room.players.map(({ id,name,ready }) => ({ id,name,ready })), messages: room.messages,
    game: g ? { phase: g.phase, leader: room.players[g.leader].id, team: g.team, teamSize: teamSize(room), results: g.results, rejected: g.rejected, history: g.history, winner: g.winner,
      role: g.spies.includes(p.id) ? 'ombre' : 'agent', spies: g.spies.includes(p.id) || g.phase === 'finished' ? g.spies : [],
      voted: Object.keys(g.votes), acted: Object.keys(g.missionVotes), } : null };
}
