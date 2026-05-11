'use client';
import { Loader, CheckCircle, Save } from 'lucide-react';
import React from 'react';

interface SettingsSaveButtonProps {
    isSaving: boolean;
    saveSuccess: boolean;
    onClick: () => void;
}

const SettingsSaveButton: React.FC<SettingsSaveButtonProps> = ({ isSaving, saveSuccess, onClick }) => (
    <button
        onClick={onClick}
        disabled={isSaving}
        className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm rounded-lg font-semibold transition-all ${isSaving
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : saveSuccess
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg'
            }`}
    >
        {isSaving ? (
            <>
                <Loader className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Enregistrement...</span>
            </>
        ) : saveSuccess ? (
            <>
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Enregistré !</span>
            </>
        ) : (
            <>
                <Save className="w-4 w-4" />
                <span className="hidden sm:inline">Enregistrer</span>
            </>
        )}
    </button>
);

export default SettingsSaveButton;