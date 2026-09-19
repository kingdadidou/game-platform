import assert from 'node:assert/strict';
const base = process.env.TEST_URL || 'http://localhost:3000';
async function call(action, session, fields = {}) {
  const response = await fetch(`${base}/api/rooms`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: `Bearer ${session.token}` } : {}) }, body: JSON.stringify({ action, code: session?.code, ...fields }) });
  const data = await response.json();
  assert.equal(response.status, 200, data.error);
  return data;
}
const first = await call('create', null, { name: 'HTTP 1' });
const code = first.room.code;
const sessions = [{ code, token: first.token, id: first.room.me }];
for (let i = 2; i <= 5; i++) {
  const joined = await call('join', null, { code, name: `HTTP ${i}` });
  sessions.push({ code, token: joined.token, id: joined.room.me });
}
await Promise.all(sessions.map(s => call('ready', s)));
await call('chat', sessions[0], { text: 'Test de synchronisation' });
assert.equal((await call('state', sessions[4])).room.messages[0].text, 'Test de synchronisation');
let { room } = await call('start', sessions[0]);
for (let i = 0; i < 3; i++) {
  const g = room.game;
  const team = sessions.slice(0, g.teamSize);
  const revision = { round: g.results.length, rejected: g.rejected };
  await call('nominate', sessions.find(s => s.id === g.leader), { ...revision, team: team.map(s => s.id) });
  await Promise.all(sessions.map(s => call('vote', s, { ...revision, approve: true })));
  const inMission = (await call('state', sessions[0])).room;
  assert.equal(inMission.game.phase, 'mission');
  assert.ok(!('missionVotes' in inMission.game));
  await Promise.all(team.map(s => call('mission', s, { ...revision, success: true })));
  room = (await call('state', sessions[0])).room;
}
assert.equal(room.game.phase, 'finished'); assert.equal(room.game.winner, 'agents');
await call('reset', sessions[0]);
for (const s of sessions) await call('leave', s);
console.log('HTTP OK: 5 sessions, concurrent joins/readiness/votes, chat, 3 missions, victory, rematch and cleanup.');
