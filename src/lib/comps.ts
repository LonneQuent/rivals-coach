import { z } from "zod";
import { DIAGRAMS } from "@/lib/guides";
import { ROLES } from "@/lib/types";

const line = (max: number) => z.string().trim().min(1).max(max);
const heroSlug = z.string().trim().min(1).max(60);

/** Contenu d'une compo d'équipe. Les héros sont référencés par leur slug, comme dans les guides. */
export const compContentSchema = z.object({
  name: line(60),
  /** Une phrase qui résume l'idée (« On avance groupés et on gagne au contact »). */
  tagline: z.string().trim().max(140).optional().default(""),
  /** Schéma tactique associé. */
  style: z.enum(DIAGRAMS),
  /** 1 = accessible, 2 = intermédiaire, 3 = exigeant. */
  difficulty: z.number().int().min(0).max(3).optional().default(0),
  summary: z.string().trim().max(600).optional().default(""),
  heroes: z.array(z.object({ hero: heroSlug, role: z.enum(ROLES), job: z.string().trim().max(160).default("") })).min(2).max(6),
  alternatives: z.array(z.object({ hero: heroSlug, replaces: z.string().trim().max(60).default(""), note: z.string().trim().max(160).default("") })).max(8).optional().default([]),
  best_when: z.array(line(200)).max(5).optional().default([]),
  failure_signs: z.array(line(200)).max(5).optional().default([]),
  game_plan: z.array(line(220)).max(6).optional().default([]),
  strong_vs: z.array(z.object({ comp: z.string().trim().max(60), note: z.string().trim().max(200).default("") })).max(4).optional().default([]),
  weak_vs: z.array(z.object({ comp: z.string().trim().max(60), note: z.string().trim().max(200).default("") })).max(4).optional().default([]),
  patch_note: z.string().trim().max(300).optional().default(""),
});

export type CompContent = z.infer<typeof compContentSchema>;
export type CompStatus = "draft" | "published";
export interface TeamComp {
  id: number;
  slug: string;
  status: CompStatus;
  sort: number;
  content: CompContent;
}

export const COMP_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Lit un contenu stocké sans planter : null si la compo est inutilisable. */
export function parseComp(raw: unknown): CompContent | null {
  const r = compContentSchema.safeParse(raw ?? {});
  return r.success ? r.data : null;
}

export const COMP_DIFFICULTY = ["", "Accessible", "Intermédiaire", "Exigeante"];
