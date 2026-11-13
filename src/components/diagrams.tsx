import type { DiagramKind, SceneEl, TacticScene } from "@/lib/guides";

/*
 * Schémas tactiques originaux, vus de dessus (repère 320 × 180).
 * Alliés à gauche en bleu, ennemis à droite en rouge, « toi » en couleur d'accent.
 * Un schéma raconte une action : les éléments numérotés se lisent dans l'ordre des étapes
 * listées sous le dessin, et un point lumineux parcourt chaque trajet à son tour.
 * Vocabulaire : on garde le jargon que les joueurs utilisent en jeu (dive, peel, poke, flank…).
 */

const ALLY = "#6fa8ff";
const ENEMY = "var(--color-bad)";
const ME = "var(--color-accent)";
const HEAL = "var(--color-good)";
const INK = "#0e1015";

type Team = "me" | "ally" | "enemy";
type Glyph = "tank" | "dps" | "heal";
type Pt = [number, number];
type Pawn = Extract<SceneEl, { t: "pawn" }>;
type PathEl = Extract<SceneEl, { t: "path" }>;
type PresetScene = Omit<TacticScene, "steps" | "caption"> & { caption: string; steps?: string[]; me?: Glyph };

const color = (t: Team) => (t === "ally" ? ALLY : t === "enemy" ? ENEMY : ME);

// Raccourcis d'écriture des scènes génériques
const pawn = (x: number, y: number, team: Team, role?: Glyph, extra: Partial<Pawn> = {}): Pawn => ({ t: "pawn", at: [x, y], team, role, ...extra });
const path = (kind: PathEl["kind"], team: Team, pts: Pt[], n?: number): PathEl => ({ t: "path", kind, team, pts, n });
const cover = (x: number, y: number, w: number, h: number): SceneEl => ({ t: "cover", at: [x, y], size: [w, h] });
/** Une équipe ennemie type : tank devant, deux DPS, deux heals derrière. */
const enemyTeam = (dx = 0): Pawn[] => [pawn(214 + dx, 92, "enemy", "tank"), pawn(244 + dx, 58, "enemy", "dps"), pawn(244 + dx, 126, "enemy", "dps"), pawn(284 + dx, 74, "enemy", "heal"), pawn(284 + dx, 112, "enemy", "heal")];
/** Pion du partenaire conseillé : son portrait remplace l'icône sur une fiche héros. */
const PARTNER = "@ally";

