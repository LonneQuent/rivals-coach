import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { parseContent, roleFromSlug, roleSlug } from "@/lib/guides";
import { GENERAL_GUIDES, mapShortName, mapSlug } from "@/lib/maps";
import { EmptyState, PageHeader } from "@/components/ui";
import { GuideEditor } from "./guide-editor";

export const metadata: Metadata = { title: "Éditer un guide" };

export default async function EditGuidePage({ params }: { params: Promise<{ kind: string; key: string }> }) {
  const { kind, key } = await params;
  const { supabase, profile } = await requireSession();
  if (!profile?.is_admin) return <EmptyState title="Réservé aux admins" body="Seuls les admins peuvent rédiger les guides." />;
  const { heroes, maps } = await getRefs(true);

  type Role = NonNullable<ReturnType<typeof roleFromSlug>>;
  let target:
    | { kind: "hero"; hero_id: number; label: string; viewHref: string }
    | { kind: "role"; role: Role; label: string; viewHref: string }
    | { kind: "map"; map_id: number; label: string; viewHref: string }
    | { kind: "general"; slug: string; label: string; viewHref: string };
  if (kind === "map") {
    const m = maps.find((x) => mapSlug(x.name) === key);
    if (!m) notFound();
    target = { kind: "map", map_id: m.id, label: mapShortName(m.name), viewHref: `/cartes/${key}` };
  } else if (kind === "general") {
    const g = GENERAL_GUIDES.find((x) => x.slug === key);
    if (!g) notFound();
    target = { kind: "general", slug: g.slug, label: g.title, viewHref: `/guides/${g.slug}` };
  } else if (kind === "hero") {
    const h = heroes.find((x) => x.slug === key);
    if (!h) notFound();
    target = { kind: "hero", hero_id: h.id, label: h.name, viewHref: `/heros/${h.slug}` };
  } else if (kind === "role") {
    const r = roleFromSlug(key);
    if (!r) notFound();
    target = { kind: "role", role: r, label: `Rôle ${r}`, viewHref: `/guides/${roleSlug(r)}` };
  } else notFound();

  const q = supabase.from("guides").select("content, status").eq("kind", target.kind);
  const { data } = await (
    target.kind === "hero"
      ? q.eq("hero_id", target.hero_id)
      : target.kind === "role"
        ? q.eq("role", target.role)
        : target.kind === "map"
          ? q.eq("map_id", target.map_id)
          : q.eq("slug", target.slug)
  ).maybeSingle();
  const existing = data as { content: unknown; status: "draft" | "published" } | null;

  return (
    <>
      <Link href="/admin/guides" className="text-sm text-muted hover:text-fg">
        ← Tous les guides
      </Link>
      <PageHeader
        title={`Guide · ${target.label}`}
        subtitle="Une idée par ligne dans chaque section. Pour les counters et synergies : « Nom du héros | explication »."
        action={
          <Link href={target.viewHref} className="text-sm font-semibold text-muted hover:text-accent">
            Voir la page →
          </Link>
        }
      />
      <GuideEditor
        target={
          target.kind === "hero"
            ? { kind: "hero", hero_id: target.hero_id }
            : target.kind === "role"
              ? { kind: "role", role: target.role }
              : target.kind === "map"
                ? { kind: "map", map_id: target.map_id }
                : { kind: "general", slug: target.slug }
        }
        initial={parseContent(existing?.content)}
        initialStatus={existing?.status ?? "draft"}
        heroes={heroes.map((h) => ({ slug: h.slug, name: h.name }))}
        viewHref={target.viewHref}
      />
    </>
  );
}
