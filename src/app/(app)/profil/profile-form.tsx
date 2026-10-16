"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Pencil, Search, X } from "lucide-react";
import { ROLES, type Hero, type Rank, type Role } from "@/lib/types";
import { HeroMark, ROLE_STYLES, RoleBadge, RoleDot, buttonClass } from "@/components/ui";
import { saveProfile, type ProfileInput } from "./actions";

const MAX_PICKS = 5;

const norm = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/**
 * Profil : résumé par défaut, formulaire seulement au premier passage
 * (pas de pseudo ni de mains) ou quand on clique sur « Modifier ».
 */
export function ProfileSection({ heroes, ranks, initial, avatarUrl }: { heroes: Hero[]; ranks: Rank[]; initial: ProfileInput; avatarUrl: string | null }) {
  const firstTime = !initial.pseudo || initial.mains.length === 0;
  const [editing, setEditing] = useState(firstTime);
  const [saved, setSaved] = useState(initial);
  const [justSaved, setJustSaved] = useState(false);

  if (editing) {
    return (
      <ProfileForm
        heroes={heroes}
        ranks={ranks}
        initial={saved}
        firstTime={firstTime && !justSaved}
        onCancel={firstTime && !justSaved ? undefined : () => setEditing(false)}
        onSaved={(v) => {
          setSaved(v);
          setJustSaved(true);
          setEditing(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }
  return <ProfileSummary heroes={heroes} ranks={ranks} profile={saved} avatarUrl={avatarUrl} justSaved={justSaved} onEdit={() => setEditing(true)} />;
}

function ProfileSummary({ heroes, ranks, profile, avatarUrl, justSaved, onEdit }: { heroes: Hero[]; ranks: Rank[]; profile: ProfileInput; avatarUrl: string | null; justSaved: boolean; onEdit: () => void }) {
  const byId = new Map(heroes.map((h) => [h.id, h]));
  const list = (ids: number[]) => ids.map((id) => byId.get(id)).filter(Boolean) as Hero[];
  return (
    <section className="card flex flex-col gap-5">
      {justSaved ? (
        <p role="status" className="rounded-lg bg-good-bg px-3 py-2 text-sm font-semibold text-good">
          Profil enregistré.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="size-14 rounded-full" />
        ) : (
          <span className="grid size-14 place-items-center rounded-full bg-surface-3 font-display text-xl font-bold">{profile.pseudo.slice(0, 2).toUpperCase()}</span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl font-bold">{profile.pseudo}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
            {profile.main_role ? <RoleBadge role={profile.main_role} /> : <span>Pas de rôle principal</span>}
            <span>· {ranks.find((r) => r.id === profile.rank_id)?.name ?? "Rang non renseigné"}</span>
            <span>· {profile.share_aggregates ? "Contribue aux stats du groupe" : "Ne contribue pas aux stats du groupe"}</span>
          </div>
        </div>
        <button type="button" onClick={onEdit} className={buttonClass("default")}>
          <Pencil className="size-4" /> Modifier
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <HeroList title="Mes mains" heroes={list(profile.mains)} empty="Aucun main choisi." />
        <HeroList title="À entraîner" heroes={list(profile.train)} empty="Aucun héros à entraîner." />
      </div>
    </section>
  );
}

function HeroList({ title, heroes, empty }: { title: string; heroes: Hero[]; empty: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="eyebrow">{title}</span>
      {heroes.length ? (
        <div className="flex flex-wrap gap-1.5">
          {heroes.map((h) => (
            <span key={h.id} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 py-1 pl-1 pr-3 text-xs font-semibold">
              <HeroMark name={h.name} role={h.roles[0]} size="sm" src={h.portrait_url} />
              {h.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">{empty}</p>
      )}
    </div>
  );
}

function ProfileForm({
  heroes,
  ranks,
  initial,
  firstTime,
  onSaved,
  onCancel,
}: {
  heroes: Hero[];
  ranks: Rank[];
  initial: ProfileInput;
  firstTime: boolean;
  onSaved: (v: ProfileInput) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(kind: "mains" | "train", id: number) {
    setForm((f) => {
      const list = f[kind];
      if (list.includes(id)) return { ...f, [kind]: list.filter((x) => x !== id) };
      if (list.length >= MAX_PICKS) return f;
      const other = kind === "mains" ? "train" : "mains";
      return { ...f, [kind]: [...list, id], [other]: f[other].filter((x) => x !== id) };
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await saveProfile(form);
      if (!res.ok) return setError(res.error ?? "Le profil n'a pas pu être enregistré.");
      onSaved(form);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {firstTime ? (
        <p className="rounded-lg border border-accent/60 bg-accent/10 px-4 py-3 text-sm">
          Bienvenue ! Renseigne ton pseudo et tes mains : ça prend 30 secondes et ton coach saura qui tu es.
        </p>
      ) : null}
      <section className="card grid gap-4 sm:grid-cols-2">
        <label className="label" htmlFor="pseudo">
          Pseudo en jeu
          <input id="pseudo" className="field" maxLength={40} required value={form.pseudo} onChange={(e) => setForm({ ...form, pseudo: e.target.value })} />
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-fg-2">Rôle principal</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Rôle principal">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={form.main_role === r}
                onClick={() => setForm({ ...form, main_role: form.main_role === r ? null : r })}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold",
                  form.main_role === r ? clsx("border-transparent ring-2", ROLE_STYLES[r].ring, ROLE_STYLES[r].bg) : "border-line bg-surface-2 text-fg-2",
                )}
              >
                <RoleDot role={r} />
                {r}
              </button>
            ))}
          </div>
        </div>
        <label className="label" htmlFor="rank">
          Rang actuel
          <select id="rank" className="field" value={form.rank_id ?? ""} onChange={(e) => setForm({ ...form, rank_id: e.target.value ? Number(e.target.value) : null })}>
            <option value="">Non renseigné</option>
            {ranks.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <span className="text-xs font-normal text-muted">Sert à comparer tes stats à celles des joueurs de ton rang.</span>
        </label>
        <label className="flex items-start gap-3 text-sm text-fg-2 sm:col-span-2">
          <input type="checkbox" className="mt-1 size-4 accent-[var(--color-accent)]" checked={form.share_aggregates} onChange={(e) => setForm({ ...form, share_aggregates: e.target.checked })} />
          <span>Contribuer aux stats du groupe. Seuls des totaux anonymes sont partagés, tes parties restent privées.</span>
        </label>
      </section>

      <HeroPicker title="Mes mains" hint="Les héros que tu joues le plus" heroes={heroes} selected={form.mains} onToggle={(id) => toggle("mains", id)} />
      <HeroPicker title="À entraîner" hint="Les héros que tu veux ajouter à ton pool" heroes={heroes} selected={form.train} onToggle={(id) => toggle("train", id)} />

      <div className="sticky bottom-20 z-10 flex flex-wrap items-center gap-3 md:bottom-4">
        <button type="submit" disabled={pending} className={buttonClass("primary", "px-6 py-3 shadow-lg shadow-black/40")}>
          {pending ? "Enregistrement…" : "Enregistrer le profil"}
        </button>
        {onCancel ? (
          <button type="button" className={buttonClass("ghost")} onClick={onCancel}>
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

function HeroPicker({ title, hint, heroes, selected, onToggle }: { title: string; hint: string; heroes: Hero[]; selected: number[]; onToggle: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const full = selected.length >= MAX_PICKS;
  const byId = useMemo(() => new Map(heroes.map((h) => [h.id, h])), [heroes]);
  const q = norm(query);
  const matches = (h: Hero) => !q || norm(h.name).includes(q);

  return (
    <section className="card flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg uppercase tracking-wide">{title}</h2>
        <p className="text-sm text-muted">
          {hint} · <span className="tabular">{selected.length}/{MAX_PICKS}</span>
        </p>
      </div>

      {/* Sélection actuelle, toujours visible en haut */}
      <div className="flex min-h-9 flex-wrap items-center gap-1.5">
        {selected.length === 0 ? <span className="text-sm text-muted">Aucun héros choisi pour l&apos;instant.</span> : null}
        {selected.map((id) => {
          const h = byId.get(id);
          if (!h) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onToggle(id)}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent/15 py-1 pl-1 pr-2 text-xs font-semibold"
              aria-label={`Retirer ${h.name}`}
            >
              <HeroMark name={h.name} role={h.roles[0]} size="sm" src={h.portrait_url} />
              {h.name}
              <X className="size-3.5 text-muted" />
            </button>
          );
        })}
      </div>

      <label className="field flex items-center gap-2 py-1.5">
        <Search className="size-4 shrink-0 text-muted" aria-hidden />
        <span className="sr-only">Rechercher un héros</span>
        <input
          className="min-w-0 flex-1 bg-transparent py-0.5 outline-none placeholder:text-muted"
          placeholder="Rechercher un héros…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")} aria-label="Effacer la recherche" className="text-muted hover:text-fg">
            <X className="size-4" />
          </button>
        ) : null}
      </label>
      {full ? <p className="text-xs text-muted">Maximum atteint : retire un héros pour en choisir un autre.</p> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {ROLES.map((role: Role) => {
          const list = heroes.filter((h) => h.roles[0] === role && matches(h)).sort((a, b) => a.name.localeCompare(b.name, "fr"));
          if (q && list.length === 0) return null;
          return (
            <div key={role} className="flex min-w-0 flex-wrap content-start gap-1.5">
              <p className="flex w-full items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <RoleDot role={role} />
                {role}
              </p>
              {list.map((h) => {
                const on = selected.includes(h.id);
                return (
                  <button
                    key={h.id}
                    type="button"
                    aria-pressed={on}
                    disabled={!on && full}
                    onClick={() => onToggle(h.id)}
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-xs font-semibold transition-colors disabled:opacity-40",
                      on ? "border-accent bg-accent/15 text-fg" : "border-line bg-surface-2 text-fg-2 hover:border-accent/60 hover:text-fg",
                    )}
                  >
                    <HeroMark name={h.name} role={h.roles[0]} size="sm" src={h.portrait_url} />
                    {h.name}
                  </button>
                );
              })}
            </div>
          );
        })}
        {q && !heroes.some(matches) ? <p className="text-sm text-muted">Aucun héros ne correspond à « {query} ».</p> : null}
      </div>
    </section>
  );
}
