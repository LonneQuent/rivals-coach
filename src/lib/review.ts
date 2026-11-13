/**
 * Review d'une partie : compo, counters, synergies, swaps possibles.
 * Tout est calculé par règles à partir des guides (rubriques « counters », « synergies », team-ups)
 * et de la feuille de match. Aucun texte n'est inventé : les explications viennent des guides.
 */
import { ROLES, type Role } from "@/lib/types";

export type ReviewHero = { id: number; slug: string; name: string; roles: Role[]; portrait_url?: string | null };
export type GuideLite = {
  counters: { hero: string; note: string }[];
  synergies: { hero: string; note: string }[];
  teamups: { name: string; partners: string[]; text: string }[];
};

type Stats = { kills: number | null; deaths: number | null; assists: number | null; final_hits: number | null; damage: number | null; damage_blocked: number | null; healing: number | null; accuracy: number | null };
export type RosterEntry = { side: "ally" | "enemy"; me: boolean; hero_id: number | null; /** Rôle lu sur la capture. */ role?: Role | null } & Stats;

export type ReviewInput = {
  /** Héros joués par le joueur, le principal en premier, avec le rôle tenu. */
  mine: { hero: ReviewHero; role: Role }[];
  /** Les cinq autres joueurs de son équipe (vide si la partie a été saisie à la main). */
  allies: ReviewHero[];
  enemies: ReviewHero[];
  guides: Map<string, GuideLite>;
  /** Héros que le joueur sait jouer : mains, héros à entraîner, héros déjà joués. */
  pool: ReviewHero[];
  roster: RosterEntry[];
};

export type Note = { tone: "good" | "warn" | "info"; text: string };
export type Matchup = { hero: ReviewHero; note: string };
export type Review = {
  comp: { ally: Record<Role, number> | null; enemy: Record<Role, number> | null; notes: Note[] };
  /** Adversaires qui contrent ton héros (d'après son guide). */
  threats: Matchup[];
  /** Adversaires que ton héros contre (d'après leur guide). */
  targets: Matchup[];
  synergies: Matchup[];
  teamups: { name: string; partner: ReviewHero; text: string }[];
  /** Alliés pris pour cible par la compo adverse. */
  pressured: { ally: ReviewHero; by: ReviewHero[] }[];
  swaps: { hero: ReviewHero; reasons: string[] }[];
  facts: string[];
};

const count = (heroes: { roles: Role[] }[]) => {
  const out = { Vanguard: 0, Duelist: 0, Strategist: 0 } as Record<Role, number>;
  for (const h of heroes) out[h.roles[0]]++;
  return out;
};

export const compLabel = (c: Record<Role, number>) => ROLES.map((r) => c[r]).join("-");

function compNotes(c: Record<Role, number>): Note[] {
  const notes: Note[] = [];
  const V = c.Vanguard, D = c.Duelist, S = c.Strategist;
  if (V === 2 && D === 2 && S === 2) notes.push({ tone: "good", text: "Compo équilibrée : deux Vanguards, deux Duelists, deux Strategists." });
  if (V === 0) notes.push({ tone: "warn", text: "Aucun Vanguard : personne ne tient la ligne de front, chaque fight se joue directement sur vos supports." });
  else if (V === 1) notes.push({ tone: "info", text: "Un seul Vanguard : il encaisse seul. S'il tombe, l'accès à votre backline est ouvert." });
  else if (V >= 3) notes.push({ tone: "info", text: `${V} Vanguards : beaucoup de présence, mais moins de dégâts pour finir les cibles.` });
  if (S === 0) notes.push({ tone: "warn", text: "Aucun Strategist : sans soins, les fights longs tournent contre vous." });
  else if (S === 1) notes.push({ tone: "warn", text: "Un seul Strategist : tous les soins reposent sur lui, c'est la cible prioritaire d'en face." });
  else if (S >= 3) notes.push({ tone: "info", text: `${S} Strategists : beaucoup de soins et d'ults défensives, moins de dégâts.` });
  if (D >= 4) notes.push({ tone: "warn", text: `${D} Duelists : peu de soins et de protection pour autant de héros fragiles.` });
  return notes;
}

const pct = (v: number) => `${Math.round(v * 100)} %`;

function facts(roster: RosterEntry[], role: Role | null): string[] {
  const allies = roster.filter((r) => r.side === "ally");
  const me = allies.find((r) => r.me);
  if (!me || allies.length < 4) return [];
  const out: string[] = [];
  const share = (key: "damage" | "healing" | "damage_blocked", label: string, floor: number) => {
    const mine = me[key];
    const total = allies.reduce((s, r) => s + (r[key] ?? 0), 0);
    if (mine === null || total <= 0 || mine / total < floor) return;
    const rank = allies.filter((r) => (r[key] ?? 0) > mine).length + 1;
    out.push(`${pct(mine / total)} ${label} de ton équipe (${rank === 1 ? "1er" : `${rank}e`} sur ${allies.length}).`);
  };
  if (role !== "Strategist") share("damage", "des dégâts", 0);
  if (role === "Strategist") share("healing", "des soins", 0);
  if (role === "Vanguard") share("damage_blocked", "des dégâts bloqués", 0);
  if (role === "Strategist") share("damage", "des dégâts", 0.2);
  const deaths = allies.map((r) => r.deaths).filter((v): v is number => v !== null);
  if (me.deaths !== null && deaths.length >= 4) {
    const avg = deaths.reduce((s, v) => s + v, 0) / deaths.length;
    const diff = me.deaths - avg;
    if (Math.abs(diff) >= 1.5) out.push(`${me.deaths} morts, pour ${avg.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} en moyenne dans ton équipe.`);
  }
  const enemyKills = roster.filter((r) => r.side === "enemy").reduce((s, r) => s + (r.final_hits ?? 0), 0);
  const allyKills = allies.reduce((s, r) => s + (r.final_hits ?? 0), 0);
  if (me.final_hits !== null && allyKills > 0 && enemyKills > 0) out.push(`Final hits : ${allyKills} pour ton équipe, ${enemyKills} pour l'équipe adverse (${me.final_hits} pour toi).`);
  return out;
}

