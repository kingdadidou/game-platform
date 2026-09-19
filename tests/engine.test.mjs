import test from 'node:test';
import assert from 'node:assert/strict';
import { createRoom, joinRoom, act, view, authenticate, teamSize } from '../server/engine.mjs';

function setup(n = 5) {
  const room = createRoom('Hôte');
  for (let i = 1; i < n; i++) joinRoom(room, `Joueur ${i}`);
  room.players.forEach(p => act(room, p, 'ready'));
  act(room, room.players[0], 'start');
  return room;
}
function action(room, p, name, args = {}) { act(room, p, name, { round: room.game.results.length, rejected: room.game.rejected, ...args }); }
function nominate(room, team) { action(room, room.players[room.game.leader], 'nominate', { team }); }
function approve(room) { room.players.forEach(p => action(room, p, 'vote', { approve: true })); }
test('identity, room capacity and host controls', () => {
  const room = createRoom('Hôte');
  assert.throws(() => authenticate(room, 'invalid'));
  assert.throws(() => joinRoom(room, 'hôte'));
  assert.throws(() => act(room, room.players[0], 'start'));
  for (let i = 1; i < 10; i++) joinRoom(room, `Joueur ${i}`);
  assert.throws(() => joinRoom(room, 'Complet'));
  assert.throws(() => act(room, room.players[1], 'start'));
});
test('roles stay private and role counts match every player count', () => {
  for (let n = 5; n <= 10; n++) {
    const room = setup(n);
    assert.equal(room.game.spies.length, n === 10 ? 4 : n >= 7 ? 3 : 2);
    for (const p of room.players) {
      const v = view(room, p);
      assert.ok(v.players.every(x => !('token' in x)));
      assert.equal(v.game.spies.length, room.game.spies.includes(p.id) ? room.game.spies.length : 0);
      assert.ok(!('missionVotes' in v.game));
    }
  }
});
test('three successes win, then host may reset', () => {
  const room = setup();
  for (let i = 0; i < 3; i++) {
    const team = room.players.slice(0, teamSize(room));
    nominate(room, team.map(p => p.id)); approve(room);
    team.forEach(p => action(room, p, 'mission', { success: true }));
  }
  assert.equal(room.game.winner, 'agents');
  assert.equal(room.game.phase, 'finished');
  assert.throws(() => act(room, room.players[1], 'reset'));
  act(room, room.players[0], 'reset'); assert.equal(room.game, null);
  assert.ok(room.players.every(p => !p.ready));
});
test('agents cannot sabotage; secret decisions stay private; three failures win', () => {
  const room = setup();
  const spy = room.players.find(p => room.game.spies.includes(p.id));
  const agent = room.players.find(p => !room.game.spies.includes(p.id));
  for (let i = 0; i < 3; i++) {
    const team = [spy, agent, ...room.players.filter(p => p !== spy && p !== agent)].slice(0, teamSize(room));
    nominate(room, team.map(p => p.id)); approve(room);
    assert.throws(() => action(room, agent, 'mission', { success: false }));
    action(room, spy, 'mission', { success: false });
    assert.ok(!JSON.stringify(view(room, agent)).includes('missionVotes'));
    team.filter(p => p !== spy).forEach(p => action(room, p, 'mission', { success: true }));
  }
  assert.equal(room.game.winner, 'ombres');
  assert.equal(view(room, agent).game.spies.length, 2);
});
test('five rejections win; ties reject and duplicate votes are blocked', () => {
  const room = setup(6);
  for (let i = 0; i < 5; i++) {
    nominate(room, room.players.slice(0, teamSize(room)).map(p => p.id));
    action(room, room.players[0], 'vote', { approve: true });
    assert.throws(() => action(room, room.players[0], 'vote', { approve: true }));
    assert.ok(!('votes' in view(room, room.players[1]).game));
    room.players.slice(1).forEach((p,j) => action(room, p, 'vote', { approve: j < 2 }));
  }
  assert.equal(room.game.winner, 'ombres'); assert.equal(room.game.rejected, 5);
});
test('invalid teams, stale actions and joining or leaving midgame are blocked', () => {
  const room = setup();
  assert.throws(() => nominate(room, [room.players[0].id, room.players[0].id]));
  assert.throws(() => nominate(room, ['unknown', room.players[0].id]));
  assert.throws(() => act(room, room.players[0], 'leave'));
  assert.throws(() => joinRoom(room, 'Retardataire'));
  assert.throws(() => act(room, room.players[room.game.leader], 'nominate', { round: 42, rejected: 0, team: room.players.slice(0,2).map(p => p.id) }));
});
test('host departure transfers ownership; blank messages are rejected', () => {
  const room = createRoom('Hôte'); const p = joinRoom(room, 'Ami');
  act(room, room.players[0], 'leave'); assert.equal(room.host, p.id);
  assert.throws(() => act(room, p, 'chat', { text: '  ' }));
  act(room, p, 'chat', { text: '<script>hello</script>' }); assert.equal(room.messages[0].text, '<script>hello</script>');
});
