import type { DiagramKind } from "@/lib/guides";

/*
 * Schémas tactiques originaux, vus de dessus (320 × 180).
 * Alliés à gauche en bleu, ennemis à droite en rouge, « toi » en couleur d'accent.
 * Pointillés épais = déplacements, traits pleins = tirs, pointillés fins = lignes de vue.
 * Vocabulaire : on garde le jargon que les joueurs utilisent en jeu (dive, peel, poke, flank…).
 */

const ALLY = "#6fa8ff";
const ENEMY = "var(--color-bad)";
const ME = "var(--color-accent)";

type Team = "ally" | "enemy" | "me";
type Token = { x: number; y: number; team: Team; label?: string; ghost?: boolean; top?: boolean };
type Move = { d: string; team: Team };
type Line = { x1: number; y1: number; x2: number; y2: number; team: Team };
type Wall = { x: number; y: number; w: number; h: number };
type Shield = { d: string; team: Team };
type Area = { x: number; y: number; w: number; h: number; label: string; team?: Team };

type Scene = {
  title: string;
  caption: string;
  areas?: Area[];
  zones?: { cx: number; cy: number; r: number; team: Team; label?: string }[];
  walls?: Wall[];
  shields?: Shield[];
  /** Lignes de vue / soins (pointillés fins). */
  sights?: Line[];
  shots?: Line[];
  moves?: Move[];
  /** Tourelles, mines, pièges posés au sol. */
  turrets?: { x: number; y: number; team: Team }[];
  /** Cible éliminée. */
  kills?: { x: number; y: number }[];
  tokens: Token[];
};

const color = (t: Team) => (t === "ally" ? ALLY : t === "enemy" ? ENEMY : ME);

/** Une équipe ennemie type : tank devant, deux DPS, deux heals derrière. */
const enemyTeam = (dx = 0): Token[] => [
  { x: 214 + dx, y: 92, team: "enemy", label: "Tank" },
  { x: 244 + dx, y: 58, team: "enemy" },
  { x: 244 + dx, y: 126, team: "enemy" },
  { x: 284 + dx, y: 74, team: "enemy", label: "Heal" },
  { x: 284 + dx, y: 112, team: "enemy" },
];