export function buildReview(input: ReviewInput): Review | null {
  const main = input.mine[0];
  if (!main || (!input.enemies.length && !input.allies.length)) return null;
  const guideOf = (h: ReviewHero) => input.guides.get(h.slug);
  const bySlug = new Map([...input.enemies, ...input.allies, ...input.pool, ...input.mine.map((m) => m.hero)].map((h) => [h.slug, h]));
  const enemySlugs = new Set(input.enemies.map((h) => h.slug));
  const allySlugs = new Set(input.allies.map((h) => h.slug));

  // Qui contre qui : « counters » d'un guide = les héros qui posent problème à ce héros
  const threatsOf = (h: ReviewHero): Matchup[] =>
    (guideOf(h)?.counters ?? []).filter((c) => enemySlugs.has(c.hero)).map((c) => ({ hero: bySlug.get(c.hero)!, note: c.note }));
  const targetsOf = (h: ReviewHero): Matchup[] =>
    input.enemies.flatMap((e) => {
      const c = guideOf(e)?.counters.find((x) => x.hero === h.slug);
      return c ? [{ hero: e, note: c.note }] : [];
    });
  const synergiesOf = (h: ReviewHero): Matchup[] =>
    (guideOf(h)?.synergies ?? []).filter((c) => allySlugs.has(c.hero)).map((c) => ({ hero: bySlug.get(c.hero)!, note: c.note }));

  const threats = threatsOf(main.hero);
  const targets = targetsOf(main.hero);
  const synergies = synergiesOf(main.hero);
  const teamups = (guideOf(main.hero)?.teamups ?? []).flatMap((t) =>
    t.partners.filter((p) => allySlugs.has(p)).map((p) => ({ name: t.name, partner: bySlug.get(p)!, text: t.text })),
  );

  const pressured = input.allies
    .map((ally) => ({ ally, by: threatsOf(ally).map((t) => t.hero) }))
    .filter((p) => p.by.length >= 2)
    .sort((a, b) => b.by.length - a.by.length)
    .slice(0, 3);

  // Swaps : parmi les héros que le joueur sait jouer au même rôle, ceux que la compo adverse gêne moins
  const score = (h: ReviewHero) => targetsOf(h).length - threatsOf(h).length + 0.5 * synergiesOf(h).length;
  const current = score(main.hero);
  const taken = new Set([...allySlugs, ...input.mine.map((m) => m.hero.slug)]);
  const swaps = input.pool
    .filter((h) => h.roles.includes(main.role) && !taken.has(h.slug) && guideOf(h))
    .map((h) => ({ hero: h, score: score(h), good: targetsOf(h), bad: threatsOf(h), syn: synergiesOf(h) }))
    .filter((c) => c.score >= current + 1 && c.bad.length <= threats.length)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((c) => ({
      hero: c.hero,
      reasons: [
        c.good.length ? `gêne ${c.good.map((g) => g.hero.name).join(", ")}` : "",
        c.bad.length ? `craint ${c.bad.map((g) => g.hero.name).join(", ")}` : "aucun de ses counters en face",
        c.syn.length ? `synergie avec ${c.syn.map((g) => g.hero.name).join(", ")}` : "",
      ].filter(Boolean),
    }));

  // Rôles : ceux lus sur la capture quand elle les donne (fiable même si un héros n'est pas identifié)
  const fromRoster = (side: RosterEntry["side"]) => {
    const rows = input.roster.filter((r) => r.side === side);
    if (rows.length < 5 || rows.some((r) => !r.role)) return null;
    const out = { Vanguard: 0, Duelist: 0, Strategist: 0 } as Record<Role, number>;
    for (const r of rows) out[r.role!]++;
    return out;
  };
  const ally = fromRoster("ally") ?? (input.allies.length >= 4 ? count([{ roles: [main.role] }, ...input.allies]) : null);
  const enemy = fromRoster("enemy") ?? (input.enemies.length >= 5 ? count(input.enemies) : null);
  const notes = ally ? compNotes(ally) : [];
  const n = (v: number, word: string) => `${v} ${word}${v > 1 ? "s" : ""}`;
  if (ally && enemy) {
    if (enemy.Strategist > ally.Strategist) notes.push({ tone: "info", text: `L'équipe adverse avait ${n(enemy.Strategist, "Strategist")} contre ${ally.Strategist} : plus de soins en face, il fallait finir les cibles vite ou viser leurs supports.` });
    if (enemy.Vanguard > ally.Vanguard) notes.push({ tone: "info", text: `L'équipe adverse avait ${n(enemy.Vanguard, "Vanguard")} contre ${ally.Vanguard} : elle prenait l'espace plus facilement.` });
  }

  return { comp: { ally, enemy, notes }, threats, targets, synergies, teamups, pressured, swaps, facts: facts(input.roster, main.role) };
}
