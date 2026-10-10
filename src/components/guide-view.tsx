import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";
import type { GuideContent } from "@/lib/guides";
import type { Hero, Role } from "@/lib/types";
import { HeroMark } from "@/components/ui";
import { SectionIcon } from "@/components/illustrations";

/** Affichage d'un guide (héros ou rôle) : sections compactes, counters et synergies avec liens vers les fiches. */
export function GuideView({ content, heroes, role }: { content: GuideContent; heroes: Hero[]; role: Role }) {
  const bySlug = new Map(heroes.map((h) => [h.slug, h]));
  return (
    <div className="flex flex-col gap-5">
      {content.summary ? <p className="max-w-3xl text-base text-fg-2">{content.summary}</p> : null}
      {content.patch_note ? (
        <p className="flex items-start gap-2 rounded-lg border border-accent/50 bg-accent/10 px-3 py-2 text-sm text-fg-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          {content.patch_note}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {content.sections.map((s) => (
            <section key={s.title} className="card flex flex-col gap-3">
              <h2 className="flex items-center gap-3 text-lg uppercase tracking-wide">
                <SectionIcon title={s.title} role={role} />
                <SectionTitle title={s.title} />
              </h2>
              <ul className="flex flex-col gap-2 text-sm text-fg-2">
                {s.items.map((it, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Panneau latéral : counters, synergies, sources */}
        <aside className="flex flex-col gap-4">
          {content.counters.length ? <HeroNotes title="Le contrent" tone="bad" items={content.counters} bySlug={bySlug} /> : null}
          {content.synergies.length ? <HeroNotes title="Synergies" tone="good" items={content.synergies} bySlug={bySlug} /> : null}
          {content.sources.length ? (
            <section className="card flex flex-col gap-2">
              <span className="eyebrow">Sources</span>
              <ul className="flex flex-col gap-1.5 text-sm">
                {content.sources.map((s, i) => (
                  <li key={i} className="text-fg-2">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-fg hover:text-accent">
                        {s.title} <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    ) : (
                      <span className="font-semibold text-fg">{s.title}</span>
                    )}
                    <span className="text-muted"> · {s.author}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted">Conseils reformulés à partir de ces vidéos.</p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

/** « Soin (Joyful Splash) » : le nom de la capacité passe en petite étiquette sous le titre. */
function SectionTitle({ title }: { title: string }) {
  const m = title.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (!m) return <span>{title}</span>;
  return (
    <span className="flex flex-col leading-tight">
      <span>{m[1]}</span>
      <span className="font-sans text-xs font-semibold normal-case tracking-normal text-muted">{m[2]}</span>
    </span>
  );
}

function HeroNotes({ title, tone, items, bySlug }: { title: string; tone: "good" | "bad"; items: { hero: string; note: string }[]; bySlug: Map<string, Hero> }) {
  return (
    <section className="card flex flex-col gap-3">
      <span className={tone === "bad" ? "eyebrow text-bad" : "eyebrow text-good"}>{title}</span>
      <ul className="flex flex-col gap-3">
        {items.map((it, i) => {
          const h = bySlug.get(it.hero);
          return (
            <li key={i} className="flex gap-3">
              {h ? <HeroMark name={h.name} role={h.roles[0]} size="sm" src={h.portrait_url} /> : null}
              <div className="min-w-0 text-sm">
                {h ? (
                  <Link href={`/heros/${h.slug}`} className="font-semibold hover:text-accent">
                    {h.name}
                  </Link>
                ) : (
                  <span className="font-semibold">{it.hero}</span>
                )}
                <p className="text-fg-2">{it.note}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
