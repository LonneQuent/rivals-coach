import Link from "next/link";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Check, Repeat, X } from "lucide-react";
import { COMP_DIFFICULTY, type TeamComp } from "@/lib/comps";
import { ROLES, type Hero } from "@/lib/types";
import { HeroMark, RoleDot, ROLE_STYLES, buttonClass } from "@/components/ui";
import { DIAGRAM_LABEL, TacticDiagram } from "@/components/diagrams";
import { Rich } from "@/components/guide-view";
import { Mascot } from "@/components/mascot";

/** Fiche d'une compo : héros par rôle, schéma, plan de combat, conditions, remplaçants et matchups. */
export function CompView({ comp, comps, heroes, played, isAdmin }: { comp: TeamComp; comps: TeamComp[]; heroes: Hero[]; played: Map<string, number>; isAdmin: boolean }) {
  const bySlug = new Map(heroes.map((h) => [h.slug, h]));
  const c = comp.content;
  const compBySlug = new Map(comps.map((x) => [x.slug, x]));
  const heroName = (s: string) => bySlug.get(s)?.name ?? s;
  const mine = c.heroes.filter((h) => played.has(h.hero)).length;

  return (
    <>
      <Link href="/compos" className="text-sm text-muted hover:text-fg">
        ← Toutes les compos
      </Link>

      <header className="relative overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">Compo d&apos;équipe</span>
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">{DIAGRAM_LABEL[c.style]}</span>
            {c.difficulty ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-fg-2">
                <span className="flex gap-0.5" aria-hidden>
                  {[1, 2, 3].map((n) => (
                    <span key={n} className={`h-1.5 w-4 rounded-full ${n <= c.difficulty ? "bg-accent" : "bg-surface-3"}`} />
                  ))}
                </span>
                {COMP_DIFFICULTY[c.difficulty]}
              </span>
            ) : null}
            {comp.status === "draft" ? <span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs font-semibold text-fg-2">Brouillon</span> : null}
          </div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">{c.name}</h1>
          {c.tagline ? <p className="max-w-[60ch] text-lg text-fg-2">{c.tagline}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            <p className="rounded-lg border border-line bg-bg/60 px-3 py-1.5 text-sm">
              {mine ? (
                <>
                  Tu joues déjà <strong className="text-accent">{mine} héros sur {c.heroes.length}</strong>
                </>
              ) : (
                "Aucun de ces héros dans tes parties pour l'instant"
              )}
            </p>
            {isAdmin ? (
              <Link href={`/admin/compos/${comp.slug}`} className={buttonClass("default")}>
                Modifier
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {c.patch_note ? (
        <p className="flex max-w-[75ch] items-start gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-fg-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          {c.patch_note}
        </p>
      ) : null}

      {c.summary ? <p className="max-w-[70ch] text-lg leading-relaxed text-fg-2">{c.summary}</p> : null}

      {/* Les six héros, par rôle */}
      <section aria-labelledby="compo" className="flex flex-col gap-3">
        <h2 id="compo" className="text-2xl uppercase tracking-wide">
          Qui fait quoi
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {ROLES.map((role) => {
            const list = c.heroes.filter((h) => h.role === role);
            if (!list.length) return null;
            return (
              <div key={role} className="flex flex-col gap-2">
                <p className={`eyebrow flex items-center gap-2 ${ROLE_STYLES[role].text}`}>
                  <RoleDot role={role} /> {role}
                </p>
                {list.map((h) => {
                  const hero = bySlug.get(h.hero) as Hero | undefined;
                  const n = played.get(h.hero);
                  const body = (
                    <>
                      <HeroMark name={hero?.name ?? h.hero} role={role} size="lg" src={hero?.portrait_url} />
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-lg font-bold">{heroName(h.hero)}</span>
                          {n ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">{n} partie{n > 1 ? "s" : ""}</span> : null}
                        </p>
                        {h.job ? <p className="text-sm text-fg-2">{h.job}</p> : null}
                      </div>
                    </>
                  );
                  return hero ? (
                    <Link key={h.hero} href={`/heros/${hero.slug}`} className="lift flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
                      {body}
                    </Link>
                  ) : (
                    <div key={h.hero} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
                      {body}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <TacticDiagram kind={c.style} />
        {c.game_plan.length ? (
          <section aria-labelledby="plan" className="flex flex-col gap-3">
            <h2 id="plan" className="text-2xl uppercase tracking-wide">
              Plan de combat
            </h2>
            <ol className="flex flex-col gap-2.5">
              {c.game_plan.map((step, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-fg-2">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent font-display text-sm font-bold text-accent-ink">{i + 1}</span>
                  <span className="pt-0.5">
                    <Rich text={step} />
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>

      {c.best_when.length || c.failure_signs.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {c.best_when.length ? (
            <section className="rounded-xl border border-good/30 bg-good-bg/40 p-5">
              <h2 className="text-xl uppercase tracking-wide">Quand la jouer</h2>
              <ul className="mt-3 flex flex-col gap-2.5">
                {c.best_when.map((t, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-fg-2">
                    <Check className="mt-1 size-4 shrink-0 text-good" aria-hidden />
                    <span>
                      <Rich text={t} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {c.failure_signs.length ? (
            <section className="relative rounded-xl border border-bad/40 bg-bad-bg/60 p-5">
              <Mascot pose="warn" className="absolute -top-8 right-3 size-16" />
              <h2 className="text-xl uppercase tracking-wide">Signes que ça ne marche pas</h2>
              <ul className="mt-3 flex flex-col gap-2.5">
                {c.failure_signs.map((t, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-fg-2">
                    <X className="mt-1 size-4 shrink-0 text-bad" aria-hidden />
                    <span>
                      <Rich text={t} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      {c.alternatives.length ? (
        <section aria-labelledby="alt" className="flex flex-col gap-3">
          <h2 id="alt" className="text-2xl uppercase tracking-wide">
            Remplaçants
          </h2>
          <p className="text-sm text-muted">Si un héros est déjà pris ou que tu ne le joues pas.</p>
          <ul className="grid gap-2 md:grid-cols-2">
            {c.alternatives.map((a, i) => {
              const hero = bySlug.get(a.hero);
              const n = played.get(a.hero);
              return (
                <li key={i}>
                  <Link href={hero ? `/heros/${hero.slug}` : "#"} className="lift flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
                    {hero ? <HeroMark name={hero.name} role={hero.roles[0]} src={hero.portrait_url} /> : null}
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-x-2 text-sm">
                        <span className="font-semibold text-fg">{heroName(a.hero)}</span>
                        {a.replaces ? (
                          <span className="inline-flex items-center gap-1 text-muted">
                            <Repeat className="size-3.5" aria-hidden /> à la place de {heroName(a.replaces)}
                          </span>
                        ) : null}
                        {n ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">{n} partie{n > 1 ? "s" : ""}</span> : null}
                      </p>
                      {a.note ? <p className="text-sm text-fg-2">{a.note}</p> : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {c.strong_vs.length || c.weak_vs.length ? (
        <section aria-labelledby="matchups" className="flex flex-col gap-3">
          <h2 id="matchups" className="text-2xl uppercase tracking-wide">
            Face aux autres compos
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: "Forte contre", items: c.strong_vs, good: true },
              { title: "Faible contre", items: c.weak_vs, good: false },
            ]
              .filter((g) => g.items.length)
              .map((g) => (
                <div key={g.title} className="flex flex-col gap-2">
                  <p className={g.good ? "eyebrow text-good" : "eyebrow text-bad"}>{g.title}</p>
                  {g.items.map((m, i) => {
                    const other = compBySlug.get(m.comp);
                    const Icon = g.good ? ArrowUpRight : ArrowDownRight;
                    const body = (
                      <>
                        <Icon className={`mt-0.5 size-5 shrink-0 ${g.good ? "text-good" : "text-bad"}`} aria-hidden />
                        <div className="min-w-0">
                          <p className="font-display text-lg font-bold">{other?.content.name ?? m.comp}</p>
                          {m.note ? <p className="text-sm text-fg-2">{m.note}</p> : null}
                        </div>
                      </>
                    );
                    return other ? (
                      <Link key={i} href={`/compos/${other.slug}`} className={`lift flex items-start gap-3 rounded-xl border bg-surface p-3 ${g.good ? "border-good/30" : "border-bad/30"}`}>
                        {body}
                      </Link>
                    ) : (
                      <div key={i} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3">
                        {body}
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

/** Grille des compos, avec les héros que le joueur connaît déjà entourés. */
export function CompCards({ comps, heroes, played }: { comps: TeamComp[]; heroes: Hero[]; played: Map<string, number> }) {
  const bySlug = new Map(heroes.map((h) => [h.slug, h]));
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {comps.map((c) => {
            const list = [...c.content.heroes].sort((a, b) => ROLES.indexOf(a.role) - ROLES.indexOf(b.role));
            const mine = list.filter((h) => played.has(h.hero)).length;
            return (
              <li key={c.id}>
                <Link href={`/compos/${c.slug}`} className="card lift flex h-full flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold text-accent">{DIAGRAM_LABEL[c.content.style]}</span>
                    {c.content.difficulty ? <span className="text-[11px] font-semibold text-muted">{COMP_DIFFICULTY[c.content.difficulty]}</span> : null}
                    {c.status === "draft" ? <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[11px] font-semibold text-fg-2">Brouillon</span> : null}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold uppercase tracking-wide">{c.content.name}</h2>
                    {c.content.tagline ? <p className="mt-1 text-sm text-fg-2">{c.content.tagline}</p> : null}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {list.map((h) => {
                      const hero = bySlug.get(h.hero) as Hero | undefined;
                      return (
                        <span key={h.hero} title={hero?.name ?? h.hero} className={played.has(h.hero) ? "rounded-lg ring-2 ring-accent ring-offset-2 ring-offset-surface" : ""}>
                          <HeroMark name={hero?.name ?? h.hero} role={h.role} src={hero?.portrait_url} />
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted">
                    {mine ? (
                      <>
                        <span className="font-semibold text-accent">Tu joues déjà {mine} héros sur {list.length}</span> (entourés)
                      </>
                    ) : (
                      "Aucun de ces héros dans tes parties pour l'instant"
                    )}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
  );
}
