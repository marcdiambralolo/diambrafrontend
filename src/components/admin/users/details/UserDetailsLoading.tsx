import { Loader2 } from "lucide-react";

export default function UserDetailsLoading() {
  return (
    <div className="min-h-[60vh] grid place-items-center bg-white text-slate-900 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <div className="text-sm font-extrabold text-slate-700">Chargement de l’utilisateur…</div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-1/3 bg-slate-900/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
