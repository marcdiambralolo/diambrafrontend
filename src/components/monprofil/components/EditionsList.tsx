"use client";
import { staggerContainer } from "@/lib/animations";
import { motion, Variants } from "framer-motion";
import { memo } from "react";
import EditionCard from "./EditionCard";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

interface EditionsListProps {
    editions: Array<{
        id: string;
        startDate: string;
        endDate: string;
        status: string;
        isActive: boolean;
        winningCombination: string | null;
    }>;
    getGamesCountByEdition: (editionId: string) => number;
}

const EditionsList = memo(({ editions, getGamesCountByEdition }: EditionsListProps) => {
    if (editions.length === 0) {
        return (
            <motion.div
                variants={fadeInUp}
                className="text-center py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl"
            >
                <p className="text-gray-500 dark:text-gray-400">Aucune édition disponible</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
        >
            {editions.map((edition) => (
                <EditionCard
                    key={edition.id}
                    edition={edition}
                    gamesCount={getGamesCountByEdition(edition.id)}
                />
            ))}
        </motion.div>
    );
});

export default EditionsList;