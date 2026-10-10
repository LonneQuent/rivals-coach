"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { GuideContent, GuideStatus } from "@/lib/guides";
import type { Role } from "@/lib/types";
import { buttonClass } from "@/components/ui";
import { saveGuide } from "../../actions";

type Target = { kind: "hero"; hero_id: number } | { kind: "role"; role: Role };
type SectionDraft = { key: number; title: string; items: string };

let k = 0;
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

  const [summary, setSummary] = useState(initial.summary);
  const [patchNote, setPatchNote] = useState(initial.patch_note ?? "");
  const [status, setStatus] = useState<GuideStatus>(initialStatus);
  const [sections, setSections] = useState<SectionDraft[]>(() =>
    initial.sections.length ? initial.sections.map((s) => ({ key: ++k, title: s.title, items: s.items.join("\n") })) : [{ key: ++k, title: "", items: "" }],
  );
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
      summary: summary.trim(),
      patch_note: patchNote.trim(),
      sections: sections.filter((x) => x.title.trim() && lines(x.items).length).map((x) => ({ title: x.title.trim(), items: lines(x.items) })),
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
        <label className="label" htmlFor="summary">
          Résumé (1 ou 2 phrases)
          <textarea id="summary" className="field min-h-20" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={1000} />
        </label>
        <label className="label" htmlFor="patch">
          Avertissement de saison (facultatif)
          <input id="patch" className="field" value={patchNote} onChange={(e) => setPatchNote(e.target.value)} maxLength={500} placeholder="ex. Conseils de la saison 2, à vérifier en jeu" />
        </label>
      </section>

      {sections.map((s, i) => (
        <section key={s.key} className="card flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <label className="label flex-1" htmlFor={`st-${s.key}`}>
              Titre de la section {i + 1}
              <input id={`st-${s.key}`} className="field" value={s.title} maxLength={80} onChange={(e) => setSections((xs) => xs.map((x) => (x.key === s.key ? { ...x, title: e.target.value } : x)))} />
            </label>
            <button type="button" className={buttonClass("danger")} onClick={() => setSections((xs) => xs.filter((x) => x.key !== s.key))} aria-label={`Supprimer la section ${i + 1}`}>
              <Trash2 className="size-4" />
            </button>
          </div>
          <label className="label" htmlFor={`si-${s.key}`}>
            Conseils (un par ligne)
            <textarea id={`si-${s.key}`} className="field min-h-32" value={s.items} onChange={(e) => setSections((xs) => xs.map((x) => (x.key === s.key ? { ...x, items: e.target.value } : x)))} />
          </label>
        </section>
      ))}
      <button type="button" className={buttonClass("default", "self-start")} onClick={() => setSections((xs) => [...xs, { key: ++k, title: "", items: "" }])}>
        <Plus className="size-4" /> Ajouter une section
      </button>

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
