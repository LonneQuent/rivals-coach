import type { Metadata } from "next";
import { PageHeader, Soon } from "@/components/ui";

export const metadata: Metadata = { title: "Questions" };

export default function QuestionsPage() {
  return (
    <>
      <PageHeader title="Questions" subtitle="Pose tes questions à ton coach." />
      <Soon title="Questions au coach" items={["Écrire une question liée à une partie ou à un héros", "Le coach est prévenu sur Discord", "Réponse directement dans l'app"]} />
    </>
  );
}
