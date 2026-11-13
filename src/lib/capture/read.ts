/**
 * Lecture d'une capture d'écran du tableau des scores de Marvel Rivals, entièrement dans le navigateur.
 *
 * 1. On repère le bandeau sombre des en-têtes du tableau : il donne l'échelle et la position.
 * 2. L'image est ramenée à un repère fixe de 1920 × 1080, où chaque case a une position connue.
 * 3. Le texte (pseudos, chiffres, carte, ID de replay) est lu par tesseract.js, servi depuis /ocr.
 * 4. Les bannières de héros et les vignettes « Héros utilisés » sont réduites à une empreinte
 *    (quelques centaines d'octets) que l'app compare aux empreintes déjà identifiées.
 *
 * Aucune image ne quitte le navigateur : seuls les chiffres et les empreintes sont envoyés.
 */
import { encodeFp } from "./match";

export type CaptureStats = {
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  final_hits: number | null;
  damage: number | null;
  damage_blocked: number | null;
  healing: number | null;
  accuracy: number | null;
};

export type CaptureRow = {
  /** 0 à 5 : équipe du haut ; 6 à 11 : équipe du bas. */
  index: number;
  team: 0 | 1;
  /** Ligne surlignée : le joueur qui a pris la capture. */
  me: boolean;
  name: string;
  /** Pseudo masqué par la fenêtre « Héros utilisés ». */
  nameHidden: boolean;
  /** Badge MVP ou SVP à gauche de la ligne. */
  award: boolean;
  fp: string;
  /** Empreinte de l'icône de rôle (Vanguard, Duelist ou Strategist) affichée à gauche de la ligne. */
  roleFp: string;
  thumb: string;
  stats: CaptureStats | null;
};

export type CapturePopover = {
  /** Ligne à laquelle la fenêtre est accrochée, si on a pu la déterminer. */
  row: number | null;
  avatars: { fp: string; thumb: string }[];
};

export type ParsedCapture = {
  replayId: string | null;
  /** Résultat de l'équipe du haut (celle du joueur qui a pris la capture). */
  result: "win" | "loss" | null;
  mapLabel: string;
  modeLabel: string;
  durationMin: number | null;
  rows: CaptureRow[];
  popover: CapturePopover | null;
};

export type Reader = {
  /** Lit les en-têtes, les pseudos et les empreintes. Les stats ne sont lues que pour les lignes demandées. */
  read(file: Blob, onProgress?: (done: number, total: number) => void): Promise<{ capture: ParsedCapture; readStats: (rows: number[]) => Promise<void> } | null>;
  close(): Promise<void>;
};

// --- Repère fixe : le bandeau d'en-têtes va de x = 160 à 1760 et de y = 206 à 246 ---
const W = 1920;
const H = 1080;
const HEADER = { x: 160, y: 206, w: 1600 };
const ROW_H = 48;
const rowTop = (index: number) => (index < 6 ? 246 + ROW_H * index : 544 + ROW_H * (index - 6));

type Box = [x0: number, y0: number, x1: number, y1: number];
const NAME_X: [number, number] = [530, 745];
const STAT_X: Record<keyof CaptureStats, [number, number]> = {
  kills: [750, 810],
  deaths: [808, 862],
  assists: [862, 920],
  final_hits: [1130, 1245],
  damage: [1250, 1375],
  damage_blocked: [1380, 1512],
  healing: [1512, 1632],
  accuracy: [1650, 1750],
};
const STAT_KEYS = Object.keys(STAT_X) as (keyof CaptureStats)[];
const META_BOX: Box = [1100, 8, 1662, 66];
const REPLAY_BOX: Box = [1560, 884, 1758, 918];
const TITLE_BOX: Box = [30, 15, 400, 110];
const BADGE_X: [number, number] = [50, 140];
const BANNER_X: [number, number] = [270, 340];
const ROLE_X: [number, number] = [176, 220];
const THUMB_X: [number, number] = [218, 398];
const POPOVER_X: [number, number] = [405, 720];
const AVATAR = { x: 411, step: 62, size: 54, dy: 56, max: 5 };

