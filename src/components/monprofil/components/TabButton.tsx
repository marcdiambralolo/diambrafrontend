"use client";
import { cx } from "@/lib/functions";
import { motion } from "framer-motion";
import { memo, type ReactNode } from "react";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    label: string;
    count: number;
}

const TabButton = memo(({ active, onClick, icon, label, count }: TabButtonProps) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cx(
            "relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300",
            active
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                : "bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
        )}
    >
        {icon}
        <span>{label}</span>
        {count >= 0 && (
            <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cx(
                    "px-2 py-0.5 rounded-full text-xs font-bold",
                    active
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                )}
            >
                {count > 0 && count}
            </motion.span>
        )}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
    </motion.button>
));

export default TabButton;