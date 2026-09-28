import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/Section";
import { ADDRESS, BRAND, EMAIL, EMAIL_MAILTO, LEGAL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_ENABLED } from "@/lib/infos";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Informations légales du site ${BRAND}.`,
};

const PENDING = "Communiqué à la mise en ligne";
const show = (value: string) => value.trim() || PENDING;

const TERM = "text-sm font-semibold text-muted";
const H2 = "font-display text-xl font-bold text-brand";

/** Mentions légales : éditeur, hébergeur, données personnelles. Page commune (slug réservé). */
export default function MentionsLegales() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading as="h1" eyebrow="Informations légales" title="Mentions légales" />
        <div className="mt-12 space-y-12 leading-relaxed text-ink">
          <section aria-labelledby="editeur">
            <h2 id="editeur" className={H2}>
              Éditeur du site
            </h2>
            <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-[14rem_1fr]">
              <dt className={TERM}>Entreprise</dt>
              <dd>{show(LEGAL.companyName)}</dd>
              <dt className={TERM}>Forme juridique</dt>
              <dd>{show(LEGAL.legalForm)}</dd>
              <dt className={TERM}>SIRET</dt>
              <dd>{show(LEGAL.siret)}</dd>
              <dt className={TERM}>Adresse</dt>
              <dd>{ADDRESS}</dd>
              <dt className={TERM}>Téléphone</dt>
              <dd>
                <a href={PHONE_TEL} className="underline-offset-4 hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </dd>
              <dt className={TERM}>E-mail</dt>
              <dd>
                <a href={EMAIL_MAILTO} className="underline-offset-4 hover:underline">
                  {EMAIL}
                </a>
              </dd>
              <dt className={TERM}>Directeur de la publication</dt>
              <dd>{show(LEGAL.publisher)}</dd>
            </dl>
          </section>

          <section aria-labelledby="hebergement">
            <h2 id="hebergement" className={H2}>
              Hébergement
            </h2>
            <p className="mt-4">{LEGAL.hostName}</p>
            <p>{LEGAL.hostAddress}</p>
          </section>

          <section aria-labelledby="donnees">
            <h2 id="donnees" className={H2}>
              Données personnelles
            </h2>
            <p className="mt-4">
              Ce site ne comporte aucun formulaire et ne dépose aucun cookie de mesure d’audience. Les coordonnées
              que vous nous transmettez par {WHATSAPP_ENABLED ? "téléphone, WhatsApp ou e-mail" : "téléphone ou e-mail"}{" "}
              servent uniquement à répondre à votre
              demande.
            </p>
          </section>

          <section aria-labelledby="propriete">
            <h2 id="propriete" className={H2}>
              Propriété intellectuelle
            </h2>
            {/* À LA LIVRAISON : adapter l'origine des images (banques citées, photos de l'artisan) */}
            <p className="mt-4">
              Les textes et les éléments graphiques de ce site sont protégés. Les photos d’illustration proviennent de
              banques d’images (Unsplash, Pexels) et sont utilisées conformément à leur licence&nbsp;; elles ne
              représentent pas des chantiers réalisés par l’entreprise.
            </p>
          </section>
        </div>
      </Container>
    </section>
  );
}
