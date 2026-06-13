import { api } from '@/lib/api/client';
import { LearningConfiguration } from '@/lib/interfaces';
import { generateNumeromatch, normalizeConfigDates, showToast } from '@/lib/learning/configUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type ConfigStatus = 'pending' | 'active' | 'ended' | 'cancelled';
export type ToastType = 'success' | 'error' | 'info';

const ITEMS_PER_PAGE = 10;
const DEFAULT_FORM_STATUS = 'pending' as const;

export type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
};

export interface StatusConfigItem {
    color: string;
    bg: string;
    text: string;
    border: string;
    icon: string;
    label: string;
}

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

export function normalizeStatus(value: unknown): ConfigStatus {
    if (
        value === 'pending' ||
        value === 'active' ||
        value === 'ended' ||
        value === 'cancelled'
    ) {
        return value;
    }
    return DEFAULT_FORM_STATUS;
}

export function useLearningConfig() {
    const [configs, setConfigs] = useState<LearningConfiguration[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchConfigurations = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('learning-configurations');

            let configurations: LearningConfiguration[] = [];
            const data = response.data as { data?: LearningConfiguration[] };

            if (Array.isArray(data.data)) {
                configurations = data.data;
            } else {
                console.warn('Format de réponse inattendu:', response.data);
                configurations = [];
            }

            const normalized = configurations.map((config) =>
                normalizeConfigDates(config) as LearningConfiguration
            );

            setConfigs(normalized);
        } catch {
            showToast('Impossible de charger les configurations', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCreate = useCallback(async (data: Partial<LearningConfiguration>) => {
        try {
            const submitData = {
                ...data,
                numeromatch: data.numeromatch || generateNumeromatch(),
            };
            await api.post('learning-configurations', submitData);
            showToast('🎮 Configuration créée avec succès !', 'success');
            await fetchConfigurations();
            setIsCreating(false);
            setCurrentPage(1);
        } catch {
            showToast('Erreur lors de la création', 'error');
        }
    }, [fetchConfigurations]);

    const handleUpdate = useCallback(async (id: string, data: Partial<LearningConfiguration>) => {
        try {
            await api.patch(`learning-configurations/${id}`, data);
            showToast('✨ Configuration mise à jour !', 'success');
            await fetchConfigurations();
            setEditingId(null);
        } catch {
            showToast('Erreur lors de la mise à jour', 'error');
        }
    }, [fetchConfigurations]);

    const handleDelete = useCallback(async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
            return;
        }

        try {
            await api.delete(`learning-configurations/${id}`);
            showToast('🗑️ Configuration supprimée', 'success');
            await fetchConfigurations();

            const newTotalPages = Math.ceil((configs.length - 1) / ITEMS_PER_PAGE);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
        } catch {
            showToast('Erreur lors de la suppression', 'error');
        }
    }, [fetchConfigurations, configs.length, currentPage]);

    useEffect(() => {
        fetchConfigurations();
    }, [fetchConfigurations]);

    const totalPages = useMemo(() =>
        Math.max(1, Math.ceil(configs.length / ITEMS_PER_PAGE)),
        [configs.length]
    );

    const paginatedConfigs = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return configs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [configs, currentPage]);

    return {
        setEditingId, setIsCreating, setConfigs, handleCreate, handleUpdate, handleDelete, setCurrentPage,
        currentPage, totalPages, paginatedConfigs, configs, loading, editingId, isCreating,
    };
}