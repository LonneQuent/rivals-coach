import type { DiagramKind } from "@/lib/guides";

/*
 * Schémas tactiques originaux, vus de dessus (320 × 180).
 * Alliés à gauche en bleu, ennemis à droite en rouge, « toi » en couleur d'accent.
 * Flèches pointillées = déplacements, traits pleins = tirs.
 */

const ALLY = "#6fa8ff";
const ENEMY = "var(--color-bad)";
const ME = "var(--color-accent)";

type Team = "ally" | "enemy" | "me";
type Token = { x: number; y: number; team: Team; label?: string; ghost?: boolean; top?: boolean };
type Move = { d: string; team: Team };
type Shot = { x1: number; y1: number; x2: number; y2: number; team: Team };
type Wall = { x: number; y: number; w: number; h: number };
type Shield = { d: string; team: Team };

type Scene = {
  title: string;
  caption: string;
  walls?: Wall[];
  shields?: Shield[];
  moves?: Move[];
  shots?: Shot[];
  tokens: Token[];
  zones?: { cx: number; cy: number; r: number; team: Team }[];
};

const color = (t: Team) => (t === "ally" ? ALLY : t === "enemy" ? ENEMY : ME);

/** Une équipe ennemie type : tank devant, deux dégâts, deux soigneurs derrière. */
const enemyTeam = (dx = 0): Token[] => [
  { x: 214 + dx, y: 92, team: "enemy", label: "Tank" },
  { x: 244 + dx, y: 58, team: "enemy" },
  { x: 244 + dx, y: 126, team: "enemy" },
  { x: 284 + dx, y: 74, team: "enemy", label: "Soin" },
  { x: 284 + dx, y: 112, team: "enemy" },
];

