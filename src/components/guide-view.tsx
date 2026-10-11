import Link from "next/link";
import { AlertTriangle, Check, ExternalLink, Lightbulb, X } from "lucide-react";
import { sectionAnchor, type GuideContent, type GuideSection } from "@/lib/guides";
import type { Hero, Role } from "@/lib/types";
import { HeroMark } from "@/components/ui";
import { SectionIcon } from "@/components/illustrations";
import { GuideToc, ReadingProgress } from "@/components/guide-toc";

const ROLE_VAR: Record<Role, string> = { Vanguard: "var(--color-van)", Duelist: "var(--color-due)", Strategist: "var(--color-str)" };
const DIFFICULTY = ["", "Accessible", "Intermédiaire", "Exigeant"];

/** Texte avec mots-clés en gras : « **pression** » → <strong>. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-fg">
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function Keycap({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1" title="Touche par défaut">
      {label.split("·").map((k) => (
        <kbd key={k} className="rounded-md border border-line border-b-[3px] bg-surface-3 px-1.5 py-0.5 font-sans text-[11px] font-bold tracking-normal text-fg normal-case">
          {k.trim()}
        </kbd>
      ))}
    </span>
  );
}

/**
 * Guide en page de lecture : bandeau « En bref », sommaire latéral collant, sections aérées
 * (séparateurs plutôt que boîtes), bloc « À éviter », cartes counters et alliés, sources.
 */
