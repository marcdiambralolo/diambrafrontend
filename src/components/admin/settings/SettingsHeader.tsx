'use client';
import { Settings } from 'lucide-react';
import React from 'react';

const SettingsHeader: React.FC = () => (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                        <Settings className="w-4 h-4 text-gray-700" />
                    </div>
                    
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                            Paramètres
                        </h1>
                        <p className="text-xs text-gray-500">Configuration système</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default SettingsHeader;