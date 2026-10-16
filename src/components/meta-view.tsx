import Link from "next/link";
import clsx from "clsx";
import { MIN_META_MATCHES, bracketLabel, pct, type BracketKey, type MetaRow, type MetaSnapshot } from "@/lib/meta";
import { ROLES, type Hero, type Role } from "@/lib/types";
import { EmptyState, HeroMark, RoleDot } from "@/components/ui";
import { MascotTip } from "@/components/mascot";

type Search = { vue?: string; rang?: string; role?: string };

/** Tier list d'une tranche de rang : winrate, pick, ban, nombre de parties. */
export function MetaView({ meta, bracket, heroes, role, href }: { meta: MetaSnapshot | null; bracket: BracketKey; heroes: Hero[]; role: Role | null; href: (p: Partial<Search>) => string }) {
  if (!meta) {
    return <EmptyState title="Pas de stats pour ce rang" body="Les stats communautaires arrivent avec la migration 0014 : demande à un admin de la passer dans Supabase." />;
  }
  const byId = new Map(heroes.map((h) => [h.id, h]));
  const rowRole = (r: MetaRow) => r.variant ?? byId.get(r.hero_id)?.roles[0] ?? null;
  const rows = meta.rows.filter((r) => byId.has(r.hero_id) && (!role || rowRole(r) === role)).sort((a, b) => b.win_rate - a.win_rate);
  const solid = rows.filter((r) => r.matches >= MIN_META_MATCHES);
  const topPick = [...rows].sort((a, b) => b.pick_rate - a.pick_rate)[0];
  const topBan = [...rows].filter((r) => r.ban_rate !== null).sort((a, b) => (b.ban_rate ?? 0) - (a.ban_rate ?? 0))[0];
  const name = (r: MetaRow) => `${byId.get(r.hero_id)?.name ?? "?"}${r.variant ? ` (${r.variant})` : ""}`;

  return (
    <>
      <MascotTip title={`La méta en ${bracketLabel(bracket)}`} pose="think" className="max-w-3xl">
        <p>
          {solid[0] ? (
            <>
              Meilleur winrate : <strong className="text-fg">{name(solid[0])}</strong> ({pct(solid[0].win_rate)}).{" "}
            </>
          ) : null}
          {topPick ? (
            <>
              Le plus joué : <strong className="text-fg">{name(topPick)}</strong> ({pct(topPick.pick_rate)} des parties).{" "}
            </>
          ) : null}
          {topBan?.ban_rate ? (
            <>
              Le plus banni : <strong className="text-fg">{name(topBan)}</strong> ({pct(topBan.ban_rate)}).
            </>
          ) : null}
        </p>
        <p className="mt-1">Un winrate élevé avec peu de picks veut souvent dire « héros de spécialistes » : ceux qui le jouent le maîtrisent.</p>
      </MascotTip>

      <div className="flex flex-wrap gap-1.5" aria-label="Filtrer par rôle">
        {[null, ...ROLES].map((r) => (
          <Link
            key={r ?? "all"}
            href={href({ role: r ?? "" })}
            className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", role === r ? "border-accent bg-accent/15 text-fg" : "border-line text-fg-2 hover:border-accent/60")}
          >
            {r ? <RoleDot role={r} /> : null}
            {r ?? "Tous les rôles"}
          </Link>
        ))}
      </div>

      <section className="card p-0 sm:p-0">
        <div className="grid grid-cols-[2rem_minmax(0,1fr)_4.5rem_4rem] items-center gap-x-2 border-b border-line px-3 py-2 text-left sm:grid-cols-[2.5rem_minmax(0,1fr)_5rem_5rem_5rem_5rem] sm:px-4">
          {["Tier", "Héros", "Winrate", "Pick", "Ban", "Parties"].map((h, i) => (
            <span key={h} className={clsx("eyebrow", i >= 2 && "text-right", i >= 4 && "hidden sm:block")}>
              {h}
            </span>
          ))}
        </div>
        <ul className="divide-y divide-line">
          {rows.map((r) => {
            const h = byId.get(r.hero_id)!;
            const rr = rowRole(r) ?? h.roles[0];
            const weak = r.matches < MIN_META_MATCHES || r.tier === "Unrated";
            return (
              <li key={`${r.hero_id}|${r.variant ?? ""}`} className={clsx("grid grid-cols-[2rem_minmax(0,1fr)_4.5rem_4rem] items-center gap-x-2 px-3 py-2 sm:grid-cols-[2.5rem_minmax(0,1fr)_5rem_5rem_5rem_5rem] sm:px-4", weak && "opacity-60")}>
                <span className={clsx("font-display text-lg font-bold", TIER_CLASS[r.tier] ?? "text-muted")}>{r.tier === "Unrated" ? "–" : r.tier}</span>
                <Link href={`/heros/${h.slug}`} className="flex min-w-0 items-center gap-2 hover:text-accent">
                  <HeroMark name={h.name} role={rr} size="sm" src={h.portrait_url} />
                  <span className="truncate text-sm font-semibold">
                    {h.name}
                    {r.variant ? <span className="font-normal text-muted"> · {r.variant}</span> : null}
                  </span>
                </Link>
                <span className="tabular text-right text-sm font-semibold">{pct(r.win_rate)}</span>
                <span className="tabular text-right text-sm text-fg-2">{pct(r.pick_rate)}</span>
                <span className="tabular hidden text-right text-sm text-fg-2 sm:block">{pct(r.ban_rate)}</span>
                <span className="tabular hidden text-right text-xs text-muted sm:block">{r.matches.toLocaleString("fr-FR")}</span>
              </li>
            );
          })}
        </ul>
      </section>
      <p className="text-xs text-muted">
        Stats communautaires {meta.season}, relevées le {new Date(meta.captured_on).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        {meta.source ? ` (${meta.source})` : ""}. Les lignes grisées ont moins de {MIN_META_MATCHES} parties : leur winrate est peu fiable.
      </p>
    </>
  );
}

const TIER_CLASS: Record<string, string> = { S: "text-accent", A: "text-good", B: "text-fg", C: "text-fg-2", D: "text-bad" };
