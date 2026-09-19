export const STATIONS = {
  central: { id:'central', name:'Gare Centrale', x:47, y:28, next:['central-direct','central-nord'] },
  est: { id:'est', name:'Carrefour de l’Est', x:75, y:50, next:['est-riviera'] },
  sud: { id:'sud', name:'Gare du Midi', x:47, y:72, next:['sud-direct','sud-quais'] },
  ouest: { id:'ouest', name:'Carrefour de l’Ouest', x:20, y:50, next:['ouest-direct','ouest-jardins'] },
};
const p=(id,name,x,y,group,price,rent)=>({id,name,x,y,type:'property',group,price,rent});
const f=(id,name,x,y,type)=>({id,name,x,y,type});
export const ROUTES = {
  'central-direct': { name:'Boulevard direct', from:'central', to:'est', nodes:[
    f('cd1','Actualités locales',54,28,'event'),p('cd2','Square Tilleul',61,28,'vert-pale',160,26),p('cd3','Promenade des Serres',68,28,'vert-pale',180,30),p('cd4','Passage Corail',75,34,'rose-pale',200,34),f('cd5','Banque Centrale',75,40,'bank'),p('cd6','Galerie des Fleurs',75,45,'rose-pale',220,38)]},
  'central-nord': { name:'Boucle panoramique', from:'central', to:'est', nodes:[
    p('cn1','Allée des Brumes',47,21,'bleu-pale',120,20),f('cn2','Kiosque du Matin',47,14,'event'),f('cn3','Archives Municipales',54,8,'event'),p('cn4','Jardin des Arts',61,8,'vert-pale',160,26),f('cn5','Manufacture Horizon',68,8,'company'),p('cn6','Parc des Verrières',75,8,'vert-pale',180,30),p('cn7','Domaine des Pins',82,8,'vert-pale',200,34),f('cn8','Tribune Publique',88,14,'event'),p('cn9','Rue des Amandiers',88,21,'rose-pale',200,34),f('cn10','Place du Hasard',88,28,'event'),p('cn11','Avenue Roseraie',88,35,'rose-pale',220,38),f('cn12','Banque du Nord',88,42,'bank')]},
  'est-riviera': { name:'Riviera orientale', from:'est', to:'sud', nodes:[
    f('er1','Journal de l’Est',82,50,'event'),p('er2','Terrasse Pêche',89,50,'rose-pale',200,34),p('er3','Belvédère Saumon',96,50,'rose-pale',220,38),f('er4','Carnaval des Quais',96,57,'event'),p('er5','Boulevard Fuchsia',96,64,'magenta',280,48),f('er6','Ateliers Magnétiques',89,72,'company'),p('er7','Place Framboise',82,72,'magenta',300,54),f('er8','Bourse aux Projets',75,72,'event'),p('er9','Rue Grenadine',68,72,'magenta',320,60),f('er10','Prime municipale',61,72,'salary'),p('er11','Faubourg Rubis',54,72,'bordeaux',350,68)]},
  'sud-direct': { name:'Traverse express', from:'sud', to:'ouest', nodes:[
    p('sd1','Cour des Vignerons',40,72,'bordeaux',350,68),f('sd2','Dépêche du Soir',34,72,'event'),p('sd3','Quai des Grenats',28,72,'bordeaux',380,76),p('sd4','Entrepôts d’Ardoise',22,72,'gris',230,40)]},
  'sud-quais': { name:'Boucle des quais', from:'sud', to:'ouest', nodes:[
    p('sq1','Impasse Carmin',47,79,'bordeaux',350,68),p('sq2','Tour des Vendanges',47,86,'bordeaux',380,76),f('sq3','Inspection Urbaine',40,94,'event'),p('sq4','Docks de Granit',33,94,'gris',230,40),f('sq5','Compagnie des Eaux',26,94,'company'),p('sq6','Halles d’Étain',19,94,'gris',250,44),f('sq7','Marché Nocturne',14,88,'event'),p('sq8','Port Indigo',14,81,'bleu-fonce',260,46),f('sq9','Avis de Travaux',14,74,'event'),p('sq10','Avenue Cobalt',14,67,'bleu-fonce',280,50),f('sq11','Banque des Quais',14,59,'bank')]},
  'ouest-direct': { name:'Axe civique', from:'ouest', to:'central', nodes:[
    f('od1','Chronique Civique',27,50,'event'),p('od2','Esplanade du Ciel',34,50,'bleu-pale',120,20),f('od3','Prime de quartier',40,50,'salary'),p('od4','Rue des Nuages',44,43,'bleu-pale',140,23),f('od5','Conseil de District',47,36,'event')]},
  'ouest-jardins': { name:'Boucle des jardins', from:'ouest', to:'central', nodes:[
    p('oj1','Cours Saphir',13,50,'bleu-fonce',260,46),f('oj2','Fête de Rue',7,50,'event'),p('oj3','Bois du Levant',7,43,'vert-fonce',100,16),f('oj4','Coopérative Locale',7,36,'company'),p('oj5','Clos des Chênes',7,29,'vert-fonce',110,18),p('oj6','Parc des Cèdres',7,22,'vert-fonce',120,20),p('oj7','Jardin de Minuit',14,22,'vert-fonce',130,22),f('oj8','Vide-greniers',22,22,'event'),p('oj9','Promenade Azur',30,22,'bleu-pale',120,20),f('oj10','Prime régionale',38,22,'salary'),p('oj11','Passage des Vents',44,25,'bleu-pale',140,23)]},
};
export const ALL_NODES = Object.values(ROUTES).flatMap(route=>route.nodes);
export const NODE_BY_ID = Object.fromEntries(ALL_NODES.map(node=>[node.id,node]));
export const GROUP_COLORS = {'vert-pale':'#bad7ad','rose-pale':'#f3a4a2',magenta:'#d40867',bordeaux:'#9c1634',gris:'#65717a','bleu-fonce':'#1767dc','vert-fonce':'#187e2a','bleu-pale':'#a8c9f2'};
export const EVENT_CARDS = [
  {text:'La ville finance votre projet culturel. Recevez 140 M.',amount:140},
  {text:'Travaux imprévus sur votre immeuble. Payez 90 M.',amount:-90},
  {text:'Votre quartier remporte un prix. Recevez 100 M.',amount:100},
  {text:'Taxe de mobilité exceptionnelle. Payez 70 M.',amount:-70},
  {text:'Marché local florissant. Recevez 60 M.',amount:60},
  {text:'Contrôle de conformité. Payez 120 M.',amount:-120},
];
