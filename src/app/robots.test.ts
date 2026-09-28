import { describe, expect, it } from "vitest";
import { importFresh } from "@/test/importFresh";

describe("robots.txt", () => {
  it("mode démo : interdit toute indexation", async () => {
    const { default: robots } = await importFresh(() => import("@/app/robots"), { infos: { DEMO_MODE: true } });
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("site livré : autorise l'indexation et indique le sitemap", async () => {
    const { default: robots } = await importFresh(() => import("@/app/robots"), {
      infos: { DEMO_MODE: false, SITE_URL: "https://www.durand-elec.fr" },
    });
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://www.durand-elec.fr/sitemap.xml",
    });
  });
});
