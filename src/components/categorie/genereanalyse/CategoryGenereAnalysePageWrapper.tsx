'use client';
import { useGenereAnalysePage } from '@/hooks/categorie/useGenereAnalysePage';
import { motion } from 'framer-motion';
import { Calendar, Clock, Home, LucideIcon, Mail, Shield, Sparkles, Stars, User } from 'lucide-react';
import { memo } from 'react';

interface InfoCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay?: number;
    gradient?: string;
    accentClass?: string;
}

export const palette = {
    blue: 'from-blue-500 via-sky-400 to-cyan-300',
    red: 'from-red-500 via-rose-400 to-pink-300',
    yellow: 'from-yellow-400 via-amber-300 to-orange-300',
    green: 'from-green-500 via-emerald-400 to-lime-300',
    orange: 'from-orange-500 via-amber-400 to-yellow-300',
    purple: 'from-violet-500 via-fuchsia-400 to-pink-300',
};

export const InfoCard = memo<InfoCardProps>(
    ({
        icon: Icon,
        title,
        description,
        delay = 0,
        gradient = palette.blue,
        accentClass = 'group-hover:text-blue-600',
    }) => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    delay,
                    duration: 0.45,
                    type: 'spring',
                    stiffness: 180,
                    damping: 18,
                }}
                whileHover={{ y: -4, scale: 1.015 }}
                className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_14px_35px_rgba(0,0,0,0.12)] sm:p-5"
            >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <div className="flex items-start gap-4">
                    <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                        <Icon className="h-6 w-6 text-white drop-shadow-md" strokeWidth={2.5} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h4
                            className={`mb-1.5 text-sm font-extrabold text-slate-900 transition-colors sm:text-base ${accentClass}`}
                        >
                            {title}
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-700 sm:text-sm">
                            {description}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }
);

export const ProcessSteps = memo(() => (
    <div
        className="grid gap-3 sm:grid-cols-3 sm:gap-4"
        role="list"
        aria-label="Étapes du processus de consultation"
    >
        <div role="listitem">
            <InfoCard
                icon={User}
                title="Attribution au Maître"
                description="Votre consultation est confiée à un expert qualifié selon la nature de votre demande."
                delay={0.05}
                gradient={palette.blue}
                accentClass="group-hover:text-blue-600"
            />
        </div>

        <div role="listitem">
            <InfoCard
                icon={Sparkles}
                title="Analyse personnalisée"
                description="Une étude attentive et approfondie de votre situation est réalisée avec soin."
                delay={0.12}
                gradient={palette.purple}
                accentClass="group-hover:text-violet-600"
            />
        </div>

        <div role="listitem">
            <InfoCard
                icon={Mail}
                title="Résultats rapides"
                description="Vous recevrez vos résultats détaillés dans un délai maximum d’une heure."
                delay={0.19}
                gradient={palette.green}
                accentClass="group-hover:text-emerald-600"
            />
        </div>
    </div>
));

export const MasterAssignmentNotice = memo(() => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[28px] border border-yellow-200/70 bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 p-5 shadow-[0_12px_35px_rgba(245,158,11,0.18)] sm:p-6"
        role="status"
        aria-live="polite"
    >
        <motion.div
            animate={{
                x: ['-20%', '120%'],
                opacity: [0, 0.35, 0],
            }}
            transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />

        <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 shadow-lg">
                <Stars className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>

            <div className="flex-1">
                <p className="text-sm leading-relaxed text-amber-900 sm:text-base">
                    Nous transmettons actuellement votre requête à un{' '}
                    <strong className="font-extrabold text-orange-600">
                        maître spirituel qualifié
                    </strong>{' '}
                    et disponible, qui étudiera votre situation avec attention, sérieux et
                    bienveillance.
                </p>
            </div>
        </div>
    </motion.div>
));

export const ConfidentialityNotice = memo(() => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="relative overflow-hidden rounded-[26px] border border-blue-200/70 bg-gradient-to-br from-blue-100 via-cyan-50 to-sky-100 p-4 shadow-[0_10px_28px_rgba(59,130,246,0.14)] sm:p-5"
    >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.55),transparent_35%)]" />

        <div className="relative flex items-start gap-3.5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-300 shadow-lg">
                <Shield className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed text-slate-800 sm:text-sm">
                    <strong className="font-extrabold text-blue-700">
                        🔒 Confidentialité garantie :
                    </strong>{' '}
                    toutes vos informations et vos demandes restent strictement confidentielles
                    et protégées. Elles ne seront jamais partagées avec des tiers.
                </p>
            </div>
        </div>
    </motion.div>
));

