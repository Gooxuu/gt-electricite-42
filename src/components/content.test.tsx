import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CertBadges from "@/components/CertBadges";
import { CtaBand, SectionHeading } from "@/components/Section";
import Testimonial from "@/components/Testimonial";
import type { StockPhoto } from "@/lib/stockPhotos";
import { importFresh } from "@/test/importFresh";

const PHOTO: StockPhoto = { src: "/images/stock/test.svg", alt: "Photo de test", credit: "test" };

describe("StockImage", () => {
  it("affiche la photo avec son texte alternatif", async () => {
    const { default: StockImage } = await importFresh(() => import("@/components/StockImage"), {
      env: { NEXT_PUBLIC_BASE_PATH: "" },
    });
    render(<StockImage photo={PHOTO} />);
    expect(screen.getByAltText("Photo de test")).toHaveAttribute("src", "/images/stock/test.svg");
  });

  it("préfixe le chemin avec le basePath GitHub Pages", async () => {
    const { default: StockImage } = await importFresh(() => import("@/components/StockImage"), {
      env: { NEXT_PUBLIC_BASE_PATH: "/ma-demo" },
    });
    render(<StockImage photo={PHOTO} />);
    expect(screen.getByAltText("Photo de test")).toHaveAttribute("src", "/ma-demo/images/stock/test.svg");
  });
});

describe("CertBadges", () => {
  it("un badge texte par certification", () => {
    render(
      <CertBadges
        items={[
          { id: "a", label: "Garantie décennale", detail: "10 ans" },
          { id: "b", label: "RGE", detail: "2026" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Garantie décennale")).toBeInTheDocument();
  });

  it("rien sans certification", () => {
    const { container } = render(<CertBadges items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Testimonial", () => {
  it("cite l'avis entre guillemets, avec sa source", () => {
    render(<Testimonial testimonial={{ quote: "Travail soigné.", source: "Avis Google" }} />);
    expect(screen.getByText("« Travail soigné. »")).toBeInTheDocument();
    expect(screen.getByText("Avis Google")).toBeInTheDocument();
  });

  it("rien sans avis réel", () => {
    const { container } = render(<Testimonial testimonial={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("Section", () => {
  it("titre h2 : apparaît en douceur (Reveal), avec sur-titre et introduction", () => {
    render(<SectionHeading eyebrow="Nos services" title="Ce que nous faisons" intro="Une introduction." />);
    const heading = screen.getByRole("heading", { level: 2, name: "Ce que nous faisons" });
    expect(heading.closest(".reveal")).not.toBeNull();
    expect(screen.getByText("Nos services")).toBeInTheDocument();
    expect(screen.getByText("Une introduction.")).toBeInTheDocument();
  });

  it("titre h1 : affiché immédiatement, sans attendre le JavaScript", () => {
    render(<SectionHeading as="h1" title="Contact" />);
    expect(screen.getByRole("heading", { level: 1, name: "Contact" }).closest(".reveal")).toBeNull();
  });

  it("bandeau final : titre et boutons de contact", () => {
    render(<CtaBand title="Un projet ?" text="Parlons-en." />);
    expect(screen.getByRole("heading", { level: 2, name: "Un projet ?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Appeler le / })).toBeInTheDocument();
  });

  it("bandeau final : motif circuit sur les côtés, hors du texte centré, sur grand écran seulement", () => {
    const { container } = render(<CtaBand title="Un projet ?" text="Parlons-en." />);
    const circuits = [...new Set([...container.querySelectorAll(".circuit-current")].map((path) => path.closest("svg")!))];
    expect(circuits.length).toBeGreaterThan(0);
    for (const circuit of circuits) {
      expect(circuit.parentElement).not.toContainElement(screen.getByRole("heading", { level: 2 }));
      expect(circuit.parentElement).toHaveClass("hidden", "lg:block");
    }
  });
});
