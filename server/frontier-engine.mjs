import { randomBytes, randomInt, randomUUID } from 'node:crypto';
import { FRONTIER_REGIONS, FRONTIER_REGION_BY_ID } from '../lib/frontier-map.mjs';

export class FrontierError extends Error {}

const ensure = (condition, message) => { if (!condition) throw new FrontierError(message); };
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const shuffle = (items) => { for (let i = items.length - 1; i > 0; i -= 1) { const j = randomInt(i + 1); [items[i], items[j]] = [items[j], items[i]]; } return items; };
const makePlayer = (name) => { name = clean(name, 20); ensure(name.length >= 2, 'Choisis un pseudo de 2 à 20 caractères.'); return { id: randomUUID(), token: randomBytes(32).toString('hex'), name, ready: false }; };
const score = (g, id) => Object.values(g.owners).filter(owner => owner === id).length * 10 + g.supply[id] + Object.entries(g.armies).reduce((sum, [region, army]) => sum + (g.owners[region] === id ? army : 0), 0);

export function createFrontierRoom(name) {
  const player = makePlayer(name);
  return { kind: 'frontier-express', code: randomBytes(4).toString('hex').toUpperCase(), host: player.id, players: [player], messages: [], game: null, updatedAt: Date.now() };
}

export function joinFrontierRoom(room, name) {
  ensure(room.kind === 'frontier-express', 'Ce code appartient à un autre jeu.');
  ensure(!room.game, 'La campagne a déjà commencé.');
  ensure(room.players.length < 6, 'La carte est complète.');
  const player = makePlayer(name);
  ensure(!room.players.some(item => item.name.toLowerCase() === player.name.toLowerCase()), 'Ce pseudo est déjà utilisé.');
  room.players.push(player);
  return player;
}

export function authenticateFrontier(room, token) {
  const player = room.players.find(item => item.token === token);
  ensure(player, 'Session introuvable. Rejoins la campagne à nouveau.');
  return player;
}

function finish(room, winner, reason) {
  room.game.phase = 'finished';
  room.game.winner = winner;
  room.game.reason = reason;
  room.game.locked = [];
}

function chooseWinner(room, reason) {
  const ranked = room.players.slice().sort((a, b) => score(room.game, b.id) - score(room.game, a.id));
  finish(room, ranked[0].id, reason);
}

function resolveRound(room) {
  const g = room.game;
  const names = Object.fromEntries(room.players.map(player => [player.id, player.name]));
  const roundLog = [];

  for (const playerId of g.initiative) {
    for (const order of g.orders[playerId].filter(item => item.type === 'recruit')) {
      if (g.owners[order.region] !== playerId || g.supply[playerId] < order.amount) continue;
      g.supply[playerId] -= order.amount;
      g.armies[order.region] += order.amount;
      roundLog.push(`${names[playerId]} recrute ${order.amount} unité(s) à ${FRONTIER_REGION_BY_ID[order.region].name}.`);
    }
  }

  for (const playerId of g.initiative) {
    for (const order of g.orders[playerId].filter(item => item.type === 'move')) {
      if (g.owners[order.from] !== playerId) continue;
      const amount = Math.min(order.amount, Math.max(0, g.armies[order.from] - 1));
      if (!amount) continue;
      g.armies[order.from] -= amount;
      if (g.owners[order.to] === playerId) {
        g.armies[order.to] += amount;
        roundLog.push(`${names[playerId]} renforce ${FRONTIER_REGION_BY_ID[order.to].name}.`);
        continue;
      }
      const defender = g.armies[order.to];
      if (amount > defender) {
        const previous = g.owners[order.to];
        g.owners[order.to] = playerId;
        g.armies[order.to] = amount - defender;
        roundLog.push(`${names[playerId]} prend ${FRONTIER_REGION_BY_ID[order.to].name}${previous ? ` à ${names[previous]}` : ''}.`);
      } else {
        g.armies[order.to] = Math.max(1, defender - amount);
        roundLog.push(`${names[playerId]} échoue devant ${FRONTIER_REGION_BY_ID[order.to].name}.`);
      }
    }
  }

  g.log = [...roundLog, ...g.log].slice(0, 40);
  const majority = Math.floor(FRONTIER_REGIONS.length / 2) + 1;
  const dominant = room.players.find(player => Object.values(g.owners).filter(owner => owner === player.id).length >= majority);
  if (dominant) { finish(room, dominant.id, `${dominant.name} contrôle la majorité de la carte.`); return; }
  if (g.round >= g.maxRounds) { chooseWinner(room, 'La huitième manche est terminée : le meilleur score stratégique l’emporte.'); return; }

  g.round += 1;
  g.initiative.push(g.initiative.shift());
  for (const player of room.players) {
    const territories = Object.values(g.owners).filter(owner => owner === player.id).length;
    const capitalBonus = g.owners[g.capitals[player.id]] === player.id ? 2 : 0;
    g.supply[player.id] = Math.min(18, g.supply[player.id] + territories + capitalBonus);
    g.orders[player.id] = [];
  }
  g.locked = [];
}

