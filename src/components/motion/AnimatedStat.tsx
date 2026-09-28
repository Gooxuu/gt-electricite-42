"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  /** Valeur réelle, confirmée par l'artisan. Jamais de chiffre inventé. */
  value: number;
  /** Texte collé après le nombre, ex. « + » ou « ans ». */
  suffix?: string;
  /** Durée du comptage en secondes. */
  duration?: number;
  className?: string;
};

const format = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

/**
 * Compteur animé de 0 à `value` quand il entre dans l'écran.
 * Le HTML statique contient déjà la valeur finale (moteurs de recherche, visite sans JavaScript) ;
 * les lecteurs d'écran ne lisent que la valeur finale, jamais le comptage.
 */
export default function AnimatedStat({ value, suffix = "", duration = 1.6, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const final = `${format(value)}${suffix}`;

  // Avant l'entrée dans l'écran : repartir de 0 pour que le comptage soit visible.
  useEffect(() => {
    if (reduce || inView || !ref.current) return;
    ref.current.textContent = `${format(0)}${suffix}`;
  }, [reduce, inView, suffix]);

  useEffect(() => {
    if (reduce || !inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        node.textContent = `${format(latest)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [reduce, inView, value, suffix, duration]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
