import { ExtendedViewState, GameCompletionState, GameState } from '@/lib/interfaces';

export const calculateGameCompletionState = (
    proclamationDate: Date | null,
    endDate: Date | null,
    now: number
): GameCompletionState => {
    const hasProclamation = proclamationDate !== null;
    const proclamationMs = proclamationDate?.getTime() || 0;
    const endDateMs = endDate?.getTime() || 0;
    const hasEndDatePassed = endDateMs > 0 && now >= endDateMs;

    const isProclamationPassed = hasProclamation && now >= proclamationMs;
    const isWaitingForProclamation = hasProclamation && now < proclamationMs && hasEndDatePassed;
    const isCompletelyFinished = isProclamationPassed;

    return { isCompletelyFinished, isWaitingForProclamation, isProclamationPassed };
};

export const computeGameState = (
    completionState: GameCompletionState,
    viewState: ExtendedViewState,
    hasGameConfig: boolean,
    gameIsFinished: boolean,
    isEditionEnCours: boolean,
    afficheStat: boolean,
    afficheBanana: boolean
): GameState => {
    if (completionState.isProclamationPassed) {
        return { status: 'results_available', canUserPlay: false, showGameFinishedBanner: false };
    }

    
    if (viewState.isEnded && !hasGameConfig) {
        return { status: 'ended_no_proclamation', canUserPlay: false, showGameFinishedBanner: false };
    }

    const shouldShowGameFinished = gameIsFinished && !isEditionEnCours && !afficheStat && !afficheBanana;

    if (shouldShowGameFinished) {
        return { status: 'active', canUserPlay: false, showGameFinishedBanner: true };
    }

    if (viewState.isEmpty) {
        return { status: 'no_competition', canUserPlay: false, showGameFinishedBanner: false };
    }

    if (viewState.isNotStarted) {
        return { status: 'not_started', canUserPlay: false, showGameFinishedBanner: false };
    }

    if (viewState.isActive && !completionState.isWaitingForProclamation) {
        return { status: 'active', canUserPlay: !isEditionEnCours, showGameFinishedBanner: false };
    }

    return { status: 'no_competition', canUserPlay: false, showGameFinishedBanner: false };
};