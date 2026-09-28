import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import ContactButtons from "@/components/ContactButtons";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Navbar from "@/components/Navbar";
import { CtaBand } from "@/components/Section";
import { SERVICES } from "@/lib/services";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/lib/infos", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/infos")>()),
  WHATSAPP_ENABLED: false,
}));

it("WHATSAPP_ENABLED = false : plus aucun lien WhatsApp nulle part", async () => {
  render(
    <>
      <Navbar services={SERVICES} />
      <ContactButtons showEmail />
      <CtaBand title="Titre" text="Texte" />
      <Footer services={SERVICES} />
      <MobileCallBar />
    </>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }));
  expect(document.querySelector('a[href*="wa.me"]')).toBeNull();
  expect(screen.queryByText(/WhatsApp/)).toBeNull();
});
