import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ContactButtons from "@/components/ContactButtons";
import { EMAIL, EMAIL_MAILTO, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/infos";

// WhatsApp activé pour ce fichier, quel que soit le réglage de la démo (cas désactivé : whatsapp.test.tsx).
vi.mock("@/lib/infos", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/infos")>()),
  WHATSAPP_ENABLED: true,
}));

describe("ContactButtons", () => {
  it("propose l'appel avec le numéro écrit en toutes lettres", () => {
    render(<ContactButtons />);
    expect(screen.getByRole("link", { name: `Appeler le ${PHONE_DISPLAY}` })).toHaveAttribute("href", PHONE_TEL);
  });

  it("ouvre WhatsApp dans un nouvel onglet, sans transmettre la page d'origine", () => {
    render(<ContactButtons />);
    const link = screen.getByRole("link", { name: "WhatsApp" });
    expect(link).toHaveAttribute("href", WHATSAPP_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("n'affiche l'e-mail que sur demande", () => {
    const { rerender } = render(<ContactButtons />);
    expect(screen.queryByRole("link", { name: EMAIL })).toBeNull();
    rerender(<ContactButtons showEmail />);
    expect(screen.getByRole("link", { name: EMAIL })).toHaveAttribute("href", EMAIL_MAILTO);
  });
});
