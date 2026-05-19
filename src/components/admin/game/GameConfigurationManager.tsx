'use client';
import { api } from '@/lib/api/client';
import { GameConfiguration } from '@/lib/interfaces';
import { AnimatePresence, LayoutGroup, motion, Reorder } from 'framer-motion';
import {
  CalendarIcon,
  GiftIcon, PencilIcon, PlusIcon, SparklesIcon,
  TrashIcon, TrophyIcon, UsersIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ConfigForm from './ConfigForm';

let toastId = 0;

type ToastType = 'success' | 'error' | 'info';

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ConfigStatus = 'pending' | 'active' | 'ended' | 'cancelled';

type DateLike = Date | string | number | null | undefined;

const DEFAULT_FORM_STATUS: ConfigStatus = 'pending';

const statusConfig: Record<ConfigStatus,
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

function showToast(
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

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function toSafeDate(value: DateLike, fallback?: Date): Date {
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

function formatDateFR(value: DateLike): string {
  const date = toSafeDate(value, new Date());
  if (!isValidDate(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function normalizeStatus(value: unknown): ConfigStatus {
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

function normalizeConfigDates(
  config?: Partial<GameConfiguration> | null
): Partial<GameConfiguration> {
  return {
    ...config,
    startgameDate: toSafeDate(config?.startgameDate, new Date()),
    endgameDate: toSafeDate(
      config?.endgameDate,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ),
    prizePool: Number(config?.prizePool ?? 0),
    isActive: Boolean(config?.isActive),
    status: normalizeStatus(config?.status),
  };
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const custom = e as CustomEvent<ToastItem & { duration: number }>;
      setToasts((prev) => [
        ...prev,
        {
          id: custom.detail.id,
          message: custom.detail.message,
          type: custom.detail.type,
        },
      ]);
    };

    const handleClose = (e: Event) => {
      const custom = e as CustomEvent<{ id: number }>;
      setToasts((prev) => prev.filter((t) => t.id !== custom.detail.id));
    };

    window.addEventListener('toast', handleToast);
    window.addEventListener('toast-close', handleClose);

    return () => {
      window.removeEventListener('toast', handleToast);
      window.removeEventListener('toast-close', handleClose);
    };
  }, []);

  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.96 }}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-white shadow-2xl backdrop-blur-xl ${toast.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600'
              : toast.type === 'error'
                ? 'bg-gradient-to-r from-red-500 to-rose-600'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }`}
          >
            <span className="text-lg">
              {toast.type === 'success'
                ? '✅'
                : toast.type === 'error'
                  ? '❌'
                  : 'ℹ️'}
            </span>
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function GameConfigurationManager() {
  const [configs, setConfigs] = useState<GameConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    void fetchConfigurations();
  }, []);

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

  const stats = [
    {
      label: 'Configurations',
      value: configs.length,
      icon: <TrophyIcon className="h-6 w-6" />,
      color: 'from-violet-500 via-purple-500 to-fuchsia-500',
      delay: 0,
    },
    {
      label: 'Actives',
      value: configs.filter((c) => c.isActive).length,
      icon: <SparklesIcon className="h-6 w-6" />,
      color: 'from-emerald-400 via-green-500 to-teal-500',
      delay: 0.1,
    },
    {
      label: 'Cagnotte totale',
      value: `${configs
        .reduce((sum, c) => sum + Number(c.prizePool || 0), 0)
        .toLocaleString()}`,
      icon: <UsersIcon className="h-6 w-6" />,
      color: 'from-amber-400 via-yellow-500 to-orange-500',
      delay: 0.2,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#f5f3ff_100%)]">
      <ToastContainer />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob absolute -right-24 -top-24 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="overflow-hidden  bg-white  p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">
                  Editions
                </h1>
              </div>

              {!isCreating && (
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsCreating(true)}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-4 font-bold text-white shadow-xl"
                >
                  <div className="absolute inset-0 translate-x-full -skew-x-12 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-0" />
                  <div className="relative flex items-center gap-3">
                    <PlusIcon className="h-5 w-5" />
                    <span>Nouveau</span>
                    <GiftIcon className="h-5 w-5" />
                  </div>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay, type: 'spring', stiffness: 180 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${stat.color} p-6 text-white shadow-xl`}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="mb-3 flex items-start justify-between">
                  <div className="text-3xl font-black tracking-tight md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-white/90">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.28 }}
              className="mb-8"
            >
              <ConfigForm
                mode="create"
                onSubmit={handleCreate}
                onCancel={() => setIsCreating(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 animate-spin rounded-full border-b-4 border-purple-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <TrophyIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <p className="font-medium text-gray-500">
              Chargement des configurations...
            </p>
          </div>
        ) : (
          <LayoutGroup>
            <Reorder.Group
              axis="y"
              values={configs}
              onReorder={setConfigs}
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {configs.map((config) => (
                  <Reorder.Item key={config._id} value={config}>
                    {editingId === config._id ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className="mb-4"
                      >
                        <ConfigForm
                          mode="edit"
                          initialData={config}
                          onSubmit={(data: Partial<GameConfiguration>) =>
                            handleUpdate(config._id!, data)
                          }
                          onCancel={() => setEditingId(null)}
                        />
                      </motion.div>
                    ) : (
                      <ConfigCard
                        config={config}
                        onEdit={() => setEditingId(config._id!)}
                        onDelete={() => handleDelete(config._id!)}
                      />
                    )}
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </LayoutGroup>
        )}
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

function ConfigCard({
  config,
  onEdit,
  onDelete,
}: {
  config: GameConfiguration;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const status = statusConfig[normalizeStatus(config.status)];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      whileHover={{ y: -2 }}
      className="group relative"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-15" />

      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white/95 shadow-lg transition-all duration-300 hover:border-purple-200">
        <div className={`h-1.5 bg-gradient-to-r ${status.color}`} />

        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${status.bg} ${status.text} ${status.border}`}
                >
                  <span className="mr-1">{status.icon}</span>
                  {status.label}
                </motion.div>

                {config.isActive && (
                  <div className="flex items-center gap-1.5">
                    <div className="relative">
                      <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-400" />
                      <div className="relative h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
                      Live
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-gray-600">
                  <CalendarIcon className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-xs text-gray-400">Début</div>
                    <div className="text-sm font-semibold">
                      {formatDateFR(config.startgameDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-gray-600">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-gray-400">Fin</div>
                    <div className="text-sm font-semibold">
                      {formatDateFR(config.endgameDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-gray-600">
                  <TrophyIcon className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="text-xs text-emerald-500">Cagnotte</div>
                    <div className="text-lg font-bold text-emerald-600">
                      {Number(config.prizePool || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-0 flex flex-col items-end gap-2 lg:ml-4">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.08, rotate: 10 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onEdit}
                  className="rounded-2xl bg-blue-50 p-3 text-blue-600 transition-all hover:bg-blue-100"
                >
                  <PencilIcon className="h-5 w-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08, rotate: -10 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onDelete}
                  className="rounded-2xl bg-red-50 p-3 text-red-600 transition-all hover:bg-red-100"
                >
                  <TrashIcon className="h-5 w-5" />
                </motion.button>
              </div>

              {config.isActive && (
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600"
                >
                  ACTIF
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}