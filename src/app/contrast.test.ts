import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.join(process.cwd(), "src", "app", "globals.css"), "utf8");
const WHITE = "#ffffff";

/** Valeur hexadécimale d'un token de couleur de globals.css. */
function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token --color-${name} introuvable ou pas au format #rrggbb`);
  return match[1];
}

const color = (value: string) => (value.startsWith("#") ? value : token(value));

/** Couleur semi-transparente posée sur un fond (ex. `text-white/60` : mix(WHITE, 0.6, "brand-deep")). */
function mix(front: string, alpha: number, back: string): string {
  const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(color(hex).slice(i, i + 2), 16));
  const [f, b] = [channels(front), channels(back)];
  return `#${f.map((c, i) => Math.round(alpha * c + (1 - alpha) * b[i]).toString(16).padStart(2, "0")).join("")}`;
}

/** Luminance relative WCAG 2.x. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(color(a)), luminance(color(b))].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** [description, couleur du texte, couleur du fond] — texte courant : 4,5:1 minimum (WCAG AA). */
const PAIRS: [string, string, string][] = [
  ["texte principal sur blanc", "ink", WHITE],
  ["titres sur blanc", "brand", WHITE],
  ["texte secondaire sur blanc", "muted", WHITE],
  ["jaune foncé (texte, icônes) sur blanc", "accent-dark", WHITE],
  ["texte sur bouton jaune", "brand-deep", "accent"],
  ["texte sur bouton jaune survolé", "brand-deep", "accent-light"],
  ["jaune sur fond sombre", "accent", "brand-deep"],
  ["bleu « courant » sur fond sombre", "highlight", "brand-deep"],
  ["texte principal sur fond clair", "ink", "surface"],
  ["titres sur fond clair", "brand", "surface"],
  ["texte secondaire sur fond clair", "muted", "surface"],
  ["titres sur pastille jaune pâle", "brand", mix("accent", 0.2, WHITE)],
  ["blanc sur fond sombre", WHITE, "brand-deep"],
  ["blanc sur bleu nuit", WHITE, "brand"],
  // Texte blanc atténué (/60 à /85 : pied de page, héros, bandeaux) : /60 est le cas le plus faible.
  ["blanc atténué /60 sur fond sombre", mix(WHITE, 0.6, "brand-deep"), "brand-deep"],
  ["blanc atténué /60 sur bleu nuit", mix(WHITE, 0.6, "brand"), "brand"],
];

/** Icônes (éléments graphiques, sans texte) : 3:1 minimum (WCAG 1.4.11). */
const ICON_PAIRS: [string, string, string][] = [
  ["icônes jaune foncé sur blanc", "accent-dark", WHITE],
  ["icônes jaune foncé sur fond clair", "accent-dark", "surface"],
];

describe("contrastes de la palette (globals.css)", () => {
  it.each(PAIRS)("%s : 4,5:1 minimum", (_, text, background) => {
    expect(contrast(text, background)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(ICON_PAIRS)("%s : 3:1 minimum", (_, icon, background) => {
    expect(contrast(icon, background)).toBeGreaterThanOrEqual(3);
  });
});
