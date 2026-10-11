import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/data";
import type { Role } from "@/lib/types";
import { EmptyState, PageHeader, RoleBadge } from "@/components/ui";
import { ClickableRow } from "@/components/clickable-row";

export const metadata: Metadata = { title: "Équipe" };

type Player = { id: string; pseudo: string | null; avatar_url: string | null; main_role: Role | null };
type M = { user_id: string; played_at: string; result: "win" | "loss" };

const DAY = 864e5;

export default async function TeamPage() {
  const { supabase, user, isCoach } = await requireSession();
  if (!isCoach) return <EmptyState title="Réservé aux coachs" body="Cette page liste les joueurs qui t'ont autorisé à les coacher." />;

  const { data: links } = await supabase.from("coach_links").select("player_id").eq("coach_id", user.id);
  const ids = ((links ?? []) as { player_id: string }[]).map((l) => l.player_id);
  if (!ids.length) {
    return (
      <>
        <PageHeader title="Équipe" />
        <EmptyState
          title="Aucun joueur pour l'instant"
          body="Tes joueurs doivent t'autoriser depuis leur profil (section « Mon coach »). Envoie-leur le lien de l'app : ils apparaîtront ici dès qu'ils l'auront fait."
        />
      </>
    );
  }

  const since = new Date(Date.now() - 30 * DAY).toISOString();
  const [{ data: players }, { data: matches }] = await Promise.all([
    supabase.from("profiles").select("id, pseudo, avatar_url, main_role").in("id", ids),
    supabase.from("matches").select("user_id, played_at, result").in("user_id", ids).gte("played_at", since).order("played_at", { ascending: false }).limit(2000),
  ]);
  const byPlayer = new Map<string, M[]>();
  for (const m of (matches ?? []) as M[]) byPlayer.set(m.user_id, [...(byPlayer.get(m.user_id) ?? []), m]);

  const rows = ((players ?? []) as Player[])
    .map((p) => {
      const list = byPlayer.get(p.id) ?? [];
      const week = list.filter((m) => Date.parse(m.played_at) > Date.now() - 7 * DAY).length;
      const wins = list.filter((m) => m.result === "win").length;
      let streak = 0;
      for (const m of list) {
        if (m.result !== "loss") break;
        streak++;
      }
      const last = list[0]?.played_at ?? null;
      const alerts: string[] = [];
      if (streak >= 3) alerts.push(`${streak} défaites d'affilée`);
      if (!last || Date.parse(last) < Date.now() - 7 * DAY) alerts.push("Inactif depuis 7 jours");
      return { ...p, games: list.length, week, winrate: list.length ? wins / list.length : null, last, alerts };
    })
    .sort((a, b) => b.alerts.length - a.alerts.length || (b.last ?? "").localeCompare(a.last ?? ""));

  return (
    <>
      <PageHeader title="Équipe" subtitle={`${rows.length} joueur${rows.length > 1 ? "s" : ""} te ${rows.length > 1 ? "font" : "fait"} confiance. Clique sur une ligne pour ouvrir sa fiche.`} />
      <div className="card overflow-x-auto p-0 sm:p-0">
        <table className="tabular w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {["Joueur", "Rôle", "Parties (7 j)", "Winrate (30 j)", "Dernière partie", "À surveiller"].map((h, i) => (
                <th key={h} className={`eyebrow px-3 py-2.5 font-semibold ${i === 2 || i === 3 ? "text-right" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <ClickableRow key={r.id} href={`/equipe/${r.id}`} label={`Ouvrir la fiche de ${r.pseudo ?? "ce joueur"}`} className="border-b border-line transition-colors last:border-0 hover:bg-surface-3">
                <td className="px-3 py-2.5">
                  <Link href={`/equipe/${r.id}`} className="flex items-center gap-3 font-semibold hover:text-accent">
                    {r.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.avatar_url} alt="" className="size-8 rounded-full" />
                    ) : (
                      <span className="grid size-8 place-items-center rounded-full bg-surface-3 text-xs font-bold">{(r.pseudo ?? "?").slice(0, 2).toUpperCase()}</span>
                    )}
                    {r.pseudo ?? "Sans pseudo"}
                  </Link>
                </td>
                <td className="px-3 py-2.5">{r.main_role ? <RoleBadge role={r.main_role} /> : <span className="text-muted">–</span>}</td>
                <td className="px-3 py-2.5 text-right">{r.week}</td>
                <td className="px-3 py-2.5 text-right">{r.winrate === null ? "–" : `${Math.round(r.winrate * 100)} %`}</td>
                <td className="px-3 py-2.5 text-fg-2">{r.last ? new Date(r.last).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "–"}</td>
                <td className="px-3 py-2.5">
                  {r.alerts.length ? (
                    <div className="flex flex-wrap gap-1">
                      {r.alerts.map((a) => (
                        <span key={a} className="rounded-full bg-bad-bg px-2 py-0.5 text-xs font-semibold text-bad">
                          ⚠ {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="rounded-full bg-good-bg px-2 py-0.5 text-xs font-semibold text-good">✓ RAS</span>
                  )}
                </td>
              </ClickableRow>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
