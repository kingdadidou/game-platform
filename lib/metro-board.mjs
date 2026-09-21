/*
 * ============================================================
 * MÉTROPOLE — CARTE OFFICIELLE
 * ============================================================
 *
 * Géométrie et types de cases reconstruits à partir
 * de la carte Excel de référence.
 *
 * Repères Excel :
 *
 * Gare Centrale          = J5
 * Carrefour de l'Ouest   = F8
 * Carrefour de l'Est     = N8
 * Gare du Midi           = J11
 *
 * Sens général : horaire.
 */


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
   COORDONNÉES DE LA GRILLE EXCEL
   ============================================================

   Colonnes :

   B  = 4
   C  = 10
   D  = 16
   E  = 21
   F  = 26
   G  = 32
   H  = 38
   I  = 44
   J  = 49
   K  = 54
   L  = 59
   M  = 64
   N  = 69
   O  = 75
   P  = 81
   Q  = 88
   R  = 95

   Lignes :

   1  = 6
   2  = 14
   3  = 21
   4  = 28
   5  = 35
   6  = 41
   7  = 47
   8  = 53
   9  = 59
   10 = 64
   11 = 68
   12 = 75
   13 = 82
   14 = 89
   15 = 94
   ============================================================ */


/* ============================================================
   GARES
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
   CASES PARTAGÉES
   ============================================================ */


/*
 * ------------------------------------------------------------
 * HAUT DU RECTANGLE PRINCIPAL
 *
 * F5 → J5
 * ------------------------------------------------------------
 */

const F5 = f(
  'f5',
  'Prime régionale',
  26,
  35,
  'salary'
);

const G5 = p(
  'g5',
  'Promenade Azur',
  32,
  35,
  'bleu-pale',
  120,
  20
);

const H5 = f(
  'h5',
  'Actualités locales',
  38,
  35,
  'event'
);

const I5 = p(
  'i5',
  'Esplanade du Ciel',
  44,
  35,
  'bleu-pale',
  140,
  23
);


/*
 * ------------------------------------------------------------
 * HAUT DROIT DU PRINCIPAL
 *
 * J5 → N5
 * ------------------------------------------------------------
 */

const K5 = f(
  'k5',
  'Chronique Civique',
  54,
  35,
  'event'
);

const L5 = p(
  'l5',
  'Square Tilleul',
  59,
  35,
  'vert-pale',
  160,
  26
);

const M5 = p(
  'm5',
  'Promenade des Serres',
  64,
  35,
  'vert-pale',
  180,
  30
);

const N5 = p(
  'n5',
  'Passage Corail',
  69,
  35,
  'rose-pale',
  200,
  34
);


/*
 * ------------------------------------------------------------
 * CÔTÉ DROIT PRINCIPAL
 * ------------------------------------------------------------
 */

const N6 = p(
  'n6',
  'Galerie des Fleurs',
  69,
  41,
  'rose-pale',
  220,
  38
);

const N7 = f(
  'n7',
  'Banque Centrale',
  69,
  47,
  'bank'
);


/*
 * ------------------------------------------------------------
 * BAS GAUCHE PRINCIPAL
 * ------------------------------------------------------------
 */

const F9 = f(
  'f9',
  'Banque de l’Ouest',
  26,
  59,
  'bank'
);

const F10 = p(
  'f10',
  'Avenue Cobalt',
  26,
  64,
  'bleu-fonce',
  280,
  50
);

const F11 = p(
  'f11',
  'Port Indigo',
  26,
  68,
  'bleu-fonce',
  260,
  46
);

const G11 = p(
  'g11',
  'Docks de Granit',
  32,
  68,
  'gris',
  230,
  40
);

const H11 = p(
  'h11',
  'Halles d’Étain',
  38,
  68,
  'gris',
  250,
  44
);

const I11 = f(
  'i11',
  'Dépêche du Soir',
  44,
  68,
  'event'
);


/* ============================================================
   ROUTES
   ============================================================ */

