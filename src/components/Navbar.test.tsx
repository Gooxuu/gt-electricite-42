import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "@/components/Navbar";
import type { Service } from "@/lib/services";
import { STOCK_PHOTOS, type StockPhotoId } from "@/lib/stockPhotos";

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
vi.mock("@/lib/infos", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/infos")>()),
  WHATSAPP_ENABLED: true,
}));

const PHOTO = Object.keys(STOCK_PHOTOS)[0] as StockPhotoId;
const makeServices = (count: number): Service[] =>
  Array.from({ length: count }, (_, i) => ({
    slug: `service-${i + 1}`,
    title: `Service numéro ${i + 1}`,
    menuLabel: `S${i + 1}`,
    teaser: `Phrase ${i + 1}.`,
    icon: "bolt",
    highlight: i === 1,
    photo: PHOTO,
    actif: true,
  }));

const desktopNav = () => screen.getByRole("navigation", { name: "Navigation principale" });
const linkNames = (scope: HTMLElement) => within(scope).getAllByRole("link").map((link) => link.textContent);
const servicesToggle = () => within(desktopNav()).getByRole("button", { name: "Nos services" });

beforeEach(() => {
  nav.pathname = "/";
});

describe("Navbar", () => {
  it("jusqu'à 3 services : un lien par service (libellé court) puis Contact", () => {
    render(<Navbar services={makeServices(3)} />);
    expect(linkNames(desktopNav())).toEqual(["S1", "S2", "S3", "Contact"]);
    expect(within(desktopNav()).getByRole("link", { name: "S1" })).toHaveAttribute("href", "/service-1/");
  });

  it("sans libellé court : le titre du service", () => {
    const services = makeServices(1).map((service) => ({ ...service, menuLabel: undefined }));
    render(<Navbar services={services} />);
    expect(linkNames(desktopNav())).toEqual(["Service numéro 1", "Contact"]);
  });

  it("distingue le service mis en avant", () => {
    render(<Navbar services={makeServices(3)} />);
    expect(within(desktopNav()).getByRole("link", { name: "S2" })).toHaveAttribute("data-highlight", "true");
    expect(within(desktopNav()).getByRole("link", { name: "S1" })).not.toHaveAttribute("data-highlight");
  });

  it("signale la page courante", () => {
    nav.pathname = "/service-3/";
    render(<Navbar services={makeServices(3)} />);
    expect(within(desktopNav()).getByRole("link", { name: "S3" })).toHaveAttribute("aria-current", "page");
  });

  it("au-delà de 3 services : menu déroulant avec icône, titre et phrase courte", async () => {
    const user = userEvent.setup();
    render(<Navbar services={makeServices(8)} />);
    expect(servicesToggle()).toHaveAttribute("aria-expanded", "false");
    expect(linkNames(desktopNav())).toEqual(["Contact"]);

    await user.click(servicesToggle());
    expect(servicesToggle()).toHaveAttribute("aria-expanded", "true");
    expect(within(desktopNav()).getAllByRole("link")).toHaveLength(9);
    const first = within(desktopNav()).getByRole("link", { name: /Service numéro 1/ });
    expect(first).toHaveAttribute("href", "/service-1/");
    expect(first).toHaveTextContent("Phrase 1.");
    expect(first.querySelector("svg")).not.toBeNull();
  });

  it("Échap depuis un lien du menu déroulant : menu fermé, focus rendu au bouton", async () => {
    const user = userEvent.setup();
    render(<Navbar services={makeServices(8)} />);
    await user.click(servicesToggle());
    await user.tab();
    expect(document.activeElement).toBe(within(desktopNav()).getByRole("link", { name: /Service numéro 1/ }));

    await user.keyboard("{Escape}");
    expect(servicesToggle()).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(servicesToggle());
  });

  it("clic en dehors : menu déroulant fermé", async () => {
    const user = userEvent.setup();
    render(<Navbar services={makeServices(8)} />);
    await user.click(servicesToggle());
    await user.click(document.body);
    expect(servicesToggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("clic en dehors sans perte de focus (Safari, iPad : le bouton ne prend pas le focus) : menu fermé", async () => {
    const user = userEvent.setup();
    render(<Navbar services={makeServices(8)} />);
    await user.click(servicesToggle());
    fireEvent.pointerDown(document.body);
    expect(servicesToggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("changement de page : menu déroulant et menu mobile refermés", async () => {
    const user = userEvent.setup();
    const services = makeServices(8);
    const { rerender } = render(<Navbar services={services} />);
    // Menu mobile d'abord : un clic sur son bouton fermerait le menu déroulant (clic en dehors).
    await user.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    await user.click(servicesToggle());
    expect(servicesToggle()).toHaveAttribute("aria-expanded", "true");

    nav.pathname = "/service-2/";
    rerender(<Navbar services={services} />);
    expect(servicesToggle()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Navigation mobile" })).toBeNull();
  });

  it.each([
    ["depuis le bouton du menu", false],
    ["depuis un lien du menu", true],
  ])("menu mobile, Échap %s : menu fermé, focus rendu au bouton", async (_, fromLink) => {
    const user = userEvent.setup();
    render(<Navbar services={makeServices(2)} />);
    await user.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    if (fromLink) within(screen.getByRole("navigation", { name: "Navigation mobile" })).getAllByRole("link")[0].focus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "Navigation mobile" })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Ouvrir le menu" }));
  });

  it("menu mobile : services (libellé court), Contact et WhatsApp ; se referme au choix d'un lien", async () => {
    const user = userEvent.setup();
    render(<Navbar services={makeServices(2)} />);
    await user.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
    const mobile = screen.getByRole("navigation", { name: "Navigation mobile" });
    expect(linkNames(mobile)).toEqual(["S1", "S2", "Contact", "Écrire sur WhatsApp"]);

    await user.click(within(mobile).getByRole("link", { name: "Contact" }));
    expect(screen.queryByRole("navigation", { name: "Navigation mobile" })).toBeNull();
  });
});
