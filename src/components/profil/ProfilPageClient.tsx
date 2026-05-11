'use client';
import CacheLink from "@/components/commons/CacheLink";
import { useToast } from "@/hooks/categorie/useToast";
import { useProfilUser } from "@/hooks/profil/useProfilUser";
import { cx, formatNumber } from "@/lib/functions";
import { useAuthStore } from "@/lib/store/auth.store";
import { getGradeLevel, Grade } from "@/lib/types/grade.types";
import { motion } from 'framer-motion';
import { AlertCircle, ArrowDownCircle, ArrowRight, ArrowUpCircle, Eye, Moon, Star, Sun, TrendingUp, Triangle, Users } from "lucide-react";
import React, { memo, MouseEvent, useCallback, useMemo } from 'react';

export const porteIcons = [
  <Sun key="sun" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
  <ArrowUpCircle key="asc" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
  <ArrowDownCircle key="desc" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
  <Moon key="moon" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
  <Triangle key="mc" className="w-7 h-7 text-[#2E5AA6] dark:text-[#4F83D1]" />,
];

export interface HighlightCardType {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  link: string;
}

export interface CategoryType {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  stats: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  link: string;
  minGradeLevel?: number;
  lockedToastMessage?: string;
}

interface HighlightCardProps {
  card: HighlightCardType;
  index: number;
}

export const HighlightCard = memo(({ card, index }: HighlightCardProps) => {
  const CardIcon = card.icon;

  return (
    <CacheLink href={card.link}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
        whileHover={{ y: -6, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="group m-4  relative h-full overflow-hidden rounded-xl border-2 border-[#DDE7FA] bg-gray-50 shadow-lg transition-all duration-300 hover:border-[#4F83D1] hover:shadow-2xl dark:border-[color:var(--theme-border)] dark:bg-[#13274C] dark:hover:border-[#4F83D1] sm:rounded-2xl sm:p-5"
      >
        <motion.div
          className="absolute mt-8 mb-8 inset-0 bg-gradient-to-r from-transparent via-[#DDE7FA]/60 to-transparent opacity-0 group-hover:opacity-100 dark:via-[#21457F]/24"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8 }}
        />

        <div className="relative z-10 flex flex-col items-center text-center h-full mt-4 px-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-xl mb-3 group-hover:shadow-2xl transition-shadow`}
          >
            <CardIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </motion.div>

          <h3 className={`text-sm sm:text-base font-black bg-gradient-to-r ${card.color} bg-clip-text text-transparent  leading-tight`}>
            {card.title}
          </h3>

          <p className="text-[10px] font-semibold leading-tight text-gray-600 dark:text-[#AFC0DE] sm:text-xs">
            {card.subtitle}
          </p>

          <motion.div
            className="mt-auto flex items-center gap-1 text-[10px] font-bold text-[#2E5AA6] dark:text-[#9BC2FF] sm:text-xs"
            whileHover={{ x: 3 }}
          >
            <span>Découvrir</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </motion.div>
        </div>
        <div className={`absolute inset-0 mb-4 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl`} />
      </motion.div>
    </CacheLink>
  );
});

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold text-white transition duration-200 " +
  "bg-slate-900 hover:bg-slate-800 " +
  "dark:bg-[#2E5AA6] dark:hover:bg-[#4F83D1] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F83D1] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#070B1A]";

interface CategoryCardProps {
  category: CategoryType;
  index: number;
}

