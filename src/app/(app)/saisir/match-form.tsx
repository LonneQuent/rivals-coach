"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { ROLES, STAT_FIELDS, type MatchHeroInput, type MatchInput, type Refs, type Role, type StatKey } from "@/lib/types";
import { RoleDot, buttonClass } from "@/components/ui";
import { saveMatch } from "./actions";

type HeroRow = { key: number; pick: string; play_minutes: string } & Record<StatKey, string>;

const emptyStats = Object.fromEntries(STAT_FIELDS.map((f) => [f.key, ""])) as Record<StatKey, string>;
const toStr = (v: number | null | undefined) => (v === null || v === undefined ? "" : String(v));
const toNum = (v: string) => {
  if (v.trim() === "") return null;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
};
function localInput(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
let rowKey = 0;
function rowFrom(h?: MatchHeroInput, withStats = true): HeroRow {
  return {
    key: ++rowKey,
    pick: h ? `${h.hero_id}|${h.role}` : "",
    play_minutes: withStats ? toStr(h?.play_minutes) : "",
    ...(withStats && h ? (Object.fromEntries(STAT_FIELDS.map((f) => [f.key, toStr(h[f.key])])) as Record<StatKey, string>) : emptyStats),
  };
}

export function MatchForm({ refs, editing, last }: { refs: Refs; editing: MatchInput | null; last: MatchInput | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Valeurs par défaut : la partie modifiée, sinon le contexte de la dernière partie (sans ses stats)
  const base = editing ?? last;
  const [playedAt, setPlayedAt] = useState(localInput(editing?.played_at));
  const [result, setResult] = useState<"win" | "loss" | "">(editing?.result ?? "");
  const [queueId, setQueueId] = useState(toStr(base?.queue_id ?? refs.queues[0]?.id));
  const [mapId, setMapId] = useState(toStr(editing ? editing.map_id : null));
  const [modeId, setModeId] = useState(toStr(editing ? editing.game_mode_id : null));
  const [rankId, setRankId] = useState(toStr(base?.rank_id));
  const [duration, setDuration] = useState(toStr(base?.duration_min));
  const [feeling, setFeeling] = useState(editing?.feeling ?? null);
  const [award, setAward] = useState<MatchInput["award"]>(editing?.award ?? "");
  const [tags, setTags] = useState<number[]>(editing?.tag_ids ?? []);
  const [note, setNote] = useState(editing?.note ?? "");
  const [rows, setRows] = useState<HeroRow[]>(() =>
    editing ? editing.heroes.map((h) => rowFrom(h)) : [rowFrom(last?.heroes[0], false)],
  );

  const heroOptions = useMemo(
    () =>
      ROLES.map((role) => ({
        role,
        heroes: refs.heroes.filter((h) => h.roles.includes(role)).sort((a, b) => a.name.localeCompare(b.name, "fr")),
      })),
    [refs.heroes],
  );
  const usedHeroIds = rows.map((r) => r.pick.split("|")[0]);

  function updateRow(key: number, patch: Partial<HeroRow>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function onMapChange(v: string) {
    setMapId(v);
    const m = refs.maps.find((x) => String(x.id) === v);
    if (m?.game_mode_id) setModeId(String(m.game_mode_id));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!result) return setError("Indique si c'est une victoire ou une défaite.");
    const heroes = rows.filter((r) => r.pick);
    if (!heroes.length) return setError("Choisis au moins un héros.");
    const when = new Date(playedAt);
    const payload: MatchInput = {
      id: editing?.id,
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
      heroes: heroes.map((r) => {
        const [id, role] = r.pick.split("|");
        return {
          hero_id: Number(id),
          role: role as Role,
          play_minutes: toNum(r.play_minutes),
          ...(Object.fromEntries(STAT_FIELDS.map((f) => [f.key, toNum(r[f.key])])) as Record<StatKey, number | null>),
        };
      }),
    };
    start(async () => {
      const res = await saveMatch(payload);
      if (!res.ok) return setError(res.error);
      if (editing) {
        router.push("/historique");
        return;
      }
      setSaved(true);
      setResult("");
      setFeeling(null);
      setAward("");
      setTags([]);
      setNote("");
      setPlayedAt(localInput());
      setRows((rs) => [rowFrom({ ...emptyHero(), ...parsePick(rs[0]?.pick) }, false)]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      {saved ? (
        <p role="status" className="rounded-lg bg-good-bg px-4 py-3 text-sm font-semibold text-good">
          Partie enregistrée. Prête pour la suivante.
        </p>
      ) : null}

      {/* Résultat */}
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Résultat">
        {(["win", "loss"] as const).map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={result === r}
            onClick={() => {
              setResult(r);
              setSaved(false);
            }}
            className={clsx(
              "rounded-xl border py-4 font-display text-xl font-bold uppercase tracking-wider transition-colors",
              result === r ? (r === "win" ? "border-good bg-good-bg text-good" : "border-bad bg-bad-bg text-bad") : "border-line bg-surface text-fg-2 hover:border-muted",
            )}
          >
            {r === "win" ? "Victoire" : "Défaite"}
          </button>
        ))}
      </div>

      {/* Héros joués */}
      <section className="card flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg uppercase tracking-wide">Héros joués</h2>
          {rows.length < 6 ? (
            <button type="button" className={buttonClass("ghost")} onClick={() => setRows((rs) => [...rs, rowFrom()])}>
              <Plus className="size-4" /> Ajouter un swap
            </button>
          ) : null}
        </div>
        {rows.map((r, idx) => {
          const role = r.pick.split("|")[1] as Role | undefined;
          return (
            <fieldset key={r.key} className={clsx("flex flex-col gap-3", idx > 0 && "border-t border-line pt-4")}>
              <legend className="sr-only">Héros {idx + 1}</legend>
              <div className="flex items-end gap-3">
                <label className="label flex-1" htmlFor={`hero-${r.key}`}>
                  <span className="flex items-center gap-2">
                    {role ? <RoleDot role={role} /> : null}
                    {rows.length > 1 ? `Héros ${idx + 1}` : "Héros"}
                  </span>
                  <select id={`hero-${r.key}`} className="field" value={r.pick} onChange={(e) => updateRow(r.key, { pick: e.target.value })} required>
                    <option value="">Choisir…</option>
                    {heroOptions.map((g) => (
                      <optgroup key={g.role} label={g.role}>
                        {g.heroes.map((h) => {
                          const v = `${h.id}|${g.role}`;
                          const takenElsewhere = usedHeroIds.includes(String(h.id)) && r.pick.split("|")[0] !== String(h.id);
                          return (
                            <option key={v} value={v} disabled={takenElsewhere}>
                              {h.name}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                </label>
                {rows.length > 1 ? (
                  <label className="label w-24" htmlFor={`min-${r.key}`}>
                    Minutes
                    <input id={`min-${r.key}`} className="field tabular" inputMode="decimal" value={r.play_minutes} onChange={(e) => updateRow(r.key, { play_minutes: e.target.value })} />
                  </label>
                ) : null}
                {rows.length > 1 ? (
                  <button type="button" onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))} className={buttonClass("ghost", "px-2")} aria-label={`Retirer le héros ${idx + 1}`}>
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STAT_FIELDS.map((f) => (
                  <label key={f.key} className="label" htmlFor={`${f.key}-${r.key}`}>
                    {f.label}
                    <input
                      id={`${f.key}-${r.key}`}
                      className="field tabular"
                      inputMode={f.key === "accuracy" ? "decimal" : "numeric"}
                      value={r[f.key]}
                      onChange={(e) => updateRow(r.key, { [f.key]: e.target.value } as Partial<HeroRow>)}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}
      </section>

      {/* Contexte */}
      <section className="card flex flex-col gap-4">
        <h2 className="text-lg uppercase tracking-wide">Partie</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <label className="label" htmlFor="queue">
            File
            <select id="queue" className="field" value={queueId} onChange={(e) => setQueueId(e.target.value)}>
              <option value="">–</option>
              {refs.queues.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>
          </label>
          <label className="label" htmlFor="map">
            Carte
            <select id="map" className="field" value={mapId} onChange={(e) => onMapChange(e.target.value)}>
              <option value="">–</option>
              {refs.maps.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label className="label" htmlFor="mode">
            Type de mode
            <select id="mode" className="field" value={modeId} onChange={(e) => setModeId(e.target.value)}>
              <option value="">–</option>
              {refs.gameModes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label className="label" htmlFor="rank">
            Rang
            <select id="rank" className="field" value={rankId} onChange={(e) => setRankId(e.target.value)}>
              <option value="">–</option>
              {refs.ranks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <label className="label" htmlFor="duration">
            Durée (min)
            <input id="duration" className="field tabular" inputMode="decimal" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </label>
          <label className="label" htmlFor="played">
            Date et heure
            <input id="played" type="datetime-local" className="field" value={playedAt} onChange={(e) => setPlayedAt(e.target.value)} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Distinction">
          <span className="eyebrow mr-1">Distinction</span>
          {(["", "MVP", "SVP"] as const).map((a) => (
            <Chip key={a || "none"} on={award === a} onClick={() => setAward(a)} role="radio">
              {a || "Aucune"}
            </Chip>
          ))}
        </div>
      </section>

      {/* Ressenti */}
      <section className="card flex flex-col gap-4">
        <h2 className="text-lg uppercase tracking-wide">Ressenti</h2>
        <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Ressenti de 1 à 5">
          {[1, 2, 3, 4, 5].map((v) => (
            <Chip key={v} on={feeling === v} onClick={() => setFeeling(feeling === v ? null : v)} role="radio" className="w-11 justify-center">
              {v}
            </Chip>
          ))}
          <span className="text-xs text-muted">1 = très mauvais · 5 = excellent</span>
        </div>
        {refs.tags.length ? (
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Erreurs de la partie</span>
            <div className="flex flex-wrap gap-2">
              {refs.tags.map((t) => (
                <Chip key={t.id} on={tags.includes(t.id)} onClick={() => setTags((ts) => (ts.includes(t.id) ? ts.filter((x) => x !== t.id) : [...ts, t.id]))} role="checkbox">
                  {t.name}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}
        <label className="label" htmlFor="note">
          Note libre
          <textarea id="note" className="field min-h-20" maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ce qui a marché, ce qui a coincé…" />
        </label>
      </section>

      <div className="sticky bottom-20 z-10 flex flex-wrap items-center gap-3 md:bottom-4">
        <button type="submit" disabled={pending} className={buttonClass("primary", "px-6 py-3 text-base shadow-lg shadow-black/40")}>
          {pending ? "Enregistrement…" : editing ? "Mettre à jour" : "Enregistrer la partie"}
        </button>
        {editing ? (
          <button type="button" className={buttonClass("ghost")} onClick={() => router.push("/historique")}>
            Annuler
          </button>
        ) : null}
        {error ? (
          <p role="alert" className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Chip({ on, onClick, children, role, className }: { on: boolean; onClick: () => void; children: React.ReactNode; role: "radio" | "checkbox"; className?: string }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={on}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
        on ? "border-accent bg-accent/15 text-fg" : "border-line bg-surface-2 text-fg-2 hover:border-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}

function emptyHero(): MatchHeroInput {
  return { hero_id: 0, role: "Vanguard", play_minutes: null, kills: null, deaths: null, assists: null, final_hits: null, damage: null, damage_blocked: null, healing: null, accuracy: null };
}
function parsePick(pick?: string): Partial<MatchHeroInput> {
  if (!pick) return {};
  const [id, role] = pick.split("|");
  return { hero_id: Number(id), role: role as Role };
}
