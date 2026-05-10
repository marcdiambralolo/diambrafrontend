export default function MessagesPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Messages
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/65">
        Vos conversations et messages apparaîtront ici lorsque la messagerie sera connectée au
        compte.
      </p>
      <div className="mt-8 rounded-2xl border border-dashed border-border-subtle bg-surface-muted/40 px-6 py-12 text-center text-sm text-foreground/50 dark:bg-surface-muted/25">
        Aucun message pour le moment.
      </div>
    </main>
  );
}
