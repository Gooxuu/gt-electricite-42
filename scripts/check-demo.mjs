/**
 * Liste ce qui reste à personnaliser dans cette démo (`npm run check:demo`) :
 * - les lignes de src/ marquées pour la démo, et les valeurs d'exemple du template restées en place
 *   (même si leur marqueur a été retiré) : bloquant, code de sortie 1, la CI refuse de déployer ;
 * - les rappels marqués pour la livraison (domaine, vraies photos, fin du mode démo) : listés, non bloquants ;
 * - les illustrations SVG du template : acceptées tant que DEMO_MODE vaut true, bloquantes ensuite
 *   (un site livré montre des photos).
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const MARKER = "À REMPLACER";
export const DELIVERY_MARKER = "À LA LIVRAISON";

/** Valeurs d'exemple du template : leur présence trahit une personnalisation oubliée. */
export const SAMPLE_VALUES = [
  "Artisan Exemple",
  "01 23 45 67 89",
  "+33123456789",
  "contact@example.com",
  "rue de l'Exemple",
  "Texte exact d'un vrai avis client",
];

/** Chemin des illustrations SVG du template (src/lib/stockPhotos.ts). */
export const ILLUSTRATION = "/images/stock/exemple-";

const EXTENSIONS = new Set([".ts", ".tsx", ".css", ".svg"]);

/** @typedef {{ file: string, line: number, text: string, kind: "demo" | "livraison" | "exemple" | "illustration" }} Finding */

/**
 * @param {string} text
 * @returns {Finding["kind"] | null}
 */
function kindOf(text) {
  if (text.includes(MARKER)) return "demo";
  if (text.includes(DELIVERY_MARKER)) return "livraison";
  if (SAMPLE_VALUES.some((value) => text.includes(value))) return "exemple";
  if (text.includes(ILLUSTRATION)) return "illustration";
  return null;
}

/**
 * @param {string} content
 * @param {string} file
 * @returns {Finding[]}
 */
export function findMarkers(content, file) {
  return content.split(/\r?\n/).flatMap((text, index) => {
    const kind = kindOf(text);
    return kind ? [{ file, line: index + 1, text: text.trim(), kind }] : [];
  });
}

/**
 * @param {string} dir
 * @returns {Finding[]}
 */
export function scan(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && EXTENSIONS.has(path.extname(entry.name)))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .filter((file) => !/\.test\.tsx?$/.test(file))
    .sort()
    .flatMap((file) => findMarkers(readFileSync(file, "utf8"), path.relative(process.cwd(), file)));
}

/**
 * @param {Finding[]} found
 * @param {boolean} demoMode
 * @returns {{ blocking: Finding[], delivery: Finding[], illustrations: Finding[], exitCode: number }}
 */
export function summarize(found, demoMode) {
  const allowed = (/** @type {Finding} */ item) =>
    item.kind === "livraison" || (demoMode && item.kind === "illustration");
  const blocking = found.filter((item) => !allowed(item));
  const delivery = found.filter((item) => item.kind === "livraison");
  const illustrations = demoMode ? found.filter((item) => item.kind === "illustration") : [];
  return { blocking, delivery, illustrations, exitCode: blocking.length > 0 ? 1 : 0 };
}

/**
 * Valeur de DEMO_MODE dans le contenu de src/lib/infos.ts (true si elle est introuvable).
 * @param {string} infos
 */
export function readDemoMode(infos) {
  return !/export const DEMO_MODE\s*=\s*false\b/.test(infos);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const src = path.join(process.cwd(), "src");
  const demoMode = readDemoMode(readFileSync(path.join(src, "lib", "infos.ts"), "utf8"));
  const { blocking, delivery, illustrations, exitCode } = summarize(scan(src), demoMode);
  if (blocking.length === 0) {
    console.log("Aucun contenu d'exemple restant : la démo est prête.");
  } else {
    console.log(`${blocking.length} élément(s) à personnaliser avant de montrer la démo :\n`);
    for (const { file, line, text } of blocking) console.log(`  ${file}:${line}  ${text}`);
  }
  if (delivery.length > 0) {
    console.log(`\n${delivery.length} rappel(s) pour la livraison (non bloquants) :\n`);
    for (const { file, line, text } of delivery) console.log(`  ${file}:${line}  ${text}`);
  }
  if (illustrations.length > 0) {
    const files = [...new Set(illustrations.map((item) => item.file))].join(", ");
    console.log(
      `\n${illustrations.length} illustration(s) SVG du template (${files}) : acceptées en démo,` +
        " à remplacer par des photos avant de passer DEMO_MODE à false.",
    );
  }
  process.exitCode = exitCode;
}
