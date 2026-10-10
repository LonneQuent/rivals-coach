"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { buttonClass } from "@/components/ui";
import { deleteMatch } from "../saisir/actions";

/** Suppression en deux clics : le premier arme le bouton pendant 4 secondes. */
export function DeleteMatchButton({ id, redirectTo, size = "sm" }: { id: string; redirectTo?: string; size?: "sm" | "md" }) {
  const router = useRouter();
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
      className={buttonClass("danger", size === "sm" ? "px-2 py-1 text-xs" : undefined)}
      onClick={() => {
        if (!armed) return setArmed(true);
        start(async () => {
          const res = await deleteMatch(id);
          setFailed(!res.ok);
          setArmed(false);
          if (res.ok && redirectTo) router.push(redirectTo);
        });
      }}
    >
      {pending ? "Suppression…" : failed ? "Échec, réessaie" : armed ? "Confirmer ?" : "Supprimer"}
    </button>
  );
}
