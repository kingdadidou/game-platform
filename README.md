# Entre nous — Jeux de rôles cachés

Plateforme jouable de jeux entre amis, en français, construite avec Next.js 16 et React 19. Trois jeux originaux sont disponibles : **Conseil des Ombres**, **Le Dernier Conseil** et **Métropole**.

## Démarrer

```sh
npm install
npm run dev
```

Ouvrir http://localhost:3000, créer un salon avec un pseudo et partager son lien. Pour tester sur une seule machine, utiliser cinq onglets indépendants et rejoindre avec un pseudo différent dans chacun. Un onglet dupliqué peut hériter de la session du premier : ouvrir des onglets vierges. Le jeton de reconnexion est conservé dans sessionStorage, donc l’actualisation fonctionne mais pas la récupération après fermeture définitive de l’onglet.

Le Dernier Conseil est accessible sur `/dernier-conseil`. Il utilise ses propres salons et liens d’invitation ; un code créé pour un jeu ne peut pas rejoindre l’autre.

Métropole est accessible sur `/metropole`. Son plateau à quatre gares reprend la structure de la carte de référence : plusieurs boucles relient les quartiers et les joueurs choisissent leur itinéraire aux carrefours.

Sur un réseau local, les amis utilisent l’adresse IP du serveur et son port, sous réserve du pare-feu. Un lien localhost fonctionne uniquement sur la machine qui héberge le serveur.

## Fonctionnalités

- Accueil responsive, création et entrée dans un salon, invitations par code ou lien.
- 5 à 10 joueurs, état prêt, transfert de l’hôte quand il quitte avant le début.
- Chat, synchronisation toutes les 1,5 secondes et reconnexion après actualisation.
- Rôles secrets distribués côté serveur ; seuls les renseignements autorisés sont envoyés à chaque joueur.
- Équipes, votes à majorité stricte, décisions secrètes, missions, historique des votes, victoire et revanche.
- Jeu original : 3 missions réussies pour les Agents ; 3 missions sabotées ou 5 équipes refusées consécutivement pour les Ombres. Une mission échoue au premier sabotage, quel que soit le nombre de joueurs.
- Le Dernier Conseil : Gardiens, Conspirateurs et Prétendant, gouvernements élus, choix secrets de décrets, chaos électoral, veto et pouvoirs d’inspection, d’élection spéciale et de bannissement.
- Métropole : 2 à 6 investisseurs, choix de routes, huit quartiers, propriétés et entreprises, loyers, événements, primes, ventes, faillites et victoire au patrimoine après vingt journées.

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

## Stockage et limites de cette version

Le serveur conserve les salons dans `.data/rooms.json`, avec une file d’écriture et remplacement atomique du fichier. Les salons expirent 24 heures après leur dernière action. `.data` contient des jetons privés : ne pas publier ni versionner ce dossier.

Exécuter **un seul processus Node** sur un disque persistant. Ce stockage ne convient pas à un déploiement serverless, à plusieurs instances ou à plusieurs processus simultanés. La synchronisation utilise HTTP, pas encore WebSocket. Une lecture réécrit actuellement le fichier : cette version vise les petits tests entre amis.

Tous les joueurs doivent rester disponibles pendant une partie. Il n’y a pas encore de remplacement d’un joueur déconnecté, de chronomètre ni d’expulsion en cours de partie. Les noms sont des pseudonymes de session, sans comptes persistants. Avant ouverture publique : PostgreSQL, sessions durables, limitation de débit, gestion des déconnexions, modération et transport temps réel. Aucun déploiement public n’est inclus.

## Organisation

- `app/` : pages et API Next.js.
- `components/Lobby.tsx` : salon et interface du jeu.
- `server/engine.mjs` : règles et projection privée par joueur.
- `server/council-engine.mjs` : élections, décrets, rôles et pouvoirs du Dernier Conseil.
- `server/metro-engine.mjs` : déplacements, achats, loyers, dette et victoire de Métropole.
- `lib/metro-board.mjs` : géométrie, quartiers et cases du plateau.
- `server/store.mjs` : transactions du stockage local.
- `tests/engine.test.mjs` : règles, autorisations et confidentialité.
