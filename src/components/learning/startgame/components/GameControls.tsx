'use client';
import { memo } from 'react';
import ActionButton from './ActionButton';

const GameControls = memo(({ showPun, onToggleShowPun, onLockSelectedCase }: any) => (
    <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-xs font-bold text-blue-700 mb-3 tracking-wide">
            {showPun ? "👤 Plateau P1 (Référence)" : "🕹️ Plateau P2"}
        </h2>

        <div className="flex items-center justify-center gap-3 flex-wrap">
            <ActionButton
                onClick={onToggleShowPun}
                variant="secondary"
                ariaLabel={showPun ? "Jouer" : "Voir P1"}
            >
                {showPun ? "Jouer" : "Voir P1"}
            </ActionButton>

            {!showPun && (
                <ActionButton
                    onClick={onLockSelectedCase}
                    variant="primary"
                    ariaLabel="Ajuster la sélection."
                >
                    Ajuster
                </ActionButton>
            )}
        </div>
    </div>
));

export default GameControls;