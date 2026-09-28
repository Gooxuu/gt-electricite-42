import type { CSSProperties } from "react";
import CircuitLines from "@/components/CircuitLines";
import ContactButtons from "@/components/ContactButtons";
import Icon from "@/components/Icons";
import { Container } from "@/components/Section";
import StockImage from "@/components/StockImage";
import { CERTIFICATIONS } from "@/lib/infos";
import type { StockPhoto } from "@/lib/stockPhotos";

type Props = {
  eyebrow: string;
  title: string;
  text: string;
  photo: StockPhoto;
  /** « lg » : accueil ; « md » : pages de service (moins haut). */
  size?: "lg" | "md";
  /** Badge flottant sur l'image ; chaîne vide = aucun badge. */
  badge?: string;
};

const delay = (seconds: number) => ({ "--rise-delay": `${seconds}s` }) as CSSProperties;

/**
 * Héros en deux colonnes : texte et boutons d'appel à gauche, image à droite. Le texte n'est jamais posé
 * sur l'image, quelle qu'elle soit. Entrée progressive en CSS pur, motif circuit en fond.
 */
export default function SplitHero({ eyebrow, title, text, photo, size = "lg", badge = "Qualifié IRVE" }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep text-white">
      <Container
        className={`grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14 ${
          size === "lg" ? "py-16 sm:py-24" : "py-12 sm:py-16"
        }`}
      >
        <div>
          <p className="hero-rise text-sm font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          <h1
            className={`hero-rise mt-4 max-w-2xl text-balance font-display font-extrabold leading-[1.1] ${
              size === "lg" ? "text-3xl sm:text-4xl lg:text-5xl" : "text-3xl sm:text-4xl"
            }`}
            style={delay(0.1)}
          >
            {title}
          </h1>
          <p className="hero-rise mt-5 max-w-xl text-lg leading-relaxed text-white/80" style={delay(0.2)}>
            {text}
          </p>
          <div className="hero-rise mt-8" style={delay(0.3)}>
            <ContactButtons tone="dark" size="lg" />
          </div>
          {CERTIFICATIONS.length > 0 && (
            <ul className="hero-rise mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75" style={delay(0.4)}>
              {CERTIFICATIONS.map((cert) => (
                <li key={cert.id} className="flex items-center gap-2">
                  <Icon name="check" className="size-4 text-accent" />
                  {cert.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="hero-rise relative" style={delay(0.2)}>
          {/* Motif circuit autour de l'image seulement (débord de 2,5rem, moins que l'écart des colonnes) :
              jamais sous le texte. */}
          <CircuitLines className="absolute -left-10 -top-10 -z-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)] text-white" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <StockImage photo={photo} preload sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          {badge && (
            <span className="absolute -bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-deep shadow-lg sm:left-6">
              <Icon name="bolt" className="size-4 text-accent-dark" />
              {badge}
            </span>
          )}
        </div>
      </Container>
    </section>
  );
}
