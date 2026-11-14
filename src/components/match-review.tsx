import Link from "next/link";
import { ArrowRightLeft, ShieldAlert, Sparkles, Swords, Users } from "lucide-react";
import { ROLES } from "@/lib/types";
import { compLabel, type Matchup, type Review, type ReviewHero, type Verdict } from "@/lib/review";
import { HeroMark, ROLE_STYLES } from "@/components/ui";

function Chip({ hero }: { hero: ReviewHero }) {
  return (
    <Link href={`/heros/${hero.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 py-0.5 pl-0.5 pr-2 text-xs font-semibold hover:border-accent/60">
      <HeroMark name={hero.name} role={hero.roles[0]} size="sm" src={hero.portrait_url} />
      {hero.name}
    </Link>
  );
}

function Team({ title, heroes, comp, style }: { title: string; heroes: ReviewHero[]; comp: Review["comp"]["ally"]; style: Review["comp"]["allyStyle"] }) {
  if (!heroes.length) return null;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="eyebrow flex flex-wrap items-center gap-x-2">
        {title}
        {comp ? (
          <span className="font-sans text-xs font-normal normal-case tracking-normal text-muted">
            {compLabel(comp)} ·{" "}
            {ROLES.map((r) => (
              <span key={r} className={ROLE_STYLES[r].text}>
                {comp[r]} {r}
                {comp[r] > 1 ? "s" : ""}{" "}
              </span>
            ))}
          </span>
        ) : null}
        {style ? (
          <Link href={`/compos/${style}`} className="rounded-full border border-line px-2 py-0.5 font-sans text-xs font-semibold normal-case tracking-normal text-fg-2 hover:border-accent/60">
            Style {style}
          </Link>
        ) : null}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {heroes.map((h) => (
          <Chip key={h.id} hero={h} />
        ))}
      </div>
    </div>
  );
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-line p-3">
      <h3 className="flex items-center gap-2 font-display text-base font-semibold uppercase tracking-wide">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function Matchups({ items, withNotes = true }: { items: Matchup[]; withNotes?: boolean }) {
  if (!withNotes)
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((m) => (
          <Chip key={m.hero.id} hero={m.hero} />
        ))}
      </div>
    );
  return (
    <ul className="flex flex-col gap-2">
      {items.map((m) => (
        <li key={m.hero.id} className="flex flex-col items-start gap-1">
          <Chip hero={m.hero} />
          {m.note ? <p className="text-sm text-fg-2">{m.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

const WHO = { toi: { label: "Toi", cls: "bg-accent text-accent-ink" }, equipe: { label: "Équipe", cls: "bg-surface-3 text-fg" } } as const;

/** Le verdict : la cause principale, les écarts qui l'appuient, puis ce qu'il fallait faire, dans l'ordre d'importance. */
function VerdictCard({ verdict, mine }: { verdict: Verdict; mine: boolean }) {
  const loss = verdict.kind === "loss";
  return (
    <div className={`flex flex-col gap-4 rounded-lg border-l-4 bg-surface-2 p-4 ${loss ? "border-bad" : "border-good"}`}>
      <div className="flex flex-col gap-2">
        <p className={`text-xs font-semibold ${loss ? "text-bad" : "text-good"}`}>{loss ? "Ce qui a fait perdre" : "Ce qui a fait gagner"}</p>
        <p className="font-display text-2xl font-semibold leading-tight text-fg">{verdict.headline}</p>
        {verdict.causes.length ? (
          <ul className="tabular flex flex-col gap-1 text-sm text-fg-2">
            {verdict.causes.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden className={`mt-2 size-1.5 shrink-0 rounded-full ${loss ? "bg-bad" : "bg-good"}`} />
                {c}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {verdict.steps.length ? (
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-base font-semibold uppercase tracking-wide">{loss ? "Pour gagner, il fallait" : "À corriger quand même"}</h3>
          <ol className="flex flex-col gap-2">
            {verdict.steps.map((s) => (
              <li key={s.title} className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-3 sm:flex-row sm:gap-3">
                <span className={`h-fit w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold sm:mt-0.5 sm:w-16 sm:text-center ${WHO[s.who].cls}`}>{WHO[s.who].label}</span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-semibold text-fg">{s.title}</p>
                  <p className="text-sm text-fg-2">{s.detail}</p>
                  {s.link ? (
                    <Link href={s.link.href} className="w-fit text-sm font-semibold text-accent hover:underline">
                      {s.link.label}
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      <p className="text-xs text-muted">
        {verdict.full
          ? "Déduit des écarts de la feuille de match, des counters des guides et des compos. La feuille ne dit pas qui a tué qui : ce sont les causes les plus probables, pas une certitude."
          : "Bilan partiel : sans la feuille de match, il ne porte que sur ton héros et la compo adverse."}
        {!verdict.full && mine ? (
          <>
            {" "}
            <Link href="/saisir?mode=capture" className="font-semibold text-accent hover:underline">
              Importer la capture
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}

const TONE = { good: "border-good/40 bg-good-bg text-good", warn: "border-bad/40 bg-bad-bg text-bad", info: "border-line bg-surface-2 text-fg-2" } as const;

/**
 * Review d'une partie : les deux compos, ce qui contrait ton héros, ce qu'il contrait, les synergies et
 * les changements de héros qui auraient mieux répondu à la compo adverse.
 */
export function MatchReview({ review, hero, allies, enemies, mine = true }: { review: Review; hero: ReviewHero; allies: ReviewHero[]; enemies: ReviewHero[]; mine?: boolean }) {
  const empty = !review.threats.length && !review.targets.length && !review.synergies.length && !review.teamups.length && !review.swaps.length && !review.pressured.length;
  return (
    <section className="card flex flex-col gap-4" aria-labelledby="review">
      <div>
        <h2 id="review" className="text-lg uppercase tracking-wide">
          Bilan de la partie
        </h2>
        <p className="text-sm text-muted">Calculé par règles à partir de la feuille de match, des guides et des compos, sans appel à une IA. Il porte sur {hero.name}.</p>
      </div>

      {review.verdict ? <VerdictCard verdict={review.verdict} mine={mine} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Team title="Ton équipe" heroes={allies.length ? [hero, ...allies] : []} comp={review.comp.ally} style={review.comp.allyStyle} />
        <Team title="Équipe adverse" heroes={enemies} comp={review.comp.enemy} style={review.comp.enemyStyle} />
      </div>

      {review.comp.notes.length || review.facts.length ? (
        <ul className="flex flex-col gap-1.5">
          {review.comp.notes.map((n) => (
            <li key={n.text} className={`rounded-lg border px-3 py-1.5 text-sm ${TONE[n.tone]}`}>
              {n.text}
            </li>
          ))}
          {review.facts.map((f) => (
            <li key={f} className={`rounded-lg border px-3 py-1.5 text-sm ${TONE.info}`}>
              {f}
            </li>
          ))}
        </ul>
      ) : null}

      {empty ? (
        <p className="text-sm text-muted">Aucun counter ni synergie référencé dans les guides pour ces héros.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {review.threats.length ? (
            <Block icon={<ShieldAlert className="size-4 text-bad" aria-hidden />} title={`Ils te contraient (${review.threats.length})`}>
              <Matchups items={review.threats} />
            </Block>
          ) : null}
          {review.targets.length ? (
            <Block icon={<Swords className="size-4 text-good" aria-hidden />} title={`Tu les contrais (${review.targets.length})`}>
              <Matchups items={review.targets} withNotes={false} />
              <p className="text-sm text-fg-2">Leur guide cite {hero.name} parmi leurs counters : ce sont tes cibles prioritaires.</p>
            </Block>
          ) : null}
          {review.synergies.length || review.teamups.length ? (
            <Block icon={<Sparkles className="size-4 text-accent" aria-hidden />} title="Avec tes alliés">
              {review.teamups.map((t) => (
                <div key={`${t.name}-${t.partner.id}`} className="flex flex-col items-start gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip hero={t.partner} />
                    <span className="text-xs font-semibold text-accent">Team-up {t.name}</span>
                  </div>
                  {t.text ? <p className="text-sm text-fg-2">{t.text.replace(/\*\*/g, "")}</p> : null}
                </div>
              ))}
              <Matchups items={review.synergies.filter((s) => !review.teamups.some((t) => t.partner.id === s.hero.id))} />
            </Block>
          ) : null}
          {review.pressured.length ? (
            <Block icon={<Users className="size-4 text-van" aria-hidden />} title="Alliés sous pression">
              <ul className="flex flex-col gap-2">
                {review.pressured.map((p) => (
                  <li key={p.ally.id} className="flex flex-wrap items-center gap-1.5 text-sm text-fg-2">
                    <Chip hero={p.ally} /> visé par {p.by.map((b) => b.name).join(", ")}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted">Plusieurs adversaires contraient ces alliés : ils avaient besoin d&apos;aide ou d&apos;un changement de héros.</p>
            </Block>
          ) : null}
          {review.swaps.length ? (
            <Block icon={<ArrowRightLeft className="size-4 text-accent" aria-hidden />} title="Swaps possibles">
              <ul className="flex flex-col gap-2">
                {review.swaps.map((s) => (
                  <li key={s.hero.id} className="flex flex-col items-start gap-1">
                    <Chip hero={s.hero} />
                    <p className="text-sm text-fg-2">{s.reasons.join(" · ")}</p>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted">Parmi les héros que tu joues au même rôle, ceux que cette compo adverse gênait moins.</p>
            </Block>
          ) : null}
        </div>
      )}
    </section>
  );
}
