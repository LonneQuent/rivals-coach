"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ROLES, type Role } from "@/lib/types";
import { RoleDot, buttonClass } from "@/components/ui";
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
      ...(orderKey ? { [orderKey]: nextOrder } : {}),
    };
  };

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
            <th className="eyebrow px-3 py-2.5">Nom</th>
            {table === "heroes" ? <th className="eyebrow px-3 py-2.5">Rôles</th> : null}
            {table === "maps" ? <th className="eyebrow px-3 py-2.5">Type de mode</th> : null}
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
