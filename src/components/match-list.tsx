import Link from "next/link";
import { Pencil } from "lucide-react";
import { mapShortName } from "@/lib/maps";
import type { Role } from "@/lib/types";
import { HeroMark, ResultPill, buttonClass } from "@/components/ui";
import { DeleteMatchButton } from "@/app/(app)/historique/delete-button";

export type MatchListRow = {
  id: string;
  played_at: string;
  result: "win" | "loss";
  duration_min: number | null;
  award: "MVP" | "SVP" | null;
  queue: { name: string } | null;
  map: { name: string } | null;
  rank: { name: string } | null;
  match_heroes: {
    position: number;
    role: Role;
    kills: number | null;
    deaths: number | null;
    assists: number | null;
    damage: number | null;
    healing: number | null;
    damage_blocked: number | null;
    hero: { name: string; portrait_url?: string | null } | null;
  }[];
};

type StatKey = "kills" | "deaths" | "assists" | "damage" | "healing" | "damage_blocked";
const sum = (rows: MatchListRow["match_heroes"], k: StatKey) => (rows.some((r) => r[k] !== null) ? rows.reduce((s, r) => s + (r[k] ?? 0), 0) : null);
const fmt = (v: number | null) => (v === null ? "–" : v.toLocaleString("fr-FR"));
/** 12 345 → « 12,3 k » : les gros chiffres restent lisibles sur une ligne. */
const short = (v: number | null) => (v === null ? "–" : v >= 10_000 ? `${(v / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} k` : v.toLocaleString("fr-FR"));


/** Liste de l'historique : une ligne par partie, sans défilement horizontal (noms tronqués, carte en nom court). */
export function MatchList({ rows }: { rows: MatchListRow[] }) {
  return (
    <ul className="card divide-y divide-line p-0 sm:p-0">
      {rows.map((m) => {
        const heroes = [...m.match_heroes].sort((a, b) => a.position - b.position);
        const main = heroes[0];
        const date = new Date(m.played_at);
        const healer = main?.role === "Strategist";
        const tank = main?.role === "Vanguard";
        const keyStat = healer ? { label: "soins", v: sum(heroes, "healing") } : tank ? { label: "bloqués", v: sum(heroes, "damage_blocked") } : { label: "dégâts", v: sum(heroes, "damage") };
        const context = [m.map ? mapShortName(m.map.name) : null, m.rank?.name, m.queue?.name].filter(Boolean).join(" · ");
        return (
          <li key={m.id} className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-3 py-2.5 transition-colors hover:bg-surface-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_7.5rem_auto] sm:px-4">
            {/* Toute la ligne mène au détail ; les boutons restent cliquables au-dessus */}
            <Link href={`/historique/${m.id}`} className="absolute inset-0 rounded-none focus-visible:outline-2 focus-visible:outline-accent" aria-label={`Partie du ${date.toLocaleDateString("fr-FR")} : ${m.result === "win" ? "victoire" : "défaite"}`} />

            <p className="hidden text-xs leading-tight text-fg-2 sm:block">
              <span className="block font-semibold text-fg">{date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
              {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>

            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex shrink-0 -space-x-2">
                {heroes.slice(0, 3).map((h, i) => (
                  <HeroMark key={i} name={h.hero?.name ?? "?"} role={h.role} size="md" src={h.hero?.portrait_url} />
                ))}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {heroes.map((h) => h.hero?.name ?? "?").join(", ")}
                </p>
                <p className="truncate text-xs text-muted">
                  <span className="sm:hidden">{date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · </span>
                  {context || "Carte non renseignée"}
                </p>
              </div>
            </div>

            <div className="tabular hidden text-right text-sm sm:block">
              <p className="font-semibold">
                {fmt(sum(heroes, "kills"))} / {fmt(sum(heroes, "deaths"))} / {fmt(sum(heroes, "assists"))}
              </p>
              <p className="text-xs text-muted">
                {short(keyStat.v)} {keyStat.label}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="flex items-center gap-1">
                {m.award ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">{m.award}</span> : null}
                <ResultPill result={m.result} />
              </span>
              <span className="tabular text-xs text-muted sm:hidden">
                {fmt(sum(heroes, "kills"))}/{fmt(sum(heroes, "deaths"))}/{fmt(sum(heroes, "assists"))}
              </span>
              <span className="relative z-10 hidden items-center gap-1 sm:flex">
                <Link href={`/saisir?edit=${m.id}`} className={buttonClass("ghost", "px-2 py-1")} aria-label="Modifier la partie" title="Modifier">
                  <Pencil className="size-4" />
                </Link>
                <DeleteMatchButton id={m.id} />
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
