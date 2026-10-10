import Link from "next/link";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { parseContent, roleSlug } from "@/lib/guides";
import type { Hero } from "@/lib/types";
import { GuideView } from "@/components/guide-view";
import { HeroMark, RoleBadge, buttonClass } from "@/components/ui";

export default async function HeroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user, profile } = await requireSession();
  const { heroes } = await getRefs();
  const hero = heroes.find((h) => h.slug === slug) as Hero | undefined;
  if (!hero) notFound();

  const [guideRes, mineRes] = await Promise.all([
    supabase.from("guides").select("content, status").eq("kind", "hero").eq("hero_id", hero.id).maybeSingle(),
    supabase.from("match_heroes").select("matches!inner(result, user_id)").eq("hero_id", hero.id).eq("matches.user_id", user.id),
  ]);
  const guide = guideRes.data as { content: unknown; status: "draft" | "published" } | null;
  const games = (mineRes.data ?? []) as unknown as { matches: { result: "win" | "loss" } }[];
  const wins = games.filter((g) => g.matches.result === "win").length;

  return (
    <>
      <Link href="/" className="text-sm text-muted hover:text-fg">
        ← Tous les héros
      </Link>
      <section className="flex flex-wrap items-center gap-4">
        <HeroMark name={hero.name} role={hero.roles[0]} size="lg" />
        <div className="min-w-0">
          <h1 className="text-3xl uppercase tracking-wide sm:text-4xl">{hero.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {hero.roles.map((r) => (
              <RoleBadge key={r} role={r} />
            ))}
            {hero.roles.map((r) => (
              <Link key={`g-${r}`} href={`/guides/${roleSlug(r)}`} className="text-xs font-semibold text-muted hover:text-accent">
                Guide du rôle {r} →
              </Link>
            ))}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="card py-3">
            <p className="eyebrow">Toi avec ce héros</p>
            <p className="font-display text-2xl font-bold tabular">
              {games.length ? `${Math.round((wins / games.length) * 100)} % · ${games.length} partie${games.length > 1 ? "s" : ""}` : "Pas encore joué"}
            </p>
          </div>
          {profile?.is_admin ? (
            <Link href={`/admin/guides/hero/${hero.slug}`} className={buttonClass("default")}>
              {guide ? "Modifier la fiche" : "Créer la fiche"}
            </Link>
          ) : null}
        </div>
      </section>

      {guide ? (
        <>
          {guide.status === "draft" ? <p className="rounded-lg bg-surface-3 px-3 py-2 text-sm text-fg-2">Brouillon : visible uniquement par les admins.</p> : null}
          <GuideView content={parseContent(guide.content)} heroes={heroes} />
        </>
      ) : (
        <div className="card flex flex-col gap-2">
          <span className="eyebrow">Fiche en préparation</span>
          <p className="text-sm text-fg-2">
            Les conseils de ce héros arrivent bientôt : forces et faiblesses, counters, synergies, tips de top players et erreurs fréquentes. En attendant, le guide du rôle donne les bases.
          </p>
        </div>
      )}
    </>
  );
}
