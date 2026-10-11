import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";
import { Mascot } from "@/components/mascot";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; reason?: string }> }) {
  const { next, error, reason } = await searchParams;
  const { user } = await getUser();
  if (user) redirect(safeNext(next));

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-4">
          <Mascot className="size-24" bob />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-display text-3xl font-bold uppercase tracking-wider">
              Rivals <span className="text-accent">Coach</span>
            </p>
            <p className="text-sm text-fg-2">Saisis tes parties, suis ta progression, sache sur quoi bosser cette semaine.</p>
          </div>
        </div>
        {error ? (
          <p role="alert" className="rounded-lg bg-bad-bg px-3 py-2 text-sm text-bad">
            La connexion a échoué. Réessaie, ou utilise l&apos;autre méthode.
            {reason ? <span className="mt-1 block text-xs opacity-80">Détail : {reason}</span> : null}
          </p>
        ) : null}
        <LoginForm next={safeNext(next)} />
      </div>
    </main>
  );
}

/** N'accepte qu'un chemin interne, pour éviter les redirections vers un autre site. */
function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
