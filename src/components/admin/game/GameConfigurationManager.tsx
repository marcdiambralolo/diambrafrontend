'use client';
import { buildDefaultForm, ConfigStatus, formatDateFR, normalizeConfigDates, normalizeStatus, showToast, statusConfig, ToastItem, toSafeDate, useGameConfig } from '@/hooks/game/useGameConfig';
import { GameConfiguration } from '@/lib/interfaces';
import { AnimatePresence, LayoutGroup, motion, Reorder } from 'framer-motion';
import {
  CalendarIcon, CheckIcon,
  GiftIcon,
  LockIcon,
  PencilIcon, PlusIcon, SparklesIcon, TrashIcon, TrophyIcon,
  XIcon
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { CustomDateTimePicker } from "./CustomPicker";

export function ConfigForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit';
  initialData?: Partial<GameConfiguration>;
  onSubmit: (data: Partial<GameConfiguration>) => void;
  onCancel: () => void;
}) {
  const initialForm = useMemo(
    () => normalizeConfigDates(initialData ?? buildDefaultForm()),
    [initialData]
  );

  const [formData, setFormData] = useState<Partial<GameConfiguration>>(initialForm);
  const isEnded = initialData?.status === 'ended';

  useEffect(() => {
    setFormData(initialForm);
  }, [initialForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEnded) {
      showToast('Les éditions terminées ne peuvent pas être modifiées', 'error');
      return;
    }

    const startDate = toSafeDate(formData.startgameDate, new Date());
    const endDate = toSafeDate(
      formData.endgameDate,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    if (endDate.getTime() < startDate.getTime()) {
      showToast('La date de fin doit être postérieure à la date de début', 'error');
      return;
    }

    onSubmit({
      ...formData,
      startgameDate: startDate,
      endgameDate: endDate,
      status: normalizeStatus(formData.status),
      isActive: Boolean(formData.isActive),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="overflow-hidden rounded-[30px] border border-purple-200 bg-white shadow-[0_24px_80px_rgba(99,102,241,0.12)]"
    >
      {isEnded && (
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-white">
            <LockIcon className="w-5 h-5" />
            <span className="text-sm font-semibold">Cette édition est terminée et ne peut plus être modifiée</span>
          </div>
        </div>
      )}

      <div className={`px-6 py-5 ${isEnded ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'}`}>
        <h3 className="text-xl font-black text-white md:text-2xl">
          {mode === 'create'
            ? '✨ Nouvelle Configuration'
            : isEnded
              ? '🔒 Édition Terminée (Lecture seule)'
              : '✏️ Modifier la Configuration'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              📅 Date de début
            </label>
            <CustomDateTimePicker
              selected={formData.startgameDate}
              onChange={(date: Date) =>
                !isEnded && setFormData((prev) => ({ ...prev, startgameDate: date }))
              }
              minDate={new Date()}
              placeholder="Sélectionner la date et l'heure"
              disabled={isEnded}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              🏁 Date de fin
            </label>
            <CustomDateTimePicker
              selected={formData.endgameDate}
              onChange={(date: Date) =>
                !isEnded && setFormData((prev) => ({ ...prev, endgameDate: date }))
              }
              minDate={new Date()}
              placeholder="Sélectionner la date et l'heure"
              disabled={isEnded}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              📊 Status
            </label>
            <select
              value={normalizeStatus(formData.status)}
              onChange={(e) =>
                !isEnded && setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as ConfigStatus,
                }))
              }
              disabled={isEnded}
              className={`w-full rounded-2xl border-2 px-4 py-3 transition-all focus:ring-4 ${isEnded
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'
                }`}
            >
              <option value="pending">⏳ En attente</option>
              <option value="active">⚡ Actif</option>
              <option value="ended">🏁 Terminé</option>
              <option value="cancelled">❌ Annulé</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            ✅ Active
          </label>
          <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${isEnded
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-200 hover:bg-gray-50'
            }`}>
            <input
              type="checkbox"
              checked={Boolean(formData.isActive)}
              onChange={(e) =>
                !isEnded && setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
              disabled={isEnded}
              className="h-5 w-5 rounded-lg text-purple-600 focus:ring-purple-500 disabled:opacity-50"
            />
            <span className={`font-medium ${isEnded ? 'text-gray-400' : 'text-gray-700'}`}>
              Configuration active
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          {!isEnded && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg"
            >
              <CheckIcon className="h-5 w-5" />
              {mode === 'create' ? 'Créer' : 'Mettre à jour'}
            </motion.button>
          )}

          {isEnded && (
            <div className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3 font-bold text-gray-400">
              <LockIcon className="h-5 w-5" />
              Non modifiable
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-200"
          >
            <XIcon className="h-5 w-5" />
            Annuler
          </motion.button>
        </div>
        <br />  <br />  <br />  <br />  <br />  <br />  <br />  <br />  <br />  <br />  <br />
        <br />  <br />  <br />  <br />  <br />  <br />  <br />  <br />  <br />  <br />  <br />
      </form>
    </motion.div>
  );
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
  const isEnded = config.status === 'ended';

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

        {isEnded && (
          <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <LockIcon className="w-3 h-3" />
            Terminée
          </div>
        )}

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
                {isEnded && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                    Lecture seule
                  </span>
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
              </div>
            </div>

            <div className="ml-0 flex flex-col items-end gap-2 lg:ml-4">
              <div className="flex gap-2">
                <motion.button
                  whileHover={!isEnded ? { scale: 1.08, rotate: 10 } : {}}
                  whileTap={!isEnded ? { scale: 0.92 } : {}}
                  onClick={onEdit}
                  disabled={isEnded}
                  className={`rounded-2xl p-3 transition-all ${isEnded
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  title={isEnded ? 'Cette édition est terminée et ne peut pas être modifiée' : 'Modifier'}
                >
                  <PencilIcon className="h-5 w-5" />
                </motion.button>

                <motion.button
                  whileHover={!isEnded ? { scale: 1.08, rotate: -10 } : {}}
                  whileTap={!isEnded ? { scale: 0.92 } : {}}
                  onClick={onDelete}
                  disabled={isEnded}
                  className={`rounded-2xl p-3 transition-all ${isEnded
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  title={isEnded ? 'Cette édition est terminée et ne peut pas être supprimée' : 'Supprimer'}
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

export default function GameConfigurationManager() {
  const {
    configs, loading, editingId, isCreating, setEditingId,
    setIsCreating, setConfigs, handleCreate, handleUpdate, handleDelete,
  } = useGameConfig();

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
      label: 'Terminées',
      value: configs.filter((c) => c.status === 'ended').length,
      icon: <LockIcon className="h-6 w-6" />,
      color: 'from-gray-500 to-gray-600',
      delay: 0.2,
    },
  ];

  return (
    <div className="w-full bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#f5f3ff_100%)]">
      <ToastContainer />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="overflow-hidden bg-white p-6 md:p-8">
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
    </div>
  );
}