export const DIAGRAM_SCENES: Record<DiagramKind, Scene> = {
  angle: {
    title: "Prendre un angle",
    caption: "Ne tire pas dans le bouclier : décale-toi pour toucher la backline par le côté.",
    walls: [{ x: 140, y: 14, w: 26, h: 30 }],
    shields: [{ d: "M196 60 Q186 92 196 124", team: "enemy" }],
    moves: [{ d: "M78 98 Q110 60 150 54", team: "me" }],
    shots: [{ x1: 156, y1: 54, x2: 280, y2: 74, team: "me" }],
    tokens: [
      { x: 70, y: 60, team: "ally", label: "Tank" },
      { x: 52, y: 124, team: "ally" },
      { x: 32, y: 92, team: "ally" },
      { x: 78, y: 98, team: "me", ghost: true },
      { x: 156, y: 54, team: "me", label: "Toi" },
      ...enemyTeam(),
    ],
  },
  dive: {
    title: "Plonger à deux",
    caption: "Plonge en même temps qu'un allié sur la même cible, puis ressors avant de mourir.",
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
      { x: 284, y: 80, team: "enemy", label: "Soin" },
      { x: 290, y: 150, team: "enemy" },
      { x: 266, y: 56, team: "me", label: "Toi", top: true },
      { x: 300, y: 112, team: "ally" },
    ],
  },
  brawl: {
    title: "Avancer groupés",
    caption: "Tank devant, soigneurs collés derrière, tout le monde frappe la même cible.",
    walls: [
      { x: 150, y: 0, w: 34, h: 60 },
      { x: 150, y: 122, w: 34, h: 58 },
    ],
    moves: [{ d: "M110 91 L176 91", team: "ally" }],
    zones: [{ cx: 98, cy: 91, r: 40, team: "ally" }],
    shots: [
      { x1: 92, y1: 66, x2: 208, y2: 90, team: "ally" },
      { x1: 100, y1: 128, x2: 206, y2: 98, team: "me" },
    ],
    tokens: [
      { x: 122, y: 91, team: "ally", label: "Tank" },
      { x: 92, y: 66, team: "ally" },
      { x: 98, y: 116, team: "me", label: "Toi" },
      { x: 70, y: 80, team: "ally" },
      { x: 70, y: 104, team: "ally", label: "Soin" },
      ...enemyTeam(),
    ],
  },
  peel: {
    title: "Protéger ta backline",
    caption: "Un plongeur sur tes soigneurs ? Fais demi-tour et sors-le avant de repartir devant.",
    moves: [{ d: "M162 84 Q130 96 98 106", team: "me" }],
    tokens: [
      { x: 30, y: 92, team: "ally", label: "Soin" },
      { x: 26, y: 150, team: "ally" },
      { x: 58, y: 112, team: "enemy", label: "Plongeur" },
      { x: 162, y: 84, team: "me", ghost: true },
      { x: 88, y: 108, team: "me", label: "Toi", top: true },
      { x: 168, y: 50, team: "ally", label: "Tank" },
      { x: 150, y: 140, team: "ally" },
      { x: 236, y: 70, team: "enemy", label: "Tank" },
      { x: 270, y: 104, team: "enemy" },
      { x: 290, y: 56, team: "enemy" },
      { x: 296, y: 140, team: "enemy" },
    ],
  },
  pull: {
    title: "Isoler une cible",
    caption: "Ramène une cible seule dans ton équipe : c'est du 5 contre 1.",
    zones: [{ cx: 96, cy: 92, r: 46, team: "ally" }],
    moves: [{ d: "M216 92 Q170 72 118 90", team: "enemy" }],
    tokens: [
      { x: 216, y: 92, team: "enemy", ghost: true },
      { x: 110, y: 92, team: "enemy", label: "Cible" },
      { x: 150, y: 116, team: "me", label: "Toi" },
      { x: 80, y: 64, team: "ally" },
      { x: 68, y: 112, team: "ally" },
      { x: 40, y: 88, team: "ally" },
      { x: 92, y: 140, team: "ally" },
      { x: 250, y: 58, team: "enemy" },
      { x: 254, y: 126, team: "enemy" },
      { x: 290, y: 76, team: "enemy" },
      { x: 290, y: 112, team: "enemy" },
    ],
  },
  poke: {
    title: "Harceler à distance",
    caption: "Reste derrière ton bouclier et use l'adversaire de loin avant l'engagement.",
    shields: [{ d: "M134 54 Q146 92 134 130", team: "ally" }],
    shots: [
      { x1: 104, y1: 82, x2: 214, y2: 90, team: "me" },
      { x1: 104, y1: 82, x2: 244, y2: 60, team: "me" },
    ],
    tokens: [
      { x: 116, y: 110, team: "ally", label: "Tank" },
      { x: 104, y: 82, team: "me", label: "Toi", top: true },
      { x: 92, y: 116, team: "ally" },
      { x: 56, y: 72, team: "ally" },
      { x: 50, y: 112, team: "ally" },
      ...enemyTeam(10),
    ],
  },
  flank: {
    title: "Prendre à revers",
    caption: "Contourne pendant que ton équipe occupe l'avant, puis frappe dans le dos.",
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
      { x: 284, y: 80, team: "enemy", label: "Soin" },
      { x: 284, y: 118, team: "enemy" },
    ],
  },
};

export const DIAGRAM_LABEL: Record<DiagramKind, string> = Object.fromEntries(
  Object.entries(DIAGRAM_SCENES).map(([k, v]) => [k, v.title]),
) as Record<DiagramKind, string>;

export function TacticDiagram({ kind, className = "" }: { kind: DiagramKind; className?: string }) {
  const s = DIAGRAM_SCENES[kind];
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

        {s.zones?.map((z, i) => (
          <circle key={i} cx={z.cx} cy={z.cy} r={z.r} fill={color(z.team)} opacity="0.1" stroke={color(z.team)} strokeOpacity="0.35" strokeDasharray="3 4" />
        ))}
        {s.walls?.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} rx="3" fill="var(--color-surface-3)" stroke="#3a404d" strokeWidth="1.5" />
        ))}
        {s.shields?.map((sh, i) => (
          <path key={i} d={sh.d} fill="none" stroke={color(sh.team)} strokeWidth="5" strokeLinecap="round" opacity="0.75" />
        ))}
        {s.shots?.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color(l.team)} strokeWidth="1.6" opacity="0.8" markerEnd={`url(#${id}-arrow-${l.team})`} />
        ))}
        {s.moves?.map((m, i) => (
          <path key={i} d={m.d} fill="none" stroke={color(m.team)} strokeWidth="2.2" strokeDasharray="5 4" strokeLinecap="round" markerEnd={`url(#${id}-arrow-${m.team})`} />
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
