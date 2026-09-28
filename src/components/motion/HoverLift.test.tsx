import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HoverLift from "@/components/motion/HoverLift";
import { setReducedMotion } from "@/test/reducedMotion";

describe("HoverLift", () => {
  it("soulève l'élément au survol", async () => {
    render(
      <HoverLift className="h-full">
        <p>Carte</p>
      </HoverLift>,
    );
    const wrapper = screen.getByText("Carte").parentElement!;
    expect(wrapper).toHaveClass("h-full");
    await userEvent.hover(wrapper);
    await waitFor(() => expect(wrapper.style.transform).toContain("translateY"));
  });

  it("« Réduire les animations » : aucun déplacement au survol", async () => {
    setReducedMotion(true);
    render(
      <HoverLift>
        <p>Carte</p>
      </HoverLift>,
    );
    const wrapper = screen.getByText("Carte").parentElement!;
    await userEvent.hover(wrapper);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(wrapper.style.transform).toMatch(/^(none|)$/);
  });
});
