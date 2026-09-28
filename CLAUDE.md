@AGENTS.md

# Site vitrine d'électricien (base artisan-template)

Base réutilisable : chaque copie devient le site d'un électricien certifié IRVE (qui peut proposer
d'autres services) et vit ensuite de façon indépendante.

**Cette copie : démo de GT ELECTRICITE 42** (Civens, 42110 — Feurs et alentours). Services actifs : bornes
IRVE (mis en avant), rénovation (avec VMC double flux), dépannage. Sources vérifiées le 28/09/2026 :
RGE Qualit'EnR « Ventilation + » (pose de ventilation double flux, jusqu'au 25/02/2027, open data ADEME) ;
Qualifelec IRVE probatoire P1/P2 (dernier certificat trouvé : fin de cycle 23/11/2024, affiché à la demande
du commanditaire, à faire confirmer). Non confirmés : WhatsApp (désactivé), urgence (désactivée), avis
(aucun), couleurs et logo (valeurs du template).

## Stack

Next.js 16.3.6 (App Router, Turbopack, `output: "export"`) · React 19.2.8 · Tailwind CSS v4 (tokens `@theme`
dans `src/app/globals.css`, pas de `tailwind.config`) · TypeScript strict, alias `@/*` · motion 13.4.4 ·
react-compare-slider 4.0.0 · Vitest 5 + Testing Library (jsdom).

## Règles impératives

- Aucun formulaire, aucun backend : contact par téléphone (`tel:`), WhatsApp (`wa.me`), e-mail.
- Aucun chiffre inventé : ni délai d'intervention, ni « 24h/24 », ni prix, ni années d'expérience.
  `STATS` reste vide sans confirmation de l'artisan.
- Urgence (`EMERGENCY.enabled`) uniquement si l'artisan la confirme : bandeau, section et encarts
  disparaissent sinon.
- Un seul avis, réel, cité mot pour mot (`TESTIMONIAL`), sinon `null`.
- Photos stock : illustrent le métier, jamais présentées comme un chantier de l'artisan ; servies depuis
  `public/images/stock/` (≤ 400 Ko), jamais en lien direct. Illustrations du template : SVG sans texte,
  une paire avant/après propre à chaque service (bloc `CONTENT` de sa page) ; acceptées en démo,
  bloquées par `check:demo` quand `DEMO_MODE = false`.
- Texte affiché : espace insécable devant `: ; ? !` et dans « » (` ` en chaîne JS, `&nbsp;` en JSX),
  vérifié par `pages.test.tsx`.
- `DEMO_MODE = true` jusqu'à la livraison (noindex + bandeau).
- Toute donnée de contact vient de `src/lib/infos.ts`.
- Services : catalogue de 8 dans `src/lib/services.ts` ; `actif: false` = absent partout et page 404
  (`ensureActive` en tête du rendu de chaque page de service). Listes : toujours `ACTIVE_SERVICES`.
  Pages communes réservées : `contact`, `mentions-legales`.
- Tokens : `brand`, `brand-deep`, `accent` (jaune électrique), `accent-light` (survol), `accent-dark`
  (jaune lisible sur blanc), `highlight` (fond sombre seulement), `ink`, `muted`, `surface`, `line`,
  `font-display`, `font-sans`.
  Changer les valeurs, jamais les noms ; `contrast.test.ts` vérifie la lisibilité.
- Animations en CSS (`globals.css` : `cta-pulse`, `cta-shine`, `cta-ring`, `pulse-dot`, `circuit-current`,
  `callbar-in`, `hero-rise`), toutes coupées par `prefers-reduced-motion`. Wrappers `motion` pour les
  apparitions au défilement (`Reveal`, `HoverLift`, `AnimatedStat`). Comparateur avant/après : réduction
  des animations en CSS (`[data-rcs="root"]`), pas par le hook.
- Commentaires marqueurs, listés par `npm run check:demo` : `À REMPLACER` (bloquant en CI, comme les valeurs
  d'exemple du template) et `À LA LIVRAISON` (rappel). Jamais dans un texte explicatif.
- Tests : ne jamais dépendre des valeurs de la démo (lire la valeur courante ou la fixer via `importFresh`).

## Next 16.3.6 : points vérifiés

- `sitemap.ts` et `robots.ts` exportent `dynamic = "force-static"`, sinon le build échoue.
- `next/image` et `<img>` n'appliquent pas le basePath : toujours `asset()` (`src/lib/infos.ts`).
- `priority` est déprécié sur `next/image` : `preload`.
- `notFound()` dans une page statique : l'export publie la page 404 avec `noindex`.
- `next lint` n'existe plus : `npm run lint` lance `eslint`.
- `npm run dev` passe par webpack (`--webpack`) : en dev, Turbopack échoue sur la police Sora de
  `next/font/google` (« queries have exactly one entry »). Le build reste en Turbopack.
- `data-scroll-behavior="smooth"` sur `<html>` (Next 16 ne neutralise plus le défilement doux).
- Définir `openGraph` dans une page remplace tout le bloc du layout.
- `vitest.config.mts` fixe `__NEXT_TRAILING_SLASH` pour que `next/link` garde la barre finale en test.
- Pour tout le reste : lire `node_modules/next/dist/docs/` avant de coder.

## Architecture

```
src/lib/         infos.ts (source unique, EMERGENCY, LEGAL) · services.ts (catalogue, ACTIVE_SERVICES) · stockPhotos.ts
src/components/  Navbar · Footer · Section (Container, SectionHeading, CtaBand) · ContactButtons · CallButton ·
                 CircuitLines · SplitHero · ProcessSteps · ServiceCards · StatsBand · EmergencyBanner ·
                 EmergencySection · EmergencyCallout · MobileCallBar · CertBadges · Testimonial · DemoBanner ·
                 CurrentYear · Logo · Icons · StockImage
src/components/motion/  Reveal · HoverLift · BeforeAfterSlider · AnimatedStat
src/app/         layout · page (accueil) · <slug>/page (8 services) · contact · mentions-legales · sitemap · robots
src/test/        setup · importFresh · reducedMotion · phone
scripts/         check-demo.mjs
```

## Commandes

`npm run dev` (port 3012, config `gt-electricite-42` de `.claude/launch.json`) · `npm test` · `npm run lint` ·
`npm run typecheck` · `npm run build` (→ `out/`) · `npm run check:demo`.

## Pièges de l'environnement

- Node.js est dans `C:\Program Files\nodejs` et n'est pas toujours dans le PATH.
- npm 11 bloque les scripts `postinstall` (avertissements `allow-scripts`) : attendu, ne rien approuver.
- Git Bash réécrit `/…` en chemin Windows dans les variables d'environnement : build local avec basePath =
  `MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/nom npm run build`.
- Le panneau Navigateur lit le `.claude/launch.json` du dossier de départ de la session.
- Panneau Navigateur masqué : rien n'est dessiné (captures blanches, animations figées). Demander à
  l'utilisateur de l'afficher (Ctrl+Maj+B) avant une vérification visuelle, ou vérifier par le DOM.
