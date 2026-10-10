"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ROLES } from "@/lib/types";

const schema = z.object({
  pseudo: z.string().trim().min(1, "Le pseudo ne peut pas être vide.").max(40, "40 caractères maximum."),
  main_role: z.enum(ROLES).nullable(),
  share_aggregates: z.boolean(),
  mains: z.array(z.number().int()).max(10),
  train: z.array(z.number().int()).max(10),
});

export type ProfileInput = z.infer<typeof schema>;

export async function saveProfile(input: ProfileInput): Promise<{ ok: boolean; error?: string }> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return { ok: false, error: "Session expirée, reconnecte-toi." };

  const { pseudo, main_role, share_aggregates, mains, train } = parsed.data;
  const { error } = await supabase.from("profiles").update({ pseudo, main_role, share_aggregates }).eq("id", uid);
  if (error) return { ok: false, error: "Le profil n'a pas pu être enregistré." };

  const { error: delErr } = await supabase.from("player_heroes").delete().eq("user_id", uid);
  if (delErr) return { ok: false, error: "Les héros n'ont pas pu être enregistrés." };
  const rows = [...mains.map((hero_id) => ({ user_id: uid, hero_id, kind: "main" })), ...train.map((hero_id) => ({ user_id: uid, hero_id, kind: "train" }))];
  if (rows.length) {
    const { error: insErr } = await supabase.from("player_heroes").insert(rows);
    if (insErr) return { ok: false, error: "Les héros n'ont pas pu être enregistrés." };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Axes d'amélioration, objectifs, auto-évaluation
// ---------------------------------------------------------------------------

async function uid() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, uid: data.user?.id ?? null };
}

export async function saveFocusAreas(items: string[]): Promise<{ ok: boolean; error?: string }> {
  const parsed = z.array(z.string().trim().min(1).max(120)).max(8, "8 axes maximum.").safeParse(items.filter((s) => s.trim()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Liste invalide." };
  const { supabase, uid: id } = await uid();
  if (!id) return { ok: false, error: "Session expirée, reconnecte-toi." };
  const { error } = await supabase.from("profiles").update({ focus_areas: parsed.data }).eq("id", id);
  if (error) return { ok: false, error: "L'enregistrement a échoué." };
  revalidatePath("/profil");
  return { ok: true };
}

const METRIC_KEYS = ["winrate", "kda", "deaths", "kills", "deaths10", "damage10", "healing10", "blocked10", "accuracy"] as const;
const goalSchema = z.object({
  metric: z.enum(METRIC_KEYS),
  op: z.enum(["<=", ">="]),
  target: z.number().min(0).max(1_000_000),
  role: z.enum(ROLES).nullable(),
});

export async function addGoal(input: z.infer<typeof goalSchema>): Promise<{ ok: boolean; error?: string }> {
  const parsed = goalSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Objectif invalide : vérifie la valeur cible." };
  const { supabase, uid: id } = await uid();
  if (!id) return { ok: false, error: "Session expirée, reconnecte-toi." };
  const { count } = await supabase.from("goals").select("id", { count: "exact", head: true }).eq("user_id", id).eq("active", true);
  if ((count ?? 0) >= 6) return { ok: false, error: "6 objectifs actifs maximum : retires-en un avant d'en ajouter." };
  const { error } = await supabase.from("goals").insert({ ...parsed.data, user_id: id });
  if (error) return { ok: false, error: "L'objectif n'a pas pu être enregistré." };
  revalidatePath("/profil");
  return { ok: true };
}

export async function removeGoal(goalId: string): Promise<{ ok: boolean; error?: string }> {
  if (!z.uuid().safeParse(goalId).success) return { ok: false, error: "Objectif inconnu." };
  const { supabase } = await uid();
  const { error } = await supabase.from("goals").delete().eq("id", goalId);
  if (error) return { ok: false, error: "La suppression a échoué." };
  revalidatePath("/profil");
  return { ok: true };
}

const SKILL_KEYS = ["aim", "survival", "impact", "pool", "consistency", "gamesense", "adaptability", "comms", "ults", "mental"] as const;

export async function saveEvaluation(scores: Record<string, number>): Promise<{ ok: boolean; error?: string }> {
  const parsed = z.object(Object.fromEntries(SKILL_KEYS.map((k) => [k, z.number().int().min(1).max(10)]))).safeParse(scores);
  if (!parsed.success) return { ok: false, error: "Chaque axe doit être noté de 1 à 10." };
  const { supabase, uid: id } = await uid();
  if (!id) return { ok: false, error: "Session expirée, reconnecte-toi." };
  const { error } = await supabase.from("skill_evaluations").insert({ player_id: id, scores: parsed.data });
  if (error) return { ok: false, error: "L'évaluation n'a pas pu être enregistrée." };
  revalidatePath("/profil");
  return { ok: true };
}
