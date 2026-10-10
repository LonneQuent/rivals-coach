import type { Metadata } from "next";
import { getRefs, requireSession } from "@/lib/data";
import { PageHeader, Soon } from "@/components/ui";
import { ProfileSection } from "./profile-form";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilPage() {
  const { supabase, user, profile } = await requireSession();
  const [{ heroes }, picks] = await Promise.all([getRefs(), supabase.from("player_heroes").select("hero_id, kind").eq("user_id", user.id)]);
  const rows = (picks.data ?? []) as { hero_id: number; kind: "main" | "train" }[];

  return (
    <>
      <PageHeader title="Mon profil" subtitle="Ton identité dans l'app, tes mains et ta progression." />
      <ProfileSection
        heroes={heroes}
        avatarUrl={profile?.avatar_url ?? null}
        initial={{
          pseudo: profile?.pseudo ?? "",
          main_role: profile?.main_role ?? null,
          share_aggregates: profile?.share_aggregates ?? true,
          mains: rows.filter((r) => r.kind === "main").map((r) => r.hero_id),
          train: rows.filter((r) => r.kind === "train").map((r) => r.hero_id),
        }}
      />
      <Soon
        title="Radar de compétences et objectifs"
        items={[
          "Axes calculés depuis tes parties : Aim, Survie, Impact, Champion pool, Régularité",
          "Axes évalués par toi et ton coach : Game sense, Adaptabilité, Communication, Gestion des ults, Mental",
          "Objectifs mesurables suivis automatiquement sur tes dernières parties",
        ]}
      />
    </>
  );
}
