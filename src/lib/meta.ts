import type { Rank, Role } from "@/lib/types";

/**
 * Tranches de rang des stats communautaires. Les tranches « et plus » cumulent le rang et tous ceux au-dessus :
 * elles donnent des échantillons plus gros quand le rang exact a peu de parties.
 */
export const BRACKETS = [
  { key: "bronze", label: "Bronze", tiers: [0, 2] },
  { key: "silver", label: "Argent", tiers: [3, 5] },
  { key: "gold", label: "Or", tiers: [6, 8] },
  { key: "platinum", label: "Platine", tiers: [9, 11] },
  { key: "diamond", label: "Diamant", tiers: [12, 14] },
  { key: "diamond_plus", label: "Diamant et plus", tiers: null },
  { key: "grandmaster", label: "Grand Maître", tiers: [15, 17] },
  { key: "grandmaster_plus", label: "Grand Maître et plus", tiers: null },
  { key: "celestial", label: "Céleste", tiers: [18, 20] },
  { key: "celestial_plus", label: "Céleste et plus", tiers: null },
  { key: "eternity", label: "Éternité", tiers: [21, 21] },
  { key: "eternity_plus", label: "Éternité et plus", tiers: null },
  { key: "one_above_all", label: "One Above All", tiers: [22, 22] },
] as const;
export type BracketKey = (typeof BRACKETS)[number]["key"];

export const bracketLabel = (k: string) => BRACKETS.find((b) => b.key === k)?.label ?? k;
export const isBracket = (k: string | undefined): k is BracketKey => !!k && BRACKETS.some((b) => b.key === k);

/** Tranche correspondant à un rang de la table ranks (via son ordre). */
export function bracketForRank(rank: Pick<Rank, "tier_order"> | null | undefined): BracketKey | null {
  if (!rank) return null;
  const b = BRACKETS.find((x) => x.tiers && rank.tier_order >= x.tiers[0] && rank.tier_order <= x.tiers[1]);
  return b?.key ?? null;
}

/** En dessous, un winrate communautaire bouge trop d'une semaine à l'autre pour comparer. */
export const MIN_META_MATCHES = 200;

export type MetaRow = {
  hero_id: number;
  /** Rôle pour les héros multi-rôles (Deadpool), sinon null. */
  variant: Role | null;
  tier: string;
  win_rate: number;
  pick_rate: number;
  ban_rate: number | null;
  matches: number;
};

export type MetaSnapshot = { season: string; captured_on: string; source: string; rows: MetaRow[] };

type Supa = { from: (t: string) => any };

/**
 * Stats communautaires d'une tranche (dernière saison saisie).
 * null si la table n'existe pas encore (migration 0014 pas passée) ou si la tranche est vide.
 */
export async function getMeta(supabase: Supa, bracket: BracketKey): Promise<MetaSnapshot | null> {
  const { data: last, error } = await supabase.from("hero_meta_stats").select("season, captured_on, source").order("captured_on", { ascending: false }).limit(1);
  if (error || !last?.length) return null;
  const { season, captured_on, source } = last[0] as { season: string; captured_on: string; source: string };
  const { data } = await supabase
    .from("hero_meta_stats")
    .select("hero_id, variant, tier, win_rate, pick_rate, ban_rate, matches")
    .eq("season", season)
    .eq("bracket", bracket);
  const rows = ((data ?? []) as MetaRow[]).map((r) => ({ ...r, win_rate: Number(r.win_rate), pick_rate: Number(r.pick_rate), ban_rate: r.ban_rate === null ? null : Number(r.ban_rate) }));
  return rows.length ? { season, captured_on, source, rows } : null;
}

/** Ligne de méta d'un héros joué dans un rôle donné (Deadpool a une ligne par rôle). */
export function metaFor(rows: MetaRow[], heroId: number, role: Role): MetaRow | undefined {
  return rows.find((r) => r.hero_id === heroId && r.variant === role) ?? rows.find((r) => r.hero_id === heroId && r.variant === null);
}

export const pct = (v: number | null | undefined, d = 1) => (v === null || v === undefined ? "–" : `${v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d })} %`);

/** Tranche du joueur : rang du profil, sinon rang de sa dernière partie classée. */
export async function myBracket(supabase: Supa, userId: string, profileRankId: number | null | undefined, ranks: Rank[]): Promise<BracketKey | null> {
  let rankId = profileRankId ?? null;
  if (!rankId) {
    const { data } = await supabase.from("matches").select("rank_id").eq("user_id", userId).not("rank_id", "is", null).order("played_at", { ascending: false }).limit(1);
    rankId = (data?.[0] as { rank_id: number } | undefined)?.rank_id ?? null;
  }
  return bracketForRank(ranks.find((r) => r.id === rankId));
}