export const CategoryCard = memo(({ category, index }: CategoryCardProps) => {
  const CategoryIcon = category.icon;
  const toast = useToast();

  const userGrade = useAuthStore((state) => (state.user?.grade ?? null) as Grade | null);
  const gradeLevel = getGradeLevel(userGrade);
  const isLocked = typeof category.minGradeLevel === "number" && gradeLevel < category.minGradeLevel;

  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (!isLocked) return;

    event.preventDefault();
    event.stopPropagation();
    toast(category.lockedToastMessage || `Cette rubrique est accessible a partir du grade ${category.minGradeLevel}.`);
  }, [category.lockedToastMessage, category.minGradeLevel, isLocked, toast]);

  return (
    <CacheLink href={category.link} onClick={handleClick} aria-disabled={isLocked}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative h-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm transition-all duration-300 hover:border-[#4F83D1] hover:shadow-xl dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F] dark:hover:border-[#4F83D1] sm:rounded-2xl sm:p-5 md:p-6 m-2 pt-2"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EEF4FF]/70 to-transparent opacity-0 group-hover:opacity-100 dark:via-[#21457F]/24"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.7 }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg mb-3 sm:mb-4 group-hover:shadow-xl transition-shadow`}
          >
            <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
          </motion.div>

          <h2 className={`text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent mb-1 sm:mb-1.5 leading-tight`}>
            {category.title}
          </h2>

          <p className="mb-3 flex-grow line-clamp-2 text-[10px] leading-relaxed text-gray-600 dark:text-[#AFC0DE] sm:mb-4 sm:line-clamp-3 sm:text-xs">
            {category.description}
          </p>

          <div className="flex items-center justify-center mt-auto w-full">
            <motion.div
              className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#2E5AA6] group-hover:text-[#244A8A] dark:text-[#9BC2FF] dark:group-hover:text-white sm:text-xs"
              whileHover={{ x: 2 }}
            >
              <span className="hidden sm:inline">{isLocked ? "Decouvrir..." : "Decouvrir"}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </motion.div>
          </div>
        </div>

        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl`} />
        {isLocked ? <div className="absolute inset-0 rounded-xl bg-white/8 dark:bg-black/10 sm:rounded-2xl" /> : null}
      </motion.div>
    </CacheLink>
  );
});

export function ProgressBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs dark:text-[#D1D5DB]">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-[#162A56]">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] transition-all duration-500 dark:from-[#2E5AA6] dark:to-[#7BA9F1]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export const PremiumChoiceCard = memo(function PremiumChoiceCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-3xl border p-6 shadow-sm transition duration-200",
        "border-slate-200 bg-white text-slate-900 hover:border-blue-300",
        "dark:border-[#1C3A6B] dark:bg-[#162A56] dark:text-[#E5E7EB] dark:hover:border-[#4F83D1]",
        "focus-visible:ring-2 focus-visible:ring-[#4F83D1] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#070B1A]",
        "flex flex-col items-center justify-center text-center w-full mx-auto"
      )}
    >
      <div className="relative w-full flex flex-col items-center justify-center text-center gap-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 mb-2 shadow">
          {icon}
        </div>

        <h3 className="text-base font-black tracking-tight text-[#2E5AA6] dark:text-[#4F83D1] text-center">
          {title}
        </h3>

        <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600 dark:text-[#D1D5DB] text-center">
          {description}
        </p>
      </div>
    </div>
  );
});

export function ProfilPageLoader() {

  return (
    <section className="mx-auto mt-4 w-full max-w-6xl animate-pulse">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <div className="w-full rounded-3xl border border-[#1C3A6B] bg-[#0F1C3F] p-6 shadow-md md:w-1/2">
          <div className="mx-auto h-24 w-24 rounded-full bg-[#162A56]" />
          <div className="mx-auto mt-4 h-6 w-40 rounded-full bg-[#2E5AA6]" />
          <div className="mx-auto mt-3 h-4 w-56 rounded-full bg-[#4F83D1]" />
          <div className="mx-auto mt-6 h-10 w-36 rounded-2xl bg-[#162A56]" />
        </div>

        <div className="w-full rounded-3xl border border-[#1C3A6B] bg-[#0F1C3F] p-6 shadow-md md:w-1/2">
          <div className="h-6 w-36 rounded-full bg-[#2E5AA6]" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="h-24 rounded-2xl bg-[#162A56]" />
            <div className="h-24 rounded-2xl bg-[#162A56]" />
            <div className="h-24 rounded-2xl bg-[#162A56]" />
            <div className="h-24 rounded-2xl bg-[#162A56]" />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-[#1C3A6B] bg-[#0F1C3F] p-6 shadow-md">
        <div className="h-6 w-40 rounded-full bg-[#2E5AA6]" />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="h-28 rounded-2xl bg-[#162A56]" />
          <div className="h-28 rounded-2xl bg-[#162A56]" />
          <div className="h-28 rounded-2xl bg-[#162A56]" />
        </div>
      </div>
    </section>
  );
}

export interface StatCardProps {
  value: number | null;
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  color: 'primary' | 'accent';
}

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export const STAT_COLORS = {
  primary: {
    text: 'text-[var(--accent-violet)]',
    border: 'border-[var(--accent-violet)]/30',
    bg: 'bg-[var(--bg-light)]',
    iconBg: 'bg-[var(--accent-gold)]/10',
  },
  accent: {
    text: 'text-[var(--accent-gold)]',
    border: 'border-[var(--accent-gold)]/30',
    bg: 'bg-[var(--bg-light)]',
    iconBg: 'bg-[var(--accent-violet)]/10',
  },
} as const;

export const StatCard = React.memo<StatCardProps>(({ value, label, icon, loading, color }) => {
  const colors = STAT_COLORS[color];

  const displayValue = useMemo(() => {
    if (loading) return <span className="animate-pulse">...</span>;
    if (value !== null) return formatNumber(value);
    return '--';
  }, [loading, value]);

  const showTrend = useMemo(() => !loading && value !== null && value > 0, [loading, value]);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        flex flex-col items-center justify-center
        bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]/80
        rounded-xl shadow-sm hover:shadow-md
        px-4 py-3 sm:px-6 sm:py-4
        border ${colors.border} dark:border-[var(--accent-violet)]/30
        transition-all duration-300
        relative overflow-hidden
        min-w-[140px] sm:min-w-[160px] backdrop-blur-sm
      `}
    >
      <div className={`absolute inset-0 ${colors.bg} opacity-5 dark:opacity-10 -z-10`} />

      <div className={`${colors.iconBg} dark:bg-opacity-20 p-2 sm:p-2.5 rounded-lg mb-2`}>
        {icon}
      </div>

      <div className={`text-3xl sm:text-4xl font-bold ${colors.text} dark:text-[var(--accent-gold)] dark:opacity-90 tracking-tight text-center leading-none`}>
        {displayValue}
      </div>

      <div className="text-xs sm:text-sm font-medium text-[var(--accent-violet)] dark:text-[var(--accent-gold)] mt-1.5 uppercase tracking-wide text-center">
        {label}
      </div>

      {showTrend && (
        <div className="flex items-center gap-0.5 mt-1.5 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-medium">
          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>+{Math.floor(Math.random() * 15)}%</span>
        </div>
      )}
    </motion.div>
  );
});

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}


