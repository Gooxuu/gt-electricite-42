import { AGENCY_NAME, DEMO_MODE } from "@/lib/infos";

/** Bandeau du mode démo. Disparaît quand DEMO_MODE passe à false (lib/infos.ts). */
export default function DemoBanner() {
  if (!DEMO_MODE) return null;
  return (
    <div className="bg-brand-deep px-4 py-2 text-center text-xs font-medium text-white/85">
      Maquette de démonstration
      {AGENCY_NAME ? ` proposée par ${AGENCY_NAME}` : " — proposition de site"}
    </div>
  );
}
