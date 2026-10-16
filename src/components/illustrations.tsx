import clsx from "clsx";
import {
  AlertTriangle,
  BookOpen,
  Compass,
  Crosshair,
  Eye,
  HeartPulse,
  MapPin,
  Shield,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Users,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/types";

/* Illustrations originales de l'app : emblèmes de rôle, bannière de guide, icônes de section. */

const ROLE_VAR: Record<Role, string> = { Vanguard: "var(--color-van)", Duelist: "var(--color-due)", Strategist: "var(--color-str)" };

/** Emblème géométrique du rôle : bouclier (Vanguard), viseur et lames (Duelist), croix dans un hexagone (Strategist). */
export function RoleEmblem({ role, className }: { role: Role; className?: string }) {
  const c = ROLE_VAR[role];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none">
      {role === "Vanguard" ? (
        <>
          <path d="M60 8 102 22v34c0 28-18 46-42 56C36 102 18 84 18 56V22L60 8Z" fill={c} fillOpacity={0.14} stroke={c} strokeWidth={4} strokeLinejoin="round" />
          <path d="M60 26 86 35v22c0 17-11 29-26 35-15-6-26-18-26-35V35l26-9Z" stroke={c} strokeWidth={3} strokeOpacity={0.7} strokeLinejoin="round" />
          <path d="M60 40v36M46 56h28" stroke={c} strokeWidth={5} strokeLinecap="round" />
        </>
      ) : role === "Duelist" ? (
        <>
          <circle cx={60} cy={60} r={42} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={4} />
          <circle cx={60} cy={60} r={22} stroke={c} strokeWidth={3} strokeOpacity={0.7} />
          <path d="M60 6v26M60 88v26M6 60h26M88 60h26" stroke={c} strokeWidth={4} strokeLinecap="round" />
          <path d="m38 82 44-44M82 82 38 38" stroke={c} strokeWidth={3} strokeLinecap="round" strokeOpacity={0.55} />
          <circle cx={60} cy={60} r={5} fill={c} />
        </>
      ) : (
        <>
          <path d="M60 8 105 34v52L60 112 15 86V34L60 8Z" fill={c} fillOpacity={0.14} stroke={c} strokeWidth={4} strokeLinejoin="round" />
          <path d="M60 30 86 45v30L60 90 34 75V45l26-15Z" stroke={c} strokeWidth={3} strokeOpacity={0.6} strokeLinejoin="round" />
          <path d="M60 42v36M42 60h36" stroke={c} strokeWidth={7} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** Motif de fond (lignes obliques et grille hexagonale légère), teinté par le rôle. */
function BannerPattern({ role, id }: { role: Role; id: string }) {
  const c = ROLE_VAR[role];
  return (
    <svg className="absolute inset-0 size-full" aria-hidden preserveAspectRatio="none">
      <defs>
        <pattern id={`${id}-hex`} width="28" height="48.5" patternUnits="userSpaceOnUse" patternTransform="scale(1.1)">
          <path d="M14 0 28 8.1v16.2L14 32.4 0 24.3V8.1L14 0Zm0 32.4v16.2" fill="none" stroke={c} strokeOpacity={0.12} strokeWidth={1} />
        </pattern>
        <linearGradient id={`${id}-fade`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-hex)`} mask={`url(#${id}-mask)`} />
      <g stroke={c} strokeOpacity={0.35} strokeWidth={2}>
        <line x1="62%" y1="110%" x2="78%" y2="-10%" />
        <line x1="70%" y1="110%" x2="86%" y2="-10%" strokeOpacity={0.2} />
        <line x1="78%" y1="110%" x2="94%" y2="-10%" strokeOpacity={0.12} />
      </g>
    </svg>
  );
}

/**
 * Bannière en tête de guide : dégradé du rôle, motif, emblème, et le portrait du héros s'il a été ajouté.
 */
export function GuideBanner({
  role,
  eyebrow,
  title,
  subtitle,
  portrait,
  children,
}: {
  role: Role;
  eyebrow: string;
  title: string;
  subtitle?: React.ReactNode;
  portrait?: string | null;
  children?: React.ReactNode;
}) {
  const c = ROLE_VAR[role];
  const id = `bn-${role}-${title.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-line"
      style={{ background: `linear-gradient(110deg, var(--color-surface) 35%, color-mix(in srgb, ${c} 22%, var(--color-surface)) 100%)` }}
    >
      <BannerPattern role={role} id={id} />
      <div className="relative flex flex-wrap items-center gap-5 p-5 sm:p-7">
        {portrait ? (
          <span className="relative shrink-0 overflow-hidden rounded-xl ring-2" style={{ boxShadow: `0 0 0 2px ${c}, 0 12px 40px -12px ${c}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt="" className="size-28 object-cover sm:size-32" />
          </span>
        ) : (
          <RoleEmblem role={role} className="size-24 shrink-0 sm:size-28" />
        )}
        <div className="min-w-0 flex-1">
          <p className="eyebrow" style={{ color: c }}>
            {eyebrow}
          </p>
          <h1 className="text-3xl uppercase tracking-wide sm:text-5xl">{title}</h1>
          {subtitle ? <div className="mt-2">{subtitle}</div> : null}
        </div>
        {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
      </div>
      {portrait ? <RoleEmblem role={role} className="pointer-events-none absolute -right-6 -bottom-8 size-44 opacity-25 sm:size-56" /> : null}
    </section>
  );
}

const SECTION_ICONS: [RegExp, LucideIcon][] = [
  [/philosoph|objectif|vrai/i, Compass],
  [/soin|heal|choisir qui/i, HeartPulse],
  [/d[ée]g[âa]ts|damage|plus que soigner/i, Crosshair],
  [/survie|rester en vie|d[ée]placement/i, ShieldCheck],
  [/plac|zone|point|carte|manche|convoi|t[ée]l[ée]porteur|portail/i, MapPin],
  [/ult/i, Sparkles],
  [/suivre|track/i, Eye],
  [/erreur/i, AlertTriangle],
  [/synerg|[ée]quipe/i, Users],
  [/mobilit|mouvement/i, Wind],
  [/combat|fight|duel|attaquer|d[ée]fendre|pousser/i, Swords],
  [/counter|contre/i, Shield],
  [/cible/i, Target],
];

/** Icône déduite du titre de la section (« Ultime… » → étincelles, « Erreurs… » → alerte, etc.). */
export function SectionIcon({ title, role, className, color }: { title: string; role: Role; className?: string; color?: string }) {
  const Icon = SECTION_ICONS.find(([re]) => re.test(title))?.[1] ?? BookOpen;
  const c = color ?? ROLE_VAR[role];
  return (
    <span
      aria-hidden
      className={clsx("grid size-9 shrink-0 place-items-center rounded-lg", className)}
      style={{ background: `color-mix(in srgb, ${c} 16%, transparent)`, color: c, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${c} 45%, transparent)` }}
    >
      <Icon className="size-5" />
    </span>
  );
}
