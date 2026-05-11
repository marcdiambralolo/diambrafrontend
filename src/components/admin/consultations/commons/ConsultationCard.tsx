'use client';
import Toast from '@/components/admin/commons/Toast';
import { useConsultationCard } from '@/hooks/consultations/useConsultationCard';
import { useConsultationCardDisplay } from '@/hooks/consultations/useConsultationCardDisplay';
import { Consultation } from '@/lib/interfaces';
import { motion,Variants  } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock3, Loader2 } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import CardActions from './CardActions';
import CardHeader from './CardHeader';
import ClientInfo from './ClientInfo';
import ConsultationBadges from './ConsultationBadges';
import ConsultationCardGlowBar from './ConsultationCardGlowBar';
import ConsultationCardParticles from './ConsultationCardParticles';
import StatusBadge from './StatusBadge';
import { cardVariants, shimmerVariants } from './consultationCardVariants';

interface ConsultationCardProps {
    consultation: Consultation;
    onGenerateAnalysis: (id: string) => void;
    onNotify: (id: string) => void;
    jobStatus?: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;
    onRetryAnalysis?: (id: string) => void;
}

const ConsultationCard = memo(({ consultation, onGenerateAnalysis, onNotify, jobStatus = null, onRetryAnalysis }: ConsultationCardProps) => {
    const { typeConfig, hasTierce } = useConsultationCard(consultation);
    const { formattedDate, clientName, tierceName } = useConsultationCardDisplay(consultation);
    const clientPhone = consultation.clientId && 'phone' in consultation.clientId
        ? consultation.clientId.phone
        : undefined;
    const phone = typeof clientPhone === 'string'
        ? clientPhone
        : (typeof consultation.formData?.numeroSend === 'string' ? consultation.formData.numeroSend : null);
    const consultationId = String(consultation.id ?? consultation._id ?? '');

    const [showToast, setShowToast] = useState(false);

    const isCompleted = consultation.status?.toLowerCase() === 'completed' || jobStatus === 'COMPLETED';
    const [isNotified, setIsNotified] = useState(Boolean(consultation.analysisNotified));
    const jobBadge = useMemo(() => {
        if (jobStatus === 'PROCESSING') {
            return {
                label: 'Analyse en cours',
                icon: Loader2,
                className: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
                spin: true,
            };
        }

        if (jobStatus === 'QUEUED') {
            return {
                label: 'Dans la file',
                icon: Clock3,
                className: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-700',
                spin: false,
            };
        }

        if (jobStatus === 'FAILED') {
            return {
                label: 'Echec du job',
                icon: AlertTriangle,
                className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800',
                spin: false,
            };
        }

        if (jobStatus === 'COMPLETED') {
            return {
                label: 'Analyse prête',
                icon: CheckCircle2,
                className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800',
                spin: false,
            };
        }

        return null;
    }, [jobStatus]);

    const handleNotify = (id: string) => {
        if (onNotify) {
            onNotify(id);
            setShowToast(true);
            setIsNotified(true);
            setTimeout(() => setShowToast(false), 3500);
        }
    };

    return (
        <motion.div
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/50 rounded-2xl border-2 border-gray-200/60 dark:border-slate-700/60 p-4 shadow-lg hover:shadow-2xl hover:shadow-[#2E5AA6]/10 dark:hover:shadow-[#2E5AA6]/20 transition-all duration-300 overflow-hidden group"
        >
            <motion.div
                variants={shimmerVariants}
                animate="animate"
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `linear-gradient(90deg, transparent, ${typeConfig.gradient.includes('emerald') ? 'rgba(79, 131, 209, 0.08)' : 'rgba(46, 90, 166, 0.12)'}, transparent)`,
                    backgroundSize: '200% 100%'
                }}
            />

            <ConsultationCardGlowBar gradient={typeConfig.gradient} />

            <div className="absolute top-2 right-2 z-10">
                <StatusBadge status={consultation.status} />
            </div>

            <div className="flex flex-col items-center w-full gap-2 mt-2">
                <CardHeader
                    typeConfig={typeConfig}
                    title={consultation.title}
                />
                <ClientInfo
                    clientName={clientName}
                    phone={phone}
                    tierceName={tierceName}
                    hasTierce={hasTierce}
                />

                <ConsultationBadges
                    formattedDate={formattedDate}
                />

                {jobBadge ? (
                    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold ${jobBadge.className}`}>
                        <jobBadge.icon className={`h-3.5 w-3.5 ${jobBadge.spin ? 'animate-spin' : ''}`} />
                        <span>{jobBadge.label}</span>
                    </div>
                ) : null}

                <CardActions
                    isCompleted={isCompleted}
                    isNotified={isNotified}
                    consultationId={consultationId}
                    jobStatus={jobStatus}
                    onGenerateAnalysis={onGenerateAnalysis}
                    onRetry={onRetryAnalysis}
                    onNotify={handleNotify}
                />
                {showToast && (
                    <Toast
                        message="Le client a bien été notifié."
                        type="success"
                        onClose={() => setShowToast(false)}
                    />
                )}
            </div>

            <ConsultationCardParticles />
        </motion.div>
    );
}, (prevProps, nextProps) => {
    const c1 = prevProps.consultation;
    const c2 = nextProps.consultation;
    return (c1.id === c2.id && prevProps.jobStatus === nextProps.jobStatus);
});

ConsultationCard.displayName = 'ConsultationCard';

export default ConsultationCard;