export const ROUTES = {


  /* ==========================================================
     CENTRAL → EST
     TRAJET DIRECT
     ========================================================== */

  'central-direct': {

    name: 'Boulevard direct',

    from: 'central',

    to: 'est',

    nodes: [

      K5,

      L5,

      M5,

      N5,

      N6,

      N7

    ]
  },


  /* ==========================================================
     CENTRAL → EST
     BOUCLE NORD

     Excel :

     J5
     ↑
     J4
     J3
     J2
     J1
     → K1 → L1 → M1 → N1
                         ↓
                         N2
                         N3
                         N4
                         N5
                         N6
                         N7
                         ↓
                         N8
     ========================================================== */

  'central-nord': {

    name: 'Boucle panoramique',

    from: 'central',

    to: 'est',

    nodes: [

      /* J4 */

      p(
        'j4',
        'Passage des Vents',
        49,
        28,
        'bleu-pale',
        140,
        23
      ),


      /* J3 */

      p(
        'j3',
        'Allée des Brumes',
        49,
        21,
        'bleu-pale',
        120,
        20
      ),


      /* J2 */

      f(
        'j2',
        'Kiosque du Matin',
        49,
        14,
        'event'
      ),


      /* J1 */

      f(
        'j1',
        'Archives Municipales',
        49,
        6,
        'event'
      ),


      /* K1 */

      p(
        'k1',
        'Jardin des Arts',
        54,
        6,
        'vert-pale',
        160,
        26
      ),


      /* L1 */

      f(
        'l1',
        'Manufacture Horizon',
        59,
        6,
        'company'
      ),


      /* M1 */

      p(
        'm1',
        'Parc des Verrières',
        64,
        6,
        'vert-pale',
        180,
        30
      ),


      /* N1 */

      p(
        'n1',
        'Domaine des Pins',
        69,
        6,
        'vert-pale',
        200,
        34
      ),


      /* N2 */

      f(
        'n2',
        'Tribune Publique',
        69,
        14,
        'event'
      ),


      /* N3 */

      p(
        'n3',
        'Rue des Amandiers',
        69,
        21,
        'rose-pale',
        200,
        34
      ),


      /* N4 */

      f(
        'n4',
        'Place du Hasard',
        69,
        28,
        'event'
      ),


      /* N5 */

      N5,


      /* N6 */

      N6,


      /* N7 */

      N7

    ]
  },


  /* ==========================================================
     EST → SUD
     BOUCLE EST

     Excel :

     N8 → O8 → P8 → Q8 → R8
                         ↓
                         R9
                         R10
                         R11
            ← Q11 ← P11 ←
     N11 ← O11

     puis :
     M11 → L11 → K11 → J11
     ========================================================== */

  'est-riviera': {

    name: 'Riviera orientale',

    from: 'est',

    to: 'sud',

    nodes: [

      /* O8 */

      f(
        'o8',
        'Journal de l’Est',
        75,
        53,
        'event'
      ),


      /* P8 */

      p(
        'p8',
        'Terrasse Pêche',
        81,
        53,
        'rose-pale',
        200,
        34
      ),


      /* Q8 */

      p(
        'q8',
        'Belvédère Saumon',
        88,
        53,
        'rose-pale',
        220,
        38
      ),


      /* R8 */

      f(
        'r8',
        'Carnaval des Quais',
        95,
        53,
        'event'
      ),


      /* R9 */

      p(
        'r9',
        'Boulevard Fuchsia',
        95,
        59,
        'magenta',
        280,
        48
      ),


      /* R10 */

      f(
        'r10',
        'Ateliers Magnétiques',
        95,
        64,
        'company'
      ),


      /* R11 */

      p(
        'r11',
        'Place Framboise',
        95,
        68,
        'magenta',
        300,
        54
      ),


      /* Q11 */

      p(
        'q11',
        'Rue Grenadine',
        88,
        68,
        'magenta',
        320,
        60
      ),


      /* P11 */

      f(
        'p11',
        'Bourse aux Projets',
        81,
        68,
        'event'
      ),


      /* O11 */

      p(
        'o11',
        'Faubourg Rubis',
        75,
        68,
        'bordeaux',
        350,
        68
      ),


      /* N11 */

      f(
        'n11',
        'Prime municipale',
        69,
        68,
        'salary'
      ),


      /* M11 */

      p(
        'm11',
        'Cour des Vignerons',
        64,
        68,
        'bordeaux',
        350,
        68
      ),


      /* L11 */

      f(
        'l11',
        'Actualités du Midi',
        59,
        68,
        'event'
      ),


      /* K11 */

      p(
        'k11',
        'Quai des Grenats',
        54,
        68,
        'bordeaux',
        380,
        76
      )

    ]
  },


  /* ==========================================================
     SUD → OUEST
     TRAJET DIRECT

     J11 → I11 → H11 → G11 → F11
                                ↑
                                F10
                                F9
                                ↑
                                F8
     ========================================================== */

  'sud-direct': {

    name: 'Traverse express',

    from: 'sud',

    to: 'ouest',

    nodes: [

      I11,

      H11,

      G11,

      F11,

      F10,

      F9

    ]
  },


  /* ==========================================================
     SUD → OUEST
     BOUCLE SUD

     J11
      ↓
     J12
     J13
     J14
     J15
      ← I15 ← H15 ← G15 ← F15
                              ↑
                             F14
                             F13
                             F12
                             F11
                             F10
                             F9
                              ↑
                             F8
     ========================================================== */

  'sud-quais': {

    name: 'Boucle des quais',

    from: 'sud',

    to: 'ouest',

    nodes: [

      /* J12 */

      p(
        'j12',
        'Impasse Carmin',
        49,
        75,
        'bordeaux',
        350,
        68
      ),


      /* J13 */

      p(
        'j13',
        'Tour des Vendanges',
        49,
        82,
        'bordeaux',
        380,
        76
      ),


      /* J14 */

      f(
        'j14',
        'Inspection Urbaine',
        49,
        89,
        'event'
      ),


      /* J15 */

      f(
        'j15',
        'Marché Nocturne',
        49,
        94,
        'event'
      ),


      /* I15 */

      p(
        'i15',
        'Entrepôts d’Ardoise',
        44,
        94,
        'gris',
        230,
        40
      ),


      /* H15 */

      f(
        'h15',
        'Compagnie des Eaux',
        38,
        94,
        'company'
      ),


      /* G15 */

      p(
        'g15',
        'Halles du Sud',
        32,
        94,
        'gris',
        250,
        44
      ),


      /* F15 */

      p(
        'f15',
        'Docks de Granit',
        26,
        94,
        'gris',
        230,
        40
      ),


      /* F14 */

      f(
        'f14',
        'Avis de Travaux',
        26,
        89,
        'event'
      ),


      /* F13 */

      p(
        'f13',
        'Boulevard Saphir',
        26,
        82,
        'bleu-fonce',
        280,
        50
      ),


      /* F12 */

      f(
        'f12',
        'Chronique des Quais',
        26,
        75,
        'event'
      ),


      /* F11 */

      F11,


      /* F10 */

      F10,


      /* F9 */

      F9

    ]
  },


  /* ==========================================================
     OUEST → CENTRAL
     TRAJET DIRECT

     F8
     ↑
     F7
     F6
     F5
     → G5 → H5 → I5 → J5
     ========================================================== */

  'ouest-direct': {

    name: 'Axe civique',

    from: 'ouest',

    to: 'central',

    nodes: [

      /* F7 */

      p(
        'f7',
        'Parc du Levant',
        26,
        47,
        'vert-fonce',
        120,
        20
      ),


      /* F6 */

      f(
        'f6',
        'Coopérative Locale',
        26,
        41,
        'company'
      ),


      /* F5 */

      F5,


      /* G5 */

      G5,


      /* H5 */

      H5,


      /* I5 */

      I5

    ]
  },


  /* ==========================================================
     OUEST → CENTRAL
     BOUCLE OUEST

     F8
      ← E8 ← D8 ← C8 ← B8
                         ↑
                         B7
                         B6
                         B5
                         → C5 → D5 → E5 → F5
                                          →
                                          G5
                                          H5
                                          I5
                                          J5
     ========================================================== */

  'ouest-jardins': {

    name: 'Boucle des jardins',

    from: 'ouest',

    to: 'central',

    nodes: [

      /* E8 */

      f(
        'e8',
        'Fête de Rue',
        21,
        53,
        'event'
      ),


      /* D8 */

      p(
        'd8',
        'Promenade Indigo',
        16,
        53,
        'bleu-fonce',
        280,
        50
      ),


      /* C8 */

      p(
        'c8',
        'Cours Saphir',
        10,
        53,
        'bleu-fonce',
        260,
        46
      ),


      /* B8 */

      f(
        'b8',
        'Vide-greniers',
        4,
        53,
        'event'
      ),


      /* B7 */

      p(
        'b7',
        'Clos des Chênes',
        4,
        47,
        'vert-fonce',
        110,
        18
      ),


      /* B6 */

      f(
        'b6',
        'Manufacture de l’Ouest',
        4,
        41,
        'company'
      ),


      /* B5 */

      p(
        'b5',
        'Bois du Levant',
        4,
        35,
        'vert-fonce',
        100,
        16
      ),


      /* C5 */

      p(
        'c5',
        'Parc des Cèdres',
        10,
        35,
        'vert-fonce',
        120,
        20
      ),


      /* D5 */

      f(
        'd5',
        'Actualités du Parc',
        16,
        35,
        'event'
      ),


      /* E5 */

      p(
        'e5',
        'Passage des Arts',
        21,
        35,
        'bleu-pale',
        120,
        20
      ),


      /* F5 */

      F5,


      /* G5 */

      G5,


      /* H5 */

      H5,


      /* I5 */

      I5

    ]
  }

};


