"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ROLES, type Role } from "@/lib/types";
import { HeroMark, ROLE_STYLES } from "@/components/ui";

export type DirectoryHero = {
  id: number;
  slug: string;
  name: string;
  roles: Role[];
  portrait_url?: string | null;
  hasGuide: boolean;
  difficulty: number;
  tags: string[];
  mine: "main" | "train" | null;
  isNew: boolean;
};

const DIFFICULTY = ["", "Accessible", "Intermédiaire", "Exigeant"];
const ROLE_BAR: Record<Role, string> = { Vanguard: "bg-van", Duelist: "bg-due", Strategist: "bg-str" };
const norm = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Annuaire des fiches de héros : filtre par rôle et recherche par nom ou par mot-clé. */
export function GuideDirectory({ heroes }: { heroes: DirectoryHero[] }) {
  const [role, setRole] = useState<Role | "all">("all");
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = norm(query.trim());
    return heroes.filter((h) => (role === "all" || h.roles.includes(role)) && (!q || norm(h.name).includes(q) || h.tags.some((t) => norm(t).includes(q))));
  }, [heroes, role, query]);
  const counts = useMemo(() => Object.fromEntries(ROLES.map((r) => [r, heroes.filter((h) => h.roles.includes(r)).length])) as Record<Role, number>, [heroes]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-lg bg-surface p-1" role="group" aria-label="Filtrer par rôle">
          {(["all", ...ROLES] as const).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => setRole(r)}
              className={clsx("rounded-md px-3 py-1.5 text-sm font-semibold transition-colors", role === r ? "bg-surface-3 text-fg" : "text-fg-2 hover:text-fg")}
            >
              {r === "all" ? "Tous" : r}
              <span className="ml-1.5 text-xs font-medium text-muted tabular">{r === "all" ? heroes.length : counts[r]}</span>
            </button>
          ))}
        </div>
        <label className="relative min-w-[200px] flex-1 sm:max-w-xs" htmlFor="guide-search">
          <span className="sr-only">Chercher un héros ou un mot-clé</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input id="guide-search" type="search" className="field pl-9" placeholder="Un héros, « dive », « anti-ult »…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      {list.length ? (
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((h) => {
            const shown = role !== "all" && h.roles.includes(role) ? role : h.roles[0];
            return (
              <li key={h.id}>
                <Link href={`/heros/${h.slug}`} className="lift relative flex h-full items-center gap-3 overflow-hidden rounded-xl border border-line bg-surface py-3 pl-4 pr-3">
                  <span className={clsx("absolute inset-y-0 left-0 w-1", ROLE_BAR[shown])} aria-hidden />
                  <HeroMark name={h.name} role={shown} size="lg" src={h.portrait_url} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2">
                      <span className="truncate font-semibold">{h.name}</span>
                      {h.isNew ? <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-ink">Nouveau</span> : null}
                      {h.mine ? <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">{h.mine === "main" ? "Main" : "À entraîner"}</span> : null}
                    </p>
                    <p className={clsx("text-xs font-medium", ROLE_STYLES[shown].text)}>
                      {h.roles.length > 2 ? `${h.roles.slice(0, -1).join(", ")} et ${h.roles[h.roles.length - 1]}` : h.roles.join(" et ")}
                      {h.difficulty ? <span className="font-normal text-muted">, {DIFFICULTY[h.difficulty].toLowerCase()}</span> : null}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted">{h.hasGuide ? h.tags.slice(0, 3).join(", ") || "Fiche disponible" : "Fiche à venir"}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-line px-4 py-8 text-center text-sm text-fg-2">
          Aucun héros ne correspond à « {query} ».{" "}
          <button type="button" className="font-semibold text-accent hover:underline" onClick={() => { setQuery(""); setRole("all"); }}>
            Tout afficher
          </button>
        </p>
      )}
    </div>
  );
}
