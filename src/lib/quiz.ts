import type { GuideContent } from "@/lib/guides";
import type { Hero } from "@/lib/types";

/*
 * Quiz de connaissance : des questions rédigées (mises en situation, une seule bonne réponse, explication)
 * complétées par des questions tirées des guides (capacités, team-ups, équilibrage, counters, combos). Aucun appel externe.
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
  /** Lien vers la section du guide qui en parle. */
  href?: string;
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

/** Question rédigée à la main (table quiz_questions) : la bonne réponse est rangée en premier. */
export type HandQuestion = {
  key: string;
  /** Slug du héros, ou null pour une carte ou un guide général. */
  heroSlug: string | null;
  /** Libellé affiché (nom du héros, de la carte ou du guide). */
  subject: string;
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
  /** Lien vers la section du guide (ancre comprise), calculé au chargement. */
  href?: string;
};

/** Mélange les options d'une question rédigée (graine reproductible). */
function fromHand(h: HandQuestion, rng: Rng): QuizQuestion {
  const correct = h.options[h.answer];
  const options = shuffle(h.options, rng);
  return { id: `hand-${h.key}`, heroSlug: h.heroSlug ?? "", heroName: h.subject, topic: h.topic, prompt: h.prompt, options, answer: options.indexOf(correct), explain: h.explain, href: h.href };
}

/**
 * Questions générées depuis les guides, pour compléter les questions rédigées.
 * Seulement des formats sans ambiguïté : les leurres sont pris dans le même guide (alliés contre counters,
 * capacités du même héros) ou exclus explicitement (partenaires de team-up).
 */
