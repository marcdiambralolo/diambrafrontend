"use client";
import CacheLink from "@/components/commons/CacheLink";
import { motion } from "framer-motion";
import { Gamepad2, Plus } from "lucide-react";
import { memo } from "react";

interface NewGameButtonProps {
    gameId?: string;
}

const NewGameButton = memo(({ gameId }: NewGameButtonProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50"
    >
        <CacheLink
            href={`/star/choix/${gameId || ''}`}
            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative z-10 flex items-center gap-3">
                <div className="p-1.5 rounded-full bg-white/20 group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </div>
                <span className="font-bold tracking-wide">Nouveau jeu</span>
                <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
        </CacheLink>
    </motion.div>
));

export default NewGameButton;