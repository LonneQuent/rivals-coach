"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import type { Hero } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { HeroMark, buttonClass } from "@/components/ui";
import { saveRef } from "../actions";

const BUCKET = "hero-portraits";

type Kind = "portrait" | "icon" | "art" | "unknown";
type FileView = { name: string; url: string; size: number; createdAt: string; w?: number; h?: number; kind: Kind };

const KIND_LABEL: Record<Kind, string> = {
  portrait: "Portrait probable",
  icon: "Icône (utilisable dans les guides)",
  art: "Pas carré (skin, illustration ?)",
  unknown: "Analyse…",
};

/** Devine le type d'image d'après ses dimensions : un portrait d'avatar est carré et assez grand. */
function classify(w: number, h: number): Kind {
  const ratio = w / h;
  const square = ratio > 0.85 && ratio < 1.18;
  if (!square) return "art";
  if (Math.max(w, h) < 150) return "icon";
  return "portrait";
}

type Filter = "all" | "assigned" | "unassigned" | "suspect";

export function PortraitGallery({ heroes }: { heroes: Hero[] }) {
  const router = useRouter();
  const [files, setFiles] = useState<FileView[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("suspect");
  const [busy, setBusy] = useState(false);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Map<string, Hero>>(() => new Map());

  const sortedHeroes = useMemo(() => [...heroes].sort((a, b) => a.name.localeCompare(b.name, "fr")), [heroes]);
  useEffect(() => {
    setAssigned(new Map(heroes.filter((h) => h.portrait_url).map((h) => [h.portrait_url as string, h])));
  }, [heroes]);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from(BUCKET).list("", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      setLoadError("Impossible de lister les images : exécute la migration 0007 puis recharge la page.");
      return;
    }
    const list: FileView[] = (data ?? [])
      .filter((f) => f.name && !f.name.startsWith("."))
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
        size: (f.metadata as { size?: number } | null)?.size ?? 0,
        createdAt: f.created_at ?? "",
        kind: "unknown" as Kind,
      }));
    setFiles(list);
    // Mesure chaque image pour la classer
    list.forEach((f) => {
      const img = new Image();
      img.onload = () => setFiles((xs) => xs?.map((x) => (x.name === f.name ? { ...x, w: img.naturalWidth, h: img.naturalHeight, kind: classify(img.naturalWidth, img.naturalHeight) } : x)) ?? xs);
      img.src = f.url;
    });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setPortrait(hero: Hero, url: string | null) {
    const res = await saveRef("heroes", { id: hero.id, name: hero.name, slug: hero.slug, roles: hero.roles, active: hero.active, portrait_url: url });
    if (!res.ok) throw new Error(res.error);
  }

  async function assign(file: FileView, heroId: number | null) {
    setBusy(true);
    setMsg(null);
    try {
      const current = assigned.get(file.url);
      if (current && current.id !== heroId) await setPortrait(current, null);
      if (heroId) {
        const hero = heroes.find((h) => h.id === heroId);
        if (hero) await setPortrait(hero, file.url);
      }
      router.refresh();
      setMsg(heroId ? "Portrait assigné." : "Portrait retiré du héros.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur.");
    }
    setBusy(false);
  }

  async function remove(names: string[]) {
    setBusy(true);
    setMsg(null);
    try {
      for (const n of names) {
        const f = files?.find((x) => x.name === n);
        const hero = f ? assigned.get(f.url) : undefined;
        if (hero) await setPortrait(hero, null);
      }
      const supabase = createClient();
      const { error } = await supabase.storage.from(BUCKET).remove(names);
      if (error) throw new Error("Suppression refusée : vérifie que tu es admin.");
      setFiles((xs) => xs?.filter((x) => !names.includes(x.name)) ?? xs);
      setMsg(`${names.length} image${names.length > 1 ? "s" : ""} supprimée${names.length > 1 ? "s" : ""}.`);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Erreur.");
    }
    setBusy(false);
    setConfirmBulk(false);
  }

  if (loadError) return <p className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad">{loadError}</p>;
  if (!files) return <p className="text-sm text-muted">Chargement des images…</p>;

  const isAssigned = (f: FileView) => assigned.has(f.url);
  const suspects = files.filter((f) => !isAssigned(f) && f.kind === "art");
  const counts = {
    all: files.length,
    assigned: files.filter(isAssigned).length,
    unassigned: files.filter((f) => !isAssigned(f)).length,
    suspect: suspects.length,
  };
  const shown = files.filter((f) =>
    filter === "all" ? true : filter === "assigned" ? isAssigned(f) : filter === "unassigned" ? !isAssigned(f) : suspects.includes(f),
  );
  const heroesWithout = heroes.filter((h) => !h.portrait_url).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["suspect", "À écarter (skins, illustrations)"],
            ["unassigned", "Non assignées"],
            ["assigned", "Assignées"],
            ["all", "Toutes"],
          ] as [Filter, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            aria-pressed={filter === k}
            className={clsx("rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors", filter === k ? "border-accent bg-accent/15" : "border-line bg-surface-2 text-fg-2 hover:border-accent/60 hover:text-fg")}
          >
            {label} <span className="tabular text-muted">{counts[k]}</span>
          </button>
        ))}
        <span className="ml-auto text-sm text-muted">{heroesWithout} héros sans portrait</span>
      </div>

      {filter === "suspect" && suspects.length ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-3">
          <p className="text-sm text-fg-2">
            {suspects.length} image{suspects.length > 1 ? "s" : ""} non assignée{suspects.length > 1 ? "s" : ""} ne ressemble{suspects.length > 1 ? "nt" : ""} pas à un portrait. Vérifie les vignettes, puis supprime-les d&apos;un coup.
          </p>
          {confirmBulk ? (
            <div className="flex gap-2">
              <button type="button" disabled={busy} onClick={() => remove(suspects.map((s) => s.name))} className={buttonClass("primary")}>
                Oui, supprimer les {suspects.length}
              </button>
              <button type="button" onClick={() => setConfirmBulk(false)} className={buttonClass("ghost")}>
                Annuler
              </button>
            </div>
          ) : (
            <button type="button" disabled={busy} onClick={() => setConfirmBulk(true)} className={buttonClass("danger", "border border-bad/40")}>
              <Trash2 className="size-4" /> Supprimer ces {suspects.length} images
            </button>
          )}
        </div>
      ) : null}
      {msg ? <p role="status" className="text-sm text-fg-2">{msg}</p> : null}

      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-muted">Rien dans cette catégorie.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {shown.map((f) => {
            const hero = assigned.get(f.url);
            return (
              <li key={f.name} className={clsx("flex flex-col gap-2 rounded-xl border bg-surface p-2", hero ? "border-good/50" : f.kind === "portrait" ? "border-line" : "border-bad/40")}>
                <div className="relative grid aspect-square place-items-center overflow-hidden rounded-lg bg-surface-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                </div>
                <p className={clsx("text-xs font-semibold", f.kind === "portrait" ? "text-good" : f.kind === "icon" ? "text-accent" : f.kind === "unknown" ? "text-muted" : "text-bad")}>{KIND_LABEL[f.kind]}</p>
                <p className="tabular text-[11px] text-muted">
                  {f.w ? `${f.w}×${f.h} px` : "…"} · {Math.round(f.size / 1024)} Ko
                </p>
                <label className="sr-only" htmlFor={`as-${f.name}`}>
                  Héros associé
                </label>
                <select id={`as-${f.name}`} className="field py-1 text-xs" disabled={busy} value={hero?.id ?? ""} onChange={(e) => assign(f, e.target.value ? Number(e.target.value) : null)}>
                  <option value="">Aucun héros</option>
                  {sortedHeroes.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                      {h.portrait_url && h.portrait_url !== f.url ? " (a déjà un portrait)" : ""}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between gap-2">
                  {hero ? (
                    <span className="flex min-w-0 items-center gap-1.5 text-xs font-semibold">
                      <HeroMark name={hero.name} role={hero.roles[0]} size="sm" src={f.url} />
                      <span className="truncate">{hero.name}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted">Non assignée</span>
                  )}
                  <button type="button" disabled={busy} onClick={() => remove([f.name])} className={buttonClass("ghost", "px-1.5 py-1")} aria-label="Supprimer l'image">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
