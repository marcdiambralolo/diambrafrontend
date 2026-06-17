
import { api } from '@/lib/api/client';
import { LearningConfiguration } from '@/lib/interfaces';
import { normalizeConfigDates } from '@/lib/learning/configUtils';
import { useState, useCallback } from 'react';

interface UseConfigApiReturn {
    fetchConfigurations: () => Promise<LearningConfiguration[]>;
    createConfiguration: (data: Partial<LearningConfiguration>) => Promise<LearningConfiguration | null>;
    updateConfiguration: (id: string, data: Partial<LearningConfiguration>) => Promise<LearningConfiguration | null>;
    deleteConfiguration: (id: string) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
}

export function useConfigApi(): UseConfigApiReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = useCallback((err: unknown, defaultMessage: string) => {
        const message = err instanceof Error ? err.message : defaultMessage;
        setError(message);

        console.error(message, err);
        return null;
    }, []);

    const fetchConfigurations = useCallback(async (): Promise<LearningConfiguration[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get('learning-configurations');
            const data = response.data as { data?: LearningConfiguration[] };

            if (!Array.isArray(data.data)) {
                console.warn('Format de réponse inattendu:', response.data);
                return [];
            }

            return data.data.map(config =>
                normalizeConfigDates(config) as LearningConfiguration
            );
        } catch (err) {
            handleError(err, 'Impossible de charger les configurations');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const createConfiguration = useCallback(async (
        data: Partial<LearningConfiguration>
    ): Promise<LearningConfiguration | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('learning-configurations', data);
            return response.data as LearningConfiguration;
        } catch (err) {
            handleError(err, 'Erreur lors de la création');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const updateConfiguration = useCallback(async (
        id: string,
        data: Partial<LearningConfiguration>
    ): Promise<LearningConfiguration | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.patch(`learning-configurations/${id}`, data);
            return response.data as LearningConfiguration;
        } catch (err) {
            handleError(err, 'Erreur lors de la mise à jour');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const deleteConfiguration = useCallback(async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            await api.delete(`learning-configurations/${id}`);
            return true;
        } catch (err) {
            handleError(err, 'Erreur lors de la suppression');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    return {
        fetchConfigurations,
        createConfiguration,
        updateConfiguration,
        deleteConfiguration,
        isLoading,
        error,
    };
}