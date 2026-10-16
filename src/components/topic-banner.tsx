import type { ReactNode } from "react";
import { Mascot } from "@/components/mascot";

/** Bannière neutre (cartes, guides généraux) : pas de couleur de rôle, le Prof à droite. */
export function TopicBanner({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-line"
      style={{ background: "linear-gradient(110deg, var(--color-surface) 40%, color-mix(in srgb, var(--color-accent) 14%, var(--color-surface)) 100%)" }}
    >
      <div className="relative flex flex-wrap items-center gap-5 p-5 sm:p-7">
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-accent">{eyebrow}</p>
          <h1 className="text-3xl uppercase tracking-wide sm:text-5xl">{title}</h1>
          {subtitle ? <div className="mt-2">{subtitle}</div> : null}
          {children ? <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div> : null}
        </div>
        <Mascot className="hidden size-28 sm:block" pose="point" />
      </div>
    </section>
  );
}
