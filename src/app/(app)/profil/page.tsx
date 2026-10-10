import type { Metadata } from "next";
import { getRefs, requireSession } from "@/lib/data";
import { MATCH_STATS_SELECT, evalGoal, type Goal, type MatchRow } from "@/lib/stats";
import { skillFacts, type Evaluation } from "@/lib/skills";
import { PageHeader } from "@/components/ui";
import { FocusAreas } from "./focus-areas";
import { GoalsPanel, type GoalView } from "./goals-panel";
import { ProfileSection } from "./profile-form";
import { SkillRadar } from "./skill-radar";

export const metadata: Metadata = { title: "Mon profil" };

const DAY = 864e5;

export default async function ProfilPage() {
  const { supabase, user, profile } = await requireSession();
  const [refs, picks, focusRes, goalsRes, evalsRes, matchesRes] = await Promise.all([
    getRefs(),
    supabase.from("player_heroes").select("hero_id, kind").eq("user_id", user.id),
    supabase.from("profiles").select("focus_areas").eq("id", user.id).maybeSingle(),
    supabase.from("goals").select("id, metric, op, target, role, created_by, user_id").eq("user_id", user.id).eq("active", true).order("created_at"),
    supabase.from("skill_evaluations").select("id, player_id, rater_id, scores, created_at").eq("player_id", user.id).order("created_at", { ascending: false }).limit(30),
    supabase.from("matches").select(MATCH_STATS_SELECT).eq("user_id", user.id).order("played_at", { ascending: false }).limit(100),
  ]);

  const rows = (picks.data ?? []) as { hero_id: number; kind: "main" | "train" }[];
  const focus = ((focusRes.data as { focus_areas?: string[] } | null)?.focus_areas ?? []) as string[];
  const matches = ((matchesRes.data ?? []) as unknown as MatchRow[]).reverse();

  const goals: GoalView[] = ((goalsRes.data ?? []) as Goal[]).map((g) => ({
    id: g.id,
    metric: g.metric,
    op: g.op,
    target: Number(g.target),
    role: g.role,
    fromCoach: g.created_by !== user.id,
    ...evalGoal({ ...g, target: Number(g.target) }, matches),
  }));

  // Radar : dernière auto-évaluation, une précédente datant d'au moins 14 jours si possible, et la dernière note d'un coach
  const evals = (evalsRes.data ?? []) as Evaluation[];
  const selfEvals = evals.filter((e) => e.rater_id === user.id);
  const current = selfEvals[0] ?? null;
  const previous = current
    ? (selfEvals.find((e) => Date.parse(current.created_at) - Date.parse(e.created_at) >= 14 * DAY) ?? selfEvals[1] ?? null)
    : null;
  const coach = evals.find((e) => e.rater_id !== user.id) ?? null;
  const toSeries = (e: Evaluation | null, label: string) => (e ? { label, scores: e.scores, date: e.created_at } : null);
  const tiltId = refs.tags.find((t) => t.name.toLowerCase() === "tilt")?.id;

  return (
    <>
      <PageHeader title="Mon profil" subtitle="Ton identité dans l'app, tes axes de travail et ta progression." />
      <ProfileSection
        heroes={refs.heroes}
        avatarUrl={profile?.avatar_url ?? null}
        initial={{
          pseudo: profile?.pseudo ?? "",
          main_role: profile?.main_role ?? null,
          share_aggregates: profile?.share_aggregates ?? true,
          mains: rows.filter((r) => r.kind === "main").map((r) => r.hero_id),
          train: rows.filter((r) => r.kind === "train").map((r) => r.hero_id),
        }}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <FocusAreas initial={focus} />
        <GoalsPanel goals={goals} />
      </div>
      <SkillRadar
        current={toSeries(current, "Toi")}
        previous={previous && previous.id !== current?.id ? toSeries(previous, "Avant") : null}
        coach={toSeries(coach, "Coach")}
        facts={skillFacts(matches, tiltId)}
      />
    </>
  );
}