type Pixels = { data: Uint8ClampedArray; w: number; h: number };
const at = (p: Pixels, x: number, y: number) => (y * p.w + x) * 4;

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

/** Bandeau des en-têtes : la plus haute bande de lignes sombres qui couvre plus de 60 % de la largeur. */
function findHeader(p: Pixels): { x: number; y: number; w: number } | null {
  const isDark = (i: number) => {
    const r = p.data[i], g = p.data[i + 1], b = p.data[i + 2];
    return r + g + b < 200 && Math.abs(r - b) < 30;
  };
  const step = Math.max(1, Math.floor(p.w / 640));
  const samples = Math.floor(p.w / step);
  let best: { y0: number; y1: number } | null = null;
  let run = -1;
  for (let y = 0; y <= p.h; y++) {
    let dark = 0;
    if (y < p.h) for (let x = 0; x < p.w; x += step) if (isDark(at(p, x, y))) dark++;
    const ok = y < p.h && dark / samples > 0.6;
    if (ok && run < 0) run = y;
    if (!ok && run >= 0) {
      if (y - run >= 8 && (!best || y - run > best.y1 - best.y0)) best = { y0: run, y1: y };
      run = -1;
    }
  }
  if (!best) return null;
  const rows = best.y1 - best.y0;
  let x0 = -1, x1 = -1, marked = 0;
  for (let x = 0; x < p.w; x++) {
    let dark = 0;
    for (let y = best.y0; y < best.y1; y++) if (isDark(at(p, x, y))) dark++;
    if (dark / rows > 0.8) {
      if (x0 < 0) x0 = x;
      x1 = x;
      marked++;
    }
  }
  const w = x1 - x0 + 1;
  if (x0 < 0 || w < p.w * 0.5 || marked < w * 0.8) return null;
  return { x: x0, y: best.y0, w };
}

/** Ramène la capture au repère fixe 1920 × 1080. */
async function toCanonical(file: Blob): Promise<Pixels | null> {
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width < 800 || bitmap.height < 450) return null;
    const src = makeCanvas(bitmap.width, bitmap.height);
    const sctx = src.getContext("2d", { willReadFrequently: true });
    if (!sctx) return null;
    sctx.drawImage(bitmap, 0, 0);
    const header = findHeader({ data: sctx.getImageData(0, 0, src.width, src.height).data, w: src.width, h: src.height });
    if (!header) return null;
    const s = header.w / HEADER.w;
    const out = makeCanvas(W, H);
    const ctx = out.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, header.x - HEADER.x * s, header.y - HEADER.y * s, W * s, H * s, 0, 0, W, H);
    return { data: ctx.getImageData(0, 0, W, H).data, w: W, h: H };
  } finally {
    bitmap.close();
  }
}

/** Couleur médiane d'une zone (le fond, puisque le texte occupe peu de place). */
function median(p: Pixels, [x0, y0, x1, y1]: Box): [number, number, number] {
  const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = at(p, x, y);
      hist[0][p.data[i]]++;
      hist[1][p.data[i + 1]]++;
      hist[2][p.data[i + 2]]++;
    }
  const half = ((x1 - x0) * (y1 - y0)) / 2;
  return hist.map((h) => {
    let acc = 0;
    for (let v = 0; v < 256; v++) {
      acc += h[v];
      if (acc >= half) return v;
    }
    return 255;
  }) as [number, number, number];
}

