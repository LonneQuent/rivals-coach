import Link from "next/link";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { parseContent, roleFromSlug, roleSlug } from "@/lib/guides";
import { GuideView } from "@/components/guide-view";
import { HeroMark, buttonClass } from "@/components/ui";
import { GuideBanner } from "@/components/illustrations";

export default async function RoleGuidePage({ params }: { params: Promise<{ role: string }> }) {
  const { role: slug } = await params;
  const role = roleFromSlug(slug);
  if (!role) notFound();
  const { supabase, profile } = await requireSession();
  const [{ heroes }, guideRes, heroGuides] = await Promise.all([
    getRefs(),
    supabase.from("guides").select("content, status").eq("kind", "role").eq("role", role).maybeSingle(),
    supabase.from("guides").select("hero_id").eq("kind", "hero"),
  ]);
  const guide = guideRes.data as { content: unknown; status: "draft" | "published" } | null;
  const withGuide = new Set(((heroGuides.data ?? []) as { hero_id: number }[]).map((g) => g.hero_id));
  const roleHeroes = heroes.filter((h) => h.roles.includes(role));

  return (
    <>
      <Link href="/" className="text-sm text-muted hover:text-fg">
        ← Accueil
      </Link>
      <GuideBanner role={role} eyebrow="Guide du rôle" title={`Jouer ${role}`} subtitle={<p className="text-sm text-fg-2">{roleHeroes.length} héros dans ce rôle</p>}>
        {profile?.is_admin ? (
          <Link href={`/admin/guides/role/${roleSlug(role)}`} className={buttonClass("default")}>
            {guide ? "Modifier le guide" : "Créer le guide"}
          </Link>
        ) : null}
      </GuideBanner>

      {guide ? (
        <GuideView content={parseContent(guide.content)} heroes={heroes} role={role} />
      ) : (
        <div className="card text-sm text-fg-2">Le guide de ce rôle arrive bientôt.</div>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg uppercase tracking-wide">Les {role}s</h2>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          {roleHeroes.map((h) => (
            <li key={h.id}>
              <Link href={`/heros/${h.slug}`} className="lift flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2">
                <HeroMark name={h.name} role={role} size="sm" src={h.portrait_url} />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{h.name}</span>
                {withGuide.has(h.id) ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">Fiche</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
