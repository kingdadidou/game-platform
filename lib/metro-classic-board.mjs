// A single clockwise circuit, starting in the upper-left corner.
const property=(name,group,price,rent)=>({name,type:'property',group:'classic-'+group,price,rent});
const special=(name,type,extra={})=>({name,type,...extra});
const station=name=>special(name,'station',{price:200,rent:25});
const entries=[
 special('Départ · Salaire','salary'),property('Rue des Tilleuls','brun',60,2),special('Caisse municipale','event'),property('Rue des Peupliers','brun',60,4),special('Impôt sur le revenu','tax',{amount:200}),station('Gare du Nord'),property('Rue des Nuages','ciel',100,6),special('Chance','event'),property('Rue des Brumes','ciel',100,6),property('Avenue du Ciel','ciel',120,8),
 special('Place des visiteurs','rest'),property('Boulevard des Roses','rose',140,10),special('Compagnie électrique','company',{price:150,rent:30}),property('Avenue des Lilas','rose',140,10),property('Place des Orchidées','rose',160,12),station('Gare de l’Est'),property('Rue du Soleil','orange',180,14),special('Caisse municipale','event'),property('Avenue des Orangers','orange',180,14),property('Place de l’Aurore','orange',200,16),
 special('Parking gratuit','rest'),property('Boulevard des Cerises','rouge',220,18),special('Chance','event'),property('Avenue des Coquelicots','rouge',220,18),property('Place du Rubis','rouge',240,20),station('Gare du Sud'),property('Rue des Épis','jaune',260,22),property('Avenue de l’Or','jaune',260,22),special('Compagnie des eaux','company',{price:150,rent:30}),property('Place du Safran','jaune',280,24),
 special('Café des affaires','rest'),property('Avenue des Cèdres','vert',300,26),property('Boulevard des Pins','vert',300,26),special('Caisse municipale','event'),property('Place Émeraude','vert',320,28),station('Gare de l’Ouest'),special('Chance','event'),property('Avenue Royale','bleu',350,35),special('Taxe de luxe','tax',{amount:100}),property('Place Impériale','bleu',400,50)
];
export const UNIQUE_NODES=entries.map((node,i)=>{const side=Math.floor(i/10),offset=i%10;const [x,y]=side===0?[5+offset*9,7]:side===1?[95,7+offset*8.6]:side===2?[95-offset*9,93]:[5,93-offset*8.6];return {...node,id:'classic-'+i,x,y};});
export const NODE_BY_ID=Object.fromEntries(UNIQUE_NODES.map(n=>[n.id,n]));
export const STATIONS={};
export const ROUTES={'classic-loop':{name:'Circuit classique',from:'classic-0',to:'classic-0',nodes:UNIQUE_NODES}};
export const GROUP_COLORS={'classic-brun':'#956446','classic-ciel':'#a8d8ec','classic-rose':'#dc79b1','classic-orange':'#ed963b','classic-rouge':'#df5153','classic-jaune':'#e8cb3d','classic-vert':'#45a776','classic-bleu':'#326ebd'};
