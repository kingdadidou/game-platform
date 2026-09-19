import { randomBytes, randomInt, randomUUID } from 'node:crypto';

export class CouncilError extends Error {}
const ensure = (condition, message) => { if (!condition) throw new CouncilError(message); };
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = randomInt(i + 1); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
};
const conspiratorCount = (count) => count <= 6 ? 2 : count <= 8 ? 3 : 4;
const makeDeck = () => shuffle([...Array(11).fill('autorite'), ...Array(6).fill('republique')]);

function makePlayer(name) {
  name = clean(name, 20);
  ensure(name.length >= 2, 'Choisis un pseudo de 2 à 20 caractères.');
  return { id: randomUUID(), token: randomBytes(32).toString('hex'), name, ready: false, alive: true };
}

export function createCouncilRoom(name) {
  const p = makePlayer(name);
  return { kind: 'last-council', code: randomBytes(4).toString('hex').toUpperCase(), host: p.id, players: [p], messages: [], game: null, updatedAt: Date.now() };
}

export function joinCouncilRoom(room, name) {
  ensure(room.kind === 'last-council', 'Ce code appartient à un autre jeu.');
  ensure(!room.game, 'La séance a déjà commencé.');
  ensure(room.players.length < 10, 'Cette assemblée est complète.');
  const p = makePlayer(name);
  ensure(!room.players.some(x => x.name.toLowerCase() === p.name.toLowerCase()), 'Ce pseudo est déjà utilisé dans cette assemblée.');
  room.players.push(p); return p;
}

export function authenticateCouncil(room, token) {
  const p = room.players.find(x => x.token === token);
  ensure(p, 'Session introuvable. Rejoins l’assemblée à nouveau.'); return p;
}

function alive(room) { return room.players.filter(p => p.alive); }
function president(room) { return alive(room)[room.game.president % alive(room).length]; }
function draw(room, count) {
  const g = room.game;
  if (g.deck.length < count) { g.deck = shuffle([...g.deck, ...g.discard]); g.discard = []; }
  return g.deck.splice(0, count);
}
function nextPresident(room, forcedId) {
  const g = room.game; const active = alive(room);
  if (forcedId) g.president = active.findIndex(p => p.id === forcedId);
  else {
    const current = active.findIndex(p => p.id === g.currentPresident);
    g.president = (current + 1 + active.length) % active.length;
  }
  g.currentPresident = active[g.president].id;
  g.phase = 'nomination'; g.nominee = null; g.votes = {}; g.hand = []; g.vetoRequested = false; g.forcedPresident = false;
}
function finish(room, winner, reason) { room.game.phase = 'finished'; room.game.winner = winner; room.game.reason = reason; room.game.hand = []; }
function authorityPower(count) { return count === 2 ? 'inspect' : count === 3 ? 'special-election' : count === 4 || count === 5 ? 'banish' : null; }
function enact(room, policy, chaos = false) {
  const g = room.game; g.policies[policy]++;
  g.history.push({ type: 'policy', policy, chaos, president: g.currentPresident, speaker: g.nominee });
  g.lastPresident = chaos ? null : g.currentPresident; g.lastSpeaker = chaos ? null : g.nominee; g.failed = 0; g.nominee = null; g.votes = {}; g.hand = [];
  if (g.policies.republique >= 6) return finish(room, 'republique', 'Six décrets républicains ont été adoptés.');
  if (g.policies.autorite >= 6) return finish(room, 'conspiration', 'Six décrets d’autorité ont été adoptés.');
  const power = !chaos && policy === 'autorite' ? authorityPower(g.policies.autorite) : null;
  if (power) { g.phase = 'power'; g.power = power; }
  else { g.power = null; nextPresident(room); }
}

