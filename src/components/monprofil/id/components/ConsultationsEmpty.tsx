"use client";
import CacheLink from "@/components/commons/CacheLink";
import { EditionInfo } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { Gamepad2, History, Star } from "lucide-react";

interface ConsultationsEmptyProps {
    consultationsLength: number;
    edition: EditionInfo | null;
}

function ConsultationsEmpty({ edition }: ConsultationsEmptyProps) {
    const isEditionActive = edition && new Date(edition.startDate) <= new Date() && new Date(edition.endDate) >= new Date();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-12 text-center backdrop-blur-lg dark:bg-[color:var(--theme-layer-3)]/78"
        >
            <div className="absolute inset-0 opacity-30">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 45, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -45, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"
                />
            </div>

            <motion.div
                animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-6 relative"
            >
                <div className="p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-sm inline-block">
                    {isEditionActive ? (
                        <Gamepad2 className="h-20 w-20 text-purple-400" strokeWidth={1.5} />
                    ) : (
                        <History className="h-20 w-20 text-purple-400" strokeWidth={1.5} />
                    )}
                </div>
            </motion.div>

            <h3 className="text-3xl font-bold text-white mb-3">
                {isEditionActive ? "🎮 Prêt à jouer ?" : "📜 Aucun jeu en historique"}
            </h3>

            <p className="text-white/70 mb-8 max-w-md mx-auto">
                {isEditionActive
                    ? "Vous n'avez pas encore participé à cette édition. Lancez votre première partie et entrez dans l'aventure !"
                    : "Vous n'avez pas encore joué dans cette édition. Revenez lors de la prochaine édition pour participer."
                }
            </p>

            {isEditionActive && (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <CacheLink
                        href={`/star/choix/${edition?.id || ''}`}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all group"
                    >
                        <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Commencer l'aventure
                        <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </CacheLink>
                </motion.div>
            )}
        </motion.div>
    );
}

export default ConsultationsEmpty;