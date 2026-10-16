import type { Metadata } from "next";
import Link from "next/link";
import { Dices, Map as MapIcon, Star } from "lucide-react";
import { getRefs, requireSession } from "@/lib/data";
import { getPlayedHeroes } from "@/lib/comps-data";
import { getBestScores, getQuizSources } from "@/lib/quiz-data";
import { ROLES } from "@/lib/types";
import { EmptyState, HeroMark, PageHeader, RoleDot } from "@/components/ui";
import { MascotTip } from "@/components/mascot";

export const metadata: Metadata = { title: "Quiz des héros" };

export default async function QuizHome() {
  const { supabase, user } = await requireSession();
  const { heroes } = await getRefs();
  const [sources, best, played] = await Promise.all([
    getQuizSources(supabase, heroes),
    getBestScores(supabase, user.id, heroes),
    getPlayedHeroes(supabase, user.id, new Map(heroes.map((h) => [h.id, h.slug]))),
  ]);
  if (!sources.length) return <EmptyState title="Pas encore de quiz" body="Les quiz se construisent à partir des guides publiés : il en faut au moins un." />;

  const withGuide = new Set(sources.map((s) => s.hero.slug));
  const mine = [...played.entries()].filter(([slug]) => withGuide.has(slug)).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const fmt = (key: string) => {
    const b = best?.get(key);
    return b ? `${b.score}/${b.total}` : null;
  };

  return (
    <>
      <PageHeader title="Quiz des héros" subtitle="Mises en situation, kit, team-ups, équilibrage, cartes : vérifie que tu connais vraiment tes persos." />
      <MascotTip title="Le Prof interroge" pose="think" className="max-w-3xl">
        <p>
          10 questions par quiz, avec une explication après chaque réponse et le corrigé complet à la fin. Tu peux rejouer uniquement tes erreurs, et ton meilleur score est gardé : vise le sans-faute sur tes mains avant de les jouer en ranked.
        </p>
      </MascotTip>
      {best === null ? <p className="rounded-lg bg-surface-3 px-3 py-2 text-sm text-fg-2">Les scores ne sont pas encore enregistrés : un admin doit exécuter la migration 0012.</p> : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link href={mine.length ? "/quiz/mes-heros" : "/quiz/melange"} className="card lift flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent" aria-hidden>
            <Star className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold uppercase tracking-wide">Mes héros</p>
            <p className="text-sm text-fg-2">{mine.length ? `Tes ${mine.length} héros les plus joués : ${mine.map(([s]) => heroes.find((h) => h.slug === s)?.name).join(", ")}.` : "Saisis quelques parties pour débloquer ce quiz. En attendant : le mélange."}</p>
          </div>
          {fmt("mine") ? <span className="font-display text-lg font-bold text-accent tabular">{fmt("mine")}</span> : null}
        </Link>
        <Link href="/quiz/melange" className="card lift flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface-3 text-fg" aria-hidden>
            <Dices className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold uppercase tracking-wide">Mélange</p>
            <p className="text-sm text-fg-2">10 questions sur tout le roster : parfait pour connaître les héros d&apos;en face.</p>
          </div>
          {fmt("mix") ? <span className="font-display text-lg font-bold text-accent tabular">{fmt("mix")}</span> : null}
        </Link>
        <Link href="/quiz/cartes" className="card lift flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface-3 text-fg" aria-hidden>
            <MapIcon className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold uppercase tracking-wide">Cartes et game sense</p>
            <p className="text-sm text-fg-2">Placements, chokes, cycle d&apos;ults : le savoir qui ne dépend pas du héros.</p>
          </div>
          {fmt("maps") ? <span className="font-display text-lg font-bold text-accent tabular">{fmt("maps")}</span> : null}
        </Link>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {ROLES.map((role) => (
          <section key={role} className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-lg uppercase tracking-wide">
              <RoleDot role={role} /> {role}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {sources
                .filter((s) => s.hero.roles[0] === role)
                .sort((a, b) => a.hero.name.localeCompare(b.hero.name, "fr"))
                .map(({ hero }) => {
                  const b = best?.get(hero.slug);
                  const perfect = b && b.score === b.total;
                  return (
                    <li key={hero.slug}>
                      <Link href={`/quiz/${hero.slug}`} className="lift flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2">
                        <HeroMark name={hero.name} role={role} size="sm" src={hero.portrait_url} />
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{hero.name}</span>
                        {b ? (
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular ${perfect ? "bg-good-bg text-good" : "bg-surface-3 text-fg-2"}`}>
                            {b.score}/{b.total}
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted">Jamais tenté</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
