"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: boolean; error?: string };
const id = z.uuid();

/** Le joueur autorise un coach à voir ses données. */
export async function linkCoach(coachId: string): Promise<Result> {
  if (!id.safeParse(coachId).success) return { ok: false, error: "Coach inconnu." };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false, error: "Session expirée, reconnecte-toi." };
  const { error } = await supabase.from("coach_links").insert({ coach_id: coachId, player_id: data.user.id });
  if (error && error.code !== "23505") return { ok: false, error: "Impossible d'ajouter ce coach." };
  revalidatePath("/profil");
  return { ok: true };
}

/** Retire le lien (le joueur comme le coach peuvent le faire). */
export async function unlinkCoach(coachId: string, playerId?: string): Promise<Result> {
  if (!id.safeParse(coachId).success || (playerId && !id.safeParse(playerId).success)) return { ok: false, error: "Lien inconnu." };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false, error: "Session expirée, reconnecte-toi." };
  const { error } = await supabase.from("coach_links").delete().eq("coach_id", coachId).eq("player_id", playerId ?? data.user.id);
  if (error) return { ok: false, error: "La suppression a échoué." };
  revalidatePath("/profil");
  revalidatePath("/equipe", "layout");
  return { ok: true };
}

export async function addNote(playerId: string, body: string): Promise<Result> {
  const text = body.trim();
  if (!id.safeParse(playerId).success) return { ok: false, error: "Joueur inconnu." };
  if (!text || text.length > 2000) return { ok: false, error: "La note doit faire entre 1 et 2000 caractères." };
  const supabase = await createClient();
  const { error } = await supabase.from("coach_notes").insert({ player_id: playerId, body: text });
  if (error) return { ok: false, error: "La note n'a pas pu être enregistrée." };
  revalidatePath(`/equipe/${playerId}`);
  return { ok: true };
}

export async function deleteNote(noteId: string, playerId: string): Promise<Result> {
  if (!id.safeParse(noteId).success) return { ok: false, error: "Note inconnue." };
  const supabase = await createClient();
  const { error } = await supabase.from("coach_notes").delete().eq("id", noteId);
  if (error) return { ok: false, error: "La suppression a échoué." };
  revalidatePath(`/equipe/${playerId}`);
  return { ok: true };
}

export async function addComment(matchId: string, body: string): Promise<Result> {
  const text = body.trim();
  if (!id.safeParse(matchId).success) return { ok: false, error: "Partie inconnue." };
  if (!text || text.length > 1000) return { ok: false, error: "Le commentaire doit faire entre 1 et 1000 caractères." };
  const supabase = await createClient();
  const { error } = await supabase.from("match_comments").insert({ match_id: matchId, body: text });
  if (error) return { ok: false, error: "Le commentaire n'a pas pu être publié." };
  revalidatePath(`/historique/${matchId}`);
  return { ok: true };
}

export async function deleteComment(commentId: string, matchId: string): Promise<Result> {
  if (!id.safeParse(commentId).success) return { ok: false, error: "Commentaire inconnu." };
  const supabase = await createClient();
  const { error } = await supabase.from("match_comments").delete().eq("id", commentId);
  if (error) return { ok: false, error: "La suppression a échoué." };
  revalidatePath(`/historique/${matchId}`);
  return { ok: true };
}
