/*
 * ============================================================
 * MÉTROPOLE — PLATEAU
 * ============================================================
 *
 * Structure :
 *
 *                  ┌──── RECTANGLE NORD ────┐
 *                  │                        │
 *          ┌───────┴────────────────────────┤
 *          │                                │
 * RECTANGLE│       RECTANGLE PRINCIPAL      │ RECTANGLE
 *  OUEST   │                                │   EST
 *          └────────────┬───────────────────┘
 *                       │
 *                  RECTANGLE SUD
 *
 *
 * Il y a donc 5 rectangles :
 *
 * 1. Rectangle principal
 * 2. Rectangle nord
 * 3. Rectangle est
 * 4. Rectangle sud
 * 5. Rectangle ouest
 *
 *
 * SENS DE CIRCULATION UNIQUE :
 *
 *             → → → →
 *             ↑     ↓
 *             ↑     ↓
 *             ← ← ← ←
 *
 * Toutes les boucles sont parcourues dans le sens horaire.
 *
 * Les gares/carrefours permettent de choisir une nouvelle
 * route lorsqu'on les atteint.
 */


/* ============================================================
   GARES / CARREFOURS
   ============================================================ */

export const STATIONS = {

  central: {
    id: 'central',
    name: 'Gare Centrale',

    /*
     * Coin supérieur droit du rectangle principal.
     */
    x: 47,
    y: 31,

    next: [
      'central-direct',
      'central-nord'
    ]
  },


  est: {
    id: 'est',
    name: 'Carrefour de l’Est',

    /*
     * Coin inférieur droit du rectangle principal.
     */
    x: 66,
    y: 50,

    next: [
      'est-riviera'
    ]
  },


  sud: {
    id: 'sud',
    name: 'Gare du Midi',

    /*
     * Partie inférieure du rectangle principal.
     */
    x: 47,
    y: 69,

    next: [
      'sud-direct',
      'sud-quais'
    ]
  },


  ouest: {
    id: 'ouest',
    name: 'Carrefour de l’Ouest',

    /*
     * Coin inférieur gauche / connexion ouest.
     */
    x: 25,
    y: 50,

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
     1 — PARTIE HAUTE DU RECTANGLE PRINCIPAL

     GARE CENTRALE → CARREFOUR EST

     Sens horaire :

     CENTRAL → → → → →
                       ↓
                       ↓
                      EST
     ========================================================== */

  'central-direct': {

    name: 'Boulevard direct',

    from: 'central',
    to: 'est',

    nodes: [

      f(
        'cd1',
        'Actualités locales',
        52,
        31,
        'event'
      ),

      p(
        'cd2',
        'Square Tilleul',
        57,
        31,
        'vert-pale',
        160,
        26
      ),

      p(
        'cd3',
        'Promenade des Serres',
        62,
        31,
        'vert-pale',
        180,
        30
      ),

      p(
        'cd4',
        'Passage Corail',
        66,
        31,
        'rose-pale',
        200,
        34
      ),

      p(
        'cd5',
        'Galerie des Fleurs',
        66,
        37,
        'rose-pale',
        220,
        38
      ),

      f(
        'cd6',
        'Banque Centrale',
        66,
        43,
        'bank'
      )

    ]
  },


  /* ==========================================================
     2 — RECTANGLE NORD

                → → → → →
                ↑       ↓
                ↑       ↓
             CENTRAL ← ←

     Départ : Gare Centrale
     Retour vers le côté droit du rectangle principal.
     ========================================================== */

  'central-nord': {

    name: 'Boucle panoramique',

    from: 'central',
    to: 'est',

    nodes: [

      /*
       * CÔTÉ GAUCHE — montée
       */

      p(
        'cn1',
        'Allée des Brumes',
        47,
        25,
        'bleu-pale',
        120,
        20
      ),

      p(
        'cn2',
        'Rue des Nuages',
        47,
        19,
        'bleu-pale',
        140,
        23
      ),

      f(
        'cn3',
        'Archives Municipales',
        47,
        13,
        'event'
      ),


      /*
       * HAUT — vers la droite
       */

      p(
        'cn4',
        'Jardin des Arts',
        53,
        13,
        'vert-pale',
        160,
        26
      ),

      f(
        'cn5',
        'Manufacture Horizon',
        59,
        13,
        'company'
      ),

      p(
        'cn6',
        'Parc des Verrières',
        65,
        13,
        'vert-pale',
        180,
        30
      ),

      p(
        'cn7',
        'Domaine des Pins',
        71,
        13,
        'vert-pale',
        200,
        34
      ),


      /*
       * CÔTÉ DROIT — descente
       */

      f(
        'cn8',
        'Tribune Publique',
        71,
        19,
        'event'
      ),

      p(
        'cn9',
        'Rue des Amandiers',
        71,
        25,
        'rose-pale',
        200,
        34
      ),

      f(
        'cn10',
        'Place du Hasard',
        71,
        31,
        'event'
      ),

      p(
        'cn11',
        'Avenue Roseraie',
        71,
        37,
        'rose-pale',
        220,
        38
      ),

      p(
        'cn12',
        'Terrasse Pêche',
        71,
        43,
        'rose-pale',
        200,
        34
      ),

      f(
        'cn13',
        'Banque du Nord',
        71,
        50,
        'bank'
      )

    ]
  },


  /* ==========================================================
     3 — RECTANGLE EST

     Départ : Carrefour Est

       EST → → → → →
                  ↓
                  ↓
             ← ← ← ←

     Puis retour vers le bas du rectangle principal.
     ========================================================== */

  'est-riviera': {

    name: 'Riviera orientale',

    from: 'est',
    to: 'sud',

    nodes: [

      /*
       * HAUT — vers la droite
       */

      f(
        'er1',
        'Journal de l’Est',
        72,
        50,
        'event'
      ),

      p(
        'er2',
        'Terrasse Pêche',
        78,
        50,
        'rose-pale',
        200,
        34
      ),

      p(
        'er3',
        'Belvédère Saumon',
        84,
        50,
        'rose-pale',
        220,
        38
      ),

      f(
        'er4',
        'Carnaval des Quais',
        90,
        50,
        'event'
      ),


      /*
       * CÔTÉ DROIT — descente
       */

      p(
        'er5',
        'Boulevard Fuchsia',
        90,
        57,
        'magenta',
        280,
        48
      ),

      f(
        'er6',
        'Ateliers Magnétiques',
        90,
        64,
        'company'
      ),

      p(
        'er7',
        'Place Framboise',
        90,
        69,
        'magenta',
        300,
        54
      ),


      /*
       * BAS — vers la gauche
       */

      p(
        'er8',
        'Rue Grenadine',
        84,
        69,
        'magenta',
        320,
        60
      ),

      f(
        'er9',
        'Bourse aux Projets',
        78,
        69,
        'event'
      ),

      p(
        'er10',
        'Faubourg Rubis',
        72,
        69,
        'bordeaux',
        350,
        68
      ),

      f(
        'er11',
        'Prime municipale',
        66,
        69,
        'salary'
      ),

      p(
        'er12',
        'Boulevard du Midi',
        60,
        69,
        'bordeaux',
        350,
        68
      ),

      p(
        'er13',
        'Quai des Grenats',
        54,
        69,
        'bordeaux',
        380,
        76
      )

    ]
  },


  /* ==========================================================
     4 — BAS DU RECTANGLE PRINCIPAL

     GARE DU MIDI → CARREFOUR OUEST

     Sens horaire :
     MIDI ← ← ← ← OUEST
     ========================================================== */

  'sud-direct': {

    name: 'Traverse express',

    from: 'sud',
    to: 'ouest',

    nodes: [

      p(
        'sd1',
        'Cour des Vignerons',
        42,
        69,
        'bordeaux',
        350,
        68
      ),

      f(
        'sd2',
        'Dépêche du Soir',
        37,
        69,
        'event'
      ),

      p(
        'sd3',
        'Entrepôts d’Ardoise',
        32,
        69,
        'gris',
        230,
        40
      ),

      p(
        'sd4',
        'Halles d’Étain',
        27,
        69,
        'gris',
        250,
        44
      ),

      f(
        'sd5',
        'Avis de Travaux',
        25,
        63,
        'event'
      ),

      p(
        'sd6',
        'Avenue Cobalt',
        25,
        57,
        'bleu-fonce',
        280,
        50
      )

    ]
  },


  /* ==========================================================
     5 — RECTANGLE SUD

     Départ : Gare du Midi

              MIDI
               ↓
               ↓
         ← ← ← ←
         ↑
         ↑

     Retour vers Carrefour Ouest.
     ========================================================== */

  'sud-quais': {

    name: 'Boucle des quais',

    from: 'sud',
    to: 'ouest',

    nodes: [

      /*
       * CÔTÉ DROIT — descente
       */

      p(
        'sq1',
        'Impasse Carmin',
        47,
        75,
        'bordeaux',
        350,
        68
      ),

      p(
        'sq2',
        'Tour des Vendanges',
        47,
        81,
        'bordeaux',
        380,
        76
      ),

      f(
        'sq3',
        'Inspection Urbaine',
        47,
        87,
        'event'
      ),


      /*
       * BAS — vers la gauche
       */

      p(
        'sq4',
        'Docks de Granit',
        41,
        87,
        'gris',
        230,
        40
      ),

      f(
        'sq5',
        'Compagnie des Eaux',
        35,
        87,
        'company'
      ),

      p(
        'sq6',
        'Halles du Métal',
        29,
        87,
        'gris',
        250,
        44
      ),

      p(
        'sq7',
        'Docks d’Ardoise',
        23,
        87,
        'gris',
        230,
        40
      ),


      /*
       * CÔTÉ GAUCHE — remontée
       */

      f(
        'sq8',
        'Marché Nocturne',
        23,
        81,
        'event'
      ),

      p(
        'sq9',
        'Port Indigo',
        23,
        75,
        'bleu-fonce',
        260,
        46
      ),

      f(
        'sq10',
        'Avis des Quais',
        23,
        69,
        'event'
      ),

      p(
        'sq11',
        'Boulevard Saphir',
        23,
        63,
        'bleu-fonce',
        280,
        50
      ),

      p(
        'sq12',
        'Cours Indigo',
        23,
        57,
        'bleu-fonce',
        260,
        46
      )

    ]
  },


  /* ==========================================================
     6 — RETOUR OUEST → CENTRE

     Carrefour Ouest → Gare Centrale

     Partie intérieure du rectangle principal.
     ========================================================== */

  'ouest-direct': {

    name: 'Axe civique',

    from: 'ouest',
    to: 'central',

    nodes: [

      f(
        'od1',
        'Chronique Civique',
        31,
        50,
        'event'
      ),

      p(
        'od2',
        'Esplanade du Ciel',
        37,
        50,
        'bleu-pale',
        120,
        20
      ),

      f(
        'od3',
        'Prime de quartier',
        43,
        50,
        'salary'
      ),

      p(
        'od4',
        'Rue des Nuages',
        47,
        50,
        'bleu-pale',
        140,
        23
      ),

      f(
        'od5',
        'Conseil de District',
        47,
        44,
        'event'
      ),

      p(
        'od6',
        'Passage des Vents',
        47,
        38,
        'bleu-pale',
        140,
        23
      )

    ]
  },


  /* ==========================================================
     7 — RECTANGLE OUEST

     Départ : Carrefour Ouest

                  → → → → →
                  ↑       ↓
                  ↑       ↓
             ← ← OUEST

     Boucle extérieure vers Gare Centrale.
     ========================================================== */

  'ouest-jardins': {

    name: 'Boucle des jardins',

    from: 'ouest',
    to: 'central',

    nodes: [

      /*
       * BAS — vers la gauche
       */

      f(
        'oj1',
        'Fête de Rue',
        19,
        50,
        'event'
      ),

      p(
        'oj2',
        'Cours Saphir',
        13,
        50,
        'bleu-fonce',
        260,
        46
      ),

      p(
        'oj3',
        'Promenade Indigo',
        7,
        50,
        'bleu-fonce',
        280,
        50
      ),

      f(
        'oj4',
        'Vide-greniers',
        7,
        44,
        'event'
      ),


      /*
       * CÔTÉ GAUCHE — montée
       */

      p(
        'oj5',
        'Bois du Levant',
        7,
        38,
        'vert-fonce',
        100,
        16
      ),

      f(
        'oj6',
        'Coopérative Locale',
        7,
        32,
        'company'
      ),

      p(
        'oj7',
        'Clos des Chênes',
        7,
        26,
        'vert-fonce',
        110,
        18
      ),


      /*
       * HAUT — vers la droite
       */

      p(
        'oj8',
        'Parc des Cèdres',
        13,
        26,
        'vert-fonce',
        120,
        20
      ),

      f(
        'oj9',
        'Actualités du Parc',
        19,
        26,
        'event'
      ),

      p(
        'oj10',
        'Promenade Azur',
        25,
        26,
        'bleu-pale',
        120,
        20
      ),

      f(
        'oj11',
        'Prime régionale',
        31,
        26,
        'salary'
      ),

      p(
        'oj12',
        'Passage des Vents',
        37,
        26,
        'bleu-pale',
        140,
        23
      ),

      f(
        'oj13',
        'Tribune du Centre',
        43,
        26,
        'event'
      ),

      p(
        'oj14',
        'Place des Nuages',
        47,
        26,
        'bleu-pale',
        140,
        23
      )

    ]
  }

};


/* ============================================================
   LISTE DE TOUTES LES CASES
   ============================================================ */

export const ALL_NODES =
  Object.values(ROUTES)
    .flatMap(
      route => route.nodes
    );


/* ============================================================
   ACCÈS RAPIDE PAR ID
   ============================================================ */

export const NODE_BY_ID =
  Object.fromEntries(
    ALL_NODES.map(
      node => [
        node.id,
        node
      ]
    )
  );


/* ============================================================
   COULEURS DES QUARTIERS
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