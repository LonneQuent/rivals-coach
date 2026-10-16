import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getRefs, requireSession } from "@/lib/data";
import { getEnemyIds } from "@/lib/matches";
import { mapShortName } from "@/lib/maps";
import type { Role } from "@/lib/types";
import { HeroMark, ResultPill, RoleBadge, buttonClass } from "@/components/ui";
import { DeleteMatchButton } from "../delete-button";
import { MatchComments, type CommentView } from "./comments";

export const metadata: Metadata = { title: "Détail de la partie" };

type HeroLine = {
  position: number;
  role: Role;
  play_minutes: number | null;
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  final_hits: number | null;
  damage: number | null;
  damage_blocked: number | null;
  healing: number | null;
  accuracy: number | null;
  hero: { name: string; slug: string } | null;
};

type Detail = {
  id: string;
  user_id: string;
  played_at: string;
  result: "win" | "loss";
  duration_min: number | null;
  feeling: number | null;
  award: "MVP" | "SVP" | null;
  note: string | null;
  queue: { name: string } | null;
  map: { name: string } | null;
  mode: { name: string } | null;
  rank: { name: string } | null;
  match_heroes: HeroLine[];
  match_tags: { tag: { name: string; kind?: "mistake" | "strength" } | null }[];
};

const FEELINGS = ["", "Très mauvais", "Mauvais", "Moyen", "Bon", "Excellent"];
const fmt = (v: number | null, d = 0) => (v === null || v === undefined ? "–" : Number(v).toLocaleString("fr-FR", { maximumFractionDigits: d }));

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { supabase, user } = await requireSession();
  const { data } = await supabase
    .from("matches")
    .select(
      "id, user_id, played_at, result, duration_min, feeling, award, note, queue:queues(name), map:maps(name), mode:game_modes(name), rank:ranks(name), match_heroes(position, role, play_minutes, kills, deaths, assists, final_hits, damage, damage_blocked, healing, accuracy, hero:heroes(name, slug)), match_tags(tag:error_tags(*))",
    )
    .eq("id", id)
    .maybeSingle();
  const m = data as unknown as Detail | null;
  if (!m) notFound();

  const mine = m.user_id === user.id;
  const { data: commentsData } = await supabase
    .from("match_comments")
    .select("id, body, created_at, author_id, author:profiles!match_comments_author_id_fkey(pseudo)")
    .eq("match_id", m.id)
    .order("created_at");
  const comments: CommentView[] = ((commentsData ?? []) as unknown as { id: string; body: string; created_at: string; author_id: string; author: { pseudo: string | null } | null }[]).map((c) => ({
    id: c.id,
    body: c.body,
    created_at: c.created_at,
    mine: c.author_id === user.id,
    author: c.author_id === user.id ? "Toi" : c.author?.pseudo || "Joueur",
    isCoach: c.author_id !== m.user_id,
  }));
  const heroes = [...m.match_heroes].sort((a, b) => a.position - b.position);
  const total = (k: keyof HeroLine) => (heroes.some((h) => h[k] !== null) ? heroes.reduce((s, h) => s + Number(h[k] ?? 0), 0) : null);
  const kills = total("kills"), deaths = total("deaths"), assists = total("assists");
  const kda = kills === null || deaths === null ? null : (kills + (assists ?? 0)) / Math.max(deaths, 1);
  const goodTags = m.match_tags.filter((t) => t.tag?.kind === "strength").map((t) => t.tag!.name);
  const badTags = m.match_tags.filter((t) => t.tag && t.tag.kind !== "strength").map((t) => t.tag!.name);
  const [{ heroes: allHeroes }, enemyIds] = await Promise.all([getRefs(), getEnemyIds(supabase, m.id)]);
  const enemies = enemyIds.map((hid) => allHeroes.find((h) => h.id === hid)).filter((h) => h !== undefined);
  const date = new Date(m.played_at);

  const context: [string, string][] = [
    ["File", m.queue?.name ?? "–"],
    ["Mode", m.mode?.name ?? "–"],
    ["Carte", m.map ? mapShortName(m.map.name) : "–"],
    ["Rang", m.rank?.name ?? "–"],
    ["Durée", m.duration_min ? `${fmt(m.duration_min, 1)} min` : "–"],
  ];

  return (
    <>
      <Link href={mine ? "/historique" : `/equipe/${m.user_id}`} className="text-sm text-muted hover:text-fg">
        {mine ? "← Historique" : "← Fiche du joueur"}
      </Link>

      <section className="flex flex-wrap items-center gap-4">
        <div className="flex -space-x-2">
          {heroes.map((h, i) => (
            <HeroMark key={i} name={h.hero?.name ?? "?"} role={h.role} size="lg" />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ResultPill result={m.result} />
            {m.award ? <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">{m.award}</span> : null}
          </div>
          <h1 className="mt-1 text-2xl uppercase tracking-wide sm:text-3xl">{heroes.map((h) => h.hero?.name ?? "?").join(" → ")}</h1>
          <p className="text-sm text-muted">
            {date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        {mine ? (
          <div className="flex gap-2">
            <Link href={`/saisir?edit=${m.id}`} className={buttonClass("default")}>
              Modifier
            </Link>
            <DeleteMatchButton id={m.id} redirectTo="/historique" size="md" />
          </div>
        ) : null}
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["E / M / A", `${fmt(kills)} / ${fmt(deaths)} / ${fmt(assists)}`],
          ["KDA", kda === null ? "–" : fmt(kda, 2)],
          ["Dégâts", fmt(total("damage"))],
          ["Soins", fmt(total("healing"))],
        ].map(([label, value]) => (
          <div key={label} className="card py-3">
            <p className="eyebrow">{label}</p>
            <p className="font-display text-2xl font-bold tabular">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card flex flex-col gap-3 lg:col-span-2">
          <h2 className="text-lg uppercase tracking-wide">Stats par héros</h2>
          <div className="overflow-x-auto">
            <table className="tabular w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  {["Héros", "Min", "E", "M", "A", "Final hits", "Dégâts", "Bloqués", "Soins", "Précision"].map((h, i) => (
                    <th key={h} className={`eyebrow px-2 py-2 font-semibold ${i > 0 ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heroes.map((h, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="px-2 py-2">
                      <div className="flex flex-col items-start gap-1">
                        {h.hero ? (
                          <Link href={`/heros/${h.hero.slug}`} className="font-semibold hover:text-accent">
                            {h.hero.name}
                          </Link>
                        ) : (
                          "?"
                        )}
                        <RoleBadge role={h.role} />
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right">{fmt(h.play_minutes, 1)}</td>
                    <td className="px-2 py-2 text-right">{fmt(h.kills)}</td>
                    <td className="px-2 py-2 text-right">{fmt(h.deaths)}</td>
                    <td className="px-2 py-2 text-right">{fmt(h.assists)}</td>
                    <td className="px-2 py-2 text-right">{fmt(h.final_hits)}</td>
                    <td className="px-2 py-2 text-right">{fmt(h.damage)}</td>
                    <td className="px-2 py-2 text-right">{fmt(h.damage_blocked)}</td>
                    <td className="px-2 py-2 text-right">{fmt(h.healing)}</td>
                    <td className="px-2 py-2 text-right">{h.accuracy === null ? "–" : `${fmt(h.accuracy, 1)} %`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card flex flex-col gap-4">
          <h2 className="text-lg uppercase tracking-wide">Partie</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {context.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="min-w-0 truncate text-right font-semibold">{v}</dd>
              </div>
            ))}
            <dt className="text-muted">Ressenti</dt>
            <dd className="text-right font-semibold">{m.feeling ? `${m.feeling}/5 · ${FEELINGS[m.feeling]}` : "–"}</dd>
          </dl>
          {goodTags.length ? (
            <div className="flex flex-col gap-2">
              <span className="eyebrow">Ce qui a bien marché</span>
              <div className="flex flex-wrap gap-1.5">
                {goodTags.map((t) => (
                  <span key={t} className="rounded-full bg-good-bg px-2.5 py-0.5 text-xs font-semibold text-good">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {badTags.length ? (
            <div className="flex flex-col gap-2">
              <span className="eyebrow">Ce qui a coincé</span>
              <div className="flex flex-wrap gap-1.5">
                {badTags.map((t) => (
                  <span key={t} className="rounded-full bg-bad-bg px-2.5 py-0.5 text-xs font-semibold text-bad">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {enemies.length ? (
            <div className="flex flex-col gap-2">
              <span className="eyebrow">Compo adverse</span>
              <div className="flex flex-wrap gap-1.5">
                {enemies.map((h) => (
                  <Link key={h.id} href={`/heros/${h.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 py-0.5 pl-0.5 pr-2 text-xs font-semibold hover:border-accent/60">
                    <HeroMark name={h.name} role={h.roles[0]} size="sm" src={h.portrait_url} />
                    {h.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          {m.note ? (
            <div className="flex flex-col gap-1">
              <span className="eyebrow">Note</span>
              <p className="whitespace-pre-wrap text-sm text-fg-2">{m.note}</p>
            </div>
          ) : null}
        </section>
      </div>
      <MatchComments
        matchId={m.id}
        comments={comments}
        placeholder={mine ? "Une question pour ton coach sur cette partie ?" : "Ton retour sur cette partie : ce qui était bien, ce qu'il faut corriger…"}
      />
    </>
  );
}
