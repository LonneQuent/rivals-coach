"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { guideContentSchema } from "@/lib/guides";
import { ROLES } from "@/lib/types";

const input = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("hero"), hero_id: z.number().int().positive(), status: z.enum(["draft", "published"]), content: guideContentSchema }),
  z.object({ kind: z.literal("role"), role: z.enum(ROLES), status: z.enum(["draft", "published"]), content: guideContentSchema }),
  z.object({ kind: z.literal("map"), map_id: z.number().int().positive(), status: z.enum(["draft", "published"]), content: guideContentSchema }),
  z.object({ kind: z.literal("general"), slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(60), status: z.enum(["draft", "published"]), content: guideContentSchema }),
]);

export async function saveGuide(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = input.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue ? `${issue.path.join(" › ")} : ${issue.message}` : "Contenu invalide." };
  }
  const supabase = await createClient();
  const g = parsed.data;
  const match =
    g.kind === "hero" ? { col: "hero_id", val: g.hero_id } : g.kind === "role" ? { col: "role", val: g.role } : g.kind === "map" ? { col: "map_id", val: g.map_id } : { col: "slug", val: g.slug };

  const { data: existing } = await supabase.from("guides").select("id").eq("kind", g.kind).eq(match.col, match.val).maybeSingle();
  const values: Record<string, unknown> = { kind: g.kind, status: g.status, content: g.content, [match.col]: match.val };
  // .select() : une mise à jour bloquée par RLS ne renvoie pas d'erreur, juste zéro ligne
  const { data, error } = existing
    ? await supabase.from("guides").update(values).eq("id", (existing as { id: number }).id).select("id")
    : await supabase.from("guides").insert(values).select("id");
  if (error) return { ok: false, error: error.message.includes("row-level security") ? "Réservé aux admins." : "L'enregistrement a échoué." };
  if (!data?.length) return { ok: false, error: "Réservé aux admins." };

  revalidatePath("/", "layout");
  return { ok: true };
}
