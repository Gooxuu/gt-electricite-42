import type { ReactNode } from "react";
import ContactButtons from "@/components/ContactButtons";
import CircuitLines from "@/components/CircuitLines";
import Reveal from "@/components/motion/Reveal";

/** Conteneur centré commun à toutes les sections. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-5 ${className}`}>{children}</div>;
}

type HeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  /** « h1 » pour le titre principal d'une page, « h2 » sinon. */
  as?: "h1" | "h2";
};

/**
 * Titre de section. Un h2 apparaît en douceur (Reveal) ; le h1 d'une page s'affiche immédiatement :
 * en haut de page, il ne doit pas attendre le chargement du JavaScript.
 */
export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", as: Tag = "h2" }: HeadingProps) {
  const dark = tone === "dark";
  const content = (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={`flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] ${
            align === "center" ? "justify-center" : ""
          } ${dark ? "text-accent" : "text-muted"}`}
        >
          <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-accent" />
          {eyebrow}
        </p>
      )}
      <Tag className={`mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl ${dark ? "text-white" : "text-brand"}`}>
        {title}
      </Tag>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>{intro}</p>}
    </div>
  );
  return Tag === "h1" ? content : <Reveal>{content}</Reveal>;
}

/** Bandeau d'appel à l'action de fin de page. */
export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand py-20">
      {/* Motif circuit sur les deux côtés, hors du texte centré (48rem de large au plus) : grand écran seulement. */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 hidden w-[calc(50%-24rem)] lg:block">
        <CircuitLines className="h-full w-full text-white" />
      </div>
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[calc(50%-24rem)] -scale-x-100 lg:block">
        <CircuitLines className="h-full w-full text-white" />
      </div>
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">{text}</p>
        <ContactButtons tone="dark" size="lg" showEmail className="mt-8 justify-center" />
      </Container>
    </section>
  );
}
