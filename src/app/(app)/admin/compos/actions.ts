"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { COMP_SLUG, compContentSchema } from "@/lib/comps";

const input = z.object({
  id: z.number().int().positive().nullable(),
  slug: z.string().trim().min(1).max(60).regex(COMP_SLUG, "Identifiant : minuscules, chiffres et tirets uniquement")
    .refine((s) => s !== "nouvelle", "Cet identifiant est réservé"),
  status: z.enum(["draft", "published"]),
  sort: z.number().int().min(0).max(10000),
  content: compContentSchema,
});

const rlsError = (msg: string) => (msg.includes("row-level security") ? "Réservé aux admins." : msg.includes("duplicate key") ? "Cet identifiant est déjà pris." : "L'enregistrement a échoué.");

export async function saveComp(raw: unknown): Promise<{ ok: boolean; error?: string; slug?: string }> {
  const parsed = input.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue ? `${issue.path.join(" › ")} : ${issue.message}` : "Contenu invalide." };
  }
  const { id, ...values } = parsed.data;
  const supabase = await createClient();
  // .select() : une mise à jour bloquée par RLS ne renvoie pas d'erreur, juste zéro ligne
  const { data, error } = id
    ? await supabase.from("team_comps").update(values).eq("id", id).select("id")
    : await supabase.from("team_comps").insert(values).select("id");
  if (error) return { ok: false, error: rlsError(error.message) };
  if (!data?.length) return { ok: false, error: "Réservé aux admins." };
  revalidatePath("/compos", "layout");
  revalidatePath("/admin/compos", "layout");
  return { ok: true, slug: values.slug };
}

export async function deleteComp(id: number): Promise<{ ok: boolean; error?: string }> {
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "Compo inconnue." };
  const supabase = await createClient();
  const { error, count } = await supabase.from("team_comps").delete({ count: "exact" }).eq("id", id);
  if (error) return { ok: false, error: rlsError(error.message) };
  if (!count) return { ok: false, error: "Réservé aux admins." };
  revalidatePath("/compos", "layout");
  revalidatePath("/admin/compos", "layout");
  return { ok: true };
}
