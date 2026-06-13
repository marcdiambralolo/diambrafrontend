'use client';
import { useCallback, useEffect, useRef, useState } from "react";
import { CompetitionInfo } from "@/lib/interfaces";

interface ValidationMessage {
    text: string;
    type: 'success' | 'error';
}

const PERMANENT_MESSAGE_DURATION = 10000;
const STORAGE_PREFIX = 'validated_competition_';

const getValidationStorageKey = (competitionId: string): string => `${STORAGE_PREFIX}${competitionId}`;

const formatCompetitionDate = (dateStr?: string): string => {
    if (!dateStr) return 'Non définie';
    try {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleString();
    } catch {
        return 'Date invalide';
    }
};

export const useCompetitionValidation = (
    onValidate: (competition: CompetitionInfo) => Promise<boolean>,
    competition: CompetitionInfo
) => {
    const [isLocalValidating, setIsLocalValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState<ValidationMessage | null>(null);
    const [isValidated, setIsValidated] = useState(competition.isValidated);
    const [showPermanentMessage, setShowPermanentMessage] = useState(competition.isValidated);
    const permanentMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const storageKey = getValidationStorageKey(competition.id);
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === storageKey) {
                const newValue = e.newValue === 'true';
                setIsValidated(newValue);
                if (newValue) setShowPermanentMessage(true);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [competition.id]);

    useEffect(() => {
        return () => {
            if (permanentMessageTimeoutRef.current) clearTimeout(permanentMessageTimeoutRef.current);
        };
    }, []);

    const handleValidate = useCallback(async () => {
        if (isLocalValidating || !competition.matchInfo?.length || isValidated) return;

        setIsLocalValidating(true);
        setValidationMessage(null);

        const success = await onValidate(competition);

        if (success) {
            setValidationMessage({ text: '✅ Compétition validée avec succès !', type: 'success' });
            setIsValidated(true);
            localStorage.setItem(getValidationStorageKey(competition.id), 'true');
            setShowPermanentMessage(true);

            if (permanentMessageTimeoutRef.current) clearTimeout(permanentMessageTimeoutRef.current);
            permanentMessageTimeoutRef.current = setTimeout(() => {
                setShowPermanentMessage(false);
            }, PERMANENT_MESSAGE_DURATION);
        } else {
            setValidationMessage({ text: '❌ Erreur lors de la validation. Veuillez réessayer.', type: 'error' });
        }

        setIsLocalValidating(false);
    }, [competition, isLocalValidating, isValidated, onValidate]);

    const handleCloseMessage = useCallback(() => setValidationMessage(null), []);
    const handleClosePermanentMessage = useCallback(() => setShowPermanentMessage(false), []);
    
    const clearValidationStatus = useCallback(() => {
        localStorage.removeItem(getValidationStorageKey(competition.id));
        setIsValidated(false);
        setShowPermanentMessage(false);
        setValidationMessage(null);
    }, [competition.id]);

    return {
        isLoading: isLocalValidating, validationMessage, handleClosePermanentMessage, clearValidationStatus,
        formattedStartDate: formatCompetitionDate(competition.datedebut),
        formattedFinishedDate: competition.datefin ? formatCompetitionDate(competition.datefin) : null,
        handleValidate, handleCloseMessage, isValidated, showPermanentMessage,       
    };
};