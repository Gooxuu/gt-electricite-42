/// <reference types="vite/client" />
import { render, screen } from "@testing-library/react";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ADDRESS, EMAIL, PHONE_TEL, SERVICE_AREA } from "@/lib/infos";
import { ACTIVE_SERVICES, SERVICES, servicePath } from "@/lib/services";
import { importFresh } from "@/test/importFresh";

type PageModule = { default: ComponentType; metadata?: Metadata };

/**
 * Toutes les pages du site (clés : « ./page.tsx », « ./contact/page.tsx »…).
 * Cast plutôt que `glob<PageModule>` : avec les types de Next chargés, la forme générique est refusée par tsc.
 */
const pages = import.meta.glob("./**/page.tsx") as Record<string, () => Promise<PageModule>>;

const NOT_FOUND = "NEXT_HTTP_ERROR_FALLBACK;404";
const serviceOf = (file: string) => SERVICES.find((service) => file === `./${service.slug}/page.tsx`);

/** Appelle la page comme une fonction : renvoie le `digest` de l'erreur levée (notFound) ou undefined. */
function notFoundDigest(Page: ComponentType): string | undefined {
  try {
    (Page as () => unknown)();
  } catch (error) {
    return (error as { digest?: string }).digest;
  }
  return undefined;
}

afterEach(() => {
  vi.doUnmock("@/lib/services");
  vi.resetModules();
});

describe("pages", () => {
  it.each(Object.keys(pages))("%s : un seul titre h1 et aucun formulaire (404 si service désactivé)", async (file) => {
    const { default: Page } = await pages[file]();
    if (serviceOf(file)?.actif === false) {
      expect(notFoundDigest(Page)).toBe(NOT_FOUND);
      return;
    }
    const { container } = render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelector("form, input, textarea, select")).toBeNull();
  });

  it.each(Object.keys(pages))("%s : espace insécable devant « : ; ? ! » et dans les guillemets", async (file) => {
    const { default: Page, metadata } = await pages[file]();
    if (serviceOf(file)?.actif === false) return;
    const { container } = render(<Page />);
    const texts = [
      container.textContent ?? "",
      metadata?.description ?? "",
      ...Array.from(container.querySelectorAll("img"), (img) => img.alt),
    ];
    for (const text of texts) expect(text).not.toMatch(/\S [:;?!»]|« /);
  });

  it("l'accueil mène à chaque service actif", async () => {
    const { default: Home } = await pages["./page.tsx"]();
    render(<Home />);
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    for (const service of ACTIVE_SERVICES) expect(hrefs).toContain(servicePath(service.slug));
  });

  it("la page contact existe", () => {
    expect(Object.keys(pages)).toContain("./contact/page.tsx");
  });

  it.each(SERVICES.map((service) => [service.slug, service.title] as const))(
    "/%s/ : le titre de l'onglet est le nom du service",
    async (slug, title) => {
      const { metadata } = await pages[`./${slug}/page.tsx`]();
      expect(metadata?.title).toBe(title);
    },
  );

  it.each(ACTIVE_SERVICES.map((service) => service.slug))(
    "/%s/ : comparateur avant/après avec la mention « Photos d’illustration »",
    async (slug) => {
      const { default: Page } = await pages[`./${slug}/page.tsx`]();
      render(<Page />);
      expect(screen.getByRole("slider")).toBeInTheDocument();
      expect(screen.getByText("Photos d’illustration.")).toBeInTheDocument();
    },
  );

  it("chaque page de service a son propre avant/après : aucune image partagée entre deux services", async () => {
    const owners = new Map<string, string>();
    for (const service of ACTIVE_SERVICES) {
      const { default: Page } = await pages[`./${service.slug}/page.tsx`]();
      const { container, unmount } = render(<Page />);
      const images = [...container.querySelectorAll('img[data-rcs="image"]')].map((img) => img.getAttribute("src")!);
      expect(images).toHaveLength(2);
      for (const src of images) {
        expect(owners.get(src) ?? service.slug, `${src} déjà utilisée par /${owners.get(src)}/`).toBe(service.slug);
        owners.set(src, service.slug);
      }
      unmount();
    }
  });

  it("accueil : l'avis client suit directement les services, avant l'urgence et l'avant/après", async () => {
    const { default: Home } = await importFresh(() => pages["./page.tsx"](), {
      infos: {
        TESTIMONIAL: { quote: "Avis de test.", source: "Google" },
        EMERGENCY: { enabled: true, situations: ["Panne"] },
      },
    });
    render(<Home />);
    const follows = (a: Node, b: Node) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    const quote = screen.getByText(/Avis de test\./);
    const lastService = servicePath(ACTIVE_SERVICES[ACTIVE_SERVICES.length - 1].slug);
    const serviceLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href") === lastService);
    expect(follows(serviceLinks[serviceLinks.length - 1], quote)).toBe(true);
    expect(follows(quote, screen.getByRole("heading", { level: 2, name: "Une urgence électrique ?" }))).toBe(true);
    expect(follows(quote, screen.getByRole("slider"))).toBe(true);
  });

  it("une page de service désactivée n'est pas publiée (page 404)", async () => {
    const [first] = SERVICES;
    vi.resetModules();
    vi.doMock("@/lib/services", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/lib/services")>();
      return { ...actual, getService: (slug: string) => ({ ...actual.getService(slug), actif: false }) };
    });
    const { default: Page } = await pages[`./${first.slug}/page.tsx`]();
    expect(notFoundDigest(Page)).toBe(NOT_FOUND);
  });

  it("urgence non confirmée : aucun bloc d'urgence sur l'accueil ni sur une page de service", async () => {
    const off = { EMERGENCY: { enabled: false, situations: [] } };
    for (const file of ["./page.tsx", `./${ACTIVE_SERVICES[0].slug}/page.tsx`]) {
      const { default: Page } = await importFresh(() => pages[file](), { infos: off });
      const { unmount } = render(<Page />);
      expect(screen.queryByText("Une urgence électrique ?")).toBeNull();
      expect(screen.queryByText("Besoin d’une intervention rapide ?")).toBeNull();
      expect(screen.queryByRole("link", { name: /^Appeler en urgence/ })).toBeNull();
      unmount();
    }
  });

  it("contact : téléphone, e-mail, adresse et zone d'intervention", async () => {
    const { default: Contact } = await pages["./contact/page.tsx"]();
    render(<Contact />);
    expect(screen.getAllByRole("link").some((link) => link.getAttribute("href") === PHONE_TEL)).toBe(true);
    expect(screen.getAllByRole("link", { name: EMAIL }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: ADDRESS })).toBeInTheDocument();
    expect(screen.getByText(SERVICE_AREA)).toBeInTheDocument();
  });
});
