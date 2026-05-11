'use client';
import { AlertTriangle } from "lucide-react";
import React from "react";

interface CategoriesErrorAlertProps {
    message: string;
}

const CategoriesErrorAlert: React.FC<CategoriesErrorAlertProps> = ({ message }) => (
    <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-100">
        <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{message}</span>
        </div>
    </div>
);

export default CategoriesErrorAlert;