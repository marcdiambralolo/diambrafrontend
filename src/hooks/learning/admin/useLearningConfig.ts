import { api } from '@/lib/api/client';
import { LearningConfiguration } from '@/lib/interfaces';
import { generateNumeromatch, normalizeConfigDates, showToast } from '@/lib/learning/configUtils';
import { useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 1;
export type ToastType = 'success' | 'error' | 'info';

export type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
};

export type ConfigStatus = 'pending' | 'active' | 'ended' | 'cancelled';
export const DEFAULT_FORM_STATUS: ConfigStatus = 'pending';

export const statusConfig: Record<ConfigStatus,
    {
        color: string;
        bg: string;
        text: string;
        border: string;
        icon: string;
        label: string;
    }
> = {
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
};

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

    const fetchConfigurations = async () => {
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
    };

    const handleCreate = async (data: Partial<LearningConfiguration>) => {
        try {
            const submitData = {
                ...data,
                numeromatch: data.numeromatch || generateNumeromatch(),
            };
            await api.post('learning-configurations', submitData);
            showToast('🎮 Configuration créée avec succès !', 'success');
            await fetchConfigurations();
            setIsCreating(false);
        } catch {
            showToast('Erreur lors de la création', 'error');
        }
    };

    const handleUpdate = async (id: string, data: Partial<LearningConfiguration>) => {
        try {
            await api.patch(`learning-configurations/${id}`, data);
            showToast('✨ Configuration mise à jour !', 'success');
            await fetchConfigurations();
            setEditingId(null);
        } catch {
            showToast('Erreur lors de la mise à jour', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
            return;
        }

        try {
            await api.delete(`learning-configurations/${id}`);
            showToast('🗑️ Configuration supprimée', 'success');
            await fetchConfigurations();
        } catch {
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    useEffect(() => {
        fetchConfigurations();
    }, []);

    const totalPages = Math.max(1, Math.ceil(configs.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedConfigs = configs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
        setEditingId, setIsCreating, setConfigs, handleCreate, handleUpdate, handleDelete, setCurrentPage,
        currentPage, totalPages, paginatedConfigs, configs, loading, editingId, isCreating,
    };
}