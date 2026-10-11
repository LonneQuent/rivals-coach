"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ArrowLeft, Check, Plus, X } from "lucide-react";
import type { Hero, MatchInput, Role, StatKey } from "@/lib/types";
import { HeroMark, RoleDot, buttonClass } from "@/components/ui";
import { HeroCombobox } from "@/components/hero-combobox";
import { Mascot } from "@/components/mascot";
import { saveMatch } from "@/app/(app)/saisir/actions";
import type { EntryData } from "@/app/(app)/saisir/entry-actions";

type Step = "result" | "heroes" | "stats" | "details" | "done";
const STEPS: { id: Step; label: string }[] = [
  { id: "result", label: "Résultat" },
  { id: "heroes", label: "Héros" },
  { id: "stats", label: "Stats" },
  { id: "details", label: "Détails" },
];

/** Ordre de saisie, calé sur le tableau de fin de partie : K/D/A d'abord. */
const STAT_ORDER: { key: StatKey; label: string; decimal?: boolean }[] = [
  { key: "kills", label: "Élims" },
  { key: "deaths", label: "Morts" },
  { key: "assists", label: "Assists" },
  { key: "damage", label: "Dégâts" },
  { key: "damage_blocked", label: "Bloqués" },
  { key: "healing", label: "Soins" },
  { key: "final_hits", label: "Final hits" },
  { key: "accuracy", label: "Précision %", decimal: true },
];

type Pick = { hero_id: number; role: Role; minutes: string; stats: Partial<Record<StatKey, string>> };

const digitsOnly = (v: string) => v.replace(/\D/g, "").slice(0, 7);
const decimalOnly = (v: string) => {
  const [int, ...rest] = v.replace(",", ".").replace(/[^\d.]/g, "").split(".");
  return (rest.length ? `${int}.${rest.join("").slice(0, 2)}` : int).slice(0, 6);
};
const toNum = (v: string | undefined) => {
  if (!v || v.trim() === "") return null;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
};
const str = (v: number | null | undefined) => (v === null || v === undefined ? "" : String(v));
const isTyping = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));

/**
 * Saisie d'une partie en quatre écrans courts : résultat, héros, stats, détails facultatifs.
 * Raccourcis clavier : V / D pour le résultat, 1 à 8 pour un héros récent,
 * Espace ou Entrée pour passer au champ de stat suivant.
 */
