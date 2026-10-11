"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { addComment, deleteComment } from "../../equipe/actions";

export type CommentView = { id: string; body: string; created_at: string; mine: boolean; author: string; isCoach: boolean };

/** Échange entre le joueur et son coach à propos d'une partie. */
export function MatchComments({ matchId, comments, placeholder }: { matchId: string; comments: CommentView[]; placeholder: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="card flex flex-col gap-4">
      <h2 className="text-lg uppercase tracking-wide">Commentaires</h2>
      {comments.length ? (
        <ul className="flex flex-col gap-2">
          {comments.map((c) => (
            <li key={c.id} className={`flex gap-3 rounded-lg border-l-2 bg-surface-2 px-3 py-2 ${c.isCoach ? "border-van" : "border-accent"}`}>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-fg-2">
                  {c.author}
                  {c.isCoach ? <span className="ml-1.5 rounded-full bg-van/15 px-1.5 py-0.5 text-[10px] text-van">coach</span> : null}
                  <span className="ml-2 font-normal text-muted">{new Date(c.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </p>
                <p className="mt-0.5 whitespace-pre-wrap text-sm">{c.body}</p>
              </div>
              {c.mine ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => start(async () => { await deleteComment(c.id, matchId); router.refresh(); })}
                  className={buttonClass("ghost", "self-start px-2")}
                  aria-label="Supprimer le commentaire"
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Aucun commentaire pour l&apos;instant.</p>
      )}
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          start(async () => {
            const res = await addComment(matchId, text);
            if (!res.ok) return setError(res.error ?? "Erreur.");
            setText("");
            router.refresh();
          });
        }}
      >
        <label className="sr-only" htmlFor="comment-body">
          Nouveau commentaire
        </label>
        <textarea id="comment-body" className="field min-h-20" maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={pending || !text.trim()} className={buttonClass("primary")}>
            {pending ? "Envoi…" : "Commenter"}
          </button>
          {error ? <p className="text-sm text-bad">{error}</p> : null}
        </div>
      </form>
    </section>
  );
}