function questionsFor({ hero, guide }: QuizSource, all: QuizSource[], rng: Rng): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const base = (topic: string, n: number) => ({ id: `${hero.slug}-${topic}-${n}`, heroSlug: hero.slug, heroName: hero.name, topic, href: `/heros/${hero.slug}` });
  const others = all.filter((s) => s.hero.slug !== hero.slug);
  const nameOf = (slug: string) => all.find((s) => s.hero.slug === slug)?.hero.name ?? slug;
  const kit = guide.kit;

  // Retrouver la capacité d'après sa description (options : les autres capacités du même héros)
  const abilities = guide.sections.filter((s) => s.ability && !s.ability.includes("·")).map((s) => ({ name: s.ability, key: singleKey(s.key), text: s.lead }));
  abilities
    .filter((a) => a.text.length > 30 && !abilities.some((b) => b.name !== a.name && a.text.toLowerCase().includes(b.name.toLowerCase())))
    .forEach((a, i) => {
      const desc = plain(a.text).replace(new RegExp(a.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "???");
      const q = mcq(
        { ...base("Capacités", i), prompt: `${hero.name} : quelle capacité correspond à « ${clip(desc, 170)} » ?`, explain: `C'est ${a.name}${a.key ? ` (${a.key})` : ""}.` },
        a.name,
        abilities.map((x) => x.name),
        rng,
      );
      if (q) out.push(q);
    });

  // Team-ups de la saison : les leurres excluent tous les partenaires réels
  (kit?.teamups ?? []).forEach((t, i) => {
    const partners = t.partners.filter((p) => p !== hero.slug);
    const partner = pick(partners, rng);
    if (!partner) return;
    const decoys = others.map((o) => o.hero.name).filter((n) => !partners.map(nameOf).includes(n));
    const q = mcq(
      { ...base("Team-ups", i), prompt: `Quel héros partage le team-up « ${t.name} » avec ${hero.name} ?`, explain: `${t.name} : ${hero.name} avec ${partners.map(nameOf).join(", ")}${t.text ? `. ${plain(t.text)}` : "."}` },
      nameOf(partner),
      shuffle(decoys, rng).slice(0, 6),
      rng,
    );
    if (q) out.push(q);
  });

  // Changements récents : le vrai changement du héros parmi ceux d'autres héros
  const changes = (kit?.changes ?? []).filter((c) => !/^Tous les /.test(c.text));
  const otherChanges = others.flatMap((o) => (o.guide.kit?.changes ?? []).filter((c) => !/^Tous les /.test(c.text)).map((c) => c.text));
  changes.slice(0, 2).forEach((c, i) => {
    const q = mcq(
      { ...base("Équilibrage", i), prompt: `Lequel de ces changements récents concerne ${hero.name} ?`, explain: `${c.season} : ${c.text}` },
      clip(c.text, 160),
      shuffle(otherChanges, rng).slice(0, 6).map((t) => clip(t, 160)),
      rng,
    );
    if (q) out.push(q);
  });

  // Counters et alliés : les leurres sont pris dans l'autre liste du même guide, jamais au hasard
  const counterNames = guide.counters.map((x) => nameOf(x.hero));
  const allyNames = guide.synergies.map((x) => nameOf(x.hero));
  guide.counters.forEach((c, i) => {
    const decoys = allyNames.filter((n) => !counterNames.includes(n));
    const q = mcq({ ...base("Counters", i), prompt: `D'après le guide, lequel de ces héros pose le plus de problèmes à ${hero.name} ?`, explain: `${nameOf(c.hero)} : ${plain(c.note)} Les autres sont listés comme de bons alliés.` }, nameOf(c.hero), decoys, rng);
    if (q) out.push(q);
  });
  guide.synergies.forEach((c, i) => {
    const decoys = counterNames.filter((n) => !allyNames.includes(n));
    const q = mcq({ ...base("Alliés", i), prompt: `D'après le guide, lequel de ces héros est un bon allié de ${hero.name} ?`, explain: `${nameOf(c.hero)} : ${plain(c.note)} Les autres sont listés comme des counters.` }, nameOf(c.hero), decoys, rng);
    if (q) out.push(q);
  });

  // Combos : retrouver l'étape manquante
  guide.combos.forEach((c, i) => {
    const keyed = c.steps.map((s, j) => ({ s, j })).filter(({ s }) => s.key);
    const hole = pick(keyed, rng);
    if (!hole) return;
    const shown = c.steps.map((s, j) => (j === hole.j ? "???" : s.key || s.label)).join(" → ");
    const q = mcq(
      { ...base("Combos", i), prompt: `Combo « ${c.title} » de ${hero.name} : ${shown}. Quelle touche manque ?`, explain: `${c.title} : ${c.steps.map((s) => `${s.key ? `${s.key} ` : ""}(${s.label})`).join(" → ")}.${c.note ? ` ${plain(c.note)}` : ""}` },
      hole.s.key,
      KEYS,
      rng,
    );
    if (q) out.push(q);
  });

  // Un exemplaire de chaque thème d'abord, les doublons ensuite : deux questions « counters » d'affilée lassent vite
  const mixed = shuffle(out, rng);
  const seen = new Set<string>();
  const firsts = mixed.filter((q) => !seen.has(q.topic) && seen.add(q.topic));
  return [...firsts, ...mixed.filter((q) => !firsts.includes(q))];
}

/**
 * Tire un quiz. Les questions rédigées passent en premier, les questions générées complètent ;
 * les héros sont interrogés à tour de rôle, en évitant deux fois de suite le même thème.
 * `pool` = héros interrogés (vide pour un quiz de cartes) ; `all` = tous les héros avec guide (pour les leurres) ;
 * `hand` = questions rédigées disponibles pour ce quiz.
 */
export function buildQuiz({ pool, all, hand, count, seed }: { pool: QuizSource[]; all: QuizSource[]; hand: HandQuestion[]; count: number; seed: number }): QuizQuestion[] {
  const rng = seededRng(seed);
  const queues: QuizQuestion[][] = pool.length
    ? pool.map((p) => [...shuffle(hand.filter((h) => h.heroSlug === p.hero.slug), rng).map((h) => fromHand(h, rng)), ...questionsFor(p, all, rng)])
    : [shuffle(hand, rng).map((h) => fromHand(h, rng))];
  const picked: QuizQuestion[] = [];
  let guard = 0;
  while (picked.length < count && queues.some((q) => q.length) && guard++ < 500) {
    for (const qs of shuffle(queues, rng)) {
      if (picked.length >= count || !qs.length) continue;
      const last = picked.at(-1)?.topic;
      const idx = Math.max(0, qs.findIndex((q) => q.topic !== last));
      picked.push(qs.splice(idx, 1)[0]);
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
