"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ROLES, type Hero, type Role } from "@/lib/types";
import { HeroMark, ROLE_STYLES, RoleDot, buttonClass } from "@/components/ui";
import { saveProfile, type ProfileInput } from "./actions";

const MAX_PICKS = 5;

export function ProfileForm({ heroes, initial }: { heroes: Hero[]; initial: ProfileInput }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function toggle(kind: "mains" | "train", id: number) {
    setForm((f) => {
      const list = f[kind];
      if (list.includes(id)) return { ...f, [kind]: list.filter((x) => x !== id) };
      if (list.length >= MAX_PICKS) return f;
      const other = kind === "mains" ? "train" : "mains";
      return { ...f, [kind]: [...list, id], [other]: f[other].filter((x) => x !== id) };
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await saveProfile(form);
      setMsg(res.ok ? { ok: true, text: "Profil enregistré." } : { ok: false, text: res.error ?? "Erreur." });
      if (res.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <section className="card grid gap-4 sm:grid-cols-2">
        <label className="label" htmlFor="pseudo">
          Pseudo en jeu
          <input id="pseudo" className="field" maxLength={40} required value={form.pseudo} onChange={(e) => setForm({ ...form, pseudo: e.target.value })} />
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-fg-2">Rôle principal</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Rôle principal">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={form.main_role === r}
                onClick={() => setForm({ ...form, main_role: form.main_role === r ? null : r })}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold",
                  form.main_role === r ? clsx("border-transparent ring-2", ROLE_STYLES[r].ring, ROLE_STYLES[r].bg) : "border-line bg-surface-2 text-fg-2",
                )}
              >
                <RoleDot role={r} />
                {r}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-start gap-3 text-sm text-fg-2 sm:col-span-2">
          <input type="checkbox" className="mt-1 size-4 accent-[var(--color-accent)]" checked={form.share_aggregates} onChange={(e) => setForm({ ...form, share_aggregates: e.target.checked })} />
          <span>
            Contribuer aux stats du groupe. Seuls des totaux anonymes sont partagés, tes parties restent privées.
          </span>
        </label>
      </section>

      <HeroPicker title="Mes mains" hint={`Jusqu'à ${MAX_PICKS} héros que tu joues le plus.`} heroes={heroes} selected={form.mains} other={form.train} onToggle={(id) => toggle("mains", id)} />
      <HeroPicker title="À entraîner" hint={`Jusqu'à ${MAX_PICKS} héros que tu veux ajouter à ton pool.`} heroes={heroes} selected={form.train} other={form.mains} onToggle={(id) => toggle("train", id)} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass("primary", "px-6 py-3")}>
          {pending ? "Enregistrement…" : "Enregistrer le profil"}
        </button>
        {msg ? (
          <p role="status" className={clsx("text-sm", msg.ok ? "text-good" : "text-bad")}>
            {msg.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function HeroPicker({ title, hint, heroes, selected, other, onToggle }: { title: string; hint: string; heroes: Hero[]; selected: number[]; other: number[]; onToggle: (id: number) => void }) {
  const full = selected.length >= MAX_PICKS;
  return (
    <section className="card flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg uppercase tracking-wide">{title}</h2>
        <p className="text-sm text-muted">
          {hint} <span className="tabular">({selected.length}/{MAX_PICKS})</span>
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {ROLES.map((role: Role) => (
          <div key={role} className="flex min-w-0 flex-wrap content-start gap-1.5">
            <p className="flex w-full items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <RoleDot role={role} />
              {role}
            </p>
            {heroes
              .filter((h) => h.roles[0] === role)
              .map((h) => {
                const on = selected.includes(h.id);
                const elsewhere = other.includes(h.id);
                return (
                  <button
                    key={h.id}
                    type="button"
                    aria-pressed={on}
                    disabled={!on && full}
                    onClick={() => onToggle(h.id)}
                    title={elsewhere ? "Déjà dans l'autre liste : le choisir ici l'y retire" : undefined}
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-xs font-semibold transition-colors disabled:opacity-40",
                      on ? "border-accent bg-accent/15 text-fg" : "border-line bg-surface-2 text-fg-2 hover:border-muted",
                    )}
                  >
                    <HeroMark name={h.name} role={h.roles[0]} size="sm" />
                    {h.name}
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </section>
  );
}
