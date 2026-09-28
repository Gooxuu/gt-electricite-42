import CertBadges from "@/components/CertBadges";
import EmergencySection from "@/components/EmergencySection";
import BeforeAfterSlider from "@/components/motion/BeforeAfterSlider";
import Reveal from "@/components/motion/Reveal";
import ProcessSteps, { type Step } from "@/components/ProcessSteps";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import ServiceCards from "@/components/ServiceCards";
import SplitHero from "@/components/SplitHero";
import StatsBand from "@/components/StatsBand";
import Testimonial from "@/components/Testimonial";
import { CERTIFICATIONS, CITY, STATS, TESTIMONIAL } from "@/lib/infos";
import { ACTIVE_SERVICES } from "@/lib/services";
import { STOCK_PHOTOS } from "@/lib/stockPhotos";

const HERO = {
  eyebrow: `Électricien IRVE · ${CITY} (Loire)`,
  title: "Votre borne de recharge posée par un électricien local",
  text: "Bornes de recharge pour véhicules électriques, rénovation et dépannage électrique à Civens, Feurs et alentours.",
};

const STEPS: readonly Step[] = [
  { icon: "phone", title: "Vous appelez", text: "Vous nous décrivez votre besoin\u00a0: borne de recharge, rénovation ou panne." },
  { icon: "search", title: "Étude sur place", text: "Nous examinons votre installation électrique et vous expliquons les travaux à prévoir." },
  { icon: "wrench", title: "Travaux", text: "Nous réalisons les travaux selon la norme NF C 15-100, puis mettons l’installation en service." },
];

export default function Home() {
  return (
    <>
      <SplitHero {...HERO} photo={STOCK_PHOTOS.hero} />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            title="Nos services"
            intro="Trois domaines de l’électricité, à Civens, Feurs et dans les communes voisines."
          />
          <ServiceCards services={ACTIVE_SERVICES} className="mt-12" />
        </Container>
      </section>

      {/* Avis client juste après les services : la preuve vient tout de suite après l'offre. */}
      {TESTIMONIAL && (
        <section className="bg-surface py-20 sm:py-28">
          <Container>
            <Testimonial testimonial={TESTIMONIAL} />
          </Container>
        </section>
      )}

      <EmergencySection />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Comment ça se passe" title="Trois étapes, un seul interlocuteur" align="center" />
          <ProcessSteps steps={STEPS} className="mt-14" />
        </Container>
      </section>

      <section className="bg-surface py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Avant / après"
            title="Ce que change une rénovation électrique"
            intro="Faites glisser la poignée pour comparer."
          />
          <Reveal>
            <BeforeAfterSlider before={STOCK_PHOTOS.avant} after={STOCK_PHOTOS.apres} className="aspect-[4/3] shadow-2xl" />
            {/* À LA LIVRAISON : vraies photos avant/après de l'artisan ; retirer la mention ci-dessous seulement alors */}
            <p className="mt-3 text-xs text-muted">Photos d’illustration.</p>
          </Reveal>
        </Container>
      </section>

      <StatsBand stats={STATS} />

      {CERTIFICATIONS.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="Qualifications" title="Un électricien qualifié" align="center" />
            <CertBadges className="mt-10" />
          </Container>
        </section>
      )}

      <CtaBand title="Un projet ou une panne&nbsp;?" text="Appelez-nous ou écrivez-nous pour en parler." />
    </>
  );
}
