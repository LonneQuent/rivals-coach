"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function discord() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: redirectTo() } });
  }

  async function magicLink(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
    setState(error ? "error" : "sent");
  }

  return (
    <div className="card flex flex-col gap-5">
      <button type="button" onClick={discord} className={buttonClass("primary", "w-full py-3 text-base")}>
        <DiscordIcon />
        Se connecter avec Discord
      </button>
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        ou par e-mail
        <span className="h-px flex-1 bg-line" />
      </div>
      {state === "sent" ? (
        <p className="text-sm text-fg-2">
          Lien envoyé à <b className="text-fg">{email}</b>. Ouvre-le depuis cet appareil pour te connecter.
        </p>
      ) : (
        <form onSubmit={magicLink} className="flex flex-col gap-3">
          <label className="label" htmlFor="email">
            Adresse e-mail
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="toi@exemple.fr" />
          </label>
          <button type="submit" disabled={state === "sending"} className={buttonClass("default")}>
            {state === "sending" ? "Envoi…" : "Recevoir un lien de connexion"}
          </button>
          {state === "error" ? <p className="text-sm text-bad">L&apos;envoi a échoué. Vérifie l&apos;adresse ou réessaie dans quelques minutes.</p> : null}
        </form>
      )}
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.6 1.3a18.2 18.2 0 0 0-5.6 0L8.6 3a19.5 19.5 0 0 0-4.9 1.4C.6 9 -.3 13.5.2 18a19.8 19.8 0 0 0 6 3l1.3-2a12.7 12.7 0 0 1-2-1l.5-.4a14 14 0 0 0 12 0l.5.4c-.6.4-1.3.7-2 1l1.3 2a19.7 19.7 0 0 0 6-3c.5-5.2-.9-9.7-3.5-13.6ZM8.5 15.3c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Zm7 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4Z" />
    </svg>
  );
}
