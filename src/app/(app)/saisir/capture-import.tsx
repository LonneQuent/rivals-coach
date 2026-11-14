"use client";

import clsx from "clsx";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Check, ClipboardPaste, ImageUp, Loader2, TriangleAlert, Users } from "lucide-react";
import { STAT_FIELDS, type Hero, type Refs, type Role, type StatKey } from "@/lib/types";
import { buildFpIndex, detectRole, FP_SAME, mapKey, matchMap, matchMode, nearestHero, sameName, type Fingerprint, type FpIndex } from "@/lib/capture/match";
import type { CaptureStats, ParsedCapture, Reader } from "@/lib/capture/read";
import { buttonClass } from "@/components/ui";
import { HeroCombobox, type HeroPick } from "@/components/hero-combobox";
import type { CaptureImport, ImportOutcome, ImportResult } from "@/lib/capture/schema";
import { importCapture } from "./capture-actions";

export type CaptureMember = { id: string; pseudo: string | null; ingame_name: string | null; accepts: boolean };

type Extra = { fp: string; thumb: string; pick: HeroPick; known: boolean };
type Slot = {
  index: number;
  team: 0 | 1;
  name: string;
  award: boolean;
  fp: string;
  roleFp: string;
  thumb: string;
  stats: Record<StatKey, string>;
  pick: HeroPick;
  /** L'empreinte de cette bannière est déjà enregistrée : inutile de la renvoyer. */
  known: boolean;
  memberId: string | null;
  /** Vignettes de la fenêtre « Héros utilisés », quand une capture la montre pour ce joueur. */
  extras: Extra[];
};
type Draft = {
  key: string;
  replayId: string | null;
  result: "win" | "loss" | "";
  mapLabel: string;
  mapId: string;
  modeId: string;
  duration: string;
  slots: Slot[];
  captures: number;
};

const ACTION_LABEL: Record<ImportOutcome["action"], string> = {
  created: "partie ajoutée",
  updated: "partie déjà importée, mise à jour",
  merged: "saisie existante complétée",
  refused: "refuse les imports de ses coéquipiers",
};

const str = (v: number | null | undefined) => (v === null || v === undefined ? "" : String(v));
const num = (v: string) => {
  if (v.trim() === "") return null;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
};

