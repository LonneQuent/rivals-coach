/**
 * « Sur quoi bosser cette semaine » : quelques constats tirés des dernières parties, classés par priorité.
 * Tout est calculé par règles ; chaque phrase cite les chiffres qui la justifient.
 */
import { aggregate, formatMetric, metricValue, type MatchAgg, type MatchRow, type MetricKey } from "@/lib/stats";
import type { Hero, Role } from "@/lib/types";

export const MIN_MATCHES_FOR_FOCUS = 5;

export type Insight = {
  key: string;
  tone: "warn" | "good" | "info";
  /** Ce qu'il faut retenir, en une phrase. */
  title: string;
  /** Les chiffres qui le justifient. */
  detail: string;
  link?: { href: string; label: string };
};

export type Form = { results: boolean[]; wins: number; losses: number; streak: { win: boolean; length: number } | null };

/** Forme récente : les dix dernières parties, de la plus ancienne à la plus récente. */
export function recentForm(rows: MatchRow[]): Form {
  const sorted = [...rows].sort((a, b) => Date.parse(a.played_at) - Date.parse(b.played_at)).slice(-10);
  const results = sorted.map((m) => m.result === "win");
  let streak: Form["streak"] = null;
  for (let i = results.length - 1; i >= 0; i--) {
    if (!streak) streak = { win: results[i], length: 1 };
    else if (results[i] === streak.win) streak.length++;
    else break;
  }
  return { results, wins: results.filter(Boolean).length, losses: results.filter((r) => !r).length, streak };
}

const ROLE_OUTPUT: Record<Role, { key: MetricKey; noun: string }> = {
  Vanguard: { key: "blocked10", noun: "tes dégâts bloqués par 10 min" },
  Duelist: { key: "damage10", noun: "tes dégâts par 10 min" },
  Strategist: { key: "healing10", noun: "tes soins par 10 min" },
};

const fr = (v: number, digits = 1) => v.toLocaleString("fr-FR", { maximumFractionDigits: digits });

