import Link from "next/link";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { parseContent, roleSlug } from "@/lib/guides";
import { MIN_META_MATCHES, bracketLabel, getMeta, myBracket, pct } from "@/lib/meta";
import type { Hero } from "@/lib/types";
import { GuideView } from "@/components/guide-view";
import { RoleBadge, buttonClass } from "@/components/ui";
import { GuideBanner } from "@/components/illustrations";

export default async function HeroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user, profile } = await requireSession();
  const { heroes, ranks } = await getRefs();
  const hero = heroes.find((h) => h.slug === slug) as Hero | undefined;
  if (!hero) notFound();

  const [guideRes, mineRes] = await Promise.all([
    supabase.from("guides").select("content, status").eq("kind", "hero").eq("hero_id", hero.id).maybeSingle(),
    supabase.from("match_heroes").select("matches!inner(result, user_id)").eq("hero_id", hero.id).eq("matches.user_id", user.id),
  ]);
  const guide = guideRes.data as { content: unknown; status: "draft" | "published" } | null;
  const games = (mineRes.data ?? []) as unknown as { matches: { result: "win" | "loss" } }[];
  const wins = games.filter((g) => g.matches.result === "win").length;
  const bracket = (await myBracket(supabase, user.id, profile?.rank_id, ranks)) ?? "gold";
  const meta = await getMeta(supabase, bracket);
  const metaRows = (meta?.rows ?? []).filter((r) => r.hero_id === hero.id);

  return (
    <>
      <Link href="/" className="text-sm text-muted hover:text-fg">
        ← Tous les héros
      </Link>
      <GuideBanner
        role={hero.roles[0]}
        eyebrow={guide ? "Fiche héros" : "Héros"}
        title={hero.name}
        portrait={hero.portrait_url}
        subtitle={
          <div className="flex flex-wrap items-center gap-2">
            {hero.roles.map((r) => (
              <RoleBadge key={r} role={r} />
            ))}
            {hero.roles.map((r) => (
              <Link key={`g-${r}`} href={`/guides/${roleSlug(r)}`} className="text-xs font-semibold text-fg-2 hover:text-accent">
                Guide du rôle {r} →
              </Link>
            ))}
          </div>
        }
      >
        <div className="rounded-xl border border-line bg-bg/60 px-4 py-2.5 backdrop-blur">
          <p className="eyebrow">Toi avec ce héros</p>
          <p className="font-display text-2xl font-bold tabular">
            {games.length ? `${Math.round((wins / games.length) * 100)} % · ${games.length} partie${games.length > 1 ? "s" : ""}` : "Pas encore joué"}
          </p>
        </div>
        {metaRows.length ? (
          <Link href={`/stats?vue=meta&rang=${bracket}`} className="rounded-xl border border-line bg-bg/60 px-4 py-2.5 backdrop-blur hover:border-accent/60">
            <p className="eyebrow">Tous les joueurs {bracketLabel(bracket)}</p>
            {metaRows.map((r) => (
              <p key={r.variant ?? "x"} className={`tabular text-sm ${r.matches < MIN_META_MATCHES ? "opacity-60" : ""}`}>
                {r.variant ? <span className="text-muted">{r.variant} · </span> : null}
                <strong className="font-display text-xl">{pct(r.win_rate, 0)}</strong> de victoires · pick {pct(r.pick_rate, 0)}
                {r.ban_rate !== null ? ` · ban ${pct(r.ban_rate, 0)}` : ""}
                {r.tier !== "Unrated" ? <span className="ml-1.5 rounded bg-surface-3 px-1.5 text-xs font-bold">{r.tier}</span> : null}
              </p>
            ))}
          </Link>
        ) : null}
        {guide?.status === "published" ? (
          <Link href={`/quiz/${hero.slug}`} className={buttonClass("primary")}>
            Quiz {hero.name}
          </Link>
        ) : null}
        {profile?.is_admin ? (
          <Link href={`/admin/guides/hero/${hero.slug}`} className={buttonClass("default")}>
            {guide ? "Modifier la fiche" : "Créer la fiche"}
          </Link>
        ) : null}
      </GuideBanner>

      {guide ? (
        <>
          {guide.status === "draft" ? <p className="rounded-lg bg-surface-3 px-3 py-2 text-sm text-fg-2">Brouillon : visible uniquement par les admins.</p> : null}
          <GuideView content={parseContent(guide.content)} heroes={heroes} role={hero.roles[0]} />
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
