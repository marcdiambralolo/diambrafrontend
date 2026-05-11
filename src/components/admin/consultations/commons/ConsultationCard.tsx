'use client';
import { useConsultationCard } from '@/hooks/consultations/useConsultationCard';
import { useConsultationCardDisplay } from '@/hooks/consultations/useConsultationCardDisplay';
import { Consultation } from '@/lib/interfaces';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { Phone, User, Users } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { Variants } from "framer-motion";

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
            mass: 0.5
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

const shimmerVariants: Variants = {
    animate: {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

const floatingParticle1Variants: Variants = {
    animate: {
        y: [-10, 10, -10],
        x: [-5, 5, -5],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

const floatingParticle2Variants: Variants = {
    animate: {
        y: [10, -10, 10],
        x: [5, -5, 5],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

function ConsultationCardParticles() {
    return (
        <>
            <motion.div
                variants={floatingParticle1Variants}
                animate="animate"
                className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#4F83D1]/30 blur-sm"
            />

            <motion.div
                variants={floatingParticle2Variants}
                animate="animate"
                className="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-[#9BC2FF]/30 blur-sm"
            />
        </>
    );
}

function ConsultationCardGlowBar({ gradient }: { gradient: string }) {

    return (
        <>
            <motion.div
                variants={{ animate: { opacity: [0.7, 1, 0.7], transition: { duration: 2, repeat: Infinity } } }}
                animate="animate"
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
                style={{ backgroundSize: '200% 200%' }}
            />
            <motion.div
                variants={{ animate: { opacity: [0.3, 0.7, 0.3], transition: { duration: 2, repeat: Infinity } } }}
                animate="animate"
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} blur-sm`}
                style={{ backgroundSize: '200% 200%' }}
            />
        </>
    );
}

interface ConsultationBadgesProps {
    formattedDate: string;
}

const badgeBase =
    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

const ConsultationBadges = memo(
    ({ formattedDate }: ConsultationBadgesProps) => {
        return (
            <div className="flex flex-wrap justify-center items-center gap-2 mb-2 w-full">
                <motion.span
                    whileHover={{ scale: 1.07 }}
                    tabIndex={0}
                    aria-label="Date de la consultation"
                    className={
                        badgeBase +
                        ' bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30 dark:from-blue-700 dark:to-cyan-700 dark:shadow-blue-900/30'
                    }
                >
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                </motion.span>
            </div>
        );
    },
    (prev, next) => prev.formattedDate === next.formattedDate
);

interface ClientInfoProps {
    clientName: string;
    phone?: string | null;
    tierceName?: string | null;
    hasTierce?: boolean;
}

const ClientInfo = memo(({ clientName, phone, tierceName, hasTierce }: ClientInfoProps) => {
    return (
        <div className="flex flex-col items-center gap-2 mb-3">
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl
                          bg-gradient-to-r from-blue-50 to-slate-50
                          dark:from-[#13274C] dark:to-[#162A56]
                          border border-blue-200/50 dark:border-[color:var(--theme-border)]
                          w-full max-w-xs"
            >
                <User className="w-4 h-4 text-[#2E5AA6] dark:text-[#9BC2FF] flex-shrink-0" />
                <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {clientName || 'Non renseigné'}
                </span>
            </motion.div>

            {hasTierce && tierceName && (
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl
                              bg-gradient-to-r from-blue-50 to-cyan-50
                              dark:from-[#163A74] dark:to-[#13274C]
                              border border-blue-200/50 dark:border-[color:var(--theme-border)]
                              w-full max-w-xs"
                >
                    <Users className="w-4 h-4 text-[#2E5AA6] dark:text-[#9BC2FF] flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {tierceName}
                    </span>
                </motion.div>
            )}

            {phone && (
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl
                              bg-gradient-to-r from-emerald-50 to-teal-50
                              dark:from-emerald-950/30 dark:to-teal-950/30
                              border border-emerald-200/50 dark:border-emerald-800/50
                              w-full max-w-xs"
                >
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                        {phone}
                    </span>
                </motion.div>
            )}
        </div>
    );
}, (prev, next) => {
    return prev.clientName === next.clientName;
});


interface ConsultationCardProps {
    consultation: Consultation;
}

const ConsultationCard = memo(({ consultation }: ConsultationCardProps) => {
    const { typeConfig, hasTierce } = useConsultationCard(consultation);
    const { formattedDate, clientName, tierceName } = useConsultationCardDisplay(consultation);
    const clientPhone = consultation.clientId && 'phone' in consultation.clientId
        ? consultation.clientId.phone
        : undefined;
    const phone = typeof clientPhone === 'string'
        ? clientPhone
        : (typeof consultation.formData?.numeroSend === 'string' ? consultation.formData.numeroSend : null);

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

            <div className="flex flex-col items-center w-full gap-2 mt-2">
                <ClientInfo
                    clientName={clientName}
                    phone={phone}
                    tierceName={tierceName}
                    hasTierce={hasTierce}
                />
                <ConsultationBadges
                    formattedDate={formattedDate}
                />
            </div>

            <ConsultationCardParticles />
        </motion.div>
    );
}, (prevProps, nextProps) => {
    const c1 = prevProps.consultation;
    const c2 = nextProps.consultation;
    return (c1.id === c2.id);
});

ConsultationCard.displayName = 'ConsultationCard';

export default ConsultationCard;