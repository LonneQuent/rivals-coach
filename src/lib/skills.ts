import { aggregate, formatMetric, metricValue, type MatchRow } from "@/lib/stats";

/** Axes du radar. Toutes les notes sont sur 10, données par le joueur (et plus tard par son coach). */
export const SKILL_AXES = [
  { key: "aim", label: "Aim", hint: "Précision et régularité de tes tirs." },
  { key: "survival", label: "Survie", hint: "Placement, couverture, mourir moins." },
  { key: "impact", label: "Impact", hint: "Ce que tu apportes aux fights : dégâts, soins ou espace selon ton rôle." },
  { key: "pool", label: "Champion pool", hint: "Nombre de héros que tu maîtrises vraiment." },
  { key: "consistency", label: "Régularité", hint: "Écart entre tes bonnes et tes mauvaises parties." },
  { key: "gamesense", label: "Game sense", hint: "Lire le fight, savoir quand engager ou reculer." },
  { key: "adaptability", label: "Adaptabilité", hint: "Changer de héros ou de plan selon la compo adverse." },
  { key: "comms", label: "Communication", hint: "Annonces utiles et claires en vocal." },
  { key: "ults", label: "Gestion des ults", hint: "Le bon moment, la bonne cible, ne pas doubler." },
  { key: "mental", label: "Mental", hint: "Résistance au tilt, reste concentré après une défaite." },
] as const;
export type SkillKey = (typeof SKILL_AXES)[number]["key"];
export type SkillScores = Partial<Record<SkillKey, number>>;

export type Evaluation = { id: string; player_id: string; rater_id: string; scores: SkillScores; created_at: string };

/** Repères chiffrés tirés des parties saisies, affichés à côté des axes concernés (jamais transformés en note). */
export function skillFacts(rows: MatchRow[], errorTagTiltId?: number): Partial<Record<SkillKey, string>> {
  const list = aggregate(rows).slice(-30);
  if (list.length < 3) return {};
  const facts: Partial<Record<SkillKey, string>> = {};
  const acc = metricValue("accuracy", list);
  if (acc !== null) facts.aim = `Précision moyenne : ${formatMetric("accuracy", acc)}`;
  const d10 = metricValue("deaths10", list);
  if (d10 !== null) facts.survival = `Morts / 10 min : ${formatMetric("deaths10", d10)}`;
  const dmg = metricValue("damage10", list);
  const heal = metricValue("healing10", list);
  if (dmg !== null || heal !== null) facts.impact = [dmg !== null ? `Dégâts / 10 min : ${formatMetric("damage10", dmg)}` : "", heal ? `Soins / 10 min : ${formatMetric("healing10", heal)}` : ""].filter(Boolean).join(" · ");

  const byHero = new Map<number, { n: number; w: number }>();
  for (const m of list) for (const h of new Set(m.heroIds)) {
    const s = byHero.get(h) ?? { n: 0, w: 0 };
    s.n++;
    if (m.win) s.w++;
    byHero.set(h, s);
  }
  const solid = [...byHero.values()].filter((s) => s.n >= 3 && s.w / s.n >= 0.5).length;
  facts.pool = `${solid} héros joué${solid > 1 ? "s" : ""} 3 fois ou plus avec au moins 50 % de victoires`;
  facts.adaptability = `${byHero.size} héros différents sur tes ${list.length} dernières parties`;

  const kdas = list.map((m) => (m.kills === null || m.deaths === null ? null : (m.kills + (m.assists ?? 0)) / Math.max(m.deaths, 1))).filter((x): x is number => x !== null);
  if (kdas.length >= 5) {
    const mean = kdas.reduce((s, v) => s + v, 0) / kdas.length;
    const sd = Math.sqrt(kdas.reduce((s, v) => s + (v - mean) ** 2, 0) / kdas.length);
    facts.consistency = `KDA moyen ${mean.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}, écart type ${sd.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}`;
  }
  const feel = list.map((m) => m.feeling).filter((x): x is number => x !== null);
  const tilt = errorTagTiltId ? rows.slice(-30).filter((r) => r.match_tags?.some((t) => t.tag_id === errorTagTiltId)).length : 0;
  if (feel.length || tilt) facts.mental = [feel.length ? `Ressenti moyen ${(feel.reduce((s, v) => s + v, 0) / feel.length).toLocaleString("fr-FR", { maximumFractionDigits: 1 })}/5` : "", tilt ? `tilt noté ${tilt} fois` : ""].filter(Boolean).join(" · ");
  return facts;
}