export const DIAGRAM_SCENES: Record<DiagramKind, PresetScene> = {
  angle: {
    me: "dps",
    title: "Off-angle",
    caption: "Ne tire pas dans le bouclier : décale-toi sur le côté pour toucher la backline qu'il protège.",
    steps: ["Ton équipe occupe le tank adverse de face.", "Tu te décales sur un angle, à couvert.", "Tu tires sur la backline, hors du bouclier."],
    els: [
      cover(126, 14, 16, 40),
      { t: "bar", from: [198, 66], to: [198, 124], team: "enemy", label: "Bouclier" },
      path("shot", "ally", [[90, 66], [190, 90]], 1),
      path("move", "me", [[92, 116], [100, 56], [158, 36]], 2),
      path("shot", "me", [[158, 36], [284, 112]], 3),
      pawn(112, 96, "ally", "tank"),
      pawn(90, 66, "ally", "dps"),
      pawn(70, 140, "ally", "heal"),
      pawn(40, 96, "ally", "heal"),
      pawn(92, 116, "me", undefined, { ghost: true }),
      pawn(158, 36, "me", undefined, { label: "Toi", above: true }),
      ...enemyTeam(),
    ],
  },
  dive: {
    me: "dps",
    title: "Dive à deux",
    caption: "Un diver seul se fait punir. À deux sur la même cible, le heal adverse meurt avant d'avoir pu réagir.",
    steps: ["Vous partez en même temps, chacun par un côté.", "Vous frappez la même cible : le heal isolé.", "Kill ou pas, vous ressortez avant que l'équipe se retourne."],
    els: [
      path("move", "me", [[92, 44], [176, 2], [262, 58]], 1),
      path("move", "ally", [[92, 140], [200, 178], [296, 108]], 1),
      path("shot", "me", [[262, 58], [284, 82]], 2),
      path("shot", "ally", [[296, 108], [284, 82]], 2),
      pawn(92, 44, "me", undefined, { ghost: true }),
      pawn(92, 140, "ally", "dps", { ghost: true }),
      pawn(60, 92, "ally", "tank"),
      pawn(30, 70, "ally", "heal"),
      pawn(30, 116, "ally", "heal"),
      pawn(204, 92, "enemy", "tank"),
      pawn(226, 44, "enemy", "dps"),
      pawn(240, 134, "enemy", "dps"),
      pawn(284, 82, "enemy", "heal", { label: "Cible" }),
      pawn(290, 152, "enemy", "heal"),
      pawn(262, 58, "me", undefined, { label: "Toi", above: true }),
      pawn(296, 108, "ally", "dps", { hero: PARTNER }),
    ],
  },
  reset: {
    me: "dps",
    title: "Engage puis reset",
    caption: "Un dive se termine toujours par un retour : tu ne restes pas dans la backline une fois tes cooldowns dépensés.",
    steps: ["Tu entres par le côté sur une cible isolée.", "Tu la tues, ou tu la forces à dépenser ses cooldowns.", "Tu reviens vers ton équipe recharger avant de repartir."],
    els: [
      path("move", "me", [[84, 60], [170, 8], [272, 62]], 1),
      path("move", "me", [[280, 86], [204, 172], [108, 130]], 3),
      pawn(84, 60, "me", undefined, { ghost: true }),
      pawn(70, 96, "ally", "tank"),
      pawn(40, 70, "ally", "heal"),
      pawn(40, 124, "ally", "heal"),
      pawn(52, 154, "ally", "dps"),
      pawn(214, 92, "enemy", "tank"),
      pawn(244, 50, "enemy", "dps"),
      pawn(244, 130, "enemy", "dps"),
      pawn(284, 120, "enemy", "heal"),
      pawn(284, 74, "enemy", "heal", { ko: true }),
      { t: "note", at: [298, 60], text: "2", team: "me" },
      pawn(104, 128, "me", undefined, { label: "Toi" }),
    ],
  },
  brawl: {
    me: "dps",
    title: "Brawl",
    caption: "Tout le monde au contact, dans la portée des heals, et toute l'équipe sur la même cible.",
    steps: ["Le tank avance et prend le passage.", "L'équipe suit groupée, à portée de soin.", "Tous les dégâts sur la même cible : le tank adverse d'abord."],
    els: [
      cover(150, 0, 34, 58),
      cover(150, 124, 34, 56),
      { t: "zone", at: [102, 92], r: 42, team: "ally", label: "Portée des heals", n: 2 },
      path("move", "ally", [[128, 91], [186, 91]], 1),
      path("shot", "ally", [[96, 62], [214, 92]], 3),
      path("shot", "me", [[104, 124], [214, 92]], 3),
      pawn(128, 91, "ally", "tank"),
      pawn(96, 62, "ally", "dps"),
      pawn(104, 124, "me", undefined, { label: "Toi" }),
      pawn(72, 78, "ally", "heal"),
      pawn(70, 108, "ally", "heal"),
      ...enemyTeam(),
    ],
  },
  space: {
    me: "tank",
    title: "Créer de l'espace",
    caption: "Chaque mètre que tu prends recule l'équipe adverse et ouvre des angles à tes DPS.",
    steps: ["Tu avances, bouclier levé, en restant à portée de tes heals.", "Ton équipe occupe le terrain que tu as libéré.", "L'adversaire recule ou se bat sur ton terrain."],
    els: [
      { t: "area", at: [96, 30], size: [86, 124], label: "Espace gagné", team: "ally" },
      { t: "bar", from: [198, 62], to: [198, 122], team: "me" },
      path("move", "me", [[110, 92], [184, 92]], 1),
      path("move", "ally", [[62, 60], [128, 60]], 2),
      path("move", "ally", [[62, 128], [128, 128]], 2),
      pawn(110, 92, "me", undefined, { ghost: true }),
      pawn(184, 92, "me", undefined, { label: "Toi", above: true }),
      pawn(128, 60, "ally", "dps"),
      pawn(128, 128, "ally", "dps"),
      pawn(50, 82, "ally", "heal"),
      pawn(46, 116, "ally", "heal"),
      pawn(236, 92, "enemy", "tank"),
      pawn(258, 56, "enemy", "dps"),
      pawn(260, 130, "enemy", "dps"),
      pawn(296, 78, "enemy", "heal"),
      pawn(296, 112, "enemy", "heal"),
    ],
  },
  peel: {
    me: "tank",
    title: "Peel",
    caption: "Un fight ne se gagne pas si tes heals meurent : les protéger passe avant ta propre cible.",
    steps: ["Un diver saute sur ta backline.", "Tu te retournes immédiatement.", "Tu le contrôles ou tu le chasses, puis tu reprends ta place."],
    els: [
      path("move", "enemy", [[150, 26], [100, 40], [58, 108]], 1),
      path("move", "me", [[168, 104], [132, 118], [92, 118]], 2),
      path("shot", "me", [[92, 118], [58, 108]], 3),
      pawn(150, 26, "enemy", "dps", { ghost: true }),
      pawn(34, 88, "ally", "heal"),
      pawn(30, 148, "ally", "heal"),
      pawn(58, 108, "enemy", "dps", { label: "Diver" }),
      pawn(168, 104, "me", undefined, { ghost: true }),
      pawn(92, 118, "me", undefined, { label: "Toi" }),
      pawn(172, 64, "ally", "tank"),
      pawn(150, 150, "ally", "dps"),
      pawn(236, 76, "enemy", "tank"),
      pawn(272, 112, "enemy", "dps"),
      pawn(292, 56, "enemy", "heal"),
      pawn(296, 146, "enemy", "heal"),
    ],
  },
  pull: {
    me: "dps",
    title: "Pick",
    caption: "Une cible déplacée au milieu de ton équipe meurt avant que ses heals aient une ligne de vue.",
    steps: ["Tu repères une cible avancée ou isolée.", "Tu l'attires dans la portée de ton équipe.", "Tout le monde tire dessus : le fight démarre à 6 contre 5."],
    els: [
      { t: "zone", at: [92, 92], r: 46, team: "ally", label: "Ton équipe" },
      path("sight", "me", [[150, 122], [216, 94]], 1),
      path("pull", "me", [[216, 92], [170, 70], [116, 90]], 2),
      pawn(216, 92, "enemy", "dps", { ghost: true }),
      pawn(116, 90, "enemy", "dps", { label: "Cible", above: true }),
      pawn(150, 122, "me", undefined, { label: "Toi" }),
      pawn(78, 62, "ally", "tank"),
      pawn(66, 114, "ally", "dps"),
      pawn(40, 88, "ally", "heal"),
      pawn(92, 138, "ally", "heal"),
      path("shot", "ally", [[78, 62], [116, 90]], 3),
      path("shot", "ally", [[66, 114], [116, 90]], 3),
      pawn(252, 58, "enemy", "tank"),
      pawn(256, 128, "enemy", "dps"),
      pawn(292, 76, "enemy", "heal"),
      pawn(292, 112, "enemy", "heal"),
    ],
  },
  poke: {
    me: "dps",
    title: "Poke derrière le bouclier",
    caption: "Le fight se gagne avant le contact : chaque cible entamée de loin force un heal ou un recul.",
    steps: ["Ton tank tient le bouclier, tu restes derrière.", "Tu uses les cibles à découvert, de loin.", "Quand une cible est basse, ton équipe avance."],
    els: [
      { t: "bar", from: [138, 54], to: [138, 130], team: "ally", label: "Bouclier", n: 1 },
      path("shot", "me", [[104, 82], [224, 92]], 2),
      path("shot", "me", [[104, 82], [254, 58]], 2),
      pawn(116, 110, "ally", "tank"),
      pawn(104, 82, "me", undefined, { label: "Toi", above: true }),
      pawn(88, 134, "ally", "dps"),
      pawn(56, 72, "ally", "heal"),
      pawn(50, 112, "ally", "heal"),
      ...enemyTeam(10),
    ],
  },
  highground: {
    me: "dps",
    title: "High ground",
    caption: "D'en haut, tu vois tout le fight, tu tires par-dessus les boucliers et un ennemi doit dépenser une capacité pour t'atteindre.",
    steps: ["Tu montes avant le début du fight.", "Tu tires par-dessus le bouclier, sur la backline.", "Si on vient te chercher, tu redescends vers ton équipe."],
    els: [
      { t: "area", at: [108, 8], size: [100, 46], label: "Hauteur" },
      { t: "bar", from: [196, 64], to: [196, 120], team: "enemy" },
      path("move", "me", [[98, 128], [96, 60], [172, 34]], 1),
      path("shot", "me", [[172, 34], [244, 126]], 2),
      path("shot", "me", [[172, 34], [284, 112]], 2),
      pawn(98, 128, "me", undefined, { ghost: true }),
      pawn(172, 34, "me", undefined, { label: "Toi" }),
      pawn(120, 102, "ally", "tank"),
      pawn(84, 90, "ally", "dps"),
      pawn(50, 70, "ally", "heal"),
      pawn(48, 124, "ally", "heal"),
      ...enemyTeam(),
    ],
  },
  flank: {
    me: "dps",
    title: "Flank",
    caption: "Une équipe attaquée de deux côtés à la fois doit choisir : se retourner vers toi, ou continuer à regarder ton tank.",
    steps: ["Ton équipe occupe l'avant et attire les regards.", "Tu contournes hors de vue.", "Tu frappes la backline dans le dos, au moment où le fight démarre."],
    els: [
      cover(120, 40, 130, 16),
      path("shot", "ally", [[126, 104], [214, 100]], 1),
      path("move", "me", [[86, 112], [70, 14], [170, 20], [300, 42]], 2),
      path("shot", "me", [[300, 42], [284, 80]], 3),
      pawn(86, 112, "me", undefined, { ghost: true }),
      pawn(300, 42, "me", undefined, { label: "Toi", above: true }),
      pawn(126, 104, "ally", "tank"),
      pawn(100, 138, "ally", "dps"),
      pawn(66, 92, "ally", "heal"),
      pawn(60, 132, "ally", "heal"),
      pawn(214, 100, "enemy", "tank"),
      pawn(244, 84, "enemy", "dps"),
      pawn(244, 134, "enemy", "dps"),
      pawn(284, 80, "enemy", "heal"),
      pawn(284, 120, "enemy", "heal"),
    ],
  },
  heal: {
    me: "heal",
    title: "Placement du heal",
    caption: "Ta position doit répondre à deux questions : est-ce que je vois toute mon équipe, et est-ce que je peux me cacher en une seconde ?",
    steps: ["Tu restes derrière ton tank, un couvert à portée.", "Tu gardes une ligne de vue sur tous tes alliés.", "Sous pression, tu passes derrière le couvert sans quitter le fight."],
    els: [
      cover(66, 114, 14, 40),
      path("heal", "me", [[56, 100], [146, 92]], 2),
      path("heal", "me", [[56, 100], [122, 52]], 2),
      path("heal", "me", [[56, 100], [126, 138]], 2),
      path("heal", "me", [[56, 100], [92, 68]], 2),
      pawn(146, 92, "ally", "tank"),
      pawn(122, 52, "ally", "dps"),
      pawn(126, 138, "ally", "dps"),
      pawn(92, 68, "ally", "heal"),
      pawn(56, 100, "me", undefined, { label: "Toi", above: true }),
      ...enemyTeam(6),
    ],
  },
  pocket: {
    me: "heal",
    title: "Pocket un diver",
    caption: "Un diver soigné pendant son engage gagne son duel ; un diver seul meurt dans la backline.",
    steps: ["Ton diver annonce qu'il part.", "Tu le suis à mi-distance, sans entrer dans la backline.", "Tu le soignes pendant le duel, puis vous ressortez ensemble."],
    els: [
      path("move", "ally", [[84, 54], [170, 4], [266, 62]], 1),
      path("move", "me", [[70, 112], [130, 92], [192, 62]], 2),
      path("heal", "me", [[192, 62], [266, 62]], 3),
      pawn(84, 54, "ally", "dps", { ghost: true }),
      pawn(70, 112, "me", undefined, { ghost: true }),
      pawn(266, 62, "ally", "dps", { hero: PARTNER, label: "Diver", above: true }),
      pawn(192, 62, "me", undefined, { label: "Toi" }),
      pawn(92, 96, "ally", "tank"),
      pawn(50, 132, "ally", "dps"),
      pawn(40, 80, "ally", "heal"),
      pawn(214, 106, "enemy", "tank"),
      pawn(246, 142, "enemy", "dps"),
      pawn(292, 84, "enemy", "heal"),
      pawn(288, 124, "enemy", "heal"),
      pawn(232, 34, "enemy", "dps"),
    ],
  },
  choke: {
    me: "dps",
    title: "Tenir une entrée",
    caption: "Un passage étroit regroupe les ennemis : tout ce que tu poses dessus touche plusieurs cibles.",
    steps: ["Tu poses tourelles, murs ou pièges sur le passage.", "L'ennemi doit traverser ta zone pour avancer.", "Ton équipe tire sur ce qui sort du passage."],
    els: [
      cover(168, 0, 30, 64),
      cover(168, 120, 30, 60),
      { t: "mark", at: [150, 76], kind: "turret", team: "me" },
      { t: "mark", at: [150, 108], kind: "turret", team: "me" },
      { t: "mark", at: [186, 92], kind: "trap", team: "me" },
      path("move", "enemy", [[262, 70], [230, 80], [208, 90]], 2),
      path("move", "enemy", [[262, 116], [232, 106], [210, 96]], 2),
      path("shot", "ally", [[104, 60], [204, 88]], 3),
      path("shot", "ally", [[104, 126], [204, 96]], 3),
      { t: "note", at: [150, 60], text: "1", team: "me" },
      pawn(118, 92, "me", undefined, { label: "Toi" }),
      pawn(104, 60, "ally", "dps"),
      pawn(104, 126, "ally", "dps"),
      pawn(60, 76, "ally", "heal"),
      pawn(60, 112, "ally", "heal"),
      pawn(262, 70, "enemy", "tank"),
      pawn(262, 116, "enemy", "dps"),
      pawn(294, 92, "enemy", "heal"),
      pawn(296, 142, "enemy", "dps"),
      pawn(296, 44, "enemy", "heal"),
    ],
  },
  ultcombo: {
    me: "dps",
    title: "Combo d'ults",
    caption: "Deux ults lancées ensemble gagnent un fight ; les deux mêmes lancées à dix secondes d'écart n'en gagnent aucun.",
    steps: ["Vous annoncez le combo avant le fight.", "L'ult de contrôle regroupe ou immobilise les ennemis.", "Les ults de dégâts tombent dessus dans la seconde."],
    els: [
      { t: "zone", at: [238, 92], r: 36, team: "me", label: "Ult de contrôle", n: 2 },
      path("pull", "me", [[284, 44], [270, 62], [250, 78]]),
      path("pull", "me", [[292, 146], [272, 126], [252, 108]]),
      path("shot", "ally", [[120, 56], [214, 82]], 3),
      path("shot", "ally", [[126, 128], [214, 104]], 3),
      path("shot", "me", [[136, 92], [208, 92]], 3),
      pawn(284, 44, "enemy", undefined, { small: true, ghost: true }),
      pawn(292, 146, "enemy", undefined, { small: true, ghost: true }),
      pawn(228, 84, "enemy", undefined, { small: true }),
      pawn(246, 100, "enemy", undefined, { small: true }),
      pawn(232, 106, "enemy", undefined, { small: true }),
      pawn(248, 80, "enemy", undefined, { small: true }),
      pawn(240, 92, "enemy", undefined, { small: true }),
      pawn(136, 92, "me", undefined, { label: "Toi" }),
      pawn(120, 56, "ally", "tank"),
      pawn(126, 128, "ally", "dps"),
      pawn(70, 74, "ally", "heal"),
      pawn(66, 116, "ally", "heal"),
    ],
  },
};

