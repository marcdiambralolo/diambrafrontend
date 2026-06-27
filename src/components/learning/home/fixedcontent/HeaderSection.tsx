'use client';
import { memo } from 'react';
import { APP_NAME } from "@/lib/learning/constantes";

export const HeaderSection = memo(function HeaderSection() {
    return (
        <div className="flex flex-col items-center justify-center mt-2 mb-2">
            <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {APP_NAME}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
            </div>
        </div>
    );
});