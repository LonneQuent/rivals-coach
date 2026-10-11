"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import type { Hero } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { HeroMark, buttonClass } from "@/components/ui";
import { saveRef } from "./actions";

type Item = { file: File; preview: string; heroId: number | null; status: "ready" | "sending" | "done" | "error"; error?: string };

const norm = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");

// Mots fréquents dans les noms de fichiers d'avatars, ignorés pour l'association
const NOISE = /(avatar|icon|portrait|profile|hero|square|default|thumbnail|thumb|marvel|rivals|img|image|\d+)/g;

/** Associe un nom de fichier à un héros : « Luna_Snow_Avatar.png » → Luna Snow. */
function matchHero(filename: string, heroes: Hero[]): number | null {
  const base = norm(filename.replace(/\.[a-z0-9]+$/i, "")).replace(NOISE, "");
  if (!base) return null;
  const exact = heroes.find((h) => norm(h.name) === base || norm(h.slug) === base || norm(h.name.replace(/^The /, "")) === base);
  if (exact) return exact.id;
  const partial = heroes
    .filter((h) => base.includes(norm(h.name.replace(/^The /, ""))) || norm(h.name).includes(base))
    .sort((a, b) => b.name.length - a.name.length);
  return partial[0]?.id ?? null;
}

/**
 * Import groupé : on dépose plusieurs images, chacune est associée à un héros d'après son nom de fichier
 * (modifiable avant l'envoi), puis envoyée dans le stockage et enregistrée comme portrait.
 */
export function BulkPortraits({ heroes }: { heroes: Hero[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const sorted = useMemo(() => [...heroes].sort((a, b) => a.name.localeCompare(b.name, "fr")), [heroes]);
  const byId = useMemo(() => new Map(heroes.map((h) => [h.id, h])), [heroes]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next: Item[] = [...list]
      .filter((f) => /^image\/(png|jpeg|webp)$/.test(f.type))
      .map((file) => ({ file, preview: URL.createObjectURL(file), heroId: matchHero(file.name, heroes), status: file.size > 2 * 1024 * 1024 ? "error" : "ready", error: file.size > 2 * 1024 * 1024 ? "Plus de 2 Mo" : undefined }));
    setItems((xs) => [...xs, ...next]);
  }

  async function sendAll() {
    setBusy(true);
    const supabase = createClient();
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const hero = it.heroId ? byId.get(it.heroId) : undefined;
      if (it.status !== "ready" || !hero) continue;
      setItems((xs) => xs.map((x, j) => (j === i ? { ...x, status: "sending" } : x)));
      const ext = it.file.type === "image/png" ? "png" : it.file.type === "image/webp" ? "webp" : "jpg";
      const path = `${hero.slug}-${Date.now()}.${ext}`;
      const up = await supabase.storage.from("hero-portraits").upload(path, it.file, { upsert: true, contentType: it.file.type, cacheControl: "31536000" });
      let error = up.error ? "Envoi refusé (migration 0005 exécutée ?)" : undefined;
      if (!error) {
        const url = supabase.storage.from("hero-portraits").getPublicUrl(path).data.publicUrl;
        const res = await saveRef("heroes", { id: hero.id, name: hero.name, slug: hero.slug, roles: hero.roles, active: hero.active, portrait_url: url });
        if (!res.ok) error = res.error;
      }
      setItems((xs) => xs.map((x, j) => (j === i ? { ...x, status: error ? "error" : "done", error } : x)));
    }
    setBusy(false);
    router.refresh();
  }

  const ready = items.filter((i) => i.status === "ready" && i.heroId).length;

  return (
    <section className="card flex flex-col gap-4">
      <div>
        <h2 className="text-lg uppercase tracking-wide">Import groupé des portraits</h2>
        <p className="text-sm text-muted">
          Dépose plusieurs images d&apos;un coup. Chaque fichier est associé au héros dont le nom apparaît dans son nom de fichier (ex. « Luna_Snow.png »). Vérifie les associations, puis envoie.
        </p>
      </div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={clsx(
          "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragOver ? "border-accent bg-accent/10" : "border-line hover:border-accent/60 hover:bg-surface-2",
        )}
      >
        <Upload className="size-6 text-accent" aria-hidden />
        <span className="text-sm font-semibold">Glisse tes images ici, ou clique pour les choisir</span>
        <span className="text-xs text-muted">PNG, JPG ou WebP, 2 Mo maximum par image</span>
        <input type="file" multiple accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      </label>

      {items.length ? (
        <>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => {
              const hero = it.heroId ? byId.get(it.heroId) : undefined;
              return (
                <li key={i} className={clsx("flex items-center gap-3 rounded-lg border px-2 py-2", it.status === "done" ? "border-good/60" : it.status === "error" || !hero ? "border-bad/50" : "border-line")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.preview} alt="" className="size-12 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-muted" title={it.file.name}>
                      {it.file.name}
                    </p>
                    <select
                      aria-label={`Héros pour ${it.file.name}`}
                      className="field mt-1 py-1 text-sm"
                      value={it.heroId ?? ""}
                      disabled={it.status !== "ready" || busy}
                      onChange={(e) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, heroId: e.target.value ? Number(e.target.value) : null } : x)))}
                    >
                      <option value="">Aucun héros reconnu</option>
                      {sorted.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                    <p className={clsx("mt-1 text-xs", it.status === "done" ? "text-good" : it.status === "error" ? "text-bad" : "text-muted")}>
                      {it.status === "done" ? "Envoyé" : it.status === "sending" ? "Envoi…" : it.status === "error" ? it.error : hero?.portrait_url ? "Remplacera le portrait actuel" : "Prêt"}
                    </p>
                  </div>
                  {hero ? <HeroMark name={hero.name} role={hero.roles[0]} size="md" src={hero.portrait_url} /> : null}
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" disabled={busy || ready === 0} onClick={sendAll} className={buttonClass("primary")}>
              {busy ? "Envoi en cours…" : `Envoyer ${ready} portrait${ready > 1 ? "s" : ""}`}
            </button>
            <button type="button" disabled={busy} onClick={() => setItems([])} className={buttonClass("ghost")}>
              Vider la liste
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
