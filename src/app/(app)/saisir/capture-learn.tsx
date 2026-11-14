"use client";

import clsx from "clsx";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Check, ClipboardPaste, Images, Loader2, TriangleAlert } from "lucide-react";
import type { Hero, Role } from "@/lib/types";
import { buildFpIndex, decodeFp, detectRole, fpDistance, FP_MAX_DISTANCE, nearestHero, type Fingerprint, type FpIndex } from "@/lib/capture/match";
import type { Reader } from "@/lib/capture/read";
import { RoleBadge, buttonClass } from "@/components/ui";
import { HeroCombobox, type HeroPick } from "@/components/hero-combobox";
import { learnFingerprints } from "./capture-actions";

/** Un portrait inconnu, vu une ou plusieurs fois dans les captures déposées. */
type Cluster = {
  id: string;
  kind: Fingerprint["kind"];
  /** Empreintes à enregistrer : la première vue, puis les variantes assez différentes pour être utiles. */
  fps: string[];
  bytes: Uint8Array;
  thumb: string;
  role: Role | null;
  seen: number;
  pick: HeroPick;
};

const MAX_FILES = 40;
/** Une variante n'est gardée que si elle s'écarte assez de la première empreinte du portrait. */
const VARIANT_GAP = 12;

/**
 * Apprentissage des portraits : on dépose d'anciennes captures, l'app en sort les portraits qu'elle ne connaît pas,
 * regroupe ceux qui se ressemblent, et il reste à nommer chacun une fois. Aucune partie n'est créée.
 */
