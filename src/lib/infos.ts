/**
 * Source unique des informations de l'artisan et des réglages du site.
 * Ne jamais coder en dur un numéro, une adresse ou un drapeau dans un composant.
 * Les valeurs à personnaliser pour chaque artisan sont signalées par un commentaire
 * que liste `npm run check:demo`.
 */

/** Numéro au format international (+33…) → lien d'appel. */
export const telHref = (e164: string) => `tel:${e164}`;

/** Lien WhatsApp « click to chat » : chiffres seuls, sans « + » ni espaces. */
export const whatsappHref = (e164: string, message: string) =>
  `https://wa.me/${e164.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export const BRAND = "GT Électricité 42";
/** Activité en une ligne, sans point final (pied de page, titre des pages). */
export const TAGLINE = "Bornes de recharge, rénovation et dépannage électrique";
export const SITE_DESCRIPTION =
  "Électricien à Civens (Loire)\u00a0: installation de bornes de recharge IRVE, rénovation électrique et dépannage à Feurs et alentours.";

export const PHONE_DISPLAY = "06 42 13 07 66";
export const PHONE_E164 = "+33642130766";
export const PHONE_TEL = telHref(PHONE_E164);

export const EMAIL = "gt.electricite42@gmail.com";
export const EMAIL_MAILTO = `mailto:${EMAIL}`;

/** false si le numéro n'est pas sur WhatsApp : le bouton disparaît partout. */
// À LA LIVRAISON : demander à l'artisan si son numéro est sur WhatsApp (true pour afficher le bouton)
export const WHATSAPP_ENABLED = false;
export const WHATSAPP_URL = whatsappHref(PHONE_E164, "Bonjour, je vous contacte depuis votre site pour un projet.");

export const STREET = "5 allée Victoria";
export const POSTAL_CODE = "42110";
export const CITY = "Civens";
export const ADDRESS = `${STREET}, ${POSTAL_CODE} ${CITY}`;
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS}, France`)}`;
export const SERVICE_AREA = "Civens, Feurs et alentours (Loire)";

/**
 * Type schema.org de l'entreprise (données structurées lues par Google), selon le métier principal :
 * « Electrician », « HVACBusiness », « Plumber », « RoofingContractor », « HomeAndConstructionBusiness »…
 */
export const SCHEMA_TYPE = "Electrician";

/** Domaine cible, sans barre finale. Pour la démo GitHub Pages, NEXT_PUBLIC_SITE_URL est fourni au build. */
// À LA LIVRAISON : domaine de l'artisan (en démo, la CI fournit NEXT_PUBLIC_SITE_URL)
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com").replace(/\/+$/, "");

/** Mode démonstration : site non indexé + bandeau « Maquette ». Passer à false à la signature. */
// À LA LIVRAISON : passer à false à la signature
export const DEMO_MODE = true;
/** Nom de l'agence affiché dans le bandeau de démo. Vide = bandeau générique. */
export const AGENCY_NAME = "";

/** Sous-chemin GitHub Pages (ex. « /nom-du-depot »), vide sinon. Fourni au build. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Préfixe un chemin de `public/` avec le basePath.
 * Obligatoire pour `next/image` et les balises <img> ; `next/link` s'en occupe seul.
 */
export const asset = (path: string) => `${BASE_PATH}${path}`;

/** Logo dans public/images (ex. « /images/logo.svg »). null = logo texte composé à partir de BRAND. */
export const LOGO_FILE: string | null = null;

export type Certification = { id: string; label: string; detail: string };

/** Certifications réelles, affichées en badges texte (jamais les logos officiels). Liste vide = section masquée. */
// À LA LIVRAISON : faire confirmer la qualification Qualifelec IRVE (dernier certificat trouvé : fin de cycle au 23/11/2024)
export const CERTIFICATIONS: readonly Certification[] = [
  { id: "irve", label: "Qualifelec IRVE", detail: "Bornes de recharge" },
  { id: "rge", label: "RGE Qualit’EnR", detail: "Ventilation double flux" },
];

export type Testimonial = { quote: string; source: string };

/** Un vrai avis client, cité mot pour mot, sans nom ni note ajoutés. null = section masquée. */
export const TESTIMONIAL: Testimonial | null = null;

export type Stat = { value: number; suffix?: string; label: string };

/**
 * Chiffres confirmés par l'artisan (années d'activité, nombre de chantiers…). Liste vide = aucun compteur.
 * Jamais de chiffre inventé ni de chiffre « de marché ».
 */
export const STATS: readonly Stat[] = [];

export type Emergency = { enabled: boolean; situations: readonly string[] };

/**
 * Interventions en urgence : bandeau en haut de page, section de l'accueil, encarts des pages de service.
 * Seulement si l'artisan le confirme ; aucun délai, horaire ni prix n'est jamais affiché.
 */
// À LA LIVRAISON : urgence non confirmée par l'artisan (enabled: true seulement s'il la confirme)
export const EMERGENCY: Emergency = {
  enabled: false,
  situations: [
    "Panne de courant totale ou partielle",
    "Disjoncteur qui saute sans arrêt",
    "Prise ou câble qui chauffe, odeur de brûlé",
    "Tableau électrique qui grésille",
  ],
};

export type Legal = {
  /** Raison sociale (peut différer du nom commercial BRAND). */
  companyName: string;
  /** Forme juridique, et capital social s'il y a lieu. */
  legalForm: string;
  siret: string;
  /** Directeur ou directrice de la publication. */
  publisher: string;
  hostName: string;
  hostAddress: string;
};

/** Mentions légales. Champ vide = « Communiqué à la mise en ligne » (démo). */
// À LA LIVRAISON : informations légales de l'entreprise (raison sociale, forme juridique, SIRET, directeur de la publication)
export const LEGAL: Legal = {
  companyName: "",
  legalForm: "",
  siret: "",
  publisher: "",
  // À LA LIVRAISON : vérifier l'hébergeur (autre si domaine ou hébergement différent)
  hostName: "GitHub, Inc. (GitHub Pages)",
  hostAddress: "88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis",
};
