"use client";
import { Role } from "@/lib/interfaces";
import { useAuthStore } from "@/lib/store/auth.store";
import { memo } from "react";
import ConsultantHub from "./consultant/ConsultantHub";
import UserHub from "./utilisateur/UserHub";

function MonProfilPageClientImpl() {
  const role = useAuthStore((state) => state.user?.role);

  return (
    <main className="relative mx-auto w-full max-w-5xl px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="w-full mx-auto flex flex-col items-center justify-center gap-4">
        {role === Role.CONSULTANT ? (<ConsultantHub />) : (<UserHub />)}
      </div>
    </main>
  );
}

const MonProfilPageClient = memo(MonProfilPageClientImpl);

export default MonProfilPageClient;