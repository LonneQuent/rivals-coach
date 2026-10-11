import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getRefs, requireSession } from "@/lib/data";
import { getComps } from "@/lib/comps-data";
import { ROLES } from "@/lib/types";
import { EmptyState, HeroMark, PageHeader, buttonClass } from "@/components/ui";
import { DIAGRAM_LABEL } from "@/components/diagrams";

export const metadata: Metadata = { title: "Compos" };

export default async function AdminCompsPage() {
  const { supabase, profile } = await requireSession();
  if (!profile?.is_admin) return <EmptyState title="Réservé aux admins" body="Cette page sert à rédiger les compos d'équipe." />;
  const [{ heroes }, comps] = await Promise.all([getRefs(true), getComps(supabase)]);
  const bySlug = new Map(heroes.map((h) => [h.slug, h]));

  return (
    <>
      <Link href="/admin" className="text-sm text-muted hover:text-fg">
        ← Référentiels
      </Link>
      <PageHeader
        title="Compos d'équipe"
        subtitle="Classées par ordre d'affichage. Clique pour modifier."
        action={
          comps ? (
            <Link href="/admin/compos/nouvelle" className={buttonClass("primary")}>
              <Plus className="size-4" /> Nouvelle compo
            </Link>
          ) : undefined
        }
      />
      {comps === null ? (
        <EmptyState title="Table absente" body="Exécute la migration 0011_team_comps.sql dans l'éditeur SQL de Supabase, puis recharge la page." />
      ) : comps.length === 0 ? (
        <EmptyState title="Aucune compo" body="Crée la première avec le bouton « Nouvelle compo »." />
      ) : (
        <ul className="flex flex-col gap-2">
          {comps.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/compos/${c.slug}`} className="lift flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                <span className="w-8 text-xs tabular text-muted">{c.sort}</span>
                <span className="min-w-40 flex-1">
                  <span className="block font-display text-lg font-bold">{c.content.name}</span>
                  <span className="text-xs text-muted">
                    {DIAGRAM_LABEL[c.content.style]} · /{c.slug}
                  </span>
                </span>
                <span className="flex gap-1">
                  {[...c.content.heroes]
                    .sort((a, b) => ROLES.indexOf(a.role) - ROLES.indexOf(b.role))
                    .map((h) => {
                      const hero = bySlug.get(h.hero);
                      return <HeroMark key={h.hero} name={hero?.name ?? h.hero} role={h.role} size="sm" src={hero?.portrait_url} />;
                    })}
                </span>
                {c.status === "published" ? (
                  <span className="rounded-full bg-good-bg px-2 py-0.5 text-[11px] font-semibold text-good">Publiée</span>
                ) : (
                  <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[11px] font-semibold text-fg-2">Brouillon</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
