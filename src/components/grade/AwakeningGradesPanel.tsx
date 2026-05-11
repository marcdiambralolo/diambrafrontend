'use client';
import { useGradesPanel } from '@/hooks/grade/useGradesPanel';
import { clamp01, cx } from '@/lib/functions';
import { LEVEL_TO_KEY } from '@/lib/interfaces';
import { GradeConfig } from '@/lib/types/grade-config.types';
import { AnimatePresence, motion, useReducedMotion,Variants  } from 'framer-motion';
import {
  ArrowDown, BookOpen, ChevronDown, ChevronUp, Compass,
  Crown, Flame, Layers, Lock, MessageCircle, Sparkles,
  Star, Unlock, Zap
} from 'lucide-react';
import React, { memo, useMemo } from 'react';

type UserProgress = {
  consultations?: number;
  rituels?: number;
  livres?: number;
};

interface GradeCardProps {
  g: GradeConfig;
  opened: boolean;
  unlocked: boolean;
  isCurrent: boolean;
  onToggle: (lvl: number) => void;
  progress?: UserProgress;
}

interface GradeFlag {
  level: number;
  opened: boolean;
  unlocked: boolean;
  isCurrent: boolean;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const scaleOnHover: Variants = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 }
};

export const UI = {
  panel: 'relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md',
  panelSoft: 'relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100',
  badge: 'inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100',
  accentLine: 'absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500',
  title: 'text-gray-900',
  text: 'text-gray-600',
  textSoft: 'text-gray-500',
  chip: 'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
  actionPrimary: 'rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
  actionSecondary: 'rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:-translate-y-0.5',
  focus: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40'
};

const MOTION_CONTENT = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
} as const;



function getReq(g: GradeConfig) {
  return {
    consultations: Number(g.requirements?.consultations ?? 0),
    rituels: Number(g.requirements?.rituels ?? 0),
    livres: Number(g.requirements?.livres ?? 0),
  };
}

function getProg(progress?: UserProgress) {
  return {
    consultations: Number(progress?.consultations ?? 0),
    rituels: Number(progress?.rituels ?? 0),
    livres: Number(progress?.livres ?? 0),
  };
}

