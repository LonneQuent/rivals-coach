import "server-only";
import type { createClient } from "@/lib/supabase/server";
import { parseContent, sectionAnchor } from "@/lib/guides";
import { mapShortName, mapSlug } from "@/lib/maps";
import type { HandQuestion, QuizSource } from "@/lib/quiz";
import type { Hero, MapRef } from "@/lib/types";

type Client = Awaited<ReturnType<typeof createClient>>;

/** Héros qui ont un guide publié, avec son contenu (base des questions). */
export async function getQuizSources(supabase: Client, heroes: Hero[]): Promise<QuizSource[]> {
  const { data } = await supabase.from("guides").select("hero_id, content").eq("kind", "hero").eq("status", "published");
  const byId = new Map(heroes.map((h) => [h.id, h]));
  return ((data ?? []) as { hero_id: number; content: unknown }[]).flatMap((g) => {
    const hero = byId.get(g.hero_id);
    return hero ? [{ hero, guide: parseContent(g.content) }] : [];
  });
}

/** Héros qui ont un guide publié, sans le contenu : suffisant pour l'accueil des quiz, bien plus léger. */
export async function getGuideHeroes(supabase: Client, heroes: Hero[]): Promise<Hero[]> {
  const { data } = await supabase.from("guides").select("hero_id").eq("kind", "hero").eq("status", "published");
  const ids = new Set(((data ?? []) as { hero_id: number }[]).map((g) => g.hero_id));
  return heroes.filter((h) => ids.has(h.id));
}

export type BestScore = { score: number; total: number; at: string };

/** Meilleur score de l'utilisateur par héros (slug), plus le meilleur score « mes héros ». Null si la table n'existe pas. */
export async function getBestScores(supabase: Client, userId: string, heroes: Hero[]): Promise<Map<string, BestScore> | null> {
  const { data, error } = await supabase.from("quiz_attempts").select("hero_id, mode, score, total, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(500);
  if (error) return null;
  const slugOf = new Map(heroes.map((h) => [h.id, h.slug]));
  const best = new Map<string, BestScore>();
  for (const r of (data ?? []) as { hero_id: number | null; mode: string; score: number; total: number; created_at: string }[]) {
    const key = r.hero_id ? slugOf.get(r.hero_id) : r.mode;
    if (!key) continue;
    const cur = best.get(key);
    if (!cur || r.score / r.total > cur.score / cur.total) best.set(key, { score: r.score, total: r.total, at: r.created_at });
  }
  return best;
}

type HandRow = {
  key: string;
  hero_id: number | null;
  map_id: number | null;
  guide_slug: string | null;
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
  section: string;
};

/**
 * Questions rédigées (migration 0015), avec le lien vers la section du guide concernée.
 * Tableau vide si la table n'existe pas encore : le quiz se rabat alors sur les questions générées.
 */
export async function getHandQuestions(supabase: Client, heroes: Hero[], maps: MapRef[], sources: QuizSource[]): Promise<HandQuestion[]> {
  const { data, error } = await supabase.from("quiz_questions").select("key, hero_id, map_id, guide_slug, topic, prompt, options, answer, explain, section").eq("active", true);
  if (error || !data?.length) return [];
  const rows = data as HandRow[];
  const needOther = rows.some((r) => !r.hero_id);
  const other = needOther ? (((await supabase.from("guides").select("kind, map_id, slug, content").in("kind", ["map", "general"])).data ?? []) as { kind: string; map_id: number | null; slug: string | null; content: unknown }[]) : [];
  const heroById = new Map(heroes.map((h) => [h.id, h]));
  const guideOfHero = new Map(sources.map((s) => [s.hero.id, s.guide]));
  const anchor = (sections: { title: string }[] | undefined, title: string) => {
    const i = (sections ?? []).findIndex((s) => s.title === title);
    return i === -1 ? "" : `#${sectionAnchor(title, i)}`;
  };
  return rows.flatMap((r): HandQuestion[] => {
    const base = { key: r.key, topic: r.topic, prompt: r.prompt, options: r.options, answer: r.answer, explain: r.explain };
    if (r.hero_id) {
      const h = heroById.get(r.hero_id);
      if (!h) return [];
      return [{ ...base, heroSlug: h.slug, subject: h.name, href: `/heros/${h.slug}${anchor(guideOfHero.get(h.id)?.sections, r.section)}` }];
    }
    if (r.map_id) {
      const m = maps.find((x) => x.id === r.map_id);
      if (!m) return [];
      const g = other.find((x) => x.kind === "map" && x.map_id === m.id);
      return [{ ...base, heroSlug: null, subject: mapShortName(m.name), href: `/cartes/${mapSlug(m.name)}${anchor(g ? parseContent(g.content).sections : undefined, r.section)}` }];
    }
    if (r.guide_slug) {
      const g = other.find((x) => x.kind === "general" && x.slug === r.guide_slug);
      const c = g ? parseContent(g.content) : null;
      return [{ ...base, heroSlug: null, subject: c?.title || r.guide_slug, href: `/guides/${r.guide_slug}${anchor(c?.sections, r.section)}` }];
    }
    return [];
  });
}