/** Zone préparée pour la lecture : texte noir sur fond blanc (écart à la couleur de fond), agrandie trois fois. */
function prep(p: Pixels, box: Box, scale = 3): HTMLCanvasElement {
  const [x0, y0, x1, y1] = box;
  const bw = x1 - x0, bh = y1 - y0;
  const bg = median(p, box);
  const small = makeCanvas(bw, bh);
  const sctx = small.getContext("2d")!;
  const img = sctx.createImageData(bw, bh);
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) {
      const i = at(p, x0 + x, y0 + y);
      const d = Math.abs(p.data[i] - bg[0]) + Math.abs(p.data[i + 1] - bg[1]) + Math.abs(p.data[i + 2] - bg[2]);
      const v = 255 - Math.min(255, d * 1.6);
      const o = (y * bw + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = v;
      img.data[o + 3] = 255;
    }
  sctx.putImageData(img, 0, 0);
  const pad = 12;
  const out = makeCanvas(bw * scale + pad * 2, bh * scale + pad * 2);
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(small, pad, pad, bw * scale, bh * scale);
  return out;
}

/** Empreinte : moyenne des couleurs sur une grille gw × gh (indépendante du navigateur). */
function fingerprint(p: Pixels, [x0, y0, x1, y1]: Box, gw: number, gh: number): string {
  const out = new Uint8Array(gw * gh * 3);
  const cw = (x1 - x0) / gw, ch = (y1 - y0) / gh;
  for (let gy = 0; gy < gh; gy++)
    for (let gx = 0; gx < gw; gx++) {
      const ax = Math.round(x0 + gx * cw), bx = Math.round(x0 + (gx + 1) * cw);
      const ay = Math.round(y0 + gy * ch), by = Math.round(y0 + (gy + 1) * ch);
      let r = 0, g = 0, b = 0, n = 0;
      for (let y = ay; y < by; y++)
        for (let x = ax; x < bx; x++) {
          const i = at(p, x, y);
          r += p.data[i];
          g += p.data[i + 1];
          b += p.data[i + 2];
          n++;
        }
      const o = (gy * gw + gx) * 3;
      out[o] = r / n;
      out[o + 1] = g / n;
      out[o + 2] = b / n;
    }
  return encodeFp(out);
}

/** Forme d'une icône claire sur fond uni : part de pixels nettement plus clairs que le fond, sur une grille. */
function inkGrid(p: Pixels, [x0, y0, x1, y1]: Box, gw: number, gh: number): string {
  const bg = median(p, [x0, y0, x1, y1]);
  const base = (bg[0] + bg[1] + bg[2]) / 3;
  const out = new Uint8Array(gw * gh);
  const cw = (x1 - x0) / gw, ch = (y1 - y0) / gh;
  for (let gy = 0; gy < gh; gy++)
    for (let gx = 0; gx < gw; gx++) {
      const ax = Math.round(x0 + gx * cw), bx = Math.round(x0 + (gx + 1) * cw);
      const ay = Math.round(y0 + gy * ch), by = Math.round(y0 + (gy + 1) * ch);
      let ink = 0, n = 0;
      for (let y = ay; y < by; y++)
        for (let x = ax; x < bx; x++) {
          const i = at(p, x, y);
          if ((p.data[i] + p.data[i + 1] + p.data[i + 2]) / 3 - base > 25) ink++;
          n++;
        }
      out[gy * gw + gx] = (ink / n) * 255;
    }
  return encodeFp(out);
}

function thumb(p: Pixels, [x0, y0, x1, y1]: Box): string {
  const c = makeCanvas(x1 - x0, y1 - y0);
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(c.width, c.height);
  for (let y = 0; y < c.height; y++) {
    const from = at(p, x0, y0 + y);
    img.data.set(p.data.subarray(from, from + c.width * 4), y * c.width * 4);
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/jpeg", 0.85);
}

/** Force des contours horizontaux : élevée là où un badge MVP / SVP est dessiné. */
function edgeEnergy(p: Pixels, [x0, y0, x1, y1]: Box): number {
  let sum = 0, n = 0;
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1 - 1; x++) {
      const i = at(p, x, y), j = i + 4;
      sum += Math.abs(p.data[i] + p.data[i + 1] + p.data[i + 2] - p.data[j] - p.data[j + 1] - p.data[j + 2]) / 3;
      n++;
    }
  return sum / n;
}

