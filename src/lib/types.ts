export const ROLES = ["Vanguard", "Duelist", "Strategist"] as const;
export type Role = (typeof ROLES)[number];

export interface Profile {
  id: string;
  pseudo: string | null;
  avatar_url: string | null;
  main_role: Role | null;
  is_admin: boolean;
  is_coach?: boolean;
  share_aggregates: boolean;
}

export interface Hero {
  id: number;
  slug: string;
  name: string;
  roles: Role[];
  active: boolean;
  portrait_url?: string | null;
}

export interface GameMode { id: number; name: string; active: boolean; sort: number }
export interface MapRef { id: number; name: string; game_mode_id: number | null; active: boolean }
export interface Queue { id: number; name: string; active: boolean; sort: number }
export interface Rank { id: number; name: string; tier_order: number; active: boolean }
export interface ErrorTag { id: number; name: string; active: boolean; sort: number }

export interface Refs {
  heroes: Hero[];
  gameModes: GameMode[];
  maps: MapRef[];
  queues: Queue[];
  ranks: Rank[];
  tags: ErrorTag[];
}

export interface MatchHeroInput {
  hero_id: number;
  role: Role;
  play_minutes: number | null;
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  final_hits: number | null;
  damage: number | null;
  damage_blocked: number | null;
  healing: number | null;
  accuracy: number | null;
}

export interface MatchInput {
  id?: string;
  played_at: string;
  queue_id: number | null;
  game_mode_id: number | null;
  map_id: number | null;
  rank_id: number | null;
  result: "win" | "loss";
  duration_min: number | null;
  feeling: number | null;
  award: "" | "MVP" | "SVP";
  note: string;
  tag_ids: number[];
  heroes: MatchHeroInput[];
}

export const STAT_FIELDS = [
  { key: "kills", label: "Éliminations" },
  { key: "deaths", label: "Morts" },
  { key: "assists", label: "Assists" },
  { key: "final_hits", label: "Final hits" },
  { key: "damage", label: "Dégâts" },
  { key: "damage_blocked", label: "Dégâts bloqués" },
  { key: "healing", label: "Soins" },
  { key: "accuracy", label: "Précision (%)" },
] as const;
export type StatKey = (typeof STAT_FIELDS)[number]["key"];