export const TimelineBadge = memo(() => (
    <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
            delay: 0.22,
            type: 'spring',
            stiffness: 200,
            damping: 16,
        }}
        className="inline-flex items-center gap-2.5 rounded-full border border-red-200/60 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 px-5 py-3 shadow-[0_12px_30px_rgba(239,68,68,0.22)]"
    >
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        >
            <Clock className="h-5 w-5 text-white" strokeWidth={2.5} />
        </motion.div>

        <span className="text-xs font-extrabold tracking-wide text-white sm:text-sm">
            Délai maximum : 1 heure
        </span>
    </motion.div>
));

interface BackButtonProps {
    onClick: () => void;
}

export const BackButton = memo<BackButtonProps>(({ onClick }) => (
    <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onClick}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-500 to-pink-500 px-6 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(99,102,241,0.28)] transition-all duration-300 hover:shadow-[0_18px_40px_rgba(99,102,241,0.35)] sm:min-w-[250px] sm:w-auto sm:px-8 sm:text-base"
    >
        <Home className="h-5 w-5 transition-transform group-hover:scale-110" strokeWidth={2.5} />

        <span>Retour à l’accueil</span>
    </motion.button>
));

export default function CategoryGenereAnalysePageWrapper() {
    const { navigateToProfil, consultationTitle, estdocument } = useGenereAnalysePage();

    if (estdocument) return null;

    return (
        <main className="relative overflow-hidden px-3 py-6 sm:px-4 sm:py-10" aria-label="Page de génération d'analyse">
            <section className="relative mx-auto w-full max-w-4xl space-y-5">
                <header className="text-center" aria-labelledby="genere-analyse-title">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="rounded-[32px] border border-white/70 bg-white/75 px-4 py-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)] backdrop-blur-md sm:px-6 sm:py-8"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-green-500 via-emerald-400 to-lime-300 shadow-[0_10px_24px_rgba(34,197,94,0.28)]">
                            <span className="text-2xl font-black text-white">✓</span>
                        </div>

                        <h1
                            id="genere-analyse-title"
                            className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl"
                        >
                            ENREGISTREMENT
                        </h1>

                        <p className="mt-2 text-sm font-bold text-emerald-600 sm:text-base">
                            Félicitations 🎉 Votre demande a bien été enregistrée.
                        </p>

                        <p className="sr-only">
                            Votre consultation "{consultationTitle}" a été soumise avec succès et est
                            en cours de traitement.
                        </p>

                        <div className="pt-4 flex justify-center">
                            <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-gradient-to-r from-pink-100 via-yellow-100 to-cyan-100 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-fuchsia-700 shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-40" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-fuchsia-500" />
                                </span>
                                Traitement en cours
                            </span>
                        </div>
                    </motion.div>
                </header>

                <section aria-labelledby="master-assignment-title">
                    <h2 id="master-assignment-title" className="sr-only">Attribution à un maître</h2>
                    <MasterAssignmentNotice />
                </section>

                <section aria-labelledby="timeline-badge-title" className="flex justify-center">
                    <h2 id="timeline-badge-title" className="sr-only">Délai de traitement</h2>
                    <TimelineBadge />
                </section>

                <motion.section
                    aria-labelledby="consultation-summary-title"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative overflow-hidden rounded-[28px] border border-violet-200/70 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100 p-4 shadow-[0_12px_30px_rgba(168,85,247,0.16)] sm:p-5"
                >
                    <h2 id="consultation-summary-title" className="sr-only">Résumé de la consultation</h2>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_35%)]" />

                    <div className="relative flex items-start gap-3">
                        <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-400 to-pink-400 shadow-lg">
                            <Calendar className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700 sm:text-sm">
                                Consultation
                            </p>

                            <p className="text-sm font-extrabold leading-snug text-slate-900 sm:text-lg">
                                {consultationTitle}
                            </p>
                        </div>
                    </div>
                </motion.section>

                <section aria-labelledby="confidentiality-title">
                    <h2 id="confidentiality-title" className="sr-only">Confidentialité</h2>
                    <ConfidentialityNotice />
                </section>

                <section aria-labelledby="process-steps-title">
                    <h2 id="process-steps-title" className="text-lg font-bold text-[#2E5AA6] dark:text-[#9BC2FF] mb-2 text-center">Étapes du traitement</h2>
                    <ProcessSteps />
                </section>

                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="rounded-2xl border border-white/60 bg-white/65 py-4 text-center shadow-sm backdrop-blur-sm"
                    aria-live="polite"
                >
                    <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                        Merci pour votre confiance 🙏 Nous revenons vers vous très bientôt.
                    </p>
                </motion.section>
                <div className="flex justify-center pt-1">
                    <BackButton onClick={navigateToProfil} aria-label="Retour à mon profil" />
                </div>
            </section>
        </main>
    );
}