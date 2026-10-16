import type { GuideContent } from "@/lib/guides";
import type { Hero } from "@/lib/types";

/*
 * Quiz de connaissance des héros : les questions sont tirées du contenu des guides et des kits
 * (touches, capacités, team-ups, counters, alliés, erreurs à éviter, combos). Aucun appel externe.
 */

export type QuizQuestion = {
  id: string;
  heroSlug: string;
  heroName: string;
  /** Catégorie affichée au-dessus de la question. */
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
  /** Explication montrée après la réponse. */
  explain: string;
};

export type QuizSource = { hero: Hero; guide: GuideContent };

type Rng = () => number;

/** Générateur pseudo-aléatoire reproductible (mulberry32). */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const plain = (s: string) => s.replace(/\*\*/g, "").trim();
const clip = (s: string, n = 150) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

function shuffle<T>(xs: T[], rng: Rng): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(xs: T[], rng: Rng): T | undefined {
  return xs.length ? xs[Math.floor(rng() * xs.length)] : undefined;
}

/** Construit une question à choix multiples : la bonne réponse + jusqu'à 3 leurres distincts. */
function mcq(base: Omit<QuizQuestion, "options" | "answer">, correct: string, decoys: string[], rng: Rng): QuizQuestion | null {
  const uniq = [...new Set(decoys.filter((d) => d && d.toLowerCase() !== correct.toLowerCase()))];
  if (uniq.length < 2) return null;
  const options = shuffle([correct, ...shuffle(uniq, rng).slice(0, 3)], rng);
  return { ...base, options, answer: options.indexOf(correct) };
}

const KEYS = ["Clic G", "Clic D", "Maj", "E", "F", "Q", "Espace", "Mêlée"];
const singleKey = (k: string) => (k && !/[·/,]/.test(k) ? k.trim() : "");

