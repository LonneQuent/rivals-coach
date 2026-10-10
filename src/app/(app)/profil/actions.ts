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
