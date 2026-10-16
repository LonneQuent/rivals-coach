import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { getPlayedHeroes } from "@/lib/comps-data";
import { getBestScores, getHandQuestions, getQuizSources } from "@/lib/quiz-data";
import { buildQuiz } from "@/lib/quiz";
import { EmptyState } from "@/components/ui";
import { QuizRunner } from "@/components/quiz-runner";

export const metadata: Metadata = { title: "Quiz" };
export const dynamic = "force-dynamic";

const COUNT = 10;

export default async function QuizPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ s?: string }> }) {
  const [{ slug }, { s }] = await Promise.all([params, searchParams]);
  const { supabase, user } = await requireSession();
  const { heroes, maps } = await getRefs();
  const sources = await getQuizSources(supabase, heroes);
  const [hand, best] = await Promise.all([getHandQuestions(supabase, heroes, maps, sources), getBestScores(supabase, user.id, heroes)]);

  let mode: "hero" | "mine" | "mix" | "maps";
  let pool = sources;
  let pick = hand.filter((h) => h.heroSlug);
  let title: string;
  if (slug === "melange") {
    mode = "mix";
    title = "Mélange";
  } else if (slug === "cartes") {
    mode = "maps";
    title = "Cartes et game sense";
    pool = [];
    pick = hand.filter((h) => !h.heroSlug);
  } else if (slug === "mes-heros") {
    mode = "mine";
    title = "Mes héros";
    const played = await getPlayedHeroes(supabase, user.id, new Map(heroes.map((h) => [h.id, h.slug])));
    const top = new Set([...played.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([x]) => x));
    pool = sources.filter((x) => top.has(x.hero.slug));
    // Aucun héros joué n'a de guide : on interroge sur tout le roster
    if (!pool.length) pool = sources;
  } else {
    mode = "hero";
    pool = sources.filter((x) => x.hero.slug === slug);
    if (!pool.length) notFound();
    title = pool[0].hero.name;
  }

  // La graine vient de l'adresse : recharger la page ne change pas le quiz en cours, « Nouveau quiz » en tire une autre
  const seed = Number.isFinite(Number(s)) && s ? Number(s) : Math.floor(Math.random() * 2 ** 31);
  const questions = buildQuiz({ pool, all: sources, hand: pick, count: COUNT, seed });
  if (questions.length < 3) {
    return (
      <EmptyState
        title="Pas assez de questions"
        body={mode === "maps" ? "Les questions sur les cartes arrivent avec la migration 0015." : "Ce guide est encore trop court pour un quiz. Essaie un autre héros ou le mélange."}
        href="/quiz"
        cta="Retour aux quiz"
      />
    );
  }
  const hero = mode === "hero" ? pool[0].hero : null;
  const bestKey = hero ? hero.slug : mode;
  const b = best?.get(bestKey);

  return (
    <>
      <Link href="/quiz" className="text-sm text-muted hover:text-fg">
        ← Tous les quiz
      </Link>
      <QuizRunner
        key={seed}
        title={title}
        questions={questions}
        mode={mode}
        heroId={hero?.id ?? null}
        guideHref={hero ? `/heros/${hero.slug}` : mode === "maps" ? "/cartes" : null}
        best={b ? { score: b.score, total: b.total } : null}
      />
    </>
  );
}
