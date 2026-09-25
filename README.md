# Entre nous — Jeux de rôles cachés

Plateforme jouable de jeux entre amis, en français, construite avec Next.js 16 et React 19. Quatre jeux originaux sont disponibles : **Conseil des Ombres**, **Le Dernier Conseil**, **Métropole** et **Le Traître à bord**.

## Démarrer

```sh
npm install
copy .env.example .env.local
npm run dev
```

Ouvrir http://localhost:3000, créer un salon avec un pseudo et partager son lien. Pour tester sur une seule machine, utiliser cinq onglets indépendants et rejoindre avec un pseudo différent dans chacun. Un onglet dupliqué peut hériter de la session du premier : ouvrir des onglets vierges. Le jeton de reconnexion est conservé dans sessionStorage, donc l’actualisation fonctionne mais pas la récupération après fermeture définitive de l’onglet.

Le Dernier Conseil est accessible sur `/dernier-conseil`. Il utilise ses propres salons et liens d’invitation ; un code créé pour un jeu ne peut pas rejoindre l’autre.

Métropole est accessible sur `/metropole`. Son plateau à quatre gares reprend la structure de la carte de référence : plusieurs boucles relient les quartiers et les joueurs choisissent leur itinéraire aux carrefours.

Le Traître à bord est accessible sur `/traitre-a-bord`. L’équipage répare le vaisseau pendant qu’un ou deux traîtres sabotent la mission ; chaque rotation se termine par une réunion et un vote d’expulsion.

Sur un réseau local, les amis utilisent l’adresse IP du serveur et son port, sous réserve du pare-feu. Un lien localhost fonctionne uniquement sur la machine qui héberge le serveur.

## Fonctionnalités

- Accueil responsive, création et entrée dans un salon, invitations par code ou lien.
- 5 à 10 joueurs, état prêt, transfert de l’hôte quand il quitte avant le début.
- Chat, synchronisation toutes les 1,5 secondes et reconnexion après actualisation.
- Rôles secrets distribués côté serveur ; seuls les renseignements autorisés sont envoyés à chaque joueur.
- Équipes, votes à majorité stricte, décisions secrètes, missions, historique des votes, victoire et revanche.
- Jeu original : 3 missions réussies pour les Agents ; 3 missions sabotées ou 5 équipes refusées consécutivement pour les Ombres. Une mission échoue au premier sabotage, quel que soit le nombre de joueurs.
- Le Dernier Conseil : Gardiens, Conspirateurs et Prétendant, gouvernements élus, choix secrets de décrets, chaos électoral, veto et pouvoirs d’inspection, d’élection spéciale et de bannissement.
- Métropole : 2 à 6 investisseurs, règles configurables, deux dés et doubles, déplacements continus aux gares, gares achetables, enchères, hypothèques, quartiers, maisons équilibrées, loyers, événements, échanges au Café des affaires, faillites et victoire au patrimoine après vingt journées.
- Le Traître à bord : 4 à 10 joueurs, rôles secrets, réparations simultanées, sabotages, réunions d’urgence, votes d’expulsion et journal de mission.

## Vérification

```sh
node --test tests/engine.test.mjs
node --test tests/council-engine.test.mjs
node tests/council-http-smoke.mjs
node --test tests/metro-engine.test.mjs
node tests/metro-http-smoke.mjs
npm run lint
npm run build
```

## Stockage et déploiement

Les salons sont conservés dans **Upstash Redis** et expirent après 24 heures d’inactivité. Configurez `KV_REST_API_URL` et `KV_REST_API_TOKEN` à partir de `.env.example`. Les actions qui modifient une partie utilisent un verrou Redis court afin que deux requêtes simultanées ne puissent pas écraser leurs changements. Les simples lectures de synchronisation ne réécrivent plus le stockage.

La production est déployée sur Vercel à l’adresse [game-platform-rosy.vercel.app](https://game-platform-rosy.vercel.app) et suit la branche `main` du dépôt GitHub. Pour un autre projet Vercel, ajoutez les deux variables Redis dans **Settings → Environment Variables** avant le déploiement.

La synchronisation utilise actuellement HTTP toutes les 1,4 à 1,5 seconde. Tous les joueurs doivent rester disponibles pendant une partie : il n’y a pas encore de remplacement d’un joueur déconnecté, de chronomètre ni d’expulsion en cours de partie. Les noms sont des pseudonymes de session, sans comptes persistants. Avant une ouverture à grande échelle, prévoir une limitation de débit, des sessions durables, de la modération et un transport temps réel.

## Organisation

- `app/` : pages et API Next.js.
- `components/Lobby.tsx` : salon et interface du jeu.
- `server/engine.mjs` : règles et projection privée par joueur.
- `server/council-engine.mjs` : élections, décrets, rôles et pouvoirs du Dernier Conseil.
- `server/metro-engine.mjs` : déplacements, achats, loyers, dette et victoire de Métropole.
- `lib/metro-board.mjs` : géométrie, quartiers et cases du plateau.
- `server/store.mjs` : lecture et transactions verrouillées dans Redis.
- `tests/engine.test.mjs` : règles, autorisations et confidentialité.
