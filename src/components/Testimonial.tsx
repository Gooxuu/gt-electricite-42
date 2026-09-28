import Icon from "@/components/Icons";
import { TESTIMONIAL, type Testimonial as TestimonialData } from "@/lib/infos";

/**
 * Un vrai avis client, cité mot pour mot, sans nom ni note ajoutés. Rien s'il n'y a pas d'avis.
 * Volontairement sobre : pas d'animation.
 */
export default function Testimonial({ testimonial = TESTIMONIAL }: { testimonial?: TestimonialData | null }) {
  if (!testimonial) return null;
  return (
    <figure className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-8 shadow-sm sm:p-10">
      <Icon name="quote" className="size-9 text-accent-dark" />
      <blockquote className="mt-4 font-display text-xl font-semibold leading-relaxed text-brand sm:text-2xl">
        «&nbsp;{testimonial.quote}&nbsp;»
      </blockquote>
      <figcaption className="mt-5 text-sm font-medium text-muted">{testimonial.source}</figcaption>
    </figure>
  );
}
