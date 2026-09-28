import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ServiceCards from "@/components/ServiceCards";
import type { Service } from "@/lib/services";
import { STOCK_PHOTOS, type StockPhotoId } from "@/lib/stockPhotos";

const PHOTO_ID = Object.keys(STOCK_PHOTOS)[0] as StockPhotoId;
const SERVICES: Service[] = [
  { slug: "depannage", title: "Dépannage", teaser: "Panne réparée.", icon: "bolt", highlight: false, photo: PHOTO_ID, actif: true },
  { slug: "bornes", title: "Bornes", teaser: "Recharge à domicile.", icon: "plug", highlight: true, photo: PHOTO_ID, actif: true },
];

describe("ServiceCards", () => {
  it("une carte-lien par service, vers sa page", () => {
    render(<ServiceCards services={SERVICES} />);
    expect(screen.getByRole("link", { name: /Dépannage/ })).toHaveAttribute("href", "/depannage/");
    expect(screen.getByRole("link", { name: /Bornes/ })).toHaveAttribute("href", "/bornes/");
    expect(screen.getByRole("heading", { level: 3, name: "Dépannage" })).toBeInTheDocument();
    expect(screen.getByText("Panne réparée.")).toBeInTheDocument();
  });

  it("met en avant le service marqué highlight", () => {
    render(<ServiceCards services={SERVICES} />);
    const highlighted = screen.getByRole("link", { name: /Bornes/ });
    expect(highlighted).toHaveAttribute("data-highlight", "true");
    expect(within(highlighted).getByText("Notre spécialité")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dépannage/ })).not.toHaveAttribute("data-highlight");
  });

  it("illustre chaque carte par sa photo", () => {
    render(<ServiceCards services={SERVICES} />);
    expect(screen.getAllByAltText(STOCK_PHOTOS[PHOTO_ID].alt)).toHaveLength(2);
  });
});
