'use client';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface CardHeaderProps {
    typeConfig: {
        icon: string;
        text: string;
        gradient: string;
    };
    title: string;
}

const CardHeader = memo(({ typeConfig, title }: CardHeaderProps) => {
    return (
        <div className="flex flex-col items-center text-center mb-4 space-y-2">
            <div className="flex items-center justify-center gap-2 w-full">
                <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="relative"
                >
                    <div className="text-3xl flex items-center justify-center w-12 h-12 rounded-xl
                                  bg-gradient-to-br from-blue-100 to-slate-100
                                  dark:from-[#163A74]/60 dark:to-[#13274C]
                                  shadow-lg">
                        {typeConfig.icon}
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 -z-10 rounded-xl bg-[#4F83D1]/30 blur-md"
                    />
                </motion.div>
            </div>

            <div className="space-y-1 w-full">
                <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight
                              bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF]
                              text-transparent bg-clip-text">
                    {typeConfig.text}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium line-clamp-2">
                    {title}
                </p>
            </div>
        </div>
    );
}, (prev, next) => {
    return (
        prev.typeConfig.icon === next.typeConfig.icon &&
        prev.typeConfig.text === next.typeConfig.text &&
        prev.title === next.title
    );
});

CardHeader.displayName = 'CardHeader';

export default CardHeader;