export function CaptureLearn({
  heroes,
  fingerprints,
  ready,
  onLearn = learnFingerprints,
}: {
  heroes: Hero[];
  fingerprints: Fingerprint[];
  ready: boolean;
  onLearn?: typeof learnFingerprints;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const readerRef = useRef<Reader | null>(null);
  const indexRef = useRef<FpIndex>(buildFpIndex(fingerprints));
  const [reading, setReading] = useState(false);
  const [progress, setProgress] = useState("");
  const [notices, setNotices] = useState<string[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [stats, setStats] = useState<{ files: number; known: number } | null>(null);
  const [saved, setSaved] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const handleFiles = useCallback(
    async (files: File[]) => {
      const images = files.filter((f) => f.type.startsWith("image/")).slice(0, MAX_FILES);
      if (!images.length || reading) return;
      setReading(true);
      setError(null);
      const warn: string[] = [];
      let known = 0, read = 0;
      // On repart des portraits déjà en attente : déposer une seconde fournée complète la première
      const next = clusters.map((c) => ({ ...c }));
      const add = (kind: Fingerprint["kind"], fp: string, thumb: string, role: Role | null) => {
        if (nearestHero(indexRef.current, kind, fp)) return void known++;
        let bytes: Uint8Array;
        try {
          bytes = decodeFp(fp);
        } catch {
          return;
        }
        const hit = next.find((c) => c.kind === kind && fpDistance(c.bytes, bytes) <= FP_MAX_DISTANCE[kind]);
        if (!hit) return void next.push({ id: `${kind}-${next.length}-${fp.slice(0, 12)}`, kind, fps: [fp], bytes, thumb, role, seen: 1, pick: null });
        hit.seen++;
        hit.role ??= role;
        if (hit.fps.length < 3 && hit.fps.every((f) => fpDistance(decodeFp(f), bytes) > VARIANT_GAP)) hit.fps.push(fp);
      };
      try {
        setProgress("Chargement du moteur de lecture…");
        readerRef.current ??= await (await import("@/lib/capture/read")).createReader();
        for (const [n, file] of images.entries()) {
          setProgress(`Lecture de la capture ${n + 1} sur ${images.length}…`);
          const res = await readerRef.current.read(file);
          if (!res) {
            warn.push(`« ${file.name || `capture ${n + 1}`} » : tableau des scores introuvable.`);
            continue;
          }
          read++;
          for (const row of res.capture.rows) add("banner", row.fp, row.thumb, detectRole(row.roleFp));
          for (const a of res.capture.popover?.avatars ?? []) add("avatar", a.fp, a.thumb, null);
        }
        if (files.length > MAX_FILES) warn.push(`Seules les ${MAX_FILES} premières captures ont été lues. Dépose les suivantes ensuite.`);
        setClusters(next);
        setStats((s) => ({ files: (s?.files ?? 0) + read, known: (s?.known ?? 0) + known }));
        setNotices(warn);
      } catch {
        setNotices(["La lecture a échoué. Recharge la page et réessaie."]);
      } finally {
        setReading(false);
      }
    },
    [clusters, reading],
  );

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = [...(e.clipboardData?.files ?? [])];
      if (files.some((f) => f.type.startsWith("image/"))) {
        e.preventDefault();
        void handleFiles(files);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFiles]);

  const sorted = useMemo(() => [...clusters].sort((a, b) => Number(a.kind === "avatar") - Number(b.kind === "avatar") || b.seen - a.seen), [clusters]);
  const named = clusters.filter((c) => c.pick);
  const heroById = useMemo(() => new Map(heroes.map((h) => [h.id, h])), [heroes]);

  function save() {
    if (!named.length || pending) return;
    const payload = named.flatMap((c) => c.fps.map((fp) => ({ kind: c.kind, hero_id: c.pick!.heroId, fp }))).slice(0, 300);
    setError(null);
    start(async () => {
      const res = await onLearn(payload);
      if (!res.ok) return setError(res.error);
      indexRef.current = [...indexRef.current, ...buildFpIndex(payload)];
      setSaved((v) => v + named.length);
      setClusters((cs) => cs.filter((c) => !c.pick));
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {!ready ? (
        <p className="flex items-start gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          L&apos;import par capture n&apos;est pas encore activé : la migration 0017_capture_import.sql doit être exécutée dans Supabase.
        </p>
      ) : null}

      {saved ? (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-good/40 bg-good-bg px-3 py-2 text-sm text-good" aria-live="polite">
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" aria-hidden /> {saved} portrait{saved > 1 ? "s appris" : " appris"}. Ils seront reconnus pour tout le groupe.
          </span>
          <Link href="/saisir?mode=capture" className="font-semibold text-accent hover:underline">
            Importer une partie
          </Link>
        </p>
      ) : null}

      <section
        className={clsx("card flex flex-col items-center gap-3 border-dashed text-center", clusters.length ? "py-5" : "py-10", reading && "opacity-80")}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFiles([...e.dataTransfer.files]);
        }}
      >
        {reading ? (
          <>
            <Loader2 className="size-8 animate-spin text-accent" aria-hidden />
            <p className="text-sm text-fg-2" aria-live="polite">
              {progress}
            </p>
          </>
        ) : (
          <>
            {clusters.length ? null : <Images className="size-8 text-accent" aria-hidden />}
            {clusters.length ? null : (
              <div>
                <p className="font-display text-xl font-bold uppercase tracking-wide">Dépose d&apos;anciennes captures du tableau des scores</p>
                <p className="mx-auto mt-1 max-w-[62ch] text-sm text-muted">
                  Jusqu&apos;à {MAX_FILES} à la fois, même de vieilles parties : seuls les portraits sont lus, aucune partie n&apos;est créée. Les portraits que l&apos;app ne connaît pas
                  sont regroupés, et tu nommes chacun une seule fois.
                </p>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button type="button" className={buttonClass(clusters.length ? "default" : "primary")} onClick={() => inputRef.current?.click()} disabled={!ready}>
                {clusters.length ? "Ajouter des captures" : "Choisir des captures"}
              </button>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                <ClipboardPaste className="size-4" aria-hidden /> ou colle avec Ctrl + V
              </span>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="sr-only"
              aria-label="Captures du tableau des scores"
              onChange={(e) => {
                void handleFiles([...(e.target.files ?? [])]);
                e.target.value = "";
              }}
            />
          </>
        )}
      </section>

      {notices.map((n) => (
        <p key={n} className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-fg-2">
          {n}
        </p>
      ))}

      {stats ? (
        <section className="card flex flex-col gap-4" aria-labelledby="learn-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="learn-title" className="text-lg uppercase tracking-wide">
                {clusters.length ? `${clusters.length} portrait${clusters.length > 1 ? "s" : ""} à nommer` : "Tout est déjà reconnu"}
              </h2>
              <p className="tabular text-sm text-muted">
                {stats.files} capture{stats.files > 1 ? "s lues" : " lue"} · {stats.known} portrait{stats.known > 1 ? "s déjà reconnus" : " déjà reconnu"}
                {clusters.length ? " · un même héros avec un autre costume compte pour un portrait différent" : ""}
              </p>
            </div>
            {clusters.length ? (
              <button type="button" className={buttonClass("primary")} onClick={save} disabled={!named.length || pending}>
                {pending ? "Enregistrement…" : named.length ? `Enregistrer ${named.length} portrait${named.length > 1 ? "s" : ""}` : "Nomme au moins un portrait"}
              </button>
            ) : null}
          </div>
          {error ? <p className="rounded-lg border border-bad/40 bg-bad-bg px-3 py-2 text-sm text-bad">{error}</p> : null}
          {clusters.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sorted.map((c) => {
                const wrongRole = c.pick && c.role && !heroById.get(c.pick.heroId)?.roles.includes(c.role);
                return (
                  <li key={c.id} className={clsx("flex flex-col gap-2 rounded-lg border p-3", c.pick ? "border-good/40" : "border-line")}>
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.thumb} alt="" className={clsx("shrink-0 rounded object-cover", c.kind === "banner" ? "h-[38px] w-[150px]" : "size-10")} />
                      <div className="flex min-w-0 flex-col items-start gap-1">
                        {c.role ? <RoleBadge role={c.role} /> : <span className="text-xs text-muted">Fenêtre « Héros utilisés »</span>}
                        <span className="tabular text-xs text-muted">vu {c.seen} fois</span>
                      </div>
                    </div>
                    <HeroCombobox
                      id={`learn-${c.id}`}
                      heroes={heroes}
                      label={wrongRole ? <span className="text-bad">La capture indique un {c.role} : vérifie ce héros</span> : <span className={c.pick ? "sr-only" : "text-accent"}>Qui est-ce ?</span>}
                      value={c.pick}
                      firstRole={c.role ?? undefined}
                      onChange={(v) => setClusters((cs) => cs.map((x) => (x.id === c.id ? { ...x, pick: v } : x)))}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-fg-2">Les prochaines captures avec ces héros et ces costumes se rempliront toutes seules.</p>
          )}
        </section>
      ) : null}
    </div>
  );
}
