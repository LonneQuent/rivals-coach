import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getRefs, requireSession } from "@/lib/data";
import { MATCH_STATS_SELECT, evalGoal, formatMetric, metricValue, aggregate, type Goal, type MatchRow } from "@/lib/stats";
import { skillFacts, type Evaluation } from "@/lib/skills";
import type { Role } from "@/lib/types";
import { EmptyState, HeroMark, ResultPill, RoleBadge } from "@/components/ui";
import { ClickableRow } from "@/components/clickable-row";
import { GoalsPanel, type GoalView } from "../../profil/goals-panel";
import { SkillRadar } from "../../profil/skill-radar";
import { CoachNotes, type NoteView } from "./notes";

export const metadata: Metadata = { title: "Fiche joueur" };

type Player = { id: string; pseudo: string | null; avatar_url: string | null; main_role: Role | null };

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { supabase, user, isCoach } = await requireSession();
  if (!isCoach) return <EmptyState title="Réservé aux coachs" body="Cette page est la fiche d'un joueur que tu coaches." />;

  const { data: link } = await supabase.from("coach_links").select("player_id").eq("coach_id", user.id).eq("player_id", id).maybeSingle();
  if (!link) return <EmptyState title="Ce joueur ne t'a pas autorisé" body="Il doit t'ajouter comme coach depuis son profil pour que tu voies ses données." href="/equipe" cta="Retour à l'équipe" />;

  const [refs, playerRes, picksRes, focusRes, goalsRes, evalsRes, notesRes, matchesRes] = await Promise.all([
    getRefs(),
    supabase.from("profiles").select("id, pseudo, avatar_url, main_role").eq("id", id).maybeSingle(),
    supabase.from("player_heroes").select("hero_id, kind").eq("user_id", id),
    supabase.rpc("get_focus_areas", { p_player: id }),
    supabase.from("goals").select("id, metric, op, target, role, created_by, user_id").eq("user_id", id).eq("active", true).order("created_at"),
    supabase.from("skill_evaluations").select("id, player_id, rater_id, scores, created_at").eq("player_id", id).order("created_at", { ascending: false }).limit(30),
    supabase.from("coach_notes").select("id, body, created_at").eq("player_id", id).eq("coach_id", user.id).order("created_at", { ascending: false }).limit(30),
    supabase.from("matches").select(`${MATCH_STATS_SELECT}, map:maps(name)`).eq("user_id", id).order("played_at", { ascending: false }).limit(100),
  ]);
  const player = playerRes.data as Player | null;
  if (!player) notFound();

  const heroById = new Map(refs.heroes.map((h) => [h.id, h]));
  const picks = (picksRes.data ?? []) as { hero_id: number; kind: "main" | "train" }[];
  const focus = (focusRes.data as string[] | null) ?? [];
  const matchesDesc = (matchesRes.data ?? []) as unknown as (MatchRow & { map: { name: string } | null })[];
  const matches = [...matchesDesc].reverse();
  const last20 = aggregate(matches).slice(-20);

  const goals: GoalView[] = ((goalsRes.data ?? []) as Goal[]).map((g) => ({
    id: g.id,
    metric: g.metric,
    op: g.op,
    target: Number(g.target),
    role: g.role,
    badge: g.created_by === user.id ? "fixé par toi" : "fixé par le joueur",
    canRemove: g.created_by === user.id,
    ...evalGoal({ ...g, target: Number(g.target) }, matches),
  }));

  const evals = (evalsRes.data ?? []) as Evaluation[];
  const mine = evals.find((e) => e.rater_id === user.id) ?? null;
  const theirs = evals.find((e) => e.rater_id === id) ?? null;
  const tiltId = refs.tags.find((t) => t.name.toLowerCase() === "tilt")?.id;
  const name = player.pseudo || "Ce joueur";

  const kpis: [string, string][] = [
    ["Parties", String(last20.length)],
    ["Winrate", formatMetric("winrate", metricValue("winrate", last20))],
    ["KDA", formatMetric("kda", metricValue("kda", last20))],
    ["Morts / 10 min", formatMetric("deaths10", metricValue("deaths10", last20))],
  ];

  return (
    <>
      <Link href="/equipe" className="text-sm text-muted hover:text-fg">
        ← Équipe
      </Link>
      <section className="flex flex-wrap items-center gap-4">
        {player.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={player.avatar_url} alt="" className="size-16 rounded-full" />
        ) : (
          <span className="grid size-16 place-items-center rounded-full bg-surface-3 font-display text-xl font-bold">{name.slice(0, 2).toUpperCase()}</span>
        )}
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Fiche joueur</p>
          <h1 className="text-3xl uppercase tracking-wide">{name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {player.main_role ? <RoleBadge role={player.main_role} /> : null}
            {picks.map((p) => {
              const h = heroById.get(p.hero_id);
              return h ? (
                <span key={`${p.kind}-${h.id}`} className={`inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-2.5 text-xs font-semibold ${p.kind === "main" ? "border-accent/60" : "border-dashed border-line text-fg-2"}`} title={p.kind === "main" ? "Main" : "À entraîner"}>
                  <HeroMark name={h.name} role={h.roles[0]} size="sm" src={h.portrait_url} />
                  {h.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map(([k, v]) => (
          <div key={k} className="card py-3">
            <p className="eyebrow">{k}</p>
            <p className="font-display text-2xl font-bold tabular">{v}</p>
            <p className="text-xs text-muted">20 dernières parties</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CoachNotes playerId={id} notes={(notesRes.data ?? []) as NoteView[]} />
        <section className="card flex flex-col gap-3">
          <h2 className="text-lg uppercase tracking-wide">Ce qu&apos;il veut améliorer</h2>
          {focus.length ? (
            <ul className="flex flex-col gap-1.5">
              {focus.map((f) => (
                <li key={f} className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm font-semibold">
                  <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Aucun axe renseigné. Propose-lui-en un dans une note.</p>
          )}
        </section>
      </div>

      <GoalsPanel goals={goals} playerId={id} title="Objectifs du joueur" />

      <SkillRadar
        current={mine ? { label: "Toi", scores: mine.scores, date: mine.created_at } : null}
        previous={null}
        coach={theirs ? { label: name, scores: theirs.scores, date: theirs.created_at } : null}
        facts={skillFacts(matches, tiltId)}
        playerId={id}
        mineLabel="Ton évaluation"
        overlayLabel={`Auto-évaluation de ${name}`}
        intro={`Note ${name} de 1 à 10 sur chaque axe. Ton évaluation se superpose à la sienne sur son profil.`}
        editLabel="Mettre à jour mon évaluation"
      />

      <section className="card flex flex-col gap-3 p-0 sm:p-0">
        <div className="px-4 pt-4 sm:px-5 sm:pt-5">
          <h2 className="text-lg uppercase tracking-wide">Dernières parties</h2>
          <p className="text-sm text-muted">Ouvre une partie pour la commenter.</p>
        </div>
        {matchesDesc.length ? (
          <div className="overflow-x-auto">
            <table className="tabular w-full min-w-[560px] text-sm">
              <tbody>
                {matchesDesc.slice(0, 20).map((m) => (
                  <ClickableRow key={m.id} href={`/historique/${m.id}`} label="Ouvrir la partie" className="border-t border-line transition-colors hover:bg-surface-3">
                    <td className="whitespace-nowrap px-4 py-2.5 text-fg-2">{new Date(m.played_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        {m.match_heroes.map((h, i) => {
                          const hero = heroById.get(h.hero_id);
                          return hero ? <HeroMark key={i} name={hero.name} role={h.role} size="sm" src={hero.portrait_url} /> : null;
                        })}
                        <span className="ml-2 font-semibold">{m.match_heroes.map((h) => heroById.get(h.hero_id)?.name ?? "?").join(", ")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <ResultPill result={m.result} />
                    </td>
                    <td className="max-w-48 truncate px-4 py-2.5 text-fg-2">{m.map?.name ?? "–"}</td>
                  </ClickableRow>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 pb-5 text-sm text-muted">Aucune partie saisie pour l&apos;instant.</p>
        )}
      </section>
    </>
  );
}
