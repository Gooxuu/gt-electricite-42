import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EMAIL, PHONE_TEL } from "@/lib/infos";
import { importFresh } from "@/test/importFresh";

const HOST = { hostName: "Hébergeur Test", hostAddress: "1 rue de l’Hébergement, 75000 Paris" };
const EMPTY = { companyName: "", legalForm: "", siret: "", publisher: "", ...HOST };
const FILLED = {
  companyName: "Durand Élec",
  legalForm: "SARL au capital de 10 000 €",
  siret: "123 456 789 00012",
  publisher: "Jean Durand",
  ...HOST,
};

const load = (legal: typeof EMPTY) =>
  importFresh(() => import("@/app/mentions-legales/page"), { infos: { LEGAL: legal } });

describe("mentions légales", () => {
  it("un titre h1 et les sections éditeur, hébergeur, données personnelles", async () => {
    const { default: Page } = await load(FILLED);
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: "Mentions légales" })).toBeInTheDocument();
    for (const name of ["Éditeur du site", "Hébergement", "Données personnelles"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });

  it("affiche les informations renseignées et l'hébergeur", async () => {
    const { default: Page } = await load(FILLED);
    render(<Page />);
    for (const value of Object.values(FILLED)) expect(screen.getByText(value)).toBeInTheDocument();
  });

  it("champs non renseignés : « Communiqué à la mise en ligne »", async () => {
    const { default: Page } = await load(EMPTY);
    render(<Page />);
    expect(screen.getAllByText("Communiqué à la mise en ligne")).toHaveLength(4);
  });

  it("rappelle le contact de l'éditeur", async () => {
    const { default: Page } = await load(FILLED);
    render(<Page />);
    expect(screen.getAllByRole("link").some((link) => link.getAttribute("href") === PHONE_TEL)).toBe(true);
    expect(screen.getByRole("link", { name: EMAIL })).toBeInTheDocument();
  });
});
