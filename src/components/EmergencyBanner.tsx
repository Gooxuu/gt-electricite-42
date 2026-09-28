import { EMERGENCY, PHONE_DISPLAY, PHONE_TEL } from "@/lib/infos";

/** Bande « Urgence électrique ? » au-dessus du menu. Absente si l'artisan n'intervient pas en urgence. */
export default function EmergencyBanner() {
  if (!EMERGENCY.enabled) return null;
  return (
    <a
      href={PHONE_TEL}
      className="flex items-center justify-center gap-2.5 bg-accent px-4 py-2 text-center text-sm font-semibold text-brand-deep transition-colors hover:bg-accent-light"
    >
      <span aria-hidden="true" className="pulse-dot relative inline-block size-2.5 shrink-0 rounded-full bg-red-600 text-red-600" />
      <span>
        Urgence électrique&nbsp;? Appelez le{" "}
        <span className="whitespace-nowrap underline underline-offset-2">{PHONE_DISPLAY}</span>
      </span>
    </a>
  );
}