export function frontierAct(room, player, action, data = {}) {
  const g = room.game;
  if (action === 'chat') {
    const text = clean(data.text, 400);
    ensure(text, 'Le message est vide.');
    ensure(!player.lastMessage || Date.now() - player.lastMessage >= 800, 'Attends un instant avant de renvoyer un message.');
    player.lastMessage = Date.now();
    room.messages.push({ id: randomUUID(), name: player.name, text });
    room.messages = room.messages.slice(-80);
  } else if (action === 'leave') {
    ensure(!g || g.phase === 'finished', 'La campagne est en cours.');
    room.players = room.players.filter(item => item.id !== player.id);
    if (room.host === player.id) room.host = room.players[0]?.id ?? '';
    if (g) room.game = null;
    room.players.forEach(item => { item.ready = false; });
  } else if (action === 'ready') {
    ensure(!g, 'La campagne a déjà commencé.');
    player.ready = !player.ready;
  } else if (action === 'start') {
    ensure(player.id === room.host, 'Seul l’hôte peut lancer la campagne.');
    ensure(!g, 'La campagne a déjà commencé.');
    ensure(room.players.length >= 2 && room.players.length <= 6 && room.players.every(item => item.ready), 'Il faut 2 à 6 joueurs, tous prêts.');
    const ids = shuffle(room.players.map(item => item.id));
    const owners = Object.fromEntries(FRONTIER_REGIONS.map(region => [region.id, null]));
    const armies = Object.fromEntries(FRONTIER_REGIONS.map(region => [region.id, 2]));
    const capitals = {};
    ids.forEach((id, index) => {
      const capitalIndex = Math.floor(index * FRONTIER_REGIONS.length / ids.length);
      const capital = FRONTIER_REGIONS[capitalIndex];
      capitals[id] = capital.id;
      owners[capital.id] = id;
      armies[capital.id] = 4;
    });
    ids.forEach(id => {
      const second = FRONTIER_REGION_BY_ID[capitals[id]].links.find(region => !owners[region]);
      if (second) { owners[second] = id; armies[second] = 3; }
    });
    room.game = {
      phase: 'planning', round: 1, maxRounds: 8, initiative: ids, capitals, owners, armies,
      supply: Object.fromEntries(ids.map(id => [id, 6])), orders: Object.fromEntries(ids.map(id => [id, []])),
      locked: [], log: ['Les frontières sont tracées. La première manche commence.'], winner: null, reason: null
    };
  } else if (action === 'reset') {
    ensure(player.id === room.host && g?.phase === 'finished', 'Seul l’hôte peut préparer une nouvelle campagne.');
    room.game = null;
    room.players.forEach(item => { item.ready = false; });
  } else {
    ensure(g?.phase === 'planning', 'Aucune planification en cours.');
    ensure(Number(data.round) === g.round, 'La manche a déjà avancé.');
    ensure(!g.locked.includes(player.id), 'Vos ordres sont déjà confirmés.');
    const orders = g.orders[player.id];
    if (action === 'move') {
      const from = clean(data.from, 20), to = clean(data.to, 20), amount = Number(data.amount);
      ensure(orders.length < 2, 'Vous avez déjà préparé deux ordres.');
      ensure(g.owners[from] === player.id, 'Cette région ne vous appartient pas.');
      ensure(FRONTIER_REGION_BY_ID[from]?.links.includes(to), 'Ces régions ne sont pas voisines.');
      ensure(Number.isInteger(amount) && amount >= 1 && amount <= 9, 'Nombre d’unités invalide.');
      const committed = orders.filter(item => item.type === 'move' && item.from === from).reduce((sum, item) => sum + item.amount, 0);
      ensure(committed + amount < g.armies[from], 'Il faut laisser au moins une unité en défense.');
      orders.push({ id: randomUUID(), type: 'move', from, to, amount });
    } else if (action === 'recruit') {
      const region = clean(data.region, 20), amount = Number(data.amount);
      ensure(orders.length < 2, 'Vous avez déjà préparé deux ordres.');
      ensure(g.owners[region] === player.id, 'Vous ne pouvez recruter que sur votre territoire.');
      ensure(Number.isInteger(amount) && amount >= 1 && amount <= 3, 'Recrutez entre 1 et 3 unités.');
      const committed = orders.filter(item => item.type === 'recruit').reduce((sum, item) => sum + item.amount, 0);
      ensure(committed + amount <= g.supply[player.id], 'Ravitaillement insuffisant.');
      orders.push({ id: randomUUID(), type: 'recruit', region, amount });
    } else if (action === 'cancel') {
      const index = orders.findIndex(item => item.id === data.orderId);
      ensure(index >= 0, 'Ordre introuvable.');
      orders.splice(index, 1);
    } else if (action === 'lock') {
      g.locked.push(player.id);
      if (g.locked.length === room.players.length) resolveRound(room);
    } else throw new FrontierError('Action inconnue.');
  }
  room.updatedAt = Date.now();
}

export function frontierView(room, player) {
  const base = { kind: room.kind, code: room.code, host: room.host, me: player.id, players: room.players.map(({ id, name, ready }) => ({ id, name, ready })), messages: room.messages };
  if (!room.game) return { ...base, game: null };
  const g = room.game;
  return { ...base, game: { phase: g.phase, round: g.round, maxRounds: g.maxRounds, initiative: g.initiative, capitals: g.capitals, owners: g.owners, armies: g.armies, supply: g.supply, myOrders: g.orders[player.id], orderCounts: Object.fromEntries(room.players.map(item => [item.id, g.orders[item.id].length])), locked: g.locked, log: g.log, winner: g.winner, reason: g.reason, scores: Object.fromEntries(room.players.map(item => [item.id, score(g, item.id)])) } };
}
