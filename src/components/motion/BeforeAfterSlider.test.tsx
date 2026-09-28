import { act, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import BeforeAfterSlider from "@/components/motion/BeforeAfterSlider";
import type { StockPhoto } from "@/lib/stockPhotos";
import { importFresh } from "@/test/importFresh";
import { setReducedMotion } from "@/test/reducedMotion";

const BEFORE: StockPhoto = { src: "/images/stock/avant.svg", alt: "Tableau électrique avant", credit: "test" };
const AFTER: StockPhoto = { src: "/images/stock/apres.svg", alt: "Tableau électrique après", credit: "test" };

const load = (basePath: string) =>
  importFresh(() => import("@/components/motion/BeforeAfterSlider"), { env: { NEXT_PUBLIC_BASE_PATH: basePath } });

describe("BeforeAfterSlider", () => {
  it("affiche les deux photos, les étiquettes et une poignée accessible en français", async () => {
    const { default: BeforeAfterSlider } = await load("");
    render(<BeforeAfterSlider before={BEFORE} after={AFTER} />);
    expect(screen.getByAltText(BEFORE.alt)).toBeInTheDocument();
    expect(screen.getByAltText(AFTER.alt)).toBeInTheDocument();
    expect(screen.getByText("Avant")).toBeInTheDocument();
    expect(screen.getByText("Après")).toBeInTheDocument();
    const handle = screen.getByRole("slider");
    expect(handle).toHaveAccessibleName(/comparer avant et après/);
    expect(handle).toHaveAttribute("tabindex", "0");
  });

  it("préfixe les photos avec le basePath GitHub Pages", async () => {
    const { default: BeforeAfterSlider } = await load("/ma-demo");
    render(<BeforeAfterSlider before={BEFORE} after={AFTER} />);
    expect(screen.getByAltText(BEFORE.alt)).toHaveAttribute("src", "/ma-demo/images/stock/avant.svg");
    expect(screen.getByAltText(AFTER.alt)).toHaveAttribute("src", "/ma-demo/images/stock/apres.svg");
  });

  it("charge les photos en différé : elles sont sous la ligne de flottaison, le héros passe en premier", () => {
    render(<BeforeAfterSlider before={BEFORE} after={AFTER} />);
    for (const alt of [BEFORE.alt, AFTER.alt]) {
      expect(screen.getByAltText(alt)).toHaveAttribute("loading", "lazy");
      expect(screen.getByAltText(alt)).toHaveAttribute("decoding", "async");
    }
  });

  it("aucun écart d'hydratation quand le visiteur a activé « Réduire les animations »", async () => {
    // Au build, la préférence du visiteur est inconnue : le HTML statique est rendu sans réduction.
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = renderToString(<BeforeAfterSlider before={BEFORE} after={AFTER} />);

    setReducedMotion(true);
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, <BeforeAfterSlider before={BEFORE} after={AFTER} />);
    });
    const logged = errors.mock.calls.flat().join(" ");
    errors.mockRestore();
    root?.unmount();
    container.remove();
    expect(logged).not.toMatch(/didn't match|hydrat/i);
  });
});
