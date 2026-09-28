import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(path.join(process.cwd(), "src", "app", "globals.css"), "utf8");
const REDUCED = "@media (prefers-reduced-motion: reduce)";
const reduced = css.slice(css.indexOf(REDUCED));

/** Noms communs à toutes les démos : les composants n'utilisent que ceux-là. */
const TOKENS = [
  "--color-brand",
  "--color-brand-deep",
  "--color-accent",
  "--color-accent-light",
  "--color-accent-dark",
  "--color-highlight",
  "--color-ink",
  "--color-muted",
  "--color-surface",
  "--color-line",
  "--font-sans",
  "--font-display",
];

/** Animations à couper quand le visiteur demande moins d'animations. */
const ANIMATED = [
  ".hero-rise",
  ".cta-ring",
  ".cta-pulse::before",
  ".cta-shine",
  ".pulse-dot::after",
  ".circuit-current",
  ".callbar-in",
  '[data-rcs="root"]',
];

describe("globals.css", () => {
  it.each(TOKENS)("définit le token %s", (token) => {
    expect(css).toMatch(new RegExp(`${token}\\s*:`));
  });

  it("contient un bloc « Réduire les animations »", () => {
    expect(css).toContain(REDUCED);
  });

  it.each(ANIMATED)("« Réduire les animations » neutralise %s", (selector) => {
    expect(reduced).toContain(selector);
  });
});
