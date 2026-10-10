"use client";

import { useRouter } from "next/navigation";

/** Ligne de tableau cliquable (souris et clavier) qui ignore les clics sur ses propres liens et boutons. */
export function ClickableRow({ href, label, className, children }: { href: string; label: string; className?: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <tr
      tabIndex={0}
      aria-label={label}
      className={`cursor-pointer ${className ?? ""}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a, button")) return;
        router.push(href);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) router.push(href);
      }}
    >
      {children}
    </tr>
  );
}
