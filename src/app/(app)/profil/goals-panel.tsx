"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Trash2, X } from "lucide-react";
import { GOAL_WINDOW, METRICS, formatMetric, goalLabel, type MetricKey } from "@/lib/stats";
import { ROLES, type Role } from "@/lib/types";
import { buttonClass } from "@/components/ui";
import { addGoal, removeGoal } from "./actions";

export type GoalView = { id: string; metric: MetricKey; op: "<=" | ">="; target: number; role: Role | null; fromCoach: boolean; value: number | null; met: boolean; games: number };

export function GoalsPanel({ goals }: { goals: GoalView[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [metric, setMetric] = useState<MetricKey>("deaths");
  const [target, setTarget] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [error, setError] = useState<string | null>(null);
  const better = METRICS[metric].better;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = Number(target.replace(",", "."));
    if (!target.trim() || !Number.isFinite(t) || t < 0) return setError("Indique une valeur cible.");
    setError(null);
    start(async () => {
      const res = await addGoal({ metric, op: better === "up" ? ">=" : "<=", target: t, role: role || null });
      if (!res.ok) return setError(res.error ?? "Erreur.");
      setTarget("");
      router.refresh();
    });
  }

  return (
    <section className="card flex flex-col gap-4">
      <div>
        <h2 className="text-lg uppercase tracking-wide">Objectifs</h2>
        <p className="text-sm text-muted">Mesurés automatiquement sur tes {GOAL_WINDOW} dernières parties concernées.</p>
      </div>
      {goals.length ? (
        <ul className="flex flex-col divide-y divide-line">
          {goals.map((g) => (
            <li key={g.id} className="flex flex-wrap items-center gap-3 py-2.5">
              <span className={clsx("grid size-7 shrink-0 place-items-center rounded-full", !g.games ? "bg-surface-3 text-muted" : g.met ? "bg-good-bg text-good" : "bg-bad-bg text-bad")} aria-hidden>
                {g.met ? <Check className="size-4" /> : <X className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {goalLabel(g)} {g.fromCoach ? <span className="ml-1 rounded-full bg-surface-3 px-2 py-0.5 text-[11px] text-fg-2">fixé par ton coach</span> : null}
                </p>
                <p className="text-xs text-muted">
                  {g.games ? `Actuel : ${formatMetric(g.metric, g.value)} sur ${g.games} partie${g.games > 1 ? "s" : ""} · ${g.met ? "atteint" : "pas encore"}` : "Pas encore de partie concernée"}
                </p>
              </div>
              {!g.fromCoach ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => start(async () => { await removeGoal(g.id); router.refresh(); })}
                  className={buttonClass("ghost", "px-2")}
                  aria-label={`Retirer l'objectif ${goalLabel(g)}`}
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Aucun objectif. Exemple : moins de 6 morts par partie en Duelist.</p>
      )}

      <form onSubmit={submit} className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[1.4fr_0.8fr_1fr_auto]">
        <label className="label col-span-2 sm:col-span-1" htmlFor="g-metric">
          Stat
          <select id="g-metric" className="field" value={metric} onChange={(e) => setMetric(e.target.value as MetricKey)}>
            {(Object.keys(METRICS) as MetricKey[]).map((k) => (
              <option key={k} value={k}>
                {METRICS[k].label}
              </option>
            ))}
          </select>
        </label>
        <label className="label" htmlFor="g-target">
          {better === "up" ? "Au moins" : "Au plus"}
          <input id="g-target" className="field tabular" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value.replace(/[^\d.,]/g, ""))} placeholder={METRICS[metric].unit === "%" ? "55" : "6"} />
        </label>
        <label className="label" htmlFor="g-role">
          Rôle
          <select id="g-role" className="field" value={role} onChange={(e) => setRole(e.target.value as Role | "")}>
            <option value="">Tous</option>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={pending} className={buttonClass("default", "col-span-2 sm:col-span-1")}>
          Ajouter
        </button>
      </form>
      {error ? <p className="text-sm text-bad">{error}</p> : null}
    </section>
  );
}
