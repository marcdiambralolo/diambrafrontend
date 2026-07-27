"use client";
import CacheLink from "@/components/commons/CacheLink";
import { motion } from "framer-motion";
import { Gamepad2, Sparkles } from "lucide-react";
import { memo } from "react";

interface GameButtonProps {
    gameId?: string;
}

const GameButton = memo(({ gameId }: GameButtonProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="w-full mt-4 mb-4"
    >
        <CacheLink
            href={`/star/choix/${gameId || ''}`}
            className="group relative flex items-center justify-center gap-3 w-full px-6 py-5 bg-gradient-to-r from-blue-600 via-red-600 to-green-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/20 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-wide">Commencer une nouvelle partie</span>
                <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
        </CacheLink>
    </motion.div>
));

export default GameButton;