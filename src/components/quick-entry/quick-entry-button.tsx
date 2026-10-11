"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { loadEntryData, type EntryData } from "@/app/(app)/saisir/entry-actions";
import { EntryWizard } from "./wizard";

/**
 * Bouton flottant présent sur toutes les pages : ouvre l'assistant de saisie dans une fenêtre.
 * Raccourci clavier : N (hors champ de saisie).
 */
export function QuickEntryButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<EntryData | null>(null);
  const [failed, setFailed] = useState(false);
  const [session, setSession] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const hidden = pathname.startsWith("/saisir");

  async function openEntry() {
    setOpen(true);
    setFailed(false);
    setSession((s) => s + 1);
    try {
      setData(await loadEntryData());
    } catch {
      setFailed(true);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));
      if (open && e.key === "Escape") setOpen(false);
      else if (!open && !hidden && !typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        void openEntry();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Fenêtre ouverte : la page derrière ne défile plus
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (hidden && !open) return null;

  return (
    <>
      {!hidden ? (
        <button
          type="button"
          onClick={openEntry}
          className="fixed bottom-20 right-4 z-30 flex items-center gap-2 rounded-full bg-accent px-4 py-3 font-semibold text-accent-ink shadow-xl shadow-black/50 transition-transform hover:-translate-y-0.5 hover:brightness-110 md:bottom-6 md:right-6"
          aria-label="Saisir une partie (raccourci N)"
          title="Saisir une partie (N)"
        >
          <Plus className="size-5" />
          <span className="hidden sm:inline">Saisir une partie</span>
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Saisir une partie"
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-line bg-bg p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl outline-none sm:max-w-xl sm:rounded-2xl sm:p-6"
          >
            {data ? (
              <EntryWizard key={session} data={data} onClose={() => setOpen(false)} />
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <Mascot className="size-20" bob />
                <p className="text-sm text-fg-2">{failed ? "Impossible de charger tes héros. Vérifie ta connexion et réessaie." : "Le Prof sort son carnet…"}</p>
                {failed ? (
                  <button type="button" className="text-sm font-semibold text-accent" onClick={openEntry}>
                    Réessayer
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
