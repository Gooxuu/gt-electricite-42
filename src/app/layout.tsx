import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import type { ReactNode } from "react";
import DemoBanner from "@/components/DemoBanner";
import EmergencyBanner from "@/components/EmergencyBanner";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Navbar from "@/components/Navbar";
import {
  BRAND,
  CITY,
  DEMO_MODE,
  EMAIL,
  PHONE_E164,
  POSTAL_CODE,
  SCHEMA_TYPE,
  SERVICE_AREA,
  SITE_DESCRIPTION,
  SITE_URL,
  STREET,
  TAGLINE,
} from "@/lib/infos";
import { ACTIVE_SERVICES } from "@/lib/services";
import "./globals.css";

const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const heading = Sora({ variable: "--font-heading", subsets: ["latin"], weight: ["600", "700", "800"] });

const TITLE = `${BRAND} — ${TAGLINE} à ${CITY}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${BRAND}` },
  description: SITE_DESCRIPTION,
  // Démo : aucune indexation tant que le site n'est pas livré.
  robots: DEMO_MODE ? { index: false, follow: false } : undefined,
  // Attention : définir `openGraph` dans une page remplace tout ce bloc.
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: BRAND,
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": SCHEMA_TYPE,
  name: BRAND,
  url: SITE_URL,
  telephone: PHONE_E164,
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: STREET,
    postalCode: POSTAL_CODE,
    addressLocality: CITY,
    addressCountry: "FR",
  },
  areaServed: SERVICE_AREA,
  description: SITE_DESCRIPTION,
};

// Sans JavaScript, les blocs <Reveal> resteraient invisibles (opacity: 0 dans le HTML statique).
const NOSCRIPT_CSS = ".reveal{opacity:1!important;transform:none!important}";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // data-scroll-behavior : Next 16 ne neutralise plus le défilement doux pendant les changements de page.
    <html lang="fr" data-scroll-behavior="smooth" className={`${body.variable} ${heading.variable} h-full antialiased`}>
      <head>
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>
      </head>
      {/* Sous 640 px : place réservée à la barre d'appel mobile (79 px, plus la zone de sécurité de l'iPhone),
          avec une marge, pour ne rien masquer du pied de page. */}
      <body className="flex min-h-full flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-0">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <DemoBanner />
        <EmergencyBanner />
        <Navbar services={ACTIVE_SERVICES} />
        <main className="flex-1">{children}</main>
        <Footer services={ACTIVE_SERVICES} />
        <MobileCallBar />
      </body>
    </html>
  );
}
