'use client';
import { X } from "lucide-react";
import { memo } from 'react';

const HelpHeaderGradient = memo(({ onClose }: { onClose: () => void }) => (
    <div className="relative h-28 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Fermer"
            type="button"
        >
            <X className="w-4 h-4 text-white" aria-hidden="true" />
        </button>
        <div className="absolute bottom-4 left-5">
            <h2 className="text-xl font-bold text-white">Centre d&apos;aide</h2>
            <p className="text-xs text-white/90">Tout ce que vous devez savoir sur DIAMBRA PUZZLE</p>
        </div>
    </div>
));

export default memo(HelpHeaderGradient);