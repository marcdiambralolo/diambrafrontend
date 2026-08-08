"use client";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { memo } from "react";

const ErrorState = memo(() => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[400px]"
    >
        <div className="max-w-md rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/20 to-red-900/10 p-8 text-center backdrop-blur-xl">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
            </motion.div>

            <h3 className="text-xl font-bold text-white mb-2">Accès refusé</h3>
            <p className="text-gray-300">Aucun utilisateur connecté. Veuillez vous connecter.</p>
        </div>
    </motion.div>
));

export default ErrorState;