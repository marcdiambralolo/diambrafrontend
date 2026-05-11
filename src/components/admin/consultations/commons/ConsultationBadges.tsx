'use client';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { memo } from 'react';

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

ConsultationBadges.displayName = 'ConsultationBadges';

export default ConsultationBadges;