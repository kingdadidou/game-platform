/*
 * ============================================================
 * MÉTROPOLE — PLATEAU
 * ============================================================
 *
 * 5 rectangles :
 *
 *                    ┌──────────────┐
 *                    │     NORD     │
 *                    └──────●───────┘
 *                           │
 * ┌────────────────┐  ┌─────●───────────────────┐
 * │                │  │                         │
 * │     OUEST      ●──┤       PRINCIPAL         ●───────┐
 * │                │  │                         │       │
 * └────────────────┘  │                         │  EST  │
 *                     │                         │       │
 *                     └───────●─────────────────┴───────┘
 *                             │
 *                     ┌───────●──────┐
 *                     │      SUD     │
 *                     │              │
 *                     └──────────────┘
 *
 * Circulation : sens horaire.
 */


/* ============================================================
   STATIONS
   ============================================================ */

export const STATIONS = {

  central: {
    id: 'central',
    name: 'Gare Centrale',
    x: 45,
    y: 25,
    next: [
      'central-direct',
      'central-nord'
    ]
  },

  est: {
    id: 'est',
    name: 'Carrefour de l’Est',
    x: 65,
    y: 45,
    next: [
      'est-riviera'
    ]
  },

  sud: {
    id: 'sud',
    name: 'Gare du Midi',
    x: 45,
    y: 65,
    next: [
      'sud-direct',
      'sud-quais'
    ]
  },

  ouest: {
    id: 'ouest',
    name: 'Carrefour de l’Ouest',
    x: 25,
    y: 45,
    next: [
      'ouest-direct',
      'ouest-jardins'
    ]
  }

};


/* ============================================================
   HELPERS
   ============================================================ */

const p = (
  id,
  name,
  x,
  y,
  group,
  price,
  rent
) => ({
  id,
  name,
  x,
  y,
  type: 'property',
  group,
  price,
  rent
});


const f = (
  id,
  name,
  x,
  y,
  type
) => ({
  id,
  name,
  x,
  y,
  type
});


/* ============================================================
   ROUTES
   ============================================================ */