function fraction(p: Pixels, [x0, y0, x1, y1]: Box, test: (r: number, g: number, b: number) => boolean): number {
  let hit = 0, n = 0;
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = at(p, x, y);
      if (test(p.data[i], p.data[i + 1], p.data[i + 2])) hit++;
      n++;
    }
  return hit / n;
}

const panelDark = (r: number, g: number, b: number) => r + g + b < 140 && Math.abs(r - b) < 25;

/** Fenêtre « Héros utilisés » : panneau sombre posé sur la colonne des pseudos. */
function findPopover(p: Pixels): CapturePopover | null {
  // Le haut du panneau (titre « Héros utilisés ») est une bande sombre continue d'au moins 30 lignes
  let top = -1, run = -1;
  for (let y = 246; y <= 900 && top < 0; y++) {
    const ok = y < 900 && fraction(p, [POPOVER_X[0], y, POPOVER_X[1], y + 1], panelDark) > 0.7;
    if (ok && run < 0) run = y;
    if (!ok && run >= 0) {
      if (y - run >= 30) top = run;
      run = -1;
    }
  }
  if (top < 0) return null;
  const avatars: CapturePopover["avatars"] = [];
  const y0 = top + AVATAR.dy;
  for (let k = 0; k < AVATAR.max; k++) {
    const x0 = AVATAR.x + AVATAR.step * k;
    const box: Box = [x0, y0, x0 + AVATAR.size, y0 + AVATAR.size];
    // Une vignette n'est jamais un aplat sombre : on s'arrête à la première case vide
    if (fraction(p, box, panelDark) > 0.85) break;
    const inset: Box = [x0 + 4, y0 + 4, x0 + AVATAR.size - 4, y0 + AVATAR.size - 4];
    avatars.push({ fp: fingerprint(p, inset, 10, 10), thumb: thumb(p, box) });
  }
  if (!avatars.length) return null;
  // La fenêtre s'ouvre au niveau de la ligne cliquée
  let row: number | null = null;
  for (let i = 0; i < 12; i++) if (Math.abs(top - rowTop(i) - 2) <= 8) row = i;
  return { row, avatars };
}

const cleanName = (s: string) => s.replace(/\s+/g, " ").trim().slice(0, 40);

function parseInteger(text: string, max: number): number | null {
  const digits = text.replace(/[^0-9]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) && n <= max ? n : null;
}

const STAT_MAX: Record<keyof CaptureStats, number> = {
  kills: 300,
  deaths: 300,
  assists: 300,
  final_hits: 300,
  damage: 999_999,
  damage_blocked: 999_999,
  healing: 999_999,
  accuracy: 100,
};