/** Toutes les questions possibles pour un héros. */
function questionsFor({ hero, guide }: QuizSource, all: QuizSource[], rng: Rng): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const base = (topic: string, n: number) => ({ id: `${hero.slug}-${topic}-${n}`, heroSlug: hero.slug, heroName: hero.name, topic });
  const others = all.filter((s) => s.hero.slug !== hero.slug);
  const nameOf = (slug: string) => all.find((s) => s.hero.slug === slug)?.hero.name ?? slug;
  const kit = guide.kit;

  // Touches des capacités (kit en priorité, sinon sections du guide)
  const abilities = kit?.abilities.length
    ? kit.abilities.map((a) => ({ name: a.name, key: singleKey(a.key), text: a.text, kind: a.kind }))
    : guide.sections.filter((s) => s.ability && !s.ability.includes("·")).map((s) => ({ name: s.ability, key: singleKey(s.key), text: s.lead, kind: "ability" as const }));
  abilities
    .filter((a) => a.key && a.kind !== "passive")
    .forEach((a, i) => {
      const q = mcq({ ...base("Touches", i), prompt: `Quelle est la touche par défaut de « ${a.name} » ?`, explain: `${a.name} : ${a.key}.` }, a.key, KEYS, rng);
      if (q) out.push(q);
    });

  // Retrouver la capacité d'après sa description
  const named = abilities.filter((a) => a.text && a.text.length > 30);
  named.forEach((a, i) => {
    const desc = plain(a.text).replace(new RegExp(a.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "???");
    const q = mcq(
      { ...base("Capacités", i), prompt: `Quelle capacité correspond à : « ${clip(desc, 170)} » ?`, explain: `C'est ${a.name}${a.key ? ` (${a.key})` : ""}.` },
      a.name,
      abilities.map((x) => x.name),
      rng,
    );
    if (q) out.push(q);
  });

  // Team-ups de la saison
  (kit?.teamups ?? []).forEach((t, i) => {
    const partners = t.partners.filter((p) => p !== hero.slug);
    const partner = pick(partners, rng);
    if (!partner) return;
    const decoys = others.map((o) => o.hero.name).filter((n) => !partners.map(nameOf).includes(n));
    const q = mcq(
      { ...base("Team-ups", i), prompt: `Avec quel héros ${hero.name} partage-t-il le team-up « ${t.name} » ?`, explain: `${t.name} : ${hero.name} avec ${partners.map(nameOf).join(", ")}${t.text ? `. ${plain(t.text)}` : "."}` },
      nameOf(partner),
      shuffle(decoys, rng).slice(0, 6),
      rng,
    );
    if (q) out.push(q);
  });

  // Chiffres du kit
  const numeric = (kit?.abilities ?? []).flatMap((a) => a.stats.map((st) => ({ a, st })));
  shuffle(numeric, rng)
    .slice(0, 2)
    .forEach(({ a, st }, i) => {
      const sameLabel = all.flatMap((s) => (s.guide.kit?.abilities ?? []).flatMap((x) => x.stats.filter((y) => y.label === st.label).map((y) => y.value)));
      const q = mcq({ ...base("Chiffres", i), prompt: `${a.name} : quelle est la valeur de « ${st.label} » ?`, explain: `${a.name} — ${st.label} : ${st.value}${kit?.season ? ` (${kit.season})` : ""}.` }, st.value, sameLabel, rng);
      if (q) out.push(q);
    });

  // Counters et alliés
  guide.counters.forEach((c, i) => {
    const bad = new Set(guide.counters.map((x) => x.hero));
    const decoys = [...guide.synergies.map((x) => nameOf(x.hero)), ...others.filter((o) => !bad.has(o.hero.slug)).map((o) => o.hero.name)];
    const q = mcq({ ...base("Counters", i), prompt: `D'après le guide, lequel de ces héros est un counter de ${hero.name} ?`, explain: `${nameOf(c.hero)} : ${plain(c.note)}` }, nameOf(c.hero), shuffle(decoys, rng).slice(0, 6), rng);
    if (q) out.push(q);
  });
  guide.synergies.forEach((c, i) => {
    const good = new Set(guide.synergies.map((x) => x.hero));
    const decoys = [...guide.counters.map((x) => nameOf(x.hero)), ...others.filter((o) => !good.has(o.hero.slug)).map((o) => o.hero.name)];
    const q = mcq({ ...base("Alliés", i), prompt: `D'après le guide, lequel de ces héros est un bon allié de ${hero.name} ?`, explain: `${nameOf(c.hero)} : ${plain(c.note)}` }, nameOf(c.hero), shuffle(decoys, rng).slice(0, 6), rng);
    if (q) out.push(q);
  });

  // Erreurs à éviter, mélangées avec de bons réflexes
  const mistakes = guide.sections.filter((s) => s.kind === "mistakes").flatMap((s) => s.items);
  // Leurres : de bons réflexes (sections d'astuces d'abord), formulés comme des conseils
  const tips = guide.sections.filter((s) => s.kind === "tips").flatMap((s) => s.items);
  const good = (tips.length >= 3 ? tips : guide.sections.filter((s) => s.kind !== "mistakes").flatMap((s) => s.items)).filter((t) => t.length < 120);
  mistakes.forEach((m, i) => {
    const q = mcq({ ...base("Erreurs", i), prompt: `Avec ${hero.name}, laquelle de ces habitudes est une erreur ?`, explain: `À éviter : ${plain(m)}` }, clip(plain(m), 120), shuffle(good, rng).map((g) => clip(plain(g), 120)), rng);
    if (q) out.push(q);
  });

  // Combos : retrouver l'étape manquante
  guide.combos.forEach((c, i) => {
    const keyed = c.steps.map((s, j) => ({ s, j })).filter(({ s }) => s.key);
    const hole = pick(keyed, rng);
    if (!hole) return;
    const shown = c.steps.map((s, j) => (j === hole.j ? "???" : s.key || s.label)).join(" → ");
    const q = mcq(
      { ...base("Combos", i), prompt: `Combo « ${c.title} » : ${shown}. Quelle touche manque ?`, explain: `${c.title} : ${c.steps.map((s) => s.key || s.label).join(" → ")}.${c.note ? ` ${plain(c.note)}` : ""}` },
      hole.s.key,
      KEYS,
      rng,
    );
    if (q) out.push(q);
  });

  return out;
}

/**
 * Tire un quiz : questions variées (on évite d'enchaîner deux fois le même thème), réparties entre les héros demandés.
 * `pool` = héros interrogés ; `all` = tous les héros avec guide (pour les leurres).
 */
export function buildQuiz(pool: QuizSource[], all: QuizSource[], count: number, seed: number): QuizQuestion[] {
  const rng = seededRng(seed);
  const perHero = pool.map((p) => shuffle(questionsFor(p, all, rng), rng));
  const picked: QuizQuestion[] = [];
  // Pas plus d'un quart du quiz sur le même thème (sauf s'il ne reste que ça)
  const cap = Math.max(2, Math.ceil(count / 4));
  const used = (t: string) => picked.filter((q) => q.topic === t).length;
  let guard = 0;
  while (picked.length < count && perHero.some((q) => q.length) && guard++ < 500) {
    for (const qs of shuffle(perHero, rng)) {
      if (picked.length >= count) break;
      const last = picked.at(-1)?.topic;
      let idx = qs.findIndex((q) => q.topic !== last && used(q.topic) < cap);
      if (idx === -1) idx = qs.findIndex((q) => used(q.topic) < cap);
      if (idx === -1 && guard > 50) idx = 0;
      if (idx === -1) continue;
      const [q] = qs.splice(idx, 1);
      if (q) picked.push(q);
    }
  }
  return picked;
}

export function quizScoreLabel(score: number, total: number) {
  const r = total ? score / total : 0;
  if (r === 1) return "Sans faute. Le Prof n'a plus rien à t'apprendre sur ce perso.";
  if (r >= 0.8) return "Très solide : tu connais ton perso.";
  if (r >= 0.5) return "Pas mal, mais il reste des trous. Relis le guide et retente.";
  return "On repart sur les bases : le guide t'attend.";
}
