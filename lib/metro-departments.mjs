// The same department palette is used by both boards; existing group IDs remain stable.
export const DEPARTMENTS={
  "75": {
    "name": "Paris",
    "color": "#326ebd",
    "colorName": "Bleu foncé",
    "classic": "bleu",
    "network": "bordeaux",
    "districts": [
      [
        "Montmartre",
        "Paris"
      ],
      [
        "Le Marais",
        "Paris"
      ],
      [
        "Quartier Latin",
        "Paris"
      ],
      [
        "Belleville",
        "Paris"
      ],
      [
        "Les Batignolles",
        "Paris"
      ]
    ]
  },
  "77": {
    "name": "Seine-et-Marne",
    "color": "#956446",
    "colorName": "Marron",
    "classic": "brun",
    "network": "vert-fonce",
    "districts": [
      [
        "Saint-Aspais",
        "Melun"
      ],
      [
        "Saint-Ambroise",
        "Melun"
      ],
      [
        "Saint-Étienne",
        "Melun"
      ],
      [
        "Beauval",
        "Meaux"
      ]
    ]
  },
  "78": {
    "name": "Yvelines",
    "color": "#e8cb3d",
    "colorName": "Jaune",
    "classic": "jaune",
    "network": "bleu-fonce",
    "districts": [
      [
        "Notre-Dame",
        "Versailles"
      ],
      [
        "Saint-Louis",
        "Versailles"
      ],
      [
        "Chantiers",
        "Versailles"
      ],
      [
        "Porchefontaine",
        "Versailles"
      ],
      [
        "Clagny-Glatigny",
        "Versailles"
      ]
    ]
  },
  "91": {
    "name": "Essonne",
    "color": "#ed963b",
    "colorName": "Orange",
    "classic": "orange",
    "network": "rose-pale",
    "districts": [
      [
        "Les Pyramides",
        "Évry-Courcouronnes"
      ],
      [
        "Les Aunettes",
        "Évry-Courcouronnes"
      ],
      [
        "Les Épinettes",
        "Évry-Courcouronnes"
      ],
      [
        "Bois Sauvage",
        "Évry-Courcouronnes"
      ],
      [
        "Parc aux Lièvres",
        "Évry-Courcouronnes"
      ]
    ]
  },
  "92": {
    "name": "Hauts-de-Seine",
    "color": "#45a776",
    "colorName": "Vert",
    "classic": "vert",
    "network": "magenta",
    "districts": [
      [
        "Bécon",
        "Courbevoie"
      ],
      [
        "Faubourg de l’Arche",
        "Courbevoie"
      ],
      [
        "Gambetta",
        "Courbevoie"
      ],
      [
        "Cœur-de-Ville",
        "Courbevoie"
      ]
    ]
  },
  "93": {
    "name": "Seine-Saint-Denis",
    "color": "#a8d8ec",
    "colorName": "Bleu clair",
    "classic": "ciel",
    "network": "bleu-pale",
    "districts": [
      [
        "Bas-Montreuil",
        "Montreuil"
      ],
      [
        "Quatre-Chemins",
        "Pantin"
      ],
      [
        "La Noue",
        "Montreuil"
      ],
      [
        "Clos-Français",
        "Montreuil"
      ],
      [
        "La Boissière",
        "Montreuil"
      ]
    ]
  },
  "94": {
    "name": "Val-de-Marne",
    "color": "#df5153",
    "colorName": "Rouge",
    "classic": "rouge",
    "network": "gris",
    "districts": [
      [
        "Adamville",
        "Saint-Maur-des-Fossés"
      ],
      [
        "La Varenne",
        "Saint-Maur-des-Fossés"
      ],
      [
        "Le Vieux Saint-Maur",
        "Saint-Maur-des-Fossés"
      ],
      [
        "Le Parc",
        "Saint-Maur-des-Fossés"
      ],
      [
        "Champignol",
        "Saint-Maur-des-Fossés"
      ]
    ]
  },
  "95": {
    "name": "Val-d’Oise",
    "color": "#dc79b1",
    "colorName": "Rose",
    "classic": "rose",
    "network": "vert-pale",
    "districts": [
      [
        "Grand Centre",
        "Cergy"
      ],
      [
        "Hauts-de-Cergy",
        "Cergy"
      ],
      [
        "Axe Majeur",
        "Cergy"
      ],
      [
        "Horloge",
        "Cergy"
      ],
      [
        "Coteaux",
        "Cergy"
      ]
    ]
  }
};
export const DEPARTMENT_ORDER=['77','93','95','91','94','78','92','75'];
export function regionalize(nodes,map){for(const code of DEPARTMENT_ORDER){const department=DEPARTMENTS[code];const group=map==='classic'?'classic-'+department.classic:department.network;const properties=nodes.filter(n=>n.type==='property'&&n.group===group);properties.forEach((node,i)=>{const [district,city]=department.districts[i];Object.assign(node,{name:district+' ('+code+')',district,city,department:code});});}}
export function departmentColors(map){return Object.fromEntries(DEPARTMENT_ORDER.map(code=>{const d=DEPARTMENTS[code];return[map==='classic'?'classic-'+d.classic:d.network,d.color]}));}
