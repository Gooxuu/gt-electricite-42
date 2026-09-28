import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/infos";
import { ACTIVE_SERVICES, servicePath } from "@/lib/services";

// Obligatoire avec `output: "export"` : sans ça, le build refuse la route (vérifié sur Next 16.3.6).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", ...ACTIVE_SERVICES.map((service) => servicePath(service.slug)), "/contact/", "/mentions-legales/"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "yearly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
