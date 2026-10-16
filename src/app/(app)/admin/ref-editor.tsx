"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ROLES, type Role } from "@/lib/types";
import { HeroMark, RoleDot, buttonClass } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { saveRef, type RefTable } from "./actions";

type Row = Record<string, unknown> & { _key: string; _dirty?: boolean; _msg?: { ok: boolean; text: string } };

const ORDER_KEY: Partial<Record<RefTable, "sort" | "tier_order">> = { game_modes: "sort", queues: "sort", ranks: "tier_order", error_tags: "sort" };

function slugify(s: string) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function RefEditor({ table, rows: initial, gameModes }: { table: RefTable; rows: Record<string, unknown>[]; gameModes: { id: number; name: string }[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const orderKey = ORDER_KEY[table];
  const [rows, setRows] = useState<Row[]>(() => initial.map((r) => ({ ...r, _key: String(r.id) })));

  const blank = (): Row => {
    const nextOrder = orderKey ? Math.max(-1, ...rows.map((r) => Number(r[orderKey] ?? 0))) + 1 : undefined;
    return {
      _key: `new-${Date.now()}`,
      name: "",
      active: true,
      _dirty: true,
      ...(table === "heroes" ? { slug: "", roles: [] as Role[] } : {}),
      ...(table === "maps" ? { game_mode_id: null } : {}),
      ...(table === "error_tags" ? { kind: "mistake" } : {}),
      ...(orderKey ? { [orderKey]: nextOrder } : {}),
    };
  };

  const [uploading, setUploading] = useState<string | null>(null);

  /** Envoie l'image dans le stockage Supabase (réservé aux admins) puis enregistre son adresse sur le héros. */
  async function uploadPortrait(row: Row, file: File) {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return setRows((rs) => rs.map((r) => (r._key === row._key ? { ...r, _msg: { ok: false, text: "Format accepté : PNG, JPG ou WebP." } } : r)));
    if (file.size > 2 * 1024 * 1024) return setRows((rs) => rs.map((r) => (r._key === row._key ? { ...r, _msg: { ok: false, text: "Image trop lourde (2 Mo maximum)." } } : r)));
    setUploading(row._key);
    const supabase = createClient();
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${String(row.slug || "hero")}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("hero-portraits").upload(path, file, { upsert: true, contentType: file.type, cacheControl: "31536000" });
    setUploading(null);
    if (error) {
      setRows((rs) => rs.map((r) => (r._key === row._key ? { ...r, _msg: { ok: false, text: "Envoi impossible : as-tu exécuté la migration 0005 ?" } } : r)));
      return;
    }
    const url = supabase.storage.from("hero-portraits").getPublicUrl(path).data.publicUrl;
    save({ ...row, portrait_url: url });
  }

  function patch(key: string, p: Record<string, unknown>) {
    setRows((rs) => rs.map((r) => (r._key === key ? { ...r, ...p, _dirty: true, _msg: undefined } : r)));
  }

  function save(row: Row) {
    const { _key, _dirty, _msg, ...values } = row;
    void _dirty;
    void _msg;
    start(async () => {
      const res = await saveRef(table, values);
      setRows((rs) => rs.map((r) => (r._key === _key ? { ...r, id: res.id ?? r.id, _dirty: !res.ok, _msg: res.ok ? { ok: true, text: "Enregistré" } : { ok: false, text: res.error ?? "Erreur" } } : r)));
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="card overflow-x-auto p-0 sm:p-0">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            {orderKey ? <th className="eyebrow w-20 px-3 py-2.5">Ordre</th> : null}
            {table === "heroes" ? <th className="eyebrow w-28 px-3 py-2.5">Portrait</th> : null}
            <th className="eyebrow px-3 py-2.5">Nom</th>
            {table === "heroes" ? <th className="eyebrow px-3 py-2.5">Rôles</th> : null}
            {table === "maps" ? <th className="eyebrow px-3 py-2.5">Type de mode</th> : null}
            {table === "error_tags" ? <th className="eyebrow px-3 py-2.5">Type</th> : null}
            <th className="eyebrow w-24 px-3 py-2.5">Actif</th>
            <th className="w-40 px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._key} className={clsx("border-b border-line last:border-0", r.active === false && "opacity-60")}>
              {orderKey ? (
                <td className="px-3 py-2">
                  <input aria-label="Ordre" className="field tabular py-1.5" inputMode="numeric" value={String(r[orderKey] ?? "")} onChange={(e) => patch(r._key, { [orderKey]: Number(e.target.value) || 0 })} />
                </td>
              ) : null}
              {table === "heroes" ? (
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <HeroMark name={String(r.name || "?")} role={((r.roles as Role[]) ?? [])[0] ?? "Vanguard"} size="md" src={(r.portrait_url as string | null) ?? null} />
                    <label className={buttonClass("ghost", "px-2 py-1 text-xs")}>
                      {uploading === r._key ? "Envoi…" : r.portrait_url ? "Changer" : "Ajouter"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        disabled={!r.id || uploading !== null}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = "";
                          if (f) void uploadPortrait(r, f);
                        }}
                      />
                    </label>
                  </div>
                </td>
              ) : null}
              <td className="px-3 py-2">
                <input
                  aria-label="Nom"
                  className="field py-1.5"
                  value={String(r.name ?? "")}
                  onChange={(e) => patch(r._key, table === "heroes" && !r.id ? { name: e.target.value, slug: slugify(e.target.value) } : { name: e.target.value })}
                />
              </td>
              {table === "heroes" ? (
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1.5">
                    {ROLES.map((role) => {
                      const roles = (r.roles as Role[]) ?? [];
                      const on = roles.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          aria-pressed={on}
                          onClick={() => patch(r._key, { roles: on ? roles.filter((x) => x !== role) : [...roles, role] })}
                          className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", on ? "border-accent bg-accent/15" : "border-line text-muted")}
                        >
                          <RoleDot role={role} />
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </td>
              ) : null}
              {table === "maps" ? (
                <td className="px-3 py-2">
                  <select aria-label="Type de mode" className="field py-1.5" value={String(r.game_mode_id ?? "")} onChange={(e) => patch(r._key, { game_mode_id: e.target.value ? Number(e.target.value) : null })}>
                    <option value="">–</option>
                    {gameModes.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </td>
              ) : null}
              {table === "error_tags" ? (
                <td className="px-3 py-2">
                  <select aria-label="Type de tag" className="field py-1.5" value={String(r.kind ?? "mistake")} onChange={(e) => patch(r._key, { kind: e.target.value })}>
                    <option value="mistake">Ce qui a coincé</option>
                    <option value="strength">Ce qui a bien marché</option>
                  </select>
                </td>
              ) : null}
              <td className="px-3 py-2">
                <input aria-label="Actif" type="checkbox" className="size-4 accent-[var(--color-accent)]" checked={r.active !== false} onChange={(e) => patch(r._key, { active: e.target.checked })} />
              </td>
              <td className="px-3 py-2 text-right">
                {r._msg ? <span className={clsx("mr-2 text-xs", r._msg.ok ? "text-good" : "text-bad")}>{r._msg.text}</span> : null}
                {r._dirty ? (
                  <button type="button" disabled={pending} onClick={() => save(r)} className={buttonClass("primary", "px-3 py-1 text-xs")}>
                    Enregistrer
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-line p-3">
        <button type="button" className={buttonClass("default")} onClick={() => setRows((rs) => [...rs, blank()])}>
          Ajouter une ligne
        </button>
      </div>
    </div>
  );
}
