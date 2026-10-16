import type { Metadata } from "next";
import Link from "next/link";
import { getRefs, requireSession } from "@/lib/data";
import { getComps, getPlayedHeroes } from "@/lib/comps-data";
import { EmptyState, PageHeader, buttonClass } from "@/components/ui";
import { CompCards } from "@/components/comp-view";
import { MascotTip } from "@/components/mascot";

export const metadata: Metadata = { title: "Compos d'équipe" };

export default async function CompsPage() {
  const { supabase, user, profile } = await requireSession();
  const { heroes } = await getRefs();
  const [comps, played] = await Promise.all([getComps(supabase), getPlayedHeroes(supabase, user.id, new Map(heroes.map((h) => [h.id, h.slug])))]);

  if (comps === null) {
    return <EmptyState title="Compos bientôt disponibles" body="Un admin doit exécuter la migration 0011 dans Supabase pour activer cette page." />;
  }

  return (
    <>
      <PageHeader
        title="Compos d'équipe"
        subtitle="Des façons de jouer à six, avec le rôle de chacun et le plan de combat. Choisis selon vos héros et ce que joue l'équipe d'en face."
        action={
          profile?.is_admin ? (
            <Link href="/admin/compos" className={buttonClass("default")}>
              Gérer les compos
            </Link>
          ) : undefined
        }
      />

      <MascotTip title="Comment choisir" pose="think" className="max-w-3xl">
        <p>
          Retiens le triangle : le <strong className="text-fg">brawl</strong> bat le <strong className="text-fg">dive</strong>, le dive bat le{" "}
          <strong className="text-fg">poke</strong>, et le poke bat le brawl. Regarde ce que joue l&apos;équipe d&apos;en face, puis prends la compo qui la
          contre parmi celles que vous savez jouer.
        </p>
      </MascotTip>

      {comps.length === 0 ? (
        <EmptyState title="Aucune compo publiée" body="Les admins peuvent en ajouter depuis Admin > Compos." />
      ) : (
        <CompCards comps={comps} heroes={heroes} played={played} />
      )}
    </>
  );
}
