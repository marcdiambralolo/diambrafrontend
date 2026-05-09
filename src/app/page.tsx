import { DiambraLogo } from "@/components/DiambraLogo";
import { NumberGridGame } from "@/components/NumberGridGame";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_-18%,var(--color-brand-500)/18,transparent_55%),radial-gradient(ellipse_70%_45%_at_100%_60%,var(--color-accent-500)/10,transparent_50%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_-18%,var(--color-brand-600)/22,transparent_55%),radial-gradient(ellipse_70%_45%_at_100%_60%,var(--color-accent-600)/12,transparent_50%)]"
        aria-hidden
      />

      <header className="sticky top-0 z-10 border-b border-border-subtle bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
          <DiambraLogo size="md" />
          <span className="hidden rounded-full border border-border-subtle bg-surface-muted/80 px-3 py-1 text-xs font-medium text-foreground/65 sm:inline dark:bg-surface-muted/50">
            Jeu — quatre cases
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-stretch justify-center py-6 sm:py-10">
        <NumberGridGame />
      </main>

      <footer className="border-t border-border-subtle py-5 text-center">
        <p className="text-xs text-foreground/45">
          Une expérience{" "}
          <span className="font-medium text-foreground/65">Diambra</span>
        </p>
      </footer>
    </div>
  );
}
