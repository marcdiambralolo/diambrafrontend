'use client';
import { ConfigStatus, LearningConfiguration, StatusConfigItem } from '@/lib/interfaces';
import { generateNumeromatch } from '@/lib/learning/configUtils';
import { ITEMS_PER_PAGE } from '@/lib/learning/constantes';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useConfigApi } from './useConfigApi';
import { usePagination } from './usePagination';
import { useToast } from './useToast'; 

export const statusConfig: Record<ConfigStatus, StatusConfigItem> = {
    pending: {
        color: 'from-amber-400 to-yellow-500',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: '⏳',
        label: 'En attente',
    },
    active: {
        color: 'from-emerald-400 to-green-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: '⚡',
        label: 'Actif',
    },
    ended: {
        color: 'from-slate-400 to-gray-500',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        icon: '🏁',
        label: 'Terminé',
    },
    cancelled: {
        color: 'from-rose-400 to-red-500',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: '❌',
        label: 'Annulé',
    },
} as const;

export function useLearningConfig() {
    const [configs, setConfigs] = useState<LearningConfiguration[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isPending, startTransition] = useTransition();

    const { fetchConfigurations, createConfiguration, updateConfiguration, deleteConfiguration, isLoading, error } = useConfigApi();
    const { showToast } = useToast();
    const { currentPage, totalPages, paginatedItems, setCurrentPage } = usePagination(configs, ITEMS_PER_PAGE);

    const loadConfigs = useCallback(async () => {
        const data = await fetchConfigurations();
        if (data) {
            setConfigs(data);
        }
    }, [fetchConfigurations]);

    useEffect(() => {
        loadConfigs();
    }, [loadConfigs]);

    const handleCreate = useCallback(async (data: Partial<LearningConfiguration>) => {
        startTransition(async () => {
            const submitData = {
                ...data,
                numeromatch: data.numeromatch || generateNumeromatch(),
            };

            const result = await createConfiguration(submitData);
            if (result) {
                showToast('🎮 Configuration créée avec succès !', 'success');
                await loadConfigs();
                setIsCreating(false);
                setCurrentPage(1);
            }
        });
    }, [createConfiguration, loadConfigs, showToast, setCurrentPage]);

    const handleUpdate = useCallback(async (id: string, data: Partial<LearningConfiguration>) => {
        startTransition(async () => {
            const result = await updateConfiguration(id, data);
            if (result) {
                showToast('✨ Configuration mise à jour !', 'success');
                await loadConfigs();
                setEditingId(null);
            }
        });
    }, [updateConfiguration, loadConfigs, showToast]);

    const handleDelete = useCallback(async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
            return;
        }

        startTransition(async () => {
            const success = await deleteConfiguration(id);
            if (success) {
                showToast('🗑️ Configuration supprimée', 'success');
                await loadConfigs();

                const newTotalPages = Math.ceil((configs.length - 1) / ITEMS_PER_PAGE);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
            }
        });
    }, [deleteConfiguration, loadConfigs, showToast, configs.length, currentPage, setCurrentPage]);

    const refreshConfigs = useCallback(async () => {
        await loadConfigs();
    }, [loadConfigs]);

    return {
        configs,
        loading: isLoading || isPending,
        error,
        editingId,
        isCreating,
        isPending,
        currentPage,
        totalPages,
        paginatedConfigs: paginatedItems,
        setCurrentPage,
        setEditingId,
        setIsCreating,
        handleCreate,
        handleUpdate,
        handleDelete,
        refreshConfigs,
        setConfigs
    };
}

interface ConfigStats {
    total: number;
    active: number;
    pending: number;
    ended: number;
    cancelled: number;
    activePercentage: number;
}

export function useConfigStats(configs: LearningConfiguration[]): ConfigStats {
    return useMemo(() => {
        const total = configs.length;
        const active = configs.filter(c => c.status === 'active').length;
        const pending = configs.filter(c => c.status === 'pending').length;
        const ended = configs.filter(c => c.status === 'ended').length;
        const cancelled = configs.filter(c => c.status === 'cancelled').length;

        return {
            total,
            active,
            pending,
            ended,
            cancelled,
            activePercentage: total > 0 ? (active / total) * 100 : 0,
        };
    }, [configs]);
}

export { useLearningConfig as default };