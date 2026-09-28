import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Reveal from "@/components/motion/Reveal";
import { setReducedMotion } from "@/test/reducedMotion";

describe("Reveal", () => {
  it("porte la classe « reveal » (cible du <noscript> du layout)", () => {
    render(
      <Reveal className="mt-4">
        <p>Bonjour</p>
      </Reveal>,
    );
    expect(screen.getByText("Bonjour").parentElement).toHaveClass("reveal", "mt-4");
  });

  it("devient pleinement visible une fois entré dans l'écran", async () => {
    render(
      <Reveal>
        <p>Contenu</p>
      </Reveal>,
    );
    const wrapper = screen.getByText("Contenu").parentElement!;
    await waitFor(() => expect(wrapper.style.opacity).toBe("1"), { timeout: 2000 });
  });

  it("« Réduire les animations » : visible immédiatement, sans déplacement", async () => {
    setReducedMotion(true);
    render(
      <Reveal>
        <p>Contenu</p>
      </Reveal>,
    );
    const wrapper = screen.getByText("Contenu").parentElement!;
    await waitFor(() => expect(wrapper.style.opacity).toBe("1"), { timeout: 200 });
    expect(wrapper.style.transform).toMatch(/^(none|)$/);
  });
});
