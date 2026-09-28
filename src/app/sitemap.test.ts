import { afterEach, describe, expect, it, vi } from "vitest";
import { ACTIVE_SERVICES, SERVICES, servicePath } from "@/lib/services";
import { importFresh } from "@/test/importFresh";

const SITE = "https://exemple.github.io/ma-demo";

afterEach(() => {
  vi.doUnmock("@/lib/services");
  vi.resetModules();
});

describe("sitemap.xml", () => {
  it("liste l'accueil, chaque service actif et le contact, sur le domaine du site", async () => {
    const { default: sitemap } = await importFresh(() => import("@/app/sitemap"), {
      env: { NEXT_PUBLIC_SITE_URL: `${SITE}/` },
    });
    expect(sitemap().map((entry) => entry.url)).toEqual(
      ["/", ...ACTIVE_SERVICES.map((service) => servicePath(service.slug)), "/contact/", "/mentions-legales/"].map(
        (path) => `${SITE}${path}`,
      ),
    );
  });

  it("n'inclut jamais un service désactivé", async () => {
    vi.resetModules();
    vi.doMock("@/lib/services", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/lib/services")>();
      const services = actual.SERVICES.map((service, index) => (index === 0 ? { ...service, actif: false } : service));
      return { ...actual, SERVICES: services, ACTIVE_SERVICES: services.filter((service) => service.actif) };
    });
    const { default: sitemap } = await import("@/app/sitemap");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith(servicePath(SERVICES[0].slug)))).toBe(false);
    expect(urls.some((url) => url.endsWith(servicePath(SERVICES[1].slug)))).toBe(SERVICES[1].actif);
  });
});
