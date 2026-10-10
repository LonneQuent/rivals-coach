# Rivals Coach

App web de suivi de stats et de coaching pour Marvel Rivals : saisie des parties, dashboard, diagnostic de coaching, guides des héros et méta.

**Stack** : Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Postgres, Auth, RLS) · Vercel

## Mise en route

### 1. Base de données (une seule fois)

Dans Supabase → **SQL Editor** → *New query*, colle puis exécute (**Run**) dans cet ordre :

1. `supabase/migrations/0001_init.sql` : tables, règles d'accès (RLS), fonctions
2. `supabase/migrations/0002_seed.sql` : héros, cartes, modes, rangs de départ

Chaque nouvelle migration (`0003_…`, `0004_…`) s'exécute de la même façon, dans l'ordre des numéros.

### 2. Connexion

- **Discord** : Supabase → Authentication → Sign In / Providers → Discord (Client ID + Client Secret de l'application Discord). Dans le portail Discord, l'URL de redirection est `https://fvwooqkyyrqkzriqkibt.supabase.co/auth/v1/callback`.
- **URLs autorisées** : Supabase → Authentication → URL Configuration
  - *Site URL* : l'adresse Vercel de l'app (ex. `https://rivals-coach.vercel.app`)
  - *Redirect URLs* : `https://<adresse-vercel>/auth/callback` et `http://localhost:3000/auth/callback`

### 3. Devenir admin

Connecte-toi une première fois à l'app, puis dans le SQL Editor :

```sql
-- repère ton compte
select id, email, created_at from auth.users order by created_at;
-- donne-toi les droits admin (remplace l'id)
update public.profiles set is_admin = true where id = 'TON-ID';
```

### 4. Variables d'environnement (Vercel → Settings → Environment Variables)

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé *publishable* Supabase |

Aucune clé secrète (service_role, secret Discord) ne doit être ajoutée au code ni à ces variables publiques.

### Développement local

```bash
cp .env.example .env.local   # puis renseigne la clé publishable
npm install
npm run dev
```

## Modèle d'accès

- Chaque joueur ne voit et ne modifie que ses propres parties.
- Un joueur peut autoriser un coach (`coach_links`) : le coach lit alors ses parties, sans pouvoir les modifier.
- Les référentiels (héros, cartes, modes, rangs, erreurs) sont lisibles par tous les membres connectés et modifiables par les admins seulement.
- Le drapeau `is_admin` ne peut pas être modifié depuis l'app : seulement via le SQL Editor.

## Arborescence

```
src/
  app/
    login/              connexion Discord et e-mail
    auth/               callback OAuth et déconnexion
    (app)/              pages connectées (barre latérale)
      page.tsx          accueil : guides des héros
      heros/[slug]/     fiche héros
      profil/           pseudo, rôle, mains, héros à entraîner
      saisir/           saisie et modification de partie (multi-héros)
      historique/       liste des parties
      stats/            stats perso et méta (lot 2)
      questions/        questions au coach (lot 3)
      admin/            édition des référentiels
  components/           barre latérale, composants d'interface
  lib/                  clients Supabase, types, accès aux données
supabase/migrations/    schéma SQL versionné
```