export const GradeCard = memo(function GradeCard({
  g,
  opened,
  unlocked,
  isCurrent,
  onToggle,
  progress,
}: GradeCardProps) {
  const reduceMotion = useReducedMotion();
  const req = getReq(g);
  const prog = getProg(progress);
  const totalReq = req.consultations + req.rituels + req.livres;
  const totalProg = prog.consultations + prog.rituels + prog.livres;
  const ratio = totalReq > 0 ? clamp01(totalProg / totalReq) : 0;
  const showProgress = Boolean(progress) && totalReq > 0;
  const displayTitle = g.title || g.name || '';
  const displaySubtitle = g.subtitle || g.description || '';
  const items = g.items || [];
  const id = g.key ?? g.grade ?? g.level;

  return (
    <motion.section
      variants={fadeInUp}
      id={`grade-${g.key ?? g.grade ?? g.level}`}
      className={cx(
        UI.panel,
        'scroll-mt-24',
        isCurrent && 'ring-2 ring-indigo-200 shadow-lg'
      )}
    >
      <div className={UI.accentLine} />

      <button
        type="button"
        onClick={() => onToggle(g.level)}
        className={cx(
          UI.focus,
          'group w-full px-6 py-5 text-left transition-all duration-300',
          'hover:bg-gray-50/50'
        )}
        aria-expanded={opened}
        aria-controls={`grade-panel-${id}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cx(
                  UI.badge,
                  isCurrent && 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800'
                )}
              >
                {unlocked ? (
                  <Unlock className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                Grade {g.level}
              </span>

              {isCurrent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                  <Crown className="h-3 w-3" />
                  Actuel
                </span>
              )}

              {!unlocked && (
                <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500">
                  À venir
                </span>
              )}
            </div>

            <h3 className="mt-3 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
              {displayTitle}
            </h3>

            {displaySubtitle && (
              <p className="mt-1.5 max-w-2xl text-sm text-gray-600">
                {displaySubtitle}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={cx(UI.chip, 'bg-indigo-50 text-indigo-700')}>
                <MessageCircle className="h-3.5 w-3.5" />
                {req.consultations} consultations
              </span>
              <span className={cx(UI.chip, 'bg-amber-50 text-amber-700')}>
                <Flame className="h-3.5 w-3.5" />
                {req.rituels} rituels
              </span>
              <span className={cx(UI.chip, 'bg-emerald-50 text-emerald-700')}>
                <BookOpen className="h-3.5 w-3.5" />
                {req.livres} livres
              </span>
            </div>

            {showProgress && (
              <div className="mt-4 max-w-md">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                  <span>Progression</span>
                  <span className="font-bold text-gray-800">
                    {Math.round(ratio * 100)}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(ratio * 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              className={cx(
                'inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
                isCurrent
                  ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600'
                  : unlocked
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-gray-100 text-gray-400'
              )}
              aria-hidden="true"
            >
              {opened ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </motion.div>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {opened && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={MOTION_CONTENT}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-t border-gray-100 bg-gray-50/30"
            id={`grade-panel-${id}`}
          >
            <div className="px-6 py-5">
              {items.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map((it, idx) => (
                    <motion.div
                      key={it}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm"
                    >
                      {it}
                    </motion.div>
                  ))}
                </div>
              )}

              {g.description && (
                <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {g.description}
                </div>
              )}

              {g.updatedAt && (
                <div className="mt-3 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  Mis à jour : {new Date(g.updatedAt).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}, (prev, next) => {
  const pg = prev.g;
  const ng = next.g;
  return (
    prev.opened === next.opened &&
    prev.isCurrent === next.isCurrent &&
    (pg._id ?? pg.key ?? '') === (ng._id ?? ng.key ?? '') &&
    pg.updatedAt === ng.updatedAt
  );
});

interface GradeCardsProps {
  grades: GradeConfig[];
  gradesLoading: boolean;
  gradesError: string | null;
  gradeFlags: GradeFlag[];
  toggle: (lvl: number) => void;
}

export const GradeCards: React.FC<GradeCardsProps> = ({
  grades,
  gradesLoading,
  gradesError,
  gradeFlags,
  toggle,
}) => {
  const flagsByLevel = useMemo(() => {
    const map = new Map<number, GradeFlag>();
    gradeFlags.forEach((flag) => map.set(flag.level, flag));
    return map;
  }, [gradeFlags]);

  const gradeCards = useMemo(() => {
    if (gradesLoading) {
      return (
        <div className={cx(UI.panelSoft, 'px-6 py-12 text-center')}>
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            <p className="text-sm font-medium text-gray-500">Chargement des grades...</p>
          </div>
        </div>
      );
    }

    if (gradesError) {
      return (
        <div className={cx(UI.panelSoft, 'px-6 py-12 text-center')}>
          <p className="text-sm font-medium text-rose-600">{gradesError}</p>
        </div>
      );
    }

    return grades.map((g, idx) => {
      const f = flagsByLevel.get(g.level) ?? {
        level: g.level,
        opened: false,
        unlocked: false,
        isCurrent: false,
      };

      return (
        <GradeCard
          key={g.key || g._id || idx}
          g={g}
          opened={f.opened}
          unlocked={f.unlocked}
          isCurrent={f.isCurrent}
          onToggle={toggle}
        />
      );
    });
  }, [grades, gradesLoading, gradesError, flagsByLevel, toggle]);

  return <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">{gradeCards}</motion.div>;
};

// ==================== EXPLANATION SECTION ====================
export function GradesExplanation({
  stage0Points,
}: {
  stage0Points: { label: string; text: string }[];
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mt-8 grid gap-5 lg:grid-cols-2"
    >
      <motion.div variants={fadeInUp} className={cx(UI.panel, 'p-6')}>
        <div className={UI.accentLine} />
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className={UI.badge}>Chemin intérieur</div>
            <h3 className="mt-2 text-lg font-bold text-gray-900">
              Une progression de l'intérieur vers l'extérieur
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              La répartition suit une logique de maturation de la conscience.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {stage0Points.map((p, idx) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                {p.label}
              </div>
              <div className="mt-1 text-sm font-medium text-gray-700">
                {p.text}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className={cx(UI.panel, 'p-6')}>
        <div className={UI.accentLine} />
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className={UI.badge}>Logique du système</div>
            <h3 className="mt-2 text-lg font-bold text-gray-900">
              Pourquoi cette répartition ?
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Chaque grade débloque des consultations pour deux raisons majeures.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              L'intégration
            </div>
            <div className="mt-1 text-sm font-medium text-gray-700">
              Recevoir une analyse profonde trop tôt génère souvent de la confusion.
              Ici, chaque séance doit devenir un déclic concret, pas une surcharge.
            </div>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              La responsabilité
            </div>
            <div className="mt-1 text-sm font-medium text-gray-700">
              Certains outils demandent du recul pour être utilisés avec sagesse.
              Le parcours vous prépare à recevoir les bonnes clés au bon moment.
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border border-indigo-100">
            <p className="text-sm font-bold text-indigo-900">
              Votre progression reflète votre engagement envers vous-même.
            </p>
            <p className="mt-1 text-sm text-indigo-700">
              À chaque grade franchi, une nouvelle strate de votre potentiel devient accessible.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== GRADES RAIL ====================
export function GradesRail({
  currentLevel,
  expandAll,
  collapseAll,
}: {
  currentLevel: number;
  expandAll: () => void;
  collapseAll: () => void;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className={cx(UI.panel, 'mt-6 p-5')}
    >
      <div className={UI.accentLine} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className={UI.badge}>Rail de progression</div>
          <h3 className="mt-2 text-base font-bold text-gray-900">
            Progression du grade 0 au grade 9
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Naviguez rapidement vers un grade ou ouvrez tout le parcours.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            {...scaleOnHover}
            type="button"
            onClick={expandAll}
            className={cx(UI.actionPrimary, UI.focus)}
          >
            <Zap className="h-3.5 w-3.5 inline mr-1.5" />
            Tout ouvrir
          </motion.button>
          <motion.button
            {...scaleOnHover}
            type="button"
            onClick={collapseAll}
            className={cx(UI.actionSecondary, UI.focus)}
          >
            Tout fermer
          </motion.button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 10 }).map((_, lvl) => {
          const unlocked = lvl <= currentLevel;
          const isCurrent = lvl === currentLevel;
          const key = LEVEL_TO_KEY[lvl];

          return (
            <motion.a
              key={lvl}
              whileHover={{ y: -2 }}
              href={`#grade-${key}`}
              className={cx(
                UI.focus,
                'relative flex min-h-[48px] items-center justify-center rounded-xl text-sm font-bold transition-all duration-300',
                unlocked
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 hover:shadow-md'
                  : 'bg-gray-50 text-gray-400 border border-gray-100'
              )}
              aria-label={`Aller au grade ${lvl}`}
              title={`Grade ${lvl} — ${key}`}
            >
              {isCurrent && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                </span>
              )}
              {lvl}
            </motion.a>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 text-[10px] font-medium text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5">
          <Unlock className="h-3 w-3 text-indigo-500" />
          Débloqués : grades ≤ {currentLevel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-gray-400" />
          À venir : grades &gt; {currentLevel}
        </span>
      </div>
    </motion.div>
  );
}

// ==================== GRADES HERO ====================
export interface GradesHeroProps {
  description: string;
  currentKey: string | null;
  currentLevel: number;
}

export function GradesHero({
  description,
  currentKey,
  currentLevel,
}: GradesHeroProps) {
  return (
    <motion.header
      variants={fadeInUp}
      className="relative overflow-hidden text-center mb-8"
    >
      {/* Effet de fond décoratif */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-100/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100/20 blur-3xl" />
      </div>

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
            Parcours d'Éveil
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Bienvenue dans votre
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block sm:inline">
            {" "}Parcours d'Éveil
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 leading-relaxed">
          Notre système de grades a été conçu pour accompagner votre évolution spirituelle
          avec douceur, clarté et profondeur.
        </p>

        <div className="mt-6 flex justify-center">
          <div className={cx(UI.panelSoft, 'px-6 py-4')}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Grade actuel
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-xl font-black text-gray-900">
                {currentKey ?? 'NEOPHYTE'}
              </span>
              <span className="text-sm font-semibold text-gray-500">
                (niveau {currentLevel})
              </span>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.header>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function AwakeningGradesPanel() {
  const {
    toggle, expandAll, collapseAll, currentKey, currentLevel, grades,
    gradesLoading, gradesError, gradeFlags, stage0Points, currentGradeDescription,
  } = useGradesPanel();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
        <GradesHero
          description={currentGradeDescription}
          currentKey={typeof currentKey === 'string' ? currentKey : null}
          currentLevel={currentLevel}
        />

        <GradesRail
          currentLevel={currentLevel}
          expandAll={expandAll}
          collapseAll={collapseAll}
        />

        <GradesExplanation stage0Points={stage0Points} />

        <motion.div
          variants={fadeInUp}
          className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-500"
        >
          <ArrowDown className="h-4 w-4 text-indigo-500" />
          Ouvrez un grade pour découvrir les consultations correspondantes
        </motion.div>

        <div className="mt-6">
          <GradeCards
            grades={grades}
            gradesLoading={gradesLoading}
            gradesError={gradesError}
            gradeFlags={gradeFlags}
            toggle={toggle}
          />
        </div>
      </div>
    </div>
  );
}