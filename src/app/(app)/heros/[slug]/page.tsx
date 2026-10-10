import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/data";
import type { Hero } from "@/lib/types";
import { HeroMark, RoleBadge, Soon } from "@/components/ui";

export default async function HeroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireSession();
  const { data } = await supabase.from("heroes").select("id, slug, name, roles, active").eq("slug", slug).maybeSingle();
  const hero = data as Hero | null;
  if (!hero) notFound();

  const { data: mine } = await supabase
    .from("match_heroes")
    .select("role, matches!inner(result, user_id)")
    .eq("hero_id", hero.id)
    .eq("matches.user_id", user.id);
  const games = (mine ?? []) as unknown as { matches: { result: "win" | "loss" } }[];
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
          <div className="mt-1 flex flex-wrap gap-2">
            {hero.roles.map((r) => (
              <RoleBadge key={r} role={r} />
            ))}
          </div>
        </div>
        <div className="card ml-auto py-3">
          <p className="eyebrow">Toi avec ce héros</p>
          <p className="font-display text-2xl font-bold tabular">
            {games.length ? `${Math.round((wins / games.length) * 100)} % · ${games.length} partie${games.length > 1 ? "s" : ""}` : "Pas encore joué"}
          </p>
        </div>
      </section>
      <Soon
        title="Fiche du héros en préparation"
        items={[
          "Forces, faiblesses et style de jeu",
          "Counters et héros qui le contrent",
          "Synergies et team-ups",
          "Tips de top players, extraits de leurs vidéos",
          "Erreurs fréquentes à éviter",
        ]}
      />
    </>
  );
}
