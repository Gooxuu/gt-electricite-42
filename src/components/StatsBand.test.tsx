import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatsBand from "@/components/StatsBand";

describe("StatsBand", () => {
  it("n'affiche rien sans chiffre confirmé par l'artisan", () => {
    const { container } = render(<StatsBand stats={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("affiche chaque chiffre avec son libellé", () => {
    render(
      <StatsBand
        stats={[
          { value: 15, suffix: " ans", label: "d'expérience" },
          { value: 300, suffix: "+", label: "chantiers réalisés" },
        ]}
      />,
    );
    expect(screen.getByText("d'expérience")).toBeInTheDocument();
    expect(screen.getByText("chantiers réalisés")).toBeInTheDocument();
    expect(screen.getByText("15 ans", { selector: ".sr-only" })).toBeInTheDocument();
    expect(screen.getByText("300+", { selector: ".sr-only" })).toBeInTheDocument();
  });
});