export function councilAct(room, p, action, data = {}) {
  ensure(room.kind === 'last-council', 'Ce salon appartient à un autre jeu.');
  const g = room.game;
  if (action === 'chat') {
    const text = clean(data.text, 400); ensure(text, 'Le message est vide.');
    ensure(!p.lastMessage || Date.now() - p.lastMessage >= 800, 'Attends un instant avant de renvoyer un message.');
    p.lastMessage = Date.now(); room.messages.push({ id: randomUUID(), name: p.name, text }); room.messages = room.messages.slice(-80);
  } else if (action === 'leave') {
    ensure(!g || g.phase === 'finished', 'La séance est en cours : reste dans l’assemblée pour la terminer.');
    room.players = room.players.filter(x => x.id !== p.id); if (room.host === p.id) room.host = room.players[0]?.id ?? '';
    if (g) room.game = null; room.players.forEach(x => { x.ready = false; x.alive = true; });
  } else if (action === 'ready') {
    ensure(!g, 'La séance a déjà commencé.'); p.ready = !p.ready;
  } else if (action === 'start') {
    ensure(p.id === room.host, 'Seul l’hôte peut ouvrir la séance.'); ensure(!g, 'La séance a déjà commencé.');
    ensure(room.players.length >= 5 && room.players.every(x => x.ready), 'Il faut 5 à 10 joueurs, tous prêts.');
    const ids = shuffle(room.players.map(x => x.id)); const traitors = conspiratorCount(ids.length);
    const pretender = ids[0]; const conspirators = ids.slice(0, traitors);
    const first = randomInt(ids.length); room.players.forEach(x => { x.alive = true; });
    room.game = { phase: 'nomination', president: first, currentPresident: room.players[first].id, nominee: null, roles: Object.fromEntries(ids.map((id,i) => [id, i === 0 ? 'pretendant' : i < traitors ? 'conspirateur' : 'gardien'])), conspirators, pretender, votes: {}, policies: { republique: 0, autorite: 0 }, failed: 0, deck: makeDeck(), discard: [], hand: [], history: [], lastPresident: null, lastSpeaker: null, power: null, privateIntel: {}, vetoRequested: false };
  } else if (action === 'reset') {
    ensure(p.id === room.host && g?.phase === 'finished', 'Seul l’hôte peut préparer une nouvelle séance.');
    room.game = null; room.players.forEach(x => { x.ready = false; x.alive = true; });
  } else {
    ensure(g && g.phase !== 'finished', 'Aucune séance en cours.'); ensure(p.alive, 'Vous avez été banni de l’assemblée.');
    ensure(data.revision === g.history.length, 'La séance a avancé. Actualise ton action.');
    const pres = president(room);
    if (action === 'nominate') {
      ensure(g.phase === 'nomination' && pres.id === p.id, 'Seul le Premier Conseiller peut nommer un Orateur.');
      const target = room.players.find(x => x.id === data.player && x.alive);
      ensure(target && target.id !== p.id, 'Choisis un autre membre vivant de l’assemblée.');
      ensure(target.id !== g.lastSpeaker, 'L’Orateur précédent ne peut pas être renommé immédiatement.');
      if (alive(room).length > 5) ensure(target.id !== g.lastPresident, 'Le Premier Conseiller précédent est inéligible ce tour.');
      g.nominee = target.id; g.phase = 'vote'; g.votes = {};
    } else if (action === 'vote') {
      ensure(g.phase === 'vote' && !(p.id in g.votes) && typeof data.approve === 'boolean', 'Vote impossible ou déjà enregistré.');
      g.votes[p.id] = data.approve;
      if (Object.keys(g.votes).length === alive(room).length) {
        const approved = Object.values(g.votes).filter(Boolean).length > alive(room).length / 2;
        g.history.push({ type: 'election', president: g.currentPresident, speaker: g.nominee, approved, votes: { ...g.votes } });
        if (approved) {
          g.failed = 0;
          if (g.policies.autorite >= 3 && g.nominee === g.pretender) finish(room, 'conspiration', 'Le Prétendant a été élu Orateur après trois décrets d’autorité.');
          else { g.phase = 'legislation-president'; g.hand = draw(room, 3); }
        } else {
          g.failed++;
          if (g.failed >= 3) { const [policy] = draw(room, 1); enact(room, policy, true); }
          else nextPresident(room);
        }
      }
    } else if (action === 'discard-president') {
      ensure(g.phase === 'legislation-president' && pres.id === p.id, 'Seul le Premier Conseiller peut écarter ce décret.');
      ensure(Number.isInteger(data.index) && data.index >= 0 && data.index < 3, 'Choisis un décret valide.');
      g.discard.push(g.hand.splice(data.index, 1)[0]); g.phase = 'legislation-speaker';
    } else if (action === 'discard-speaker') {
      ensure(g.phase === 'legislation-speaker' && g.nominee === p.id, 'Seul l’Orateur peut promulguer le décret.');
      ensure(Number.isInteger(data.index) && data.index >= 0 && data.index < 2, 'Choisis un décret valide.');
      g.discard.push(g.hand.splice(data.index, 1)[0]); const [policy] = g.hand; enact(room, policy);
    } else if (action === 'request-veto') {
      ensure(g.phase === 'legislation-speaker' && g.nominee === p.id && g.policies.autorite >= 5, 'Le veto n’est pas disponible.');
      g.vetoRequested = true; g.phase = 'veto';
    } else if (action === 'answer-veto') {
      ensure(g.phase === 'veto' && pres.id === p.id && typeof data.approve === 'boolean', 'Seul le Premier Conseiller répond au veto.');
      if (data.approve) { g.discard.push(...g.hand); g.hand = []; g.lastPresident = g.currentPresident; g.lastSpeaker = g.nominee; g.failed++; if (g.failed >= 3) { const [policy] = draw(room,1); enact(room,policy,true); } else nextPresident(room); }
      else { g.vetoRequested = false; g.phase = 'legislation-speaker'; }
    } else if (action === 'power') {
      ensure(g.phase === 'power' && pres.id === p.id, 'Ce pouvoir appartient au Premier Conseiller.');
      const target = room.players.find(x => x.id === data.player && x.alive && x.id !== p.id); ensure(target, 'Choisis un autre membre vivant.');
      if (g.power === 'inspect') { g.privateIntel[p.id] = { target: target.id, affiliation: g.roles[target.id] === 'gardien' ? 'republique' : 'conspiration' }; g.power = null; nextPresident(room); }
      else if (g.power === 'special-election') { g.power = null; nextPresident(room, target.id); }
      else if (g.power === 'banish') { target.alive = false; g.power = null; if (target.id === g.pretender) finish(room, 'republique', 'Le Prétendant a été démasqué et banni.'); else nextPresident(room); }
      else throw new CouncilError('Pouvoir inconnu.');
    } else throw new CouncilError('Action inconnue.');
  }
  room.updatedAt = Date.now();
}

export function councilView(room, p) {
  const g = room.game;
  const base = { kind: room.kind, code: room.code, host: room.host, me: p.id, players: room.players.map(({ id,name,ready,alive }) => ({ id,name,ready,alive })), messages: room.messages };
  if (!g) return { ...base, game: null };
  const role = g.roles[p.id]; const canKnow = role === 'conspirateur' || (role === 'pretendant' && room.players.length <= 6) || g.phase === 'finished';
  const hand = g.phase === 'legislation-president' && g.currentPresident === p.id || g.phase === 'legislation-speaker' && g.nominee === p.id || g.phase === 'veto' && (g.nominee === p.id || g.currentPresident === p.id) ? g.hand : [];
  return { ...base, game: { phase: g.phase, president: g.currentPresident, nominee: g.nominee, role, knownConspirators: canKnow ? g.conspirators : [], policies: g.policies, failed: g.failed, history: g.history, voted: Object.keys(g.votes), hand, power: g.power, privateIntel: g.privateIntel[p.id] ?? null, winner: g.winner, reason: g.reason, pretender: g.phase === 'finished' ? g.pretender : null, vetoAvailable: g.policies.autorite >= 5 } };
}
