import type { Pair } from '@/content/types';

/** PRD §6.9 — legal document in the reference typography: draft plaque, last updated, sections. */
export function DocBody({ draft, updated, sections }: { draft: string; updated: string; sections: readonly Pair[] }) {
  return (
    <section className="section-inner pb-24 lg:pb-32">
      <div className="flex max-w-[46rem] flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="draft-plaque">{draft}</p>
          <p className="text-sm text-muted-foreground">{updated}</p>
        </div>
        {sections.map(([h, p]) => (
          <section key={h} className="flex flex-col gap-3 border-t border-white/[0.09] pt-8">
            <h2 className="font-display text-2xl tracking-tight text-foreground">{h}</h2>
            <p className="leading-relaxed text-white/65">{p}</p>
          </section>
        ))}
      </div>
    </section>
  );
}
