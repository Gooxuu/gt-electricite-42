import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SplitHero from "@/components/SplitHero";
import { STOCK_PHOTOS, type StockPhotoId } from "@/lib/stockPhotos";
import { importFresh } from "@/test/importFresh";

const PHOTO = STOCK_PHOTOS[Object.keys(STOCK_PHOTOS)[0] as StockPhotoId];

describe("SplitHero", () => {
  it("titre h1, sur-titre, texte, image et bouton d'appel", () => {
    render(<SplitHero eyebrow="Électricien" title="Titre du héros" text="Texte du héros." photo={PHOTO} />);
    expect(screen.getByRole("heading", { level: 1, name: "Titre du héros" })).toBeInTheDocument();
    expect(screen.getByText("Électricien")).toBeInTheDocument();
    expect(screen.getByText("Texte du héros.")).toBeInTheDocument();
    expect(screen.getByAltText(PHOTO.alt)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Appeler le / })).toBeInTheDocument();
  });

  it("badge « Qualifié IRVE » par défaut, personnalisable ou masquable", () => {
    const { rerender } = render(<SplitHero eyebrow="E" title="T" text="X" photo={PHOTO} />);
    expect(screen.getByText("Qualifié IRVE")).toBeInTheDocument();
    rerender(<SplitHero eyebrow="E" title="T" text="X" photo={PHOTO} badge="Qualifelec" />);
    expect(screen.getByText("Qualifelec")).toBeInTheDocument();
    rerender(<SplitHero eyebrow="E" title="T" text="X" photo={PHOTO} badge="" />);
    expect(screen.queryByText("Qualifié IRVE")).toBeNull();
  });

  it("rappelle les certifications de l'artisan", async () => {
    const { default: FreshSplitHero } = await importFresh(() => import("@/components/SplitHero"), {
      infos: { CERTIFICATIONS: [{ id: "q", label: "Qualifelec", detail: "" }] },
    });
    render(<FreshSplitHero eyebrow="E" title="T" text="X" photo={PHOTO} badge="" />);
    expect(screen.getByRole("listitem")).toHaveTextContent("Qualifelec");
  });

  it("texte animé en CSS : visible sans attendre le JavaScript, jamais posé sur l'image", () => {
    render(<SplitHero eyebrow="E" title="Titre" text="X" photo={PHOTO} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("hero-rise");
    expect(heading.closest(".reveal")).toBeNull();
    expect(heading.parentElement?.contains(screen.getByAltText(PHOTO.alt))).toBe(false);
  });

  it("le motif circuit entoure l'image, jamais le texte", () => {
    const { container } = render(<SplitHero eyebrow="E" title="Titre" text="X" photo={PHOTO} />);
    const circuit = container.querySelector(".circuit-current")!.closest("svg")!;
    expect(circuit.parentElement).toContainElement(screen.getByAltText(PHOTO.alt));
    expect(circuit.parentElement).not.toContainElement(screen.getByRole("heading", { level: 1 }));
  });
});
