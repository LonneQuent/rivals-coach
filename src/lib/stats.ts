import type { Role } from "@/lib/types";

/** Ligne brute renvoyée par Supabase pour une partie et ses héros. */
export type MatchRow = {
  id: string;
  played_at: string;
  result: "win" | "loss";
  duration_min: number | null;
  feeling: number | null;
  match_heroes: {
    hero_id: number;
    role: Role;
    play_minutes: number | null;
    kills: number | null;
    deaths: number | null;
    assists: number | null;
    damage: number | null;
    damage_blocked: number | null;
    healing: number | null;
    accuracy: number | null;
  }[];
  match_tags?: { tag_id: number }[];
};

export const MATCH_STATS_SELECT =
  "id, played_at, result, duration_min, feeling, match_heroes(hero_id, role, play_minutes, kills, deaths, assists, damage, damage_blocked, healing, accuracy), match_tags(tag_id)";

/** Une partie résumée (stats additionnées sur les héros retenus). */
export type MatchAgg = {
  id: string;
  playedAt: number;
  win: boolean;
  minutes: number | null;
  feeling: number | null;
  heroIds: number[];
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  damage: number | null;
  healing: number | null;
  blocked: number | null;
  accuracy: number | null;
};

const sumOrNull = (vals: (number | null)[]) => (vals.some((v) => v !== null) ? vals.reduce<number>((s, v) => s + Number(v ?? 0), 0) : null);
const avgOrNull = (vals: (number | null | undefined)[]) => {
  const a = vals.filter((v): v is number => v !== null && v !== undefined && Number.isFinite(Number(v))).map(Number);
  return a.length ? a.reduce((s, v) => s + v, 0) / a.length : null;
};

/**
 * Résume chaque partie. Avec `role`, ne garde que les héros joués dans ce rôle
 * (et la durée correspondante si les minutes par héros sont renseignées).
 */
export function aggregate(rows: MatchRow[], role?: Role | null): MatchAgg[] {
  return rows
    .map((m) => {
      const heroes = role ? m.match_heroes.filter((h) => h.role === role) : m.match_heroes;
      if (!heroes.length) return null;
      const partialMinutes = role && heroes.length < m.match_heroes.length ? sumOrNull(heroes.map((h) => h.play_minutes)) : null;
      return {
        id: m.id,
        playedAt: Date.parse(m.played_at),
        win: m.result === "win",
        minutes: partialMinutes ?? (m.duration_min === null ? null : Number(m.duration_min)),
        feeling: m.feeling,
        heroIds: heroes.map((h) => h.hero_id),
        kills: sumOrNull(heroes.map((h) => h.kills)),
        deaths: sumOrNull(heroes.map((h) => h.deaths)),
        assists: sumOrNull(heroes.map((h) => h.assists)),
        damage: sumOrNull(heroes.map((h) => h.damage)),
        healing: sumOrNull(heroes.map((h) => h.healing)),
        blocked: sumOrNull(heroes.map((h) => h.damage_blocked)),
        accuracy: avgOrNull(heroes.map((h) => h.accuracy)),
      } satisfies MatchAgg;
    })
    .filter((x): x is MatchAgg => x !== null)
    .sort((a, b) => a.playedAt - b.playedAt);
}

const per10 = (v: number | null, min: number | null) => (v === null || !min ? null : (v / min) * 10);

export const METRICS = {
  winrate: { label: "Winrate", better: "up", unit: "%", digits: 0 },
  kda: { label: "KDA", better: "up", unit: "", digits: 2 },
  deaths: { label: "Morts par partie", better: "down", unit: "", digits: 1 },
  kills: { label: "Éliminations par partie", better: "up", unit: "", digits: 1 },
  deaths10: { label: "Morts / 10 min", better: "down", unit: "", digits: 1 },
  damage10: { label: "Dégâts / 10 min", better: "up", unit: "", digits: 0 },
  healing10: { label: "Soins / 10 min", better: "up", unit: "", digits: 0 },
  blocked10: { label: "Dégâts bloqués / 10 min", better: "up", unit: "", digits: 0 },
  accuracy: { label: "Précision", better: "up", unit: "%", digits: 0 },
} as const;
export type MetricKey = keyof typeof METRICS;

export function metricValue(key: MetricKey, list: MatchAgg[]): number | null {
  if (!list.length) return null;
  switch (key) {
    case "winrate":
      return (list.filter((m) => m.win).length / list.length) * 100;
    case "kda":
      return avgOrNull(list.map((m) => (m.kills === null || m.deaths === null ? null : (m.kills + (m.assists ?? 0)) / Math.max(m.deaths, 1))));
    case "deaths":
      return avgOrNull(list.map((m) => m.deaths));
    case "kills":
      return avgOrNull(list.map((m) => m.kills));
    case "deaths10":
      return avgOrNull(list.map((m) => per10(m.deaths, m.minutes)));
    case "damage10":
      return avgOrNull(list.map((m) => per10(m.damage, m.minutes)));
    case "healing10":
      return avgOrNull(list.map((m) => per10(m.healing, m.minutes)));
    case "blocked10":
      return avgOrNull(list.map((m) => per10(m.blocked, m.minutes)));
    case "accuracy":
      return avgOrNull(list.map((m) => m.accuracy));
  }
}

export function formatMetric(key: MetricKey, v: number | null) {
  if (v === null) return "–";
  const m = METRICS[key];
  return `${v.toLocaleString("fr-FR", { maximumFractionDigits: m.digits, minimumFractionDigits: m.digits })}${m.unit === "%" ? " %" : ""}`;
}

export const GOAL_WINDOW = 10;

export type Goal = { id: string; metric: MetricKey; op: "<=" | ">="; target: number; role: Role | null; created_by: string; user_id: string };

/** Objectif évalué sur les 10 dernières parties concernées (le rôle filtre les héros pris en compte). */
export function evalGoal(goal: Goal, rows: MatchRow[]) {
  const list = aggregate(rows, goal.role).slice(-GOAL_WINDOW);
  const value = metricValue(goal.metric, list);
  const met = value !== null && (goal.op === ">=" ? value >= goal.target : value <= goal.target);
  return { value, met, games: list.length };
}

export function goalLabel(g: Pick<Goal, "metric" | "op" | "target" | "role">) {
  const m = METRICS[g.metric];
  return `${m.label} ${g.op === ">=" ? "≥" : "≤"} ${Number(g.target).toLocaleString("fr-FR", { maximumFractionDigits: m.digits })}${m.unit === "%" ? " %" : ""}${g.role ? ` en ${g.role}` : ""}`;
}
