"use client";

import { useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/components/ui";

export const GUIDE_BUCKET = "guide-images";
const PORTRAIT_BUCKET = "hero-portraits";
const MAX_BYTES = 5 * 1024 * 1024;

type Folder = "icons" | "captures";
type Pick = { url: string; name: string };

/** Nom de fichier sûr : minuscules, sans accents ni espaces, préfixé par l'heure pour éviter les collisions. */
function safeName(file: File) {
  const base = file.name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${Date.now().toString(36)}-${base || "image.png"}`;
}

/** Charge une image pour connaître sa taille (sert à repérer les icônes parmi les portraits). */
function measure(url: string) {
  return new Promise<{ w: number; h: number } | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Choix d'une image pour une section de guide : envoi d'un fichier dans le bucket « guide-images »,
 * ou sélection parmi les images déjà envoyées. Pour les icônes, propose aussi les petites icônes
 * carrées déjà présentes dans le bucket des portraits.
 */
export function ImageField({ folder, value, onChange, label }: { folder: Folder; value: string; onChange: (url: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Pick[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setErr(null);
    const supabase = createClient();
    const own = await supabase.storage.from(GUIDE_BUCKET).list(folder, { limit: 500, sortBy: { column: "created_at", order: "desc" } });
    if (own.error) {
      setErr("Impossible de lister les images : exécute la migration 0010.");
      setItems([]);
      return;
    }
    const list: Pick[] = (own.data ?? [])
      .filter((f) => f.name && !f.name.startsWith("."))
      .map((f) => ({ name: f.name, url: supabase.storage.from(GUIDE_BUCKET).getPublicUrl(`${folder}/${f.name}`).data.publicUrl }));
    setItems(list);

    if (folder === "icons") {
      const portraits = await supabase.storage.from(PORTRAIT_BUCKET).list("", { limit: 1000 });
      const candidates = (portraits.data ?? [])
        .filter((f) => f.name && !f.name.startsWith("."))
        .map((f) => ({ name: f.name, url: supabase.storage.from(PORTRAIT_BUCKET).getPublicUrl(f.name).data.publicUrl }));
      const sized = await Promise.all(candidates.map(async (c) => ({ c, s: await measure(c.url) })));
      const icons = sized.filter(({ s }) => s && s.w < 150 && s.h < 150 && Math.abs(s.w / s.h - 1) < 0.18).map(({ c }) => c);
      setItems((xs) => [...(xs ?? []), ...icons]);
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && items === null) void load();
  }

  async function upload(file: File) {
    setErr(null);
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) return setErr("Formats acceptés : PNG, JPEG, WebP ou GIF.");
    if (file.size > MAX_BYTES) return setErr("Image trop lourde (5 Mo maximum).");
    setBusy(true);
    const supabase = createClient();
    const path = `${folder}/${safeName(file)}`;
    const { error } = await supabase.storage.from(GUIDE_BUCKET).upload(path, file, { cacheControl: "31536000", upsert: false });
    setBusy(false);
    if (error) return setErr("Envoi refusé : vérifie que la migration 0010 est exécutée et que tu es admin.");
    const url = supabase.storage.from(GUIDE_BUCKET).getPublicUrl(path).data.publicUrl;
    setItems((xs) => [{ name: path, url }, ...(xs ?? [])]);
    onChange(url);
    setOpen(false);
  }

  const thumb = folder === "icons" ? "size-12" : "h-16 w-28";

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-fg-2">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        {value ? (
          <span className={`relative grid ${thumb} place-items-center overflow-hidden rounded-lg border border-line bg-surface-2`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="size-full object-contain" />
          </span>
        ) : null}
        <button type="button" className={buttonClass("default")} onClick={toggle}>
          <ImagePlus className="size-4" /> {value ? "Changer" : "Choisir"}
        </button>
        <button type="button" className={buttonClass("ghost")} disabled={busy} onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" /> {busy ? "Envoi…" : "Envoyer une image"}
        </button>
        {value ? (
          <button type="button" className={buttonClass("ghost")} onClick={() => onChange("")}>
            <X className="size-4" /> Retirer
          </button>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) void upload(f);
          }}
        />
      </div>
      {err ? <p className="text-sm text-bad">{err}</p> : null}
      {open ? (
        <div className="rounded-lg border border-line bg-surface-2 p-2">
          {items === null ? (
            <p className="p-2 text-sm text-muted">Chargement…</p>
          ) : items.length === 0 ? (
            <p className="p-2 text-sm text-muted">Aucune image pour l&apos;instant : envoie la première.</p>
          ) : (
            <ul className={`grid max-h-64 gap-2 overflow-y-auto ${folder === "icons" ? "grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))]" : "grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]"}`}>
              {items.map((it) => (
                <li key={it.url}>
                  <button
                    type="button"
                    title={it.name}
                    onClick={() => {
                      onChange(it.url);
                      setOpen(false);
                    }}
                    className={`grid w-full place-items-center overflow-hidden rounded-md border bg-surface ${folder === "icons" ? "aspect-square" : "aspect-video"} ${it.url === value ? "border-accent" : "border-line hover:border-fg-2"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.url} alt={it.name} loading="lazy" className="size-full object-contain" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
