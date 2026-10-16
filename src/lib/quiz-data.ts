import "server-only";
import type { createClient } from "@/lib/supabase/server";
import { parseContent } from "@/lib/guides";
import type { QuizSource } from "@/lib/quiz";
import type { Hero } from "@/lib/types";

type Client = Awaited<ReturnType<typeof createClient>>;

/** Héros qui ont un guide publié, avec son contenu (base des questions). */
export async function getQuizSources(supabase: Client, heroes: Hero[]): Promise<QuizSource[]> {
  const { data } = await supabase.from("guides").select("hero_id, content").eq("kind", "hero").eq("status", "published");
  const byId = new Map(heroes.map((h) => [h.id, h]));
  return ((data ?? []) as { hero_id: number; content: unknown }[]).flatMap((g) => {
    const hero = byId.get(g.hero_id);
    return hero ? [{ hero, guide: parseContent(g.content) }] : [];
  });
}

export type BestScore = { score: number; total: number; at: string };

/** Meilleur score de l'utilisateur par héros (slug), plus le meilleur score « mes héros ». Null si la table n'existe pas. */
export async function getBestScores(supabase: Client, userId: string, heroes: Hero[]): Promise<Map<string, BestScore> | null> {
  const { data, error } = await supabase.from("quiz_attempts").select("hero_id, mode, score, total, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(500);
  if (error) return null;
  const slugOf = new Map(heroes.map((h) => [h.id, h.slug]));
  const best = new Map<string, BestScore>();
  for (const r of (data ?? []) as { hero_id: number | null; mode: string; score: number; total: number; created_at: string }[]) {
    const key = r.hero_id ? slugOf.get(r.hero_id) : r.mode;
    if (!key) continue;
    const cur = best.get(key);
    if (!cur || r.score / r.total > cur.score / cur.total) best.set(key, { score: r.score, total: r.total, at: r.created_at });
  }
  return best;
}
