# Site vitrine d'électricien

Site statique (Next.js 16, export statique) : aucune base de données, aucun formulaire, aucun abonnement.
Le dossier `out/` produit par `npm run build` se dépose sur n'importe quel hébergeur ; le dépôt est prêt
pour GitHub Pages.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement (http://localhost:3012) |
| `npm test` | tests (Vitest) |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm run build` | site statique dans `out/` |
| `npm run check:demo` | liste ce qui reste à personnaliser (fichier:ligne) |

Node.js : `C:\Program Files\nodejs` (Git Bash : `export PATH="/c/Program Files/nodejs:$PATH"`).

## Personnaliser

`npm run check:demo` liste chaque valeur d'exemple encore en place (bloquant : la CI refuse de publier),
puis les rappels « À LA LIVRAISON » (non bloquants : domaine, vraies photos, mentions légales, fin du mode
démo). Retirer le commentaire marqueur une fois la vraie valeur saisie.

- `src/lib/infos.ts` : identité, coordonnées, WhatsApp, zone, type schema.org, certifications, avis réel
  (ou `null`), chiffres confirmés par l'artisan (sinon liste vide), **urgence** (`EMERGENCY.enabled` :
  seulement si l'artisan intervient en urgence ; aucun délai ni prix n'est affiché), **mentions légales**
  (`LEGAL`).
- `src/app/globals.css` : valeurs des couleurs (jamais les noms des tokens). `npm test` vérifie les
  contrastes : une palette illisible fait échouer les tests.
- `src/lib/services.ts` : catalogue de 8 services d'électricien. Passer `actif: false` pour ce que
  l'artisan ne fait pas : le service disparaît du menu, des cartes, du pied de page et du sitemap, et sa
  page n'est plus publiée (page 404). Adapter les textes des services gardés dans
  `src/app/<slug>/page.tsx`. La climatisation suppose l'attestation de capacité aux fluides frigorigènes.
- Pages communes, jamais des services : `contact`, `mentions-legales` (`RESERVED_SLUGS`).
- `src/lib/stockPhotos.ts` + `public/images/stock/` : voir « Photos ».
- Textes : accueil (`src/app/page.tsx` : héros, étapes), pages de service, `src/app/icon.svg`, logo
  (`LOGO_FILE`).

## Photos

- Photos stock gratuites pour usage commercial : Unsplash (hors images « Unsplash+ ») ou Pexels.
- Elles illustrent le métier : jamais présentées comme des chantiers de l'entreprise. Sous chaque
  comparateur avant/après, la mention « Photos d'illustration » reste tant que ce ne sont pas de vraies photos.
- Chaque page de service a sa propre paire avant/après (même cadrage, seul l'équipement change), déclarée
  dans le bloc `CONTENT` de la page : deux services ne partagent jamais une image (vérifié par les tests).
- Fichiers dans `public/images/stock/`, WebP ou JPEG, ~1600 px de large, **400 Ko max** (vérifié par les
  tests), puis déclaration dans `src/lib/stockPhotos.ts` (`src`, `alt` fidèle, `credit` = auteur + URL).
- Jamais de lien direct vers Unsplash ou Pexels.
- Les illustrations SVG du template (`exemple-*.svg`) sont acceptées dans une démo ; `npm run check:demo`
  les bloque dès que `DEMO_MODE` passe à `false` : un site livré montre des photos.

## Mise en ligne (GitHub Pages)

Dépôt GitHub, *Settings → Pages → Source : GitHub Actions*, puis push sur `main`. Le workflow refuse de
publier tant que `npm run check:demo` trouve du contenu d'exemple.

## Livraison

- `DEMO_MODE = false` dans `src/lib/infos.ts` : indexation autorisée, bandeau retiré.
- **Mentions légales** : remplir `LEGAL` (raison sociale, forme juridique, SIRET, directeur de la
  publication) et vérifier l'hébergeur.
- Domaine : `SITE_URL` ; avec un domaine personnalisé, retirer `NEXT_PUBLIC_BASE_PATH` et
  `NEXT_PUBLIC_SITE_URL` du workflow et ajouter `public/CNAME`.
- Remplacer les photos stock par les vraies photos ; retirer « Photos d'illustration ».
- `STATS` : uniquement des chiffres confirmés.
