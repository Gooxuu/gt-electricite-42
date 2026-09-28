import type { MetadataRoute } from "next";
import { DEMO_MODE, SITE_URL } from "@/lib/infos";

// Obligatoire avec `output: "export"` : sans ça, le build refuse la route.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Démo : rien n'est indexé tant que le site n'est pas livré.
  if (DEMO_MODE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