export const DIAGRAM_SCENES: Record<DiagramKind, Scene> = {
  angle: {
    title: "Off-angle",
    caption: "Ne tire pas dans le bouclier : décale-toi sur le côté pour toucher la backline qu'il protège.",
    walls: [{ x: 126, y: 18, w: 16, h: 40 }],
    shields: [{ d: "M198 68 Q188 96 198 124", team: "enemy" }],
    moves: [{ d: "M92 110 Q104 52 148 38", team: "me" }],
    shots: [
      { x1: 156, y1: 36, x2: 280, y2: 110, team: "me" },
      { x1: 90, y1: 66, x2: 186, y2: 92, team: "ally" },
    ],
    tokens: [
      { x: 112, y: 96, team: "ally", label: "Tank" },
      { x: 90, y: 66, team: "ally" },
      { x: 70, y: 134, team: "ally" },
      { x: 40, y: 94, team: "ally", label: "Heal" },
      { x: 92, y: 110, team: "me", ghost: true },
      { x: 156, y: 36, team: "me", label: "Toi", top: true },
      ...enemyTeam(),
    ],
  },
  dive: {
    title: "Dive à deux",
    caption: "Dive en même temps qu'un allié sur la même cible, de préférence un heal isolé, puis ressors.",
    moves: [
      { d: "M92 44 Q180 4 258 48", team: "me" },
      { d: "M92 140 Q210 178 292 118", team: "ally" },
    ],
    tokens: [
      { x: 92, y: 44, team: "me", ghost: true },
      { x: 92, y: 140, team: "ally", ghost: true },
      { x: 60, y: 92, team: "ally", label: "Tank" },
      { x: 30, y: 70, team: "ally" },
      { x: 30, y: 116, team: "ally" },
      { x: 204, y: 92, team: "enemy", label: "Tank" },
      { x: 230, y: 44, team: "enemy" },
      { x: 240, y: 126, team: "enemy" },
      { x: 284, y: 80, team: "enemy", label: "Heal" },
      { x: 290, y: 150, team: "enemy" },
      { x: 266, y: 56, team: "me", label: "Toi", top: true },
      { x: 300, y: 112, team: "ally" },
    ],
  },
  reset: {
    title: "Engage puis reset",
    caption: "Entre, tue une cible, puis reviens vers ton équipe recharger tes cooldowns avant de repartir.",
    moves: [
      { d: "M84 60 Q170 10 270 64", team: "me" },
      { d: "M272 84 Q200 168 104 128", team: "me" },
    ],
    kills: [{ x: 284, y: 74 }],
    tokens: [
      { x: 84, y: 60, team: "me", ghost: true },
      { x: 70, y: 96, team: "ally", label: "Tank" },
      { x: 40, y: 70, team: "ally" },
      { x: 40, y: 124, team: "ally" },
      { x: 76, y: 140, team: "ally" },
      { x: 214, y: 92, team: "enemy", label: "Tank" },
      { x: 244, y: 50, team: "enemy" },
      { x: 244, y: 130, team: "enemy" },
      { x: 284, y: 120, team: "enemy" },
      { x: 104, y: 128, team: "me", label: "Toi" },
    ],
  },
  brawl: {
    title: "Brawl",
    caption: "Tank devant, heals collés derrière, tout le monde au contact et sur la même cible.",
    walls: [
      { x: 150, y: 0, w: 34, h: 60 },
      { x: 150, y: 122, w: 34, h: 58 },
    ],
    moves: [{ d: "M134 91 L184 91", team: "ally" }],
    zones: [{ cx: 102, cy: 92, r: 42, team: "ally" }],
    shots: [
      { x1: 96, y1: 64, x2: 206, y2: 89, team: "ally" },
      { x1: 104, y1: 124, x2: 206, y2: 96, team: "me" },
    ],
    tokens: [
      { x: 126, y: 91, team: "ally", label: "Tank" },
      { x: 96, y: 64, team: "ally" },
      { x: 104, y: 124, team: "me", label: "Toi" },
      { x: 72, y: 78, team: "ally" },
      { x: 70, y: 106, team: "ally", label: "Heal" },
      ...enemyTeam(),
    ],
  },
  space: {
    title: "Créer de l'espace",
    caption: "Avance bouclier levé : ton équipe occupe le terrain que tu prends, et chaque mètre gagné ouvre des angles.",
    areas: [{ x: 96, y: 30, w: 86, h: 124, label: "Espace gagné", team: "ally" }],
    shields: [{ d: "M196 62 Q206 92 196 122", team: "me" }],
    moves: [
      { d: "M110 92 L176 92", team: "me" },
      { d: "M62 60 L120 60", team: "ally" },
      { d: "M62 128 L120 128", team: "ally" },
    ],
    tokens: [
      { x: 110, y: 92, team: "me", ghost: true },
      { x: 184, y: 92, team: "me", label: "Toi", top: true },
      { x: 128, y: 60, team: "ally" },
      { x: 128, y: 128, team: "ally" },
      { x: 50, y: 82, team: "ally", label: "Heal" },
      { x: 46, y: 116, team: "ally" },
      { x: 236, y: 92, team: "enemy", label: "Tank" },
      { x: 258, y: 56, team: "enemy" },
      { x: 260, y: 130, team: "enemy" },
      { x: 296, y: 78, team: "enemy" },
      { x: 296, y: 112, team: "enemy" },
    ],
  },
  peel: {
    title: "Peel",
    caption: "Un diver saute sur tes heals ? Fais demi-tour, mets-le dehors, puis reprends ta place.",
    moves: [
      { d: "M150 26 Q100 40 66 98", team: "enemy" },
      { d: "M168 104 Q132 116 100 116", team: "me" },
    ],
    shots: [{ x1: 92, y1: 116, x2: 68, y2: 110, team: "me" }],
    tokens: [
      { x: 150, y: 26, team: "enemy", ghost: true },
      { x: 34, y: 88, team: "ally", label: "Heal", top: true },
      { x: 30, y: 148, team: "ally" },
      { x: 58, y: 108, team: "enemy", label: "Diver" },
      { x: 168, y: 104, team: "me", ghost: true },
      { x: 92, y: 118, team: "me", label: "Toi" },
      { x: 172, y: 64, team: "ally", label: "Tank" },
      { x: 150, y: 150, team: "ally" },
      { x: 236, y: 76, team: "enemy", label: "Tank" },
      { x: 272, y: 112, team: "enemy" },
      { x: 292, y: 56, team: "enemy" },
      { x: 296, y: 146, team: "enemy" },
    ],
  },
  pull: {
    title: "Pick",
    caption: "Accroche ou ramène une cible isolée dans ton équipe : c'est du 5 contre 1.",
    zones: [{ cx: 92, cy: 92, r: 46, team: "ally" }],
    sights: [{ x1: 150, y1: 120, x2: 214, y2: 96, team: "me" }],
    moves: [{ d: "M216 92 Q170 70 122 88", team: "enemy" }],
    tokens: [
      { x: 216, y: 92, team: "enemy", ghost: true },
      { x: 112, y: 90, team: "enemy", label: "Cible", top: true },
      { x: 150, y: 120, team: "me", label: "Toi" },
      { x: 78, y: 62, team: "ally" },
      { x: 66, y: 112, team: "ally" },
      { x: 40, y: 88, team: "ally" },
      { x: 92, y: 136, team: "ally" },
      { x: 252, y: 58, team: "enemy" },
      { x: 256, y: 128, team: "enemy" },
      { x: 292, y: 76, team: "enemy" },
      { x: 292, y: 112, team: "enemy" },
    ],
  },
  poke: {
    title: "Poke derrière le bouclier",
    caption: "Reste derrière ton bouclier et use l'adversaire de loin avant que le fight commence.",
    shields: [{ d: "M134 54 Q146 92 134 130", team: "ally" }],
    shots: [
      { x1: 104, y1: 82, x2: 222, y2: 90, team: "me" },
      { x1: 104, y1: 82, x2: 252, y2: 60, team: "me" },
    ],
    tokens: [
      { x: 116, y: 110, team: "ally", label: "Tank" },
      { x: 104, y: 82, team: "me", label: "Toi", top: true },
      { x: 88, y: 132, team: "ally" },
      { x: 56, y: 72, team: "ally", label: "Heal" },
      { x: 50, y: 112, team: "ally" },
      ...enemyTeam(10),
    ],
  },
  highground: {
    title: "High ground",
    caption: "Monte en hauteur : tu vois tout le fight, tu tires par-dessus les boucliers et on t'atteint difficilement.",
    areas: [{ x: 116, y: 8, w: 72, h: 46, label: "Hauteur" }],
    moves: [{ d: "M98 128 Q92 64 140 34", team: "me" }],
    shots: [
      { x1: 152, y1: 30, x2: 236, y2: 120, team: "me" },
      { x1: 152, y1: 30, x2: 274, y2: 108, team: "me" },
    ],
    shields: [{ d: "M196 64 Q186 92 196 120", team: "enemy" }],
    tokens: [
      { x: 98, y: 128, team: "me", ghost: true },
      { x: 152, y: 30, team: "me", label: "Toi" },
      { x: 120, y: 102, team: "ally", label: "Tank" },
      { x: 84, y: 90, team: "ally" },
      { x: 50, y: 70, team: "ally", label: "Heal" },
      { x: 48, y: 124, team: "ally" },
      ...enemyTeam(),
    ],
  },
  flank: {
    title: "Flank",
    caption: "Contourne pendant que ton équipe occupe l'avant, puis frappe la backline dans le dos.",
    walls: [{ x: 120, y: 40, w: 130, h: 16 }],
    moves: [{ d: "M86 112 Q70 20 160 22 Q262 20 296 40", team: "me" }],
    shots: [{ x1: 300, y1: 46, x2: 286, y2: 72, team: "me" }],
    tokens: [
      { x: 86, y: 112, team: "me", ghost: true },
      { x: 300, y: 42, team: "me", label: "Toi", top: true },
      { x: 126, y: 104, team: "ally", label: "Tank" },
      { x: 100, y: 136, team: "ally" },
      { x: 66, y: 92, team: "ally" },
      { x: 60, y: 130, team: "ally" },
      { x: 214, y: 100, team: "enemy", label: "Tank" },
      { x: 244, y: 82, team: "enemy" },
      { x: 244, y: 132, team: "enemy" },
      { x: 284, y: 80, team: "enemy", label: "Heal" },
      { x: 284, y: 118, team: "enemy" },
    ],
  },
  heal: {
    title: "Placement du heal",
    caption: "Reste derrière ton tank, près d'un couvert, avec une ligne de vue sur toute ton équipe.",
    walls: [{ x: 66, y: 112, w: 14, h: 40 }],
    sights: [
      { x1: 56, y1: 100, x2: 146, y2: 92, team: "me" },
      { x1: 56, y1: 100, x2: 122, y2: 52, team: "me" },
      { x1: 56, y1: 100, x2: 126, y2: 136, team: "me" },
      { x1: 56, y1: 100, x2: 92, y2: 68, team: "me" },
    ],
    tokens: [
      { x: 146, y: 92, team: "ally", label: "Tank" },
      { x: 122, y: 52, team: "ally", label: "DPS", top: true },
      { x: 126, y: 136, team: "ally" },
      { x: 92, y: 68, team: "ally" },
      { x: 56, y: 100, team: "me", label: "Toi" },
      ...enemyTeam(6),
    ],
  },
  pocket: {
    title: "Pocket un diver",
    caption: "Suis ton diver à distance et garde-le en vie pendant son engage : il finit le kill, vous ressortez ensemble.",
    moves: [
      { d: "M84 54 Q170 6 262 58", team: "ally" },
      { d: "M70 110 Q130 90 186 62", team: "me" },
    ],
    sights: [{ x1: 192, y1: 60, x2: 262, y2: 62, team: "me" }],
    tokens: [
      { x: 84, y: 54, team: "ally", ghost: true },
      { x: 70, y: 110, team: "me", ghost: true },
      { x: 266, y: 62, team: "ally", label: "Diver", top: true },
      { x: 192, y: 60, team: "me", label: "Toi", top: true },
      { x: 92, y: 96, team: "ally", label: "Tank" },
      { x: 50, y: 130, team: "ally" },
      { x: 40, y: 80, team: "ally" },
      { x: 214, y: 104, team: "enemy", label: "Tank" },
      { x: 246, y: 140, team: "enemy" },
      { x: 288, y: 82, team: "enemy" },
      { x: 288, y: 120, team: "enemy" },
      { x: 236, y: 40, team: "enemy" },
    ],
  },
  choke: {
    title: "Tenir une entrée",
    caption: "Tourelles, murs et pièges sur le passage : l'ennemi doit traverser ta zone pour avancer.",
    walls: [
      { x: 168, y: 0, w: 30, h: 66 },
      { x: 168, y: 118, w: 30, h: 62 },
    ],
    turrets: [
      { x: 150, y: 76, team: "me" },
      { x: 150, y: 108, team: "me" },
      { x: 186, y: 92, team: "me" },
    ],
    moves: [
      { d: "M256 70 Q226 80 208 90", team: "enemy" },
      { d: "M258 116 Q228 106 210 96", team: "enemy" },
    ],
    shots: [
      { x1: 150, y1: 76, x2: 200, y2: 88, team: "me" },
      { x1: 150, y1: 108, x2: 200, y2: 96, team: "me" },
    ],
    tokens: [
      { x: 118, y: 92, team: "me", label: "Toi" },
      { x: 104, y: 60, team: "ally" },
      { x: 104, y: 126, team: "ally" },
      { x: 60, y: 76, team: "ally", label: "Heal" },
      { x: 60, y: 112, team: "ally" },
      { x: 262, y: 70, team: "enemy", label: "Tank", top: true },
      { x: 262, y: 116, team: "enemy" },
      { x: 294, y: 92, team: "enemy" },
      { x: 296, y: 140, team: "enemy" },
      { x: 296, y: 44, team: "enemy" },
    ],
  },
  ultcombo: {
    title: "Combo d'ults",
    caption: "Un ult regroupe les ennemis, les ults de dégâts tombent dessus en même temps. Annoncez-le avant le fight.",
    zones: [{ cx: 238, cy: 92, r: 36, team: "me", label: "Ult" }],
    moves: [
      { d: "M282 44 Q270 62 252 76", team: "enemy" },
      { d: "M290 146 Q272 126 254 110", team: "enemy" },
    ],
    shots: [
      { x1: 120, y1: 56, x2: 214, y2: 82, team: "ally" },
      { x1: 126, y1: 128, x2: 214, y2: 104, team: "ally" },
      { x1: 136, y1: 92, x2: 210, y2: 92, team: "me" },
    ],
    tokens: [
      { x: 282, y: 44, team: "enemy", ghost: true },
      { x: 290, y: 146, team: "enemy", ghost: true },
      { x: 228, y: 84, team: "enemy" },
      { x: 246, y: 100, team: "enemy" },
      { x: 232, y: 106, team: "enemy" },
      { x: 248, y: 80, team: "enemy" },
      { x: 240, y: 92, team: "enemy" },
      { x: 136, y: 92, team: "me", label: "Toi" },
      { x: 120, y: 56, team: "ally" },
      { x: 126, y: 128, team: "ally" },
      { x: 70, y: 74, team: "ally", label: "Heal" },
      { x: 66, y: 116, team: "ally" },
    ],
  },
};

