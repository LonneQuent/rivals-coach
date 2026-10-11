import Link from "next/link";
import { getRefs, requireSession } from "@/lib/data";
import { ROLES } from "@/lib/types";
import { roleSlug } from "@/lib/guides";
import { HeroMark, RoleDot, buttonClass } from "@/components/ui";
import { RoleEmblem } from "@/components/illustrations";
import { MascotTip } from "@/components/mascot";
import { Rich } from "@/components/guide-view";
import { tipOfTheDay } from "@/lib/tips";

export default async function HomePage() {
  const { supabase, user, profile } = await requireSession();
  const [{ heroes }, recent, guidesRes] = await Promise.all([
    getRefs(),
    supabase.from("matches").select("id, result, played_at").eq("user_id", user.id).order("played_at", { ascending: false }).limit(10),
    supabase.from("guides").select("kind, hero_id, role").eq("status", "published"),
  ]);
  const guides = (guidesRes.data ?? []) as { kind: "hero" | "role"; hero_id: number | null; role: string | null }[];
  const heroGuide = new Set(guides.filter((g) => g.kind === "hero").map((g) => g.hero_id));
  const roleGuide = new Set(guides.filter((g) => g.kind === "role").map((g) => g.role));
  const last = (recent.data ?? []) as { id: string; result: "win" | "loss"; played_at: string }[];
  const wins = last.filter((m) => m.result === "win").length;

  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">Salut {profile?.pseudo || "toi"}</p>
          <h1 className="text-3xl uppercase tracking-wide sm:text-4xl">Guides des héros</h1>
          <p className="mt-1 max-w-xl text-sm text-fg-2">Choisis un héros pour voir ses forces, ses counters et les tips de top players.</p>
        </div>
        <div className="card flex items-center gap-4 py-3">
          {last.length ? (
            <>
              <div>
                <p className="eyebrow">10 dernières</p>
                <p className="font-display text-2xl font-bold tabular">
                  {wins}V – {last.length - wins}D
                </p>
              </div>
              <div className="flex gap-1" aria-label="Résultats récents, du plus récent au plus ancien">
                {last.map((m) => (
                  <span key={m.id} title={m.result === "win" ? "Victoire" : "Défaite"} className={m.result === "win" ? "h-6 w-1.5 rounded-full bg-good" : "h-6 w-1.5 rounded-full bg-bad"} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-fg-2">Aucune partie saisie pour l&apos;instant.</p>
          )}
          <Link href="/saisir" className={buttonClass("primary")}>
            Saisir
          </Link>
        </div>
      </section>

      <MascotTip title="Le conseil du Prof" className="max-w-2xl">
        <Rich text={tipOfTheDay()} />
      </MascotTip>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Guides de rôle">
        {ROLES.map((role) => (
          <Link
            key={role}
            href={`/guides/${roleSlug(role)}`}
            className="card lift flex items-center gap-3 py-3"
          >
            <RoleEmblem role={role} className="size-11 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-bold uppercase tracking-wide">Jouer {role}</p>
              <p className="text-xs text-muted">{roleGuide.has(role) ? "Guide du rôle disponible" : "Guide à venir"}</p>
            </div>
            <span aria-hidden className="text-muted">→</span>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {ROLES.map((role) => {
          const list = heroes.filter((h) => h.roles.includes(role));
          return (
            <section key={role} className="flex min-w-0 flex-col gap-3">
              <h2 className="flex items-center gap-2 text-lg uppercase tracking-wide">
                <RoleDot role={role} />
                {role}
                <span className="text-sm font-semibold text-muted">{list.length}</span>
              </h2>
              <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {list.map((h) => (
                  <li key={`${role}-${h.id}`}>
                    <Link href={`/heros/${h.slug}`} className="lift flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2">
                      <HeroMark name={h.name} role={role} size="sm" src={h.portrait_url} />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{h.name}</span>
                      {heroGuide.has(h.id) ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">Fiche</span> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
