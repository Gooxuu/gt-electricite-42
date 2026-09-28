import AnimatedStat from "@/components/motion/AnimatedStat";
import { Container } from "@/components/Section";
import type { Stat } from "@/lib/infos";

/** Chiffres confirmés par l'artisan, en compteurs animés. Rien n'est affiché si la liste est vide. */
export default function StatsBand({ stats }: { stats: readonly Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <section className="bg-brand-deep py-16 text-white">
      <Container>
        <dl className="grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-2">
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/70">{stat.label}</dt>
              <dd className="font-display text-5xl font-extrabold text-accent">
                <AnimatedStat value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
