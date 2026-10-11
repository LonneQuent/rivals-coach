"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/** Sommaire collant : surligne la section en cours de lecture. Barre de chips défilante sur mobile. */
export function GuideToc({ items, accent }: { items: TocItem[]; accent: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [items]);

  return (
    <>
      {/* Mobile : chips défilantes collées en haut */}
      <nav aria-label="Sommaire" className="sticky top-14 z-10 -mx-4 overflow-x-auto border-b border-line bg-bg/95 px-4 py-2 backdrop-blur lg:hidden">
        <ul className="flex gap-1.5">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className={clsx("block whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors", active === i.id ? "text-fg" : "border-line text-fg-2")}
                style={active === i.id ? { borderColor: accent, background: `color-mix(in srgb, ${accent} 15%, transparent)` } : undefined}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bureau : bandeau latéral */}
      <nav aria-label="Sommaire" className="sticky top-6 hidden max-h-[calc(100dvh-3rem)] overflow-y-auto lg:block">
        <p className="eyebrow mb-3">Sommaire</p>
        <ul className="flex flex-col border-l border-line">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? "true" : undefined}
                className={clsx("-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors", active === i.id ? "font-semibold text-fg" : "border-transparent text-muted hover:text-fg")}
                style={active === i.id ? { borderColor: accent } : undefined}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/** Fine barre de progression de lecture, fixée en haut de l'écran. */
export function ReadingProgress({ accent }: { accent: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-40 h-0.5 pt-[env(safe-area-inset-top,0px)]">
      <div className="h-full origin-left transition-transform duration-100" style={{ background: accent, transform: `scaleX(${p})` }} />
    </div>
  );
}
