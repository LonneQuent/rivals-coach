import { z } from "zod";
import { ROLES, type Role } from "@/lib/types";

export const guideContentSchema = z.object({
  summary: z.string().max(1000).default(""),
  patch_note: z.string().max(500).optional().default(""),
  sections: z
    .array(z.object({ title: z.string().trim().min(1).max(80), items: z.array(z.string().trim().min(1).max(400)).max(20) }))
    .max(12)
    .default([]),
  counters: z.array(z.object({ hero: z.string().max(60), note: z.string().max(300) })).max(15).default([]),
  synergies: z.array(z.object({ hero: z.string().max(60), note: z.string().max(300) })).max(15).default([]),
  sources: z.array(z.object({ title: z.string().max(150), author: z.string().max(100), url: z.string().url().optional().or(z.literal("")) })).max(10).default([]),
});

export type GuideContent = z.infer<typeof guideContentSchema>;
export type GuideStatus = "draft" | "published";

export interface Guide {
  id: number;
  kind: "hero" | "role";
  hero_id: number | null;
  role: Role | null;
  status: GuideStatus;
  content: GuideContent;
  updated_at: string;
}

/** Lit un contenu stocké en base sans jamais planter sur un champ manquant. */
export function parseContent(raw: unknown): GuideContent {
  const r = guideContentSchema.safeParse(raw ?? {});
  return r.success ? r.data : { summary: "", patch_note: "", sections: [], counters: [], synergies: [], sources: [] };
}

export const roleSlug = (r: Role) => r.toLowerCase();
export const roleFromSlug = (s: string): Role | null => ROLES.find((r) => r.toLowerCase() === s.toLowerCase()) ?? null;
