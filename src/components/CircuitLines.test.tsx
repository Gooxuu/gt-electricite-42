import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CircuitLines from "@/components/CircuitLines";

describe("CircuitLines", () => {
  it("motif décoratif, ignoré des lecteurs d'écran", () => {
    const { container } = render(<CircuitLines className="text-white" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("pointer-events-none", "text-white");
  });

  it("un courant parcourt chacune des pistes", () => {
    const { container } = render(<CircuitLines />);
    const currents = container.querySelectorAll(".circuit-current");
    expect(currents.length).toBeGreaterThan(0);
    expect(container.querySelectorAll("path")).toHaveLength(currents.length * 2);
  });
});
