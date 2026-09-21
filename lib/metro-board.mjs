/*
 * ============================================================
 * MÉTROPOLE — PLATEAU
 * ============================================================
 *
 * Géométrie calée sur la carte de référence.
 *
 *                           NORD
 *                     ┌──────────────┐
 *                     │              │
 *                     │              │
 *                     └──●───────────┘
 *                        GARE CENTRALE
 *
 *   OUEST
 * ┌──────────────┐
 * │              │
 * │              │
 * └──────────────●
 *       CARREFOUR OUEST
 *
 *            ┌────────────────────────────────┐
 *            │                                │
 *            │           PRINCIPAL            │
 *            │                                │
 *            └──────────────────────●─────────┘
 *                             GARE DU MIDI
 *
 *                                          EST
 *                                  ┌────────────────┐
 *                                  │                │
 *                        CARREFOUR ●                │
 *                           DE L'EST                │
 *                                  └────────────────┘
 *
 *             SUD
 *        ┌──────────────┐
 *        │              │
 *        │              │
 *        └──────────────┘
 *
 * Sens de circulation : HORAIRE.
 */


/* ============================================================
   STATIONS
   ============================================================ */

export const STATIONS = {

  central: {
    id: 'central',
    name: 'Gare Centrale',
    x: 49,
    y: 35,
    next: [
      'central-direct',
      'central-nord'
    ]
  },

  est: {
    id: 'est',
    name: 'Carrefour de l’Est',
    x: 69,
    y: 53,
    next: [
      'est-riviera'
    ]
  },

  sud: {
    id: 'sud',
    name: 'Gare du Midi',
    x: 49,
    y: 68,
    next: [
      'sud-direct',
      'sud-quais'
    ]
  },

  ouest: {
    id: 'ouest',
    name: 'Carrefour de l’Ouest',
    x: 26,
    y: 53,
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
     PRINCIPAL
     GARE CENTRALE → CARREFOUR EST

     sens horaire :
     droite puis descente
     ========================================================== */

  'central-direct': {

    name: 'Boulevard direct',

    from: 'central',
    to: 'est',

    nodes: [

      f(
        'cd1',
        'Actualités locales',
        54,
        35,
        'event'
      ),

      p(
        'cd2',
        'Square Tilleul',
        59,
        35,
        'vert-pale',
        160,
        26
      ),

      p(
        'cd3',
        'Promenade des Serres',
        64,
        35,
        'vert-pale',
        180,
        30
      ),

      p(
        'cd4',
        'Passage Corail',
        69,
        35,
        'rose-pale',
        200,
        34
      ),

      p(
        'cd5',
        'Galerie des Fleurs',
        69,
        41,
        'rose-pale',
        220,
        38
      ),

      f(
        'cd6',
        'Place du Hasard',
        69,
        47,
        'event'
      )

    ]
  },


  /* ==========================================================
     BOUCLE NORD

         → → → →
         ↑     ↓
         ↑     ↓
         ● ← ← ←

     La Gare Centrale est en bas à gauche de la boucle.
     ========================================================== */

  'central-nord': {

    name: 'Boucle panoramique',

    from: 'central',
    to: 'est',

    nodes: [

      /* GAUCHE : montée */

      p(
        'cn1',
        'Allée des Brumes',
        49,
        28,
        'bleu-pale',
        120,
        20
      ),

      f(
        'cn2',
        'Kiosque du Matin',
        49,
        21,
        'event'
      ),

      f(
        'cn3',
        'Archives Municipales',
        49,
        14,
        'event'
      ),

      f(
        'cn4',
        'Chronique du Nord',
        49,
        6,
        'event'
      ),


      /* HAUT : droite */

      p(
        'cn5',
        'Jardin des Arts',
        54,
        6,
        'vert-pale',
        160,
        26
      ),

      f(
        'cn6',
        'Manufacture Horizon',
        59,
        6,
        'company'
      ),

      p(
        'cn7',
        'Parc des Verrières',
        64,
        6,
        'vert-pale',
        180,
        30
      ),

      p(
        'cn8',
        'Domaine des Pins',
        69,
        6,
        'vert-pale',
        200,
        34
      ),


      /* DROITE : descente */

      f(
        'cn9',
        'Tribune Publique',
        69,
        14,
        'event'
      ),

      p(
        'cn10',
        'Rue des Amandiers',
        69,
        21,
        'rose-pale',
        200,
        34
      ),

      p(
        'cn11',
        'Avenue Roseraie',
        69,
        28,
        'rose-pale',
        220,
        38
      ),

      f(
        'cn12',
        'Banque du Nord',
        69,
        35,
        'bank'
      )

    ]
  },


  /* ==========================================================
     BOUCLE EST

     Carrefour de l'Est placé sur le côté gauche.

             ↑
             ●
             ↑
             └────→→→→
                     ↓
                     ↓
             ←←←←←←←
     ========================================================== */

  'est-riviera': {

    name: 'Riviera orientale',

    from: 'est',
    to: 'sud',

    nodes: [

      /* Remontée jusqu'au haut du rectangle EST */

      f(
        'er1',
        'Journal de l’Est',
        69,
        47,
        'event'
      ),


      /* HAUT : droite */

      p(
        'er2',
        'Terrasse Pêche',
        75,
        47,
        'rose-pale',
        200,
        34
      ),

      p(
        'er3',
        'Belvédère Saumon',
        81,
        47,
        'rose-pale',
        220,
        38
      ),

      f(
        'er4',
        'Carnaval des Quais',
        88,
        47,
        'event'
      ),

      p(
        'er5',
        'Boulevard Fuchsia',
        95,
        47,
        'magenta',
        280,
        48
      ),


      /* DROITE : descente */

      f(
        'er6',
        'Ateliers Magnétiques',
        95,
        54,
        'company'
      ),

      p(
        'er7',
        'Place Framboise',
        95,
        61,
        'magenta',
        300,
        54
      ),

      p(
        'er8',
        'Rue Grenadine',
        95,
        68,
        'magenta',
        320,
        60
      ),


      /* BAS : gauche */

      p(
        'er9',
        'Faubourg Rubis',
        88,
        68,
        'bordeaux',
        350,
        68
      ),

      f(
        'er10',
        'Bourse aux Projets',
        81,
        68,
        'event'
      ),

      p(
        'er11',
        'Terrasse Grenat',
        74,
        68,
        'bordeaux',
        350,
        68
      ),

      f(
        'er12',
        'Prime municipale',
        69,
        68,
        'salary'
      ),

      p(
        'er13',
        'Boulevard Rubis',
        62,
        68,
        'bordeaux',
        350,
        68
      ),

      f(
        'er14',
        'Dépêche du Sud-Est',
        56,
        68,
        'event'
      )

    ]
  },


  /* ==========================================================
     PRINCIPAL
     GARE DU MIDI → CARREFOUR OUEST

     vers la gauche puis montée
     ========================================================== */

  'sud-direct': {

    name: 'Traverse express',

    from: 'sud',
    to: 'ouest',

    nodes: [

      p(
        'sd1',
        'Cour des Vignerons',
        44,
        68,
        'bordeaux',
        350,
        68
      ),

      f(
        'sd2',
        'Dépêche du Soir',
        39,
        68,
        'event'
      ),

      p(
        'sd3',
        'Quai des Grenats',
        34,
        68,
        'bordeaux',
        380,
        76
      ),

      p(
        'sd4',
        'Entrepôts d’Ardoise',
        29,
        68,
        'gris',
        230,
        40
      ),

      f(
        'sd5',
        'Inspection Centrale',
        26,
        63,
        'event'
      ),

      p(
        'sd6',
        'Avenue Cobalt',
        26,
        58,
        'bleu-fonce',
        280,
        50
      )

    ]
  },


  /* ==========================================================
     BOUCLE SUD

     Gare du Midi = angle supérieur droit.

          ●
          ↓
          ↓
          ↓
     ← ← ← ←
     ↑
     ↑
     ↑
     ========================================================== */

  'sud-quais': {

    name: 'Boucle des quais',

    from: 'sud',
    to: 'ouest',

    nodes: [

      /* DROITE : descente */

      p(
        'sq1',
        'Impasse Carmin',
        49,
        75,
        'bordeaux',
        350,
        68
      ),

      p(
        'sq2',
        'Tour des Vendanges',
        49,
        82,
        'bordeaux',
        380,
        76
      ),

      f(
        'sq3',
        'Inspection Urbaine',
        49,
        89,
        'event'
      ),

      f(
        'sq4',
        'Marché Nocturne',
        49,
        94,
        'event'
      ),


      /* BAS : gauche */

      p(
        'sq5',
        'Docks de Granit',
        44,
        94,
        'gris',
        230,
        40
      ),

      f(
        'sq6',
        'Compagnie des Eaux',
        38,
        94,
        'company'
      ),

      p(
        'sq7',
        'Halles d’Étain',
        32,
        94,
        'gris',
        250,
        44
      ),

      p(
        'sq8',
        'Port Indigo',
        26,
        94,
        'bleu-fonce',
        260,
        46
      ),


      /* GAUCHE : montée */

      f(
        'sq9',
        'Avis de Travaux',
        26,
        87,
        'event'
      ),

      p(
        'sq10',
        'Boulevard Saphir',
        26,
        80,
        'bleu-fonce',
        280,
        50
      ),

      f(
        'sq11',
        'Banque des Quais',
        26,
        73,
        'bank'
      )

    ]
  },


  /* ==========================================================
     PRINCIPAL
     CARREFOUR OUEST → GARE CENTRALE

     remonte sur la gauche puis part vers la droite.
     ========================================================== */

  'ouest-direct': {

    name: 'Axe civique',

    from: 'ouest',
    to: 'central',

    nodes: [

      f(
        'od1',
        'Chronique Civique',
        26,
        47,
        'event'
      ),

      p(
        'od2',
        'Esplanade du Ciel',
        26,
        41,
        'bleu-pale',
        120,
        20
      ),

      f(
        'od3',
        'Prime de quartier',
        26,
        35,
        'salary'
      ),

      p(
        'od4',
        'Rue des Nuages',
        32,
        35,
        'bleu-pale',
        140,
        23
      ),

      f(
        'od5',
        'Conseil de District',
        38,
        35,
        'event'
      ),

      p(
        'od6',
        'Passage des Vents',
        44,
        35,
        'bleu-pale',
        140,
        23
      )

    ]
  },


  /* ==========================================================
     BOUCLE OUEST

     Carrefour Ouest = angle inférieur droit.

      ← ← ← ←
      ↑     ↓
      ↑     ↓
      → → → ●

     Puis la route continue sur le haut du principal
     jusqu'à Gare Centrale.
     ========================================================== */

  'ouest-jardins': {

    name: 'Boucle des jardins',

    from: 'ouest',
    to: 'central',

    nodes: [

      /* BAS : gauche */

      f(
        'oj1',
        'Fête de Rue',
        21,
        53,
        'event'
      ),

      p(
        'oj2',
        'Cours Saphir',
        16,
        53,
        'bleu-fonce',
        260,
        46
      ),

      p(
        'oj3',
        'Promenade Indigo',
        10,
        53,
        'bleu-fonce',
        280,
        50
      ),

      f(
        'oj4',
        'Vide-greniers',
        4,
        53,
        'event'
      ),


      /* GAUCHE : montée */

      p(
        'oj5',
        'Bois du Levant',
        4,
        47,
        'vert-fonce',
        100,
        16
      ),

      f(
        'oj6',
        'Coopérative Locale',
        4,
        42,
        'company'
      ),

      p(
        'oj7',
        'Clos des Chênes',
        4,
        37,
        'vert-fonce',
        110,
        18
      ),

      p(
        'oj8',
        'Parc des Cèdres',
        4,
        32,
        'vert-fonce',
        120,
        20
      ),


      /* HAUT : droite */

      p(
        'oj9',
        'Jardin de Minuit',
        9,
        32,
        'vert-fonce',
        130,
        22
      ),

      f(
        'oj10',
        'Actualités du Parc',
        14,
        32,
        'event'
      ),

      p(
        'oj11',
        'Promenade Azur',
        19,
        32,
        'bleu-pale',
        120,
        20
      ),

      f(
        'oj12',
        'Prime régionale',
        26,
        32,
        'salary'
      ),


      /* RACCORDEMENT VERS GARE CENTRALE */

      p(
        'oj13',
        'Passage des Arts',
        32,
        35,
        'bleu-pale',
        140,
        23
      ),

      f(
        'oj14',
        'Tribune du Centre',
        38,
        35,
        'event'
      ),

      p(
        'oj15',
        'Place des Nuages',
        44,
        35,
        'bleu-pale',
        140,
        23
      )

    ]
  }

};


/* ============================================================
   INDEX
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
   ÉVÉNEMENTS
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