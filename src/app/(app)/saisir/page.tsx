import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ImageUp } from "lucide-react";
import { getRefs, requireSession } from "@/lib/data";
import { getEnemyIds, getEntryContext, MATCH_INPUT_COLS, toMatchInput } from "@/lib/matches";
import type { MatchInput } from "@/lib/types";
import { EmptyState, PageHeader } from "@/components/ui";
import { EntryWizard } from "@/components/quick-entry/wizard";
import type { Fingerprint } from "@/lib/capture/match";
import type { CaptureMember } from "./capture-import";
import { MatchForm } from "./match-form";

// L'écran d'import n'est chargé que lorsqu'on l'ouvre : la saisie rapide reste légère
const CaptureLearn = dynamic(() => import("./capture-learn").then((m) => m.CaptureLearn), {
  loading: () => <div className="card h-48 animate-pulse" aria-hidden />,
});
const CaptureImport = dynamic(() => import("./capture-import").then((m) => m.CaptureImport), {
  loading: () => <p className="card text-sm text-muted">Chargement de l&apos;import…</p>,
});

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
    if (data) editing = { ...toMatchInput(data), enemy_ids: await getEnemyIds(supabase, edit) };
  }

  // Apprentissage des portraits : nommer d'un coup les héros d'anciennes captures, sans créer de partie
  if (mode === "portraits" && !editing) {
    const fpRes = await supabase.from("capture_fingerprints").select("kind, hero_id, fp").limit(5000);
    return (
      <>
        <PageHeader
          title="Apprendre les portraits"
          subtitle="Plus l'app connaît de portraits, moins tu as de héros à choisir à l'import. Ce que tu nommes ici sert à tout le groupe."
          action={
            <Link href="/saisir?mode=capture" className="text-sm font-semibold text-accent hover:underline">
              Importer une partie
            </Link>
          }
        />
        <CaptureLearn heroes={refs.heroes} fingerprints={(fpRes.data ?? []) as Fingerprint[]} ready={!fpRes.error} />
      </>
    );
  }

  // Import d'une capture d'écran du tableau des scores : la lecture se fait dans le navigateur
  if (mode === "capture" && !editing) {
    const [membersRes, fpRes, aliasRes, meRes] = await Promise.all([
      supabase.from("profiles").select("id, pseudo, ingame_name, accept_shared_imports").order("pseudo"),
      supabase.from("capture_fingerprints").select("kind, hero_id, fp").limit(5000),
      supabase.from("map_aliases").select("label, map_id"),
      supabase.from("profiles").select("rank_id").eq("id", user.id).maybeSingle(),
    ]);
    // Sans la migration 0017, ces lectures échouent : la page s'affiche quand même et le dit
    const ready = !membersRes.error && !fpRes.error && !aliasRes.error;
    const members: CaptureMember[] = ((membersRes.data ?? []) as { id: string; pseudo: string | null; ingame_name: string | null; accept_shared_imports: boolean }[]).map((m) => ({
      id: m.id,
      pseudo: m.pseudo,
      ingame_name: m.ingame_name,
      accepts: m.accept_shared_imports,
    }));
    if (!members.some((m) => m.id === user.id)) members.push({ id: user.id, pseudo: null, ingame_name: null, accepts: true });
    return (
      <>
        <PageHeader
          title="Importer une capture"
          subtitle="Dépose la capture du tableau des scores : la partie est lue, puis enregistrée pour toi et pour tes coéquipiers membres."
          action={
            <span className="flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/saisir?mode=portraits" className="text-sm font-semibold text-accent hover:underline">
                Apprendre les portraits
              </Link>
              <Link href="/saisir" className="text-sm font-semibold text-accent hover:underline">
                Saisie manuelle
              </Link>
            </span>
          }
        />
        <CaptureImport
          refs={refs}
          me={{ id: user.id, rankId: (meRes.data as { rank_id: number | null } | null)?.rank_id ?? ctx.last?.rank_id ?? null }}
          members={members}
          fingerprints={(fpRes.data ?? []) as Fingerprint[]}
          aliases={(aliasRes.data ?? []) as { label: string; map_id: number }[]}
          defaultQueueId={ctx.last?.queue_id ?? refs.queues[0]?.id ?? null}
          ready={ready}
        />
      </>
    );
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
      <Link href="/saisir?mode=capture" className="card lift flex items-center gap-3 py-3">
        <ImageUp className="size-6 shrink-0 text-accent" aria-hidden />
        <span className="min-w-0">
          <span className="block font-semibold">Importer une capture d&apos;écran</span>
          <span className="block text-sm text-muted">Le tableau des scores est lu automatiquement, pour toi et tes coéquipiers.</span>
        </span>
      </Link>
      <p className="text-center text-xs text-muted">
        Astuce : appuie sur <kbd className="rounded border border-line px-1">N</kbd> depuis n&apos;importe quelle page pour saisir une partie.{" "}
        <Link href="/saisir?mode=complet" className="font-semibold text-accent hover:underline">
          Formulaire complet
        </Link>
      </p>
    </div>
  );
}
