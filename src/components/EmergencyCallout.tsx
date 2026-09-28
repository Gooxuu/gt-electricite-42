import CallButton from "@/components/CallButton";
import CircuitLines from "@/components/CircuitLines";
import { Container } from "@/components/Section";
import { EMERGENCY } from "@/lib/infos";

/** Encart « Besoin d’une intervention rapide ? » des pages de service. Absent sans urgence confirmée. */
export default function EmergencyCallout() {
  if (!EMERGENCY.enabled) return null;
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-3xl bg-brand-deep px-6 py-8 text-white sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-2xl font-extrabold">Besoin d’une intervention rapide&nbsp;?</p>
            <p className="mt-2 text-white/80">Panne, disjoncteur qui saute, odeur de brûlé&nbsp;: appelez-nous directement.</p>
          </div>
          <div className="relative shrink-0">
            {/* Motif circuit autour du bouton, sur grand écran seulement (sur mobile, le bouton suit le texte de près). */}
            <CircuitLines className="absolute -left-6 -top-10 -z-10 hidden h-[calc(100%+5rem)] w-[calc(100%+4rem)] text-white lg:block" />
            <CallButton size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
