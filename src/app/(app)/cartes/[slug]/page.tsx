import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { parseContent } from "@/lib/guides";
import { mapShortName, mapSlug, mapZone } from "@/lib/maps";
import { GuideView } from "@/components/guide-view";
import { TopicBanner } from "@/components/topic-banner";
import { HeroMark, buttonClass } from "@/components/ui";
import { FULL_MATCH_SELECT, statsByHero, winrate, type FullMatch } from "@/lib/player-stats";

export const metadata: Metadata = { title: "Guide de carte" };

export default async function MapGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, profile, user } = await requireSession();
  const { heroes, maps, gameModes } = await getRefs();
  const map = maps.find((m) => mapSlug(m.name) === slug);
  if (!map) notFound();
  const { data } = await supabase.from("guides").select("content, status").eq("kind", "map").eq("map_id", map.id).maybeSingle();
  const guide = data as { content: unknown; status: "draft" | "published" } | null;
  const mode = gameModes.find((g) => g.id === map.game_mode_id)?.name;
  const { data: played } = await supabase.from("matches").select(FULL_MATCH_SELECT).eq("user_id", user.id).eq("map_id", map.id).order("played_at", { ascending: false }).limit(200);
  const matches = (played ?? []) as unknown as FullMatch[];
  const wins = matches.filter((m) => m.result === "win").length;
  const myHeroes = statsByHero(matches).slice(0, 4);
  const heroById = new Map(heroes.map((h) => [h.id, h]));

  return (
    <>
      <Link href="/cartes" className="text-sm text-muted hover:text-fg">
        ← Toutes les cartes
      </Link>
      <TopicBanner eyebrow={[mode, mapZone(map.name)].filter(Boolean).join(" · ")} title={mapShortName(map.name)}>
        {profile?.is_admin ? (
          <Link href={`/admin/guides/map/${slug}`} className={buttonClass("default")}>
            {guide ? "Modifier le guide" : "Créer le guide"}
          </Link>
        ) : null}
      </TopicBanner>
      <section className="card flex flex-col gap-3" aria-label="Tes parties sur cette carte">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg uppercase tracking-wide">Toi sur cette carte</h2>
          {matches.length ? (
            <p className="tabular text-sm text-fg-2">
              <strong className="font-display text-2xl text-fg">{Math.round((wins / matches.length) * 100)} %</strong> de victoires sur {matches.length} partie{matches.length > 1 ? "s" : ""}
            </p>
          ) : null}
        </div>
        {myHeroes.length ? (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {myHeroes.map((h) => {
              const hero = heroById.get(h.hero_id);
              if (!hero) return null;
              return (
                <li key={`${h.hero_id}|${h.role}`}>
                  <Link href={`/heros/${hero.slug}`} className="lift flex items-center gap-2.5 rounded-lg border border-line bg-surface-2 px-3 py-2">
                    <HeroMark name={hero.name} role={h.role} size="sm" src={hero.portrait_url} />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{hero.name}</span>
                    <span className="tabular text-xs text-fg-2">
                      {Math.round(winrate(h) ?? 0)} % · {h.games}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted">Pas encore de partie saisie ici. Renseigne la carte dans tes saisies : tu verras ton winrate et tes meilleurs héros sur chaque carte.</p>
        )}
      </section>

      {guide ? (
        <>
          {guide.status === "draft" ? <p className="rounded-lg bg-surface-3 px-3 py-2 text-sm text-fg-2">Brouillon : visible uniquement par les admins.</p> : null}
          <GuideView content={parseContent(guide.content)} heroes={heroes} role="Strategist" accent="var(--color-accent)" myRole={profile?.main_role} labels={{ matchups: "Héros adaptés à cette carte", synergies: "Ils brillent ici" }} />
        </>
      ) : (
        <div className="card text-sm text-fg-2">Le guide de cette carte arrive bientôt.</div>
      )}
    </>
  );
}
