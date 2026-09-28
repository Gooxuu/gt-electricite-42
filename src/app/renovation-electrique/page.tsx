import type { Metadata } from "next";
import EmergencyCallout from "@/components/EmergencyCallout";
import Icon from "@/components/Icons";
import BeforeAfterSlider from "@/components/motion/BeforeAfterSlider";
import Reveal from "@/components/motion/Reveal";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import SplitHero from "@/components/SplitHero";
import { ensureActive, getService } from "@/lib/services";
import { STOCK_PHOTOS } from "@/lib/stockPhotos";

const service = getService("renovation-electrique");

export const metadata: Metadata = { title: service.title, description: service.teaser };

const CONTENT = {
  title: "Une installation électrique sûre et aux normes",
  eyebrow: "Nos travaux",
  heading: "Du tableau électrique à la ventilation",
  intro: "Nous remettons votre installation en conformité avec la norme NF C 15-100 et, qualifiés RGE en ventilation, posons des VMC double flux.",
  points: [
    "Remplacement du tableau électrique et des protections",
    "Mise aux normes et mise en sécurité de l’installation",
    "Éclairage intérieur et extérieur, prises et circuits dédiés",
    "Pose de VMC double flux (RGE Qualit’EnR «\u00a0Ventilation +\u00a0»)",
  ],
  before: STOCK_PHOTOS.avant,
  after: STOCK_PHOTOS.apres,
  cta: {
    title: "Un projet de rénovation\u00a0?",
    text: "Appelez-nous pour faire le point sur votre installation.",
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
