import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/components/Footer";
import { BRAND, EMAIL, EMAIL_MAILTO, PHONE_DISPLAY, PHONE_TEL } from "@/lib/infos";
import { SERVICES, servicePath } from "@/lib/services";

describe("Footer", () => {
  it("liste un lien par service puis Contact", () => {
    render(<Footer services={SERVICES} />);
    const list = screen.getByRole("heading", { name: "Le site" }).nextElementSibling as HTMLElement;
    expect(within(list).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      ...SERVICES.map((service) => servicePath(service.slug)),
      "/contact/",
    ]);
  });

  it("donne le téléphone et l'e-mail", () => {
    render(<Footer services={SERVICES} />);
    expect(screen.getByRole("link", { name: PHONE_DISPLAY })).toHaveAttribute("href", PHONE_TEL);
    expect(screen.getByRole("link", { name: EMAIL })).toHaveAttribute("href", EMAIL_MAILTO);
  });

  it("copyright à l'année en cours", () => {
    render(<Footer services={SERVICES} />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent(`© ${new Date().getFullYear()} ${BRAND}`);
  });

  it("mène aux mentions légales", () => {
    render(<Footer services={SERVICES} />);
    expect(screen.getByRole("link", { name: "Mentions légales" })).toHaveAttribute("href", "/mentions-legales/");
  });
});
