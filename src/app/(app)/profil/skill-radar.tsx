"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SKILL_AXES, type SkillKey, type SkillScores } from "@/lib/skills";
import { buttonClass } from "@/components/ui";
import { saveEvaluation } from "./actions";

type Series = { label: string; scores: SkillScores; date: string };

const SIZE = 420;
const C = SIZE / 2;
const R = 100;

function point(i: number, n: number, value: number) {
  const a = (Math.PI * 2 * i) / n - Math.PI / 2;
  const r = (value / 10) * R;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

/** Radar de compétences : ta dernière auto-évaluation, comparée à la précédente et à la note de ton coach. */
export function SkillRadar({
  current,
  previous,
  coach,
  facts,
  playerId,
  mineLabel = "Toi",
  overlayLabel = "Coach",
  intro = "Note-toi de 1 à 10 sur chaque axe. Refais-le régulièrement pour voir ta progression.",
  editLabel = "Mettre à jour mon évaluation",
}: {
  current: Series | null;
  previous: Series | null;
  coach: Series | null;
  facts: Partial<Record<SkillKey, string>>;
  playerId?: string;
  mineLabel?: string;
  overlayLabel?: string;
  intro?: string;
  editLabel?: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(!current);
  const [draft, setDraft] = useState<Record<SkillKey, number>>(() => Object.fromEntries(SKILL_AXES.map((a) => [a.key, current?.scores[a.key] ?? 5])) as Record<SkillKey, number>);
  const [hover, setHover] = useState<SkillKey | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const n = SKILL_AXES.length;
  const shown: Series | null = editing ? { label: "Brouillon", scores: draft, date: "" } : current;
  const poly = (s: SkillScores) => SKILL_AXES.map((a, i) => point(i, n, s[a.key] ?? 0).join(",")).join(" ");

  function save() {
    setError(null);
    start(async () => {
      const res = await saveEvaluation(draft, playerId);
      if (!res.ok) return setError(res.error ?? "Erreur.");
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <section className="card flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg uppercase tracking-wide">Radar de compétences</h2>
          <p className="text-sm text-muted">{intro}</p>
        </div>
        {!editing ? (
          <button type="button" onClick={() => setEditing(true)} className={buttonClass("default")}>
            {editLabel}
          </button>
        ) : null}
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-3">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[420px]" role="img" aria-label="Radar de compétences">
            {[2, 4, 6, 8, 10].map((lvl) => (
              <polygon key={lvl} points={SKILL_AXES.map((_, i) => point(i, n, lvl).join(",")).join(" ")} fill="none" stroke="var(--color-line)" strokeWidth={1} />
            ))}
            {SKILL_AXES.map((a, i) => {
              const [x, y] = point(i, n, 10);
              const [lx, ly] = point(i, n, 11.8);
              return (
                <g key={a.key}>
                  <line x1={C} y1={C} x2={x} y2={y} stroke="var(--color-line)" strokeWidth={1} />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={Math.abs(lx - C) < 8 ? "middle" : lx > C ? "start" : "end"}
                    dominantBaseline="middle"
                    fontSize={11}
                    fontWeight={600}
                    fill={hover === a.key ? "var(--color-accent)" : "var(--color-fg-2)"}
                  >
                    {a.label}
                  </text>
                </g>
              );
            })}
            {previous && !editing ? <polygon points={poly(previous.scores)} fill="none" stroke="var(--color-muted)" strokeWidth={2} strokeDasharray="5 4" /> : null}
            {coach ? <polygon points={poly(coach.scores)} fill="var(--color-van)" fillOpacity={0.12} stroke="var(--color-van)" strokeWidth={2} /> : null}
            {shown ? (
              <>
                <polygon points={poly(shown.scores)} fill="var(--color-accent)" fillOpacity={0.18} stroke="var(--color-accent)" strokeWidth={2} />
                {SKILL_AXES.map((a, i) => {
                  const [x, y] = point(i, n, shown.scores[a.key] ?? 0);
                  return <circle key={a.key} cx={x} cy={y} r={hover === a.key ? 5 : 3.5} fill="var(--color-accent)" stroke="var(--color-surface)" strokeWidth={2} />;
                })}
              </>
            ) : null}
          </svg>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-fg-2">
            {shown ? (
              <li className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-accent" aria-hidden /> {editing ? "En cours" : `${mineLabel}${current ? `, ${new Date(current.date).toLocaleDateString("fr-FR")}` : ""}`}
              </li>
            ) : null}
            {previous && !editing ? (
              <li className="flex items-center gap-1.5">
                <span className="h-0 w-4 border-t-2 border-dashed border-muted" aria-hidden /> Avant, {new Date(previous.date).toLocaleDateString("fr-FR")}
              </li>
            ) : null}
            {coach ? (
              <li className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-van" aria-hidden /> {overlayLabel}, {new Date(coach.date).toLocaleDateString("fr-FR")}
              </li>
            ) : null}
          </ul>
        </div>

        <ul className="flex min-w-0 flex-col divide-y divide-line">
          {SKILL_AXES.map((a) => (
            <li key={a.key} className="flex flex-col gap-1 py-2" onMouseEnter={() => setHover(a.key)} onMouseLeave={() => setHover(null)}>
              <div className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm font-semibold">{a.label}</span>
                {editing ? (
                  <>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      id={`skill-${a.key}`}
                      aria-label={a.label}
                      value={draft[a.key]}
                      onFocus={() => setHover(a.key)}
                      onChange={(e) => setDraft({ ...draft, [a.key]: Number(e.target.value) })}
                      className="min-w-0 flex-1 accent-[var(--color-accent)]"
                    />
                    <span className="w-8 text-right font-display text-lg font-bold tabular">{draft[a.key]}</span>
                  </>
                ) : (
                  <>
                    <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-3">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${((current?.scores[a.key] ?? 0) / 10) * 100}%` }} />
                    </span>
                    <span className="w-14 text-right font-display text-lg font-bold tabular">
                      {current?.scores[a.key] ?? "–"}
                      {coach?.scores[a.key] ? <span className="ml-1 text-xs font-semibold text-van">{coach.scores[a.key]}</span> : null}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted">{facts[a.key] ? <span className="text-fg-2">{facts[a.key]}</span> : a.hint}</p>
            </li>
          ))}
        </ul>
      </div>

      {editing ? (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" disabled={pending} onClick={save} className={buttonClass("primary")}>
            {pending ? "Enregistrement…" : "Enregistrer l'évaluation"}
          </button>
          {current ? (
            <button type="button" className={buttonClass("ghost")} onClick={() => setEditing(false)}>
              Annuler
            </button>
          ) : null}
          {error ? <p className="text-sm text-bad">{error}</p> : null}
        </div>
      ) : null}
      <p className="text-xs text-muted">Les repères chiffrés viennent de tes parties saisies. Ils t&apos;aident à te noter, ils ne remplacent pas ta note.</p>
    </section>
  );
}
