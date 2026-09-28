import type { Metadata } from "next";
import ContactButtons from "@/components/ContactButtons";
import Reveal from "@/components/motion/Reveal";
import { Container, SectionHeading } from "@/components/Section";
import {
  ADDRESS,
  BRAND,
  EMAIL,
  EMAIL_MAILTO,
  MAPS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  SERVICE_AREA,
  WHATSAPP_ENABLED,
} from "@/lib/infos";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez ${BRAND} par ${WHATSAPP_ENABLED ? "téléphone, WhatsApp ou e-mail" : "téléphone ou e-mail"}. Zone d'intervention\u00a0: ${SERVICE_AREA}.`,
};

const TERM = "text-xs font-bold uppercase tracking-wider text-muted";
const VALUE = "mt-1 text-lg font-semibold text-brand";

/** Contact direct uniquement : aucun formulaire. */
export default function ContactPage() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Parlons de votre projet"
            intro="Appelez-nous ou écrivez-nous&nbsp;: vous échangez directement avec l'artisan."
          />
          <ContactButtons size="lg" showEmail className="mt-8" />
        </div>
        <Reveal>
          <dl className="space-y-6 rounded-3xl border border-line bg-surface p-8">
            <div>
              <dt className={TERM}>Téléphone</dt>
              <dd className={VALUE}>
                <a href={PHONE_TEL} className="hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </dd>
            </div>
            <div>
              <dt className={TERM}>E-mail</dt>
              <dd className={VALUE}>
                <a href={EMAIL_MAILTO} className="hover:underline">
                  {EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className={TERM}>Adresse</dt>
              <dd className={VALUE}>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {ADDRESS}
                </a>
              </dd>
            </div>
            <div>
              <dt className={TERM}>Zone d’intervention</dt>
              <dd className={VALUE}>{SERVICE_AREA}</dd>
            </div>
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
