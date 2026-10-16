import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { getRefs, requireSession } from "@/lib/data";
import { BRACKETS, MIN_META_MATCHES, bracketLabel, getMeta, isBracket, metaFor, myBracket, pct, type BracketKey } from "@/lib/meta";
import { FULL_MATCH_SELECT, statsByHero, statsByMap, statsByTag, statsVsEnemies, winrate, type FullMatch } from "@/lib/player-stats";
import { mapShortName, mapSlug } from "@/lib/maps";
import { ROLES, type Hero, type Role } from "@/lib/types";
import { EmptyState, HeroMark, PageHeader } from "@/components/ui";
import { MetaView } from "@/components/meta-view";

export const metadata: Metadata = { title: "Stats" };

type Search = { vue?: string; rang?: string; role?: string };

const n1 = (v: number | null, d = 1) => (v === null ? "–" : v.toLocaleString("fr-FR", { maximumFractionDigits: d, minimumFractionDigits: d }));
const n0 = (v: number | null) => (v === null ? "–" : Math.round(v).toLocaleString("fr-FR"));

export default async function StatsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const vue = sp.vue === "meta" ? "meta" : "moi";
  const { supabase, user, profile } = await requireSession();
  const refs = await getRefs();

  // Rang de comparaison : celui choisi, sinon celui du profil, sinon celui de la dernière partie classée
  const mine = await myBracket(supabase, user.id, profile?.rank_id, refs.ranks);
  const bracket: BracketKey = isBracket(sp.rang) ? sp.rang : (mine ?? "gold");
  const meta = await getMeta(supabase, bracket);

  const tabs = [
    { key: "moi", label: "Mes stats" },
    { key: "meta", label: "Méta par rang" },
  ];
  const href = (patch: Partial<Search>) => {
    const q = new URLSearchParams({ ...(vue === "meta" ? { vue } : {}), rang: bracket, ...(sp.role ? { role: sp.role } : {}), ...patch } as Record<string, string>);
    for (const [k, v] of [...q.entries()]) if (!v) q.delete(k);
    return `/stats?${q.toString()}`;
  };

  return (
    <>
      <PageHeader title="Stats" subtitle="Tes stats perso, comparées aux joueurs de ton rang, et la méta des héros." />
      <nav className="flex gap-1 border-b border-line" aria-label="Vues">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={href({ vue: t.key === "meta" ? "meta" : "" })}
            aria-current={vue === t.key ? "page" : undefined}
            className={clsx("-mb-px border-b-2 px-3 py-2 text-sm font-semibold", vue === t.key ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg")}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <section className="flex flex-col gap-2" aria-label="Rang de comparaison">
        <p className="eyebrow">
          Rang de comparaison{mine ? <span className="font-normal normal-case tracking-normal text-muted"> · le tien : {bracketLabel(mine)}</span> : null}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {BRACKETS.map((b) => (
            <Link
              key={b.key}
              href={href({ rang: b.key })}
              aria-current={bracket === b.key ? "true" : undefined}
              className={clsx(
                "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                bracket === b.key ? "border-accent bg-accent/15 text-fg" : "border-line text-fg-2 hover:border-accent/60 hover:text-fg",
              )}
            >
              {b.label}
            </Link>
          ))}
        </div>
        {!mine ? (
          <p className="text-xs text-muted">
            Renseigne ton rang dans{" "}
            <Link href="/profil" className="font-semibold text-accent hover:underline">
              ton profil
            </Link>{" "}
            (ou dans tes parties classées) pour que la comparaison se cale dessus.
          </p>
        ) : null}
      </section>

      {vue === "meta" ? <MetaView meta={meta} bracket={bracket} heroes={refs.heroes} role={ROLES.includes(sp.role as Role) ? (sp.role as Role) : null} href={href} /> : <MyStats userId={user.id} meta={meta} bracket={bracket} />}
    </>
  );
}

async function MyStats({ userId, meta, bracket }: { userId: string; meta: Awaited<ReturnType<typeof getMeta>>; bracket: BracketKey }) {
  const { supabase } = await requireSession();
  const refs = await getRefs();
  const { data } = await supabase.from("matches").select(FULL_MATCH_SELECT).eq("user_id", userId).order("played_at", { ascending: false }).limit(300);
  const matches = (data ?? []) as unknown as FullMatch[];
  if (!matches.length) {
    return <EmptyState title="Pas encore de stats" body="Saisis tes premières parties : winrate par héros, par carte et comparaison avec ton rang apparaîtront ici." href="/saisir" cta="Saisir une partie" />;
  }
  // Compo adverse (migration 0014) : absente = pas de section
  const opp = await supabase.from("match_opponents").select("match_id, hero_id").in("match_id", matches.map((m) => m.id));
  const enemies = new Map<string, number[]>();
  for (const r of (opp.error ? [] : (opp.data ?? [])) as { match_id: string; hero_id: number }[]) enemies.set(r.match_id, [...(enemies.get(r.match_id) ?? []), r.hero_id]);

  const heroById = new Map(refs.heroes.map((h) => [h.id, h]));
  const wins = matches.filter((m) => m.result === "win").length;
  const overall = (wins / matches.length) * 100;
  const byHero = statsByHero(matches);
  const byMap = statsByMap(matches);
  const vs = statsVsEnemies(matches, enemies).filter((t) => t.games >= 3);
  const tags = statsByTag(matches.slice(0, 30));
  const tagById = new Map(refs.tags.map((t) => [t.id, t]));
  const goodTags = tags.filter((t) => tagById.get(t.id)?.kind === "strength");
  const badTags = tags.filter((t) => tagById.get(t.id) && tagById.get(t.id)?.kind !== "strength");

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Parties", String(matches.length)],
          ["Winrate", pct(overall, 0)],
          ["Héros joués", String(new Set(byHero.map((h) => h.hero_id)).size)],
          ["Cartes renseignées", `${matches.filter((m) => m.map_id).length}/${matches.length}`],
        ].map(([label, value]) => (
          <div key={label} className="card py-3">
            <p className="eyebrow">{label}</p>
            <p className="font-display text-2xl font-bold tabular">{value}</p>
          </div>
        ))}
      </div>

      <section className="card flex flex-col gap-3">
        <div>
          <h2 className="text-lg uppercase tracking-wide">Tes héros face à ton rang</h2>
          <p className="text-sm text-muted">
            Ton winrate sur chaque héros, comparé à celui de tous les joueurs {bracketLabel(bracket)} sur ce héros.
            {meta ? "" : " Les stats communautaires ne sont pas encore chargées : la colonne de comparaison reste vide."}
          </p>
        </div>
        <ul className="flex flex-col divide-y divide-line">
          {byHero.map((h) => {
            const hero = heroById.get(h.hero_id);
            if (!hero) return null;
            const mine = winrate(h);
            const ref = meta ? metaFor(meta.rows, h.hero_id, h.role) : undefined;
            const diff = mine !== null && ref ? mine - ref.win_rate : null;
            const few = h.games < 5;
            const keyStat = h.role === "Strategist" ? ["Soins/10", n0(h.healing10)] : h.role === "Vanguard" ? ["Bloqués/10", n0(h.blocked10)] : ["Dégâts/10", n0(h.damage10)];
            return (
              <li key={`${h.hero_id}|${h.role}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-2.5 sm:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
                <Link href={`/heros/${hero.slug}`} className="flex min-w-0 items-center gap-2.5 hover:text-accent">
                  <HeroMark name={hero.name} role={h.role} size="md" src={hero.portrait_url} />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{hero.name}</span>
                    <span className="block text-xs text-muted">
                      {h.games} partie{h.games > 1 ? "s" : ""}
                      {hero.roles.length > 1 ? ` · ${h.role}` : ""}
                    </span>
                  </span>
                </Link>
                <div className="text-right sm:text-left">
                  <p className="eyebrow hidden sm:block">Toi</p>
                  <p className={clsx("font-display text-xl font-bold tabular", few && "opacity-60")}>{pct(mine, 0)}</p>
                </div>
                <div className="col-span-2 flex items-center gap-3 text-sm sm:col-span-1 sm:block">
                  <p className="eyebrow hidden sm:block">{bracketLabel(bracket)}</p>
                  <p className="tabular text-fg-2">
                    {ref ? pct(ref.win_rate) : "–"}
                    {diff !== null ? (
                      <span className={clsx("ml-2 rounded-full px-1.5 py-0.5 text-xs font-semibold", few ? "bg-surface-3 text-muted" : diff >= 3 ? "bg-good-bg text-good" : diff <= -3 ? "bg-bad-bg text-bad" : "bg-surface-3 text-fg-2")}>
                        {diff >= 0 ? "+" : "−"}
                        {Math.abs(diff).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} pts
                      </span>
                    ) : null}
                  </p>
                  {few ? <p className="text-xs text-muted">peu de parties</p> : ref && ref.matches < MIN_META_MATCHES ? <p className="text-xs text-muted">peu de données à ce rang</p> : null}
                </div>
                <div className="col-span-2 text-sm text-fg-2 sm:col-span-1">
                  <p className="eyebrow hidden sm:block">Tes stats</p>
                  <p className="tabular">
                    KDA {n1(h.kda, 2)} · {keyStat[0]} {keyStat[1]}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        {meta ? (
          <p className="text-xs text-muted">
            Stats communautaires {meta.season}, relevées le {new Date(meta.captured_on).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            {meta.source ? ` (${meta.source})` : ""}. Pour le KDA, les dégâts ou les soins, on n&apos;a pas encore de moyennes par rang : seuls winrate, pick rate et ban rate sont disponibles.
          </p>
        ) : null}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card flex flex-col gap-3">
          <h2 className="text-lg uppercase tracking-wide">Par carte</h2>
          {byMap.length ? (
            <ul className="flex flex-col gap-2">
              {byMap.map((t) => {
                const map = refs.maps.find((m) => m.id === t.id);
                if (!map) return null;
                const wr = winrate(t) ?? 0;
                return (
                  <li key={t.id}>
                    <Link href={`/cartes/${mapSlug(map.name)}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 text-sm hover:text-accent">
                      <span className="truncate font-semibold">{mapShortName(map.name)}</span>
                      <span className="tabular text-fg-2">
                        {pct(wr, 0)} · {t.games} partie{t.games > 1 ? "s" : ""}
                      </span>
                      <span className="col-span-2 mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3" aria-hidden>
                        <span className={clsx("block h-full rounded-full", wr >= 50 ? "bg-good" : "bg-bad")} style={{ width: `${Math.max(4, wr)}%` }} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted">Renseigne la carte dans tes saisies pour voir où tu gagnes le plus.</p>
          )}
        </section>

        <section className="card flex flex-col gap-3">
          <h2 className="text-lg uppercase tracking-wide">Contre la compo adverse</h2>
          {vs.length ? (
            <>
              <p className="text-sm text-muted">Ton winrate quand ce héros est en face (au moins 3 parties). Ton winrate global : {pct(overall, 0)}.</p>
              <VsList title="Tes bêtes noires" items={[...vs].sort((a, b) => (winrate(a) ?? 0) - (winrate(b) ?? 0)).slice(0, 5)} heroById={heroById} overall={overall} />
              <VsList title="Tes proies" items={[...vs].sort((a, b) => (winrate(b) ?? 0) - (winrate(a) ?? 0)).slice(0, 5)} heroById={heroById} overall={overall} />
            </>
          ) : (
            <p className="text-sm text-muted">Indique la compo adverse dans tes saisies (champ facultatif) : dès 3 parties contre un même héros, tu verras contre qui tu gagnes et contre qui tu perds.</p>
          )}
        </section>
      </div>

      {goodTags.length || badTags.length ? (
        <section className="card flex flex-col gap-3">
          <h2 className="text-lg uppercase tracking-wide">Sur tes 30 dernières parties</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <TagList title="Ce qui a bien marché" tone="good" items={goodTags} names={tagById} />
            <TagList title="Ce qui a coincé" tone="bad" items={badTags} names={tagById} />
          </div>
        </section>
      ) : null}
    </>
  );
}

function VsList({ title, items, heroById, overall }: { title: string; items: { id: number; games: number; wins: number }[]; heroById: Map<number, Hero>; overall: number }) {
  return (
    <div>
      <p className="eyebrow mb-1.5">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((t) => {
          const h = heroById.get(t.id);
          if (!h) return null;
          const wr = winrate(t) ?? 0;
          return (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <HeroMark name={h.name} role={h.roles[0]} size="sm" src={h.portrait_url} />
              <span className="min-w-0 flex-1 truncate font-semibold">{h.name}</span>
              <span className={clsx("tabular font-semibold", wr >= overall + 5 ? "text-good" : wr <= overall - 5 ? "text-bad" : "text-fg-2")}>{pct(wr, 0)}</span>
              <span className="tabular w-16 text-right text-xs text-muted">{t.games} parties</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TagList({ title, tone, items, names }: { title: string; tone: "good" | "bad"; items: { id: number; games: number; wins: number }[]; names: Map<number, { name: string }> }) {
  return (
    <div>
      <p className={clsx("eyebrow mb-1.5", tone === "good" ? "text-good" : "text-bad")}>{title}</p>
      {items.length ? (
        <ul className="flex flex-col gap-1.5">
          {items.slice(0, 6).map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <span className="min-w-0 flex-1 truncate">{names.get(t.id)?.name}</span>
              <span className="tabular text-xs text-muted">
                {t.games} fois · {pct(winrate(t), 0)} de victoires
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Rien de noté pour l&apos;instant.</p>
      )}
    </div>
  );
}