export function buildInsights(rows: MatchRow[], heroes: Hero[]): Insight[] {
  const all = aggregate(rows);
  if (all.length < MIN_MATCHES_FOR_FOCUS) return [];
  const heroOf = new Map(heroes.map((h) => [h.id, h]));
  const out: (Insight & { rank: number })[] = [];
  const recent = all.slice(-30);

  // 1. Série de défaites : le premier réflexe est de couper
  const form = recentForm(rows);
  if (form.streak && !form.streak.win && form.streak.length >= 3) {
    out.push({
      rank: 0,
      key: "streak",
      tone: "warn",
      title: `${form.streak.length} défaites de suite : fais une pause avant la prochaine.`,
      detail: "Enchaîner après une série coûte plus de parties que le niveau de jeu. Reviens sur la review de la dernière avant de relancer.",
      link: { href: "/historique", label: "Revoir mes dernières parties" },
    });
  }

  // 2. Morts : cinq dernières parties contre les quinze précédentes
  const last5 = all.slice(-5);
  const before = all.slice(-20, -5);
  if (before.length >= 5) {
    const key: MetricKey = metricValue("deaths10", last5) !== null && metricValue("deaths10", before) !== null ? "deaths10" : "deaths";
    const now = metricValue(key, last5);
    const then = metricValue(key, before);
    const unit = key === "deaths10" ? "morts par 10 min" : "morts par partie";
    if (now !== null && then !== null && then > 0) {
      const delta = (now - then) / then;
      if (delta >= 0.15 && now - then >= 0.5) {
        out.push({
          rank: 1,
          key: "deaths-up",
          tone: "warn",
          title: "Tu meurs plus que d'habitude.",
          detail: `${fr(now)} ${unit} sur tes 5 dernières parties, contre ${fr(then)} sur les ${before.length} précédentes. Regarde où tu te tiens au moment de mourir.`,
          link: { href: "/guides/game-sense", label: "Relire le guide Game sense" },
        });
      } else if (delta <= -0.15 && then - now >= 0.5) {
        out.push({
          rank: 6,
          key: "deaths-down",
          tone: "good",
          title: "Tu meurs moins : continue comme ça.",
          detail: `${fr(now)} ${unit} sur tes 5 dernières parties, contre ${fr(then)} sur les ${before.length} précédentes.`,
        });
      }
    }
  }

  // 3. Écart entre héros (au moins quatre parties chacun sur les trente dernières)
  const byHero = new Map<number, { games: number; wins: number }>();
  for (const m of recent) {
    const id = m.heroIds[0];
    const t = byHero.get(id) ?? { games: 0, wins: 0 };
    t.games++;
    if (m.win) t.wins++;
    byHero.set(id, t);
  }
  const played = [...byHero.entries()].filter(([id, t]) => t.games >= 4 && heroOf.has(id)).map(([id, t]) => ({ hero: heroOf.get(id)!, ...t, wr: (t.wins / t.games) * 100 }));
  if (played.length >= 2) {
    const best = played.reduce((a, b) => (b.wr > a.wr ? b : a));
    const worst = played.reduce((a, b) => (b.wr < a.wr ? b : a));
    if (best.wr - worst.wr >= 25) {
      out.push({
        rank: 2,
        key: "hero-gap",
        tone: "info",
        title: `${worst.hero.name} te coûte des parties, ${best.hero.name} t'en rapporte.`,
        detail: `${Math.round(worst.wr)} % de victoires sur ${worst.games} parties avec ${worst.hero.name}, ${Math.round(best.wr)} % sur ${best.games} avec ${best.hero.name}.`,
        link: { href: `/heros/${worst.hero.slug}`, label: `Revoir la fiche de ${worst.hero.name}` },
      });
    }
  }

  // 4. Rôle principal : ce que tu produis dans tes défaites, comparé à tes victoires
  const roleCount = new Map<Role, number>();
  for (const m of rows.slice().sort((a, b) => Date.parse(b.played_at) - Date.parse(a.played_at)).slice(0, 30)) {
    const r = m.match_heroes[0]?.role;
    if (r) roleCount.set(r, (roleCount.get(r) ?? 0) + 1);
  }
  const mainRole = [...roleCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (mainRole) {
    const inRole: MatchAgg[] = aggregate(rows, mainRole).slice(-30);
    const wins = inRole.filter((m) => m.win);
    const losses = inRole.filter((m) => !m.win);
    const { key, noun } = ROLE_OUTPUT[mainRole];
    const w = metricValue(key, wins);
    const l = metricValue(key, losses);
    if (wins.length >= 3 && losses.length >= 3 && w !== null && l !== null && w > 0 && l / w <= 0.8) {
      out.push({
        rank: 3,
        key: "role-output",
        tone: "info",
        title: `En ${mainRole}, ${noun} chutent de ${Math.round((1 - l / w) * 100)} % dans tes défaites.`,
        detail: `${formatMetric(key, l)} quand tu perds, ${formatMetric(key, w)} quand tu gagnes. Dans les parties difficiles, cherche d'abord à rester en vie et utile.`,
        link: { href: "/stats", label: "Voir mes stats" },
      });
    }
  }

  // 5. Tendance de résultats : dix dernières contre les dix précédentes
  const lastTen = all.slice(-10);
  const prevTen = all.slice(-20, -10);
  if (prevTen.length === 10) {
    const a = metricValue("winrate", lastTen)!;
    const b = metricValue("winrate", prevTen)!;
    if (a - b >= 20) out.push({ rank: 7, key: "wr-up", tone: "good", title: "Tes résultats montent.", detail: `${Math.round(a)} % de victoires sur tes 10 dernières parties, contre ${Math.round(b)} % sur les 10 précédentes.` });
    else if (b - a >= 20) out.push({ rank: 4, key: "wr-down", tone: "warn", title: "Tes résultats baissent.", detail: `${Math.round(a)} % de victoires sur tes 10 dernières parties, contre ${Math.round(b)} % sur les 10 précédentes.`, link: { href: "/stats", label: "Voir mes stats" } });
  }

  return out
    .sort((x, y) => x.rank - y.rank)
    .slice(0, 3)
    .map(({ rank: _rank, ...rest }) => rest);
}
