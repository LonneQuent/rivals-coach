import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import type { ErrorTag, GameMode, Hero, MapRef, Profile, Queue, Rank, Refs } from "@/lib/types";

/** Session + profil de l'utilisateur courant. Redirige vers /login si personne n'est connecté. */
export const requireSession = cache(async () => {
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  const { data } = await supabase
    .from("profiles")
    .select("id, pseudo, avatar_url, main_role, is_admin, share_aggregates")
    .eq("id", user.id)
    .single();
  return { supabase, user, profile: (data as Profile | null) };
});

/** Référentiels. `all` inclut les entrées désactivées (pour l'admin). */
export async function getRefs(all = false): Promise<Refs> {
  const { supabase } = await requireSession();
  const only = <T,>(q: PromiseLike<{ data: T[] | null }>) => q.then((r) => r.data ?? []);
  const active = (q: any) => (all ? q : q.eq("active", true));
  const [heroes, gameModes, maps, queues, ranks, tags] = await Promise.all([
    // portrait_url arrive avec la migration 0005 : si elle n'est pas encore passée, on relit sans cette colonne
    active(supabase.from("heroes").select("id, slug, name, roles, active, portrait_url"))
      .order("name")
      .then(async (r: { data: Hero[] | null; error: unknown }) =>
        r.error ? ((await active(supabase.from("heroes").select("id, slug, name, roles, active")).order("name")).data ?? []) : (r.data ?? []),
      ) as Promise<Hero[]>,
    only<GameMode>(active(supabase.from("game_modes").select("id, name, active, sort")).order("sort")),
    only<MapRef>(active(supabase.from("maps").select("id, name, game_mode_id, active")).order("name")),
    only<Queue>(active(supabase.from("queues").select("id, name, active, sort")).order("sort")),
    only<Rank>(active(supabase.from("ranks").select("id, name, tier_order, active")).order("tier_order")),
    only<ErrorTag>(active(supabase.from("error_tags").select("id, name, active, sort")).order("sort")),
  ]);
  return { heroes, gameModes, maps, queues, ranks, tags };
}
