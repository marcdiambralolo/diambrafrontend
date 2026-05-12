import { BackendStatus } from "@/components/commons/BackendStatus";
import { TopNav } from "@/components/commons/TopNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_-18%,var(--color-brand-500)/18,transparent_55%),radial-gradient(ellipse_70%_45%_at_100%_60%,var(--color-accent-500)/10,transparent_50%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_-18%,var(--color-brand-600)/22,transparent_55%),radial-gradient(ellipse_70%_45%_at_100%_60%,var(--color-accent-600)/12,transparent_50%)]"
        aria-hidden
      />

      <TopNav />

      <div className="flex flex-1 flex-col">{children}</div>

      <footer className="border-t border-border-subtle py-5 text-center">
        <p className="text-xs text-foreground/45">
          Une expérience{" "}
          <span className="font-medium text-foreground/65">Diambra</span>
        </p>
        {/* <BackendStatus /> */}
      </footer>
    </div>
  );
}
