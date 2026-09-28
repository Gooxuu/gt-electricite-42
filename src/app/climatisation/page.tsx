import type { Metadata } from "next";
import EmergencyCallout from "@/components/EmergencyCallout";
import Icon from "@/components/Icons";
import BeforeAfterSlider from "@/components/motion/BeforeAfterSlider";
import Reveal from "@/components/motion/Reveal";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import SplitHero from "@/components/SplitHero";
import { ensureActive, getService } from "@/lib/services";
import { STOCK_PHOTOS } from "@/lib/stockPhotos";

const service = getService("climatisation");

export const metadata: Metadata = { title: service.title, description: service.teaser };

// Service non proposé par GT Électricité 42 (actif: false dans services.ts) : page non publiée, contenu du template.
// (service réservé aux artisans titulaires de l'attestation de capacité aux fluides frigorigènes)
const CONTENT = {
  title: "Le bon confort, été comme hiver",
  eyebrow: "Notre savoir-faire",
  heading: "Une climatisation adaptée à votre logement",
  intro: "Nous vous conseillons sur l’appareil et l’emplacement les plus adaptés à vos pièces.",
  points: [
    "Conseil sur le type d’appareil selon la surface et l’usage",
    "Pose de climatisations réversibles, mono-split ou multi-split",
    "Installation de pompes à chaleur air/air",
    "Mise en service, réglages et entretien",
  ],
  before: STOCK_PHOTOS.climatisationAvant,
  after: STOCK_PHOTOS.climatisationApres,
  cta: {
    title: "Un projet de climatisation\u00a0?",
    text: "Appelez-nous pour en parler et organiser une visite.",
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
