import type { Metadata } from "next";
import Link from "next/link";
import { getRefs, requireSession } from "@/lib/data";
import { EmptyState, PageHeader } from "@/components/ui";
import { PortraitGallery } from "./gallery";

export const metadata: Metadata = { title: "Portraits" };

export default async function PortraitsPage() {
  const { profile } = await requireSession();
  if (!profile?.is_admin) return <EmptyState title="Réservé aux admins" body="Cette page sert à trier les images envoyées pour les portraits." />;
  const { heroes } = await getRefs(true);
  return (
    <>
      <Link href="/admin?t=heroes" className="text-sm text-muted hover:text-fg">
        ← Héros
      </Link>
      <PageHeader
        title="Portraits"
        subtitle="Toutes les images envoyées, pré-triées d'après leur format. Garde les portraits, assigne-les au bon héros, supprime le reste."
      />
      <PortraitGallery heroes={heroes} />
    </>
  );
}
