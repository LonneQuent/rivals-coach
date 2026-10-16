"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const input = z.object({
  heroId: z.number().int().positive().nullable(),
  mode: z.enum(["hero", "mine", "mix"]),
  score: z.number().int().min(0).max(50),
  total: z.number().int().min(1).max(50),
});

/** Enregistre le score d'un quiz terminé. */
export async function saveQuizAttempt(raw: unknown): Promise<{ ok: boolean }> {
  const p = input.safeParse(raw);
  if (!p.success || p.data.score > p.data.total) return { ok: false };
  const supabase = await createClient();
  const { error } = await supabase.from("quiz_attempts").insert({ hero_id: p.data.heroId, mode: p.data.mode, score: p.data.score, total: p.data.total });
  if (error) return { ok: false };
  revalidatePath("/quiz");
  return { ok: true };
}
