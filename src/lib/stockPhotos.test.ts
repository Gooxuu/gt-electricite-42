import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { STOCK_PHOTOS } from "@/lib/stockPhotos";

/** Au-delà, la démo devient lente sur mobile (site statique : aucune optimisation à la volée). */
const MAX_BYTES = 400 * 1024;
const FORMATS = [".webp", ".jpg", ".jpeg", ".avif", ".svg"];
const entries = Object.entries(STOCK_PHOTOS);

describe("stockPhotos.ts", () => {
  it.each(entries)("« %s » est servie depuis public/images/stock/, jamais en lien direct", (_, photo) => {
    expect(photo.src).toMatch(/^\/images\/stock\/[^/]+$/);
  });

  it.each(entries)("« %s » : fichier présent, au bon format, 400 Ko maximum", (_, photo) => {
    const file = path.join(process.cwd(), "public", photo.src);
    expect(existsSync(file)).toBe(true);
    expect(FORMATS).toContain(path.extname(file).toLowerCase());
    expect(statSync(file).size).toBeLessThanOrEqual(MAX_BYTES);
  });

  it.each(entries)("« %s » a un texte alternatif et un crédit", (_, photo) => {
    expect(photo.alt.trim()).not.toBe("");
    expect(photo.credit.trim()).not.toBe("");
  });

  it.each(entries.filter(([, photo]) => photo.src.endsWith(".svg")))(
    "« %s » : illustration sans aucun texte (il passerait derrière les titres)",
    (_, photo) => {
      expect(readFileSync(path.join(process.cwd(), "public", photo.src), "utf8")).not.toMatch(/<text\b/);
    },
  );
});
