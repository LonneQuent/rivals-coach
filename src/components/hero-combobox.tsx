"use client";

import clsx from "clsx";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { ROLES, type Hero, type Role } from "@/lib/types";
import { HeroMark, RoleDot } from "@/components/ui";

export type HeroPick = { heroId: number; role: Role } | null;

type Option = { heroId: number; role: Role; name: string; multi: boolean; src: string | null };

const norm = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/**
 * Sélecteur de héros avec recherche : on tape plusieurs lettres (« luna », « strange »),
 * flèches haut/bas pour naviguer, Entrée pour valider, Échap pour fermer.
 * Un héros multi-rôle (Deadpool) apparaît une fois par rôle.
 */
export function HeroCombobox({
  id,
  heroes,
  value,
  onChange,
  disabledIds = [],
  label,
}: {
  id: string;
  heroes: Hero[];
  value: HeroPick;
  onChange: (v: HeroPick) => void;
  disabledIds?: number[];
  label: React.ReactNode;
}) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo<Option[]>(
    () =>
      ROLES.flatMap((role) =>
        heroes
          .filter((h) => h.roles.includes(role))
          .sort((a, b) => a.name.localeCompare(b.name, "fr"))
          .map((h) => ({ heroId: h.id, role, name: h.name, multi: h.roles.length > 1, src: h.portrait_url ?? null })),
      ),
    [heroes],
  );

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return options;
    const starts = options.filter((o) => norm(o.name).startsWith(q) || norm(o.name.replace(/^The /, "")).startsWith(q));
    const contains = options.filter((o) => !starts.includes(o) && (norm(o.name).includes(q) || norm(o.role).startsWith(q)));
    return [...starts, ...contains];
  }, [options, query]);

  const selected = value ? options.find((o) => o.heroId === value.heroId && o.role === value.role) : undefined;

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${listId}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function choose(o: Option) {
    if (disabledIds.includes(o.heroId) && o.heroId !== value?.heroId) return;
    onChange({ heroId: o.heroId, role: o.role });
    close();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      if (open && filtered[active]) {
        e.preventDefault();
        choose(filtered[active]);
      }
    } else if (e.key === "Escape") {
      close();
    }
  }

  return (
    <div ref={rootRef} className="relative flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-[13px] font-medium text-fg-2">
        {label}
      </label>
      <div className={clsx("field flex items-center gap-2 py-1.5", open && "border-accent")}>
        {selected && !open ? <HeroMark name={selected.name} role={selected.role} size="sm" src={selected.src} /> : <Search className="size-4 shrink-0 text-muted" aria-hidden />}
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] ? `${listId}-opt-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent py-0.5 outline-none placeholder:text-muted"
          placeholder={selected ? "" : "Tape le nom du héros…"}
          value={open ? query : selected ? `${selected.name}${selected.multi ? ` · ${selected.role}` : ""}` : ""}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
        {selected && !open ? (
          <button
            type="button"
            className="rounded p-0.5 text-muted hover:text-fg"
            aria-label="Effacer le héros"
            onClick={() => {
              onChange(null);
              inputRef.current?.focus();
            }}
          >
            <X className="size-4" />
          </button>
        ) : (
          <ChevronDown className="size-4 shrink-0 text-muted" aria-hidden />
        )}
      </div>
      {open ? (
        <ul id={listId} role="listbox" className="absolute top-full z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-line bg-surface-2 p-1 shadow-xl shadow-black/50">
          {filtered.length === 0 ? <li className="px-3 py-2 text-sm text-muted">Aucun héros ne correspond à « {query} ».</li> : null}
          {filtered.map((o, i) => {
            const taken = disabledIds.includes(o.heroId) && o.heroId !== value?.heroId;
            return (
              <li
                key={`${o.heroId}-${o.role}`}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                aria-disabled={taken}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(o);
                }}
                className={clsx(
                  "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm",
                  i === active && "bg-surface-3",
                  taken && "cursor-not-allowed opacity-40",
                )}
              >
                <HeroMark name={o.name} role={o.role} size="sm" src={o.src} />
                <span className="min-w-0 flex-1 truncate font-semibold">{o.name}</span>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <RoleDot role={o.role} />
                  {o.role}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
