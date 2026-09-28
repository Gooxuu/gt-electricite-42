import Link from "next/link";
import Icon from "@/components/Icons";
import HoverLift from "@/components/motion/HoverLift";
import Reveal from "@/components/motion/Reveal";
import StockImage from "@/components/StockImage";
import { type Service, servicePath } from "@/lib/services";
import { STOCK_PHOTOS } from "@/lib/stockPhotos";

/**
 * Cartes des services de l'accueil, générées depuis services.ts. L'effet est porté par les visuels :
 * apparition échelonnée, soulèvement de la carte et zoom de la photo au survol.
 */
export default function ServiceCards({ services, className = "" }: { services: readonly Service[]; className?: string }) {
  return (
    <ul className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {services.map((service, index) => {
        const dark = service.highlight;
        return (
          <li key={service.slug}>
            <Reveal delay={index * 0.08} className="h-full">
              <HoverLift className="h-full">
                <Link
                  href={servicePath(service.slug)}
                  data-highlight={service.highlight || undefined}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-shadow hover:shadow-xl ${
                    dark ? "border-highlight/40 bg-brand-deep text-white" : "border-line bg-white text-ink"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <StockImage
                      photo={STOCK_PHOTOS[service.photo]}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    {service.highlight && (
                      <span className="absolute left-4 top-4 rounded-full bg-highlight px-3 py-1 text-xs font-bold text-brand-deep">
                        Notre spécialité
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className={`flex size-11 items-center justify-center rounded-full ${
                        dark ? "bg-highlight/15 text-highlight" : "bg-accent/15 text-brand"
                      }`}
                    >
                      <Icon name={service.icon} className="size-5" />
                    </span>
                    <h3 className={`mt-4 font-display text-xl font-bold ${dark ? "text-white" : "text-brand"}`}>
                      {service.title}
                    </h3>
                    <p className={`mt-2 flex-1 leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>{service.teaser}</p>
                    <span
                      className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${dark ? "text-highlight" : "text-brand"}`}
                    >
                      Découvrir
                      <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                    </span>
                  </div>
                </Link>
              </HoverLift>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
