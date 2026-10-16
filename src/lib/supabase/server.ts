import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Appelé depuis un Server Component : le middleware rafraîchit déjà la session.
        }
      },
    },
  });
}

export type SessionUser = { id: string; email: string | null };

/**
 * Utilisateur connecté ou null.
 * getClaims vérifie la signature du jeton en local (clés JWKS mises en cache) : pas d'aller-retour
 * vers le serveur Auth à chaque rendu, contrairement à getUser. Avec l'ancienne clé secrète partagée,
 * il retombe sur un appel réseau, d'où l'intérêt de passer aux « JWT Signing Keys » dans Supabase.
 */
export async function getUser(): Promise<{ supabase: Awaited<ReturnType<typeof createClient>>; user: SessionUser | null }> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const c = data?.claims;
  return { supabase, user: c?.sub ? { id: c.sub, email: typeof c.email === "string" ? c.email : null } : null };
}
