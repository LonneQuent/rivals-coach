"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Check, RotateCcw, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/quiz";
import { quizScoreLabel } from "@/lib/quiz";
import { Mascot } from "@/components/mascot";
import { buttonClass } from "@/components/ui";
import { saveQuizAttempt } from "@/app/(app)/quiz/actions";

type Answer = { q: QuizQuestion; picked: number };

/**
 * Déroule un quiz : une question à la fois, correction et explication immédiates,
 * puis un bilan complet (toutes les questions, avec la bonne réponse et le lien vers le guide).
 * Le score n'est enregistré qu'une fois, pour le premier passage (pas pour « rejouer mes erreurs »).
 * Touches 1 à 4 pour répondre, Entrée pour continuer.
 */
export function QuizRunner({
  title,
  questions: initial,
  mode,
  heroId,
  guideHref,
  best,
}: {
  title: string;
  questions: QuizQuestion[];
  mode: "hero" | "mine" | "mix" | "maps";
  heroId: number | null;
  guideHref: string | null;
  best: { score: number; total: number } | null;
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initial);
  const [retry, setRetry] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "fail">("idle");
  const [finished, setFinished] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const q = questions[i];
  const score = answers.filter((a) => a.picked === a.q.answer).length;

  function choose(n: number) {
    if (picked !== null || finished) return;
    setPicked(n);
    setAnswers((xs) => [...xs, { q, picked: n }]);
  }

  function next() {
    if (picked === null) return;
    if (i < questions.length - 1) {
      setPicked(null);
      setI((x) => x + 1);
      return;
    }
    setFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Enregistré une seule fois, au premier passage complet
    if (!retry && saved === "idle") {
      setSaved("saving");
      void saveQuizAttempt({ heroId, mode, score, total: questions.length }).then((r) => setSaved(r.ok ? "ok" : "fail"));
    }
  }

  function replayMistakes() {
    const wrong = answers.filter((a) => a.picked !== a.q.answer).map((a) => a.q);
    if (!wrong.length) return;
    setQuestions(wrong);
    setRetry(true);
    setAnswers([]);
    setPicked(null);
    setI(0);
    setFinished(false);
  }

  function newQuiz() {
    router.push(`?s=${Math.floor(Math.random() * 2 ** 31)}`);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || finished) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length && picked === null) {
        e.preventDefault();
        choose(n - 1);
      } else if (e.key === "Enter" && picked !== null) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (picked !== null) nextRef.current?.focus();
  }, [picked]);

  if (finished) {
    const ratio = score / questions.length;
    const wrong = answers.filter((a) => a.picked !== a.q.answer).length;
    const beaten = !retry && best && ratio > best.score / best.total;
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <div className="card flex flex-col items-center gap-3 py-8 text-center">
          <Mascot className="size-24" bob pose={ratio >= 0.8 ? "point" : ratio >= 0.5 ? "think" : "warn"} />
          <p className="eyebrow">{retry ? `${title} · tes erreurs` : title}</p>
          <p className="font-display text-5xl font-bold tabular">
            {score}
            <span className="text-2xl text-muted">/{questions.length}</span>
          </p>
          <p className="max-w-md text-fg-2">{retry ? (wrong ? "Encore quelques trous : relis les explications ci-dessous." : "Toutes corrigées. Bien joué.") : quizScoreLabel(score, questions.length)}</p>
          {!retry ? (
            <p className="text-xs text-muted">
              {beaten ? "Nouveau record ! " : best ? `Ton meilleur score : ${best.score}/${best.total}. ` : ""}
              {saved === "ok" ? "Score enregistré." : saved === "fail" ? "Score non enregistré (migrations 0012 et 0015 à exécuter)." : saved === "saving" ? "Enregistrement…" : ""}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {wrong ? (
              <button type="button" className={buttonClass("primary")} onClick={replayMistakes}>
                <RotateCcw className="size-4" /> Rejouer mes {wrong} erreur{wrong > 1 ? "s" : ""}
              </button>
            ) : null}
            <button type="button" className={buttonClass(wrong ? "default" : "primary")} onClick={newQuiz}>
              Nouveau quiz
            </button>
            {guideHref ? (
              <Link href={guideHref} className={buttonClass("default")}>
                Lire le guide
              </Link>
            ) : null}
            <Link href="/quiz" className={buttonClass("ghost")}>
              Autres quiz
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl uppercase tracking-wide">Le corrigé</h2>
          <ol className="flex flex-col gap-2">
            {answers.map(({ q: a, picked: p }, n) => {
              const ok = p === a.answer;
              return (
                <li key={`${a.id}-${n}`} className="rounded-xl border border-line bg-surface p-4" style={{ borderLeft: `3px solid var(--color-${ok ? "good" : "bad"})` }}>
                  <p className="eyebrow">
                    {n + 1}. {a.heroName ? `${a.heroName} · ` : ""}
                    {a.topic}
                  </p>
                  <p className="mt-1 font-semibold">{a.prompt}</p>
                  {ok ? (
                    <p className="mt-2 flex items-start gap-2 text-sm text-good">
                      <Check className="mt-0.5 size-4 shrink-0" aria-hidden /> {a.options[a.answer]}
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 flex items-start gap-2 text-sm text-bad">
                        <X className="mt-0.5 size-4 shrink-0" aria-hidden /> Ta réponse : {a.options[p]}
                      </p>
                      <p className="mt-1 flex items-start gap-2 text-sm text-good">
                        <Check className="mt-0.5 size-4 shrink-0" aria-hidden /> Bonne réponse : {a.options[a.answer]}
                      </p>
                    </>
                  )}
                  <p className="mt-2 text-sm text-fg-2">{a.explain}</p>
                  {a.href ? (
                    <Link href={a.href} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                      <BookOpen className="size-3.5" aria-hidden /> Voir dans le guide
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    );
  }

  const isLast = i === questions.length - 1;
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">
          {retry ? "Tes erreurs" : "Quiz"} · {title}
        </p>
        <p className="text-sm font-semibold tabular text-fg-2">
          Question {i + 1}/{questions.length} · {score} bonne{score > 1 ? "s" : ""}
        </p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-3" aria-hidden>
        <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${((i + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>
      {i === 0 && picked === null && best && !retry ? <p className="text-xs text-muted">Ton meilleur score sur ce quiz : {best.score}/{best.total}.</p> : null}

      <div className="card flex flex-col gap-4">
        <p className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">{q.topic}</span>
          {mode !== "hero" && q.heroName ? <span>{q.heroName}</span> : null}
        </p>
        <h1 className="text-xl font-semibold leading-snug text-fg normal-case tracking-normal" style={{ fontFamily: "inherit" }}>
          {q.prompt}
        </h1>
        <ul className="flex flex-col gap-2">
          {q.options.map((o, n) => {
            const state = picked === null ? "idle" : n === q.answer ? "right" : n === picked ? "wrong" : "dim";
            return (
              <li key={n}>
                <button
                  type="button"
                  disabled={picked !== null}
                  onClick={() => choose(n)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-colors ${
                    state === "idle"
                      ? "border-line bg-surface-2 hover:border-fg-2"
                      : state === "right"
                        ? "border-good bg-good-bg text-fg"
                        : state === "wrong"
                          ? "border-bad bg-bad-bg text-fg"
                          : "border-line bg-surface-2 opacity-50"
                  }`}
                >
                  <kbd className="grid size-7 shrink-0 place-items-center rounded-md border border-line border-b-[3px] bg-surface-3 text-xs font-bold">{n + 1}</kbd>
                  <span className="min-w-0 flex-1">{o}</span>
                  {state === "right" ? <Check className="size-5 shrink-0 text-good" aria-hidden /> : state === "wrong" ? <X className="size-5 shrink-0 text-bad" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
        {picked !== null ? (
          <div className="flex flex-col gap-3 border-t border-line pt-3">
            <div className="text-sm text-fg-2" role="status">
              <p>
                <strong className={picked === q.answer ? "text-good" : "text-bad"}>{picked === q.answer ? "Bien vu. " : `Raté : la bonne réponse était « ${q.options[q.answer]} ». `}</strong>
                {q.explain}
              </p>
              {q.href ? (
                <Link href={q.href} target="_blank" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                  <BookOpen className="size-3.5" aria-hidden /> Voir dans le guide
                </Link>
              ) : null}
            </div>
            <button ref={nextRef} type="button" className={buttonClass("primary", "self-end")} onClick={next}>
              {isLast ? "Voir mon score" : "Suivante"} <ArrowRight className="size-4" />
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted">Astuce : réponds avec les touches 1 à {q.options.length}, puis Entrée.</p>
        )}
      </div>
    </section>
  );
}
