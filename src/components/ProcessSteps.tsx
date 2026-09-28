import Icon, { type IconName } from "@/components/Icons";
import Reveal from "@/components/motion/Reveal";

export type Step = { icon: IconName; title: string; text: string };

/** « Comment ça se passe » : étapes numérotées, reliées par une ligne de circuit où circule le courant. */
export default function ProcessSteps({ steps, className = "" }: { steps: readonly Step[]; className?: string }) {
  return (
    <ol className={`relative grid gap-10 md:grid-cols-3 ${className}`}>
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-x-0 top-8 hidden h-1 w-full md:block"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
      >
        <line x1="17" y1="1" x2="83" y2="1" className="stroke-line" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <line
          x1="17"
          y1="1"
          x2="83"
          y2="1"
          pathLength={200}
          className="circuit-current stroke-accent"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {steps.map((step, index) => (
        <li key={step.title} className="relative text-center">
          <Reveal delay={index * 0.12}>
            <span className="relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-deep text-accent shadow-lg">
              <Icon name={step.icon} className="size-7" />
              <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-brand-deep">
                {index + 1}
              </span>
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-brand">{step.title}</h3>
            <p className="mx-auto mt-2 max-w-xs leading-relaxed text-muted">{step.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
