import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, BookOpen, GraduationCap, ImageUp, PenLine, Target } from "lucide-react";
import { MIN_MATCHES_FOR_FOCUS, buildInsights, recentForm, type Insight } from "@/lib/focus";
import { mapShortName } from "@/lib/maps";
import { evalGoal, formatMetric, goalLabel, type Goal, type MatchRow } from "@/lib/stats";
import { tipOfTheDay } from "@/lib/tips";
import type { Hero, Role } from "@/lib/types";
import { Rich } from "@/components/guide-view";
import { Mascot } from "@/components/mascot";
import { HeroMark, ROLE_STYLES, buttonClass } from "@/components/ui";

export type LastMatch = {
  id: string;
  played_at: string;
  result: "win" | "loss";
  award: "MVP" | "SVP" | null;
  duration_min: number | null;
  map: { name: string } | null;
  queue: { name: string } | null;
  match_heroes: { hero_id: number; position: number; role: Role; kills: number | null; deaths: number | null; assists: number | null }[];
};
export type GuideNews = { hero_id: number | null; season: string | null; changes: { season: string; text: string }[] | null };

const TONE_BAR: Record<Insight["tone"], string> = { warn: "bg-bad", good: "bg-good", info: "bg-accent" };

function ago(iso: string): string {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 864e5);
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days} jours`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-xl tracking-wide">{children}</h2>
      {action}
    </div>
  );
}

const moreLink = "inline-flex items-center gap-1 text-sm font-semibold text-fg-2 hover:text-accent";

export type HomeData = {
  pseudo: string | null;
  userId: string;
  heroes: Hero[];
  /** Parties du joueur, de la plus ancienne à la plus récente. */
  matches: MatchRow[];
  last: LastMatch | null;
  goalRows: Goal[];
  picks: { hero_id: number; kind: "main" | "train" }[];
  focus: string[];
  note: { id: string; body: string; created_at: string; coach: { pseudo: string | null } | null } | null;
  news: GuideNews[];
  newHeroIds: number[];
};

/** Accueil : la consigne de la semaine, la forme, les objectifs, les héros du joueur et ce qui change pour eux. */
export function HomeView({ pseudo, userId, heroes, matches, last, goalRows, picks, focus, note, news, newHeroIds }: HomeData) {
  const heroOf = new Map(heroes.map((h) => [h.id, h]));
  const form = recentForm(matches);
  const insights = buildInsights(matches, heroes);
  const goals = goalRows.map((g) => ({ goal: g, ...evalGoal({ ...g, target: Number(g.target) }, matches) }));
  const focusAreas = focus.slice(0, 6);

  // Tes héros : mains et héros à entraîner, complétés par les plus joués récemment
  const tally = new Map<number, { games: number; wins: number }>();
  for (const m of matches) {
    const id = m.match_heroes[0]?.hero_id;
    if (!id) continue;
    const t = tally.get(id) ?? { games: 0, wins: 0 };
    t.games++;
    if (m.result === "win") t.wins++;
    tally.set(id, t);
  }
  const kindOf = new Map(picks.map((p) => [p.hero_id, p.kind]));
  const mostPlayed = [...tally.entries()].sort((a, b) => b[1].games - a[1].games).map(([id]) => id);
  const myHeroIds = [...new Set([...picks.filter((p) => p.kind === "main").map((p) => p.hero_id), ...picks.filter((p) => p.kind === "train").map((p) => p.hero_id), ...mostPlayed])].filter((id) => heroOf.has(id)).slice(0, 6);
  const myHeroes = myHeroIds.map((id) => ({ hero: heroOf.get(id) as Hero, kind: kindOf.get(id) ?? null, ...(tally.get(id) ?? { games: 0, wins: 0 }) }));

  // Saison en cours et changements d'équilibrage qui touchent tes héros
  const seasons = new Map<string, number>();
  for (const g of news) if (g.season) seasons.set(g.season, (seasons.get(g.season) ?? 0) + 1);
  const season = [...seasons.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const changesOf = new Map(news.filter((g) => g.hero_id).map((g) => [g.hero_id as number, (g.changes ?? []).filter((c) => c.season === season)]));
  const patch = myHeroIds.map((id) => ({ hero: heroOf.get(id) as Hero, changes: changesOf.get(id) ?? [] })).filter((p) => p.changes.length).slice(0, 4);
  const newHeroes = newHeroIds.map((id) => heroOf.get(id)).filter((h): h is Hero => !!h);
  // Un référentiel tout neuf date tous ses héros du même jour : on ne les annonce pas comme nouveaux
  const freshHeroes = newHeroes.length <= 3 ? newHeroes : [];

  // La première priorité ouvre la page ; les suivantes sont listées en dessous
  const [top, ...others] = insights;
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });
  const headline = insights[0]?.title
    ?? (matches.length < MIN_MATCHES_FOR_FOCUS
      ? matches.length === 0
        ? "Importe ta première partie : ton diagnostic se construit à partir de cinq."
        : `Encore ${MIN_MATCHES_FOR_FOCUS - matches.length} partie${MIN_MATCHES_FOR_FOCUS - matches.length > 1 ? "s" : ""} et ton premier diagnostic se débloque.`
      : "Rien d'alarmant sur tes dernières parties. Garde le cap.");

  return (
    <>
      {/* Briefing : la consigne de la semaine d'abord, la forme récente à côté */}
      <section className="grid items-end gap-6 border-b border-line pb-7 lg:grid-cols-[minmax(0,1fr)_300px]" aria-labelledby="briefing">
        <div className="min-w-0">
          <p className="text-sm text-muted">
            <span className="first-letter:uppercase inline-block">{today}</span>
            {season ? <span className="ml-3 rounded-full border border-line px-2 py-0.5 text-xs text-fg-2">{season}</span> : null}
          </p>
          <h1 id="briefing" className="mt-2 text-4xl leading-[0.95] tracking-wide sm:text-6xl">
            Salut {pseudo || "toi"}.
          </h1>
          <p className="mt-3 max-w-[46ch] text-lg leading-snug text-fg sm:text-xl">{headline}</p>
          {top ? (
            <p className="mt-2 max-w-[62ch] text-sm text-fg-2">
              {top.detail}{" "}
              {top.link ? (
                <Link href={top.link.href} className="font-semibold text-accent hover:underline">
                  {top.link.label}
                </Link>
              ) : null}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/saisir?mode=capture" className={buttonClass("primary")}>
              <ImageUp className="size-4" aria-hidden /> Importer une capture
            </Link>
            <Link href="/saisir" className={buttonClass("default")}>
              <PenLine className="size-4" aria-hidden /> Saisir à la main
            </Link>
          </div>
        </div>

        <div className="min-w-0">
          {form.results.length ? (
            <>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm text-muted">Tes {form.results.length} dernières parties</p>
                <p className="font-display text-2xl font-bold tabular">
                  <span className="text-good">{form.wins} V</span> <span className="text-muted">/</span> <span className="text-bad">{form.losses} D</span>
                </p>
              </div>
              {/* Victoires au-dessus de la ligne, défaites en dessous ; la plus récente à droite */}
              <ol className="mt-3 flex justify-end gap-1.5" aria-label={`Résultats, du plus ancien au plus récent : ${form.results.map((w) => (w ? "victoire" : "défaite")).join(", ")}`}>
                {form.results.map((win, i) => (
                  <li key={i} className="grid w-full max-w-7 grid-rows-2 gap-px" aria-hidden>
                    <span className={clsx("h-6 rounded-t-sm", win ? "bg-good" : "bg-transparent")} />
                    <span className={clsx("h-6 rounded-b-sm border-t border-line", win ? "bg-transparent" : "bg-bad")} />
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-sm text-fg-2">
                {form.streak && form.streak.length >= 2 ? `${form.streak.length} ${form.streak.win ? "victoires" : "défaites"} de suite.` : "Pas de série en cours."}{" "}
                <Link href="/historique" className="font-semibold text-fg-2 underline decoration-line underline-offset-4 hover:text-accent">
                  Historique
                </Link>
              </p>
            </>
          ) : (
            <p className="text-sm text-fg-2">Aucune partie pour l&apos;instant. Une capture du tableau des scores suffit pour commencer.</p>
          )}
        </div>
      </section>

      <div className="grid gap-x-8 gap-y-8 lg:grid-cols-5">
        {/* À travailler */}
        <section className="flex min-w-0 flex-col gap-4 lg:col-span-3" aria-labelledby="focus">
          <SectionTitle
            action={
              <Link href="/profil" className={moreLink}>
                Mes axes et objectifs <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            }
          >
            <span id="focus">{top ? "Aussi cette semaine" : "À travailler cette semaine"}</span>
          </SectionTitle>

          {others.length ? (
            <ol className="flex flex-col" start={2}>
              {others.map((it, i) => (
                <li key={it.key} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 border-t border-line py-4 first:border-t-0 first:pt-0">
                  <span className="relative pl-3 font-display text-4xl font-bold leading-none text-fg-2 tabular" aria-hidden>
                    <span className={clsx("absolute inset-y-0.5 left-0 w-1 rounded-full", TONE_BAR[it.tone])} />
                    {i + 2}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[17px] font-semibold leading-snug">{it.title}</p>
                    <p className="mt-1 max-w-[62ch] text-sm text-fg-2">{it.detail}</p>
                    {it.link ? (
                      <Link href={it.link.href} className={clsx(moreLink, "mt-2 text-accent")}>
                        {it.link.label}
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : top ? (
            <p className="text-sm text-fg-2">Rien d&apos;autre à signaler : concentre-toi sur ce point.</p>
          ) : matches.length < MIN_MATCHES_FOR_FOCUS ? (
            <div className="rounded-xl border border-dashed border-line p-5">
              <p className="font-semibold">Saisis {MIN_MATCHES_FOR_FOCUS} parties pour débloquer ton premier diagnostic.</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuemin={0} aria-valuemax={MIN_MATCHES_FOR_FOCUS} aria-valuenow={matches.length} aria-label="Parties saisies">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(matches.length / MIN_MATCHES_FOR_FOCUS) * 100}%` }} />
                </div>
                <span className="text-sm text-fg-2 tabular">
                  {matches.length} sur {MIN_MATCHES_FOR_FOCUS}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted">Le diagnostic compare tes dernières parties à tes habitudes : morts, héros, production dans ton rôle.</p>
            </div>
          ) : (
            <p className="text-sm text-fg-2">Aucun écart marquant entre tes dernières parties et tes habitudes. Le diagnostic se met à jour à chaque partie ajoutée.</p>
          )}

          {focusAreas.length ? (
            <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <span className="text-sm text-muted">Tes axes :</span>
              {focusAreas.map((f) => (
                <span key={f} className="rounded-full bg-surface-2 px-3 py-1 text-sm font-medium">
                  {f}
                </span>
              ))}
            </div>
          ) : null}

        </section>

        {/* Objectifs et dernière partie */}
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-2">
          <section className="flex flex-col gap-3" aria-labelledby="goals">
            <SectionTitle>
              <span id="goals">Objectifs</span>
            </SectionTitle>
            {goals.length ? (
              <ul className="flex flex-col gap-2">
                {goals.map(({ goal, value, met, games }) => (
                  <li key={goal.id} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
                    <Target className={clsx("size-5 shrink-0", games ? (met ? "text-good" : "text-bad") : "text-muted")} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{goalLabel(goal)}</p>
                      <p className="text-xs text-muted">{games ? `Sur tes ${games} dernières parties${goal.created_by !== userId ? ", fixé par ton coach" : ""}` : "Pas encore de partie concernée"}</p>
                    </div>
                    <p className={clsx("font-display text-2xl font-bold tabular", games ? (met ? "text-good" : "text-bad") : "text-muted")}>{formatMetric(goal.metric, value)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-fg-2">
                Aucun objectif en cours.{" "}
                <Link href="/profil" className="font-semibold text-accent hover:underline">
                  Fixe-toi un objectif mesurable
                </Link>
                , par exemple moins de six morts par partie.
              </p>
            )}
          </section>

          {last ? (
            <section className="flex flex-col gap-3" aria-labelledby="last">
              <SectionTitle>
                <span id="last">Dernière partie</span>
              </SectionTitle>
              <Link href={`/historique/${last.id}`} className="lift relative flex items-center gap-4 overflow-hidden rounded-xl border border-line bg-surface py-3 pl-5 pr-4">
                <span className={clsx("absolute inset-y-0 left-0 w-1.5", last.result === "win" ? "bg-good" : "bg-bad")} aria-hidden />
                <div className="flex -space-x-2">
                  {[...last.match_heroes]
                    .sort((a, b) => a.position - b.position)
                    .slice(0, 3)
                    .map((h) => {
                      const hero = heroOf.get(h.hero_id);
                      return hero ? <HeroMark key={h.hero_id} name={hero.name} role={h.role} size="md" src={hero.portrait_url} /> : null;
                    })}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    <span className={last.result === "win" ? "text-good" : "text-bad"}>{last.result === "win" ? "Victoire" : "Défaite"}</span>
                    {last.map ? <span className="text-fg"> sur {mapShortName(last.map.name)}</span> : null}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {ago(last.played_at)}
                    {last.queue ? `, ${last.queue.name.toLowerCase()}` : ""}
                    {last.award ? `, ${last.award}` : ""}
                  </p>
                </div>
                {(() => {
                  const sum = (k: "kills" | "deaths" | "assists") => (last.match_heroes.some((h) => h[k] !== null) ? last.match_heroes.reduce((s, h) => s + (h[k] ?? 0), 0) : null);
                  const [k, d, a] = [sum("kills"), sum("deaths"), sum("assists")];
                  return k === null ? null : (
                    <p className="font-display text-2xl font-bold tabular" aria-label={`${k} éliminations, ${d ?? 0} morts, ${a ?? 0} assists`}>
                      {k}
                      <span className="text-muted"> / </span>
                      {d ?? "–"}
                      <span className="text-muted"> / </span>
                      {a ?? "–"}
                    </p>
                  );
                })()}
              </Link>
              <p className="text-sm text-muted">Ouvre-la pour la review : compos, counters et swaps possibles.</p>
            </section>
          ) : null}

          {note ? (
            <figure className="rounded-xl border-l-2 border-accent bg-surface p-4">
              <blockquote className="max-w-[62ch] whitespace-pre-line text-sm text-fg">{note.body.length > 320 ? `${note.body.slice(0, 320).trimEnd()}…` : note.body}</blockquote>
              <figcaption className="mt-2 text-xs text-muted">
                Note de {note.coach?.pseudo || "ton coach"}, {ago(note.created_at)}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </div>

      {/* Tes héros */}
      <section className="flex flex-col gap-4" aria-labelledby="heroes">
        <SectionTitle
          action={
            <Link href="/guides" className={moreLink}>
              Tous les guides <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          }
        >
          <span id="heroes">Tes héros</span>
        </SectionTitle>
        {myHeroes.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {myHeroes.map(({ hero, kind, games, wins }) => {
              const role = hero.roles[0];
              return (
                <li key={hero.id}>
                  <Link href={`/heros/${hero.slug}`} className="lift flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-3">
                    <div className="flex items-start justify-between gap-2">
                      <HeroMark name={hero.name} role={role} size="lg" src={hero.portrait_url} />
                      {kind ? <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-semibold", kind === "main" ? "bg-accent/15 text-accent" : "bg-surface-3 text-fg-2")}>{kind === "main" ? "Main" : "À entraîner"}</span> : null}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{hero.name}</p>
                      <p className={clsx("text-xs font-medium", ROLE_STYLES[role].text)}>{role}</p>
                    </div>
                    <p className="mt-auto text-xs text-muted tabular">
                      {games ? (
                        <>
                          <span className="font-display text-xl font-bold text-fg">{Math.round((wins / games) * 100)} %</span> sur {games} partie{games > 1 ? "s" : ""}
                        </>
                      ) : (
                        "Pas encore jouée"
                      )}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-fg-2">
            Choisis tes mains dans{" "}
            <Link href="/profil" className="font-semibold text-accent hover:underline">
              ton profil
            </Link>{" "}
            pour retrouver ici leurs fiches et tes résultats avec chacun.
          </p>
        )}
      </section>

      <div className="grid gap-x-8 gap-y-8 lg:grid-cols-5">
        {/* Saison en cours */}
        <section className="flex min-w-0 flex-col gap-4 lg:col-span-3" aria-labelledby="season">
          <SectionTitle>
            <span id="season">{season ? `${season} : ce qui change pour toi` : "Ce qui change pour toi"}</span>
          </SectionTitle>
          {freshHeroes.map((h) => (
            <Link key={h.id} href={`/heros/${h.slug}`} className="lift flex items-center gap-3 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3">
              <HeroMark name={h.name} role={h.roles[0]} size="md" src={h.portrait_url} />
              <p className="min-w-0 flex-1 text-sm">
                <span className="font-semibold">Nouveau héros : {h.name}.</span> <span className="text-fg-2">{h.roles[0]}, sa fiche est en ligne.</span>
              </p>
              <ArrowUpRight className="size-4 shrink-0 text-accent" aria-hidden />
            </Link>
          ))}
          {patch.length ? (
            <ul className="flex flex-col">
              {patch.map(({ hero, changes }) => (
                <li key={hero.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 border-t border-line py-3 first:border-t-0 first:pt-0">
                  <HeroMark name={hero.name} role={hero.roles[0]} size="md" src={hero.portrait_url} />
                  <div className="min-w-0">
                    <Link href={`/heros/${hero.slug}`} className="text-sm font-semibold hover:text-accent">
                      {hero.name}
                    </Link>
                    <ul className="mt-1 flex flex-col gap-1 text-sm text-fg-2">
                      {changes.slice(0, 2).map((c) => (
                        <li key={c.text}>{c.text}</li>
                      ))}
                    </ul>
                    {changes.length > 2 ? <p className="mt-1 text-xs text-muted">Et {changes.length - 2} autre{changes.length - 2 > 1 ? "s" : ""} dans sa fiche.</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-fg-2">{myHeroes.length ? "Aucun de tes héros n'a été modifié cette saison." : "Les changements d'équilibrage de tes héros s'afficheront ici dès que tu auras choisi tes mains ou saisi une partie."}</p>
          )}
        </section>

        {/* Le Prof, le quiz, les guides */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <SectionTitle>Entre deux parties</SectionTitle>
          <div className="flex items-start gap-3 rounded-xl bg-surface p-4">
            <Mascot className="size-14" bob />
            <div className="min-w-0 text-sm">
              <p className="font-semibold">Le conseil du Prof</p>
              <div className="mt-1 text-fg-2">
                <Rich text={tipOfTheDay()} />
              </div>
            </div>
          </div>
          <Link href="/quiz" className="lift flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
            <GraduationCap className="size-6 shrink-0 text-accent" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Quiz</span>
              <span className="block text-xs text-muted">Dix questions sur les héros, leurs counters et les cartes.</span>
            </span>
          </Link>
          <Link href="/guides" className="lift flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
            <BookOpen className="size-6 shrink-0 text-accent" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Guides</span>
              <span className="block text-xs text-muted">Les {heroes.length} héros, les trois rôles, les cartes et les compos.</span>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
