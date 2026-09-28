import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { DELIVERY_MARKER, ILLUSTRATION, MARKER, findMarkers, readDemoMode, scan, summarize } from "./check-demo.mjs";

let dir = "";

afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = "";
});

describe("check-demo", () => {
  it("repère chaque ligne marquée, avec son numéro", () => {
    const content = ["const a = 1;", `// ${MARKER} : téléphone`, "const b = 2;", `/* ${MARKER} */`].join("\n");
    expect(findMarkers(content, "infos.ts")).toEqual([
      { file: "infos.ts", line: 2, text: `// ${MARKER} : téléphone`, kind: "demo" },
      { file: "infos.ts", line: 4, text: `/* ${MARKER} */`, kind: "demo" },
    ]);
  });

  it("gère les fins de ligne Windows", () => {
    expect(findMarkers(`a\r\n// ${MARKER}\r\n`, "x.ts")).toEqual([
      { file: "x.ts", line: 2, text: `// ${MARKER}`, kind: "demo" },
    ]);
  });

  it("distingue les rappels pour la livraison", () => {
    expect(findMarkers(`// ${DELIVERY_MARKER} : domaine`, "infos.ts")).toEqual([
      { file: "infos.ts", line: 1, text: `// ${DELIVERY_MARKER} : domaine`, kind: "livraison" },
    ]);
  });

  it("repère une valeur d'exemple restée en place même sans marqueur", () => {
    const content = ['export const PHONE_DISPLAY = "01 23 45 67 89";', 'export const EMAIL = "contact@durand.fr";'].join("\n");
    expect(findMarkers(content, "infos.ts")).toEqual([
      { file: "infos.ts", line: 1, text: 'export const PHONE_DISPLAY = "01 23 45 67 89";', kind: "exemple" },
    ]);
  });

  it("seuls les rappels de livraison laissent passer la démo", () => {
    const delivery = { file: "a.ts", line: 1, text: "x", kind: "livraison" } as const;
    const demo = { file: "b.ts", line: 2, text: "y", kind: "demo" } as const;
    const sample = { file: "c.ts", line: 3, text: "z", kind: "exemple" } as const;
    expect(summarize([delivery], true)).toEqual({ blocking: [], delivery: [delivery], illustrations: [], exitCode: 0 });
    expect(summarize([demo, delivery, sample], true)).toEqual({
      blocking: [demo, sample],
      delivery: [delivery],
      illustrations: [],
      exitCode: 1,
    });
  });

  it("illustrations SVG du template : acceptées en démo, bloquantes quand DEMO_MODE vaut false", () => {
    const line = `  hero: { src: "${ILLUSTRATION}hero.svg", alt: "Illustration" },`;
    const [illustration] = findMarkers(line, "stockPhotos.ts");
    expect(illustration.kind).toBe("illustration");
    expect(findMarkers('  hero: { src: "/images/stock/tableau.webp" },', "stockPhotos.ts")).toEqual([]);

    expect(summarize([illustration], true)).toEqual({
      blocking: [],
      delivery: [],
      illustrations: [illustration],
      exitCode: 0,
    });
    expect(summarize([illustration], false)).toEqual({
      blocking: [illustration],
      delivery: [],
      illustrations: [],
      exitCode: 1,
    });
  });

  it("lit DEMO_MODE dans infos.ts (true par défaut)", () => {
    expect(readDemoMode("export const DEMO_MODE = true;")).toBe(true);
    expect(readDemoMode("export const DEMO_MODE = false;")).toBe(false);
    expect(readDemoMode("")).toBe(true);
  });

  it("parcourt les sources .ts, .tsx, .css et .svg, sans les tests ni les autres fichiers", () => {
    dir = mkdtempSync(path.join(tmpdir(), "check-demo-"));
    mkdirSync(path.join(dir, "app", "contact"), { recursive: true });
    writeFileSync(path.join(dir, "app", "contact", "page.tsx"), `// ${MARKER}`);
    writeFileSync(path.join(dir, "app", "globals.css"), `/* ${MARKER} */`);
    writeFileSync(path.join(dir, "app", "icon.svg"), `<!-- ${MARKER} -->`);
    writeFileSync(path.join(dir, "app", "page.test.tsx"), `// ${MARKER}`);
    writeFileSync(path.join(dir, "notes.md"), MARKER);

    const files = scan(dir).map((found) => path.relative(dir, path.resolve(found.file)));
    expect(files).toEqual([
      path.join("app", "contact", "page.tsx"),
      path.join("app", "globals.css"),
      path.join("app", "icon.svg"),
    ]);
  });
});
