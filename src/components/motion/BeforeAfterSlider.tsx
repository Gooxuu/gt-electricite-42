"use client";

import * as Slider from "react-compare-slider/components";
import { useReactCompareSlider } from "react-compare-slider/hooks";
import { asset } from "@/lib/infos";
import type { StockPhoto } from "@/lib/stockPhotos";

type Props = {
  before: StockPhoto;
  after: StockPhoto;
  /** Fixer ici le ratio, ex. « aspect-[4/3] ». */
  className?: string;
};

const LABEL =
  "pointer-events-none absolute top-4 z-10 rounded-full bg-brand-deep/75 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white";

/**
 * Comparaison avant/après par glissement (souris, doigt ou flèches du clavier).
 * react-compare-slider gère le tactile, le clavier et l'accessibilité ; on compose ses briques pour
 * donner à la poignée un libellé en français (celui par défaut est en anglais).
 *
 * « Réduire les animations » est traité en CSS (globals.css, `[data-rcs="root"]`) et non par
 * `useReducedMotion` : la préférence du visiteur est inconnue au build, et une transition différente
 * entre le HTML statique et le navigateur provoquerait un écart d'hydratation.
 * Photos en `loading="lazy"` : sous la ligne de flottaison, elles ne doivent pas concurrencer le héros.
 */
export default function BeforeAfterSlider({ before, after, className = "" }: Props) {
  const slider = useReactCompareSlider({ transition: "0.15s ease-out" });

  return (
    <Slider.Provider {...slider}>
      <Slider.Root className={`relative overflow-hidden rounded-3xl ${className}`}>
        <Slider.Item item="itemOne">
          <Slider.Image src={asset(before.src)} alt={before.alt} loading="lazy" decoding="async" />
        </Slider.Item>
        <Slider.Item item="itemTwo">
          <Slider.Image src={asset(after.src)} alt={after.alt} loading="lazy" decoding="async" />
        </Slider.Item>
        <Slider.HandleRoot aria-label="Glisser ou utiliser les flèches du clavier pour comparer avant et après">
          <Slider.Handle />
        </Slider.HandleRoot>
        <span aria-hidden="true" className={`${LABEL} left-4`}>
          Avant
        </span>
        <span aria-hidden="true" className={`${LABEL} right-4`}>
          Après
        </span>
      </Slider.Root>
    </Slider.Provider>
  );
}
