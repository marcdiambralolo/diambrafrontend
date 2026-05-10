export default function NotificationsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Notifications
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/65">
        Retrouvez ici les alertes du jeu, du compte et des autres services Diambra.
      </p>
      <div className="mt-8 rounded-2xl border border-dashed border-border-subtle bg-surface-muted/40 px-6 py-12 text-center text-sm text-foreground/50 dark:bg-surface-muted/25">
        Aucune notification pour le moment.
      </div>
    </main>
  );
}
