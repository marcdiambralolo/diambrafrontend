"use client";
import Toast from "@/components/admin/commons/Toast";
import ConsultationHeader from "@/components/admin/consultations/AdminConsultationAnalysisView/ConsultationHeader";
import ShellCard from "@/components/admin/consultations/AdminConsultationAnalysisView/ShellCard";
import { useAdminConsultationAnalysis } from "@/hooks/admin/consultations/useAdminConsultationAnalysis";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { memo } from 'react';
import CenterShell from "../DisplayConsultationCard/CenterShell";
import { TopBarActions } from "../DisplayConsultationCard/TopBarActions";
import { AnalysisMarkdownSection } from "./AnalysisMarkdownSection";
import { AnalysisMetrics } from "./AnalysisMetrics";
import { PromptCollapsibleSection } from "./PromptCollapsibleSection";

const LoadingSkeleton = memo(() => (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#102044] via-[#0F1C3F] to-[#070B1A] p-3">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="theme-dark-panel w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10 dark:bg-[#0F1C3F]/68"
        >
            <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }}
                className="w-16 h-16 mx-auto mb-6 relative"
            >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4F83D1] to-[#9BC2FF] opacity-30 blur-xl" />
                <Loader2 className="w-full h-full text-white relative z-10" strokeWidth={2.5} />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-white mb-2"
            >
                Chargement de l'analyse
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-sm text-[#D1D5DB]"
            >
                Préparation de votre thème céleste...
            </motion.p>

            <div className="flex items-center justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="h-2 w-2 rounded-full bg-[#9BC2FF]"
                    />
                ))}
            </div>
        </motion.div>
    </div>
));

const ErrorState = memo(({
    error, onRetry }: {
        error: string;
        onRetry: () => void;
    }) => (
    <div className=" bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-[#162A56] flex items-center justify-center p-3">
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-10 max-w-md w-full text-center border border-white/20 shadow-2xl"
        >
            <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-16 h-16 mx-auto mb-4"
            >
                <div className="absolute inset-0 bg-red-400/30 rounded-full blur-xl" />
                <AlertCircle className="w-full h-full text-red-300 relative z-10" strokeWidth={2} />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl sm:text-2xl font-bold text-white mb-2"
            >
                Erreur de chargement
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-red-200 text-sm mb-6 leading-relaxed"
            >
                {error || 'Analyse non disponible'}
            </motion.p>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRetry}
                className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold text-white transition-all border border-white/30 shadow-lg flex items-center justify-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour aux consultations
            </motion.button>
        </motion.div>
    </div>
));

export default function AdminConsultationAnalysisView() {
    const {
        loading, error, toast, derived, mdTexte, mdPrompt, mdTitle, metrics,
        setToast, handleBack, handleRefresh, handleNotify,
    } = useAdminConsultationAnalysis();

    if (loading) return <LoadingSkeleton />;

    if (error) {
        return (
            <CenterShell>
                <div className="w-full max-w-md">
                    <ErrorState error={error || "Aucune donnée disponible"} onRetry={handleBack} />
                </div>
            </CenterShell>
        );
    }

    return (
        <div>
            <CenterShell>
                <div className="h-1 w-full bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF]" />
                <TopBarActions
                    derived={derived}
                    handleRefresh={handleRefresh}
                    handleNotify={handleNotify}
                    onBack={handleBack}
                />

                <ShellCard>
                    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
                        <ConsultationHeader title={mdTitle} />
                        <AnalysisMetrics metrics={metrics} mdPrompt={mdPrompt} />
                    </div>
                    <AnalysisMarkdownSection mdTexte={mdTexte} />
                    <PromptCollapsibleSection mdPrompt={mdPrompt} />
                </ShellCard>
            </CenterShell>

            <AnimatePresence>
                {toast ? (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                ) : null}
            </AnimatePresence>
        </div>
    );
}