/** Ouvre le moteur de lecture (≈ 7 Mo au premier usage, mis en cache ensuite par le navigateur). */
export async function createReader(): Promise<Reader> {
  const { createWorker, PSM, OEM } = await import("tesseract.js");
  const worker = await createWorker("eng", OEM.LSTM_ONLY, {
    workerPath: "/ocr/worker.min.js",
    corePath: "/ocr/core",
    langPath: "/ocr/lang",
    gzip: true,
  });

  let current = "";
  async function ocr(canvas: HTMLCanvasElement, mode: "line" | "block", whitelist = ""): Promise<string> {
    const key = `${mode}|${whitelist}`;
    if (key !== current) {
      await worker.setParameters({
        tessedit_pageseg_mode: mode === "line" ? PSM.SINGLE_LINE : PSM.SINGLE_BLOCK,
        tessedit_char_whitelist: whitelist,
      });
      current = key;
    }
    const { data } = await worker.recognize(canvas);
    return data.text.trim();
  }

  const DIGITS = "0123456789%";

  return {
    async read(file, onProgress) {
      const p = await toCanonical(file);
      if (!p) return null;
      const total = 14;
      let done = 0;
      const tick = () => onProgress?.(++done, total);

      // En-tête : carte, mode, durée (trois lignes alignées à droite)
      const meta = (await ocr(prep(p, META_BOX), "block")).split("\n").map((l) => l.trim()).filter(Boolean);
      tick();
      const timeLine = meta.findIndex((l) => /\d{1,2}\s*[:.]\s*\d{2}\s*[:.]\s*\d{2}/.test(l));
      let durationMin: number | null = null;
      if (timeLine >= 0) {
        const [h, m, s] = meta[timeLine].match(/\d+/g)!.map(Number);
        const minutes = h * 60 + m + s / 60;
        if (minutes > 0 && minutes < 120) durationMin = Math.round(minutes * 10) / 10;
      }
      const labels = timeLine >= 0 ? meta.slice(0, timeLine) : meta;
      const modeLabel = labels.length >= 2 ? labels[labels.length - 1] : "";
      const mapLabel = labels.length >= 2 ? labels.slice(0, -1).join(" ") : (labels[0] ?? "");

      const replayText = await ocr(prep(p, REPLAY_BOX), "line");
      tick();
      const replayId = replayText.replace(/\s/g, "").match(/\d{8,14}/)?.[0] ?? null;

      const rows: CaptureRow[] = [];
      for (let index = 0; index < 12; index++) {
        const y = rowTop(index);
        const cell = median(p, [STAT_X.kills[0], y + 6, STAT_X.kills[1], y + 42]);
        const nameBox: Box = [NAME_X[0], y + 4, NAME_X[1], y + 44];
        const nameBg = median(p, nameBox);
        const nameHidden = nameBg[0] + nameBg[1] + nameBg[2] < 200;
        rows.push({
          index,
          team: index < 6 ? 0 : 1,
          me: cell[2] - cell[0] > 15,
          name: nameHidden ? "" : cleanName(await ocr(prep(p, nameBox), "line")),
          nameHidden,
          award: edgeEnergy(p, [BADGE_X[0], y, BADGE_X[1], y + 46]) > 5.5,
          fp: fingerprint(p, [BANNER_X[0], y + 2, BANNER_X[1], y + 44], 14, 8),
          roleFp: inkGrid(p, [ROLE_X[0], y + 4, ROLE_X[1], y + 42], 10, 9),
          thumb: thumb(p, [THUMB_X[0], y + 1, THUMB_X[1], y + 46]),
          stats: null,
        });
        tick();
      }

      // Victoire : le titre et la bande de gauche sont jaunes. Sinon, le badge MVP désigne l'équipe gagnante.
      const yellow = fraction(p, TITLE_BOX, (r, g, b) => r > 220 && g > 170 && b < 110);
      const title = fraction(p, TITLE_BOX, (r, g, b) => r > 235 && g > 235 && b > 235);
      const result: ParsedCapture["result"] = title < 0.02 ? null : yellow > 0.08 ? "win" : "loss";

      const capture: ParsedCapture = { replayId, result, mapLabel, modeLabel, durationMin, rows, popover: findPopover(p) };

      async function readStats(indexes: number[]) {
        for (const index of indexes) {
          const row = rows[index];
          if (!row || row.stats) continue;
          const y = rowTop(index);
          const stats = {} as CaptureStats;
          for (const k of STAT_KEYS) {
            const canvas = prep(p!, [STAT_X[k][0], y + 6, STAT_X[k][1], y + 42]);
            let text = await ocr(canvas, "line", DIGITS);
            // Un chiffre seul (« 9 ») échappe parfois à la lecture en mode ligne
            if (!/\d/.test(text)) text = await ocr(canvas, "block", DIGITS);
            stats[k] = parseInteger(text, STAT_MAX[k]);
          }
          row.stats = stats;
        }
      }
      return { capture, readStats };
    },
    async close() {
      await worker.terminate();
    },
  };
}