/* ============================================================
   CASES VISUELLES SUPPLÉMENTAIRES
   ============================================================

   Ces cases existent sur la carte Excel mais ne sont pas
   nécessairement traversées par la route principale actuelle.

   On les rattache aux routes correspondantes pour qu'elles
   soient bien présentes sur le plateau.
   ============================================================ */


/*
 * EST — côté gauche du rectangle
 *
 * N9  = ROSE
 * N10 = ENTREPRISE
 *
 * Elles sont ajoutées ici comme informations de plateau.
 */

export const EXTRA_NODES = [

  p(
    'n9',
    'Place Rose',
    69,
    59,
    'magenta',
    300,
    54
  ),

  f(
    'n10',
    'Compagnie de l’Est',
    69,
    64,
    'company'
  )

];


/* ============================================================
   INDEX
   ============================================================ */

export const ALL_NODES = [

  ...Object.values(ROUTES)
    .flatMap(route => route.nodes),

  ...EXTRA_NODES

];


/*
 * Déduplication par ID.
 *
 * Certaines portions sont communes à deux itinéraires :
 * par exemple N5-N7, F5-I5 ou F9-F11.
 */

export const UNIQUE_NODES = Array.from(
  new Map(
    ALL_NODES.map(
      node => [node.id, node]
    )
  ).values()
);


export const NODE_BY_ID =
  Object.fromEntries(
    UNIQUE_NODES.map(
      node => [node.id, node]
    )
  );


/* ============================================================
   COULEURS
   ============================================================ */

export const GROUP_COLORS = {

  /* VERT CLAIR */
  'vert-pale': '#bad7ad',

  /* ROUGE CLAIR */
  'rose-pale': '#f3a4a2',

  /* ROSE */
  'magenta': '#d40867',

  /* MARRON */
  'bordeaux': '#9c1634',

  /* GRIS */
  'gris': '#65717a',

  /* BLEU */
  'bleu-fonce': '#1767dc',

  /* VERT */
  'vert-fonce': '#187e2a',

  /* BLEU CLAIR */
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