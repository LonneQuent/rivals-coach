"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { captureImportSchema, type CaptureImport, type ImportOutcome, type ImportResult } from "@/lib/capture/schema";

export async function importCapture(input: CaptureImport): Promise<ImportResult> {
  const parsed = captureImportSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Certaines valeurs lues sont invalides. Vérifie les chiffres et les héros." };
  for (const pl of parsed.data.players) {
    const ids = pl.heroes.map((h) => h.hero_id);
    if (new Set(ids).size !== ids.length) return { ok: false, error: "Le même héros apparaît deux fois chez un joueur." };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("import_capture", { p: parsed.data });
  if (error) {
    if (error.code === "PGRST202" || error.message.includes("import_capture")) return { ok: false, error: "L'import n'est pas encore activé : la migration 0017_capture_import.sql doit être exécutée dans Supabase." };
    if (error.message.includes("Rôle")) return { ok: false, error: "Un héros ne peut pas jouer le rôle indiqué." };
    return { ok: false, error: "L'enregistrement a échoué. Réessaie." };
  }
  revalidatePath("/historique");
  revalidatePath("/");
  revalidatePath("/stats");
  return { ok: true, outcomes: (data ?? []) as ImportOutcome[] };
}
