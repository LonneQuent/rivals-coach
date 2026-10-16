/**
 * Squelette affiché dès le clic, pendant que le serveur prépare la page :
 * la navigation paraît instantanée au lieu de rester figée sur l'ancienne page.
 */
export default function Loading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Chargement">
      <div className="flex flex-col gap-2">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-surface-3" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-surface-2" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-line bg-surface" />
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-line bg-surface" />
        <div className="h-64 animate-pulse rounded-xl border border-line bg-surface" />
      </div>
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
