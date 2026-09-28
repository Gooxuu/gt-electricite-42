import { render, screen, waitFor } from "@testing-library/react";
import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { setReducedMotion } from "@/test/reducedMotion";

function Probe() {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  return (
    <p ref={ref}>
      {inView ? "visible" : "caché"} · {reduce ? "réduit" : "normal"}
    </p>
  );
}

describe("environnement de test", () => {
  it("simule l'entrée dans l'écran (IntersectionObserver)", async () => {
    render(<Probe />);
    await waitFor(() => expect(screen.getByText(/visible/)).toBeInTheDocument());
  });

  it("pilote « Réduire les animations »", () => {
    setReducedMotion(true);
    render(<Probe />);
    expect(screen.getByText(/réduit/)).toBeInTheDocument();
  });

  it("remet la préférence par défaut entre deux tests", () => {
    render(<Probe />);
    expect(screen.getByText(/normal/)).toBeInTheDocument();
  });
});
