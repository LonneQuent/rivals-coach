import type { Metadata } from "next";
import Link from "next/link";
import { getRefs, requireSession } from "@/lib/data";
import { getEntryContext, MATCH_INPUT_COLS, toMatchInput } from "@/lib/matches";
import type { MatchInput } from "@/lib/types";
import { EmptyState, PageHeader } from "@/components/ui";
import { EntryWizard } from "@/components/quick-entry/wizard";
import { MatchForm } from "./match-form";

export const metadata: Metadata = { title: "Saisir une partie" };

export default async function SaisirPage({ searchParams }: { searchParams: Promise<{ edit?: string; mode?: string }> }) {
  const { edit, mode } = await searchParams;
  const { supabase, user } = await requireSession();
  const [refs, ctx] = await Promise.all([getRefs(), getEntryContext(supabase, user.id)]);

  if (!refs.heroes.length) {
    return <EmptyState title="Le référentiel est vide" body="Exécute la migration 0002_seed.sql dans Supabase, ou ajoute des héros depuis l'onglet Admin." />;
  }

  let editing: MatchInput | null = null;
  if (edit) {
    const { data } = await supabase.from("matches").select(MATCH_INPUT_COLS).eq("id", edit).eq("user_id", user.id).maybeSingle();
    if (data) editing = toMatchInput(data);
  }

  // Modification d'une partie, ou formulaire complet demandé : tout sur un écran
  if (editing || mode === "complet") {
    return (
      <>
        <PageHeader
          title={editing ? "Modifier la partie" : "Nouvelle partie"}
          subtitle={editing ? "Corrige les valeurs puis enregistre." : "Formulaire complet. Seuls le héros et le résultat sont obligatoires."}
          action={
            editing ? null : (
              <Link href="/saisir" className="text-sm font-semibold text-accent hover:underline">
                Revenir à la saisie rapide
              </Link>
            )
          }
        />
        <MatchForm key={editing?.id ?? "new"} refs={refs} editing={editing} last={ctx.last} />
      </>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <EntryWizard data={{ refs, ...ctx }} />
      <p className="text-center text-xs text-muted">
        Astuce : appuie sur <kbd className="rounded border border-line px-1">N</kbd> depuis n&apos;importe quelle page pour saisir une partie.{" "}
        <Link href="/saisir?mode=complet" className="font-semibold text-accent hover:underline">
          Formulaire complet
        </Link>
      </p>
    </div>
  );
}
