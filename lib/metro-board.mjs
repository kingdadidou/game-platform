/*
 * MÉTROPOLE — Définition du plateau
 *
 * Le plateau est construit comme un réseau de rues.
 *
 * IMPORTANT :
 * - x = position horizontale en %
 * - y = position verticale en %
 * - les routes suivent autant que possible des axes orthogonaux
 *
 * CASES FONCTIONNELLES
 * - station : violet
 * - salary  : jaune
 * - bank    : orange
 * - company : cyan
 * - event   : blanc
 *
 * QUARTIERS
 * - vert-fonce
 * - bleu-fonce
 * - gris
 * - bordeaux
 * - magenta
 * - rose-pale
 * - vert-pale
 * - bleu-pale
 */


/* =========================================================
   GARES / CARREFOURS
   ========================================================= */

export const STATIONS = {

  central: {
    id: 'central',
    name: 'Gare Centrale',
    x: 48,
    y: 36,
    next: ['central-direct', 'central-nord']
  },

  est: {
    id: 'est',
    name: 'Carrefour de l’Est',
    x: 70,
    y: 52,
    next: ['est-riviera']
  },

  sud: {
    id: 'sud',
    name: 'Gare du Midi',
    x: 48,
    y: 70,
    next: ['sud-direct', 'sud-quais']
  },

  ouest: {
    id: 'ouest',
    name: 'Carrefour de l’Ouest',
    x: 27,
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
     GARE CENTRALE → CARREFOUR DE L'EST
     ROUTE DIRECTE

     Référence :
     Gare Centrale
           →
     événement → vert pâle → vert pâle
           ↓
     rose pâle → banque → rose pâle
           ↓
     Carrefour de l'Est
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
        36,
        'event'
      ),

      p(
        'cd2',
        'Square Tilleul',
        60,
        36,
        'vert-pale',
        160,
        26
      ),

      p(
        'cd3',
        'Promenade des Serres',
        66,
        36,
        'vert-pale',
        180,
        30
      ),

      p(
        'cd4',
        'Passage Corail',
        70,
        40,
        'rose-pale',
        200,
        34
      ),

      f(
        'cd5',
        'Banque Centrale',
        70,
        44,
        'bank'
      ),

      p(
        'cd6',
        'Galerie des Fleurs',
        70,
        48,
        'rose-pale',
        220,
        38
      )

    ]

  },


  /* =======================================================
     GARE CENTRALE → BOUCLE NORD → EST

                    ┌───────────────┐
                    │               │
                    │               │
              CENTRAL              │
                    │               │
                    └────────────── EST
     ======================================================= */

  'central-nord': {

    name: 'Boucle panoramique',

    from: 'central',
    to: 'est',

    nodes: [

      /* Montée depuis Gare Centrale */

      p(
        'cn1',
        'Allée des Brumes',
        48,
        30,
        'bleu-pale',
        120,
        20
      ),

      f(
        'cn2',
        'Kiosque du Matin',
        48,
        24,
        'event'
      ),

      f(
        'cn3',
        'Archives Municipales',
        48,
        18,
        'event'
      ),


      /* Ligne supérieure */

      p(
        'cn4',
        'Jardin des Arts',
        55,
        18,
        'vert-pale',
        160,
        26
      ),

      f(
        'cn5',
        'Manufacture Horizon',
        62,
        18,
        'company'
      ),

      p(
        'cn6',
        'Parc des Verrières',
        69,
        18,
        'vert-pale',
        180,
        30
      ),

      p(
        'cn7',
        'Domaine des Pins',
        76,
        18,
        'vert-pale',
        200,
        34
      ),


      /* Descente droite */

      f(
        'cn8',
        'Tribune Publique',
        82,
        24,
        'event'
      ),

      p(
        'cn9',
        'Rue des Amandiers',
        82,
        30,
        'rose-pale',
        200,
        34
      ),

      f(
        'cn10',
        'Place du Hasard',
        82,
        36,
        'event'
      ),

      p(
        'cn11',
        'Avenue Roseraie',
        82,
        42,
        'rose-pale',
        220,
        38
      ),

      f(
        'cn12',
        'Banque du Nord',
        82,
        48,
        'bank'
      )

    ]

  },


  /* =======================================================
     CARREFOUR DE L'EST → GARE DU MIDI

     Branche Est + quartier rose/magenta
     ======================================================= */

  'est-riviera': {

    name: 'Riviera orientale',

    from: 'est',
    to: 'sud',

    nodes: [

      /* Vers la droite */

      f(
        'er1',
        'Journal de l’Est',
        76,
        52,
        'event'
      ),

      p(
        'er2',
        'Terrasse Pêche',
        82,
        52,
        'rose-pale',
        200,
        34
      ),

      p(
        'er3',
        'Belvédère Saumon',
        88,
        52,
        'rose-pale',
        220,
        38
      ),


      /* Descente extrême droite */

      f(
        'er4',
        'Carnaval des Quais',
        88,
        58,
        'event'
      ),

      p(
        'er5',
        'Boulevard Fuchsia',
        88,
        64,
        'magenta',
        280,
        48
      ),


      /* Retour vers la gauche */

      f(
        'er6',
        'Ateliers Magnétiques',
        82,
        70,
        'company'
      ),

      p(
        'er7',
        'Place Framboise',
        76,
        70,
        'magenta',
        300,
        54
      ),

      f(
        'er8',
        'Bourse aux Projets',
        70,
        70,
        'event'
      ),

      p(
        'er9',
        'Rue Grenadine',
        64,
        70,
        'magenta',
        320,
        60
      ),

      f(
        'er10',
        'Prime municipale',
        58,
        70,
        'salary'
      ),

      p(
        'er11',
        'Faubourg Rubis',
        53,
        70,
        'bordeaux',
        350,
        68
      )

    ]

  },


  /* =======================================================
     GARE DU MIDI → CARREFOUR DE L'OUEST
     ROUTE DIRECTE

     Bordeaux → événement → Bordeaux → Gris
     ======================================================= */

  'sud-direct': {

    name: 'Traverse express',

    from: 'sud',
    to: 'ouest',

    nodes: [

      p(
        'sd1',
        'Cour des Vignerons',
        43,
        70,
        'bordeaux',
        350,
        68
      ),

      f(
        'sd2',
        'Dépêche du Soir',
        38,
        70,
        'event'
      ),

      p(
        'sd3',
        'Quai des Grenats',
        33,
        70,
        'bordeaux',
        380,
        76
      ),

      p(
        'sd4',
        'Entrepôts d’Ardoise',
        28,
        70,
        'gris',
        230,
        40
      )

    ]

  },


  /* =======================================================
     GARE DU MIDI → BOUCLE SUD/OUEST → CARREFOUR OUEST
     ======================================================= */

  'sud-quais': {

    name: 'Boucle des quais',

    from: 'sud',
    to: 'ouest',

    nodes: [

      /* Descente depuis Gare du Midi */

      p(
        'sq1',
        'Impasse Carmin',
        48,
        76,
        'bordeaux',
        350,
        68
      ),

      p(
        'sq2',
        'Tour des Vendanges',
        48,
        82,
        'bordeaux',
        380,
        76
      ),

      f(
        'sq3',
        'Inspection Urbaine',
        48,
        88,
        'event'
      ),


      /* Ligne inférieure vers la gauche */

      p(
        'sq4',
        'Docks de Granit',
        41,
        88,
        'gris',
        230,
        40
      ),

      f(
        'sq5',
        'Compagnie des Eaux',
        34,
        88,
        'company'
      ),

      p(
        'sq6',
        'Halles d’Étain',
        27,
        88,
        'gris',
        250,
        44
      ),


      /* Remontée côté gauche */

      f(
        'sq7',
        'Marché Nocturne',
        22,
        82,
        'event'
      ),

      p(
        'sq8',
        'Port Indigo',
        22,
        76,
        'bleu-fonce',
        260,
        46
      ),

      f(
        'sq9',
        'Avis de Travaux',
        22,
        70,
        'event'
      ),

      p(
        'sq10',
        'Avenue Cobalt',
        22,
        64,
        'bleu-fonce',
        280,
        50
      ),

      f(
        'sq11',
        'Banque des Quais',
        22,
        58,
        'bank'
      )

    ]

  },


  /* =======================================================
     CARREFOUR DE L'OUEST → GARE CENTRALE
     ROUTE DIRECTE
     ======================================================= */

  'ouest-direct': {

    name: 'Axe civique',

    from: 'ouest',
    to: 'central',

    nodes: [

      f(
        'od1',
        'Chronique Civique',
        32,
        52,
        'event'
      ),

      p(
        'od2',
        'Esplanade du Ciel',
        37,
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
        48,
        'bleu-pale',
        140,
        23
      ),

      f(
        'od5',
        'Conseil de District',
        48,
        42,
        'event'
      )

    ]

  },


  /* =======================================================
     CARREFOUR DE L'OUEST → BOUCLE NORD-OUEST → CENTRAL
     ======================================================= */

  'ouest-jardins': {

    name: 'Boucle des jardins',

    from: 'ouest',
    to: 'central',

    nodes: [

      /* Partie gauche du carrefour */

      p(
        'oj1',
        'Cours Saphir',
        21,
        52,
        'bleu-fonce',
        260,
        46
      ),

      f(
        'oj2',
        'Fête de Rue',
        15,
        52,
        'event'
      ),


      /* Remontée gauche */

      p(
        'oj3',
        'Bois du Levant',
        15,
        46,
        'vert-fonce',
        100,
        16
      ),

      f(
        'oj4',
        'Coopérative Locale',
        15,
        40,
        'company'
      ),

      p(
        'oj5',
        'Clos des Chênes',
        15,
        34,
        'vert-fonce',
        110,
        18
      ),

      p(
        'oj6',
        'Parc des Cèdres',
        15,
        28,
        'vert-fonce',
        120,
        20
      ),


      /* Ligne supérieure */

      p(
        'oj7',
        'Jardin de Minuit',
        21,
        28,
        'vert-fonce',
        130,
        22
      ),

      f(
        'oj8',
        'Vide-greniers',
        27,
        28,
        'event'
      ),

      p(
        'oj9',
        'Promenade Azur',
        33,
        28,
        'bleu-pale',
        120,
        20
      ),

      f(
        'oj10',
        'Prime régionale',
        39,
        28,
        'salary'
      ),


      /* Retour vers Gare Centrale */

      p(
        'oj11',
        'Passage des Vents',
        44,
        32,
        'bleu-pale',
        140,
        23
      )

    ]

  }

};


/* =========================================================
   LISTE DE TOUTES LES CASES
   ========================================================= */

export const ALL_NODES =
  Object.values(ROUTES)
    .flatMap(route => route.nodes);


/* =========================================================
   RECHERCHE RAPIDE PAR ID
   ========================================================= */

export const NODE_BY_ID =
  Object.fromEntries(
    ALL_NODES.map(node => [node.id, node])
  );


/* =========================================================
   COULEURS DES QUARTIERS
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
   CARTES ÉVÉNEMENT
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