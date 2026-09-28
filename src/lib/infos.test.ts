import { describe, expect, it } from "vitest";
import { PHONE_DISPLAY, PHONE_E164, PHONE_TEL, STATS, telHref, whatsappHref } from "@/lib/infos";
import { importFresh } from "@/test/importFresh";
import { samePhoneNumber } from "@/test/phone";

describe("infos.ts", () => {
  it("telHref construit un lien d'appel", () => {
    expect(telHref("+33612345678")).toBe("tel:+33612345678");
  });

  it("whatsappHref ne garde que les chiffres du numéro et encode le message", () => {
    expect(whatsappHref("+33 6 12 34 56 78", "Bonjour à vous")).toBe(
      "https://wa.me/33612345678?text=Bonjour%20%C3%A0%20vous",
    );
  });

  it("le numéro affiché est bien celui qui est composé", () => {
    expect(samePhoneNumber(PHONE_DISPLAY, PHONE_E164)).toBe(true);
    expect(PHONE_TEL).toBe(`tel:${PHONE_E164}`);
  });

  it("asset() préfixe les fichiers de public/ avec le basePath GitHub Pages", async () => {
    const { asset } = await importFresh(() => import("@/lib/infos"), { env: { NEXT_PUBLIC_BASE_PATH: "/ma-demo" } });
    expect(asset("/images/stock/photo.webp")).toBe("/ma-demo/images/stock/photo.webp");
  });

  it("asset() ne change rien sans basePath", async () => {
    const { asset } = await importFresh(() => import("@/lib/infos"), { env: { NEXT_PUBLIC_BASE_PATH: "" } });
    expect(asset("/images/stock/photo.webp")).toBe("/images/stock/photo.webp");
  });

  it("SITE_URL n'a jamais de barre finale (sinon « // » dans le sitemap)", async () => {
    const { SITE_URL } = await importFresh(() => import("@/lib/infos"), {
      env: { NEXT_PUBLIC_SITE_URL: "https://exemple.github.io/ma-demo/" },
    });
    expect(SITE_URL).toBe("https://exemple.github.io/ma-demo");
  });

  it("les chiffres affichés sont des entiers positifs avec un libellé", () => {
    for (const stat of STATS) {
      expect(Number.isInteger(stat.value) && stat.value > 0).toBe(true);
      expect(stat.label.trim()).not.toBe("");
    }
  });
});
