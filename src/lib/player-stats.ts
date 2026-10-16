import type { Role } from "@/lib/types";

/** Une partie avec tout ce qu'il faut pour les stats perso. */
export type FullMatch = {
  id: string;
  played_at: string;
  result: "win" | "loss";
  duration_min: number | null;
  map_id: number | null;
  rank_id: number | null;
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
  }[];
  match_tags: { tag_id: number }[];
};

export const FULL_MATCH_SELECT =
  "id, played_at, result, duration_min, map_id, rank_id, match_heroes(hero_id, role, play_minutes, kills, deaths, assists, damage, damage_blocked, healing), match_tags(tag_id)";

type Line = FullMatch["match_heroes"][number];
const STAT_KEYS = ["kills", "deaths", "assists", "damage", "damage_blocked", "healing"] as const;
const hasStats = (h: Line) => STAT_KEYS.some((k) => h[k] !== null);

export type HeroLine = {
  hero_id: number;
  role: Role;
  games: number;
  wins: number;
  /** Parties où des stats ont été saisies pour ce héros. */
  statGames: number;
  kda: number | null;
  deaths10: number | null;
  damage10: number | null;
  healing10: number | null;
  blocked10: number | null;
};

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
const per10 = (v: number | null, min: number | null) => (v === null || !min ? null : (v / min) * 10);

/**
 * Stats par héros (et rôle). Chaque héros joué compte la partie dans son winrate.
 * Quand un swap a été saisi en « total de la partie » (stats sur une seule ligne), ces stats sont
 * ramenées à la durée de la partie et non aux minutes du héros, pour ne pas gonfler les « par 10 min ».
 */
export function statsByHero(matches: FullMatch[]): HeroLine[] {
  const acc = new Map<string, { hero_id: number; role: Role; games: number; wins: number; kda: number[]; d10: number[]; dmg10: number[]; heal10: number[]; blk10: number[]; statGames: number }>();
  for (const m of matches) {
    const withStats = m.match_heroes.filter(hasStats);
    const totalsOnOne = m.match_heroes.length > 1 && withStats.length === 1;
    for (const h of m.match_heroes) {
      const k = `${h.hero_id}|${h.role}`;
      const a = acc.get(k) ?? { hero_id: h.hero_id, role: h.role, games: 0, wins: 0, kda: [], d10: [], dmg10: [], heal10: [], blk10: [], statGames: 0 };
      a.games++;
      if (m.result === "win") a.wins++;
      if (hasStats(h)) {
        a.statGames++;
        const minutes = totalsOnOne || m.match_heroes.length === 1 ? (m.duration_min === null ? null : Number(m.duration_min)) : h.play_minutes === null ? null : Number(h.play_minutes);
        if (h.kills !== null && h.deaths !== null) a.kda.push((h.kills + (h.assists ?? 0)) / Math.max(h.deaths, 1));
        const push = (arr: number[], v: number | null) => v !== null && arr.push(v);
        push(a.d10, per10(h.deaths, minutes));
        push(a.dmg10, per10(h.damage, minutes));
        push(a.heal10, per10(h.healing, minutes));
        push(a.blk10, per10(h.damage_blocked, minutes));
      }
      acc.set(k, a);
    }
  }
  return [...acc.values()]
    .map((a) => ({
      hero_id: a.hero_id,
      role: a.role,
      games: a.games,
      wins: a.wins,
      statGames: a.statGames,
      kda: avg(a.kda),
      deaths10: avg(a.d10),
      damage10: avg(a.dmg10),
      healing10: avg(a.heal10),
      blocked10: avg(a.blk10),
    }))
    .sort((x, y) => y.games - x.games || y.wins - x.wins);
}

export type Tally = { id: number; games: number; wins: number };

function tally(entries: [number, boolean][]): Tally[] {
  const m = new Map<number, Tally>();
  for (const [id, win] of entries) {
    const t = m.get(id) ?? { id, games: 0, wins: 0 };
    t.games++;
    if (win) t.wins++;
    m.set(id, t);
  }
  return [...m.values()].sort((a, b) => b.games - a.games);
}

export const statsByMap = (matches: FullMatch[]) => tally(matches.filter((m) => m.map_id !== null).map((m) => [m.map_id as number, m.result === "win"]));

/** Winrate selon les héros présents dans la compo adverse. */
export function statsVsEnemies(matches: FullMatch[], enemies: Map<string, number[]>) {
  return tally(matches.flatMap((m) => (enemies.get(m.id) ?? []).map((hid) => [hid, m.result === "win"] as [number, boolean])));
}

export const statsByTag = (matches: FullMatch[]) => tally(matches.flatMap((m) => m.match_tags.map((t) => [t.tag_id, m.result === "win"] as [number, boolean])));

export const winrate = (t: { games: number; wins: number }) => (t.games ? (t.wins / t.games) * 100 : null);
