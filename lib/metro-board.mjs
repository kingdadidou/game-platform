/*
 * MÉTROPOLE — Plateau
 *
 * Principe :
 * chaque route est construite sur une grille orthogonale.
 * Deux cases consécutives partagent toujours le même X ou le même Y.
 *
 * Cases fonctionnelles :
 * station = violet
 * salary = jaune
 * bank = orange
 * company = cyan
 * event = blanc
 */

export const STATIONS = {
  central: {
    id: 'central',
    name: 'Gare Centrale',
    x: 48,
    y: 34,
    next: ['central-direct', 'central-nord']
  },

  est: {
    id: 'est',
    name: 'Carrefour de l’Est',
    x: 72,
    y: 52,
    next: ['est-riviera']
  },

  sud: {
    id: 'sud',
    name: 'Gare du Midi',
    x: 48,
    y: 72,
    next: ['sud-direct', 'sud-quais']
  },

  ouest: {
    id: 'ouest',
    name: 'Carrefour de l’Ouest',
    x: 24,
    y: 52,
    next: ['ouest-direct', 'ouest-jardins']
  }
};


/* =========================================================
   HELPERS
   ========================================================= */

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


/* =========================================================
   ROUTES
   ========================================================= */

export const ROUTES = {

  /* =======================================================
     GARE CENTRALE → CARREFOUR EST
     ROUTE INTÉRIEURE
     ======================================================= */

  'central-direct': {
    name: 'Boulevard direct',
    from: 'central',
    to: 'est',

    nodes: [
      f(
        'cd1',
        'Actualités locales',
        54,
        34,
        'event'
      ),

      p(
        'cd2',
        'Square Tilleul',
        60,
        34,
        'vert-pale',
        160,
        26
      ),

      p(
        'cd3',
        'Promenade des Serres',
        66,
        34,
        'vert-pale',
        180,
        30
      ),

      p(
        'cd4',
        'Passage Corail',
        72,
        34,
        'rose-pale',
        200,
        34
      ),

      f(
        'cd5',
        'Banque Centrale',
        72,
        40,
        'bank'
      ),

      p(
        'cd6',
        'Galerie des Fleurs',
        72,
        46,
        'rose-pale',
        220,
        38
      )
    ]
  },


  /* =======================================================
     GARE CENTRALE → BOUCLE NORD → CARREFOUR EST
     ======================================================= */

  'central-nord': {
    name: 'Boucle panoramique',
    from: 'central',
    to: 'est',

    nodes: [
      p(
        'cn1',
        'Allée des Brumes',
        48,
        28,
        'bleu-pale',
        120,
        20
      ),

      f(
        'cn2',
        'Kiosque du Matin',
        48,
        22,
        'event'
      ),

      f(
        'cn3',
        'Archives Municipales',
        48,
        16,
        'event'
      ),

      p(
        'cn4',
        'Jardin des Arts',
        54,
        16,
        'vert-pale',
        160,
        26
      ),

      f(
        'cn5',
        'Manufacture Horizon',
        60,
        16,
        'company'
      ),

      p(
        'cn6',
        'Parc des Verrières',
        66,
        16,
        'vert-pale',
        180,
        30
      ),

      p(
        'cn7',
        'Domaine des Pins',
        72,
        16,
        'vert-pale',
        200,
        34
      ),

      f(
        'cn8',
        'Tribune Publique',
        78,
        16,
        'event'
      ),

      p(
        'cn9',
        'Rue des Amandiers',
        78,
        22,
        'rose-pale',
        200,
        34
      ),

      f(
        'cn10',
        'Place du Hasard',
        78,
        28,
        'event'
      ),

      p(
        'cn11',
        'Avenue Roseraie',
        78,
        34,
        'rose-pale',
        220,
        38
      ),

      f(
        'cn12',
        'Banque du Nord',
        78,
        40,
        'bank'
      ),

      /*
       * Les deux dernières cases permettent de rejoindre
       * le carrefour Est sans diagonale.
       */

      p(
        'cn13',
        'Place des Tonneliers',
        78,
        46,
        'rose-pale',
        220,
        38
      ),

      f(
        'cn14',
        'Passage de l’Est',
        78,
        52,
        'event'
      )
    ]
  },


  /* =======================================================
     CARREFOUR EST → GARE DU MIDI
     ======================================================= */

  'est-riviera': {
    name: 'Riviera orientale',
    from: 'est',
    to: 'sud',

    nodes: [
      f(
        'er1',
        'Journal de l’Est',
        78,
        52,
        'event'
      ),

      p(
        'er2',
        'Terrasse Pêche',
        84,
        52,
        'rose-pale',
        200,
        34
      ),

      p(
        'er3',
        'Belvédère Saumon',
        90,
        52,
        'rose-pale',
        220,
        38
      ),

      f(
        'er4',
        'Carnaval des Quais',
        90,
        58,
        'event'
      ),

      p(
        'er5',
        'Boulevard Fuchsia',
        90,
        64,
        'magenta',
        280,
        48
      ),

      f(
        'er6',
        'Ateliers Magnétiques',
        90,
        72,
        'company'
      ),

      p(
        'er7',
        'Place Framboise',
        84,
        72,
        'magenta',
        300,
        54
      ),

      f(
        'er8',
        'Bourse aux Projets',
        78,
        72,
        'event'
      ),

      p(
        'er9',
        'Rue Grenadine',
        72,
        72,
        'magenta',
        320,
        60
      ),

      f(
        'er10',
        'Prime municipale',
        66,
        72,
        'salary'
      ),

      p(
        'er11',
        'Faubourg Rubis',
        60,
        72,
        'bordeaux',
        350,
        68
      ),

      p(
        'er12',
        'Boulevard du Midi',
        54,
        72,
        'bordeaux',
        350,
        68
      )
    ]
  },


  /* =======================================================
     GARE DU MIDI → CARREFOUR OUEST
     ROUTE DIRECTE
     ======================================================= */

  'sud-direct': {
    name: 'Traverse express',
    from: 'sud',
    to: 'ouest',

    nodes: [
      p(
        'sd1',
        'Cour des Vignerons',
        42,
        72,
        'bordeaux',
        350,
        68
      ),

      f(
        'sd2',
        'Dépêche du Soir',
        36,
        72,
        'event'
      ),

      p(
        'sd3',
        'Quai des Grenats',
        30,
        72,
        'bordeaux',
        380,
        76
      ),

      p(
        'sd4',
        'Entrepôts d’Ardoise',
        24,
        72,
        'gris',
        230,
        40
      ),

      f(
        'sd5',
        'Passage de l’Ouest',
        24,
        66,
        'event'
      ),

      p(
        'sd6',
        'Avenue Indigo',
        24,
        60,
        'bleu-fonce',
        260,
        46
      )
    ]
  },


  /* =======================================================
     GARE DU MIDI → BOUCLE SUD → OUEST
     ======================================================= */

  'sud-quais': {
    name: 'Boucle des quais',
    from: 'sud',
    to: 'ouest',

    nodes: [
      p(
        'sq1',
        'Impasse Carmin',
        48,
        78,
        'bordeaux',
        350,
        68
      ),

      p(
        'sq2',
        'Tour des Vendanges',
        48,
        84,
        'bordeaux',
        380,
        76
      ),

      f(
        'sq3',
        'Inspection Urbaine',
        48,
        90,
        'event'
      ),

      p(
        'sq4',
        'Docks de Granit',
        42,
        90,
        'gris',
        230,
        40
      ),

      f(
        'sq5',
        'Compagnie des Eaux',
        36,
        90,
        'company'
      ),

      p(
        'sq6',
        'Halles d’Étain',
        30,
        90,
        'gris',
        250,
        44
      ),

      f(
        'sq7',
        'Marché Nocturne',
        24,
        90,
        'event'
      ),

      p(
        'sq8',
        'Port Indigo',
        18,
        90,
        'bleu-fonce',
        260,
        46
      ),

      f(
        'sq9',
        'Avis de Travaux',
        18,
        84,
        'event'
      ),

      p(
        'sq10',
        'Avenue Cobalt',
        18,
        78,
        'bleu-fonce',
        280,
        50
      ),

      f(
        'sq11',
        'Banque des Quais',
        18,
        72,
        'bank'
      ),

      p(
        'sq12',
        'Boulevard Saphir',
        18,
        66,
        'bleu-fonce',
        280,
        50
      ),

      f(
        'sq13',
        'Passage Occidental',
        18,
        60,
        'event'
      ),

      p(
        'sq14',
        'Cours Indigo',
        18,
        52,
        'bleu-fonce',
        260,
        46
      )
    ]
  },


  /* =======================================================
     CARREFOUR OUEST → GARE CENTRALE
     ROUTE INTÉRIEURE
     ======================================================= */

  'ouest-direct': {
    name: 'Axe civique',
    from: 'ouest',
    to: 'central',

    nodes: [
      f(
        'od1',
        'Chronique Civique',
        30,
        52,
        'event'
      ),

      p(
        'od2',
        'Esplanade du Ciel',
        36,
        52,
        'bleu-pale',
        120,
        20
      ),

      f(
        'od3',
        'Prime de quartier',
        42,
        52,
        'salary'
      ),

      p(
        'od4',
        'Rue des Nuages',
        48,
        52,
        'bleu-pale',
        140,
        23
      ),

      f(
        'od5',
        'Conseil de District',
        48,
        46,
        'event'
      ),

      p(
        'od6',
        'Passage des Vents',
        48,
        40,
        'bleu-pale',
        140,
        23
      )
    ]
  },


  /* =======================================================
     CARREFOUR OUEST → BOUCLE NORD-OUEST → CENTRAL
     ======================================================= */

  'ouest-jardins': {
    name: 'Boucle des jardins',
    from: 'ouest',
    to: 'central',

    nodes: [
      f(
        'oj1',
        'Fête de Rue',
        18,
        52,
        'event'
      ),

      p(
        'oj2',
        'Cours Saphir',
        12,
        52,
        'bleu-fonce',
        260,
        46
      ),

      f(
        'oj3',
        'Coopérative Locale',
        12,
        46,
        'company'
      ),

      p(
        'oj4',
        'Bois du Levant',
        12,
        40,
        'vert-fonce',
        100,
        16
      ),

      p(
        'oj5',
        'Clos des Chênes',
        12,
        34,
        'vert-fonce',
        110,
        18
      ),

      p(
        'oj6',
        'Parc des Cèdres',
        12,
        28,
        'vert-fonce',
        120,
        20
      ),

      p(
        'oj7',
        'Jardin de Minuit',
        18,
        28,
        'vert-fonce',
        130,
        22
      ),

      f(
        'oj8',
        'Vide-greniers',
        24,
        28,
        'event'
      ),

      p(
        'oj9',
        'Promenade Azur',
        30,
        28,
        'bleu-pale',
        120,
        20
      ),

      f(
        'oj10',
        'Prime régionale',
        36,
        28,
        'salary'
      ),

      p(
        'oj11',
        'Passage des Vents',
        42,
        28,
        'bleu-pale',
        140,
        23
      ),

      p(
        'oj12',
        'Place des Nuages',
        48,
        28,
        'bleu-pale',
        140,
        23
      )
    ]
  }
};


/* =========================================================
   INDEX DES CASES
   ========================================================= */

export const ALL_NODES =
  Object.values(ROUTES)
    .flatMap(route => route.nodes);

export const NODE_BY_ID =
  Object.fromEntries(
    ALL_NODES.map(
      node => [node.id, node]
    )
  );


/* =========================================================
   COULEURS
   ========================================================= */

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


/* =========================================================
   ÉVÉNEMENTS
   ========================================================= */

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