export const ROUTES = {


  /* ==========================================================
     PRINCIPAL — HAUT + DROITE

     Gare Centrale
          →
          → → → →
                ↓
                ↓
          Carrefour Est
     ========================================================== */

  'central-direct': {

    name: 'Boulevard direct',

    from: 'central',
    to: 'est',

    nodes: [

      f(
        'cd1',
        'Actualités locales',
        50,
        25,
        'event'
      ),

      p(
        'cd2',
        'Square Tilleul',
        55,
        25,
        'vert-pale',
        160,
        26
      ),

      p(
        'cd3',
        'Promenade des Serres',
        60,
        25,
        'vert-pale',
        180,
        30
      ),

      p(
        'cd4',
        'Passage Corail',
        65,
        25,
        'rose-pale',
        200,
        34
      ),

      f(
        'cd5',
        'Place du Hasard',
        65,
        32,
        'event'
      ),

      p(
        'cd6',
        'Galerie des Fleurs',
        65,
        38,
        'rose-pale',
        220,
        38
      )

    ]
  },


  /* ==========================================================
     NORD

             → → → →
             ↑     ↓
             ↑     ↓
             ●     ↓

     Puis retour vers Carrefour Est par le côté droit
     du rectangle principal.
     ========================================================== */

  'central-nord': {

    name: 'Boucle panoramique',

    from: 'central',
    to: 'est',

    nodes: [

      /* CÔTÉ GAUCHE — MONTE */

      p(
        'cn1',
        'Allée des Brumes',
        45,
        19,
        'bleu-pale',
        120,
        20
      ),

      f(
        'cn2',
        'Kiosque du Matin',
        45,
        13,
        'event'
      ),

      f(
        'cn3',
        'Archives Municipales',
        45,
        7,
        'event'
      ),


      /* HAUT — VA VERS LA DROITE */

      p(
        'cn4',
        'Jardin des Arts',
        50,
        7,
        'vert-pale',
        160,
        26
      ),

      f(
        'cn5',
        'Manufacture Horizon',
        55,
        7,
        'company'
      ),

      p(
        'cn6',
        'Parc des Verrières',
        60,
        7,
        'vert-pale',
        180,
        30
      ),

      p(
        'cn7',
        'Domaine des Pins',
        65,
        7,
        'vert-pale',
        200,
        34
      ),


      /* CÔTÉ DROIT — DESCEND */

      f(
        'cn8',
        'Tribune Publique',
        65,
        13,
        'event'
      ),

      p(
        'cn9',
        'Rue des Amandiers',
        65,
        19,
        'rose-pale',
        200,
        34
      ),

      f(
        'cn10',
        'Place du Hasard',
        65,
        25,
        'event'
      ),

      p(
        'cn11',
        'Avenue Roseraie',
        65,
        32,
        'rose-pale',
        220,
        38
      ),

      f(
        'cn12',
        'Banque du Nord',
        65,
        38,
        'bank'
      )

    ]
  },


  /* ==========================================================
     EST

     Carrefour Est
          ● → → → →
                  ↓
                  ↓
            ← ← ← ←

     IMPORTANT :
     ce rectangle ne descend jamais dans le rectangle SUD.
     ========================================================== */

  'est-riviera': {

    name: 'Riviera orientale',

    from: 'est',
    to: 'sud',

    nodes: [

      /* HAUT — DROITE */

      f(
        'er1',
        'Journal de l’Est',
        71,
        45,
        'event'
      ),

      p(
        'er2',
        'Terrasse Pêche',
        77,
        45,
        'rose-pale',
        200,
        34
      ),

      p(
        'er3',
        'Belvédère Saumon',
        83,
        45,
        'rose-pale',
        220,
        38
      ),

      f(
        'er4',
        'Carnaval des Quais',
        90,
        45,
        'event'
      ),


      /* DROITE — DESCEND */

      p(
        'er5',
        'Boulevard Fuchsia',
        90,
        52,
        'magenta',
        280,
        48
      ),

      f(
        'er6',
        'Ateliers Magnétiques',
        90,
        58,
        'company'
      ),

      p(
        'er7',
        'Place Framboise',
        90,
        65,
        'magenta',
        300,
        54
      ),


      /* BAS — GAUCHE */

      p(
        'er8',
        'Rue Grenadine',
        84,
        65,
        'magenta',
        320,
        60
      ),

      f(
        'er9',
        'Bourse aux Projets',
        78,
        65,
        'event'
      ),

      p(
        'er10',
        'Faubourg Rubis',
        72,
        65,
        'bordeaux',
        350,
        68
      ),

      f(
        'er11',
        'Prime municipale',
        66,
        65,
        'salary'
      )

    ]
  },


  /* ==========================================================
     PRINCIPAL — BAS + GAUCHE

     Gare du Midi
          ← ← ← ←
          ↑
          ↑
     Carrefour Ouest
     ========================================================== */

  'sud-direct': {

    name: 'Traverse express',

    from: 'sud',
    to: 'ouest',

    nodes: [

      /* BAS — VERS LA GAUCHE */

      p(
        'sd1',
        'Cour des Vignerons',
        40,
        65,
        'bordeaux',
        350,
        68
      ),

      f(
        'sd2',
        'Dépêche du Soir',
        35,
        65,
        'event'
      ),

      p(
        'sd3',
        'Quai des Grenats',
        30,
        65,
        'bordeaux',
        380,
        76
      ),

      p(
        'sd4',
        'Entrepôts d’Ardoise',
        25,
        65,
        'gris',
        230,
        40
      ),


      /* GAUCHE — MONTE */

      f(
        'sd5',
        'Inspection Centrale',
        25,
        58,
        'event'
      ),

      p(
        'sd6',
        'Avenue Cobalt',
        25,
        52,
        'bleu-fonce',
        280,
        50
      )

    ]
  },


  /* ==========================================================
     SUD

     Gare du Midi
           ●
           ↓
           ↓
           ↓
           ↓
     ← ← ← ←
     ↑
     ↑

     Rectangle indépendant de l'Est.
     ========================================================== */

  'sud-quais': {

    name: 'Boucle des quais',

    from: 'sud',
    to: 'ouest',

    nodes: [

      /* DROITE — DESCEND */

      p(
        'sq1',
        'Impasse Carmin',
        45,
        72,
        'bordeaux',
        350,
        68
      ),

      p(
        'sq2',
        'Tour des Vendanges',
        45,
        79,
        'bordeaux',
        380,
        76
      ),

      f(
        'sq3',
        'Inspection Urbaine',
        45,
        86,
        'event'
      ),

      f(
        'sq4',
        'Marché Nocturne',
        45,
        92,
        'event'
      ),


      /* BAS — GAUCHE */

      p(
        'sq5',
        'Docks de Granit',
        40,
        92,
        'gris',
        230,
        40
      ),

      f(
        'sq6',
        'Compagnie des Eaux',
        35,
        92,
        'company'
      ),

      p(
        'sq7',
        'Halles d’Étain',
        30,
        92,
        'gris',
        250,
        44
      ),

      p(
        'sq8',
        'Port Indigo',
        25,
        92,
        'bleu-fonce',
        260,
        46
      ),


      /* GAUCHE — MONTE */

      f(
        'sq9',
        'Avis de Travaux',
        25,
        85,
        'event'
      ),

      p(
        'sq10',
        'Boulevard Saphir',
        25,
        78,
        'bleu-fonce',
        280,
        50
      ),

      f(
        'sq11',
        'Banque des Quais',
        25,
        71,
        'bank'
      )

    ]
  },


  /* ==========================================================
     PRINCIPAL — GAUCHE + HAUT

     Carrefour Ouest
           → → → →
                 ↑
                 ↑
           Gare Centrale
     ========================================================== */

  'ouest-direct': {

    name: 'Axe civique',

    from: 'ouest',
    to: 'central',

    nodes: [

      /* MILIEU — DROITE */

      f(
        'od1',
        'Chronique Civique',
        30,
        45,
        'event'
      ),

      p(
        'od2',
        'Esplanade du Ciel',
        35,
        45,
        'bleu-pale',
        120,
        20
      ),

      f(
        'od3',
        'Prime de quartier',
        40,
        45,
        'salary'
      ),

      p(
        'od4',
        'Rue des Nuages',
        45,
        45,
        'bleu-pale',
        140,
        23
      ),


      /* MONTE VERS GARE CENTRALE */

      f(
        'od5',
        'Conseil de District',
        45,
        38,
        'event'
      ),

      p(
        'od6',
        'Passage des Vents',
        45,
        31,
        'bleu-pale',
        140,
        23
      )

    ]
  },


  /* ==========================================================
     OUEST

     Carrefour Ouest
        ← ← ← ←
        ↓
        ↓
        → → → →
              ↑
              ↑

     Puis raccord vers Gare Centrale.
     ========================================================== */

  'ouest-jardins': {

    name: 'Boucle des jardins',

    from: 'ouest',
    to: 'central',

    nodes: [

      /* BAS DU RECTANGLE OUEST — GAUCHE */

      f(
        'oj1',
        'Fête de Rue',
        20,
        45,
        'event'
      ),

      p(
        'oj2',
        'Cours Saphir',
        15,
        45,
        'bleu-fonce',
        260,
        46
      ),

      p(
        'oj3',
        'Promenade Indigo',
        10,
        45,
        'bleu-fonce',
        280,
        50
      ),

      f(
        'oj4',
        'Vide-greniers',
        5,
        45,
        'event'
      ),


      /* GAUCHE — MONTE */

      p(
        'oj5',
        'Bois du Levant',
        5,
        40,
        'vert-fonce',
        100,
        16
      ),

      f(
        'oj6',
        'Coopérative Locale',
        5,
        35,
        'company'
      ),

      p(
        'oj7',
        'Clos des Chênes',
        5,
        30,
        'vert-fonce',
        110,
        18
      ),

      p(
        'oj8',
        'Parc des Cèdres',
        5,
        25,
        'vert-fonce',
        120,
        20
      ),


      /* HAUT — DROITE */

      p(
        'oj9',
        'Jardin de Minuit',
        10,
        25,
        'vert-fonce',
        130,
        22
      ),

      f(
        'oj10',
        'Actualités du Parc',
        15,
        25,
        'event'
      ),

      p(
        'oj11',
        'Promenade Azur',
        20,
        25,
        'bleu-pale',
        120,
        20
      ),

      f(
        'oj12',
        'Prime régionale',
        25,
        25,
        'salary'
      ),

      p(
        'oj13',
        'Passage des Arts',
        30,
        25,
        'bleu-pale',
        140,
        23
      ),

      f(
        'oj14',
        'Tribune du Centre',
        35,
        25,
        'event'
      ),

      p(
        'oj15',
        'Place des Nuages',
        40,
        25,
        'bleu-pale',
        140,
        23
      )

    ]
  }

};


