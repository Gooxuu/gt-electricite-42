import type { NextConfig } from "next";
import path from "path";

// Sur GitHub Pages en « project page », le site est servi sous /<nom-du-depot>.
// Vide pour un domaine à la racine (domaine personnalisé, Cloudflare Pages, FTP…).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Site 100 % statique : le dossier `out/` se dépose sur n'importe quel hébergeur.
  output: "export",
  trailingSlash: true,
  // L'optimisation d'images à la volée exige un serveur : les fichiers sont servis tels quels.
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
  // Fixe la racine du projet : Next ne doit pas remonter jusqu'au lockfile d'un dossier parent.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
