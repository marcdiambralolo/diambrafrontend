'use client';
import { Lightbulb } from "lucide-react";
import { memo } from 'react';

const HelpHeader = memo(() => (
    <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Lightbulb className="w-10 h-10 text-white" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Guide d&apos;utilisation
        </h2>
    </div>
));

export default memo(HelpHeader);