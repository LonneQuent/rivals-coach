"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ROLES, type MatchInput } from "@/lib/types";

const n = (max: number) => z.number().min(0).max(max).nullable();
const int = (max: number) => z.number().int("Les stats sont des nombres entiers.").min(0).max(max).nullable();

const schema = z.object({
  id: z.uuid().optional(),
  played_at: z.iso.datetime({ offset: true }),
  queue_id: z.number().int().nullable(),
  game_mode_id: z.number().int().nullable(),
  map_id: z.number().int().nullable(),
  rank_id: z.number().int().nullable(),
  result: z.enum(["win", "loss"]),
  duration_min: z.number().gt(0).lt(120).nullable(),
  feeling: z.number().int().min(1).max(5).nullable(),
  award: z.enum(["", "MVP", "SVP"]),
  note: z.string().max(1000),
  tag_ids: z.array(z.number().int()).max(30),
  enemy_ids: z.array(z.number().int().positive()).max(6).default([]),
  heroes: z
    .array(
      z.object({
        hero_id: z.number().int(),
        role: z.enum(ROLES),
        play_minutes: n(120),
        kills: int(500),
        deaths: int(500),
        assists: int(500),
        final_hits: int(500),
        damage: int(1_000_000),
        damage_blocked: int(1_000_000),
        healing: int(1_000_000),
        accuracy: n(100),
      }),
    )
    .min(1, "Ajoute au moins un héros")
    .max(6),
});

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export async function saveMatch(input: MatchInput): Promise<SaveResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Certains champs sont invalides." };
  }
  const ids = parsed.data.heroes.map((h) => h.hero_id);
  if (new Set(ids).size !== ids.length) return { ok: false, error: "Le même héros apparaît deux fois." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("save_match", { p: parsed.data });
  if (error) {
    return { ok: false, error: error.message.includes("Rôle") ? "Ce héros ne peut pas jouer ce rôle." : "L'enregistrement a échoué. Réessaie." };
  }
  revalidatePath("/historique");
  revalidatePath("/");
  return { ok: true, id: data as string };
}

export async function deleteMatch(id: string): Promise<SaveResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Partie inconnue." };
  const supabase = await createClient();
  const { error } = await supabase.from("matches").delete().eq("id", id);
  if (error) return { ok: false, error: "La suppression a échoué." };
  revalidatePath("/historique");
  revalidatePath("/");
  return { ok: true, id };
}
