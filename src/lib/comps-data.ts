import "server-only";
import type { createClient } from "@/lib/supabase/server";
import { parseComp, type CompStatus, type TeamComp } from "@/lib/comps";

type Client = Awaited<ReturnType<typeof createClient>>;

/**
 * Compos visibles par l'utilisateur (les brouillons ne remontent que pour les admins, via RLS).
 * Renvoie null si la table n'existe pas encore (migration 0011 pas exécutée).
 */
export async function getComps(supabase: Client): Promise<TeamComp[] | null> {
  const { data, error } = await supabase.from("team_comps").select("id, slug, status, sort, content").order("sort").order("slug");
  if (error) return null;
  return (data as { id: number; slug: string; status: CompStatus; sort: number; content: unknown }[]).flatMap((r) => {
    const content = parseComp(r.content);
    return content ? [{ ...r, content }] : [];
  });
}

/** Nombre de parties de l'utilisateur par héros (slug → nombre). */
export async function getPlayedHeroes(supabase: Client, userId: string, heroSlugById: Map<number, string>): Promise<Map<string, number>> {
  const { data } = await supabase.from("match_heroes").select("hero_id, matches!inner(user_id)").eq("matches.user_id", userId);
  const played = new Map<string, number>();
  for (const r of (data ?? []) as { hero_id: number }[]) {
    const slug = heroSlugById.get(r.hero_id);
    if (slug) played.set(slug, (played.get(slug) ?? 0) + 1);
  }
  return played;
}
