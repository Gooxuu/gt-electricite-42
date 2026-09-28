import CallButton from "@/components/CallButton";
import CircuitLines from "@/components/CircuitLines";
import Icon from "@/components/Icons";
import Reveal from "@/components/motion/Reveal";
import { Container } from "@/components/Section";
import { EMERGENCY } from "@/lib/infos";

/**
 * Section « Une urgence électrique ? » de l'accueil : situations types, conseil de sécurité, appel.
 * Aucun délai promis. Absente si l'artisan n'intervient pas en urgence.
 */
export default function EmergencySection() {
  if (!EMERGENCY.enabled) return null;
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep py-20 text-white sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">
            <span aria-hidden="true" className="pulse-dot relative inline-block size-2.5 rounded-full bg-red-500 text-red-500" />
            Urgence
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Une urgence électrique&nbsp;?
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
            Pour votre sécurité, coupez le courant au disjoncteur général, puis appelez-nous&nbsp;: nous vous
            expliquons quoi faire et intervenons chez vous.
          </p>
          <CallButton label="Appeler en urgence le" size="lg" className="mt-8" />
        </div>
        <Reveal className="relative">
          {/* Motif circuit autour des cartes, jamais sous le titre ; cartes opaques pour que le câble passe dessous. */}
          <CircuitLines className="absolute -left-10 -top-10 -z-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)] text-white" />
          <ul className="grid gap-3 sm:grid-cols-2">
            {EMERGENCY.situations.map((situation) => (
              <li key={situation} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-brand p-5">
                <Icon name="alert" className="mt-0.5 size-5 shrink-0 text-accent" />
                <span className="font-semibold">{situation}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
