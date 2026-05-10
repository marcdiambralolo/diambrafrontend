export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Profil</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/65">
        Paramètres du compte, avatar et préférences seront disponibles ici après connexion.
      </p>
      <div className="mt-8 rounded-2xl border border-border-subtle bg-surface/80 px-6 py-8 dark:bg-surface/60">
        <p className="text-sm text-foreground/55">
          Connectez-vous ou créez un compte pour personnaliser votre profil.
        </p>
      </div>
    </main>
  );
}
