import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRefs, requireSession } from "@/lib/data";
import { getComps } from "@/lib/comps-data";
import { EmptyState, PageHeader } from "@/components/ui";
import { CompEditor } from "./comp-editor";

export const metadata: Metadata = { title: "Éditer une compo" };

export default async function EditCompPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, profile } = await requireSession();
  if (!profile?.is_admin) return <EmptyState title="Réservé aux admins" body="Seuls les admins peuvent rédiger les compos." />;
  const [{ heroes }, comps] = await Promise.all([getRefs(true), getComps(supabase)]);
  if (comps === null) return <EmptyState title="Table absente" body="Exécute la migration 0011_team_comps.sql dans Supabase." />;

  const isNew = slug === "nouvelle";
  const comp = isNew ? null : comps.find((c) => c.slug === slug);
  if (!isNew && !comp) notFound();

  return (
    <>
      <Link href="/admin/compos" className="text-sm text-muted hover:text-fg">
        ← Toutes les compos
      </Link>
      <PageHeader
        title={comp ? `Compo · ${comp.content.name}` : "Nouvelle compo"}
        subtitle="Une idée par ligne. Héros : « Nom | sa mission ». Remplaçants : « Nom | remplace qui | pourquoi »."
        action={
          comp ? (
            <Link href={`/compos/${comp.slug}`} className="text-sm font-semibold text-muted hover:text-accent">
              Voir la page →
            </Link>
          ) : undefined
        }
      />
      <CompEditor
        comp={comp ?? null}
        heroes={heroes.map((h) => ({ slug: h.slug, name: h.name, roles: h.roles }))}
        others={comps.filter((c) => c.slug !== slug).map((c) => ({ slug: c.slug, name: c.content.name }))}
        nextSort={(comps.at(-1)?.sort ?? 0) + 10}
      />
    </>
  );
}
