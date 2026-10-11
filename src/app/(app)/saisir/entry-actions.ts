"use server";

import { getRefs, requireSession } from "@/lib/data";
import { getEntryContext, type RecentPick } from "@/lib/matches";
import type { MatchInput, Refs } from "@/lib/types";

export type EntryData = { refs: Refs; last: MatchInput | null; recent: RecentPick[] };

/** Tout ce dont l'assistant de saisie a besoin, chargé à l'ouverture de la fenêtre. */
export async function loadEntryData(): Promise<EntryData> {
  const { supabase, user } = await requireSession();
  const [refs, ctx] = await Promise.all([getRefs(), getEntryContext(supabase, user.id)]);
  return { refs, ...ctx };
}
