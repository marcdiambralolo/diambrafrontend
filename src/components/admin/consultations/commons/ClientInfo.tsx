'use client';
import { motion } from 'framer-motion';
import { Phone, User, Users } from 'lucide-react';
import { memo } from 'react';

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

ClientInfo.displayName = 'ClientInfo';

export default ClientInfo;