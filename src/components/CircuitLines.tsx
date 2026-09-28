/** Pistes du motif (viewBox 600 × 400). */
const TRACES = [
  "M0 60H140L180 100H320",
  "M600 40H470L430 80H360V160",
  "M0 300H90L130 260H260L300 300H420",
  "M600 330H520L480 290V210H400",
  "M200 400V340L240 300",
];

/** Points de connexion, en bout de piste. */
const NODES: readonly (readonly [number, number])[] = [
  [320, 100],
  [360, 160],
  [420, 300],
  [400, 210],
  [240, 300],
  [140, 60],
];

/**
 * Motif « circuit » décoratif : pistes fines et points de connexion, parcourus par un courant jaune
 * (classe `circuit-current`, animée en CSS, figée avec « Réduire les animations »).
 * Les pistes suivent `currentColor` : poser `text-white` sur fond sombre.
 */
export default function CircuitLines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none ${className}`}
    >
      <g stroke="currentColor" strokeOpacity="0.14" strokeWidth="1.5">
        {TRACES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="stroke-accent" strokeWidth="2" strokeLinecap="round">
        {TRACES.map((d, index) => (
          <path
            key={d}
            d={d}
            pathLength={200}
            className="circuit-current"
            style={{ animationDelay: `${index * -1.2}s` }}
          />
        ))}
      </g>
      <g fill="currentColor" fillOpacity="0.3">
        {NODES.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
        ))}
      </g>
    </svg>
  );
}
