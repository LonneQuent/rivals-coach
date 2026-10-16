import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { getPlayedHeroes } from "@/lib/comps-data";
import { getQuizSources } from "@/lib/quiz-data";
import { buildQuiz } from "@/lib/quiz";
import { EmptyState } from "@/components/ui";
import { QuizRunner } from "@/components/quiz-runner";

export const metadata: Metadata = { title: "Quiz" };
export const dynamic = "force-dynamic";

const COUNT = 10;

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireSession();
  const { heroes } = await getRefs();
  const sources = await getQuizSources(supabase, heroes);

  let mode: "hero" | "mine" | "mix";
  let pool = sources;
  let title: string;
  if (slug === "melange") {
    mode = "mix";
    title = "Mélange";
  } else if (slug === "mes-heros") {
    mode = "mine";
    title = "Mes héros";
    const played = await getPlayedHeroes(supabase, user.id, new Map(heroes.map((h) => [h.id, h.slug])));
    const top = new Set([...played.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s]) => s));
    pool = sources.filter((s) => top.has(s.hero.slug));
  } else {
    mode = "hero";
    pool = sources.filter((s) => s.hero.slug === slug);
    if (!pool.length) notFound();
    title = pool[0].hero.name;
  }

  const seed = Math.floor(Math.random() * 2 ** 31);
  const questions = pool.length ? buildQuiz(pool, sources, COUNT, seed) : [];
  if (questions.length < 3) {
    return <EmptyState title="Pas assez de matière" body="Ce guide est encore trop court pour un quiz. Essaie un autre héros ou le mélange." href="/quiz" cta="Retour aux quiz" />;
  }
  const hero = mode === "hero" ? pool[0].hero : null;

  return (
    <>
      <Link href="/quiz" className="text-sm text-muted hover:text-fg">
        ← Tous les quiz
      </Link>
      <QuizRunner key={seed} title={title} questions={questions} mode={mode} heroId={hero?.id ?? null} guideHref={hero ? `/heros/${hero.slug}` : null} />
    </>
  );
}
