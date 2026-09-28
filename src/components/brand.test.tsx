import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CurrentYear from "@/components/CurrentYear";
import { importFresh } from "@/test/importFresh";

const loadBanner = (infos: { DEMO_MODE: boolean; AGENCY_NAME?: string }) =>
  importFresh(() => import("@/components/DemoBanner"), { infos });

describe("DemoBanner", () => {
  it("mode démo : bandeau générique", async () => {
    const { default: DemoBanner } = await loadBanner({ DEMO_MODE: true, AGENCY_NAME: "" });
    render(<DemoBanner />);
    expect(screen.getByText("Maquette de démonstration — proposition de site")).toBeInTheDocument();
  });

  it("mode démo : nom de l'agence s'il est renseigné", async () => {
    const { default: DemoBanner } = await loadBanner({ DEMO_MODE: true, AGENCY_NAME: "Studio X" });
    render(<DemoBanner />);
    expect(screen.getByText("Maquette de démonstration proposée par Studio X")).toBeInTheDocument();
  });

  it("site livré : aucun bandeau", async () => {
    const { default: DemoBanner } = await loadBanner({ DEMO_MODE: false });
    const { container } = render(<DemoBanner />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Logo", () => {
  it("sans fichier : logo texte au nom de l'entreprise", async () => {
    const { default: Logo } = await importFresh(() => import("@/components/Logo"), {
      infos: { LOGO_FILE: null, BRAND: "Durand Élec" },
    });
    render(<Logo />);
    expect(screen.getByText("Durand Élec")).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("avec un fichier : image préfixée par le basePath", async () => {
    const { default: Logo } = await importFresh(() => import("@/components/Logo"), {
      env: { NEXT_PUBLIC_BASE_PATH: "/ma-demo" },
      infos: { LOGO_FILE: "/images/logo.svg", BRAND: "Durand Élec" },
    });
    render(<Logo />);
    expect(screen.getByRole("img", { name: "Durand Élec — logo" })).toHaveAttribute("src", "/ma-demo/images/logo.svg");
  });
});

describe("CurrentYear", () => {
  it("affiche l'année en cours (le copyright ne se fige jamais)", () => {
    render(<CurrentYear />);
    expect(screen.getByText(String(new Date().getFullYear()))).toBeInTheDocument();
  });
});
