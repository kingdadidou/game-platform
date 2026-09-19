import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://localhost:3000';
async function call(action,session,fields={}){const response=await fetch(`${base}/api/council`,{method:'POST',headers:{'Content-Type':'application/json',...(session?{Authorization:`Bearer ${session.token}`}:{})},body:JSON.stringify({action,code:session?.code,...fields})});const data=await response.json();assert.equal(response.status,200,data.error);return data;}
const first=await call('create',null,{name:'Délégué 1'});const sessions=[{code:first.room.code,token:first.token,id:first.room.me}];
for(let i=2;i<=5;i++){const joined=await call('join',null,{code:first.room.code,name:`Délégué ${i}`});sessions.push({code:first.room.code,token:joined.token,id:joined.room.me});}
for(const s of sessions)await call('ready',s);await call('start',sessions[0]);
const roles=new Map();for(const s of sessions)roles.set(s.id,(await call('state',s)).room.game.role);const pretender=[...roles].find(([,role])=>role==='pretendant')[0];
let room=(await call('state',sessions[0])).room;let safety=0;
while(room.game.phase!=='finished'&&safety++<100){const g=room.game;const alive=room.players.filter(p=>p.alive);const revision=g.history.length;const byId=id=>sessions.find(s=>s.id===id);
 if(g.phase==='nomination'){const last=[...g.history].reverse().find(h=>h.type==='election');const nominee=alive.find(p=>p.id!==g.president&&p.id!==pretender&&p.id!==last?.speaker&&(alive.length<=5||p.id!==last?.president))||alive.find(p=>p.id!==g.president&&p.id!==pretender);await call('nominate',byId(g.president),{revision,player:nominee.id});}
 else if(g.phase==='vote'){for(const p of alive)await call('vote',byId(p.id),{revision,approve:true});}
 else if(g.phase==='legislation-president')await call('discard-president',byId(g.president),{revision,index:0});
 else if(g.phase==='legislation-speaker')await call('discard-speaker',byId(g.nominee),{revision,index:0});
 else if(g.phase==='power'){const target=g.power==='banish'&&alive.length<=4?alive.find(p=>p.id===pretender):alive.find(p=>p.id!==g.president&&p.id!==pretender)||alive.find(p=>p.id!==g.president);await call('power',byId(g.president),{revision,player:target.id});}
 else throw new Error(`Phase imprévue: ${g.phase}`);
 room=(await call('state',sessions[0])).room;
}
assert.equal(room.game.phase,'finished');assert.ok(['republique','conspiration'].includes(room.game.winner));assert.ok(room.game.history.some(h=>h.type==='policy'));
await call('reset',sessions[0]);for(const s of sessions)await call('leave',s);
console.log(`HTTP OK: 5 joueurs, rôles, gouvernements, décrets, pouvoirs et victoire ${room.game.winner}.`);
