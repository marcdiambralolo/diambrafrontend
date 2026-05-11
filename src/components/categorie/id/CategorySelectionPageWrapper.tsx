"use client";
import Loader from '@/app/loading';
import { useCategorySelectionid } from '@/hooks/categorie/useCategorySelection';
import { cx, getStableRubriqueId, hashString } from '@/lib/functions';
import type { Rubrique } from "@/lib/interfaces";
import { motion,Variants  } from 'framer-motion';
import { Anchor, Award, Book, Brain, Briefcase, Calendar, CheckCircle, Cloud, Compass, Eye, Feather, Flame, Gem, Gift, Globe, Heart, Home, Key, Leaf, Lightbulb, MessageCircle, Moon, Music, Pen, Rocket, Search, Shield, Smile, Sparkles, Star, Sun, Trash, TrendingUp } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

const itemVariants: Variants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    hover: {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.98 },
} as const;

const glowVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: [0.4, 0.7, 0.4],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const gradients = [
    {
        border: "from-[#163A74]/70 via-[#2E5AA6]/65 to-[#4F83D1]/70",
        bg: "from-[#EEF4FF] to-[#DDE7FA] dark:from-[#0F1C3F]/90 dark:to-[#162A56]/80",
        accent: "from-[#163A74] to-[#2E5AA6]",
        glow: "bg-[#2E5AA6]/20 dark:bg-[#2E5AA6]/12"
    },
    {
        border: "from-[#0F1C3F]/75 via-[#163A74]/65 to-[#2E5AA6]/70",
        bg: "from-[#F5F9FF] to-[#E6EEFF] dark:from-[#070B1A]/95 dark:to-[#0F1C3F]/88",
        accent: "from-[#0F1C3F] to-[#2E5AA6]",
        glow: "bg-[#163A74]/22 dark:bg-[#163A74]/14"
    },
    {
        border: "from-[#2E5AA6]/70 via-[#4F83D1]/65 to-[#9BC2FF]/70",
        bg: "from-[#EEF4FF] to-[#F7FAFF] dark:from-[#102247]/90 dark:to-[#163A74]/80",
        accent: "from-[#2E5AA6] to-[#4F83D1]",
        glow: "bg-[#4F83D1]/20 dark:bg-[#4F83D1]/12"
    },
    {
        border: "from-[#163A74]/72 via-[#2E5AA6]/68 to-[#9BC2FF]/68",
        bg: "from-[#F3F7FF] to-[#DDE7FA] dark:from-[#0F1C3F]/92 dark:to-[#162A56]/82",
        accent: "from-[#163A74] to-[#4F83D1]",
        glow: "bg-[#9BC2FF]/18 dark:bg-[#9BC2FF]/10"
    },
    {
        border: "from-[#162A56]/72 via-[#2E5AA6]/65 to-[#4F83D1]/72",
        bg: "from-[#EEF4FF] to-[#E8F0FF] dark:from-[#070B1A]/94 dark:to-[#13274C]/84",
        accent: "from-[#162A56] to-[#4F83D1]",
        glow: "bg-[#2E5AA6]/18 dark:bg-[#4F83D1]/10"
    },
    {
        border: "from-[#163A74]/72 via-[#2E5AA6]/68 to-[#9BC2FF]/68",
        bg: "from-[#F3F7FF] to-[#DDE7FA] dark:from-[#0F1C3F]/92 dark:to-[#162A56]/82",
        accent: "from-[#163A74] to-[#4F83D1]",
        glow: "bg-[#9BC2FF]/18 dark:bg-[#9BC2FF]/10"
    },
] as const;

function getGradientFromId(id: string) {
    const h = hashString(id);
    return gradients[h % gradients.length];
}

