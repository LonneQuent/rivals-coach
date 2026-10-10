"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { guideContentSchema } from "@/lib/guides";
import { ROLES } from "@/lib/types";

const input = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("hero"), hero_id: z.number().int().positive(), status: z.enum(["draft", "published"]), content: guideContentSchema }),
  z.object({ kind: z.literal("role"), role: z.enum(ROLES), status: z.enum(["draft", "published"]), content: guideContentSchema }),
]);

export async function saveGuide(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const parsed = input.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue ? `${issue.path.join(" › ")} : ${issue.message}` : "Contenu invalide." };
  }
  const supabase = await createClient();
  const g = parsed.data;
  const match = g.kind === "hero" ? { col: "hero_id", val: g.hero_id } : { col: "role", val: g.role };

  const { data: existing } = await supabase.from("guides").select("id").eq("kind", g.kind).eq(match.col, match.val).maybeSingle();
  const values: Record<string, unknown> = { kind: g.kind, status: g.status, content: g.content, ...(g.kind === "hero" ? { hero_id: g.hero_id } : { role: g.role }) };
  const { error } = existing
    ? await supabase.from("guides").update(values).eq("id", (existing as { id: number }).id)
    : await supabase.from("guides").insert(values);
  if (error) return { ok: false, error: error.message.includes("row-level security") ? "Réservé aux admins." : "L'enregistrement a échoué." };

  revalidatePath("/", "layout");
  return { ok: true };
}