export const DIAGRAM_LABEL: Record<DiagramKind, string> = Object.fromEntries(
  Object.entries(DIAGRAM_SCENES).map(([k, v]) => [k, v.title]),
) as Record<DiagramKind, string>;

export function TacticDiagram({ kind, className = "" }: { kind: DiagramKind; className?: string }) {
  const s = DIAGRAM_SCENES[kind];
  if (!s) return null;
  const id = `dg-${kind}`;
  return (
    <figure className={`overflow-hidden rounded-xl border border-line bg-surface ${className}`}>
      <svg viewBox="0 0 320 180" className="block w-full" role="img" aria-label={`${s.title} : ${s.caption}`}>
        <defs>
          <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="var(--color-line)" strokeWidth="0.6" />
          </pattern>
          {(["ally", "enemy", "me"] as Team[]).map((t) => (
            <marker key={t} id={`${id}-arrow-${t}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10Z" fill={color(t)} />
            </marker>
          ))}
        </defs>
        <rect width="320" height="180" fill="var(--color-surface-2)" />
        <rect width="320" height="180" fill={`url(#${id}-grid)`} />
        {/* Moitiés de terrain */}
        <rect width="160" height="180" fill={ALLY} opacity="0.035" />
        <rect x="160" width="160" height="180" fill="var(--color-bad)" opacity="0.035" />

        {s.areas?.map((a, i) => (
          <g key={i}>
            <rect
              x={a.x}
              y={a.y}
              width={a.w}
              height={a.h}
              rx="4"
              fill={a.team ? color(a.team) : "var(--color-surface-3)"}
              fillOpacity={a.team ? 0.1 : 0.9}
              stroke={a.team ? color(a.team) : "#4a5160"}
              strokeOpacity={a.team ? 0.4 : 1}
              strokeDasharray={a.team ? "3 4" : undefined}
            />
            <text x={a.x + 5} y={a.y + 11} fontSize="8" fontWeight="700" fill="var(--color-muted)" style={{ fontFamily: "inherit" }}>
              {a.label.toUpperCase()}
            </text>
          </g>
        ))}
        {s.zones?.map((z, i) => (
          <g key={i}>
            <circle cx={z.cx} cy={z.cy} r={z.r} fill={color(z.team)} opacity="0.12" stroke={color(z.team)} strokeOpacity="0.45" strokeDasharray="3 4" />
            {z.label ? (
              <text x={z.cx} y={z.cy - z.r - 4} textAnchor="middle" fontSize="9" fontWeight="700" fill={color(z.team)} style={{ fontFamily: "inherit" }}>
                {z.label}
              </text>
            ) : null}
          </g>
        ))}
        {s.walls?.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} rx="3" fill="var(--color-surface-3)" stroke="#3a404d" strokeWidth="1.5" />
        ))}
        {s.shields?.map((sh, i) => (
          <path key={i} d={sh.d} fill="none" stroke={color(sh.team)} strokeWidth="5" strokeLinecap="round" opacity="0.75" />
        ))}
        {s.sights?.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color(l.team)} strokeWidth="1.2" strokeDasharray="1.5 3" opacity="0.9" />
        ))}
        {s.shots?.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color(l.team)} strokeWidth="1.6" opacity="0.8" markerEnd={`url(#${id}-arrow-${l.team})`} />
        ))}
        {s.moves?.map((m, i) => (
          <path key={i} d={m.d} fill="none" stroke={color(m.team)} strokeWidth="2.2" strokeDasharray="5 4" strokeLinecap="round" markerEnd={`url(#${id}-arrow-${m.team})`} />
        ))}
        {s.turrets?.map((t, i) => (
          <rect key={i} x={t.x - 5} y={t.y - 5} width="10" height="10" transform={`rotate(45 ${t.x} ${t.y})`} fill={color(t.team)} stroke="#0e1015" strokeWidth="1.5" />
        ))}
        {s.tokens.map((t, i) => (
          <g key={i} opacity={t.ghost ? 0.7 : 1}>
            {t.team === "me" && !t.ghost ? <circle cx={t.x} cy={t.y} r="12" fill="none" stroke={ME} strokeWidth="1.5" opacity="0.6" /> : null}
            {t.ghost ? (
              <circle cx={t.x} cy={t.y} r="7" fill="none" stroke={color(t.team)} strokeWidth="1.8" strokeDasharray="3 2.5" />
            ) : (
              <circle cx={t.x} cy={t.y} r={t.team === "me" ? 8 : 7} fill={color(t.team)} stroke="#0e1015" strokeWidth="2" />
            )}
            {t.label && !t.ghost ? (
              <text x={t.x} y={t.top ? t.y - 16 : t.y + 20} textAnchor="middle" fontSize="9" fontWeight="700" fill={t.team === "me" ? ME : "var(--color-fg-2)"} style={{ fontFamily: "inherit" }}>
                {t.label}
              </text>
            ) : null}
          </g>
        ))}
        {s.kills?.map((k, i) => (
          <g key={i}>
            <circle cx={k.x} cy={k.y} r="7" fill="#0e1015" stroke={ENEMY} strokeWidth="1.5" opacity="0.9" />
            <path d={`M${k.x - 4} ${k.y - 4}L${k.x + 4} ${k.y + 4}M${k.x + 4} ${k.y - 4}L${k.x - 4} ${k.y + 4}`} stroke={ENEMY} strokeWidth="2.2" strokeLinecap="round" />
          </g>
        ))}
      </svg>
      <figcaption className="flex flex-col gap-1.5 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-fg-2">
          <strong className="font-semibold text-fg">{s.title}.</strong> {s.caption}
        </span>
        <span className="flex shrink-0 gap-3 text-[11px] text-muted" aria-hidden>
          <Legend c={ME} label="Toi" />
          <Legend c={ALLY} label="Alliés" />
          <Legend c={ENEMY} label="Ennemis" />
        </span>
      </figcaption>
    </figure>
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
