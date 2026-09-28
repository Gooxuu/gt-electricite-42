import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AnimatedStat from "@/components/motion/AnimatedStat";
import { setReducedMotion } from "@/test/reducedMotion";

const fr = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

describe("AnimatedStat", () => {
  it("donne aux lecteurs d'écran la valeur finale, formatée en français", () => {
    const { container } = render(<AnimatedStat value={1250} suffix=" chantiers" />);
    expect(container.querySelector(".sr-only")).toHaveTextContent(`${fr(1250)} chantiers`, {
      normalizeWhitespace: false,
    });
  });

  it("compte jusqu'à la valeur finale une fois dans l'écran", async () => {
    const { container } = render(<AnimatedStat value={40} suffix="+" duration={0.05} />);
    const visible = container.querySelector('[aria-hidden="true"]')!;
    await waitFor(() => expect(visible.textContent).toBe("40+"));
  });

  it("« Réduire les animations » : valeur finale d'emblée, jamais remise à 0", async () => {
    setReducedMotion(true);
    const { container } = render(<AnimatedStat value={12} suffix=" ans" />);
    const visible = container.querySelector('[aria-hidden="true"]')!;
    expect(visible.textContent).toBe("12 ans");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(visible.textContent).toBe("12 ans");
  });
});
