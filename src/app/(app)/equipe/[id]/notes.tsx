"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { addNote, deleteNote } from "../actions";

export type NoteView = { id: string; body: string; created_at: string };

/** Notes du coach pour ce joueur : il les voit dans son profil. */
export function CoachNotes({ playerId, notes }: { playerId: string; notes: NoteView[] }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="card flex flex-col gap-4">
      <div>
        <h2 className="text-lg uppercase tracking-wide">Mes notes</h2>
        <p className="text-sm text-muted">Le joueur les voit en haut de son profil.</p>
      </div>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          start(async () => {
            const res = await addNote(playerId, text);
            if (!res.ok) return setError(res.error ?? "Erreur.");
            setText("");
            router.refresh();
          });
        }}
      >
        <label className="sr-only" htmlFor="note-body">
          Nouvelle note
        </label>
        <textarea id="note-body" className="field min-h-24" maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} placeholder="ex. Super progrès sur ta survie. Cette semaine : garde 2 bulles pour fuir." />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={pending || !text.trim()} className={buttonClass("primary")}>
            {pending ? "Envoi…" : "Publier la note"}
          </button>
          {error ? <p className="text-sm text-bad">{error}</p> : null}
        </div>
      </form>
      {notes.length ? (
        <ul className="flex flex-col gap-2">
          {notes.map((n) => (
            <li key={n.id} className="flex gap-3 rounded-lg border-l-2 border-van bg-surface-2 px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="whitespace-pre-wrap text-sm">{n.body}</p>
                <p className="mt-1 text-xs text-muted">{new Date(n.created_at).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => start(async () => { await deleteNote(n.id, playerId); router.refresh(); })}
                className={buttonClass("ghost", "self-start px-2")}
                aria-label="Supprimer la note"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
