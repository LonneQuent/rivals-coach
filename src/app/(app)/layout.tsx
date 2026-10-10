import { cookies } from "next/headers";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { requireSession } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, user } = await requireSession();
  const collapsed = (await cookies()).get("sidebar")?.value === "collapsed";
  const pseudo = profile?.pseudo || user.email?.split("@")[0] || "Joueur";

  return (
    <div className="flex min-h-dvh">
      <Sidebar initialCollapsed={collapsed} isAdmin={!!profile?.is_admin} pseudo={pseudo} avatarUrl={profile?.avatar_url ?? null} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-bg/95 px-4 backdrop-blur md:hidden">
          <Link href="/" className="font-display text-lg font-bold uppercase tracking-wider">
            Rivals <span className="text-accent">Coach</span>
          </Link>
        </header>
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-28 pt-6 sm:px-6 md:pb-12">
          {!profile?.pseudo ? (
            <Link href="/profil" className="rounded-lg border border-accent/60 bg-accent/10 px-4 py-3 text-sm">
              Choisis ton <b>pseudo en jeu</b> dans ton profil pour que ton coach te reconnaisse.
            </Link>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
