"use client";

import { X } from "lucide-react";
import type { Hero } from "@/lib/types";
import { HeroMark } from "@/components/ui";
import { HeroCombobox } from "@/components/hero-combobox";

/**
 * Compo adverse : jusqu'à six héros, sans rôle (Deadpool compte une seule fois).
 * Sert à repérer contre qui tu gagnes ou perds le plus souvent.
 */
export function EnemyPicker({ id, heroes, value, onChange }: { id: string; heroes: Hero[]; value: number[]; onChange: (ids: number[]) => void }) {
  const byId = new Map(heroes.map((h) => [h.id, h]));
  return (
    <div className="flex flex-col gap-2">
      {value.length < 6 ? (
        <HeroCombobox
          id={id}
          heroes={heroes}
          label={<span>Compo adverse <span className="font-normal text-muted">(facultatif, {value.length}/6)</span></span>}
          value={null}
          onChange={(v) => v && !value.includes(v.heroId) && onChange([...value, v.heroId])}
          disabledIds={value}
        />
      ) : null}
      {value.length ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="Héros adverses choisis">
          {value.map((hid) => {
            const h = byId.get(hid);
            if (!h) return null;
            return (
              <li key={hid} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 py-1 pl-1 pr-1.5 text-sm">
                <HeroMark name={h.name} role={h.roles[0]} size="sm" src={h.portrait_url} />
                {h.name}
                <button type="button" onClick={() => onChange(value.filter((x) => x !== hid))} className="rounded-full p-0.5 text-muted hover:bg-surface-3 hover:text-fg" aria-label={`Retirer ${h.name}`}>
                  <X className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
