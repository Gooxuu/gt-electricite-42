import type { Metadata } from "next";
import EmergencyCallout from "@/components/EmergencyCallout";
import Icon from "@/components/Icons";
import BeforeAfterSlider from "@/components/motion/BeforeAfterSlider";
import Reveal from "@/components/motion/Reveal";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import SplitHero from "@/components/SplitHero";
import { ensureActive, getService } from "@/lib/services";
import { STOCK_PHOTOS } from "@/lib/stockPhotos";

const service = getService("bornes-irve");

export const metadata: Metadata = { title: service.title, description: service.teaser };

const CONTENT = {
  title: "Votre borne de recharge à Civens, Feurs et alentours",
  eyebrow: "Notre accompagnement",
  heading: "Une borne adaptée à votre installation",
  intro: "Nous étudions votre installation électrique avant de vous proposer la borne et l’emplacement les plus adaptés.",
  points: [
    "Étude de votre installation électrique et du meilleur emplacement",
    "Pose de bornes à domicile, en copropriété ou en entreprise",
    "Raccordement au tableau avec des protections dédiées",
    "Mise en service et prise en main de la borne",
  ],
  before: STOCK_PHOTOS.irveAvant,
  after: STOCK_PHOTOS.irveApres,
  cta: {
    title: "Un projet de borne de recharge\u00a0?",
    text: "Appelez-nous pour en parler\u00a0: nous étudions votre installation avec vous.",
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
