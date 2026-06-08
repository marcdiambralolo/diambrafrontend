'use client';
import Loader from '@/app/admin/loading';
 import { LearningConfiguration } from '@/lib/interfaces';
import { AnimatePresence, LayoutGroup, motion, Reorder } from 'framer-motion';
import {
  CalendarIcon, ChevronLeft, ChevronRight,
  FlagIcon,
  GiftIcon, LockIcon, PencilIcon, PlusIcon, SparklesIcon, TrashIcon, TrophyIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ConfigForm from './ConfigForm';
import {  normalizeStatus, statusConfig, ToastItem, useLearningConfig } from '@/hooks/learning/admin/useLearningConfig';
import { formatDateFR } from '@/lib/learning/functions';

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const custom = e as CustomEvent<ToastItem & { duration: number }>;
      setToasts((prev) => [...prev, { id: custom.detail.id, message: custom.detail.message, type: custom.detail.type }]);
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
            <span className="text-lg">{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

function ConfigCard({ config, onEdit, onDelete, onEnd }: { 
  config: LearningConfiguration; 
  onEdit: () => void; 
  onDelete: () => void;
  onEnd?: () => void;
}) {
  const status = statusConfig[normalizeStatus(config.status)];
  const isEnded = config.status === 'ended';
  const isActive = config.isActive;

  // Mapping des types de jeu
  const getGameTypeLabel = (tpsglobal: number) => {
    switch (tpsglobal) {
      case 0: return { label: 'Nombre', icon: '🔢', color: 'bg-blue-100 text-blue-700' };
      case 1: return { label: 'Couleur', icon: '🎨', color: 'bg-purple-100 text-purple-700' };
      case 2: return { label: 'Image', icon: '🖼️', color: 'bg-green-100 text-green-700' };
      case 3: return { label: 'Lettre', icon: '🔤', color: 'bg-amber-100 text-amber-700' };
      case 4: return { label: 'Global', icon: '🌍', color: 'bg-rose-100 text-rose-700' };
      default: return { label: 'Inconnu', icon: '❓', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const gameType = getGameTypeLabel(config.tpsglobal ?? 0);
  const hasPieces = config.pieces && config.pieces.length > 0;

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
          <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
            <LockIcon className="w-3 h-3" />
            Terminée
          </div>
        )}
        
        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              {/* Badges */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <motion.div whileHover={{ scale: 1.03 }} className={`rounded-full border px-3 py-1 text-xs font-bold ${status.bg} ${status.text} ${status.border}`}>
                  <span className="mr-1">{status.icon}</span>
                  {status.label}
                </motion.div>
                
                <div className={`rounded-full px-3 py-1 text-xs font-bold ${gameType.color}`}>
                  <span className="mr-1">{gameType.icon}</span>
                  {gameType.label}
                </div>
                
                <div className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                  📊 Niveau {config.niveau ?? 2}
                </div>
                
                {isActive && (
                  <motion.div 
                    animate={{ scale: [1, 1.08, 1] }} 
                    transition={{ duration: 2, repeat: Infinity }} 
                    className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
                  >
                    ✅ ACTIF
                  </motion.div>
                )}
                
                {isEnded && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                    🔒 Lecture seule
                  </span>
                )}
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                {config.sequence && (
                  <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 p-3">
                    <span className="text-lg">🔢</span>
                    <div>
                      <div className="text-xs text-gray-500">Séquence</div>
                      <div className="font-mono text-sm font-semibold text-gray-800">{config.sequence}</div>
                    </div>
                  </div>
                )}
                
                {config.numeromatch && (
                  <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                    <span className="text-lg">🆔</span>
                    <div>
                      <div className="text-xs text-gray-500">Numéro de match</div>
                      <div className="font-mono text-sm font-semibold text-gray-800">{config.numeromatch}</div>
                    </div>
                  </div>
                )}
                
                {hasPieces && (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3">
                    <span className="text-lg">🧩</span>
                    <div>
                      <div className="text-xs text-gray-500">Pièces</div>
                      <div className="text-sm font-semibold text-gray-800">{config.pieces?.length} pièces</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-gray-600">
                  <CalendarIcon className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-xs text-gray-400">Début</div>
                    <div className="text-sm font-semibold">{formatDateFR(config.startgameDate)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-gray-600">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-gray-400">Fin</div>
                    <div className="text-sm font-semibold">{formatDateFR(config.endgameDate)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-gray-600">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-gray-400">Proclamation</div>
                    <div className="text-sm font-semibold">{formatDateFR(config.proclamationDate)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="ml-0 flex flex-col items-end gap-2 lg:ml-4">
              <div className="flex gap-2">
                {!isEnded && onEnd && (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={onEnd}
                    className="rounded-2xl p-3 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
                    title="Terminer l'édition"
                  >
                    <FlagIcon className="h-5 w-5" />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={!isEnded ? { scale: 1.08, rotate: 10 } : {}}
                  whileTap={!isEnded ? { scale: 0.92 } : {}}
                  onClick={onEdit}
                  disabled={isEnded}
                  className={`rounded-2xl p-3 transition-all ${isEnded ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  title={isEnded ? 'Cette édition est terminée et ne peut pas être modifiée' : 'Modifier'}
                >
                  <PencilIcon className="h-5 w-5" />
                </motion.button>
                
                <motion.button
                  whileHover={!isEnded ? { scale: 1.08, rotate: -10 } : {}}
                  whileTap={!isEnded ? { scale: 0.92 } : {}}
                  onClick={onDelete}
                  disabled={isEnded}
                  className={`rounded-2xl p-3 transition-all ${isEnded ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                  title={isEnded ? 'Cette édition est terminée et ne peut pas être supprimée' : 'Supprimer'}
                >
                  <TrashIcon className="h-5 w-5" />
                </motion.button>
              </div>
              
              {config.isActive && (
                <div className="text-xs text-green-600 font-medium mt-1">
                  ⚡ Édition active
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8 bg-red dark:bg-gray-800 p-4 rounded-lg">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 bg-orange-400 dark:border-gray-700 hover:bg-orange-400 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition ${page === currentPage
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
              : 'border  bg-green-400 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300  bg-orange-400 dark:border-gray-700 hover:bg-orange-400 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function LearningConfigurationManager() {
  const {
    setEditingId, setIsCreating, setConfigs, handleCreate, handleUpdate, handleDelete, setCurrentPage,
    currentPage, totalPages, paginatedConfigs, configs, loading, editingId, isCreating,
  } = useLearningConfig();

  const stats = [
    { label: 'Configurations', value: configs.length, icon: <TrophyIcon className="h-6 w-6" />, color: 'from-violet-500 via-purple-500 to-fuchsia-500', delay: 0 },
    { label: 'Actives', value: configs.filter((c) => c.isActive).length, icon: <SparklesIcon className="h-6 w-6" />, color: 'from-emerald-400 via-green-500 to-teal-500', delay: 0.1 },
    { label: 'Terminées', value: configs.filter((c) => c.status === 'ended').length, icon: <LockIcon className="h-6 w-6" />, color: 'from-gray-500 to-gray-600', delay: 0.2 },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#f5f3ff_100%)]">
      <ToastContainer />

      <div className="relative mx-auto max-w-8xl px-4 py-4 sm:px-6 lg:px-4 lg:py-8">
        <motion.div initial={{ opacity: 0, y: -28 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="overflow-hidden bg-white p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-2xl font-black tracking-tight text-transparent md:text-6xl">
                  COMPETITIONS
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
                  <div className="text-3xl font-black tracking-tight md:text-4xl">{stat.value}</div>
                  <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">{stat.icon}</div>
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-white/90">{stat.label}</div>
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
              <ConfigForm mode="create" onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <LayoutGroup>
          <Reorder.Group axis="y" values={paginatedConfigs} onReorder={setConfigs} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {paginatedConfigs.map((config) => (
                <Reorder.Item key={config._id} value={config}>
                  {editingId === config._id ? (
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="mb-4">
                      <ConfigForm
                        mode="edit"
                        initialData={config}
                        onSubmit={(data: Partial<LearningConfiguration>) => handleUpdate(config._id!, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    </motion.div>
                  ) : (
                    <ConfigCard config={config} onEdit={() => setEditingId(config._id!)} onDelete={() => handleDelete(config._id!)} />
                  )}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </LayoutGroup>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      </div>
    </div>
  );
}