function localNow() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function CaptureImport({
  refs,
  me,
  members,
  fingerprints,
  aliases,
  defaultQueueId,
  ready,
  onImport = importCapture,
}: {
  refs: Refs;
  me: { id: string; rankId: number | null };
  members: CaptureMember[];
  fingerprints: Fingerprint[];
  aliases: { label: string; map_id: number }[];
  defaultQueueId: number | null;
  ready: boolean;
  /** Remplaçable pour les tests ; par défaut, l'action serveur. */
  onImport?: (payload: CaptureImport) => Promise<ImportResult>;
}) {
  const heroById = useMemo(() => new Map(refs.heroes.map((h) => [h.id, h])), [refs.heroes]);
  const readerRef = useRef<Reader | null>(null);
  const indexRef = useRef<FpIndex>(buildFpIndex(fingerprints));
  const inputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<"idle" | "reading" | "review">("idle");
  const [progress, setProgress] = useState("");
  const [notices, setNotices] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [cursor, setCursor] = useState(0);
  const [queueId, setQueueId] = useState(str(defaultQueueId));
  const [playedAt, setPlayedAt] = useState(localNow);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ outcomes: ImportOutcome[]; mine?: string }[]>([]);
  const [pending, start] = useTransition();

  useEffect(
    () => () => {
      void readerRef.current?.close();
    },
    [],
  );

  const pickFor = useCallback(
    (kind: Fingerprint["kind"], fp: string): { pick: HeroPick; known: boolean } => {
      const hit = nearestHero(indexRef.current, kind, fp);
      const hero = hit ? heroById.get(hit.hero_id) : undefined;
      return hero ? { pick: { heroId: hero.id, role: hero.roles[0] }, known: hit!.distance <= FP_SAME } : { pick: null, known: false };
    },
    [heroById],
  );

  const buildDraft = useCallback(
    (key: string, captures: ParsedCapture[]): Draft => {
      // La capture sans fenêtre « Héros utilisés » sert de base : tous ses pseudos sont lisibles
      const base = captures.find((c) => !c.popover) ?? captures[0];
      const meIndex = captures.map((c) => c.rows.findIndex((r) => r.me)).find((i) => i >= 0) ?? -1;
      const taken = new Set<string>();
      const slots: Slot[] = base.rows.map((row, i) => {
        const name = captures.map((c) => c.rows[i].name).find((n) => n.length > 1) ?? "";
        const stats = {} as Record<StatKey, string>;
        for (const f of STAT_FIELDS) stats[f.key] = str(captures.map((c) => c.rows[i].stats?.[f.key as keyof CaptureStats]).find((v) => v !== null && v !== undefined));
        let memberId: string | null = null;
        if (i === meIndex) memberId = me.id;
        else if (name) {
          const m = members.find((x) => x.id !== me.id && x.accepts && !taken.has(x.id) && ((x.ingame_name && sameName(name, x.ingame_name)) || (x.pseudo && sameName(name, x.pseudo))));
          if (m) memberId = m.id;
        }
        if (memberId) taken.add(memberId);
        return { index: i, team: row.team, name, award: captures.some((c) => c.rows[i].award), fp: row.fp, roleFp: row.roleFp, thumb: row.thumb, stats, ...pickFor("banner", row.fp), memberId, extras: [] };
      });
      for (const c of captures) {
        if (!c.popover) continue;
        const target = c.popover.row ?? meIndex;
        if (target < 0 || slots[target].extras.length) continue;
        const slot = slots[target];
        slot.extras = c.popover.avatars.map((a) => ({ fp: a.fp, thumb: a.thumb, ...pickFor("avatar", a.fp) }));
        // Hypothèse : la bannière montre le premier héros de la liste. Ce que l'un sait pré-remplit l'autre (modifiable)
        if (!slot.pick && slot.extras[0].pick) slot.pick = slot.extras[0].pick;
        else if (slot.pick && !slot.extras[0].pick) slot.extras[0].pick = slot.pick;
      }
      const map = matchMap(base.mapLabel, refs.maps, aliases);
      const mode = matchMode(base.modeLabel, refs.gameModes);
      return {
        key,
        replayId: base.replayId,
        result: base.result ?? "",
        mapLabel: base.mapLabel,
        mapId: str(map?.id),
        modeId: str(mode?.id ?? map?.game_mode_id),
        duration: str(base.durationMin),
        slots,
        captures: captures.length,
      };
    },
    [aliases, me.id, members, pickFor, refs.gameModes, refs.maps],
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      const images = files.filter((f) => f.type.startsWith("image/")).slice(0, 12);
      if (!images.length || phase === "reading") return;
      setPhase("reading");
      setError(null);
      setDone([]);
      const warn: string[] = [];
      try {
        setProgress("Chargement du moteur de lecture…");
        readerRef.current ??= await (await import("@/lib/capture/read")).createReader();
        const groups = new Map<string, ParsedCapture[]>();
        for (const [n, file] of images.entries()) {
          setProgress(`Lecture de la capture ${n + 1} sur ${images.length}…`);
          const res = await readerRef.current.read(file);
          if (!res) {
            warn.push(`« ${file.name || `capture ${n + 1}`} » : tableau des scores introuvable. Il faut une capture d'écran directe du jeu, pas une photo de l'écran.`);
            continue;
          }
          await res.readStats(res.capture.rows.map((r) => r.index));
          const key = res.capture.replayId ?? `sans-id-${n}`;
          groups.set(key, [...(groups.get(key) ?? []), res.capture]);
          if (!res.capture.replayId) warn.push(`« ${file.name || `capture ${n + 1}`} » : ID de replay illisible, les doublons ne pourront être repérés qu'à partir des stats.`);
        }
        const next = [...groups.entries()].map(([key, caps]) => buildDraft(key, caps));
        setNotices(warn);
        setDrafts(next);
        setCursor(0);
        setPlayedAt(localNow());
        setPhase(next.length ? "review" : "idle");
      } catch {
        setNotices(["La lecture a échoué. Recharge la page et réessaie ; si le problème persiste, utilise la saisie manuelle."]);
        setPhase("idle");
      }
    },
    [buildDraft, phase],
  );

  // Coller une capture depuis le presse-papiers (Impr. écran puis Ctrl + V)
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

  const draft = drafts[cursor];
  const patch = (p: Partial<Draft>) => setDrafts((ds) => ds.map((d, i) => (i === cursor ? { ...d, ...p } : d)));
  const patchSlot = (index: number, p: Partial<Slot>) => setDrafts((ds) => ds.map((d, i) => (i === cursor ? { ...d, slots: d.slots.map((s) => (s.index === index ? { ...s, ...p } : s)) } : d)));

  function heroesOf(s: Slot): { hero: Hero; role: Role }[] | null {
    const out: { hero: Hero; role: Role }[] = [];
    const push = (pick: HeroPick) => {
      if (!pick) return false;
      const hero = heroById.get(pick.heroId);
      if (!hero) return false;
      if (!out.some((o) => o.hero.id === hero.id)) out.push({ hero, role: pick.role });
      return true;
    };
    const seenRole = roles.get(s.index);
    const banner = s.pick && seenRole && heroById.get(s.pick.heroId)?.roles.includes(seenRole) ? { ...s.pick, role: seenRole } : s.pick;
    if (!push(banner)) return null;
    for (const e of s.extras) if (!push(e.pick)) return null;
    return out;
  }

  function save() {
    if (!draft) return;
    setError(null);
    const mine = draft.slots.find((s) => s.memberId === me.id);
    if (!mine) return setError("Indique quelle ligne est la tienne (menu « Membre » de la ligne).");
    if (!draft.result) return setError("Indique si ton équipe a gagné ou perdu.");
    const players: CaptureImport["players"] = [];
    for (const s of draft.slots.filter((x) => x.memberId)) {
      const heroes = heroesOf(s);
      const who = s.memberId === me.id ? "ta ligne" : `la ligne de ${s.name || "ce coéquipier"}`;
      if (!heroes) return setError(`Identifie le ou les héros de ${who}.`);
      const stats = Object.fromEntries(STAT_FIELDS.map((f) => [f.key, num(s.stats[f.key])])) as Record<StatKey, number | null>;
      if (stats.kills === null || stats.deaths === null || stats.assists === null) return setError(`Complète les éliminations, morts et assists de ${who}.`);
      const result = s.team === mine.team ? draft.result : draft.result === "win" ? "loss" : "win";
      const enemyIds = [...new Set(draft.slots.filter((o) => o.team !== s.team && o.pick).map((o) => o.pick!.heroId))].slice(0, 6);
      players.push({
        user_id: s.memberId!,
        name: s.name,
        result,
        award: s.award ? (result === "win" ? "MVP" : "SVP") : "",
        ...stats,
        heroes: heroes.map((h) => ({ hero_id: h.hero.id, role: h.role, play_minutes: null })),
        enemy_ids: enemyIds,
        roster: draft.slots.map((o) => ({
          side: o.team === s.team ? ("ally" as const) : ("enemy" as const),
          me: o.index === s.index,
          hero_id: o.pick?.heroId ?? null,
          role: roles.get(o.index) ?? (o.pick ? (heroById.get(o.pick.heroId)?.roles[0] ?? null) : null),
          ...(Object.fromEntries(STAT_FIELDS.map((f) => [f.key, num(o.stats[f.key])])) as Record<StatKey, number | null>),
        })),
      });
    }
    const learned = new Map<string, CaptureImport["fingerprints"][number]>();
    for (const s of draft.slots) {
      if (s.pick && !s.known) learned.set(`banner|${s.fp}`, { kind: "banner", hero_id: s.pick.heroId, fp: s.fp });
      for (const e of s.extras) if (e.pick && !e.known) learned.set(`avatar|${e.fp}`, { kind: "avatar", hero_id: e.pick.heroId, fp: e.fp });
    }
    const when = new Date(playedAt);
    const payload: CaptureImport = {
      replay_id: draft.replayId,
      played_at: Number.isNaN(when.getTime()) ? new Date().toISOString() : when.toISOString(),
      queue_id: num(queueId),
      game_mode_id: num(draft.modeId),
      map_id: num(draft.mapId),
      rank_id: me.rankId,
      duration_min: num(draft.duration),
      map_label: draft.mapId ? mapKey(draft.mapLabel).slice(0, 80) : "",
      players,
      fingerprints: [...learned.values()].slice(0, 40),
    };
    start(async () => {
      let res: ImportResult;
      try {
        res = await onImport(payload);
      } catch {
        return setError("Le serveur n'a pas répondu. Vérifie ta connexion et réessaie.");
      }
      if (!res.ok) return setError(res.error);
      // Les héros qu'on vient d'identifier servent tout de suite aux captures suivantes
      indexRef.current = [...indexRef.current, ...buildFpIndex(payload.fingerprints)];
      setDone((d) => [...d, { outcomes: res.outcomes, mine: res.outcomes.find((o) => o.user_id === me.id)?.match_id }]);
      if (cursor + 1 < drafts.length) {
        setDrafts((ds) =>
          ds.map((d, i) =>
            i <= cursor
              ? d
              : {
                  ...d,
                  slots: d.slots.map((s) => ({
                    ...s,
                    ...(s.pick ? {} : pickFor("banner", s.fp)),
                    extras: s.extras.map((e) => (e.pick ? e : { ...e, ...pickFor("avatar", e.fp) })),
                  })),
                },
          ),
        );
        setCursor(cursor + 1);
        window.scrollTo({ top: 0 });
      } else {
        setDrafts([]);
        setPhase("idle");
      }
    });
  }

  // Rôle de chaque ligne, lu sur son icône : connu avant même que le héros soit nommé
  const roles = useMemo(() => {
    const out = new Map<number, Role>();
    for (const s of draft?.slots ?? []) {
      const role = detectRole(s.roleFp);
      if (role) out.set(s.index, role);
    }
    return out;
  }, [draft]);

  const memberName = (id: string) => (id === me.id ? "Toi" : (members.find((m) => m.id === id)?.pseudo ?? "Coéquipier"));
  const unknown = draft ? draft.slots.filter((s) => !s.pick).length : 0;
  const shared = draft ? draft.slots.filter((s) => s.memberId && s.memberId !== me.id).length : 0;

  return (
    <div className="flex flex-col gap-4">
      {!ready ? (
        <p className="flex items-start gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          L&apos;import n&apos;est pas encore activé : la migration 0017_capture_import.sql doit être exécutée dans Supabase.
        </p>
      ) : null}

      {done.length ? (
        <section className="card flex flex-col gap-2 border-good/40" aria-live="polite">
          <h2 className="flex items-center gap-2 text-lg uppercase tracking-wide">
            <Check className="size-5 text-good" aria-hidden /> {done.length > 1 ? `${done.length} parties enregistrées` : "Partie enregistrée"}
          </h2>
          <ul className="flex flex-col gap-1.5 text-sm">
            {done.map((d, i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-fg-2">{d.outcomes.map((o) => `${memberName(o.user_id)} : ${ACTION_LABEL[o.action]}`).join(" · ")}</span>
                {d.mine ? (
                  <Link href={`/historique/${d.mine}`} className="font-semibold text-accent hover:underline">
                    Voir le bilan
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {phase !== "review" ? (
        <section
          className={clsx("card flex flex-col items-center gap-3 border-dashed py-10 text-center", phase === "reading" && "opacity-80")}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void handleFiles([...e.dataTransfer.files]);
          }}
        >
          {phase === "reading" ? (
            <>
              <Loader2 className="size-8 animate-spin text-accent" aria-hidden />
              <p className="text-sm text-fg-2" aria-live="polite">
                {progress}
              </p>
            </>
          ) : (
            <>
              <ImageUp className="size-8 text-accent" aria-hidden />
              <div>
                <p className="font-display text-xl font-bold uppercase tracking-wide">Dépose tes captures du tableau des scores</p>
                <p className="mx-auto mt-1 max-w-[60ch] text-sm text-muted">
                  Une ou plusieurs parties à la fois. Pour une partie où tu as changé de héros, ajoute aussi la capture avec la fenêtre « Héros utilisés » ouverte : les deux sont regroupées grâce à l&apos;ID de replay.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button type="button" className={buttonClass("primary")} onClick={() => inputRef.current?.click()}>
                  Choisir des captures
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
                aria-label="Captures d'écran du tableau des scores"
                onChange={(e) => {
                  void handleFiles([...(e.target.files ?? [])]);
                  e.target.value = "";
                }}
              />
              <p className="text-xs text-muted">Les images restent sur ton appareil : seuls les chiffres lus sont envoyés.</p>
            </>
          )}
        </section>
      ) : null}

      {notices.length ? (
        <ul className="flex flex-col gap-1 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          {notices.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}

      {phase === "review" && draft ? (
        <>
          <section className="card flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg uppercase tracking-wide">{drafts.length > 1 ? `Partie ${cursor + 1} sur ${drafts.length}` : "Vérifie la partie"}</h2>
              <p className="text-xs text-muted">
                {draft.replayId ? `ID de replay ${draft.replayId}` : "ID de replay illisible"}
                {draft.captures > 1 ? ` · ${draft.captures} captures regroupées` : ""}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="label">
                <span id="cap-result">Résultat de ton équipe</span>
                <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="cap-result">
                  {(["win", "loss"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={draft.result === r}
                      onClick={() => patch({ result: r })}
                      className={clsx("rounded-lg border px-3 py-2 text-sm font-semibold", draft.result === r ? (r === "win" ? "border-good bg-good-bg text-good" : "border-bad bg-bad-bg text-bad") : "border-line bg-surface-2 text-fg-2")}
                    >
                      {r === "win" ? "Victoire" : "Défaite"}
                    </button>
                  ))}
                </div>
              </div>
              <label className="label" htmlFor="cap-map">
                <span>
                  Carte {draft.mapLabel && !draft.mapId ? <span className="font-normal text-accent">· lu : « {draft.mapLabel} », à associer une fois</span> : null}
                </span>
                <select
                  id="cap-map"
                  className="field"
                  value={draft.mapId}
                  onChange={(e) => {
                    const m = refs.maps.find((x) => String(x.id) === e.target.value);
                    patch({ mapId: e.target.value, ...(m?.game_mode_id ? { modeId: String(m.game_mode_id) } : {}) });
                  }}
                >
                  <option value="">Non renseignée</option>
                  {refs.maps.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="label" htmlFor="cap-mode">
                Mode
                <select id="cap-mode" className="field" value={draft.modeId} onChange={(e) => patch({ modeId: e.target.value })}>
                  <option value="">Non renseigné</option>
                  {refs.gameModes.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="label" htmlFor="cap-queue">
                File
                <select id="cap-queue" className="field" value={queueId} onChange={(e) => setQueueId(e.target.value)}>
                  <option value="">Non renseignée</option>
                  {refs.queues.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="label" htmlFor="cap-duration">
                Durée (min)
                <input id="cap-duration" className="field tabular" inputMode="decimal" value={draft.duration} onChange={(e) => patch({ duration: e.target.value.replace(/[^\d.,]/g, "").slice(0, 5) })} />
              </label>
              <label className="label" htmlFor="cap-date">
                Jouée le
                <input id="cap-date" type="datetime-local" className="field" value={playedAt} onChange={(e) => setPlayedAt(e.target.value)} />
              </label>
            </div>
          </section>

          {([0, 1] as const).map((team) => {
            const mineTeam = draft.slots.find((s) => s.memberId === me.id)?.team ?? 0;
            const rows = draft.slots.filter((s) => s.team === team);
            const teamPicks = rows.map((s) => s.pick?.heroId).filter((v): v is number => Boolean(v));
            return (
              <section key={team} className="card flex flex-col gap-3">
                <h2 className="text-lg uppercase tracking-wide">{team === mineTeam ? "Ton équipe" : "Équipe adverse"}</h2>
                <ul className="flex flex-col divide-y divide-line">
                  {rows.map((s) => (
                    <li key={s.index} className={clsx("flex flex-col gap-2 py-3 first:pt-0 last:pb-0", s.memberId && "-mx-2 rounded-lg bg-surface-2 px-2")}>
                      <div className="grid items-center gap-2 sm:grid-cols-[150px_minmax(0,1fr)_minmax(0,1.3fr)_150px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.thumb} alt="" className="h-[38px] w-[150px] rounded object-cover" />
                        <p className="min-w-0 truncate text-sm font-semibold">
                          {s.name || <span className="font-normal text-muted">Pseudo non lu</span>}
                          {s.award ? <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">{(s.team === mineTeam) === (draft.result === "win") ? "MVP" : "SVP"}</span> : null}
                        </p>
                        <HeroCombobox
                          id={`cap-hero-${s.index}`}
                          heroes={refs.heroes}
                          label={
                            !s.pick ? (
                              <span className="text-accent">Héros à identifier{roles.get(s.index) ? ` · ${roles.get(s.index)}` : ""}</span>
                            ) : roles.get(s.index) && !heroById.get(s.pick.heroId)?.roles.includes(roles.get(s.index)!) ? (
                              <span className="text-bad">La capture indique un {roles.get(s.index)} : vérifie ce héros</span>
                            ) : (
                              <span className="sr-only">Héros</span>
                            )
                          }
                          firstRole={roles.get(s.index)}
                          value={s.pick}
                          onChange={(v) => patchSlot(s.index, { pick: v, known: false, ...(v && s.extras.length && !s.extras[0].pick ? { extras: s.extras.map((x, j) => (j === 0 ? { ...x, pick: v } : x)) } : {}) })}
                          disabledIds={teamPicks}
                        />
                        <label className="label" htmlFor={`cap-member-${s.index}`}>
                          <span className="sr-only">Membre</span>
                          <select id={`cap-member-${s.index}`} className="field py-1.5 text-sm" value={s.memberId ?? ""} onChange={(e) => patchSlot(s.index, { memberId: e.target.value || null })}>
                            <option value="">Pas un membre</option>
                            {members
                              .filter((m) => (m.id === me.id || m.accepts) && (m.id === s.memberId || !draft.slots.some((o) => o.memberId === m.id)))
                              .map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.id === me.id ? "Moi" : (m.pseudo ?? "Joueur sans pseudo")}
                                </option>
                              ))}
                          </select>
                        </label>
                      </div>
                      {s.memberId ? (
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                          {STAT_FIELDS.map((f) => (
                            <label key={f.key} className="flex min-w-0 flex-col gap-0.5 text-[11px] text-muted" htmlFor={`cap-${s.index}-${f.key}`}>
                              <span className="truncate">{f.label}</span>
                              <input
                                id={`cap-${s.index}-${f.key}`}
                                className={clsx("field tabular px-2 py-1 text-sm", s.stats[f.key] === "" && "border-accent")}
                                inputMode={f.key === "accuracy" ? "decimal" : "numeric"}
                                value={s.stats[f.key]}
                                onChange={(e) => patchSlot(s.index, { stats: { ...s.stats, [f.key]: e.target.value.replace(f.key === "accuracy" ? /[^\d.,]/g : /\D/g, "").slice(0, 7) } })}
                              />
                            </label>
                          ))}
                        </div>
                      ) : null}
                      {s.extras.length ? (
                        <div className="flex flex-col gap-2 rounded-lg border border-line p-2">
                          <p className="text-xs text-muted">
                            Héros utilisés pendant la partie. Le tableau ne donne que les totaux : ils sont rattachés au premier héros.
                          </p>
                          <div className="grid gap-2 sm:grid-cols-3">
                            {s.extras.map((e, k) => (
                              <div key={k} className="flex min-w-0 items-end gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={e.thumb} alt="" className="size-10 shrink-0 rounded" />
                                <div className="min-w-0 flex-1">
                                  <HeroCombobox
                                    id={`cap-extra-${s.index}-${k}`}
                                    heroes={refs.heroes}
                                    label={<span className={clsx(!e.pick ? "text-accent" : "sr-only")}>{e.pick ? "Héros utilisé" : "À identifier"}</span>}
                                    value={e.pick}
                                    onChange={(v) => patchSlot(s.index, { extras: s.extras.map((x, j) => (j === k ? { ...x, pick: v, known: false } : x)), ...(v && k === 0 && !s.pick ? { pick: v } : {}) })}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <div className="sticky bottom-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3 shadow-xl shadow-black/40 md:bottom-4">
            <div className="min-w-0 text-sm">
              {error ? (
                <p className="text-bad" role="alert">
                  {error}
                </p>
              ) : (
                <p className="text-fg-2">
                  {unknown ? `${unknown} héros à nommer. C'est à faire une seule fois par héros et par skin : ils sont ensuite reconnus pour tout le groupe.` : "Tous les héros sont reconnus."}
                  {shared ? (
                    <span className="ml-2 inline-flex items-center gap-1 text-muted">
                      <Users className="size-4" aria-hidden /> aussi enregistrée pour {shared} coéquipier{shared > 1 ? "s" : ""}
                    </span>
                  ) : null}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={buttonClass("ghost")}
                disabled={pending}
                onClick={() => {
                  setDrafts([]);
                  setPhase("idle");
                  setError(null);
                }}
              >
                Annuler
              </button>
              <button type="button" className={buttonClass("primary")} disabled={pending || !ready} onClick={save}>
                {pending ? "Enregistrement…" : "Enregistrer la partie"}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
