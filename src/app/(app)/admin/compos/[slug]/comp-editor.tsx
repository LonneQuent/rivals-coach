"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { DIAGRAMS, type DiagramKind } from "@/lib/guides";
import type { CompContent, CompStatus, TeamComp } from "@/lib/comps";
import { ROLES, type Role } from "@/lib/types";
import { DIAGRAM_LABEL } from "@/components/diagrams";
import { buttonClass } from "@/components/ui";
import { deleteComp, saveComp } from "../actions";

type HeroOpt = { slug: string; name: string; roles: Role[] };
type Ref = { slug: string; name: string };

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const norm = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** Retrouve un élément par nom ou identifiant, en tolérant accents, majuscules et noms partiels. */
function find<T extends Ref>(list: T[], raw: string): T | undefined {
  const n = norm(raw);
  if (!n) return undefined;
  return list.find((x) => norm(x.name) === n || x.slug === raw.trim()) ?? list.find((x) => norm(x.name).includes(n));
}

export function CompEditor({ comp, heroes, others, nextSort }: { comp: TeamComp | null; heroes: HeroOpt[]; others: Ref[]; nextSort: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const c = comp?.content;
  const nameOf = (slug: string) => heroes.find((h) => h.slug === slug)?.name ?? slug;
  const compName = (slug: string) => others.find((o) => o.slug === slug)?.name ?? slug;

  const [name, setName] = useState(c?.name ?? "");
  const [slug, setSlug] = useState(comp?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!comp);
  const [tagline, setTagline] = useState(c?.tagline ?? "");
  const [style, setStyle] = useState<DiagramKind>(c?.style ?? "brawl");
  const [difficulty, setDifficulty] = useState(c?.difficulty ?? 0);
  const [summary, setSummary] = useState(c?.summary ?? "");
  const [status, setStatus] = useState<CompStatus>(comp?.status ?? "draft");
  const [sort, setSort] = useState(comp?.sort ?? nextSort);
  const [patchNote, setPatchNote] = useState(c?.patch_note ?? "");
  const [team, setTeam] = useState(
    (c?.heroes ?? [])
      .map((h) => {
        const hero = heroes.find((x) => x.slug === h.hero);
        const roleTag = hero && hero.roles[0] !== h.role ? ` (${h.role})` : "";
        return `${nameOf(h.hero)}${roleTag} | ${h.job}`;
      })
      .join("\n"),
  );
  const [alts, setAlts] = useState((c?.alternatives ?? []).map((a) => [nameOf(a.hero), a.replaces ? nameOf(a.replaces) : "", a.note].join(" | ")).join("\n"));
  const [bestWhen, setBestWhen] = useState((c?.best_when ?? []).join("\n"));
  const [failure, setFailure] = useState((c?.failure_signs ?? []).join("\n"));
  const [plan, setPlan] = useState((c?.game_plan ?? []).join("\n"));
  const [strong, setStrong] = useState((c?.strong_vs ?? []).map((m) => `${compName(m.comp)} | ${m.note}`).join("\n"));
  const [weak, setWeak] = useState((c?.weak_vs ?? []).map((m) => `${compName(m.comp)} | ${m.note}`).join("\n"));

  function build(): { content: CompContent; errors: string[] } {
    const errors: string[] = [];
    const heroLines = lines(team).map((l) => {
      const [left, ...rest] = l.split("|");
      const m = left.trim().match(/^(.*?)\s*\((Vanguard|Duelist|Strategist)\)\s*$/i);
      const label = m ? m[1] : left;
      const hero = find(heroes, label);
      if (!hero) {
        errors.push(`Héros inconnu : « ${label.trim()} »`);
        return null;
      }
      const role = (m ? ROLES.find((r) => r.toLowerCase() === m[2].toLowerCase()) : undefined) ?? hero.roles[0];
      return { hero: hero.slug, role, job: rest.join("|").trim().slice(0, 160) };
    });
    const alternatives = lines(alts).flatMap((l) => {
      const [h, rep = "", ...note] = l.split("|").map((p) => p.trim());
      const hero = find(heroes, h);
      if (!hero) {
        errors.push(`Remplaçant inconnu : « ${h} »`);
        return [];
      }
      const replaced = rep ? find(heroes, rep) : undefined;
      if (rep && !replaced) errors.push(`Héros remplacé inconnu : « ${rep} »`);
      return [{ hero: hero.slug, replaces: replaced?.slug ?? "", note: note.join("|").trim().slice(0, 160) }];
    });
    const matchups = (text: string, label: string) =>
      lines(text).flatMap((l) => {
        const [name, ...note] = l.split("|");
        const other = find(others, name);
        if (!other) {
          errors.push(`${label} : compo inconnue « ${name.trim()} »`);
          return [];
        }
        return [{ comp: other.slug, note: note.join("|").trim().slice(0, 200) }];
      });
    return {
      errors,
      content: {
        name: name.trim(),
        tagline: tagline.trim(),
        style,
        difficulty,
        summary: summary.trim(),
        heroes: heroLines.filter((h): h is NonNullable<typeof h> => h !== null),
        alternatives,
        best_when: lines(bestWhen),
        failure_signs: lines(failure),
        game_plan: lines(plan),
        strong_vs: matchups(strong, "Forte contre"),
        weak_vs: matchups(weak, "Faible contre"),
        patch_note: patchNote.trim(),
      },
    };
  }

  function save() {
    setMsg(null);
    const { content, errors } = build();
    if (errors.length) return setMsg({ ok: false, text: errors.join(" · ") });
    if (content.heroes.length < 2) return setMsg({ ok: false, text: "Ajoute au moins 2 héros (6 pour une compo complète)." });
    start(async () => {
      const res = await saveComp({ id: comp?.id ?? null, slug: slug || slugify(name), status, sort, content });
      if (!res.ok) return setMsg({ ok: false, text: res.error ?? "Erreur." });
      setMsg({ ok: true, text: content.heroes.length === 6 ? "Compo enregistrée." : `Enregistrée, avec ${content.heroes.length} héros sur 6.` });
      if (!comp && res.slug) router.replace(`/admin/compos/${res.slug}`);
      else router.refresh();
    });
  }

  function remove() {
    if (!comp) return;
    start(async () => {
      const res = await deleteComp(comp.id);
      if (!res.ok) return setMsg({ ok: false, text: res.error ?? "Erreur." });
      router.replace("/admin/compos");
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="card flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
          <label className="label" htmlFor="name">
            Nom
            <input
              id="name"
              className="field"
              value={name}
              maxLength={60}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="ex. Brawl au contact"
            />
          </label>
          <label className="label" htmlFor="slug">
            Adresse de la page
            <input
              id="slug"
              className="field font-mono text-sm"
              value={slug}
              maxLength={60}
              disabled={!!comp}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="brawl"
            />
          </label>
        </div>
        <label className="label" htmlFor="tagline">
          Phrase d&apos;accroche
          <input id="tagline" className="field" value={tagline} maxLength={140} onChange={(e) => setTagline(e.target.value)} placeholder="On avance tous ensemble et on gagne au contact." />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="label" htmlFor="style">
            Style (schéma affiché)
            <select id="style" className="field" value={style} onChange={(e) => setStyle(e.target.value as DiagramKind)}>
              {DIAGRAMS.map((d) => (
                <option key={d} value={d}>
                  {DIAGRAM_LABEL[d]}
                </option>
              ))}
            </select>
          </label>
          <label className="label" htmlFor="difficulty">
            Difficulté
            <select id="difficulty" className="field" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))}>
              <option value={0}>Non renseignée</option>
              <option value={1}>Accessible</option>
              <option value={2}>Intermédiaire</option>
              <option value={3}>Exigeante</option>
            </select>
          </label>
          <label className="label" htmlFor="sort">
            Ordre d&apos;affichage
            <input id="sort" type="number" min={0} max={10000} className="field" value={sort} onChange={(e) => setSort(Math.max(0, Math.min(10000, Number(e.target.value) || 0)))} />
          </label>
        </div>
        <label className="label" htmlFor="summary">
          Résumé
          <textarea id="summary" className="field min-h-20" value={summary} maxLength={600} onChange={(e) => setSummary(e.target.value)} />
        </label>
        <label className="label" htmlFor="patch">
          Avertissement de saison (facultatif)
          <input id="patch" className="field" value={patchNote} maxLength={300} onChange={(e) => setPatchNote(e.target.value)} />
        </label>
      </section>

      <section className="card flex flex-col gap-4">
        <label className="label" htmlFor="team">
          Les 6 héros (« Nom | sa mission », rôle forcé possible : « Deadpool (Duelist) | … »)
          <textarea id="team" className="field min-h-40" value={team} onChange={(e) => setTeam(e.target.value)} placeholder={"The Thing | Ouvre le combat et prend l'espace.\nLuna Snow | Soins de groupe, ult pour le combat prolongé."} />
        </label>
        <label className="label" htmlFor="alts">
          Remplaçants (« Nom | remplace qui | pourquoi »)
          <textarea id="alts" className="field min-h-28" value={alts} onChange={(e) => setAlts(e.target.value)} placeholder="Thor | The Thing | Plus mobile, ramène un tank ennemi." />
        </label>
      </section>

      <section className="card grid gap-4 md:grid-cols-2">
        <label className="label md:col-span-2" htmlFor="plan">
          Plan de combat (une étape par ligne, dans l&apos;ordre, 6 max)
          <textarea id="plan" className="field min-h-32" value={plan} onChange={(e) => setPlan(e.target.value)} />
        </label>
        <label className="label" htmlFor="best">
          Quand la jouer (5 max)
          <textarea id="best" className="field min-h-28" value={bestWhen} onChange={(e) => setBestWhen(e.target.value)} />
        </label>
        <label className="label" htmlFor="fail">
          Signes que ça ne marche pas (5 max)
          <textarea id="fail" className="field min-h-28" value={failure} onChange={(e) => setFailure(e.target.value)} />
        </label>
        <label className="label" htmlFor="strong">
          Forte contre (« Nom de la compo | pourquoi »)
          <textarea id="strong" className="field min-h-20" value={strong} onChange={(e) => setStrong(e.target.value)} />
        </label>
        <label className="label" htmlFor="weak">
          Faible contre (« Nom de la compo | pourquoi »)
          <textarea id="weak" className="field min-h-20" value={weak} onChange={(e) => setWeak(e.target.value)} />
        </label>
        {others.length ? <p className="text-xs text-muted md:col-span-2">Compos existantes : {others.map((o) => o.name).join(", ")}.</p> : null}
      </section>

      <div className="sticky bottom-20 z-10 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/95 p-3 backdrop-blur md:bottom-4">
        <label className="flex items-center gap-2 text-sm font-semibold" htmlFor="status">
          Statut
          <select id="status" className="field w-auto py-1.5" value={status} onChange={(e) => setStatus(e.target.value as CompStatus)}>
            <option value="draft">Brouillon (admins seulement)</option>
            <option value="published">Publiée</option>
          </select>
        </label>
        <button type="button" disabled={pending || !name.trim()} onClick={save} className={buttonClass("primary", "px-5")}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        {comp ? (
          confirmDelete ? (
            <span className="flex items-center gap-2 text-sm">
              Supprimer définitivement ?
              <button type="button" disabled={pending} className={buttonClass("danger")} onClick={remove}>
                Oui, supprimer
              </button>
              <button type="button" className={buttonClass("ghost")} onClick={() => setConfirmDelete(false)}>
                Annuler
              </button>
            </span>
          ) : (
            <button type="button" className={buttonClass("ghost")} onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-4" /> Supprimer
            </button>
          )
        ) : null}
        {msg ? <p className={msg.ok ? "text-sm text-good" : "text-sm text-bad"}>{msg.text}</p> : null}
      </div>
    </div>
  );
}
