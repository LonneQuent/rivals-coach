"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { DIAGRAMS, SECTION_KINDS, formatComboSteps, parseComboSteps, type DiagramKind, type GuideContent, type GuideStatus, type SectionKind } from "@/lib/guides";
import { DIAGRAM_LABEL } from "@/components/diagrams";
import { ImageField } from "./image-field";
import type { Role } from "@/lib/types";
import { buttonClass } from "@/components/ui";
import { saveGuide } from "../../actions";

type Target = { kind: "hero"; hero_id: number } | { kind: "role"; role: Role } | { kind: "map"; map_id: number } | { kind: "general"; slug: string };
type SectionDraft = {
  key: number;
  title: string;
  lead: string;
  ability: string;
  keycap: string;
  kind: SectionKind;
  items: string;
  icon: string;
  imageUrl: string;
  imageCaption: string;
  diagram: DiagramKind | "";
};
type ComboDraft = { key: number; title: string; steps: string; note: string };
const KIND_LABEL: Record<SectionKind, string> = { default: "Liste classique", tips: "Astuces mises en avant", mistakes: "Bloc « À éviter »" };

// Clés des blocs : stables entre le rendu serveur et le client (index au départ, compteur ensuite)
let k = 10_000;
const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const norm = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

/** Éditeur simple : une idée par ligne, « Héros | note » pour counters et synergies, « Titre | Auteur | URL » pour les sources. */
export function GuideEditor({
  target,
  initial,
  initialStatus,
  heroes,
  viewHref,
}: {
  target: Target;
  initial: GuideContent;
  initialStatus: GuideStatus;
  heroes: { slug: string; name: string }[];
  viewHref: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const nameOf = (slug: string) => heroes.find((h) => h.slug === slug)?.name ?? slug;

  const [title, setTitle] = useState(initial.title ?? "");
  const [summary, setSummary] = useState(initial.summary);
  const [patchNote, setPatchNote] = useState(initial.patch_note ?? "");
  const [status, setStatus] = useState<GuideStatus>(initialStatus);
  const [tldr, setTldr] = useState(initial.tldr.join("\n"));
  const [difficulty, setDifficulty] = useState(initial.difficulty);
  const [tags, setTags] = useState(initial.tags.join(", "));
  const blankSection = (key = ++k): SectionDraft => ({ key, title: "", lead: "", ability: "", keycap: "", kind: "default", items: "", icon: "", imageUrl: "", imageCaption: "", diagram: "" });
  const [sections, setSections] = useState<SectionDraft[]>(() =>
    initial.sections.length
      ? initial.sections.map((s, i) => ({
          key: i + 1,
          title: s.title,
          lead: s.lead,
          ability: s.ability,
          keycap: s.key,
          kind: s.kind,
          items: s.items.join("\n"),
          icon: s.icon,
          imageUrl: s.image?.url ?? "",
          imageCaption: s.image?.caption ?? "",
          diagram: s.diagram,
        }))
      : [blankSection(1)],
  );
  const patchSection = (key: number, p: Partial<SectionDraft>) => setSections((xs) => xs.map((x) => (x.key === key ? { ...x, ...p } : x)));
  const [combos, setCombos] = useState<ComboDraft[]>(() => initial.combos.map((c, i) => ({ key: 1000 + i, title: c.title, steps: formatComboSteps(c.steps), note: c.note })));
  const patchCombo = (key: number, p: Partial<ComboDraft>) => setCombos((xs) => xs.map((x) => (x.key === key ? { ...x, ...p } : x)));
  const [counters, setCounters] = useState(initial.counters.map((c) => `${nameOf(c.hero)} | ${c.note}`).join("\n"));
  const [synergies, setSynergies] = useState(initial.synergies.map((c) => `${nameOf(c.hero)} | ${c.note}`).join("\n"));
  const [sources, setSources] = useState(initial.sources.map((s) => [s.title, s.author, s.url].filter(Boolean).join(" | ")).join("\n"));

  function heroNotes(text: string, label: string) {
    const unknown: string[] = [];
    const out = lines(text).map((l) => {
      const [name, ...rest] = l.split("|");
      const n = norm(name);
      const h = heroes.find((x) => norm(x.name) === n || x.slug === name.trim()) ?? heroes.find((x) => norm(x.name).includes(n));
      if (!h) unknown.push(name.trim());
      return { hero: h?.slug ?? name.trim(), note: rest.join("|").trim() };
    });
    return { out, unknown: unknown.map((u) => `${label} : « ${u} »`) };
  }

  function save() {
    setMsg(null);
    const c = heroNotes(counters, "Counter");
    const s = heroNotes(synergies, "Synergie");
    const content: GuideContent = {
      title: title.trim(),
      // Le kit (capacités, team-ups, changements) est mis à jour par migration : on le conserve tel quel
      ...(initial.kit ? { kit: initial.kit } : {}),
      summary: summary.trim(),
      patch_note: patchNote.trim(),
      tldr: lines(tldr).slice(0, 4),
      difficulty,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5),
      sections: sections
        .filter((x) => x.title.trim() && (lines(x.items).length || x.imageUrl || x.diagram))
        .map((x) => ({
          title: x.title.trim(),
          lead: x.lead.trim(),
          ability: x.ability.trim(),
          key: x.keycap.trim(),
          kind: x.kind,
          items: lines(x.items),
          icon: x.icon,
          diagram: x.diagram,
          ...(x.imageUrl ? { image: { url: x.imageUrl, caption: x.imageCaption.trim() } } : {}),
        })),
      combos: combos
        .map((c) => ({ title: c.title.trim(), steps: parseComboSteps(c.steps), note: c.note.trim() }))
        .filter((c) => c.title && c.steps.length >= 2)
        .slice(0, 6),
      counters: c.out,
      synergies: s.out,
      sources: lines(sources).map((l) => {
        const [title, author = "", url = ""] = l.split("|").map((p) => p.trim());
        return { title, author, url: /^https?:\/\//.test(url) ? url : "" };
      }),
    };
    start(async () => {
      const res = await saveGuide({ ...target, status, content });
      const warn = [...c.unknown, ...s.unknown];
      setMsg(
        res.ok
          ? { ok: true, text: warn.length ? `Enregistré. Héros non reconnus (pas de lien vers leur fiche) : ${warn.join(", ")}.` : "Guide enregistré." }
          : { ok: false, text: res.error ?? "Erreur." },
      );
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="card flex flex-col gap-4">
        {target.kind === "general" || target.kind === "map" ? (
          <label className="label" htmlFor="title">
            Titre
            <input id="title" className="field" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
          </label>
        ) : null}
        <label className="label" htmlFor="summary">
          Résumé (1 ou 2 phrases)
          <textarea id="summary" className="field min-h-20" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={1000} />
        </label>
        <label className="label" htmlFor="patch">
          Avertissement de saison (facultatif)
          <input id="patch" className="field" value={patchNote} onChange={(e) => setPatchNote(e.target.value)} maxLength={500} placeholder="ex. Conseils de la saison 2, à vérifier en jeu" />
        </label>
        <label className="label" htmlFor="tldr">
          En bref : les 3 choses à retenir (une par ligne, **gras** possible)
          <textarea id="tldr" className="field min-h-24" value={tldr} onChange={(e) => setTldr(e.target.value)} placeholder="Joue **en flanc** : ta valeur, c'est la pression sur les supports." />
        </label>
        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          <label className="label" htmlFor="difficulty">
            Difficulté
            <select id="difficulty" className="field" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))}>
              <option value={0}>Non renseignée</option>
              <option value={1}>Accessible</option>
              <option value={2}>Intermédiaire</option>
              <option value={3}>Exigeant</option>
            </select>
          </label>
          <label className="label" htmlFor="tags">
            Style de jeu (séparé par des virgules, 5 max)
            <input id="tags" className="field" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Flanc, Pression backline, Très mobile" />
          </label>
        </div>
      </section>

      {sections.map((s, i) => (
        <section key={s.key} className="card flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <label className="label flex-1" htmlFor={`st-${s.key}`}>
              Titre de la section {i + 1}
              <input id={`st-${s.key}`} className="field" value={s.title} maxLength={80} onChange={(e) => patchSection(s.key, { title: e.target.value })} />
            </label>
            <label className="label w-48" htmlFor={`sk-${s.key}`}>
              Présentation
              <select id={`sk-${s.key}`} className="field" value={s.kind} onChange={(e) => patchSection(s.key, { kind: e.target.value as SectionKind })}>
                {SECTION_KINDS.map((kd) => (
                  <option key={kd} value={kd}>
                    {KIND_LABEL[kd]}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className={buttonClass("danger")} onClick={() => setSections((xs) => xs.filter((x) => x.key !== s.key))} aria-label={`Supprimer la section ${i + 1}`}>
              <Trash2 className="size-4" />
            </button>
          </div>
          {s.kind !== "mistakes" ? (
            <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
              <label className="label" htmlFor={`sa-${s.key}`}>
                Capacité (facultatif)
                <input id={`sa-${s.key}`} className="field" value={s.ability} maxLength={60} onChange={(e) => patchSection(s.key, { ability: e.target.value })} placeholder="ex. Joyful Splash" />
              </label>
              <label className="label" htmlFor={`sy-${s.key}`}>
                Touche (facultatif)
                <input id={`sy-${s.key}`} className="field" value={s.keycap} maxLength={20} onChange={(e) => patchSection(s.key, { keycap: e.target.value })} placeholder="ex. Clic G · Maj" />
              </label>
            </div>
          ) : null}
          {s.kind !== "mistakes" ? (
            <label className="label" htmlFor={`sl-${s.key}`}>
              Phrase d&apos;intro (facultatif)
              <textarea id={`sl-${s.key}`} className="field min-h-16" value={s.lead} maxLength={500} onChange={(e) => patchSection(s.key, { lead: e.target.value })} />
            </label>
          ) : null}
          <label className="label" htmlFor={`si-${s.key}`}>
            Conseils (un par ligne, **gras** pour les mots-clés)
            <textarea id={`si-${s.key}`} className="field min-h-32" value={s.items} onChange={(e) => patchSection(s.key, { items: e.target.value })} />
          </label>
          {s.kind !== "mistakes" ? (
            <details className="rounded-lg border border-line px-3 py-2" open={!!(s.icon || s.imageUrl || s.diagram)}>
              <summary className="cursor-pointer text-sm font-semibold text-fg-2">Illustrations (icône, schéma, capture)</summary>
              <div className="mt-3 flex flex-col gap-4 pb-1">
                <ImageField folder="icons" label="Icône de la capacité" value={s.icon} onChange={(url) => patchSection(s.key, { icon: url })} />
                <label className="label" htmlFor={`sd-${s.key}`}>
                  Schéma tactique dessiné par l&apos;app
                  <select id={`sd-${s.key}`} className="field" value={s.diagram} onChange={(e) => patchSection(s.key, { diagram: e.target.value as DiagramKind | "" })}>
                    <option value="">Aucun</option>
                    {DIAGRAMS.map((d) => (
                      <option key={d} value={d}>
                        {DIAGRAM_LABEL[d]}
                      </option>
                    ))}
                  </select>
                </label>
                <ImageField folder="captures" label="Capture d'écran ou schéma perso" value={s.imageUrl} onChange={(url) => patchSection(s.key, { imageUrl: url })} />
                {s.imageUrl ? (
                  <label className="label" htmlFor={`sc-${s.key}`}>
                    Légende de l&apos;image
                    <input id={`sc-${s.key}`} className="field" value={s.imageCaption} maxLength={160} onChange={(e) => patchSection(s.key, { imageCaption: e.target.value })} placeholder="ex. Le spot en hauteur à gauche du point A" />
                  </label>
                ) : null}
              </div>
            </details>
          ) : null}
        </section>
      ))}
      <button type="button" className={buttonClass("default", "self-start")} onClick={() => setSections((xs) => [...xs, blankSection()])}>
        <Plus className="size-4" /> Ajouter une section
      </button>

      <section className="card flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold">Combos</h2>
          <p className="text-sm text-muted">
            Étapes séparées par <code>&gt;</code>. Chaque étape : <code>Touche:effet</code>, <code>Touche</code> seule, ou <code>[action sans touche]</code>. Ex. <code>Clic G:tir &gt; E:coup de pied &gt; [saut] &gt; Clic G</code>
          </p>
        </div>
        {combos.map((c) => {
          const preview = parseComboSteps(c.steps);
          return (
            <div key={c.key} className="flex flex-col gap-2 rounded-lg border border-line p-3">
              <div className="flex items-end gap-3">
                <label className="label flex-1" htmlFor={`ct-${c.key}`}>
                  Nom du combo
                  <input id={`ct-${c.key}`} className="field" value={c.title} maxLength={60} onChange={(e) => patchCombo(c.key, { title: e.target.value })} placeholder="ex. Mise à mort rapide" />
                </label>
                <button type="button" className={buttonClass("danger")} onClick={() => setCombos((xs) => xs.filter((x) => x.key !== c.key))} aria-label="Supprimer le combo">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <label className="label" htmlFor={`cs-${c.key}`}>
                Étapes
                <input id={`cs-${c.key}`} className="field font-mono text-sm" value={c.steps} onChange={(e) => patchCombo(c.key, { steps: e.target.value })} />
              </label>
              <p className="text-xs text-muted">
                {preview.length < 2 ? "Il faut au moins 2 étapes." : `${preview.length} étapes : ${preview.map((p) => p.key || `[${p.label}]`).join(" → ")}`}
              </p>
              <label className="label" htmlFor={`cn-${c.key}`}>
                Note (facultatif)
                <input id={`cn-${c.key}`} className="field" value={c.note} maxLength={200} onChange={(e) => patchCombo(c.key, { note: e.target.value })} />
              </label>
            </div>
          );
        })}
        {combos.length < 6 ? (
          <button type="button" className={buttonClass("default", "self-start")} onClick={() => setCombos((xs) => [...xs, { key: ++k, title: "", steps: "", note: "" }])}>
            <Plus className="size-4" /> Ajouter un combo
          </button>
        ) : null}
      </section>

      <section className="card grid gap-4 md:grid-cols-2">
        <label className="label" htmlFor="counters">
          Le contrent (Héros | explication)
          <textarea id="counters" className="field min-h-32" value={counters} onChange={(e) => setCounters(e.target.value)} placeholder="Captain America | Il le suit partout" />
        </label>
        <label className="label" htmlFor="synergies">
          Synergies (Héros | explication)
          <textarea id="synergies" className="field min-h-32" value={synergies} onChange={(e) => setSynergies(e.target.value)} placeholder="Luna Snow | Team-up munitions glacées" />
        </label>
        <label className="label md:col-span-2" htmlFor="sources">
          Sources (Titre | Auteur | URL)
          <textarea id="sources" className="field min-h-20" value={sources} onChange={(e) => setSources(e.target.value)} placeholder="Guide Jeff | Paz | https://youtube.com/…" />
        </label>
      </section>

      <div className="sticky bottom-20 z-10 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/95 p-3 backdrop-blur md:bottom-4">
        <label className="flex items-center gap-2 text-sm font-semibold" htmlFor="status">
          Statut
          <select id="status" className="field w-auto py-1.5" value={status} onChange={(e) => setStatus(e.target.value as GuideStatus)}>
            <option value="draft">Brouillon (admins seulement)</option>
            <option value="published">Publié</option>
          </select>
        </label>
        <button type="button" disabled={pending} onClick={save} className={buttonClass("primary", "px-5")}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <a href={viewHref} className={buttonClass("ghost")}>
          Voir la page
        </a>
        {msg ? <p className={msg.ok ? "text-sm text-good" : "text-sm text-bad"}>{msg.text}</p> : null}
      </div>
    </div>
  );
}
