import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { parseContent } from "@/lib/guides";
import { mapShortName, mapSlug, mapZone } from "@/lib/maps";
import { GuideView } from "@/components/guide-view";
import { TopicBanner } from "@/components/topic-banner";
import { buttonClass } from "@/components/ui";

export const metadata: Metadata = { title: "Guide de carte" };

export default async function MapGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, profile } = await requireSession();
  const { heroes, maps, gameModes } = await getRefs();
  const map = maps.find((m) => mapSlug(m.name) === slug);
  if (!map) notFound();
  const { data } = await supabase.from("guides").select("content, status").eq("kind", "map").eq("map_id", map.id).maybeSingle();
  const guide = data as { content: unknown; status: "draft" | "published" } | null;
  const mode = gameModes.find((g) => g.id === map.game_mode_id)?.name;

  return (
    <>
      <Link href="/cartes" className="text-sm text-muted hover:text-fg">
        ← Toutes les cartes
      </Link>
      <TopicBanner eyebrow={[mode, mapZone(map.name)].filter(Boolean).join(" · ")} title={mapShortName(map.name)}>
        {profile?.is_admin ? (
          <Link href={`/admin/guides/map/${slug}`} className={buttonClass("default")}>
            {guide ? "Modifier le guide" : "Créer le guide"}
          </Link>
        ) : null}
      </TopicBanner>
      {guide ? (
        <>
          {guide.status === "draft" ? <p className="rounded-lg bg-surface-3 px-3 py-2 text-sm text-fg-2">Brouillon : visible uniquement par les admins.</p> : null}
          <GuideView content={parseContent(guide.content)} heroes={heroes} role="Strategist" accent="var(--color-accent)" labels={{ matchups: "Héros à l'aise ici", synergies: "Ils brillent sur cette carte" }} />
        </>
      ) : (
        <div className="card text-sm text-fg-2">Le guide de cette carte arrive bientôt.</div>
      )}
    </>
  );
}