/* ============================================================
   INDEX DES CASES
   ============================================================ */

export const ALL_NODES =
  Object.values(ROUTES)
    .flatMap(route => route.nodes);


export const NODE_BY_ID =
  Object.fromEntries(
    ALL_NODES.map(
      node => [node.id, node]
    )
  );


/* ============================================================
   COULEURS
   ============================================================ */

export const GROUP_COLORS = {

  'vert-pale': '#bad7ad',

  'rose-pale': '#f3a4a2',

  'magenta': '#d40867',

  'bordeaux': '#9c1634',

  'gris': '#65717a',

  'bleu-fonce': '#1767dc',

  'vert-fonce': '#187e2a',

  'bleu-pale': '#a8c9f2'

};


/* ============================================================
   CARTES ÉVÉNEMENT
   ============================================================ */

export const EVENT_CARDS = [

  {
    text:
      'La ville finance votre projet culturel. Recevez 140 M.',
    amount: 140
  },

  {
    text:
      'Travaux imprévus sur votre immeuble. Payez 90 M.',
    amount: -90
  },

  {
    text:
      'Votre quartier remporte un prix. Recevez 100 M.',
    amount: 100
  },

  {
    text:
      'Taxe de mobilité exceptionnelle. Payez 70 M.',
    amount: -70
  },

  {
    text:
      'Marché local florissant. Recevez 60 M.',
    amount: 60
  },

  {
    text:
      'Contrôle de conformité. Payez 120 M.',
    amount: -120
  }

];