export function EntryWizard({ data, onClose }: { data: EntryData; onClose?: () => void }) {
  const router = useRouter();
  const { refs, last, recent } = data;
  const heroById = useMemo(() => new Map(refs.heroes.map((h) => [h.id, h])), [refs.heroes]);
  const recentPicks = useMemo(() => recent.filter((p) => heroById.has(p.hero_id)).slice(0, 8), [recent, heroById]);

  const [step, setStep] = useState<Step>("result");
  const [result, setResult] = useState<"win" | "loss" | "">("");
  const [picks, setPicks] = useState<Pick[]>([]);
  const [multi, setMulti] = useState(false);

  const [queueId, setQueueId] = useState(str(last?.queue_id ?? refs.queues[0]?.id));
  const [rankId, setRankId] = useState(str(last?.rank_id));
  const [mapId, setMapId] = useState("");
  const [modeId, setModeId] = useState("");
  const [duration, setDuration] = useState("");
  const [award, setAward] = useState<MatchInput["award"]>("");
  const [feeling, setFeeling] = useState<number | null>(null);
  const [tags, setTags] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [playedAt, setPlayedAt] = useState<string | null>(null);

  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  function go(s: Step) {
    setError(null);
    setStep(s);
  }

  function chooseResult(r: "win" | "loss") {
    setResult(r);
    go("heroes");
  }

  function togglePick(hero_id: number, role: Role) {
    const exists = picks.some((p) => p.hero_id === hero_id);
    if (!multi) {
      setPicks([{ hero_id, role, minutes: "", stats: {} }]);
      go("stats");
      return;
    }
    setPicks((ps) => (exists ? ps.filter((p) => p.hero_id !== hero_id) : ps.length < 6 ? [...ps, { hero_id, role, minutes: "", stats: {} }] : ps));
  }

  // Raccourcis clavier des deux premiers écrans
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const k = e.key.toLowerCase();
      // preventDefault : la touche ne doit pas atterrir dans le champ qui prend le focus juste après
      if (step === "result" && ["v", "w", "d", "l"].includes(k)) {
        e.preventDefault();
        chooseResult(k === "v" || k === "w" ? "win" : "loss");
      } else if (step === "heroes" && /^[1-8]$/.test(k)) {
        const p = recentPicks[Number(k) - 1];
        if (p) {
          e.preventDefault();
          togglePick(p.hero_id, p.role);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Curseur directement dans le premier champ de stats
  useEffect(() => {
    if (step === "stats") statsRef.current?.querySelector<HTMLInputElement>("[data-entry-field]")?.focus();
  }, [step]);

  function focusNext(from: HTMLInputElement) {
    const fields = [...(statsRef.current?.querySelectorAll<HTMLInputElement>("[data-entry-field]") ?? [])];
    const next = fields[fields.indexOf(from) + 1];
    if (next) next.focus();
    else go("details");
  }

  function setStat(i: number, key: StatKey | "minutes", raw: string, decimal?: boolean) {
    const v = decimal ? decimalOnly(raw) : digitsOnly(raw);
    setPicks((ps) => ps.map((p, j) => (j !== i ? p : key === "minutes" ? { ...p, minutes: v } : { ...p, stats: { ...p.stats, [key]: v } })));
  }

  function onMapPick(id: number, gameModeId: number | null) {
    const same = mapId === String(id);
    setMapId(same ? "" : String(id));
    if (!same && gameModeId) setModeId(String(gameModeId));
  }

  function save() {
    if (!result) return go("result");
    if (!picks.length) return go("heroes");
    setError(null);
    const when = playedAt ? new Date(playedAt) : new Date();
    const payload: MatchInput = {
      played_at: Number.isNaN(when.getTime()) ? new Date().toISOString() : when.toISOString(),
      queue_id: toNum(queueId),
      game_mode_id: toNum(modeId),
      map_id: toNum(mapId),
      rank_id: toNum(rankId),
      result,
      duration_min: toNum(duration),
      feeling,
      award,
      note: note.trim(),
      tag_ids: tags,
      heroes: picks.map((p) => ({
        hero_id: p.hero_id,
        role: p.role,
        play_minutes: picks.length > 1 ? toNum(p.minutes) : null,
        kills: toNum(p.stats.kills),
        deaths: toNum(p.stats.deaths),
        assists: toNum(p.stats.assists),
        final_hits: toNum(p.stats.final_hits),
        damage: toNum(p.stats.damage),
        damage_blocked: toNum(p.stats.damage_blocked),
        healing: toNum(p.stats.healing),
        accuracy: toNum(p.stats.accuracy),
      })),
    };
    start(async () => {
      const res = await saveMatch(payload);
      if (!res.ok) return setError(res.error);
      setSavedId(res.id);
      go("done");
      router.refresh();
    });
  }

  function restart() {
    setResult("");
    setPicks([]);
    setMulti(false);
    setMapId("");
    setModeId("");
    setDuration("");
    setAward("");
    setFeeling(null);
    setTags([]);
    setNote("");
    setPlayedAt(null);
    setSavedId(null);
    go("result");
  }

  const heroName = (id: number) => heroById.get(id)?.name ?? "?";

  return (
    <div className="flex flex-col gap-5">
      {step !== "done" ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(STEPS[Math.max(0, stepIndex - 1)].id)}
            className={buttonClass("ghost", clsx("px-2", stepIndex === 0 && "invisible"))}
            aria-label="Étape précédente"
          >
            <ArrowLeft className="size-5" />
          </button>
          <ol className="flex flex-1 items-center gap-1.5" aria-label="Étapes">
            {STEPS.map((s, i) => (
              <li key={s.id} className="flex flex-1 flex-col gap-1">
                <span className={clsx("h-1.5 rounded-full transition-colors", i <= stepIndex ? "bg-accent" : "bg-surface-3")} />
                <span className={clsx("hidden text-[11px] font-semibold uppercase tracking-wide sm:block", i === stepIndex ? "text-fg" : "text-muted")}>{s.label}</span>
              </li>
            ))}
          </ol>
          {onClose ? (
            <button type="button" onClick={onClose} className={buttonClass("ghost", "px-2")} aria-label="Fermer">
              <X className="size-5" />
            </button>
          ) : null}
        </div>
      ) : null}

      {/* 1. Résultat */}
      {step === "result" ? (
        <section className="flex flex-col gap-4" aria-label="Résultat">
          <h2 className="text-2xl uppercase tracking-wide">Alors, cette partie ?</h2>
          <div className="grid grid-cols-2 gap-3">
            {(["win", "loss"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => chooseResult(r)}
                className={clsx(
                  "lift flex flex-col items-center gap-1 rounded-2xl border py-8 font-display text-2xl font-bold uppercase tracking-wider",
                  r === "win" ? "border-good/50 bg-good-bg text-good" : "border-bad/50 bg-bad-bg text-bad",
                  result === r && "ring-2 ring-current",
                )}
              >
                {r === "win" ? "Victoire" : "Défaite"}
                <kbd className="hidden text-xs font-semibold opacity-70 sm:block">{r === "win" ? "V" : "D"}</kbd>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* 2. Héros */}
      {step === "heroes" ? (
        <section className="flex flex-col gap-4" aria-label="Héros joués">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-2xl uppercase tracking-wide">Qui as-tu joué ?</h2>
            <button
              type="button"
              onClick={() => setMulti((m) => !m)}
              aria-pressed={multi}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                multi ? "border-accent bg-accent/15 text-fg" : "border-line text-fg-2 hover:border-accent/60",
              )}
            >
              {multi ? "Plusieurs héros : coche-les" : "J'ai changé de héros"}
            </button>
          </div>
          {recentPicks.length ? (
            <div className="grid grid-cols-4 gap-2">
              {recentPicks.map((p, i) => {
                const h = heroById.get(p.hero_id) as Hero;
                const on = picks.some((x) => x.hero_id === p.hero_id && x.role === p.role);
                return (
                  <button
                    key={`${p.hero_id}|${p.role}`}
                    type="button"
                    onClick={() => togglePick(p.hero_id, p.role)}
                    aria-pressed={on}
                    className={clsx(
                      "lift relative flex flex-col items-center gap-1.5 rounded-xl border bg-surface px-1 py-2.5",
                      on ? "border-accent ring-2 ring-accent/50" : "border-line",
                    )}
                  >
                    <HeroMark name={h.name} role={p.role} size="lg" src={h.portrait_url} />
                    <span className="line-clamp-1 max-w-full px-1 text-xs font-semibold">{h.name}</span>
                    {h.roles.length > 1 ? <RoleDot role={p.role} /> : null}
                    <kbd className="absolute left-1.5 top-1 hidden text-[10px] text-muted sm:block">{i + 1}</kbd>
                    {on ? <Check className="absolute right-1.5 top-1.5 size-4 text-accent" /> : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-fg-2">Tes héros les plus joués apparaîtront ici après quelques parties.</p>
          )}
          <HeroCombobox
            id="wizard-hero"
            heroes={refs.heroes}
            label={recentPicks.length ? "Un autre héros" : "Cherche ton héros"}
            value={null}
            onChange={(v) => v && togglePick(v.heroId, v.role)}
            disabledIds={multi ? picks.map((p) => p.hero_id) : []}
          />
          {multi && picks.length ? (
            <div className="flex flex-wrap items-center gap-2">
              {picks.map((p) => (
                <span key={p.hero_id} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 py-1 pl-1 pr-2 text-sm">
                  <HeroMark name={heroName(p.hero_id)} role={p.role} size="sm" src={heroById.get(p.hero_id)?.portrait_url} />
                  {heroName(p.hero_id)}
                </span>
              ))}
              <button type="button" className={buttonClass("primary", "ml-auto")} onClick={() => go("stats")}>
                Continuer
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* 3. Stats */}
      {step === "stats" ? (
        <section className="flex flex-col gap-4" aria-label="Stats">
          <div>
            <h2 className="text-2xl uppercase tracking-wide">Tes stats</h2>
            <p className="text-sm text-fg-2">
              Recopie le tableau de fin de partie. <span className="hidden sm:inline">Espace ou Entrée pour passer au champ suivant. </span>Tout est facultatif.
            </p>
          </div>
          <div ref={statsRef} className="flex flex-col gap-3">
            {picks.map((p, i) => (
              <div key={p.hero_id} className="card flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <HeroMark name={heroName(p.hero_id)} role={p.role} size="md" src={heroById.get(p.hero_id)?.portrait_url} />
                  <p className="font-display text-lg font-bold">{heroName(p.hero_id)}</p>
                  {picks.length > 1 ? (
                    <label className="ml-auto flex items-center gap-2 text-xs text-fg-2">
                      Minutes
                      <StatInput value={p.minutes} decimal onChange={(v) => setStat(i, "minutes", v, true)} onNext={focusNext} className="w-16" />
                    </label>
                  ) : null}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {STAT_ORDER.slice(0, 3).map((f) => (
                    <StatField key={f.key} label={f.label} big value={p.stats[f.key] ?? ""} onChange={(v) => setStat(i, f.key, v)} onNext={focusNext} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {STAT_ORDER.slice(3, 6).map((f) => (
                    <StatField key={f.key} label={f.label} value={p.stats[f.key] ?? ""} onChange={(v) => setStat(i, f.key, v)} onNext={focusNext} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {STAT_ORDER.slice(6).map((f) => (
                    <StatField key={f.key} label={f.label} decimal={f.decimal} value={p.stats[f.key] ?? ""} onChange={(v) => setStat(i, f.key, v, f.decimal)} onNext={focusNext} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass("primary", "flex-1 py-3 text-base")} onClick={() => go("details")}>
              Continuer
            </button>
            <button type="button" className={buttonClass("default", "py-3")} disabled={pending} onClick={save}>
              {pending ? "Enregistrement…" : "Enregistrer sans détails"}
            </button>
          </div>
        </section>
      ) : null}

      {/* 4. Détails */}
      {step === "details" ? (
        <section className="flex flex-col gap-5" aria-label="Détails">
          <div>
            <h2 className="text-2xl uppercase tracking-wide">Les détails</h2>
            <p className="text-sm text-fg-2">Facultatif, mais la carte et le ressenti rendent tes stats bien plus utiles.</p>
          </div>

          {refs.maps.length ? (
            <div className="flex flex-col gap-2">
              <span className="eyebrow">Carte</span>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {refs.maps.map((m) => (
                  <Chip key={m.id} on={mapId === String(m.id)} onClick={() => onMapPick(m.id, m.game_mode_id)} className="justify-start text-left text-xs">
                    {m.name.includes(":") ? m.name.split(":").slice(1).join(":").trim() : m.name}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <span className="eyebrow">Ressenti</span>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <Chip key={v} on={feeling === v} onClick={() => setFeeling(feeling === v ? null : v)} className="w-11 justify-center">
                  {v}
                </Chip>
              ))}
              <span className="text-xs text-muted">1 = très mauvais · 5 = excellent</span>
            </div>
          </div>

          {refs.tags.length ? (
            <div className="flex flex-col gap-2">
              <span className="eyebrow">Ce qui a coincé</span>
              <div className="flex flex-wrap gap-1.5">
                {refs.tags.map((t) => (
                  <Chip key={t.id} on={tags.includes(t.id)} onClick={() => setTags((ts) => (ts.includes(t.id) ? ts.filter((x) => x !== t.id) : [...ts, t.id]))}>
                    {t.name}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <label className="label">
              File
              <select className="field" value={queueId} onChange={(e) => setQueueId(e.target.value)}>
                <option value="">–</option>
                {refs.queues.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Rang
              <select className="field" value={rankId} onChange={(e) => setRankId(e.target.value)}>
                <option value="">–</option>
                {refs.ranks.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Durée (min)
              <input className="field tabular" inputMode="decimal" value={duration} onChange={(e) => setDuration(decimalOnly(e.target.value))} />
            </label>
            <div className="label">
              Distinction
              <div className="flex gap-1">
                {(["MVP", "SVP"] as const).map((a) => (
                  <Chip key={a} on={award === a} onClick={() => setAward(award === a ? "" : a)} className="flex-1 justify-center">
                    {a}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          <label className="label">
            Note
            <textarea className="field min-h-16" maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ce qui a marché, ce qui a coincé…" />
          </label>

          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-2">
            {playedAt === null ? (
              <>
                Jouée à l&apos;instant.
                <button type="button" className="font-semibold text-accent hover:underline" onClick={() => setPlayedAt(localNow())}>
                  Changer la date
                </button>
              </>
            ) : (
              <label className="label">
                Date et heure
                <input type="datetime-local" className="field" value={playedAt} onChange={(e) => setPlayedAt(e.target.value)} />
              </label>
            )}
          </div>

          <button type="button" className={buttonClass("primary", "py-3 text-base")} disabled={pending} onClick={save}>
            {pending ? "Enregistrement…" : "Enregistrer la partie"}
          </button>
        </section>
      ) : null}

      {/* Terminé */}
      {step === "done" ? (
        <section className="flex flex-col items-center gap-4 py-4 text-center" aria-live="polite">
          <Mascot className="size-28" bob />
          <div>
            <p className="font-display text-2xl font-bold uppercase tracking-wide">Partie enregistrée !</p>
            <p className="text-sm text-fg-2">
              {result === "win" ? "Victoire" : "Défaite"} avec {picks.map((p) => heroName(p.hero_id)).join(", ")}
              {picks[0]?.stats.kills || picks[0]?.stats.deaths ? ` · ${picks[0].stats.kills || 0}/${picks[0].stats.deaths || 0}/${picks[0].stats.assists || 0}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className={buttonClass("primary", "px-5 py-3")} onClick={restart}>
              <Plus className="size-4" /> Saisir la suivante
            </button>
            {savedId ? (
              <Link href={`/historique/${savedId}`} onClick={onClose} className={buttonClass("default", "py-3")}>
                Voir la partie
              </Link>
            ) : null}
            {onClose ? (
              <button type="button" className={buttonClass("ghost", "py-3")} onClick={onClose}>
                Fermer
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {error ? (
        <p role="alert" className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function localNow() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function StatInput({
  value,
  onChange,
  onNext,
  decimal,
  big,
  className,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: (el: HTMLInputElement) => void;
  decimal?: boolean;
  big?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <input
      data-entry-field
      aria-label={label}
      className={clsx("field tabular text-center", big ? "py-2.5 text-2xl font-bold" : "text-lg font-semibold", className)}
      inputMode={decimal ? "decimal" : "numeric"}
      enterKeyHint="next"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "/") {
          e.preventDefault();
          onNext(e.currentTarget);
        }
      }}
      onFocus={(e) => e.currentTarget.select()}
    />
  );
}

function StatField(props: { label: string; value: string; onChange: (v: string) => void; onNext: (el: HTMLInputElement) => void; decimal?: boolean; big?: boolean }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted">{props.label}</span>
      <StatInput {...props} />
    </label>
  );
}

function Chip({ on, onClick, children, className }: { on: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
        on ? "border-accent bg-accent/15 text-fg" : "border-line bg-surface-2 text-fg-2 hover:border-accent/60 hover:text-fg",
        className,
      )}
    >
      {children}
    </button>
  );
}