export const DIAGRAM_LABEL: Record<DiagramKind, string> = Object.fromEntries(
  Object.entries(DIAGRAM_SCENES).map(([k, v]) => [k, v.title]),
) as Record<DiagramKind, string>;

/** Héros affiché dans un pion : son portrait, ou ses initiales s'il n'en a pas. */
export type DiagramCast = { name: string; src?: string | null; role: Glyph };

const ROLE_OF: Record<string, Glyph> = { Vanguard: "tank", Duelist: "dps", Strategist: "heal" };
/** Convertit un rôle du jeu (Vanguard, Duelist, Strategist) en icône de pion. */
export const glyphOf = (role: string): Glyph => ROLE_OF[role] ?? "dps";

const initials = (name: string) =>
  name
    .replace(/^The /, "")
    .split(/[\s-]+/)
    .filter((w) => /^[A-Z&]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/** Icône du rôle, centrée sur (x, y), dessinée en sombre sur le pion coloré. */
function RoleGlyph({ role, x, y, k = 1 }: { role: Glyph; x: number; y: number; k?: number }) {
  if (role === "tank")
    return <path d={`M${x} ${y - 5.5 * k} L${x + 4.6 * k} ${y - 3.6 * k} L${x + 4.2 * k} ${y + 1.2 * k} Q${x + 3 * k} ${y + 4.4 * k} ${x} ${y + 6 * k} Q${x - 3 * k} ${y + 4.4 * k} ${x - 4.2 * k} ${y + 1.2 * k} L${x - 4.6 * k} ${y - 3.6 * k} Z`} fill={INK} />;
  if (role === "heal") return <path d={`M${x - 1.8 * k} ${y - 5 * k}h${3.6 * k}v${3.2 * k}h${3.2 * k}v${3.6 * k}h${-3.2 * k}v${3.2 * k}h${-3.6 * k}v${-3.2 * k}h${-3.2 * k}v${-3.6 * k}h${3.2 * k}z`} fill={INK} />;
  return (
    <g stroke={INK} strokeWidth={1.6 * k} fill="none" strokeLinecap="round">
      <circle cx={x} cy={y} r={3.4 * k} />
      <path d={`M${x} ${y - 6 * k}V${y - 3.4 * k}M${x} ${y + 3.4 * k}V${y + 6 * k}M${x - 6 * k} ${y}H${x - 3.4 * k}M${x + 3.4 * k} ${y}H${x + 6 * k}`} />
    </g>
  );
}

// ---------- Géométrie ----------

const r1 = (n: number) => Math.round(n * 10) / 10;
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
/** Avance `a` de `d` unités en direction de `b`. */
const toward = (a: Pt, b: Pt, d: number): Pt => {
  const l = dist(a, b) || 1;
  return [a[0] + ((b[0] - a[0]) / l) * d, a[1] + ((b[1] - a[1]) / l) * d];
};
const pathD = (p: Pt[]) =>
  p.length === 2
    ? `M${r1(p[0][0])} ${r1(p[0][1])}L${r1(p[1][0])} ${r1(p[1][1])}`
    : p.length === 3
      ? `M${r1(p[0][0])} ${r1(p[0][1])}Q${r1(p[1][0])} ${r1(p[1][1])} ${r1(p[2][0])} ${r1(p[2][1])}`
      : `M${r1(p[0][0])} ${r1(p[0][1])}C${r1(p[1][0])} ${r1(p[1][1])} ${r1(p[2][0])} ${r1(p[2][1])} ${r1(p[3][0])} ${r1(p[3][1])}`;
/** Point à la fraction `t` du trajet (pour y poser le numéro d'étape). */
function pointAt(p: Pt[], t: number): Pt {
  const u = 1 - t;
  if (p.length === 2) return [p[0][0] * u + p[1][0] * t, p[0][1] * u + p[1][1] * t];
  if (p.length === 3) return [u * u * p[0][0] + 2 * u * t * p[1][0] + t * t * p[2][0], u * u * p[0][1] + 2 * u * t * p[1][1] + t * t * p[2][1]];
  return [
    u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
  ];
}

const pawnRadius = (p: Pawn, named: boolean) => (p.ghost ? 8.5 : p.small ? 6.5 : p.team === "me" ? 12 : named ? 11.5 : 9.5);

/**
 * Schéma tactique.
 * - `scene` : schéma propre au guide ; sinon `kind` choisit un schéma générique.
 * - `me` : héros de la fiche, dont le portrait remplace le pion « Toi ».
 * - `ally` : partenaire conseillé (pions marqués comme partenaire dans les schémas génériques).
 * - `heroOf` : retrouve un héros nommé dans une scène par son slug.
 */
export function TacticDiagram({
  kind,
  scene,
  className = "",
  me,
  ally,
  heroOf,
}: {
  kind?: DiagramKind | "";
  scene?: TacticScene;
  className?: string;
  me?: DiagramCast | null;
  ally?: DiagramCast | null;
  heroOf?: (slug: string) => DiagramCast | null | undefined;
}) {
  const preset = !scene && kind ? DIAGRAM_SCENES[kind] : null;
  const s = scene ?? preset;
  if (!s) return null;
  const uid = `dg-${(scene ? scene.title : (kind ?? "x")).replace(/[^a-z0-9]/gi, "").slice(0, 24)}-${(me?.name ?? "x").replace(/[^a-z]/gi, "")}`;
  const meRole: Glyph = me?.role ?? preset?.me ?? "dps";
  const steps = s.steps ?? [];

  const pawns = s.els.filter((e): e is Pawn => e.t === "pawn");
  const who = (p: Pawn): DiagramCast | null => (p.team === "me" ? (me ?? null) : p.hero === PARTNER ? (ally ?? null) : p.hero ? (heroOf?.(p.hero) ?? null) : null);
  const radius = (p: Pawn) => pawnRadius(p, !!who(p));

  /** Raccourcit un trajet pour que la flèche s'arrête au bord du pion visé, pas dessous. */
  function trimmed(pts: Pt[], arrow: boolean): Pt[] {
    const out = pts.map((p) => [...p] as Pt);
    const hit = (p: Pt) => pawns.find((q) => dist(q.at as Pt, p) < 5);
    const a = hit(out[0]);
    if (a) out[0] = toward(out[0], out[1], Math.min(radius(a) + 2, dist(out[0], out[1]) / 3));
    const last = out.length - 1;
    const b = hit(out[last]);
    if (b) out[last] = toward(out[last], out[last - 1], Math.min(radius(b) + (arrow ? 4.5 : 2), dist(out[last], out[last - 1]) / 3));
    return out;
  }

  // Durée d'une boucle d'animation : chaque étape numérotée a son créneau, puis une pause
  const slots = Math.max(1, ...s.els.map((e) => ("n" in e && e.n ? e.n : 0)));
  const SLOT = 1.25;
  const total = slots * SLOT + 1.4;

  const used = new Set<string>(s.els.map((e) => (e.t === "path" ? e.kind : e.t)));
  const teams = new Set<Team>(pawns.map((p) => p.team));
  const hasGlyph = pawns.some((p) => !p.ghost && !p.small && !who(p));

  const badges: { at: Pt; n: number; team: Team }[] = [];

  const paths = s.els
    .map((e, i) => ({ e, i }))
    .filter((x): x is { e: PathEl; i: number } => x.e.t === "path")
    .map(({ e, i }) => {
      const arrow = e.kind !== "sight" && e.kind !== "heal";
      const pts = trimmed(e.pts as Pt[], arrow);
      const d = pathD(pts);
      if (e.n) badges.push({ at: pointAt(pts, e.kind === "move" ? 0.42 : 0.5), n: e.n, team: e.team });
      return { e, i, d, pts };
    });
  const order = ["sight", "heal", "beam", "shot", "move", "pull", "push"];
  paths.sort((a, b) => order.indexOf(a.e.kind) - order.indexOf(b.e.kind));

  // Un seul numéro par étape et par endroit : deux flèches jumelles ne répètent pas le même badge côte à côte
  const shown: typeof badges = [];
  const pushBadge = (b: (typeof badges)[number]) => {
    if (!shown.some((x) => x.n === b.n && dist(x.at, b.at) < 46)) shown.push(b);
  };

  const label = (p: Pawn) => {
    if (p.ghost) return null;
    const w = who(p);
    // Le portrait suffit à reconnaître le héros : « Toi » reste court pour ne pas recouvrir le dessin
    if (p.team === "me") return p.label ?? "Toi";
    if (w) return p.label && p.label !== w.name ? `${w.name} · ${p.label}` : w.name;
    return p.label ?? null;
  };

  for (const e of s.els) {
    if (e.t === "zone" && e.n) badges.push({ at: [e.at[0] - e.r * 0.7, e.at[1] - e.r * 0.7], n: e.n, team: e.team });
    if (e.t === "bar" && e.n) badges.push({ at: [(e.from[0] + e.to[0]) / 2 - 9, (e.from[1] + e.to[1]) / 2], n: e.n, team: e.team });
    if (e.t === "cone" && e.n) badges.push({ at: pointAt([e.at as Pt, e.to as Pt], 0.6), n: e.n, team: e.team });
  }
  badges.sort((a, b) => a.n - b.n).forEach(pushBadge);

  return (
    <figure className={`overflow-hidden rounded-xl border border-line bg-surface ${className}`}>
      <svg viewBox="0 0 320 180" className="block w-full" role="img" aria-label={`${s.title} : ${s.caption}${steps.length ? ` Étapes : ${steps.join(" ")}` : ""}`}>
        <defs>
          <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="var(--color-line)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id={`${uid}-vig`} cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
          </radialGradient>
          {(["ally", "enemy", "me"] as Team[]).map((t) => (
            <marker key={t} id={`${uid}-arrow-${t}`} viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0.6L10 5L0 9.4L2.4 5Z" fill={color(t)} />
            </marker>
          ))}
          {(["ally", "enemy", "me"] as Team[]).map((t) => (
            <marker key={`b${t}`} id={`${uid}-big-${t}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10Z" fill={color(t)} stroke={INK} strokeWidth="0.8" />
            </marker>
          ))}
        </defs>
        <rect width="320" height="180" fill="var(--color-surface-2)" />
        <rect width="320" height="180" fill={`url(#${uid}-grid)`} />
        {/* Moitiés de terrain */}
        <rect width="160" height="180" fill={ALLY} opacity="0.04" />
        <rect x="160" width="160" height="180" fill="var(--color-bad)" opacity="0.04" />
        <rect width="320" height="180" fill={`url(#${uid}-vig)`} />

        {s.els.map((e, i) => {
          if (e.t === "area")
            return (
              <g key={i}>
                <rect
                  x={e.at[0]}
                  y={e.at[1]}
                  width={e.size[0]}
                  height={e.size[1]}
                  rx="4"
                  fill={e.team ? color(e.team) : "var(--color-surface-3)"}
                  fillOpacity={e.team ? 0.1 : 0.9}
                  stroke={e.team ? color(e.team) : "#4a5160"}
                  strokeOpacity={e.team ? 0.45 : 1}
                  strokeDasharray={e.team ? "3 4" : undefined}
                />
                <text x={e.at[0] + 5} y={e.at[1] + 11} fontSize="7.5" fontWeight="700" letterSpacing="0.4" fill={e.team ? color(e.team) : "var(--color-muted)"} style={{ fontFamily: "inherit" }}>
                  {e.label.toUpperCase()}
                </text>
              </g>
            );
          if (e.t === "zone")
            return (
              <g key={i}>
                <circle cx={e.at[0]} cy={e.at[1]} r={e.r} fill={color(e.team)} opacity="0.13" />
                <circle cx={e.at[0]} cy={e.at[1]} r={e.r} fill="none" stroke={color(e.team)} strokeOpacity="0.6" strokeWidth="1.2" strokeDasharray="3 4" />
                {e.label ? (
                  <text x={Math.min(Math.max(e.at[0], 40), 280)} y={Math.max(e.at[1] - e.r - 4, 9)} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={color(e.team)} stroke="var(--color-surface-2)" strokeWidth="3" paintOrder="stroke" style={{ fontFamily: "inherit" }}>
                    {e.label}
                  </text>
                ) : null}
              </g>
            );
          if (e.t === "cone") {
            const a = e.at as Pt;
            const b = e.to as Pt;
            const len = dist(a, b);
            const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
            const half = ((e.spread / 2) * Math.PI) / 180;
            const p1: Pt = [a[0] + Math.cos(ang - half) * len, a[1] + Math.sin(ang - half) * len];
            const p2: Pt = [a[0] + Math.cos(ang + half) * len, a[1] + Math.sin(ang + half) * len];
            return <path key={i} d={`M${r1(a[0])} ${r1(a[1])}L${r1(p1[0])} ${r1(p1[1])}A${r1(len)} ${r1(len)} 0 0 1 ${r1(p2[0])} ${r1(p2[1])}Z`} fill={color(e.team)} fillOpacity="0.2" stroke={color(e.team)} strokeOpacity="0.7" strokeWidth="1.2" strokeLinejoin="round" />;
          }
          if (e.t === "cover")
            return (
              <g key={i}>
                <rect x={e.at[0]} y={e.at[1]} width={e.size[0]} height={e.size[1]} rx="3" fill="var(--color-surface-3)" stroke="#434a59" strokeWidth="1.5" />
                <path d={`M${e.at[0] + 3} ${e.at[1] + e.size[1] - 3}L${e.at[0] + e.size[0] - 3} ${e.at[1] + 3}`} stroke="#434a59" strokeWidth="1" opacity="0.6" />
                {e.label ? (
                  <text x={e.at[0] + e.size[0] / 2} y={e.at[1] + e.size[1] / 2 + 3} textAnchor="middle" fontSize="7.5" fontWeight="700" letterSpacing="0.4" fill="var(--color-muted)" style={{ fontFamily: "inherit" }}>
                    {e.label.toUpperCase()}
                  </text>
                ) : null}
              </g>
            );
          return null;
        })}

        {s.els.map((e, i) =>
          e.t === "bar" ? (
            <g key={i}>
              <path d={`M${e.from[0]} ${e.from[1]}L${e.to[0]} ${e.to[1]}`} stroke={color(e.team)} strokeWidth="9" strokeLinecap="round" opacity="0.22" />
              <path d={`M${e.from[0]} ${e.from[1]}L${e.to[0]} ${e.to[1]}`} stroke={color(e.team)} strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              {e.label ? (
                <text x={(e.from[0] + e.to[0]) / 2} y={Math.min(e.from[1], e.to[1]) - 6} textAnchor="middle" fontSize="8" fontWeight="700" fill={color(e.team)} stroke="var(--color-surface-2)" strokeWidth="3" paintOrder="stroke" style={{ fontFamily: "inherit" }}>
                  {e.label}
                </text>
              ) : null}
            </g>
          ) : null,
        )}

        {paths.map(({ e, i, d }) => {
          const c = e.kind === "heal" ? HEAL : color(e.team);
          if (e.kind === "sight") return <path key={i} d={d} fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="1.5 3" opacity="0.9" />;
          if (e.kind === "heal") {
            const end = e.pts[e.pts.length - 1] as Pt;
            const tip = toward(end, e.pts[e.pts.length - 2] as Pt, 15);
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={c} strokeWidth="1.8" strokeDasharray="2 3.2" strokeLinecap="round" />
                <circle cx={tip[0]} cy={tip[1]} r="4.2" fill={INK} stroke={c} strokeWidth="1.1" />
                <path d={`M${r1(tip[0] - 2.3)} ${r1(tip[1])}h4.6M${r1(tip[0])} ${r1(tip[1] - 2.3)}v4.6`} stroke={c} strokeWidth="1.5" strokeLinecap="round" />
              </g>
            );
          }
          if (e.kind === "beam")
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" opacity="0.2" />
                <path d={d} fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" markerEnd={`url(#${uid}-arrow-${e.team})`} />
              </g>
            );
          if (e.kind === "pull" || e.kind === "push")
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={INK} strokeWidth="5.6" strokeLinecap="round" opacity="0.7" />
                <path d={d} fill="none" stroke={c} strokeWidth="3.2" strokeLinecap="round" markerEnd={`url(#${uid}-big-${e.team})`} />
              </g>
            );
          if (e.kind === "shot") return <path key={i} d={d} fill="none" stroke={c} strokeWidth="1.7" opacity="0.9" markerEnd={`url(#${uid}-arrow-${e.team})`} />;
          return <path key={i} d={d} fill="none" stroke={c} strokeWidth="2.3" strokeDasharray="5 4" strokeLinecap="round" markerEnd={`url(#${uid}-arrow-${e.team})`} />;
        })}

        {s.els.map((e, i) => {
          if (e.t !== "mark") return null;
          const [x, y] = e.at;
          const c = color(e.team ?? "me");
          const text = e.label ? (
            <text x={x} y={y + 17} textAnchor="middle" fontSize="8" fontWeight="700" fill={c} stroke="var(--color-surface-2)" strokeWidth="3" paintOrder="stroke" style={{ fontFamily: "inherit" }}>
              {e.label}
            </text>
          ) : null;
          if (e.kind === "turret")
            return (
              <g key={i}>
                <rect x={x - 5} y={y - 5} width="10" height="10" transform={`rotate(45 ${x} ${y})`} fill={c} stroke={INK} strokeWidth="1.5" />
                <circle cx={x} cy={y} r="1.8" fill={INK} />
                {text}
              </g>
            );
          if (e.kind === "trap")
            return (
              <g key={i}>
                <path d={`M${x} ${y - 7}L${x + 6.5} ${y + 4.5}H${x - 6.5}Z`} fill={c} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
                <path d={`M${x} ${y - 2.6}v3.4M${x} ${y + 2.6}v0.2`} stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
                {text}
              </g>
            );
          if (e.kind === "clone")
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="9" fill={c} fillOpacity="0.25" stroke={c} strokeWidth="1.6" strokeDasharray="2 2.4" />
                <circle cx={x} cy={y - 2.2} r="2.6" fill={c} opacity="0.8" />
                <path d={`M${x - 4.6} ${y + 5.2}q4.6 -6.4 9.2 0`} fill={c} opacity="0.8" />
                {text}
              </g>
            );
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="15" fill="none" stroke="var(--color-fg-2)" strokeWidth="1.3" strokeDasharray="5 3" opacity="0.7" />
              <circle cx={x} cy={y} r="2.2" fill="var(--color-fg-2)" opacity="0.7" />
              <text x={x} y={y - 19} textAnchor="middle" fontSize="7.5" fontWeight="700" letterSpacing="0.4" fill="var(--color-fg-2)" stroke="var(--color-surface-2)" strokeWidth="3" paintOrder="stroke" style={{ fontFamily: "inherit" }}>
                {(e.label ?? "Objectif").toUpperCase()}
              </text>
            </g>
          );
        })}

        {pawns.map((p, i) => {
          const [x, y] = p.at;
          const c = color(p.team);
          if (p.ghost) return <circle key={i} cx={x} cy={y} r={p.small ? 6 : 8.5} fill="none" stroke={c} strokeWidth="1.8" strokeDasharray="3 2.5" opacity="0.75" />;
          if (p.small) return <circle key={i} cx={x} cy={y} r="6.5" fill={c} stroke={INK} strokeWidth="1.8" />;
          const w = who(p);
          const r = radius(p);
          const role = p.team === "me" ? meRole : (p.role ?? w?.role ?? "dps");
          const clip = `${uid}-clip-${i}`;
          return (
            <g key={i} opacity={p.ko ? 0.5 : 1}>
              {p.team === "me" ? <circle cx={x} cy={y} r={r + 4} fill="none" stroke={ME} strokeWidth="1.5" opacity="0.55" /> : null}
              <circle cx={x} cy={y} r={r} fill={c} stroke={INK} strokeWidth="2" />
              {w?.src ? (
                <>
                  <clipPath id={clip}>
                    <circle cx={x} cy={y} r={r - 2.2} />
                  </clipPath>
                  <image href={w.src} x={x - r + 2.2} y={y - r + 2.2} width={(r - 2.2) * 2} height={(r - 2.2) * 2} clipPath={`url(#${clip})`} preserveAspectRatio="xMidYMin slice" />
                </>
              ) : w ? (
                <text x={x} y={y + 3.3} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={INK} style={{ fontFamily: "inherit" }}>
                  {initials(w.name)}
                </text>
              ) : (
                <RoleGlyph role={role} x={x} y={y} k={p.team === "me" ? 1.05 : 0.95} />
              )}
            </g>
          );
        })}
        {pawns.map((p, i) => {
          if (!p.ko) return null;
          const [x, y] = p.at;
          return <path key={`k${i}`} d={`M${x - 6} ${y - 6}L${x + 6} ${y + 6}M${x + 6} ${y - 6}L${x - 6} ${y + 6}`} stroke={ENEMY} strokeWidth="2.6" strokeLinecap="round" />;
        })}
        {pawns.map((p, i) => {
          const text = label(p);
          if (!text) return null;
          const r = radius(p);
          const y = p.above ? p.at[1] - r - (p.team === "me" ? 8 : 5) : p.at[1] + r + (p.team === "me" ? 14 : 11);
          const half = text.length * 2.4;
          return (
            <text key={`l${i}`} x={Math.min(Math.max(p.at[0], half + 4), 316 - half)} y={Math.min(Math.max(y, 10), 176)} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={p.team === "me" ? ME : p.team === "ally" ? ALLY : "var(--color-bad)"} stroke="var(--color-surface-2)" strokeWidth="3" paintOrder="stroke" style={{ fontFamily: "inherit" }}>
              {text}
            </text>
          );
        })}

        {s.els.map((e, i) =>
          e.t === "note" ? (
            /^\d$/.test(e.text) ? (
              <StepBadge key={i} at={e.at as Pt} n={Number(e.text)} team={e.team ?? "me"} />
            ) : (
              <text key={i} x={e.at[0]} y={e.at[1]} textAnchor="middle" fontSize="8" fontWeight="700" fontStyle="italic" fill={e.team ? color(e.team) : "var(--color-fg-2)"} stroke="var(--color-surface-2)" strokeWidth="3" paintOrder="stroke" style={{ fontFamily: "inherit" }}>
                {e.text}
              </text>
            )
          ) : null,
        )}
        {shown.map((b, i) => (
          <StepBadge key={`b${i}`} at={b.at} n={b.n} team={b.team} />
        ))}

        {/* Un point lumineux parcourt chaque trajet numéroté, dans l'ordre des étapes */}
        <g className="dg-pulse" aria-hidden>
          {paths
            .filter(({ e }) => e.n && e.kind !== "sight")
            .map(({ e, i, d }) => {
              const a = Math.max(0.001, ((e.n! - 1) * SLOT) / total);
              const b = Math.min(0.998, ((e.n! - 1) * SLOT + 1) / total);
              const f = (n: number) => n.toFixed(4);
              const c = e.kind === "heal" ? HEAL : color(e.team);
              return (
                <circle key={i} r={e.kind === "pull" || e.kind === "push" ? 4 : 3} fill="#fff" stroke={c} strokeWidth="1.6" opacity="0">
                  <animateMotion dur={`${total}s`} repeatCount="indefinite" path={d} calcMode="linear" keyPoints="0;0;1;1" keyTimes={`0;${f(a)};${f(b)};1`} />
                  <animate attributeName="opacity" dur={`${total}s`} repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes={`0;${f(a)};${f(b)}`} />
                </circle>
              );
            })}
        </g>
      </svg>
      <figcaption className="flex flex-col gap-2.5 border-t border-line px-4 py-3">
        <span className="text-sm text-fg-2">
          <strong className="font-semibold text-fg">{s.title}.</strong> {s.caption}
        </span>
        {steps.length ? (
          <ol className="flex flex-col gap-1.5">
            {steps.map((st, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-fg-2">
                <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border border-accent bg-bg text-[11px] font-bold tabular text-fg">{i + 1}</span>
                <span>{st}</span>
              </li>
            ))}
          </ol>
        ) : null}
        <span className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted" aria-hidden>
          {teams.has("me") ? <Legend c={ME} label="Toi" /> : null}
          {teams.has("ally") ? <Legend c={ALLY} label="Alliés" /> : null}
          {teams.has("enemy") ? <Legend c={ENEMY} label="Ennemis" /> : null}
          {hasGlyph ? (
            <>
              <GlyphLegend role="tank" label="Tank" />
              <GlyphLegend role="dps" label="DPS" />
              <GlyphLegend role="heal" label="Heal" />
            </>
          ) : null}
          {used.has("move") ? <LineLegend kind="move" label="Déplacement" /> : null}
          {used.has("shot") || used.has("beam") ? <LineLegend kind="shot" label="Tir ou attaque" /> : null}
          {used.has("pull") || used.has("push") ? <LineLegend kind="pull" label="Joueur déplacé" /> : null}
          {used.has("heal") ? <LineLegend kind="heal" label="Soin" /> : null}
          {used.has("sight") ? <LineLegend kind="sight" label="Ligne de vue" /> : null}
        </span>
      </figcaption>
    </figure>
  );
}

function StepBadge({ at, n, team }: { at: Pt; n: number; team: Team }) {
  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r="6.4" fill={INK} stroke={color(team)} strokeWidth="1.4" />
      <text x={at[0]} y={at[1] + 2.9} textAnchor="middle" fontSize="8.2" fontWeight="800" fill="#fff" style={{ fontFamily: "inherit" }}>
        {n}
      </text>
    </g>
  );
}

