import type { Metadata } from "next";
import { getRefs, requireSession } from "@/lib/data";
import { EmptyState, PageHeader } from "@/components/ui";
import { RefEditor } from "./ref-editor";
import { BulkPortraits } from "./bulk-portraits";

export const metadata: Metadata = { title: "Admin" };

const TABS = ["heroes", "maps", "game_modes", "queues", "ranks", "error_tags"] as const;
const LABELS: Record<(typeof TABS)[number], string> = {
  heroes: "Héros",
  maps: "Cartes",
  game_modes: "Types de mode",
  queues: "Files",
  ranks: "Rangs",
  error_tags: "Erreurs",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { profile } = await requireSession();
  if (!profile?.is_admin) {
    return <EmptyState title="Réservé aux admins" body="Cette page sert à gérer les héros, cartes et modes. Demande à l'organisateur si tu dois y accéder." />;
  }
  const { t } = await searchParams;
  const tab = TABS.find((x) => x === t) ?? "heroes";
  const refs = await getRefs(true);

  const rows = {
    heroes: refs.heroes,
    maps: refs.maps,
    game_modes: refs.gameModes,
    queues: refs.queues,
    ranks: refs.ranks,
    error_tags: refs.tags,
  }[tab] as unknown as Record<string, unknown>[];

  return (
    <>
      <PageHeader title="Référentiels" subtitle="Le roster, les cartes et les modes changent avec les saisons : tout se met à jour ici. On désactive plutôt que de supprimer, pour garder l'historique intact." />
      <nav className="flex gap-1 overflow-x-auto border-b border-line" aria-label="Référentiels">
        {TABS.map((x) => (
          <a
            key={x}
            href={`/admin?t=${x}`}
            aria-current={x === tab ? "page" : undefined}
            className={`whitespace-nowrap border-b-2 px-3 py-2 font-display text-sm font-semibold uppercase tracking-wider ${x === tab ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg"}`}
          >
            {LABELS[x]}
          </a>
        ))}
        <a href="/admin/guides" className="whitespace-nowrap border-b-2 border-transparent px-3 py-2 font-display text-sm font-semibold uppercase tracking-wider text-muted hover:text-fg">
          Guides
        </a>
      </nav>
      {tab === "heroes" ? <BulkPortraits heroes={refs.heroes} /> : null}
      <RefEditor key={tab} table={tab} rows={rows} gameModes={refs.gameModes.map((m) => ({ id: m.id, name: m.name }))} />
    </>
  );
}
