import type { ReactNode } from "react";

/**
 * Mascotte de l'app : un pingouin professeur (dessin original).
 * Corps bleu ardoise pour rester visible sur le fond sombre, détails dans la couleur d'accent.
 */
export type MascotPose = "point" | "think" | "warn";

/**
 * Poses : « point » (baguette, par défaut), « think » (nageoire au menton, point d'interrogation),
 * « warn » (nageoire levée, panneau « ! »).
 */
export function Mascot({ className = "size-20", bob = false, title, pose = "point" }: { className?: string; bob?: boolean; title?: string; pose?: MascotPose }) {
  return (
    <svg
      viewBox="0 0 128 148"
      className={`${className} shrink-0 ${bob ? "mascot-bob" : ""}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* Ombre */}
      <ellipse cx="66" cy="141" rx="34" ry="5" fill="#000" opacity="0.35" />

      {/* Baguette de prof */}
      {pose === "point" ? (
        <>
          <line x1="31" y1="95" x2="9" y2="50" stroke="#a7743f" strokeWidth="4" strokeLinecap="round" />
          <circle cx="9" cy="50" r="3.6" fill="var(--color-accent)" />
        </>
      ) : null}
      {pose === "think" ? (
        <text x="10" y="44" fontSize="30" fontWeight="800" fill="var(--color-accent)" style={{ fontFamily: "inherit" }}>
          ?
        </text>
      ) : null}
      {pose === "warn" ? (
        <g>
          <circle cx="112" cy="26" r="12" fill="var(--color-bad)" stroke="#0e1015" strokeWidth="2" />
          <rect x="110" y="17" width="4" height="11" rx="2" fill="#0e1015" />
          <circle cx="112" cy="33" r="2.3" fill="#0e1015" />
        </g>
      ) : null}

      {/* Pattes */}
      <ellipse cx="52" cy="135" rx="11" ry="5" fill="#f0a43a" stroke="#c97d1a" strokeWidth="1.2" />
      <ellipse cx="80" cy="135" rx="11" ry="5" fill="#f0a43a" stroke="#c97d1a" strokeWidth="1.2" />

      {/* Corps */}
      <path
        d="M66 30C96 30 104 62 104 92C104 122 88 136 66 136C44 136 28 122 28 92C28 62 36 30 66 30Z"
        fill="#34405a"
        stroke="#1b2130"
        strokeWidth="2.5"
      />
      {/* Reflet */}
      <path d="M44 52C40 62 38 74 38 86" stroke="#4a5877" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Ventre et visage */}
      <path d="M66 64C86 64 92 84 92 102C92 122 80 130 66 130C52 130 40 122 40 102C40 84 46 64 66 64Z" fill="#f3efe6" />
      <circle cx="56.5" cy="56" r="11.5" fill="#f3efe6" />
      <circle cx="75.5" cy="56" r="11.5" fill="#f3efe6" />
      <ellipse cx="66" cy="66" rx="15" ry="9" fill="#f3efe6" />

      {/* Joues */}
      <ellipse cx="47" cy="65" rx="4" ry="2.4" fill="#f29a9a" opacity="0.6" />
      <ellipse cx="85" cy="65" rx="4" ry="2.4" fill="#f29a9a" opacity="0.6" />

      {/* Yeux */}
      <circle cx="56.5" cy="56" r="4.2" fill="#11151d" />
      <circle cx="75.5" cy="56" r="4.2" fill="#11151d" />
      <circle cx="58" cy="54.5" r="1.4" fill="#fff" />
      <circle cx="77" cy="54.5" r="1.4" fill="#fff" />

      {/* Lunettes */}
      <circle cx="56.5" cy="56" r="8" fill="#fff" fillOpacity="0.08" stroke="#11151d" strokeWidth="2.4" />
      <circle cx="75.5" cy="56" r="8" fill="#fff" fillOpacity="0.08" stroke="#11151d" strokeWidth="2.4" />
      <path d="M64.5 55Q66 53 67.5 55" stroke="#11151d" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Bec */}
      <path d="M60 66Q66 62 72 66Q66 76 60 66Z" fill="#f0a43a" stroke="#c97d1a" strokeWidth="1" />

      {/* Nageoires */}
      {pose === "think" ? (
        <path d="M36 84C28 80 30 70 44 70C52 70 58 74 58 78C52 78 46 80 40 90Z" fill="#2b354b" stroke="#1b2130" strokeWidth="2" />
      ) : (
        <path d="M35 80C22 82 18 94 26 101C30 97 34 92 39 88Z" fill="#2b354b" stroke="#1b2130" strokeWidth="2" />
      )}
      {pose === "warn" ? (
        <path d="M97 82C106 70 108 54 104 44C99 50 95 62 93 76Z" fill="#2b354b" stroke="#1b2130" strokeWidth="2" />
      ) : (
        <path d="M98 84C110 92 112 106 106 113C102 105 98 99 96 94Z" fill="#2b354b" stroke="#1b2130" strokeWidth="2" />
      )}

      {/* Toque de diplômé */}
      <path d="M46 38Q66 30 86 38L84 46Q66 40 48 46Z" fill="#11151d" />
      <polygon points="66,16 98,27 66,38 34,27" fill="#1b2130" stroke="#0b0e14" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M66 27L94 30L95 43" stroke="var(--color-accent)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="95" cy="46" rx="2.6" ry="4" fill="var(--color-accent)" />
      <circle cx="66" cy="27" r="2.2" fill="var(--color-accent)" />
    </svg>
  );
}

/** Le pingouin qui parle : mascotte + bulle. */
export function MascotTip({ title, children, className = "", pose }: { title?: string; children: ReactNode; className?: string; pose?: MascotPose }) {
  return (
    <div className={`flex items-end gap-3 ${className}`}>
      <Mascot className="size-16 sm:size-20" bob pose={pose} />
      <div className="relative mb-3 min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-4 py-3">
        <span
          aria-hidden
          className="absolute -left-[7px] bottom-4 size-3 rotate-45 border-b border-l border-line bg-surface-2"
        />
        {title ? <p className="eyebrow text-accent">{title}</p> : null}
        <div className="text-sm text-fg-2">{children}</div>
      </div>
    </div>
  );
}
