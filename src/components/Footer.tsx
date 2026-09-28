import Link from "next/link";
import CurrentYear from "@/components/CurrentYear";
import Icon from "@/components/Icons";
import Logo from "@/components/Logo";
import {
  ADDRESS,
  BRAND,
  CERTIFICATIONS,
  EMAIL,
  EMAIL_MAILTO,
  LOGO_FILE,
  MAPS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  TAGLINE,
  WHATSAPP_ENABLED,
  WHATSAPP_URL,
} from "@/lib/infos";
import { type Service, servicePath } from "@/lib/services";

const HEADING = "font-display text-sm font-bold uppercase tracking-wider text-accent";

export default function Footer({ services }: { services: readonly Service[] }) {
  return (
    <footer className="bg-brand-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          {LOGO_FILE ? (
            <span className="inline-block rounded-2xl bg-white p-2">
              <Logo />
            </span>
          ) : (
            <Logo tone="dark" />
          )}
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">{TAGLINE}.</p>
        </div>

        <div>
          <h2 className={HEADING}>Nous contacter</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li>
              <a href={PHONE_TEL} className="inline-flex items-center gap-2 hover:text-white">
                <Icon name="phone" className="size-4 text-accent" />
                {PHONE_DISPLAY}
              </a>
            </li>
            {WHATSAPP_ENABLED && (
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Icon name="chat" className="size-4 text-accent" />
                  WhatsApp
                </a>
              </li>
            )}
            <li>
              <a href={EMAIL_MAILTO} className="inline-flex items-center gap-2 hover:text-white">
                <Icon name="mail" className="size-4 text-accent" />
                {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 hover:text-white"
              >
                <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-accent" />
                {ADDRESS}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={HEADING}>Le site</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={servicePath(service.slug)} className="hover:text-white">
                  {service.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact/" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
          {CERTIFICATIONS.length > 0 && (
            <p className="mt-6 text-xs leading-relaxed text-white/60">
              {CERTIFICATIONS.map((cert) => cert.label).join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {BRAND}. Tous droits réservés.
          </p>
          <Link href="/mentions-legales/" className="hover:text-white">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
