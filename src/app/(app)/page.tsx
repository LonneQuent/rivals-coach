import { getRefs, requireSession } from "@/lib/data";
import { MATCH_STATS_SELECT, type Goal, type MatchRow } from "@/lib/stats";
import { HomeView, type GuideNews, type HomeData, type LastMatch } from "@/components/home-view";

const NEW_HERO_DAYS = 45;

export default async function HomePage() {
  const { supabase, user, profile } = await requireSession();
  const [refs, matchesRes, lastRes, goalsRes, picksRes, focusRes, noteRes, guidesRes, newRes] = await Promise.all([
    getRefs(),
    supabase.from("matches").select(MATCH_STATS_SELECT).eq("user_id", user.id).order("played_at", { ascending: false }).limit(60),
    supabase
      .from("matches")
      .select("id, played_at, result, award, duration_min, map:maps(name), queue:queues(name), match_heroes(hero_id, position, role, kills, deaths, assists)")
      .eq("user_id", user.id)
      .order("played_at", { ascending: false })
      .limit(1),
    supabase.from("goals").select("id, metric, op, target, role, created_by, user_id").eq("user_id", user.id).eq("active", true).order("created_at"),
    supabase.from("player_heroes").select("hero_id, kind").eq("user_id", user.id),
    supabase.rpc("get_focus_areas", { p_player: user.id }),
    supabase.from("coach_notes").select("id, body, created_at, coach:profiles!coach_notes_coach_id_fkey(pseudo)").eq("player_id", user.id).order("created_at", { ascending: false }).limit(1),
    supabase.from("guides").select("hero_id, season:content->kit->>season, changes:content->kit->changes").eq("kind", "hero").eq("status", "published"),
    supabase.from("heroes").select("id, created_at").gte("created_at", new Date(Date.now() - NEW_HERO_DAYS * 864e5).toISOString()),
  ]);

  return (
    <HomeView
      pseudo={profile?.pseudo ?? null}
      userId={user.id}
      heroes={refs.heroes}
      matches={((matchesRes.data ?? []) as unknown as MatchRow[]).slice().reverse()}
      last={((lastRes.data ?? []) as unknown as LastMatch[])[0] ?? null}
      goalRows={(goalsRes.data ?? []) as Goal[]}
      picks={(picksRes.data ?? []) as HomeData["picks"]}
      focus={(focusRes.data as string[] | null) ?? []}
      note={((noteRes.data ?? []) as unknown as NonNullable<HomeData["note"]>[])[0] ?? null}
      news={(guidesRes.data ?? []) as unknown as GuideNews[]}
      newHeroIds={((newRes.data ?? []) as { id: number }[]).map((h) => h.id)}
    />
  );
}
