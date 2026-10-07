// The same department palette is used by both boards; existing group IDs remain stable.
export const DEPARTMENTS={
  "75": {
    "name": "Paris",
    "color": "#326ebd",
    "colorName": "Bleu foncé",
    "classic": "bleu",
    "network": "bordeaux",
    "cities": [
      "Paris 8e",
      "Paris 16e",
      "Paris 1er",
      "Paris 7e",
      "Paris 6e"
    ]
  },
  "77": {
    "name": "Seine-et-Marne",
    "color": "#956446",
    "colorName": "Marron",
    "classic": "brun",
    "network": "vert-fonce",
    "cities": [
      "Meaux",
      "Melun",
      "Chelles",
      "Fontainebleau"
    ]
  },
  "78": {
    "name": "Yvelines",
    "color": "#e8cb3d",
    "colorName": "Jaune",
    "classic": "jaune",
    "network": "bleu-fonce",
    "cities": [
      "Versailles",
      "Poissy",
      "Mantes-la-Jolie",
      "Sartrouville",
      "Saint-Germain-en-Laye"
    ]
  },
  "91": {
    "name": "Essonne",
    "color": "#ed963b",
    "colorName": "Orange",
    "classic": "orange",
    "network": "rose-pale",
    "cities": [
      "Grigny",
      "Évry",
      "Massy",
      "Corbeil-Essonnes",
      "Palaiseau"
    ]
  },
  "92": {
    "name": "Hauts-de-Seine",
    "color": "#45a776",
    "colorName": "Vert",
    "classic": "vert",
    "network": "magenta",
    "cities": [
      "Nanterre",
      "Courbevoie",
      "Boulogne-Billancourt",
      "Levallois-Perret"
    ]
  },
  "93": {
    "name": "Seine-Saint-Denis",
    "color": "#a8d8ec",
    "colorName": "Bleu clair",
    "classic": "ciel",
    "network": "bleu-pale",
    "cities": [
      "Saint-Denis",
      "Montreuil",
      "Aubervilliers",
      "Pantin",
      "Bobigny"
    ]
  },
  "94": {
    "name": "Val-de-Marne",
    "color": "#df5153",
    "colorName": "Rouge",
    "classic": "rouge",
    "network": "gris",
    "cities": [
      "Créteil",
      "Vitry-sur-Seine",
      "Ivry-sur-Seine",
      "Saint-Maur-des-Fossés",
      "Vincennes"
    ]
  },
  "95": {
    "name": "Val-d’Oise",
    "color": "#dc79b1",
    "colorName": "Rose",
    "classic": "rose",
    "network": "vert-pale",
    "cities": [
      "Cergy",
      "Argenteuil",
      "Sarcelles",
      "Pontoise",
      "Enghien-les-Bains"
    ]
  }
};
export const DEPARTMENT_ORDER=['77','93','95','91','94','78','92','75'];
export function regionalize(nodes,map){for(const code of DEPARTMENT_ORDER){const department=DEPARTMENTS[code];const group=map==='classic'?'classic-'+department.classic:department.network;const properties=nodes.filter(n=>n.type==='property'&&n.group===group);properties.forEach((node,i)=>{const city=department.cities[i];Object.assign(node,{name:city,city,department:code});});}}
export function departmentColors(map){return Object.fromEntries(DEPARTMENT_ORDER.map(code=>{const d=DEPARTMENTS[code];return[map==='classic'?'classic-'+d.classic:d.network,d.color]}));}
