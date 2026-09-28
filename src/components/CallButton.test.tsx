import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CallButton from "@/components/CallButton";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/infos";

describe("CallButton", () => {
  it("appelle le numéro de l'artisan, écrit en toutes lettres", () => {
    render(<CallButton />);
    expect(screen.getByRole("link", { name: `Appeler le ${PHONE_DISPLAY}` })).toHaveAttribute("href", PHONE_TEL);
  });

  it("libellé personnalisable", () => {
    render(<CallButton label="Appeler en urgence le" />);
    expect(screen.getByRole("link", { name: `Appeler en urgence le ${PHONE_DISPLAY}` })).toBeInTheDocument();
  });

  it("porte les animations d'appel : halo, reflet, combiné qui sonne", () => {
    render(<CallButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("cta-pulse", "cta-shine");
    expect(link.querySelector("svg")).toHaveClass("cta-ring");
  });
});
