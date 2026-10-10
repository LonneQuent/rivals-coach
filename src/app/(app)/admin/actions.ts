"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ROLES } from "@/lib/types";

const name = z.string().trim().min(1, "Le nom est obligatoire.").max(80);
const id = z.number().int().positive().optional();

const SCHEMAS = {
  heroes: z.object({
    id,
    name,
    slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug : minuscules, chiffres et tirets uniquement.").max(60),
    roles: z.array(z.enum(ROLES)).min(1, "Choisis au moins un rôle.").max(3),
    active: z.boolean(),
  }),
  maps: z.object({ id, name, game_mode_id: z.number().int().nullable(), active: z.boolean() }),
  game_modes: z.object({ id, name, sort: z.number().int(), active: z.boolean() }),
  queues: z.object({ id, name, sort: z.number().int(), active: z.boolean() }),
  ranks: z.object({ id, name, tier_order: z.number().int(), active: z.boolean() }),
  error_tags: z.object({ id, name, sort: z.number().int(), active: z.boolean() }),
} as const;

export type RefTable = keyof typeof SCHEMAS;

export async function saveRef(table: RefTable, row: Record<string, unknown>): Promise<{ ok: boolean; error?: string; id?: number }> {
  const schema = SCHEMAS[table];
  if (!schema) return { ok: false, error: "Table inconnue." };
  const parsed = schema.safeParse(row);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { id: rowId, ...values } = parsed.data as { id?: number } & Record<string, unknown>;
  const q = rowId ? supabase.from(table).update(values).eq("id", rowId).select("id").single() : supabase.from(table).insert(values).select("id").single();
  const { data, error } = await q;
  if (error) {
    if (error.code === "23505") return { ok: false, error: "Cette valeur existe déjà." };
    if (error.code === "42501" || error.message.includes("row-level security")) return { ok: false, error: "Réservé aux admins." };
    return { ok: false, error: "L'enregistrement a échoué." };
  }
  revalidatePath("/", "layout");
  return { ok: true, id: (data as { id: number }).id };
}
