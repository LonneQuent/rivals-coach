import Link from "next/link";
import { ArrowUpRight, Brain, Map as MapIcon, Swords, UserRound } from "lucide-react";
import { roleSlug } from "@/lib/guides";
import { ROLES, type Role } from "@/lib/types";
import { GuideDirectory, type DirectoryHero } from "@/components/guide-directory";
import { RoleEmblem } from "@/components/illustrations";
import { PageHeader, ROLE_STYLES } from "@/components/ui";

const ROLE_PITCH: Record<Role, string> = {
  Vanguard: "Prendre l'espace, protéger, décider quand le fight commence.",
  Duelist: "Choisir sa cible, la finir, ressortir vivant.",
  Strategist: "Tenir son équipe en vie et gagner la bataille des ults.",
};

/** Page des guides : les trois rôles, les guides généraux, puis l'annuaire des héros. */
export function GuidesView({ heroes, roleGuides }: { heroes: DirectoryHero[]; roleGuides: string[] }) {
  const roleGuide = new Set(roleGuides);
  const count = heroes.filter((h) => h.hasGuide).length;
  return (
    <>
      <PageHeader title="Guides" subtitle={`${count} fiches de héros, les trois rôles, et de quoi lire une partie.`} />

      <section className="grid gap-3 md:grid-cols-3" aria-label="Guides de rôle">
        {ROLES.map((role) => (
          <Link key={role} href={`/guides/${roleSlug(role)}`} className="lift flex items-center gap-4 rounded-xl border border-line bg-surface p-4">
            <RoleEmblem role={role} className="size-14 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className={`font-display text-2xl font-bold leading-tight tracking-wide ${ROLE_STYLES[role].text}`}>Jouer {role}</p>
              <p className="mt-0.5 text-sm text-fg-2">{roleGuide.has(role) ? ROLE_PITCH[role] : "Guide à venir."}</p>
            </div>
          </Link>
        ))}
      </section>

      <section aria-label="Guides généraux">
        <ul className="grid divide-line overflow-hidden rounded-xl border border-line bg-surface sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {[
            { href: "/guides/game-sense", title: "Game sense", blurb: "Cooldowns, cycle d'ults, espace", Icon: Brain },
            { href: "/guides/solo-queue", title: "Solo queue", blurb: "Monter seul sans tilter", Icon: UserRound },
            { href: "/cartes", title: "Cartes", blurb: "Chokes, hauteurs et routes", Icon: MapIcon },
            { href: "/compos", title: "Compos d'équipe", blurb: "Jouer à six : qui fait quoi", Icon: Swords },
          ].map(({ href, title, blurb, Icon }) => (
            <li key={href} className="border-t border-line first:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0 lg:border-t-0">
              <Link href={href} className="group flex h-full items-center gap-3 px-4 py-3 hover:bg-surface-2">
                <Icon className="size-5 shrink-0 text-accent" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block truncate text-xs text-muted">{blurb}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted group-hover:text-accent" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="heroes">
        <h2 id="heroes" className="text-xl tracking-wide">
          Héros
        </h2>
        <GuideDirectory heroes={heroes} />
      </section>
    </>
  );
}
