import type { Metadata } from "next";
import { PageHeader, Soon } from "@/components/ui";

export const metadata: Metadata = { title: "Stats" };

export default function StatsPage() {
  return (
    <>
      <PageHeader title="Stats" subtitle="Tes stats perso et la méta des héros." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Soon title="Mes stats" items={["Winrate par rang, héros, rôle et carte", "KDA, dégâts, soins et dégâts bloqués par 10 min", "Évolution du rang et comparaison période contre période"]} />
        <Soon title="Méta des héros" items={["Winrate, pick rate et ban rate par saison, mode et rang", "Compos méta et team-ups", "Aide au pick : tes alliés ont pris X et Y, ton pick tient-il la route ?"]} />
      </div>
    </>
  );
}
