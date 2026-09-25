import { randomBytes, randomInt, randomUUID } from 'node:crypto';

export class TraitorError extends Error {}
const ensure=(condition,message)=>{if(!condition)throw new TraitorError(message)};
const clean=(value,max)=>typeof value==='string'?value.trim().slice(0,max):'';
const makePlayer=(name)=>{name=clean(name,20);ensure(name.length>=2,'Choisis un pseudo de 2 à 20 caractères.');return{id:randomUUID(),token:randomBytes(32).toString('hex'),name,ready:false}};

export function createTraitorRoom(name){const p=makePlayer(name);return{kind:'traitor-aboard',code:randomBytes(4).toString('hex').toUpperCase(),host:p.id,players:[p],messages:[],game:null,updatedAt:Date.now()}}
export function joinTraitorRoom(room,name){ensure(room.kind==='traitor-aboard','Ce code appartient à un autre jeu.');ensure(!room.game,'La mission a déjà commencé.');ensure(room.players.length<10,'Le vaisseau est complet.');const p=makePlayer(name);ensure(!room.players.some(x=>x.name.toLowerCase()===p.name.toLowerCase()),'Ce pseudo est déjà utilisé.');room.players.push(p);return p}
export function authenticateTraitor(room,token){const p=room.players.find(x=>x.token===token);ensure(p,'Session introuvable. Rejoins le vaisseau à nouveau.');return p}

const alive=(room)=>room.players.filter(p=>!room.game.ejected.includes(p.id));
const livingTraitors=(room)=>alive(room).filter(p=>room.game.traitors.includes(p.id));
const livingCrew=(room)=>alive(room).filter(p=>!room.game.traitors.includes(p.id));
function checkWinner(room){const g=room.game;if(g.sabotage>=3||livingTraitors(room).length>=livingCrew(room).length){g.phase='finished';g.winner='traitors';return true}if(g.taskProgress>=g.taskTarget||livingTraitors(room).length===0){g.phase='finished';g.winner='crew';return true}return false}
function finishDutyRound(room){const g=room.game;const choices=Object.values(g.actions);g.taskProgress+=choices.filter(x=>x==='task').length;g.sabotage+=choices.filter(x=>x==='sabotage').length;g.history.push({round:g.round,tasks:choices.filter(x=>x==='task').length,sabotages:choices.filter(x=>x==='sabotage').length,ejected:null});if(!checkWinner(room)){g.phase='meeting';g.votes={}}}
function finishMeeting(room){const g=room.game;const counts={};for(const target of Object.values(g.votes))if(target!=='skip')counts[target]=(counts[target]??0)+1;const ranking=Object.entries(counts).sort((a,b)=>b[1]-a[1]);let ejected=null;if(ranking[0]&&(!ranking[1]||ranking[0][1]>ranking[1][1])){ejected=ranking[0][0];g.ejected.push(ejected)}g.history[g.history.length-1].ejected=ejected;if(!checkWinner(room)){g.round++;g.phase='tasks';g.actions={};g.votes={}}}

export function traitorAct(room,p,action,data={}){const g=room.game;
  if(action==='chat'){const text=clean(data.text,400);ensure(text,'Le message est vide.');ensure(!p.lastMessage||Date.now()-p.lastMessage>=800,'Attends un instant avant de renvoyer un message.');p.lastMessage=Date.now();room.messages.push({id:randomUUID(),name:p.name,text});room.messages=room.messages.slice(-80)}
  else if(action==='leave'){ensure(!g||g.phase==='finished','La mission est en cours.');room.players=room.players.filter(x=>x.id!==p.id);if(room.host===p.id)room.host=room.players[0]?.id??'';if(g)room.game=null;room.players.forEach(x=>x.ready=false)}
  else if(action==='ready'){ensure(!g,'La mission a déjà commencé.');p.ready=!p.ready}
  else if(action==='start'){ensure(p.id===room.host,'Seul le commandant peut lancer la mission.');ensure(!g,'La mission a déjà commencé.');ensure(room.players.length>=4&&room.players.every(x=>x.ready),'Il faut 4 à 10 joueurs, tous prêts.');const ids=room.players.map(x=>x.id);for(let i=ids.length-1;i>0;i--){const j=randomInt(i+1);[ids[i],ids[j]]=[ids[j],ids[i]]}const traitorCount=ids.length>=7?2:1;room.game={phase:'tasks',round:1,traitors:ids.slice(0,traitorCount),ejected:[],actions:{},votes:{},taskProgress:0,taskTarget:(ids.length-traitorCount)*3,sabotage:0,winner:null,history:[]}}
  else if(action==='reset'){ensure(p.id===room.host&&g?.phase==='finished','Seul le commandant peut préparer une nouvelle mission.');room.game=null;room.players.forEach(x=>x.ready=false)}
  else{ensure(g&&g.phase!=='finished','Aucune mission en cours.');ensure(data.round===g.round&&data.phase===g.phase,'La mission a avancé.');ensure(!g.ejected.includes(p.id),'Vous avez été expulsé du vaisseau.');
    if(action==='duty'){ensure(g.phase==='tasks'&&!(p.id in g.actions),'Votre intervention est déjà enregistrée.');ensure(data.choice==='task'||data.choice==='sabotage','Décision invalide.');ensure(data.choice==='task'||g.traitors.includes(p.id),'Seul un traître peut saboter.');g.actions[p.id]=data.choice;if(Object.keys(g.actions).length===alive(room).length)finishDutyRound(room)}
    else if(action==='vote'){ensure(g.phase==='meeting'&&!(p.id in g.votes),'Votre vote est déjà enregistré.');ensure(data.target==='skip'||alive(room).some(x=>x.id===data.target),'Cible invalide.');g.votes[p.id]=data.target;if(Object.keys(g.votes).length===alive(room).length)finishMeeting(room)}
    else throw new TraitorError('Action inconnue.')}
  room.updatedAt=Date.now()}

export function traitorView(room,p){const g=room.game;const base={kind:room.kind,code:room.code,host:room.host,me:p.id,players:room.players.map(({id,name,ready})=>({id,name,ready})),messages:room.messages};if(!g)return{...base,game:null};const isTraitor=g.traitors.includes(p.id);return{...base,game:{phase:g.phase,round:g.round,ejected:g.ejected,taskProgress:g.taskProgress,taskTarget:g.taskTarget,sabotage:g.sabotage,winner:g.winner,history:g.history,acted:Object.keys(g.actions),voted:Object.keys(g.votes),role:isTraitor?'traitor':'crew',traitors:isTraitor||g.phase==='finished'?g.traitors:[]}}}
