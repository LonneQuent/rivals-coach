import { z } from "zod";
import { ROLES, type Role } from "@/lib/types";

export const SECTION_KINDS = ["default", "tips", "mistakes"] as const;
export type SectionKind = (typeof SECTION_KINDS)[number];

/** Schémas tactiques dessinés par l'app (vue de dessus), voir components/diagrams.tsx. */
export const DIAGRAMS = ["angle", "dive", "brawl", "peel", "pull", "poke", "flank"] as const;
export type DiagramKind = (typeof DIAGRAMS)[number];

const imageUrl = z.string().trim().max(500).regex(/^https:\/\//, "Lien https attendu");

const section = z.object({
  title: z.string().trim().min(1).max(80),
  /** Phrase d'introduction, affichée en plus gros avant la liste. */
  lead: z.string().max(500).optional().default(""),
  /** Nom de la capacité en jeu (« Joyful Splash »). */
  ability: z.string().max(60).optional().default(""),
  /** Touche par défaut (« Clic G », « Maj », « Q »). */
  key: z.string().max(20).optional().default(""),
  /** default : liste classique · tips : astuces mises en avant · mistakes : bloc « À éviter ». */
  kind: z.enum(SECTION_KINDS).optional().default("default"),
  items: z.array(z.string().trim().min(1).max(400)).max(20),
  /** Icône de la capacité (image du bucket), à la place de l'icône générique. */
  icon: imageUrl.optional().or(z.literal("")).default(""),
  /** Capture d'écran ou schéma envoyé par un admin. */
  image: z.object({ url: imageUrl, caption: z.string().trim().max(160).default("") }).optional(),
  /** Schéma tactique dessiné par l'app. */
  diagram: z.enum(DIAGRAMS).optional().or(z.literal("")).default(""),
});

const comboStep = z.object({
  /** Touche (« Clic G », « E ») ; vide si l'étape est une action sans touche (« saut »). */
  key: z.string().trim().max(14).optional().default(""),
  label: z.string().trim().max(24).optional().default(""),
});

const combo = z.object({
  title: z.string().trim().min(1).max(60),
  steps: z.array(comboStep).min(2).max(10),
  note: z.string().trim().max(200).optional().default(""),
});

export const guideContentSchema = z.object({
  summary: z.string().max(1000).default(""),
  patch_note: z.string().max(500).optional().default(""),
  /** Les 3 ou 4 choses à retenir, affichées en ouverture. */
  tldr: z.array(z.string().trim().min(1).max(160)).max(4).optional().default([]),
  /** 1 = accessible, 2 = intermédiaire, 3 = exigeant. 0 = non renseigné. */
  difficulty: z.number().int().min(0).max(3).optional().default(0),
  /** Style de jeu en quelques mots (« Flanc », « Pression backline »). */
  tags: z.array(z.string().trim().min(1).max(30)).max(5).optional().default([]),
  sections: z.array(section).max(12).default([]),
  /** Enchaînements de touches, affichés en bandeau. */
  combos: z.array(combo).max(6).optional().default([]),
  counters: z.array(z.object({ hero: z.string().max(60), note: z.string().max(300) })).max(15).default([]),
  synergies: z.array(z.object({ hero: z.string().max(60), note: z.string().max(300) })).max(15).default([]),
  sources: z.array(z.object({ title: z.string().max(150), author: z.string().max(100), url: z.string().url().optional().or(z.literal("")) })).max(10).default([]),
});

export type GuideContent = z.infer<typeof guideContentSchema>;
export type GuideSection = GuideContent["sections"][number];
export type GuideCombo = GuideContent["combos"][number];
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

const EMPTY: GuideContent = { summary: "", patch_note: "", tldr: [], difficulty: 0, tags: [], sections: [], combos: [], counters: [], synergies: [], sources: [] };

/**
 * Lit un contenu stocké en base sans jamais planter sur un champ manquant.
 * Compatibilité : un titre « Soin (Joyful Splash) » est découpé en titre + capacité,
 * et une section intitulée « Erreurs… » devient un bloc « À éviter ».
 */
export function parseContent(raw: unknown): GuideContent {
  const r = guideContentSchema.safeParse(raw ?? {});
  if (!r.success) return EMPTY;
  return {
    ...r.data,
    sections: r.data.sections.map((s) => {
      let { title, ability, kind } = s;
      const m = title.match(/^(.*?)\s*\((.+)\)\s*$/);
      if (m && !ability) {
        title = m[1];
        ability = m[2];
      }
      if (kind === "default" && /^erreurs?/i.test(title)) kind = "mistakes";
      return { ...s, title, ability, kind };
    }),
  };
}

/** Identifiant d'ancre stable pour le sommaire. */
export const sectionAnchor = (title: string, i: number) =>
  `s-${i}-${title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

/**
 * Lit une ligne de combo saisie dans l'admin : « Clic G:tir > E:coup de pied > Clic G ».
 * Chaque étape est « touche:libellé », « touche » seule, ou un libellé entre crochets « [saut] ».
 */
export function parseComboSteps(line: string): GuideCombo["steps"] {
  return line
    .split(/\s*(?:>|→)\s*/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const bracket = raw.match(/^\[(.+)\]$/);
      if (bracket) return { key: "", label: bracket[1].trim().slice(0, 24) };
      const [k, ...rest] = raw.split(":");
      return { key: k.trim().slice(0, 14), label: rest.join(":").trim().slice(0, 24) };
    });
}

export function formatComboSteps(steps: GuideCombo["steps"]): string {
  return steps.map((s) => (s.key ? (s.label ? `${s.key}:${s.label}` : s.key) : `[${s.label}]`)).join(" > ");
}

export const roleSlug = (r: Role) => r.toLowerCase();
export const roleFromSlug = (s: string): Role | null => ROLES.find((r) => r.toLowerCase() === s.toLowerCase()) ?? null;
