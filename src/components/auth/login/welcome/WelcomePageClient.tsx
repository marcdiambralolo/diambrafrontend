'use client';
import React, { memo, useCallback, useState } from 'react';
import { Brain, Grid, Info, Sparkles, TrophyIcon, Zap, } from 'lucide-react';

type PillItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tooltip?: string;
};

type StatItem = {
  id: string;
  value: string;
  label: string;
  gradient: string;
  textColor: string;
  glow: string;
};

const RULES: PillItem[] = [
  {
    id: 'cases',
    icon: <Grid className="h-5 w-5" />,
    title: '4 cases à remplir',
    desc: 'Chaque partie comporte 4 cases vides à compléter.',
    tooltip: 'Les cases sont numérotées de 1 à 4.',
  },
  {
    id: 'digits',
    icon: <Brain className="h-5 w-5" />,
    title: 'Chiffres 0 à 9',
    desc: '10 chiffres sont proposés, mais seulement 4 sont utilisés.',
    tooltip: 'Il faut choisir les  4 chiffres.',
  },
  {
    id: 'unique',
    icon: <TrophyIcon className="h-5 w-5" />,
    title: 'Pas de répétition',
    desc: 'Un chiffre ne peut être utilisé qu’une seule fois.',
    tooltip: 'Chaque chiffre de la combinaison doit être unique.',
  },
];

const STATS: StatItem[] = [
  {
    id: 'digits',
    value: '10',
    label: 'chiffres disponibles',
    gradient: 'from-purple-500/15 via-fuchsia-500/10 to-indigo-500/15',
    textColor: 'text-purple-700 dark:text-purple-300',
    glow: 'shadow-purple-500/10',
  },
  {
    id: 'slots',
    value: '4',
    label: 'cases à remplir',
    gradient: 'from-indigo-500/15 via-blue-500/10 to-cyan-500/15',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    glow: 'shadow-indigo-500/10',
  },
  {
    id: 'combinations',
    value: '5 040',
    label: 'combinaisons possibles',
    gradient: 'from-fuchsia-500/15 via-violet-500/10 to-purple-500/15',
    textColor: 'text-fuchsia-700 dark:text-fuchsia-300',
    glow: 'shadow-fuchsia-500/10',
  },
];

const sectionTitleClass =
  'text-center text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white';

const sectionTextClass =
  'mx-auto mt-2 max-w-md text-center text-sm leading-relaxed text-slate-500 sm:text-[15px] dark:text-slate-300/80';

const cardBaseClass =
  'relative overflow-hidden rounded-3xl border border-purple-100/80 bg-white/90 shadow-[0_10px_30px_rgba(109,40,217,0.08)] backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(80,50,180,0.20)]';

const SectionHeader = memo(function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 sm:mb-6">
      {badge ? (
        <div className="mb-3 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-purple-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </span>
        </div>
      ) : null}

      <h3 className={sectionTitleClass}>{title}</h3>

      {subtitle ? <p className={sectionTextClass}>{subtitle}</p> : null}
    </div>
  );
});

const Pill = memo(function Pill({
  icon,
  title,
  desc,
  tooltip,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tooltip?: string;
  delay?: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = useCallback(() => {
    setShowTooltip((prev) => !prev);
  }, []);

  const closeTooltip = useCallback(() => {
    setShowTooltip(false);
  }, []);

  return (
    <div
      className={`${cardBaseClass} group p-4 sm:p-5`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-indigo-500/[0.05] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.06]" />

      <div className="relative flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 transition-transform duration-300 group-active:scale-95 group-hover:scale-105 dark:from-purple-500/20 dark:to-indigo-500/20 dark:text-purple-300">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold leading-tight text-slate-900 sm:text-sm dark:text-white">
                {title}
              </div>
            </div>

            {tooltip ? (
              <button
                type="button"
                onClick={toggleTooltip}
                aria-label={`Informations sur ${title}`}
                aria-expanded={showTooltip}
                className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-500 transition active:scale-95 dark:bg-white/10 dark:text-purple-300"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 sm:text-[14px] dark:text-slate-300/85">
            {desc}
          </p>

          {tooltip ? (
            <div
              className={`grid transition-all duration-200 ${showTooltip
                ? 'mt-3 grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
                }`}
            >
              <div className="overflow-hidden">
                <div className="rounded-2xl border border-purple-200/70 bg-purple-50/90 px-3 py-2 text-xs leading-relaxed text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-200">
                  {tooltip}
                  <button
                    type="button"
                    onClick={closeTooltip}
                    className="ml-2 font-bold underline underline-offset-2"
                  >
                    fermer
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

const HowToPlayCard = memo(function HowToPlayCard() {
  return (
    <div className={`${cardBaseClass} p-5 sm:p-6`}>
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-400/10" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10" />

      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
          <Zap className="h-3.5 w-3.5" />
          Simple et intuitif
        </div>

        <p className="text-sm leading-7 text-slate-700 sm:text-[15px] dark:text-slate-200">
          Sélectionnez un chiffre, puis touchez une case vide pour le placer.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm dark:bg-white/5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-purple-500">
              Étape 1
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
              Choisir
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm dark:bg-white/5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-500">
              Étape 2
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
              Placer
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm dark:bg-white/5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-500">
              Étape 3
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
              Valider
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const StatCard = memo(function StatCard({ item }: { item: StatItem }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br ${item.gradient} p-5 shadow-xl ${item.glow} backdrop-blur-sm dark:border-white/10`}
    >
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/20 blur-2xl dark:bg-white/10" />
      <div className="relative text-center">
        <div className={`text-3xl font-black sm:text-4xl ${item.textColor}`}>
          {item.value}
        </div>
        <div className="mt-2 text-sm font-semibold leading-snug text-slate-700 dark:text-slate-200">
          {item.label}
        </div>
      </div>
    </div>
  );
});

export default function WelcomePageClient() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-4 sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />
        <div className="absolute right-0 top-28 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
        <div className="absolute bottom-20 left-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      <div className="relative z-10 space-y-6 sm:space-y-8">
        <section id="regles">
          <SectionHeader
            badge="Règles du jeu"
            title="📜 Comprendre le jeu en quelques secondes"
            subtitle="4 cases, 10 chiffres, 1 seule bonne combinaison.  "
          />

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {RULES.map((item, index) => (
              <Pill
                key={item.id}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                tooltip={item.tooltip}
                delay={index * 60}
              />
            ))}
          </div>
        </section>

        <section id="jeu">
          <SectionHeader
            badge="Comment jouer"
            title="🎯 Une expérience pensée pour le tactile"
           />

          <HowToPlayCard />
        </section>

        <section id="stats">
          <SectionHeader
            badge="Le jeu en chiffres"
            title="📊 Les chiffres clés"
          />

          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            {STATS.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}