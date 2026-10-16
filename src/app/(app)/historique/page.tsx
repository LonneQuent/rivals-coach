import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/data";
import { EmptyState, PageHeader, buttonClass } from "@/components/ui";
import { MatchList, type MatchListRow } from "@/components/match-list";

export const metadata: Metadata = { title: "Historique" };

export default async function HistoriquePage() {
  const { supabase, user } = await requireSession();
  const cols = (portrait: boolean) =>
    `id, played_at, result, duration_min, award, queue:queues(name), map:maps(name), rank:ranks(name), match_heroes(position, role, kills, deaths, assists, damage, healing, damage_blocked, hero:heroes(name${portrait ? ", portrait_url" : ""}))`;
  let res = await supabase.from("matches").select(cols(true)).eq("user_id", user.id).order("played_at", { ascending: false }).limit(200);
  if (res.error) res = await supabase.from("matches").select(cols(false)).eq("user_id", user.id).order("played_at", { ascending: false }).limit(200);
  const rows = (res.data ?? []) as unknown as MatchListRow[];

  return (
    <>
      <PageHeader
        title="Historique"
        subtitle={rows.length ? `${rows.length} partie${rows.length > 1 ? "s" : ""}, la plus récente en haut. Clique sur une partie pour voir le détail.` : undefined}
        action={
          <Link href="/saisir" className={buttonClass("primary")}>
            Saisir une partie
          </Link>
        }
      />
      {rows.length === 0 ? (
        <EmptyState title="Aucune partie enregistrée" body="Tes parties apparaîtront ici dès ta première saisie." href="/saisir" cta="Saisir une partie" />
      ) : (
        <MatchList rows={rows} />
      )}
    </>
  );
}