export const RubriqueCard = memo(
    function RubriqueCard({ rub, onOpen, theme }: {
        rub: Rubrique;
        onOpen: (rub: Rubrique) => void;
        theme?: {
            border: string;
            bg: string;
            accent: string;
            glow: string;
        }
    }) {
        const derived = useMemo(() => {
            const id = getStableRubriqueId(rub);
            const title = typeof rub.titre === "string" ? rub.titre.trim() : "Rubrique";
            const desc = rub.description ?? "-";
            const resolvedTheme = theme ?? getGradientFromId(id);
            return { id, title, desc, theme: resolvedTheme };
        }, [rub, theme]);

        const handleClick = useCallback(() => {
            onOpen(rub);
        }, [rub, onOpen]);

        function getIconForTitle(title: string) {
            const t = title.toLowerCase();
            if (t.includes('livre') || t.includes('lecture')) return Book;
            if (t.includes('amour') || t.includes('relation')) return Heart;
            if (t.includes('soleil')) return Sun;
            if (t.includes('lune')) return Moon;
            if (t.includes('monde') || t.includes('voyage') || t.includes('globe')) return Globe;
            if (t.includes('plume') || t.includes('écriture') || t.includes('ecriture')) return Feather;
            if (t.includes('pierre') || t.includes('cristal') || t.includes('gemme')) return Gem;
            if (t.includes('étoile') || t.includes('etoile')) return Star;
            if (t.includes('spirituel') || t.includes('spiritualité')) return Sparkles;
            if (t.includes('protection') || t.includes('bouclier')) return Shield;
            if (t.includes('argent') || t.includes('finance') || t.includes('abondance')) return TrendingUp;
            if (t.includes('famille') || t.includes('maison')) return Home;
            if (t.includes('travail') || t.includes('carrière') || t.includes('profession')) return Briefcase;
            if (t.includes('créativité') || t.includes('idee') || t.includes('idée') || t.includes('lumière')) return Lightbulb;
            if (t.includes('guérison') || t.includes('guerrison') || t.includes('santé')) return Leaf;
            if (t.includes('intuition') || t.includes('vision')) return Eye;
            if (t.includes('destin') || t.includes('karma')) return Compass;
            if (t.includes('clarté') || t.includes('vérité')) return Key;
            if (t.includes('force') || t.includes('courage')) return Flame;
            if (t.includes('chance') || t.includes('cadeau')) return Gift;
            if (t.includes('paix')) return Cloud;
            if (t.includes('communication') || t.includes('message')) return MessageCircle;
            if (t.includes('connaissance') || t.includes('savoir')) return Brain;
            if (t.includes('temps') || t.includes('date') || t.includes('calendrier')) return Calendar;
            if (t.includes('projet') || t.includes('objectif')) return Rocket;
            if (t.includes('prospérité')) return Award;
            if (t.includes('création') || t.includes('art')) return Pen;
            if (t.includes('musique')) return Music;
            if (t.includes('voyance')) return Eye;
            if (t.includes('protection')) return Shield;
            if (t.includes('ancrage')) return Anchor;
            if (t.includes('harmonie')) return Smile;
            if (t.includes('nettoyage')) return Trash;
            if (t.includes('recherche')) return Search;
            if (t.includes('réussite') || t.includes('succes') || t.includes('succès')) return CheckCircle;
            if (t.includes('voyage')) return Globe;
            if (t.includes('protection')) return Shield;
            if (t.includes('famille')) return Home;
            if (t.includes('argent')) return TrendingUp;
            if (t.includes('travail')) return Briefcase;
            if (t.includes('spirituel')) return Sparkles;
            if (t.includes('énergie') || t.includes('energie')) return Flame;
            return Sparkles;
        }
        const RubIcon = getIconForTitle(derived.title);

        return (
            <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={itemVariants}
                initial="initial"
                animate="animate"
                className={cx(
                    "group relative overflow-hidden rounded-2xl cursor-pointer",
                    "backdrop-blur-sm transition-all duration-300"
                )}
                onClick={handleClick}
                layoutId={`rubrique-${derived.id}`}
                role="button"
                tabIndex={0}
                aria-label={`Découvrir ${derived.title}`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                <motion.div
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                    className={cx(
                        "absolute inset-0 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        derived.theme.glow
                    )}
                />

                <div className={cx(
                    "absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br",
                    derived.theme.border,
                    "opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                )}>
                    <div className={cx(
                        "h-full w-full rounded-2xl bg-gradient-to-br",
                        derived.theme.bg
                    )} />
                </div>

                <div className="relative p-5 sm:p-6 flex flex-col items-center text-center gap-4 min-h-[180px] sm:min-h-[200px]">
                    <div className={cx(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br flex items-center justify-center",
                        derived.theme.accent,
                        "shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                    )}>
                        <RubIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>

                    <h3 className={cx(
                        "font-bold text-lg sm:text-xl leading-tight",
                        "bg-gradient-to-br bg-clip-text text-transparent",
                        derived.theme.accent,
                        "group-hover:scale-105 transition-transform duration-300"
                    )}>
                        {derived.title}
                    </h3>

                    {derived.desc && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed  px-2">
                            {derived.desc}
                        </p>
                    )}

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className={cx(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
                            "bg-gradient-to-r text-white shadow-md",
                            derived.theme.accent
                        )}
                    >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Decouvrir</span>
                    </motion.div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
                        <motion.div
                            className={cx("h-full w-1/3 bg-gradient-to-r", derived.theme.accent)}
                            animate={{
                                x: ['-100%', '400%'],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                                ease: "easeInOut",
                            }}
                        />
                    </div>
                </div>
                <div className="absolute inset-0 bg-white/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
            </motion.div>
        );
    },
    (prev, next) => {
        if (prev.rub === next.rub) return true;
        return String(prev.rub._id ?? "") === String(next.rub._id ?? "");
    }
);

function CategorySelectionPageWrapper({ id }: { id: string }) {
    const {
        handleOpenRubriqueById, listVariants, gradients, title, description,
        rubriquesList, category, isLoading, isError
    } = useCategorySelectionid(id);

    if (isLoading) { return <Loader />; }

    if (isError || !category) {
        return <div className="w-full flex justify-center items-center py-12 text-red-600">Erreur de chargement de la catégorie.</div>;
    }

    return (
        <div className={cx(
            "w-full mx-auto max-w-6xl mt-8 flex items-center justify-center",
            " duration-100 ",
        )}>
            <div className="relative overflow-hidden dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F]/68 dark:shadow-black/35">
                <header
                    className={cx(
                        "px-4 pt-5 pb-3 sm:px-6 sm:pt-7 sm:pb-4",
                        "flex flex-col items-center justify-center text-center gap-2"
                    )}
                >
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-slate-900 dark:text-white px-1 py-0.5 "  >
                        {title}
                    </h1>
                    
                    <p className="mt-2 leading-relaxed text-center">
                        {description}
                    </p>
                </header>

                <section className="px-3 pb-4 sm:px-6 sm:pb-6">
                    <div className="mx-auto flex w-full flex-col items-center justify-center">
                        <div className="w-full flex flex-col items-center justify-center animate-fade-in">
                            <motion.ul
                                key="rubriquesList"
                                variants={listVariants}
                                initial="initial"
                                animate="animate"
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
                                aria-label="Liste des rubriques"
                            >
                                {rubriquesList.map((rub, idx) => {
                                    const theme = gradients[idx % gradients.length];
                                    return (
                                        <RubriqueCard key={rub._id} rub={rub} theme={theme} onOpen={handleOpenRubriqueById} />
                                    );
                                })}
                            </motion.ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CategorySelectionPageWrapper;