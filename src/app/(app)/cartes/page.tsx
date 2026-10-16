import type { Metadata } from "next";
import Link from "next/link";
import { Map as MapIcon } from "lucide-react";
import { getRefs, requireSession } from "@/lib/data";
import { mapShortName, mapSlug, mapZone } from "@/lib/maps";
import { PageHeader } from "@/components/ui";
import { MascotTip } from "@/components/mascot";

export const metadata: Metadata = { title: "Cartes" };

export default async function MapsPage() {
  const { supabase } = await requireSession();
  const { maps, gameModes } = await getRefs();
  const { data, error } = await supabase.from("guides").select("map_id, status").eq("kind", "map");
  const withGuide = new Set(error ? [] : ((data ?? []) as { map_id: number }[]).map((g) => g.map_id));
  const modes = [...gameModes].sort((a, b) => a.sort - b.sort);

  return (
    <>
      <PageHeader title="Cartes" subtitle="Où se placer, quels chokes tenir, quelles routes prendre : un guide par carte." />
      <MascotTip title="Le principe de toutes les cartes" pose="think" className="max-w-3xl">
        <p>
          Bats-toi depuis les <strong className="text-fg">couverts et les coins</strong>, jamais au milieu à découvert. Pendant que tes tanks tiennent le main, prends un{" "}
          <strong className="text-fg">angle différent</strong> : un seul pick, et le fight bascule.
        </p>
      </MascotTip>
      {modes.map((mode) => {
        const list = maps.filter((m) => m.game_mode_id === mode.id).sort((a, b) => mapShortName(a.name).localeCompare(mapShortName(b.name), "fr"));
        if (!list.length) return null;
        return (
          <section key={mode.id} className="flex flex-col gap-3">
            <h2 className="text-lg uppercase tracking-wide">{mode.name}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((m) => {
                const has = withGuide.has(m.id);
                const body = (
                  <>
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${has ? "bg-accent/15 text-accent" : "bg-surface-3 text-muted"}`} aria-hidden>
                      <MapIcon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold uppercase tracking-wide">{mapShortName(m.name)}</span>
                      <span className="block text-xs text-muted">{mapZone(m.name)}</span>
                    </span>
                    {has ? <span className="text-xs font-semibold text-accent">Guide →</span> : <span className="text-xs text-muted">À venir</span>}
                  </>
                );
                return (
                  <li key={m.id}>
                    {has ? (
                      <Link href={`/cartes/${mapSlug(m.name)}`} className="card lift flex items-center gap-3 py-3">
                        {body}
                      </Link>
                    ) : (
                      <div className="card flex items-center gap-3 py-3 opacity-70">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}
