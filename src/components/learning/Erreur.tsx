'use client';
import { memo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ErreurProps {
    message?: string;
}

const Erreur = memo(({ message }: ErreurProps) => {
    return (
        <motion.p
            key="error" exit={{ opacity: 0, y: 15 }}
            initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            role="alert" aria-live="assertive"
            aria-atomic="true"
            className={clsx(
                "text-red-600 text-center text-lg font-semibold uppercase",
                "mt-20 mb-20"
            )}
        >
            {message}
        </motion.p>
    );
});

Erreur.displayName = "Erreur";

export default Erreur;