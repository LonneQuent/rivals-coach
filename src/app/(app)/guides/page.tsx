import type { Metadata } from "next";
import { getRefs, requireSession } from "@/lib/data";
import type { DirectoryHero } from "@/components/guide-directory";
import { GuidesView } from "@/components/guides-view";

export const metadata: Metadata = { title: "Guides" };

const NEW_HERO_DAYS = 45;

export default async function GuidesPage() {
  const { supabase, user } = await requireSession();
  const [refs, guidesRes, picksRes, newRes] = await Promise.all([
    getRefs(),
    supabase.from("guides").select("kind, hero_id, role, difficulty:content->difficulty, tags:content->tags").eq("status", "published").in("kind", ["hero", "role"]),
    supabase.from("player_heroes").select("hero_id, kind").eq("user_id", user.id),
    supabase.from("heroes").select("id").gte("created_at", new Date(Date.now() - NEW_HERO_DAYS * 864e5).toISOString()),
  ]);
  const guides = (guidesRes.data ?? []) as unknown as { kind: "hero" | "role"; hero_id: number | null; role: string | null; difficulty: number | null; tags: string[] | null }[];
  const guideOf = new Map(guides.filter((g) => g.kind === "hero" && g.hero_id).map((g) => [g.hero_id as number, g]));
  const roleGuides = guides.filter((g) => g.kind === "role" && g.role).map((g) => g.role as string);
  const mine = new Map(((picksRes.data ?? []) as { hero_id: number; kind: "main" | "train" }[]).map((p) => [p.hero_id, p.kind]));
  const fresh = (newRes.data ?? []) as { id: number }[];
  // Un référentiel tout neuf date tous ses héros du même jour : on ne les marque pas comme nouveaux
  const newIds = new Set(fresh.length <= 3 ? fresh.map((h) => h.id) : []);

  const heroes: DirectoryHero[] = refs.heroes.map((h) => {
    const g = guideOf.get(h.id);
    return { id: h.id, slug: h.slug, name: h.name, roles: h.roles, portrait_url: h.portrait_url, hasGuide: !!g, difficulty: g?.difficulty ?? 0, tags: g?.tags ?? [], mine: mine.get(h.id) ?? null, isNew: newIds.has(h.id) };
  });

  return <GuidesView heroes={heroes} roleGuides={roleGuides} />;
}
