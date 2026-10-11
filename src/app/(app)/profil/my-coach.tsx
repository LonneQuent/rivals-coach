"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { UserCheck } from "lucide-react";
import { buttonClass } from "@/components/ui";
import { linkCoach, unlinkCoach } from "../equipe/actions";

export type CoachOption = { id: string; pseudo: string; avatarUrl: string | null; linked: boolean };

/** Le joueur choisit qui peut voir ses parties et le coacher. Rien n'est partagé sans son accord. */
export function MyCoach({ coaches }: { coaches: CoachOption[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(c: CoachOption) {
    setError(null);
    start(async () => {
      const res = c.linked ? await unlinkCoach(c.id) : await linkCoach(c.id);
      if (!res.ok) return setError(res.error ?? "Erreur.");
      router.refresh();
    });
  }

  return (
    <section className="card flex flex-col gap-4">
      <div>
        <h2 className="text-lg uppercase tracking-wide">Mon coach</h2>
        <p className="text-sm text-muted">
          Un coach autorisé voit tes parties, tes objectifs et tes axes de travail. Il peut te laisser des notes, des objectifs et son évaluation, mais ne modifie jamais tes parties.
        </p>
      </div>
      {coaches.length === 0 ? <p className="text-sm text-muted">Aucun coach disponible pour l&apos;instant.</p> : null}
      <ul className="flex flex-col gap-2">
        {coaches.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface-2 px-3 py-2">
            {c.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.avatarUrl} alt="" className="size-9 rounded-full" />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-surface-3 text-xs font-bold">{c.pseudo.slice(0, 2).toUpperCase()}</span>
            )}
            <span className="min-w-0 flex-1 font-semibold">{c.pseudo}</span>
            {c.linked ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-good-bg px-2.5 py-0.5 text-xs font-semibold text-good">
                <UserCheck className="size-3.5" /> Te coache
              </span>
            ) : null}
            <button type="button" disabled={pending} onClick={() => toggle(c)} className={buttonClass(c.linked ? "ghost" : "primary", "px-3 py-1.5 text-xs")}>
              {c.linked ? "Retirer l'accès" : "Autoriser"}
            </button>
          </li>
        ))}
      </ul>
      {error ? <p className="text-sm text-bad">{error}</p> : null}
    </section>
  );
}