export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full max-w-md bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
  >
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="text-red-700 text-sm font-medium">{message}</p>
      <button
        onClick={onRetry}
        className="text-red-600 hover:text-red-800 text-xs font-semibold mt-2 underline"
      >
        Réessayer
      </button>
    </div>
  </motion.div>
);

export const LoadingSkeleton: React.FC = () => (
  <div className="flex flex-col sm:flex-row gap-6 items-center justify-center py-6">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="flex flex-col items-center bg-white rounded-2xl shadow-lg px-8 py-6 border-2 border-gray-100 animate-pulse min-w-[160px]"
      >
        <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3" />
        <div className="w-20 h-10 bg-gray-200 rounded mb-2" />
        <div className="w-16 h-4 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

const StatsCounter: React.FC<{ loading: boolean; stats: any; error: any; fetchStats: () => void }> = ({ loading, stats, error, fetchStats }) => {

  if (loading && !stats) { return <LoadingSkeleton />; }

  return (
    <div className="w-full">
      <div className="flex flex-row gap-3 items-center justify-center py-4">
        <StatCard
          value={stats?.subscribers ?? null}
          label="Abonnés"
          icon={<Users className="h-6 w-6 text-[#2E5AA6]" />}
          loading={loading}
          color="primary"
        />

        <StatCard
          value={stats?.visits ?? null}
          label="Visites"
          icon={<Eye className="h-6 w-6 text-[#4F83D1]" />}
          loading={loading}
          color="accent"
        />
      </div>

      {error && (
        <div className="flex justify-center mt-4">
          <ErrorMessage message={typeof error === 'string' ? error : (error ? String(error) : '')} onRetry={fetchStats} />
        </div>
      )}
    </div>
  );
};

export default function ProfilPageClient() {
  const {
    fetchStats, handleSelect, loading, isPremium, categories, label, stars,
    highlightCards, choices, required, stats, error,
  } = useProfilUser();

  if (loading) return <ProfilPageLoader />;

  return (
    <div className="relative mt-8 w-full flex flex-col items-center justify-center px-2 sm:px-0 overflow-x-hidden bg-white dark:bg-none dark:bg-[#0C0B1D] dark:bg-gradient-to-b dark:from-[#0C0B1D] dark:to-[#162A56]">
      <div className="relative z-10 w-full flex flex-col items-center justify-center">

        {isPremium ? (
          <section className="mx-auto w-full   flex flex-col items-center justify-center animate-fade-in-up">
            <div className="mx-auto o w-full flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12">

              <section className="mx-auto w-full flex flex-col items-center justify-center">
                <div
                  className={cx(
                    "relative overflow-hidden rounded-[28px] border border-[#DDE7FA] dark:border-[#2E5AA6]",
                    "bg-blue-700/80 dark:from-[#0F1C3F]/90 dark:via-[#162A56]/80 dark:to-[#2E5AA6]/60",
                    "shadow-xl dark:shadow-black/40 backdrop-blur-2xl",
                    "transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-fade-in-up"
                  )}
                  style={{ minWidth: 320, maxWidth: 420 }}
                >

                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-16  bg-blue-700/80  blur-2xl opacity-60 pointer-events-none" />
                  <div className="mx-auto flex flex-col items-center justify-center gap-3 text-center py-6 px-4">
                    <CacheLink
                      href="/star/grade"
                      className="group flex flex-col items-center justify-center gap-2 py-2"
                      prefetch={false}
                      title="Voir la description des grades"
                    >
                      <span
                        className={cx(
                          "font-black uppercase tracking-wide transition-colors",
                          "text-white group-hover:text-[#2E5AA6] group-hover:underline",
                          "dark:text-white dark:group-hover:text-[#9BC2FF]"
                        )}
                        style={{ fontSize: "1.84rem", lineHeight: 1.08, letterSpacing: ".045em", textShadow: "0 2px 12px #4F83D1AA" }}
                      >
                        {label}
                      </span>

                      <div className="mt-1 flex items-center justify-center gap-1.5">
                        {Array.from({ length: stars }).map((_, i) => (
                          <span key={i} className="relative flex items-center justify-center">
                            <Star
                              className="h-8 w-8 text-[#FFD700] drop-shadow-glow animate-star-bounce dark:text-[#FFD700]"
                              fill="#FFD700"
                              style={{ filter: "drop-shadow(0 0 8px #FFD700BB)" }}
                            />
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-[#2E5AA6] rounded-full blur-sm opacity-60" />
                          </span>
                        ))}
                      </div>
                    </CacheLink>

                    <div className="mt-4 mb-2 px-4 py-3 rounded-xl bg-white dark:from-[#162A56]/80 dark:to-[#2E5AA6]/40 shadow-inner border border-[#DDE7FA]/60 dark:border-[#2E5AA6]/40 text-[0.8rem] font-semibold text-cosmic-indigo dark:text-[#4F83D1] text-center">
                      <span className="block">
                        {`Vous devez réaliser `}
                        <span className="font-extrabold text-[#2E5AA6] dark:text-[#4F83D1] text-[1rem]">{required}</span>
                        {` consultation${required > 1 ? 's' : ''}`}
                      </span>

                      <span className="block mt-1 text-xs font-medium text-slate-500 dark:text-slate-300">
                        pour accéder au prochain grade
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="w-full md:w-1/2 flex-shrink-0">
                {highlightCards.map((card, index) => (
                  <HighlightCard key={card.id} card={card} index={index} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:gap-4 md:gap-6 lg:grid-cols-3 w-full items-center justify-center mt-8">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mx-auto mt-8 w-full max-w-5xl flex flex-col items-center justify-center animate-fade-in-up">
            <h2 className="mb-4 text-balance text-3xl font-black sm:text-4xl text-cosmic-indigo dark:text-white text-center tracking-tight drop-shadow-glow">
              Les 5 Portes de mon Étoile
            </h2>

            <p className="mx-auto max-w-3xl text-base font-semibold leading-relaxed text-slate-600 dark:text-[#D1D5DB] sm:text-lg text-center">
              Commençons par une consultation qui dévoile les cinq forces essentielles qui structurent
              votre identité cosmique. C’est une étape préalable et fondamentale pour comprendre qui vous êtes,
              comment vous vibrez, ce que vous ressentez, ce vers quoi vous avancez, et la manière dont vous
              vous reliez au monde.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 w-full items-center justify-center">
              {Array.isArray(choices) && choices.length > 0 ? (
                choices.map((c, i) => (
                  <PremiumChoiceCard
                    key={c._id || i}
                    title={c.title}
                    description={c.description}
                    icon={porteIcons[i % porteIcons.length]}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 dark:text-gray-500 py-8">
                  Aucun choix disponible pour le moment.
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-center w-full">
              <button onClick={handleSelect} className={btnPrimary + ' text-lg px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform'} type="button">
                Commencez maintenant
                <ArrowRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          </section>
        )}

        <div className="mt-10 w-full flex items-center justify-center">
          <StatsCounter loading={loading} stats={stats} error={error} fetchStats={fetchStats} />
        </div>
      </div>
    </div>
  );
}