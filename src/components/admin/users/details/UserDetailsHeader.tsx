import { getInitial, safeString } from "@/lib/utils";
import { Shield } from "lucide-react";

interface UserDetailsHeaderProps {
  username?: string | null;
  role?: string | null;
}

export default function UserDetailsHeader({ username, role }: UserDetailsHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] text-2xl font-extrabold text-white shadow">
        {getInitial(username)}
      </div>

      <div className="min-w-0">
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {safeString(username)}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold text-slate-700 dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F] dark:text-[#DDE7FA]">
            <Shield className="h-4 w-4 text-slate-900 dark:text-[#9BC2FF]" />
            {safeString(role)}
          </span>
        </div>
      </div>
    </div>
  );
}