export function GuideView({ content, heroes, role }: { content: GuideContent; heroes: Hero[]; role: Role }) {
  const accent = ROLE_VAR[role];
  const bySlug = new Map(heroes.map((h) => [h.slug, h]));
  const sections = content.sections.map((s, i) => ({ ...s, id: sectionAnchor(s.title, i) }));
  const toc = [
    ...sections.map((s) => ({ id: s.id, label: s.kind === "mistakes" ? "À éviter" : s.title })),
    ...(content.counters.length || content.synergies.length ? [{ id: "matchups", label: "Counters et alliés" }] : []),
  ];

  return (
    <div className="flex flex-col gap-8">
      <ReadingProgress accent={accent} />

      {/* En bref */}
      {content.summary || content.tldr.length ? (
        <section aria-labelledby="en-bref" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="flex flex-col gap-4">
            {content.summary ? <p className="max-w-[65ch] text-lg leading-relaxed text-fg-2">{content.summary}</p> : null}
            {content.tldr.length ? (
              <div>
                <h2 id="en-bref" className="eyebrow mb-2">
                  En bref
                </h2>
                <ol className="grid gap-3 sm:grid-cols-3">
                  {content.tldr.map((t, i) => (
                    <li key={i} className="flex gap-3 rounded-xl border border-line bg-surface p-4" style={{ borderTop: `3px solid ${accent}` }}>
                      <span className="font-display text-3xl font-bold leading-none" style={{ color: accent }}>
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-fg-2">
                        <Rich text={t} />
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
          {content.difficulty || content.tags.length ? (
            <aside className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4">
              {content.difficulty ? (
                <div>
                  <p className="eyebrow">Difficulté</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="flex gap-1" aria-hidden>
                      {[1, 2, 3].map((n) => (
                        <span key={n} className="h-2 w-6 rounded-full" style={{ background: n <= content.difficulty ? accent : "var(--color-surface-3)" }} />
                      ))}
                    </span>
                    <span className="text-sm font-semibold">{DIFFICULTY[content.difficulty]}</span>
                  </div>
                </div>
              ) : null}
              {content.tags.length ? (
                <div>
                  <p className="eyebrow">Style de jeu</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {content.tags.map((t) => (
                      <span key={t} className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          ) : null}
        </section>
      ) : null}

      {content.patch_note ? (
        <p className="flex max-w-[75ch] items-start gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-fg-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          {content.patch_note}
        </p>
      ) : null}

      {/* Corps : sommaire + lecture */}
      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <GuideToc items={toc} accent={accent} />
        <article className="flex min-w-0 max-w-[72ch] flex-col">
          {sections.map((s, i) => (
            <Section key={s.id} s={s} id={s.id} role={role} accent={accent} first={i === 0} />
          ))}

          {content.counters.length || content.synergies.length ? (
            <section id="matchups" className="scroll-mt-24 border-t border-line pt-8">
              <h2 className="text-2xl uppercase tracking-wide">Counters et alliés</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                {content.counters.length ? <Matchups title="Le contrent" tone="bad" items={content.counters} bySlug={bySlug} /> : null}
                {content.synergies.length ? <Matchups title="Ses meilleurs alliés" tone="good" items={content.synergies} bySlug={bySlug} /> : null}
              </div>
            </section>
          ) : null}

          {content.sources.length ? (
            <footer className="mt-10 border-t border-line pt-5 text-sm text-muted">
              <p className="eyebrow mb-2">Sources</p>
              <ul className="flex flex-col gap-1">
                {content.sources.map((s, i) => (
                  <li key={i}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-fg-2 hover:text-accent">
                        {s.title} <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    ) : (
                      <span className="font-semibold text-fg-2">{s.title}</span>
                    )}{" "}
                    · {s.author}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs">Conseils reformulés en français à partir de ces vidéos.</p>
            </footer>
          ) : null}
        </article>
      </div>
    </div>
  );
}

function Section({ s, id, role, accent, first }: { s: GuideSection; id: string; role: Role; accent: string; first: boolean }) {
  if (s.kind === "mistakes") {
    return (
      <section id={id} className="scroll-mt-24 border-t border-line py-8">
        <div className="rounded-xl border border-bad/40 bg-bad-bg/60 p-5">
          <h2 className="flex items-center gap-3 text-2xl uppercase tracking-wide">
            <span className="grid size-9 place-items-center rounded-lg bg-bad/20 text-bad" aria-hidden>
              <X className="size-5" />
            </span>
            À éviter
          </h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {s.items.map((it, i) => (
              <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-fg-2">
                <X className="mt-1 size-4 shrink-0 text-bad" aria-hidden />
                <span>
                  <Rich text={it} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const Marker = s.kind === "tips" ? Lightbulb : Check;
  return (
    <section id={id} className={`scroll-mt-24 py-8 ${first ? "pt-0" : "border-t border-line"}`}>
      <header className="flex items-start gap-3">
        <SectionIcon title={s.title} role={role} className="mt-1" />
        <div className="min-w-0">
          <h2 className="text-2xl uppercase tracking-wide">{s.title}</h2>
          {s.ability || s.key ? (
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              {s.ability ? <span className="font-semibold text-fg-2">{s.ability}</span> : null}
              {s.key ? <Keycap label={s.key} /> : null}
            </p>
          ) : null}
        </div>
      </header>
      {s.lead ? (
        <p className="mt-4 border-l-2 pl-4 text-lg leading-relaxed text-fg" style={{ borderColor: accent }}>
          <Rich text={s.lead} />
        </p>
      ) : null}
      <ul className={`mt-5 flex flex-col gap-3.5 ${s.kind === "tips" ? "rounded-xl bg-surface p-5" : ""}`}>
        {s.items.map((it, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-fg-2">
            <Marker className="mt-1 size-4 shrink-0" style={{ color: accent }} aria-hidden />
            <span>
              <Rich text={it} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Matchups({ title, tone, items, bySlug }: { title: string; tone: "good" | "bad"; items: { hero: string; note: string }[]; bySlug: Map<string, Hero> }) {
  return (
    <div className="flex flex-col gap-3">
      <p className={tone === "bad" ? "eyebrow text-bad" : "eyebrow text-good"}>{title}</p>
      <ul className="flex flex-col gap-2">
        {items.map((it, i) => {
          const h = bySlug.get(it.hero);
          const body = (
            <>
              {h ? <HeroMark name={h.name} role={h.roles[0]} size="lg" src={h.portrait_url} /> : null}
              <div className="min-w-0">
                <p className="font-display text-lg font-bold">{h?.name ?? it.hero}</p>
                <p className="text-sm text-fg-2">{it.note}</p>
              </div>
            </>
          );
          return (
            <li key={i}>
              {h ? (
                <Link href={`/heros/${h.slug}`} className={`lift flex items-center gap-3 rounded-xl border bg-surface p-3 ${tone === "bad" ? "border-bad/30" : "border-good/30"}`}>
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
