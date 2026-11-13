/**
 * Rapprochements utilisés par l'import de capture : empreintes d'images (héros), pseudos, cartes.
 * Fonctions pures, sans accès au navigateur : utilisables côté client comme côté serveur.
 */

export type Fingerprint = { id?: number; kind: "banner" | "avatar"; hero_id: number; fp: string };

/** Écart moyen par composante (0 = identique, 255 = opposé). */
export const FP_MAX_DISTANCE = { banner: 28, avatar: 28 } as const;
/** En dessous de cet écart, l'empreinte est déjà connue : inutile de l'enregistrer à nouveau. */
export const FP_SAME = 6;

export function decodeFp(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function encodeFp(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export function fpDistance(a: Uint8Array, b: Uint8Array): number {
  if (a.length !== b.length || !a.length) return 255;
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

export type FpIndex = { kind: Fingerprint["kind"]; hero_id: number; bytes: Uint8Array }[];

export function buildFpIndex(list: Fingerprint[]): FpIndex {
  const out: FpIndex = [];
  for (const f of list) {
    try {
      out.push({ kind: f.kind, hero_id: f.hero_id, bytes: decodeFp(f.fp) });
    } catch {
      // empreinte illisible : ignorée
    }
  }
  return out;
}

/** Héros le plus proche d'une empreinte, ou null si rien n'est assez ressemblant. */
export function nearestHero(index: FpIndex, kind: Fingerprint["kind"], fp: string): { hero_id: number; distance: number } | null {
  let bytes: Uint8Array;
  try {
    bytes = decodeFp(fp);
  } catch {
    return null;
  }
  let best: { hero_id: number; distance: number } | null = null;
  for (const f of index) {
    if (f.kind !== kind) continue;
    const d = fpDistance(bytes, f.bytes);
    if (!best || d < best.distance) best = { hero_id: f.hero_id, distance: d };
  }
  return best && best.distance <= FP_MAX_DISTANCE[kind] ? best : null;
}

const strip = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Pseudo ramené à une forme qui absorbe les confusions de lecture courantes (1/l/i, 0/o, 5/s…). */
export function nameKey(s: string): string {
  return strip(s)
    .replace(/[^a-z0-9]/g, "")
    .replace(/[1il|]/g, "l")
    .replace(/[0o]/g, "o")
    .replace(/5/g, "s")
    .replace(/8/g, "b")
    .replace(/rn/g, "m");
}

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/** Deux pseudos désignent-ils le même joueur, à une erreur de lecture près ? */
export function sameName(read: string, known: string): boolean {
  const a = nameKey(read);
  const b = nameKey(known);
  if (!a || !b) return false;
  if (a === b) return true;
  return Math.min(a.length, b.length) >= 6 && editDistance(a, b) <= 1;
}

/** Libellé de carte tel que lu sur la capture, ramené à une clé stable (sans accents ni ponctuation). */
export function mapKey(label: string): string {
  return strip(label)
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Mode de jeu lu en haut de la capture (« CONVOI », « DOMINATION »…) → nom du référentiel. */
export function matchMode<T extends { id: number; name: string }>(label: string, modes: T[]): T | null {
  const key = mapKey(label).replace(/ /g, "");
  if (key.length < 4) return null;
  let best: { mode: T; d: number } | null = null;
  for (const m of modes) {
    const d = editDistance(key, mapKey(m.name).replace(/ /g, ""));
    if (d <= 2 && (!best || d < best.d)) best = { mode: m, d };
  }
  return best?.mode ?? null;
}

/** Carte : alias déjà appris d'abord, sinon nom du référentiel. Tolère deux erreurs de lecture. */
export function matchMap<T extends { id: number; name: string }>(label: string, maps: T[], aliases: { label: string; map_id: number }[]): T | null {
  const key = mapKey(label).replace(/ /g, "");
  if (key.length < 4) return null;
  let best: { id: number; d: number } | null = null;
  const consider = (candidate: string, id: number) => {
    const d = editDistance(key, candidate.replace(/ /g, ""));
    if (d <= 2 && (!best || d < best.d)) best = { id, d };
  };
  for (const a of aliases) consider(a.label, a.map_id);
  for (const m of maps) consider(mapKey(m.name), m.id);
  const found = best as { id: number; d: number } | null;
  return found ? (maps.find((m) => m.id === found.id) ?? null) : null;
}
