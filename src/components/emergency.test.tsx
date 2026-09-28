import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/infos";
import { importFresh } from "@/test/importFresh";

const ON = { EMERGENCY: { enabled: true, situations: ["Panne totale", "Odeur de brûlé"] } };
const OFF = { EMERGENCY: { enabled: false, situations: ["Panne totale"] } };

/** Aucun délai, horaire ni prix : « 2 h », « 30 min », « 24h/24 », « 24/7 », « 50 € »… */
const PROMISE = /\d+\s*(h\b|heures?|min|€)|24\s*[h/]/i;

describe("EmergencyBanner", () => {
  it("urgence confirmée : bandeau d'appel en haut de page", async () => {
    const { default: EmergencyBanner } = await importFresh(() => import("@/components/EmergencyBanner"), { infos: ON });
    render(<EmergencyBanner />);
    expect(screen.getByRole("link", { name: /^Urgence électrique \? Appelez le / })).toHaveAttribute("href", PHONE_TEL);
  });

  it("urgence non confirmée : rien", async () => {
    const { default: EmergencyBanner } = await importFresh(() => import("@/components/EmergencyBanner"), { infos: OFF });
    const { container } = render(<EmergencyBanner />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("EmergencySection", () => {
  it("liste les situations, rappelle de couper le courant et propose l'appel", async () => {
    const { default: EmergencySection } = await importFresh(() => import("@/components/EmergencySection"), { infos: ON });
    render(<EmergencySection />);
    expect(screen.getByRole("heading", { level: 2, name: "Une urgence électrique ?" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["Panne totale", "Odeur de brûlé"]);
    expect(screen.getByText(/coupez le courant au disjoncteur général/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: `Appeler en urgence le ${PHONE_DISPLAY}` })).toHaveAttribute("href", PHONE_TEL);
  });

  it("ne promet aucun délai, horaire ni prix", async () => {
    const { default: EmergencySection } = await importFresh(() => import("@/components/EmergencySection"), { infos: ON });
    const { container } = render(<EmergencySection />);
    expect(container.textContent).not.toMatch(PROMISE);
  });

  it("motif circuit autour des situations, jamais sous le titre ; cartes opaques (le câble ne se voit pas au travers)", async () => {
    const { default: EmergencySection } = await importFresh(() => import("@/components/EmergencySection"), { infos: ON });
    const { container } = render(<EmergencySection />);
    const circuit = container.querySelector(".circuit-current")!.closest("svg")!;
    const items = screen.getAllByRole("listitem");
    expect(circuit.parentElement).toContainElement(items[0]);
    expect(circuit.parentElement).not.toContainElement(screen.getByRole("heading", { level: 2 }));
    for (const item of items) expect(item.className).not.toMatch(/\bbg-[\w-]+\/\d+/);
  });

  it("urgence non confirmée : rien", async () => {
    const { default: EmergencySection } = await importFresh(() => import("@/components/EmergencySection"), { infos: OFF });
    const { container } = render(<EmergencySection />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("EmergencyCallout", () => {
  it("urgence confirmée : encart et bouton d'appel", async () => {
    const { default: EmergencyCallout } = await importFresh(() => import("@/components/EmergencyCallout"), { infos: ON });
    const { container } = render(<EmergencyCallout />);
    expect(screen.getByText("Besoin d’une intervention rapide ?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: `Appeler le ${PHONE_DISPLAY}` })).toHaveAttribute("href", PHONE_TEL);
    expect(container.textContent).not.toMatch(PROMISE);
  });

  it("motif circuit autour du bouton d'appel, sur grand écran seulement, jamais sous le texte", async () => {
    const { default: EmergencyCallout } = await importFresh(() => import("@/components/EmergencyCallout"), { infos: ON });
    const { container } = render(<EmergencyCallout />);
    const circuit = container.querySelector(".circuit-current")!.closest("svg")!;
    expect(circuit.parentElement).toContainElement(screen.getByRole("link"));
    expect(circuit.parentElement).not.toContainElement(screen.getByText("Besoin d’une intervention rapide ?"));
    expect(circuit).toHaveClass("hidden", "lg:block");
  });

  it("urgence non confirmée : rien", async () => {
    const { default: EmergencyCallout } = await importFresh(() => import("@/components/EmergencyCallout"), { infos: OFF });
    const { container } = render(<EmergencyCallout />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("MobileCallBar", () => {
  it("appel et WhatsApp, fixés en bas de l'écran sur mobile seulement", async () => {
    const { default: MobileCallBar } = await importFresh(() => import("@/components/MobileCallBar"), {
      infos: { WHATSAPP_ENABLED: true },
    });
    const { container } = render(<MobileCallBar />);
    expect(container.firstChild).toHaveClass("fixed", "bottom-0", "sm:hidden");
    expect(screen.getByRole("link", { name: `Appeler le ${PHONE_DISPLAY}` })).toHaveAttribute("href", PHONE_TEL);
    expect(screen.getByRole("link", { name: "Écrire sur WhatsApp" })).toHaveAttribute("target", "_blank");
  });
});
