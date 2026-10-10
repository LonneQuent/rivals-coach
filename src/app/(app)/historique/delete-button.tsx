"use client";

import { useEffect, useState, useTransition } from "react";
import { buttonClass } from "@/components/ui";
import { deleteMatch } from "../saisir/actions";

/** Suppression en deux clics : le premier arme le bouton pendant 4 secondes. */
export function DeleteMatchButton({ id }: { id: string }) {
  const [armed, setArmed] = useState(false);
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      type="button"
      disabled={pending}
      className={buttonClass("danger", "px-2 py-1 text-xs")}
      onClick={() => {
        if (!armed) return setArmed(true);
        start(async () => {
          const res = await deleteMatch(id);
          setFailed(!res.ok);
          setArmed(false);
        });
      }}
    >
      {pending ? "Suppression…" : failed ? "Échec, réessaie" : armed ? "Confirmer ?" : "Supprimer"}
    </button>
  );
}
