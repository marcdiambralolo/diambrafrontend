import { User as UserIcon } from "lucide-react";
import CacheLink from "@/components/commons/CacheLink";

export default function UserDetailsNotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center bg-white text-slate-900 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <UserIcon className="h-6 w-6 text-slate-400" />
          <div className="text-sm font-extrabold text-slate-700">Utilisateur introuvable.</div>
        </div>
        <div className="mt-5">
          <CacheLink
            href="/admin/users"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800"
          >
            Retour à la liste
          </CacheLink>
        </div>
      </div>
    </div>
  );
}
