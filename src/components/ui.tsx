import clsx from "clsx";
import Link from "next/link";
import type { Role } from "@/lib/types";

export const ROLE_STYLES: Record<Role, { dot: string; text: string; ring: string; bg: string }> = {
  Vanguard: { dot: "bg-van", text: "text-van", ring: "ring-van/60", bg: "bg-van/15" },
  Duelist: { dot: "bg-due", text: "text-due", ring: "ring-due/60", bg: "bg-due/15" },
  Strategist: { dot: "bg-str", text: "text-str", ring: "ring-str/60", bg: "bg-str/15" },
};

export function RoleDot({ role, className }: { role: Role; className?: string }) {
  return <span aria-hidden className={clsx("inline-block size-2.5 shrink-0 rounded-full", ROLE_STYLES[role].dot, className)} />;
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold", ROLE_STYLES[role].bg, ROLE_STYLES[role].text)}>
      <RoleDot role={role} />
      {role}
    </span>
  );
}

/** Pastille avec les initiales du héros, aux couleurs de son rôle (pas d'illustrations officielles). */
export function HeroMark({ name, role, size = "md" }: { name: string; role: Role; size?: "sm" | "md" | "lg" }) {
  const initials = name
    .replace(/^The /, "")
    .split(/[\s-]+/)
    .filter((w) => /^[A-Z&]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      aria-hidden
      className={clsx(
        "inline-grid shrink-0 place-items-center rounded-lg font-display font-bold ring-1",
        ROLE_STYLES[role].bg,
        ROLE_STYLES[role].text,
        ROLE_STYLES[role].ring,
        size === "sm" && "size-7 text-xs",
        size === "md" && "size-10 text-sm",
        size === "lg" && "size-14 text-lg",
      )}
    >
      {initials}
    </span>
  );
}

export function ResultPill({ result }: { result: "win" | "loss" }) {
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", result === "win" ? "bg-good-bg text-good" : "bg-bad-bg text-bad")}>
      {result === "win" ? "Victoire" : "Défaite"}
    </span>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl uppercase tracking-wide sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, body, href, cta }: { title: string; body: string; href?: string; cta?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line px-6 py-10 text-center">
      <p className="font-display text-lg font-bold">{title}</p>
      <p className="max-w-md text-sm text-fg-2">{body}</p>
      {href && cta ? (
        <Link href={href} className={buttonClass("primary", "mt-2")}>
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

export function buttonClass(variant: "primary" | "default" | "ghost" | "danger" = "default", extra?: string) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-accent text-accent-ink hover:brightness-105",
    variant === "default" && "border border-line bg-surface-2 hover:border-muted",
    variant === "ghost" && "text-fg-2 hover:bg-surface-2 hover:text-fg",
    variant === "danger" && "text-bad hover:bg-bad-bg",
    extra,
  );
}

export function Soon({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card flex flex-col gap-3">
      <span className="eyebrow">Arrive au prochain lot</span>
      <p className="font-display text-xl font-bold">{title}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-fg-2">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
