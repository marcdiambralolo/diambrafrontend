import { api } from "@/lib/api/client";
import { GameConfiguration } from "@/lib/interfaces";
import { useEffect, useState } from "react";

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return mins > 0
        ? `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`
        : `${secs}.${tenths}s`;
};

let toastId = 0;
export type ToastType = 'success' | 'error' | 'info';

export type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
};

export type ConfigStatus = 'pending' | 'active' | 'ended' | 'cancelled';

export type DateLike = Date | string | number | null | undefined;

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

export function buildDefaultForm(): Partial<GameConfiguration> {
  return {
    startgameDate: new Date(),
    endgameDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: false,
    status: DEFAULT_FORM_STATUS,
  };
}

export function formatDateFR(value: DateLike): string {
    const date = toSafeDate(value, new Date());
    if (!isValidDate(date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}` + " à " + `${hour}:${minute}:${second}`;
}

export function showToast(
    message: string,
    type: ToastType = 'info',
    duration = 3000
) {
    const id = ++toastId;
    const event = new CustomEvent('toast', {
        detail: { id, message, type, duration },
    });
    window.dispatchEvent(event);

    setTimeout(() => {
        const closeEvent = new CustomEvent('toast-close', { detail: { id } });
        window.dispatchEvent(closeEvent);
    }, duration);

    return id;
}

export function isValidDate(value: unknown): value is Date {
    return value instanceof Date && !Number.isNaN(value.getTime());
}

export function toSafeDate(value: DateLike, fallback?: Date): Date {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return new Date(value);
    }

    if (typeof value === 'string' || typeof value === 'number') {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed;
        }
    }

    return fallback ? new Date(fallback) : new Date();
}

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

export function normalizeConfigDates(
    config?: Partial<GameConfiguration> | null
): Partial<GameConfiguration> {
    return {
        ...config,
        startgameDate: toSafeDate(config?.startgameDate, new Date()),
        endgameDate: toSafeDate(
            config?.endgameDate,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ),
        isActive: Boolean(config?.isActive),
        status: normalizeStatus(config?.status),
    };
}

export function useGameConfig() {
    const [configs, setConfigs] = useState<GameConfiguration[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const fetchConfigurations = async () => {
        try {
            setLoading(true);
            const response = await api.get('game-configurations');
            const normalized = (response.data as GameConfiguration[]).map((config) =>
                normalizeConfigDates(config) as GameConfiguration
            );
            setConfigs(normalized);
        } catch {
            showToast('Impossible de charger les configurations', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: Partial<GameConfiguration>) => {
        try {
            await api.post('game-configurations', data);
            showToast('🎮 Configuration créée avec succès !', 'success');
            await fetchConfigurations();
            setIsCreating(false);
        } catch {
            showToast('Erreur lors de la création', 'error');
        }
    };

    const handleUpdate = async (id: string, data: Partial<GameConfiguration>) => {
        try {
            await api.put(`game-configurations/${id}`, data);
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
            await api.delete(`game-configurations/${id}`);
            showToast('🗑️ Configuration supprimée', 'success');
            await fetchConfigurations();
        } catch {
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    useEffect(() => {
        void fetchConfigurations();
    }, []);

    return {
        configs, loading, editingId, isCreating, setEditingId,
        setIsCreating, setConfigs, handleCreate, handleUpdate, handleDelete,
    };
}