import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ACTIVE_SERVICES, RESERVED_SLUGS, SERVICES, ensureActive, getService, servicePath } from "@/lib/services";

const APP_DIR = path.join(process.cwd(), "src", "app");
const slugs = SERVICES.map((service) => service.slug);

/** Dossiers de src/app qui contiennent une page, hors pages communes (contact, mentions légales…). */
const servicePageDirs = readdirSync(APP_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(path.join(APP_DIR, entry.name, "page.tsx")))
  .map((entry) => entry.name)
  .filter((name) => !(RESERVED_SLUGS as readonly string[]).includes(name));

/** `digest` de l'erreur levée par `fn` (celle de notFound() vaut « NEXT_HTTP_ERROR_FALLBACK;404 »). */
function digestOf(fn: () => unknown): string | undefined {
  try {
    fn();
  } catch (error) {
    return (error as { digest?: string }).digest;
  }
  return undefined;
}

describe("services.ts", () => {
  it("déclare au moins un service actif", () => {
    expect(ACTIVE_SERVICES.length).toBeGreaterThan(0);
  });

  it("n'a pas deux fois le même slug", () => {
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(slugs)("« %s » est un segment d'URL valide et non réservé", (slug) => {
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(RESERVED_SLUGS).not.toContain(slug);
  });

  it.each(slugs)("« %s » a sa page écrite à la main (src/app/<slug>/page.tsx)", (slug) => {
    expect(existsSync(path.join(APP_DIR, slug, "page.tsx"))).toBe(true);
  });

  it("chaque page de service est déclarée dans services.ts (actif ou non)", () => {
    expect([...servicePageDirs].sort()).toEqual([...slugs].sort());
  });

  it("les pages communes sont réservées : contact et mentions légales", () => {
    expect(RESERVED_SLUGS).toEqual(expect.arrayContaining(["contact", "mentions-legales"]));
  });

  it("ACTIVE_SERVICES ne garde que les services actifs, dans l'ordre", () => {
    expect(ACTIVE_SERVICES).toEqual(SERVICES.filter((service) => service.actif));
  });

  it("servicePath donne l'URL avec la barre finale", () => {
    expect(servicePath("bornes-irve")).toBe("/bornes-irve/");
  });

  it("getService signale clairement un slug inconnu", () => {
    expect(() => getService("inconnu")).toThrow("Service inconnu : « inconnu »");
  });

  it("ensureActive laisse passer un service actif", () => {
    const service = { ...SERVICES[0], actif: true };
    expect(ensureActive(service)).toBe(service);
  });

  it("ensureActive : service désactivé → page 404, non publiée", () => {
    expect(digestOf(() => ensureActive({ ...SERVICES[0], actif: false }))).toBe("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
