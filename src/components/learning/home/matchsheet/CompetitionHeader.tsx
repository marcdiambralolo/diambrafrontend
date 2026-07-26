'use client';
import { CheckCircle, Loader2, Send, Trophy } from 'lucide-react';
import { memo } from 'react';

interface CompetitionHeaderProps {
    name: string;
    onValidate: () => void;
    isLoading: boolean;
    isValidated: boolean;
}

const CompetitionHeader = memo(function CompetitionHeader({
    name,
    onValidate,
    isLoading,
    isValidated,
}: CompetitionHeaderProps) {
    let buttonText = 'Valider ce jeu';
    let buttonIcon = <Send className="w-3.5 h-3.5" />;
    let isDisabled = false;

    if (isLoading) {
        buttonText = 'Validation...';
        buttonIcon = <Loader2 className="w-3.5 h-3.5 animate-spin" />;
        isDisabled = true;
    } else if (isValidated) {
        buttonText = 'Jeu validé';
        buttonIcon = <CheckCircle className="w-3.5 h-3.5" />;
        isDisabled = true;
    }

    const buttonClass = `flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${isValidated
        ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-400'
        }`;

    return (
        <div className="flex items-center justify-between w-full flex-wrap gap-3 border-b border-gray-100 dark:border-gray-700/60 pb-2">
            <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <Trophy className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm sm:text-base font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent truncate max-w-[180px]">
                    {name}
                </h3>
            </div>
            <button
                type="button"
                onClick={onValidate}
                disabled={isDisabled}
                className={buttonClass}
            >
                {buttonIcon}
                {buttonText}
            </button>
        </div>
    );
});

export default CompetitionHeader;