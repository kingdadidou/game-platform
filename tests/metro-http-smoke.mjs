import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://localhost:3000';
async function call(action,session,fields={}){const response=await fetch(`${base}/api/metro`,{method:'POST',headers:{'Content-Type':'application/json',...(session?{Authorization:`Bearer ${session.token}`}:{})},body:JSON.stringify({action,code:session?.code,...fields})});const data=await response.json();assert.equal(response.status,200,data.error);return data}
const first=await call('create',null,{name:'Urbaniste 1'});const joined=await call('join',null,{code:first.room.code,name:'Urbaniste 2'});const sessions=[{code:first.room.code,token:first.token,id:first.room.me},{code:first.room.code,token:joined.token,id:joined.room.me}];
for(const s of sessions)await call('ready',s);await call('start',sessions[0]);let room=(await call('state',sessions[0])).room;let actions=0,purchases=0;
while(room.game.phase!=='finished'&&actions++<300){const g=room.game;const actor=sessions.find(s=>s.id===g.current);const revision=g.revision;
 if(g.phase==='route'){const station=g.positions[g.current].station;const options=station==='central'?['central-direct','central-nord']:station==='est'?['est-riviera']:station==='sud'?['sud-direct','sud-quais']:['ouest-direct','ouest-jardins'];await call('choose-route',actor,{revision,route:options[actions%options.length]});}
 else if(g.phase==='roll')await call('roll',actor,{revision});
 else if(g.phase==='purchase'){if(g.money[g.current]>=g.pending.price){await call('buy',actor,{revision});purchases++;}else await call('skip',actor,{revision});}
 else if(g.phase==='debt'){const owned=Object.entries(g.owners).find(([,owner])=>owner===g.current);if(owned)await call('sell',actor,{revision,node:owned[0]});else await call('bankrupt',actor,{revision});}
 else throw new Error(`Phase inconnue: ${g.phase}`);
 room=(await call('state',sessions[0])).room;
}
assert.equal(room.game.phase,'finished');assert.ok(room.game.winner);assert.ok(purchases>0);assert.ok(Object.keys(room.game.positions).length===2);
await call('reset',sessions[0]);for(const s of sessions)await call('leave',s);console.log(`HTTP OK: ${actions} actions, ${purchases} achats, 20 jours et victoire de ${room.players.find(p=>p.id===room.game.winner)?.name}.`);
