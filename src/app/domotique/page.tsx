import type { Metadata } from "next";
import EmergencyCallout from "@/components/EmergencyCallout";
import Icon from "@/components/Icons";
import BeforeAfterSlider from "@/components/motion/BeforeAfterSlider";
import Reveal from "@/components/motion/Reveal";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import SplitHero from "@/components/SplitHero";
import { ensureActive, getService } from "@/lib/services";
import { STOCK_PHOTOS } from "@/lib/stockPhotos";

const service = getService("domotique");

export const metadata: Metadata = { title: service.title, description: service.teaser };

// Service non proposé par GT Électricité 42 (actif: false dans services.ts) : page non publiée, contenu du template.
const CONTENT = {
  title: "Pilotez votre maison du bout des doigts",
  eyebrow: "Maison connectée",
  heading: "Une maison plus confortable et plus économe",
  intro: "Nous rendons votre éclairage, votre chauffage et vos ouvertures pilotables depuis votre téléphone.",
  points: [
    "Éclairage connecté et scénarios d’ambiance",
    "Chauffage programmable pièce par pièce",
    "Motorisation de volets roulants et de portail",
    "Commande à distance depuis votre téléphone",
  ],
  before: STOCK_PHOTOS.domotiqueAvant,
  after: STOCK_PHOTOS.domotiqueApres,
  cta: {
    title: "Un projet de maison connectée\u00a0?",
    text: "Appelez-nous pour imaginer les automatismes utiles chez vous.",
  },
};

export default function Page() {
  ensureActive(service);
  return (
    <>
      <SplitHero size="md" eyebrow={service.title} title={CONTENT.title} text={service.teaser} photo={STOCK_PHOTOS[service.photo]} />

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={CONTENT.eyebrow} title={CONTENT.heading} intro={CONTENT.intro} />
            <ul className="mt-8 space-y-4">
              {CONTENT.points.map((point) => (
                <li key={point} className="flex gap-3 text-ink">
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent-dark" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <Reveal>
            <BeforeAfterSlider before={CONTENT.before} after={CONTENT.after} className="aspect-[4/3] shadow-2xl" />
            {/* À LA LIVRAISON : vraies photos avant/après de l'artisan ; retirer la mention ci-dessous seulement alors */}
            <p className="mt-3 text-xs text-muted">Photos d’illustration.</p>
          </Reveal>
        </Container>
      </section>

      <EmergencyCallout />

      <CtaBand title={CONTENT.cta.title} text={CONTENT.cta.text} />
    </>
  );
}
