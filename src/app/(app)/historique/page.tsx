import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/data";
import type { Role } from "@/lib/types";
import { EmptyState, PageHeader, ResultPill, RoleDot, buttonClass } from "@/components/ui";
import { ClickableRow } from "@/components/clickable-row";
import { DeleteMatchButton } from "./delete-button";

export const metadata: Metadata = { title: "Historique" };

type Row = {
  id: string;
  played_at: string;
  result: "win" | "loss";
  duration_min: number | null;
  feeling: number | null;
  award: "MVP" | "SVP" | null;
  queue: { name: string } | null;
  map: { name: string } | null;
  rank: { name: string } | null;
  match_heroes: { position: number; role: Role; kills: number | null; deaths: number | null; assists: number | null; damage: number | null; healing: number | null; damage_blocked: number | null; hero: { name: string } | null }[];
};

const fmt = (v: number | null) => (v === null ? "–" : v.toLocaleString("fr-FR"));
const sum = (rows: Row["match_heroes"], k: "kills" | "deaths" | "assists" | "damage" | "healing" | "damage_blocked") =>
  rows.some((r) => r[k] !== null) ? rows.reduce((s, r) => s + (r[k] ?? 0), 0) : null;

export default async function HistoriquePage() {
  const { supabase, user } = await requireSession();
  const { data } = await supabase
    .from("matches")
    .select(
      "id, played_at, result, duration_min, feeling, award, queue:queues(name), map:maps(name), rank:ranks(name), match_heroes(position, role, kills, deaths, assists, damage, healing, damage_blocked, hero:heroes(name))",
    )
    .eq("user_id", user.id)
    .order("played_at", { ascending: false })
    .limit(200);
  const rows = (data ?? []) as unknown as Row[];

  return (
    <>
      <PageHeader
        title="Historique"
        subtitle={rows.length ? `${rows.length} partie${rows.length > 1 ? "s" : ""}, la plus récente en haut. Clique sur une ligne pour voir le détail.` : undefined}
        action={
          <Link href="/saisir" className={buttonClass("primary")}>
            Saisir une partie
          </Link>
        }
      />
      {rows.length === 0 ? (
        <EmptyState title="Aucune partie enregistrée" body="Tes parties apparaîtront ici dès ta première saisie." href="/saisir" cta="Saisir une partie" />
      ) : (
        <div className="card overflow-x-auto p-0 sm:p-0">
          <table className="tabular w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                {["Date", "Héros", "Résultat", "Carte", "File", "Rang", "E / M / A", "Dégâts", "Soins", "Bloqués", ""].map((h, i) => (
                  <th key={h || i} className={`eyebrow px-3 py-2.5 font-semibold ${i >= 6 && i <= 9 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const heroes = [...m.match_heroes].sort((a, b) => a.position - b.position);
                return (
                  <ClickableRow
                    key={m.id}
                    href={`/historique/${m.id}`}
                    label={`Voir le détail de la partie du ${new Date(m.played_at).toLocaleDateString("fr-FR")}`}
                    className="border-b border-line last:border-0 hover:bg-surface-2"
                  >
                    <td className="whitespace-nowrap px-3 py-2.5 text-fg-2">
                      {new Date(m.played_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col gap-0.5">
                        {heroes.map((h, i) => (
                          <span key={i} className="flex items-center gap-2 whitespace-nowrap font-semibold">
                            <RoleDot role={h.role} />
                            {h.hero?.name ?? "?"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className="flex items-center gap-1.5">
                        <ResultPill result={m.result} />
                        {m.award ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">{m.award}</span> : null}
                      </span>
                    </td>
                    <td className="max-w-48 truncate px-3 py-2.5 text-fg-2">{m.map?.name ?? "–"}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-fg-2">{m.queue?.name ?? "–"}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-fg-2">{m.rank?.name ?? "–"}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      {fmt(sum(heroes, "kills"))} / {fmt(sum(heroes, "deaths"))} / {fmt(sum(heroes, "assists"))}
                    </td>
                    <td className="px-3 py-2.5 text-right">{fmt(sum(heroes, "damage"))}</td>
                    <td className="px-3 py-2.5 text-right">{fmt(sum(heroes, "healing"))}</td>
                    <td className="px-3 py-2.5 text-right">{fmt(sum(heroes, "damage_blocked"))}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      <Link href={`/saisir?edit=${m.id}`} className={buttonClass("ghost", "px-2 py-1 text-xs")}>
                        Modifier
                      </Link>
                      <DeleteMatchButton id={m.id} />
                    </td>
                  </ClickableRow>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
