import type { Metadata } from "next";
import { getRefs, requireSession } from "@/lib/data";
import type { MatchInput } from "@/lib/types";
import { EmptyState, PageHeader } from "@/components/ui";
import { MatchForm } from "./match-form";

export const metadata: Metadata = { title: "Saisir une partie" };

type Row = Omit<MatchInput, "tag_ids" | "heroes" | "award" | "note"> & {
  id: string;
  award: "MVP" | "SVP" | null;
  note: string | null;
  match_heroes: (MatchInput["heroes"][number] & { position: number })[];
  match_tags: { tag_id: number }[];
};

export default async function SaisirPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const { supabase, user } = await requireSession();
  const refs = await getRefs();

  if (!refs.heroes.length) {
    return <EmptyState title="Le référentiel est vide" body="Exécute la migration 0002_seed.sql dans Supabase, ou ajoute des héros depuis l'onglet Admin." />;
  }

  const cols =
    "id, played_at, queue_id, game_mode_id, map_id, rank_id, result, duration_min, feeling, award, note, match_heroes(position, hero_id, role, play_minutes, kills, deaths, assists, final_hits, damage, damage_blocked, healing, accuracy), match_tags(tag_id)";

  let editing: MatchInput | null = null;
  if (edit) {
    const { data } = await supabase.from("matches").select(cols).eq("id", edit).eq("user_id", user.id).maybeSingle();
    if (data) editing = toInput(data as unknown as Row);
  }
  const { data: lastData } = await supabase.from("matches").select(cols).eq("user_id", user.id).order("played_at", { ascending: false }).limit(1).maybeSingle();
  const last = lastData ? toInput(lastData as unknown as Row) : null;

  return (
    <>
      <PageHeader
        title={editing ? "Modifier la partie" : "Nouvelle partie"}
        subtitle={editing ? "Corrige les valeurs puis enregistre." : "Les champs reprennent ta dernière partie. Seuls le héros et le résultat sont obligatoires."}
      />
      <MatchForm key={editing?.id ?? "new"} refs={refs} editing={editing} last={last} />
    </>
  );
}

function toInput(r: Row): MatchInput {
  return {
    id: r.id,
    played_at: r.played_at,
    queue_id: r.queue_id,
    game_mode_id: r.game_mode_id,
    map_id: r.map_id,
    rank_id: r.rank_id,
    result: r.result,
    duration_min: r.duration_min === null ? null : Number(r.duration_min),
    feeling: r.feeling,
    award: r.award ?? "",
    note: r.note ?? "",
    tag_ids: r.match_tags.map((t) => t.tag_id),
    heroes: [...r.match_heroes]
      .sort((a, b) => a.position - b.position)
      .map(({ position: _p, ...h }) => ({
        ...h,
        play_minutes: h.play_minutes === null ? null : Number(h.play_minutes),
        accuracy: h.accuracy === null ? null : Number(h.accuracy),
      })),
  };
}
