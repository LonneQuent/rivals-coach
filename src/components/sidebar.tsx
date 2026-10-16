"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChartColumn,
  GraduationCap,
  History,
  House,
  LogOut,
  MessageCircleQuestion,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Settings,
  Swords,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

type Item = { href: string; label: string; icon: LucideIcon; admin?: boolean; coach?: boolean; accent?: boolean };

const ITEMS: Item[] = [
  { href: "/", label: "Accueil", icon: House },
  { href: "/profil", label: "Mon profil", icon: UserRound },
  { href: "/saisir", label: "Saisir une partie", icon: PlusCircle, accent: true },
  { href: "/historique", label: "Historique", icon: History },
  { href: "/stats", label: "Stats", icon: ChartColumn },
  { href: "/compos", label: "Compos", icon: Swords },
  { href: "/quiz", label: "Quiz", icon: GraduationCap },
  { href: "/questions", label: "Questions", icon: MessageCircleQuestion },
  { href: "/equipe", label: "Équipe", icon: Users, coach: true },
  { href: "/admin", label: "Admin", icon: Settings, admin: true },
];

const MOBILE: string[] = ["/", "/stats", "/saisir", "/historique", "/profil"];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" || path.startsWith("/heros") : path.startsWith(href);
}

export function Sidebar({ initialCollapsed, isAdmin, isCoach, pseudo, avatarUrl }: { initialCollapsed: boolean; isAdmin: boolean; isCoach: boolean; pseudo: string; avatarUrl: string | null }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const items = ITEMS.filter((i) => (!i.admin || isAdmin) && (!i.coach || isCoach));

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `sidebar=${next ? "collapsed" : "open"}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <>
      {/* Barre latérale (écrans larges) */}
      <aside
        className={clsx(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 md:flex",
          collapsed ? "w-[68px]" : "w-60",
        )}
      >
        <div className={clsx("flex h-16 items-center border-b border-line px-4", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed ? (
            <Link href="/" className="font-display text-xl font-bold uppercase tracking-wider">
              Rivals <span className="text-accent">Coach</span>
            </Link>
          ) : null}
          <button type="button" onClick={toggle} className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-fg" aria-label={collapsed ? "Déplier le menu" : "Replier le menu"} aria-expanded={!collapsed}>
            {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navigation principale">
          {items.map((item) => {
            const active = isActive(path, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                  collapsed && "justify-center px-0",
                  active ? "bg-surface-3 text-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg",
                  item.accent && !active && "text-accent",
                )}
              >
                {active ? <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" aria-hidden /> : null}
                <Icon className="size-5 shrink-0" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className={clsx("flex items-center gap-3 border-t border-line p-3", collapsed && "flex-col")}>
          <Avatar url={avatarUrl} pseudo={pseudo} />
          {!collapsed ? <span className="min-w-0 flex-1 truncate text-sm font-semibold">{pseudo}</span> : null}
          <form action="/auth/signout" method="post">
            <button type="submit" className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-fg" aria-label="Se déconnecter" title="Se déconnecter">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* Barre d'onglets (mobile) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur md:hidden"
        aria-label="Navigation principale"
      >
        {MOBILE.map((href) => {
          const item = ITEMS.find((i) => i.href === href)!;
          const active = isActive(path, href);
          const Icon = item.icon;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={clsx("flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold", active ? "text-fg" : "text-muted", item.accent && "text-accent")}
            >
              <Icon className={clsx("size-5", item.accent && "size-6")} />
              {item.accent ? "Saisir" : item.label.replace("Mon ", "")}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function Avatar({ url, pseudo }: { url: string | null; pseudo: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="size-8 shrink-0 rounded-full" />;
  }
  return <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-3 text-xs font-bold">{pseudo.slice(0, 2).toUpperCase()}</span>;
}
