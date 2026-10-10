"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { saveFocusAreas } from "./actions";

const SUGGESTIONS = ["Positionnement", "Gestion des ults", "Mourir moins", "Communication", "Élargir mon champion pool", "Mental / tilt"];

export function FocusAreas({ initial }: { initial: string[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [draft, setDraft] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function persist(next: string[]) {
    const prev = items;
    setItems(next);
    setError(null);
    start(async () => {
      const res = await saveFocusAreas(next);
      if (!res.ok) {
        setItems(prev);
        setError(res.error ?? "Erreur.");
      } else router.refresh();
    });
  }

  function add(text: string) {
    const t = text.trim();
    if (!t || items.includes(t) || items.length >= 8) return;
    persist([...items, t]);
    setDraft("");
  }

  return (
    <section className="card flex flex-col gap-4">
      <div>
        <h2 className="text-lg uppercase tracking-wide">Ce que je veux améliorer</h2>
        <p className="text-sm text-muted">Tes axes de travail du moment, visibles par ton coach.</p>
      </div>
      {items.length ? (
        <ul className="flex flex-col gap-1.5">
          {items.map((it) => (
            <li key={it} className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm font-semibold">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              <span className="min-w-0 flex-1">{it}</span>
              <button type="button" disabled={pending} onClick={() => persist(items.filter((x) => x !== it))} className="rounded p-0.5 text-muted hover:text-fg" aria-label={`Retirer ${it}`}>
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Aucun axe pour l&apos;instant. Ajoute-en un ou pioche dans les suggestions.</p>
      )}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add(draft);
        }}
      >
        <label className="sr-only" htmlFor="focus-new">
          Nouvel axe d&apos;amélioration
        </label>
        <input id="focus-new" className="field" maxLength={120} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="ex. Garder mon ult pour les fights serrés" />
        <button type="submit" disabled={pending || !draft.trim() || items.length >= 8} className={buttonClass("default")} aria-label="Ajouter l'axe">
          <Plus className="size-4" />
        </button>
      </form>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.filter((s) => !items.includes(s)).map((s) => (
          <button key={s} type="button" disabled={pending || items.length >= 8} onClick={() => add(s)} className="rounded-full border border-dashed border-line px-2.5 py-1 text-xs font-semibold text-fg-2 hover:border-muted disabled:opacity-40">
            + {s}
          </button>
        ))}
      </div>
      {error ? <p className="text-sm text-bad">{error}</p> : null}
    </section>
  );
}
