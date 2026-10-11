import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { getComps, getPlayedHeroes } from "@/lib/comps-data";
import { CompView } from "@/components/comp-view";

export const metadata: Metadata = { title: "Compo d'équipe" };

export default async function CompPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user, profile } = await requireSession();
  const { heroes } = await getRefs();
  const [comps, played] = await Promise.all([getComps(supabase), getPlayedHeroes(supabase, user.id, new Map(heroes.map((h) => [h.id, h.slug])))]);
  const comp = comps?.find((c) => c.slug === slug);
  if (!comp || !comps) notFound();
  return <CompView comp={comp} comps={comps} heroes={heroes} played={played} isAdmin={!!profile?.is_admin} />;
}
