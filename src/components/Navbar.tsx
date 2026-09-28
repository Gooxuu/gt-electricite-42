"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icons";
import Logo from "@/components/Logo";
import { BRAND, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_ENABLED, WHATSAPP_URL } from "@/lib/infos";
import { type Service, servicePath } from "@/lib/services";

/** Au-delà, le menu ordinateur regroupe les services dans un menu déroulant « Nos services ». */
const MAX_INLINE_SERVICES = 3;

const trim = (path: string) => path.replace(/\/+$/, "");
const labelOf = (service: Service) => service.menuLabel ?? service.title;

/**
 * Menu généré depuis les services actifs. Les menus ouverts se ferment avec Échap (le focus revient au
 * bouton qui les a ouverts), au clic en dehors et au changement de page.
 */
export default function Navbar({ services }: { services: readonly Service[] }) {
  const pathname = trim(usePathname() ?? "");
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Changement de page (lien du contenu, retour arrière…) : tout se referme. État ajusté pendant le rendu.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setServicesOpen(false);
  }

  // Clic en dehors d'un menu ouvert : fermeture. L'écouteur n'existe que lorsqu'un menu est ouvert.
  useEffect(() => {
    if (!open && !servicesOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!servicesRef.current?.contains(target)) setServicesOpen(false);
      if (!headerRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, servicesOpen]);

  const isActive = (href: string) => pathname === trim(href);
  const closeMobile = () => setOpen(false);
  const closeServices = () => setServicesOpen(false);

  const onServicesKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !servicesOpen) return;
    setServicesOpen(false);
    toggleRef.current?.focus();
  };

  const onMobileKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !open) return;
    setOpen(false);
    burgerRef.current?.focus();
  };

  const inlineClass = (href: string, highlight: boolean) =>
    highlight
      ? "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-deep px-4 py-2 text-sm font-semibold text-white ring-1 ring-highlight/70 transition-colors hover:bg-brand"
      : `inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface ${
          isActive(href) ? "text-brand underline decoration-accent decoration-2 underline-offset-8" : "text-ink"
        }`;

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" aria-label={`${BRAND} — accueil`}>
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {services.length <= MAX_INLINE_SERVICES ? (
            services.map((service) => {
              const href = servicePath(service.slug);
              return (
                <Link
                  key={service.slug}
                  href={href}
                  data-highlight={service.highlight || undefined}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={inlineClass(href, service.highlight)}
                >
                  {service.highlight && <Icon name={service.icon} className="size-4 text-highlight" />}
                  {labelOf(service)}
                </Link>
              );
            })
          ) : (
            <div ref={servicesRef} className="relative" onKeyDown={onServicesKeyDown}>
              <button
                ref={toggleRef}
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="menu-services"
                onClick={() => setServicesOpen((value) => !value)}
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface"
              >
                Nos services
                <Icon name="chevron" className={`size-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div
                  id="menu-services"
                  className="absolute left-1/2 top-full mt-3 w-[40rem] -translate-x-1/2 rounded-3xl border border-line bg-white p-3 shadow-2xl"
                >
                  <ul className="grid grid-cols-2 gap-1">
                    {services.map((service) => {
                      const href = servicePath(service.slug);
                      return (
                        <li key={service.slug}>
                          <Link
                            href={href}
                            onClick={closeServices}
                            data-highlight={service.highlight || undefined}
                            aria-current={isActive(href) ? "page" : undefined}
                            className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-surface"
                          >
                            <span
                              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                                service.highlight ? "bg-brand-deep text-accent" : "bg-accent/20 text-brand"
                              }`}
                            >
                              <Icon name={service.icon} className="size-5" />
                            </span>
                            <span>
                              <span className="block text-sm font-bold text-brand">{service.title}</span>
                              <span className="mt-0.5 block text-xs leading-snug text-muted">{service.teaser}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
          <Link
            href="/contact/"
            aria-current={isActive("/contact/") ? "page" : undefined}
            className={inlineClass("/contact/", false)}
          >
            Contact
          </Link>
        </nav>

        {/* Numéro en toutes lettres sur tablette et grand écran ; icône seule sur mobile et entre 1024 et 1280 px,
            où le menu complet occupe déjà la barre. */}
        <div className="flex items-center gap-2">
          <a
            href={PHONE_TEL}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-brand-deep transition-colors hover:bg-accent-light sm:inline-flex lg:hidden xl:inline-flex"
          >
            <Icon name="phone" className="size-4" />
            {PHONE_DISPLAY}
          </a>
          <a
            href={PHONE_TEL}
            aria-label={`Appeler le ${PHONE_DISPLAY}`}
            className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-brand-deep sm:hidden lg:inline-flex xl:hidden"
          >
            <Icon name="phone" className="size-5" />
          </a>
          <button
            ref={burgerRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-brand lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((value) => !value)}
            onKeyDown={onMobileKeyDown}
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigation mobile"
          onKeyDown={onMobileKeyDown}
          className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-line bg-white px-5 pb-5 pt-3 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {services.map((service) => {
              const href = servicePath(service.slug);
              return (
                <li key={service.slug}>
                  <Link
                    href={href}
                    onClick={closeMobile}
                    aria-current={isActive(href) ? "page" : undefined}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 font-semibold text-ink transition-colors hover:bg-surface"
                  >
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                        service.highlight ? "bg-brand-deep text-accent" : "bg-accent/20 text-brand"
                      }`}
                    >
                      <Icon name={service.icon} className="size-5" />
                    </span>
                    {labelOf(service)}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/contact/"
                onClick={closeMobile}
                aria-current={isActive("/contact/") ? "page" : undefined}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 font-semibold text-ink transition-colors hover:bg-surface"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-brand">
                  <Icon name="mail" className="size-5" />
                </span>
                Contact
              </Link>
            </li>
          </ul>
          {WHATSAPP_ENABLED && (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-brand/30 px-5 py-3 text-sm font-semibold text-brand"
            >
              <Icon name="chat" className="size-5" />
              Écrire sur WhatsApp
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
