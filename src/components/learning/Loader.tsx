'use client';
import { Spin } from "antd";
import { motion } from "framer-motion";
import { memo } from "react";

interface LoaderProps {
    text?: string;
    textColor?: string;
    spinnerSize?: "small" | "default" | "large";
    spinnerColor?: string;
    backdropBlur?: boolean;
}

const Loader = memo(({
    text = "Chargement...",
    textColor = "text-green-600",
    spinnerSize = "large",
    spinnerColor = "border-gray-200",
    backdropBlur = true,
}: LoaderProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed inset-0 flex flex-col justify-center items-center bg-white/90 ${backdropBlur ? "backdrop-blur-md" : ""}`}
            aria-live="polite" aria-busy="true" role="status"
        >
            <span className={`text-xl font-semibold animate-pulse mb-4 ${textColor}`}>
                {text}
            </span>
            <div className={`p-4 rounded-full border-4 ${spinnerColor}`}>
                <Spin size={spinnerSize} />
            </div>
        </motion.div>
    );
});

Loader.displayName = "Loader";

export default Loader;