"use client";
import CacheLink from '@/components/commons/CacheLink';
import { prefetchAdminUserDetail } from '@/lib/cache/route-prefetch';
import { cx } from "@/lib/functions";
import type { User } from "@/lib/interfaces";
import { useQueryClient } from '@tanstack/react-query';
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Ban,
  Calendar,
  CheckCircle,
  Edit,
  Globe,
  Phone,
  Shield,
  Star,
  User as UserIcon
} from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { memo, useCallback, useMemo } from "react";

type UserCardProps = {
  user: User;
  cardVariants: Variants;
};

function safeInitial(username?: string | null) {
  const s = (username ?? "").trim();
  return s ? s[0]!.toUpperCase() : "U";
}

function formatDateTimeFR(input?: string | number | Date | null) {
  if (!input) return "—";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

const Pill = memo(function Pill({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border",
        "bg-cosmic-pink/10 border-cosmic-indigo text-cosmic-indigo dark:bg-cosmic-pink/20 dark:border-cosmic-pink dark:text-cosmic-pink",
        className,
      )}
    >
      {children}
    </span>
  );
});
Pill.displayName = "Pill";

function UserCardBase({ user, cardVariants }: UserCardProps) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = String(user._id ?? user.id ?? '');

  const handlePrefetch = useCallback(() => {
    if (!userId) return;
    void router.prefetch(`/admin/users/${userId}/details`);
    void prefetchAdminUserDetail(queryClient, userId);
  }, [queryClient, router, userId]);

  const vm = useMemo(() => {
    const username = user.username ?? "Utilisateur";
    const phone = user.phone ?? "";
    const country = user.country ?? "";
    const gender = user.gender ?? "";
    const createdAtLabel = formatDateTimeFR(user.createdAt);
    const lastLoginLabel = formatDateTimeFR(user.lastLogin);

    const role = user.role ?? "USER";
    const isActive = Boolean(user.isActive);
    const premium = Boolean(user.premium);
    const notif = Boolean(user.preferences?.notifications);
    const totalConsultations = Number(user.totalConsultations ?? 0);

    const genderLabel =
      gender === "male" ? "Homme" : gender === "female" ? "Femme" : "";

    const initial = safeInitial(username);

    return {
      username,
      initial,
      phone,
      country,
      genderLabel,
      createdAtLabel,
      lastLoginLabel,
      role,
      isActive,
      premium,
      notif,
      totalConsultations,
    };
  }, [user]);

  return (
    <motion.article
      variants={cardVariants}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
      className={cx(
        "group relative overflow-hidden rounded-2xl border p-3 flex flex-col w-full h-full min-h-[340px] max-w-sm min-w-[280px]",
        "border-slate-200/80 bg-white/75 shadow-sm backdrop-blur",
        "hover:shadow-md hover:border-slate-300/80",
        "dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/7 dark:hover:border-white/15",
        "transition-all",
      )}
      style={{ minHeight: 340, minWidth: 280, maxWidth: 384, height: '100%' }}
    >
      {/* Accent glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={cx(
            "absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl opacity-70",
            vm.premium ? "bg-amber-400/25 dark:bg-amber-400/10" : "bg-indigo-400/20 dark:bg-indigo-400/10",
          )}
        />
        <div className="absolute -bottom-20 right-[-30px] h-48 w-48 rounded-full bg-[#4F83D1]/15 blur-3xl dark:bg-[#2E5AA6]/12" />
      </div>

      {/* Header */}
      <div className="relative flex items-center gap-3">
        <div className="relative">
          <div
            className={cx(
              "h-11 w-11 rounded-2xl grid place-items-center text-white font-extrabold text-sm shadow-sm",
              vm.premium
                ? "bg-gradient-to-br from-amber-500 to-orange-600"
                : "bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1]",
            )}
            aria-hidden="true"
          >
            {vm.initial}
          </div>

          {vm.isActive ? (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950"
              title="Compte actif"
              aria-label="Compte actif"
            />
          ) : (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-slate-400 ring-2 ring-white dark:ring-slate-950"
              title="Compte inactif"
              aria-label="Compte inactif"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
            {vm.username}
          </h3>
        </div>

        {/* Quick status icon */}
        <div className="shrink-0">
          {vm.premium ? (
            <div
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200"
              title="Compte Premium"
            >
              <Star className="h-4 w-4" />
            </div>
          ) : (
            <div
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
              title="Compte standard"
            >
              <UserIcon className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="relative mt-3 space-y-1.5 border-t border-slate-200/60 pt-3 dark:border-white/10">
        {vm.phone ? (
          <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
            <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
            <span className="truncate">{vm.phone}</span>
          </div>
        ) : null}

        {vm.country ? (
          <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
            <Globe className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
            <span className="truncate">{vm.country}</span>
          </div>
        ) : null}

        {vm.genderLabel ? (
          <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
            <UserIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
            <span className="truncate">{vm.genderLabel}</span>
          </div>
        ) : null}

        <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
          <span className="truncate">Créé : {vm.createdAtLabel}</span>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-slate-700 dark:text-white/75">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-white/35" />
          <span className="truncate">Dernière connexion : {vm.lastLoginLabel}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="relative mt-3 grid grid-cols-3 gap-2 rounded-xl border border-slate-200/70 bg-slate-50/70 p-2 text-center dark:border-white/10 dark:bg-white/5">
        <div className="col-span-3 sm:col-span-1">
          <p className="text-[11px] text-slate-500 dark:text-white/50">Consultations</p>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white">
            {vm.totalConsultations}
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
        <Pill
          className={cx(
            vm.role === "ADMIN"
              ? "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200"
              : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200",
          )}
          title={`Rôle : ${vm.role}`}
        >
          {vm.role === "ADMIN" ? <Shield className="h-3 w-3" /> : null}
          {vm.role}
        </Pill>

        <Pill
          className={cx(
            vm.isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
              : "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70",
          )}
          title={vm.isActive ? "Compte actif" : "Compte inactif"}
        >
          {vm.isActive ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
          {vm.isActive ? "Actif" : "Inactif"}
        </Pill>

        <Pill
          className={cx(
            vm.premium
              ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200"
              : "border-slate-200 bg-white/70 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white/75",
          )}
          title={vm.premium ? "Compte premium" : "Compte débutant"}
        >
          <Star className="h-3 w-3" />
          {vm.premium ? "Premium" : "Débutant"}
        </Pill>

        {vm.notif ? (
          <span
            className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-800 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200"
            title="Notifications activées"
          >
            🔔
          </span>
        ) : null}
      </div>

      {/* Actions */}
      <div className="relative mt-3 grid grid-cols-3 gap-2">
        <CacheLink
          href={`/admin/users/${userId}/details`}
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold",
            "bg-gradient-to-r from-slate-500 to-slate-700 text-white shadow-sm",
            "hover:shadow-md hover:from-slate-600 hover:to-slate-800 transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:focus-visible:ring-slate-700/40",
          )}
        >
          <UserIcon className="h-4 w-4" />
          Détails
        </CacheLink>

        <CacheLink
          href={`/admin/users/${userId}/edit`}
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
          className={cx(
            "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold",
            "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm",
            "hover:shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700/40",
          )}
        >
          <Edit className="h-4 w-4" />
          Modifier
        </CacheLink>
      </div>
    </motion.article>
  );
}

const UserCard = memo(
  UserCardBase,
  (prev, next) => {
    return (
      prev.user._id === next.user._id
    );
  },
);

UserCard.displayName = "UserCard";

export default UserCard;