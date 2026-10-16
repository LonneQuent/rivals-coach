"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/quiz";
import { quizScoreLabel } from "@/lib/quiz";
import { Mascot } from "@/components/mascot";
import { buttonClass } from "@/components/ui";
import { saveQuizAttempt } from "@/app/(app)/quiz/actions";

type Answer = { q: QuizQuestion; picked: number };

/** Déroule un quiz : une question à la fois, correction immédiate, score enregistré à la fin. Touches 1 à 4 et Entrée. */
export function QuizRunner({ title, questions, mode, heroId, guideHref }: { title: string; questions: QuizQuestion[]; mode: "hero" | "mine" | "mix"; heroId: number | null; guideHref: string | null }) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saved, setSaved] = useState<"idle" | "ok" | "fail">("idle");
  const [showResult, setShowResult] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const done = answers.length === questions.length;
  const q = questions[i];
  const score = answers.filter((a) => a.picked === a.q.answer).length;

  function choose(n: number) {
    if (picked !== null || done) return;
    setPicked(n);
    setAnswers((xs) => [...xs, { q, picked: n }]);
  }

  function next() {
    if (picked === null) return;
    if (i === questions.length - 1) return setShowResult(true);
    setPicked(null);
    setI((x) => x + 1);
  }

  // Fin du quiz : enregistrement du score
  useEffect(() => {
    if (!done || saved !== "idle") return;
    void saveQuizAttempt({ heroId, mode, score, total: questions.length }).then((r) => setSaved(r.ok ? "ok" : "fail"));
  }, [done, saved, heroId, mode, score, questions.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length && picked === null) {
        e.preventDefault();
        choose(n - 1);
      } else if (e.key === "Enter" && picked !== null && !showResult) {
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

  if (showResult) {
    const wrong = answers.filter((a) => a.picked !== a.q.answer);
    const ratio = score / questions.length;
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <div className="card flex flex-col items-center gap-3 py-8 text-center">
          <Mascot className="size-24" bob pose={ratio >= 0.8 ? "point" : ratio >= 0.5 ? "think" : "warn"} />
          <p className="eyebrow">{title}</p>
          <p className="font-display text-5xl font-bold tabular">
            {score}
            <span className="text-2xl text-muted">/{questions.length}</span>
          </p>
          <p className="max-w-md text-fg-2">{quizScoreLabel(score, questions.length)}</p>
          <p className="text-xs text-muted">{saved === "ok" ? "Score enregistré." : saved === "fail" ? "Score non enregistré (migration 0012 à exécuter)." : "Enregistrement…"}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <button type="button" className={buttonClass("primary")} onClick={() => router.refresh()}>
              <RotateCcw className="size-4" /> Nouveau quiz
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
        {wrong.length ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-xl uppercase tracking-wide">À revoir</h2>
            <ul className="flex flex-col gap-2">
              {wrong.map(({ q: w, picked: p }) => (
                <li key={w.id} className="rounded-xl border border-line bg-surface p-4">
                  <p className="eyebrow">
                    {w.heroName} · {w.topic}
                  </p>
                  <p className="mt-1 font-semibold">{w.prompt}</p>
                  <p className="mt-2 flex items-start gap-2 text-sm text-bad">
                    <X className="mt-0.5 size-4 shrink-0" aria-hidden /> {w.options[p]}
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm text-good">
                    <Check className="mt-0.5 size-4 shrink-0" aria-hidden /> {w.options[w.answer]}
                  </p>
                  <p className="mt-2 text-sm text-fg-2">{w.explain}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    );
  }

  const isLast = i === questions.length - 1;
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">
          Quiz · {title}
        </p>
        <p className="text-sm font-semibold tabular text-fg-2">
          {i + 1}/{questions.length} · {score} bonne{score > 1 ? "s" : ""}
        </p>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-3" aria-hidden>
        <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${((i + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <div className="card flex flex-col gap-4">
        <p className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">{q.topic}</span>
          {mode !== "hero" ? <span>{q.heroName}</span> : null}
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
          <div className="flex flex-col gap-3 border-t border-line pt-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-sm text-fg-2" role="status">
              <strong className={picked === q.answer ? "text-good" : "text-bad"}>{picked === q.answer ? "Bien vu. " : "Raté. "}</strong>
              {q.explain}
            </p>
            <button ref={nextRef} type="button" className={buttonClass("primary", "shrink-0")} onClick={next}>
              {isLast ? "Voir mon score" : "Suivante"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted">Astuce : réponds avec les touches 1 à {q.options.length}, puis Entrée.</p>
        )}
      </div>
    </section>
  );
}
