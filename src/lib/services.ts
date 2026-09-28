import { notFound } from "next/navigation";
import type { IconName } from "@/components/Icons";
import type { StockPhotoId } from "@/lib/stockPhotos";

export type Service = {
  /** Segment d'URL. Une page écrite à la main doit exister dans src/app/<slug>/page.tsx. */
  slug: string;
  title: string;
  /** Libellé court pour le menu (sinon `title`). */
  menuLabel?: string;
  /** Phrase courte des cartes de l'accueil, du menu et de la description de la page pour Google. */
  teaser: string;
  icon: IconName;
  /** Service mis en avant : carte et entrée de menu distinguées. */
  highlight: boolean;
  /** Illustration de la carte de l'accueil et du haut de la page du service. */
  photo: StockPhotoId;
  /** false = service que cet artisan ne propose pas : page non publiée (404), absent des menus et du sitemap. */
  actif: boolean;
};

/**
 * Catalogue des services d'un électricien certifié IRVE. Le menu, les cartes de l'accueil, le pied de
 * page et le sitemap n'affichent que les services actifs. Pour un artisan donné : passer `actif` à false
 * pour ce qu'il ne fait pas, adapter les textes de ce qu'il fait.
 */
export const SERVICES: readonly Service[] = [
  {
    slug: "bornes-irve",
    title: "Bornes de recharge IRVE",
    menuLabel: "Bornes IRVE",
    teaser: "Installation de bornes de recharge pour véhicules électriques, à domicile, en copropriété ou en entreprise.",
    icon: "plug",
    highlight: true,
    photo: "irve",
    actif: true,
  },
  {
    slug: "depannage-electrique",
    title: "Dépannage électrique",
    menuLabel: "Dépannage",
    teaser: "Panne, disjoncteur qui saute, prise qui chauffe\u00a0: diagnostic et mise en sécurité de votre installation.",
    icon: "bolt",
    highlight: false,
    photo: "depannage",
    actif: true,
  },
  {
    slug: "renovation-electrique",
    title: "Rénovation et mise aux normes",
    menuLabel: "Rénovation",
    teaser: "Remplacement de tableau, mise aux normes NF C 15-100, éclairage et pose de VMC double flux.",
    icon: "wrench",
    highlight: false,
    photo: "renovation",
    actif: true,
  },
  {
    slug: "climatisation",
    title: "Climatisation et pompe à chaleur",
    menuLabel: "Climatisation",
    teaser: "Pose et entretien de climatisations réversibles et de pompes à chaleur air/air.",
    icon: "snow",
    highlight: false,
    photo: "climatisation",
    actif: false,
  },
  {
    slug: "chauffage-electrique",
    title: "Chauffage électrique et eau chaude",
    menuLabel: "Chauffage",
    teaser: "Radiateurs, plancher chauffant, ballon d’eau chaude thermodynamique et ventilation (VMC).",
    icon: "flame",
    highlight: false,
    photo: "chauffage",
    actif: false,
  },
  {
    slug: "panneaux-solaires",
    title: "Panneaux solaires",
    menuLabel: "Solaire",
    teaser: "Installation de panneaux photovoltaïques pour produire votre propre électricité.",
    icon: "sun",
    highlight: false,
    photo: "solaire",
    actif: false,
  },
  {
    slug: "domotique",
    title: "Domotique et maison connectée",
    menuLabel: "Domotique",
    teaser: "Éclairage, chauffage, volets et portail pilotés depuis votre téléphone.",
    icon: "home",
    highlight: false,
    photo: "domotique",
    actif: false,
  },
  {
    slug: "alarme-videosurveillance",
    title: "Alarme et vidéosurveillance",
    menuLabel: "Sécurité",
    teaser: "Alarme anti-intrusion, caméras, interphone et visiophone pour protéger votre domicile.",
    icon: "camera",
    highlight: false,
    photo: "securite",
    actif: false,
  },
];

/** Services proposés par cet artisan : seuls ceux-là apparaissent dans le menu, les cartes et le sitemap. */
export const ACTIVE_SERVICES: readonly Service[] = SERVICES.filter((service) => service.actif);

/** Pages communes : un service ne peut pas utiliser ces segments d'URL. */
export const RESERVED_SLUGS = ["contact", "mentions-legales"] as const;

export const servicePath = (slug: string) => `/${slug}/`;

/** Service d'une page. Un slug inconnu fait échouer le build avec un message clair. */
export function getService(slug: string): Service {
  const service = SERVICES.find((candidate) => candidate.slug === slug);
  if (!service) throw new Error(`Service inconnu : « ${slug} » (voir src/lib/services.ts)`);
  return service;
}

/**
 * À appeler dans le rendu d'une page de service : un service désactivé donne la page 404 (avec `noindex`),
 * seule publiée à cette adresse par l'export statique.
 */
export function ensureActive(service: Service): Service {
  if (!service.actif) notFound();
  return service;
}
