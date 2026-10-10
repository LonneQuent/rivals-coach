import type { Metadata } from "next";
import Link from "next/link";
import { getRefs, requireSession } from "@/lib/data";
import { roleSlug } from "@/lib/guides";
import { ROLES } from "@/lib/types";
import { EmptyState, HeroMark, PageHeader, RoleDot } from "@/components/ui";

export const metadata: Metadata = { title: "Guides" };

export default async function AdminGuidesPage() {
  const { supabase, profile } = await requireSession();
  if (!profile?.is_admin) return <EmptyState title="Réservé aux admins" body="Cette page sert à rédiger les guides des héros et des rôles." />;
  const [{ heroes }, res] = await Promise.all([getRefs(true), supabase.from("guides").select("kind, hero_id, role, status, updated_at")]);
  const rows = (res.data ?? []) as { kind: string; hero_id: number | null; role: string | null; status: "draft" | "published"; updated_at: string }[];
  const heroStatus = new Map(rows.filter((r) => r.kind === "hero").map((r) => [r.hero_id, r.status]));
  const roleStatus = new Map(rows.filter((r) => r.kind === "role").map((r) => [r.role, r.status]));

  const badge = (s?: "draft" | "published") =>
    s === "published" ? (
      <span className="rounded-full bg-good-bg px-2 py-0.5 text-[11px] font-semibold text-good">Publié</span>
    ) : s === "draft" ? (
      <span className="rounded-full bg-surface-3 px-2 py-0.5 text-[11px] font-semibold text-fg-2">Brouillon</span>
    ) : (
      <span className="text-[11px] text-muted">À rédiger</span>
    );

  return (
    <>
      <Link href="/admin" className="text-sm text-muted hover:text-fg">
        ← Référentiels
      </Link>
      <PageHeader title="Guides" subtitle={`${heroStatus.size} fiche${heroStatus.size > 1 ? "s" : ""} héros et ${roleStatus.size} guide${roleStatus.size > 1 ? "s" : ""} de rôle. Clique pour rédiger ou modifier.`} />
      <section className="grid gap-3 sm:grid-cols-3">
        {ROLES.map((r) => (
          <Link key={r} href={`/admin/guides/role/${roleSlug(r)}`} className="card lift flex items-center gap-3 py-3">
            <RoleDot role={r} className="size-3" />
            <span className="flex-1 font-display text-lg font-bold uppercase">Rôle {r}</span>
            {badge(roleStatus.get(r))}
          </Link>
        ))}
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        {ROLES.map((role) => (
          <section key={role} className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-lg uppercase tracking-wide">
              <RoleDot role={role} /> {role}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {heroes
                .filter((h) => h.roles[0] === role)
                .map((h) => (
                  <li key={h.id}>
                    <Link href={`/admin/guides/hero/${h.slug}`} className="lift flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2">
                      <HeroMark name={h.name} role={role} size="sm" src={h.portrait_url} />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{h.name}</span>
                      {badge(heroStatus.get(h.id))}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
