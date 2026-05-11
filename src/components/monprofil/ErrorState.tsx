'use client';
import { motion } from "framer-motion";
import { memo } from "react";
import { AlertCircle } from "lucide-react";

const ErrorState = memo(() => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center p-4 bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-[#162A56]"
    >
        <div className="max-w-md rounded-2xl border border-[#4F83D1]/25 bg-[#13274C]/70 p-8 text-center backdrop-blur-xl">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <AlertCircle className="mx-auto mb-4 h-16 w-16 text-[#9BC2FF]" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-white mb-2">Accès refusé</h3>
            <p className="text-[#DDE7FA]">Aucun utilisateur connecté. Veuillez vous connecter.</p>
        </div>
    </motion.div>
));

ErrorState.displayName = 'ErrorState';

export default ErrorState;