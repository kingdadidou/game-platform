import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateCouncil, councilAct, councilView, createCouncilRoom, joinCouncilRoom } from '../server/council-engine.mjs';

function setup(count=5){const room=createCouncilRoom('Joueur 1');for(let i=2;i<=count;i++)joinCouncilRoom(room,`Joueur ${i}`);for(const p of room.players)councilAct(room,p,'ready');councilAct(room,room.players[0],'start');return room;}
function act(room,p,action,data={}){councilAct(room,p,action,{revision:room.game?.history.length??0,...data});}
function pres(room){return room.players.find(p=>p.id===room.game.currentPresident);}
function elect(room,nominee){act(room,pres(room),'nominate',{player:nominee.id});for(const p of room.players.filter(p=>p.alive))act(room,p,'vote',{approve:true});}

test('creates 5-10 player rooms with private roles',()=>{for(let n=5;n<=10;n++){const room=setup(n);const roles=Object.values(room.game.roles);assert.equal(roles.filter(r=>r==='pretendant').length,1);assert.equal(roles.filter(r=>r!=='gardien').length,n<=6?2:n<=8?3:4);for(const p of room.players){const v=councilView(room,p);assert.ok(!('roles' in v.game));assert.ok(!('token' in v.players[0]));if(v.game.role==='gardien')assert.equal(v.game.knownConspirators.length,0);}}});

test('election and two-step legislation keep hands private',()=>{const room=setup();const nominee=room.players.find(p=>p.id!==room.game.currentPresident);elect(room,nominee);assert.equal(room.game.phase,'legislation-president');assert.equal(councilView(room,pres(room)).game.hand.length,3);assert.equal(councilView(room,nominee).game.hand.length,0);act(room,pres(room),'discard-president',{index:0});assert.equal(councilView(room,pres(room)).game.hand.length,0);assert.equal(councilView(room,nominee).game.hand.length,2);act(room,nominee,'discard-speaker',{index:0});assert.equal(room.game.policies.republique+room.game.policies.autorite,1);assert.equal(room.game.phase==='nomination'||room.game.phase==='power',true);});

test('pretender election after three authority decrees wins',()=>{const room=setup();room.game.policies.autorite=3;const target=room.players.find(p=>p.id===room.game.pretender);if(target.id===room.game.currentPresident){room.game.president=(room.game.president+1)%room.players.length;room.game.currentPresident=room.players[room.game.president].id;}elect(room,target);assert.equal(room.game.winner,'conspiration');assert.equal(room.game.phase,'finished');});

test('banishing pretender gives republic victory',()=>{const room=setup();const target=room.players.find(p=>p.id===room.game.pretender);if(target.id===room.game.currentPresident){room.game.president=(room.game.president+1)%room.players.length;room.game.currentPresident=room.players[room.game.president].id;}room.game.phase='power';room.game.power='banish';act(room,pres(room),'power',{player:target.id});assert.equal(room.game.winner,'republique');});

test('three rejected governments enact the top decree',()=>{const room=setup();const before=room.game.deck.length;for(let round=0;round<3;round++){const nominee=room.players.find(p=>p.alive&&p.id!==room.game.currentPresident&&p.id!==room.game.lastSpeaker);act(room,pres(room),'nominate',{player:nominee.id});for(const p of room.players.filter(p=>p.alive))act(room,p,'vote',{approve:false});}assert.equal(room.game.policies.republique+room.game.policies.autorite,1);assert.equal(room.game.deck.length,before-1);assert.ok(room.game.history.some(h=>h.type==='policy'&&h.chaos));});

test('invalid identities, duplicate votes and cross-game rooms are rejected',()=>{const room=setup();assert.throws(()=>authenticateCouncil(room,'bad'));const nominee=room.players.find(p=>p.id!==room.game.currentPresident);act(room,pres(room),'nominate',{player:nominee.id});act(room,room.players[0],'vote',{approve:true});assert.throws(()=>act(room,room.players[0],'vote',{approve:true}));assert.throws(()=>joinCouncilRoom({...room,kind:'shadows'},'Intrus'));});

test('pretender knows allies only in small assemblies and public counters preserve deck secrecy',()=>{
  for(const count of [5,6,7,10]){
    const room=setup(count);
    const pretender=room.players.find(p=>p.id===room.game.pretender);
    const view=councilView(room,pretender).game;
    assert.equal(view.knownConspirators.length,count<=6?room.game.conspirators.length:0);
    assert.equal(view.deckCount,17);
    assert.equal(view.discardCount,0);
    assert.ok(!('deck' in view));
    assert.ok(!('discard' in view));
    const speaker=room.players.find(p=>p.id!==room.game.currentPresident);
    elect(room,speaker);
    const election=councilView(room,pretender).game.history.at(-1);
    assert.equal(Object.keys(election.votes).length,count);
    assert.ok(Object.values(election.votes).every(v=>v===true));
    assert.equal(councilView(room,pretender).game.deckCount,14);
    act(room,pres(room),'discard-president',{index:0});
    assert.equal(councilView(room,pretender).game.discardCount,1);
  }
});