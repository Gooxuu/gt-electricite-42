import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProcessSteps, { type Step } from "@/components/ProcessSteps";

const STEPS: Step[] = [
  { icon: "phone", title: "Vous appelez", text: "Premier texte." },
  { icon: "search", title: "Diagnostic", text: "Deuxième texte." },
  { icon: "wrench", title: "Intervention", text: "Troisième texte." },
];

describe("ProcessSteps", () => {
  it("une étape numérotée par entrée, dans l'ordre", () => {
    render(<ProcessSteps steps={STEPS} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Vous appelez",
      "Diagnostic",
      "Intervention",
    ]);
    expect(within(items[1]).getByText("2")).toBeInTheDocument();
    expect(within(items[2]).getByText("Troisième texte.")).toBeInTheDocument();
  });

  it("la ligne de circuit qui relie les étapes est décorative", () => {
    const { container } = render(<ProcessSteps steps={STEPS} />);
    expect(container.querySelector("svg[aria-hidden='true'] .circuit-current")).not.toBeNull();
  });
});
