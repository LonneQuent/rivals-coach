import "server-only";
import type { createClient } from "@/lib/supabase/server";
import type { MatchInput, Role } from "@/lib/types";

/** Colonnes nécessaires pour relire une partie au format du formulaire. */
export const MATCH_INPUT_COLS =
  "id, played_at, queue_id, game_mode_id, map_id, rank_id, result, duration_min, feeling, award, note, match_heroes(position, hero_id, role, play_minutes, kills, deaths, assists, final_hits, damage, damage_blocked, healing, accuracy), match_tags(tag_id)";

type Row = Omit<MatchInput, "tag_ids" | "heroes" | "award" | "note"> & {
  id: string;
  award: "MVP" | "SVP" | null;
  note: string | null;
  match_heroes: (MatchInput["heroes"][number] & { position: number })[];
  match_tags: { tag_id: number }[];
};

export function toMatchInput(raw: unknown): MatchInput {
  const r = raw as Row;
  return {
    id: r.id,
    played_at: r.played_at,
    queue_id: r.queue_id,
    game_mode_id: r.game_mode_id,
    map_id: r.map_id,
    rank_id: r.rank_id,
    result: r.result,
    duration_min: r.duration_min === null ? null : Number(r.duration_min),
    feeling: r.feeling,
    award: r.award ?? "",
    note: r.note ?? "",
    tag_ids: r.match_tags.map((t) => t.tag_id),
    heroes: [...r.match_heroes]
      .sort((a, b) => a.position - b.position)
      .map(({ position: _p, ...h }) => ({
        ...h,
        play_minutes: h.play_minutes === null ? null : Number(h.play_minutes),
        accuracy: h.accuracy === null ? null : Number(h.accuracy),
      })),
  };
}

export type RecentPick = { hero_id: number; role: Role; count: number };

/** Dernière partie (pour pré-remplir le contexte) et héros joués récemment, du plus récent au plus ancien. */
export async function getEntryContext(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<{ last: MatchInput | null; recent: RecentPick[] }> {
  const [lastRes, histRes] = await Promise.all([
    supabase.from("matches").select(MATCH_INPUT_COLS).eq("user_id", userId).order("played_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("matches").select("played_at, match_heroes(hero_id, role, position)").eq("user_id", userId).order("played_at", { ascending: false }).limit(40),
  ]);
  const recent = new Map<string, RecentPick>();
  for (const m of (histRes.data ?? []) as { match_heroes: { hero_id: number; role: Role; position: number }[] }[]) {
    for (const h of [...m.match_heroes].sort((a, b) => a.position - b.position)) {
      const k = `${h.hero_id}|${h.role}`;
      const cur = recent.get(k);
      if (cur) cur.count++;
      else recent.set(k, { hero_id: h.hero_id, role: h.role, count: 1 });
    }
  }
  // Ordre d'apparition = le plus récent d'abord ; on garde ensuite les plus joués
  const list = [...recent.values()];
  const top = [...list].sort((a, b) => b.count - a.count).slice(0, 8);
  return {
    last: lastRes.data ? toMatchInput(lastRes.data) : null,
    recent: list.filter((p) => top.includes(p)),
  };
}
