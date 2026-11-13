import { z } from "zod";
import { ROLES } from "@/lib/types";

/** Format d'un import de capture, validé côté serveur avant l'appel à import_capture(). */
const stat = (max: number) => z.number().int().min(0).max(max).nullable();
const stats = {
  kills: stat(500),
  deaths: stat(500),
  assists: stat(500),
  final_hits: stat(500),
  damage: stat(1_000_000),
  damage_blocked: stat(1_000_000),
  healing: stat(1_000_000),
  accuracy: z.number().min(0).max(100).nullable(),
};

export const captureImportSchema = z.object({
  replay_id: z.string().regex(/^\d{6,20}$/).nullable(),
  played_at: z.iso.datetime({ offset: true }),
  queue_id: z.number().int().nullable(),
  game_mode_id: z.number().int().nullable(),
  map_id: z.number().int().nullable(),
  rank_id: z.number().int().nullable(),
  duration_min: z.number().gt(0).lt(120).nullable(),
  map_label: z.string().max(80),
  players: z
    .array(
      z.object({
        user_id: z.uuid(),
        name: z.string().max(40),
        result: z.enum(["win", "loss"]),
        award: z.enum(["", "MVP", "SVP"]),
        ...stats,
        heroes: z
          .array(z.object({ hero_id: z.number().int().positive(), role: z.enum(ROLES), play_minutes: z.number().min(0).max(120).nullable() }))
          .min(1)
          .max(6),
        enemy_ids: z.array(z.number().int().positive()).max(6),
        // Feuille de match vue par ce joueur : alliés et adversaires, sans les pseudos
        roster: z
          .array(z.object({ side: z.enum(["ally", "enemy"]), me: z.boolean(), hero_id: z.number().int().positive().nullable(), role: z.enum(ROLES).nullable(), ...stats }))
          .max(12),
      }),
    )
    .min(1)
    .max(6),
  fingerprints: z
    .array(z.object({ kind: z.enum(["banner", "avatar"]), hero_id: z.number().int().positive(), fp: z.string().min(100).max(800).regex(/^[A-Za-z0-9+/=]+$/) }))
    .max(40),
});


export type CaptureImport = z.input<typeof captureImportSchema>;
export type ImportOutcome = { user_id: string; match_id?: string; action: "created" | "updated" | "merged" | "refused" };
export type ImportResult = { ok: true; outcomes: ImportOutcome[] } | { ok: false; error: string };