function Legend({ c, label }: { c: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="size-2 rounded-full" style={{ background: c }} />
      {label}
    </span>
  );
}

function LineLegend({ kind, label }: { kind: "move" | "shot" | "pull" | "heal" | "sight"; label: string }) {
  const c = kind === "heal" ? HEAL : "var(--color-fg-2)";
  return (
    <span className="inline-flex items-center gap-1">
      <svg viewBox="0 0 22 8" className="h-2 w-[22px]">
        <path
          d="M1 4H17"
          stroke={c}
          strokeWidth={kind === "pull" ? 3 : kind === "sight" ? 1.2 : 1.8}
          strokeDasharray={kind === "move" ? "4 3" : kind === "heal" ? "2 2.6" : kind === "sight" ? "1.5 2.5" : undefined}
          strokeLinecap="round"
        />
        {kind === "sight" || kind === "heal" ? null : <path d="M16 1L21 4L16 7Z" fill={c} />}
      </svg>
      {label}
    </span>
  );
}

function GlyphLegend({ role, label }: { role: Glyph; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <svg viewBox="0 0 16 16" className="size-3.5">
        <circle cx="8" cy="8" r="7.5" fill="var(--color-muted)" />
        <RoleGlyph role={role} x={8} y={8} k={0.85} />
      </svg>
      {label}
    </span>
  );
}
