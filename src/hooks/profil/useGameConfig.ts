import { api } from "@/lib/api/client";
import { GameConfiguration } from "@/lib/interfaces";
import { useState, useCallback, useEffect } from "react";

interface UseGameConfigReturn {
    data: GameConfiguration | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useGameConfig(): UseGameConfigReturn {
    const [data, setData] = useState<GameConfiguration | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchConfig = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get('game-configurations/current-config');
            setData(response.data as GameConfiguration);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Erreur lors du chargement de la configuration'));
            console.error('Erreur useGameConfig:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    return { data, isLoading, error, refetch: fetchConfig };
}