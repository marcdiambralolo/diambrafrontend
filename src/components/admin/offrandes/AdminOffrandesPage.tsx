"use client";
import OffrandesStats from '@/components/admin/offrandes/stats/OffrandesStats';
import { CONSTANTS, SortKey, useAdminOffrandes, ViewMode } from '@/hooks/admin/offrandes/useAdminOffrandes';
import { CATEGORIES_OFFRANDES } from '@/lib/constants';
import { Offering } from '@/lib/interfaces';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Plus, RotateCcw, ShoppingBag, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useMemo } from 'react';

interface Category {
    value: string;
    label: string;
    color: string;
    emoji: string;
}

const OffrandesPagination = memo(({
    page,
    totalPages,
    onPageChange
}: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) => {

    const getPageNumbers = useCallback(() => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        if (totalPages <= 1) return null;

        return pages;
    }, [page, totalPages]);

    return (
        <div className="flex justify-center items-center mt-8">
            <nav className="flex items-center gap-1 rounded-full bg-white dark:bg-[#0F1C3F] border border-slate-200 dark:border-slate-700 px-2 py-1 shadow-sm">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={page === 1}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                    aria-label="Première page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                    aria-label="Page précédente"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers()?.map((p, idx) => (
                        p === '...' ? (
                            <span key={`dots-${idx}`} className="px-2 text-slate-400">...</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p as number)}
                                className={`min-w-[32px] h-8 rounded-full text-sm font-medium transition ${page === p
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {p}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                    aria-label="Page suivante"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={page === totalPages}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                    aria-label="Dernière page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </nav>
        </div>
    );
});

const OffrandesLoading = memo(() => (
    <div className="flex items-center justify-center min-h-[40vh] w-full">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
            />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Chargement des offrandes...
            </p>
        </motion.div>
    </div>
));

// Fonction utilitaire pour sécuriser l'URL de l'image
const getImageUrl = (url: string | undefined) => {
    if (!url) return null;
    // Si l'URL est déjà une URL d'image valide
    if (url.startsWith('http') && url.match(/^https?:\/\/.+\/.+\.(jpg|jpeg|png|webp|gif)$/i)) {
        return url;
    }
    // Sinon, essayer de corriger
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const fileName = pathParts.pop();
        if (fileName) {
            const encodedFileName = encodeURIComponent(fileName);
            pathParts.push(encodedFileName);
            urlObj.pathname = pathParts.join('/');
            return urlObj.toString();
        }
        return url;
    } catch {
        return url;
    }
};

const OffrandesCard = memo(({
    offering,
    category,
    onEdit,
    index
}: {
    offering: Offering;
    category: Category | undefined;
    onEdit: (offering: Offering) => void;
    index: number;
}) => {
    const imageUrl = getImageUrl(offering.illustrationUrl);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-2xl bg-white dark:bg-[#0F1C3F] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
            {/* Badge de catégorie */}
            <div className="absolute top-3 left-3 z-10">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${category?.color} bg-opacity-20`}>
                    <span>{category?.emoji}</span>
                    <span>{category?.label}</span>
                </span>
            </div>

            {/* Image */}
            <div className="relative h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={offering.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={true}
                        onError={(e: any) => {
                            // Fallback si l'image ne charge pas
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="w-16 h-16 text-slate-400 dark:text-slate-600" />
                    </div>
                )}
            </div>

            {/* Contenu */}
            <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 line-clamp-1">
                    {offering.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {offering.description}
                </p>

                {/* Prix */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-500">Prix</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                            {offering.price.toLocaleString()} F
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 dark:text-slate-500">USD</p>
                        <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                            ${offering.priceUSD}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => onEdit(offering)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition"
                    >
                        <Edit className="w-3.5 h-3.5" />
                        Modifier
                    </button>
                </div>
            </div>
        </motion.div>
    );
});

const OffrandesList = memo(({
    offerings,
    onEdit
}: {
    offerings: Offering[];
    onEdit: (offering: Offering) => void;
}) => {
    if (!offerings?.length) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offerings.map((offering, index) => {
                const category = CATEGORIES_OFFRANDES.find(c => c.value === offering.category);
                return (
                    <OffrandesCard
                        key={offering.id || index}
                        offering={offering}
                        category={category}
                        onEdit={onEdit}
                        index={index}
                    />
                );
            })}
        </div>
    );
});

const OffrandesSortBar = memo(({
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder
}: {
    sortKey: SortKey;
    setSortKey: (key: SortKey) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;
}) => {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Trier par :
                </label>
                <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1C3F] px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="name">Nom</option>
                    <option value="price">Prix</option>
                    <option value="category">Catégorie</option>
                </select>
            </div>

            <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1C3F] text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
                {sortOrder === 'asc' ? '↑ Croissant' : '↓ Décroissant'}
            </button>
        </div>
    );
});

OffrandesSortBar.displayName = 'OffrandesSortBar';

const OffrandesCategoriesSummary = memo(({
    categories,
    offerings
}: {
    categories: Category[];
    offerings: Offering[];
}) => {
    const stats = useMemo(() => {
        return categories.map(cat => ({
            ...cat,
            count: offerings.filter(o => o.category === cat.value).length,
            total: offerings.filter(o => o.category === cat.value).reduce((sum, o) => sum + o.price, 0),
        }));
    }, [categories, offerings]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((cat) => (
                <motion.div
                    key={cat.value}
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-2xl p-4 bg-gradient-to-br ${cat.color} text-white shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{cat.emoji}</span>
                        <div className="text-right">
                            <div className="text-2xl font-black">{cat.count}</div>
                            <div className="text-xs opacity-90">articles</div>
                        </div>
                    </div>
                    <p className="text-sm font-bold opacity-90">{cat.label}</p>
                    <p className="text-xs opacity-75 mt-1">{cat.total.toLocaleString()} F</p>
                </motion.div>
            ))}
        </div>
    );
});

const EmptyState = memo(({ onAdd }: { onAdd: () => void }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center"
    >
        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Aucune offrande
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Commencez par ajouter votre première offrande
        </p>
        <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 font-bold text-white shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition"
        >
            <Plus className="w-4 h-4" />
            Ajouter une offrande
        </button>
    </motion.div>
));

const OffrandesTabs = memo(({
    activeTab,
    onTabChange
}: {
    activeTab: ViewMode;
    onTabChange: (tab: ViewMode) => void;
}) => {
    const tabs = [
        { id: 'gestion' as const, label: 'Gestion', icon: ShoppingBag, emoji: '🛍️' },
        { id: 'stats' as const, label: 'Statistiques', icon: TrendingUp, emoji: '📊' },
    ];

    return (
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === tab.id
                        ? 'bg-white dark:bg-[#0F1C3F] text-indigo-600 dark:text-indigo-400 shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700'
                        }`}
                >
                    <span className="text-lg">{tab.emoji}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
});

export default function AdminOffrandesPage() {
    const {
        setSortOrder, setSortKey, setErrorMessage, handleEdit, handleAdd,
        handleRefresh, setPage, setActiveTab,
        offerings, statsData, loading, statsLoading, successMessage, errorMessage,
        activeTab, sortKey, sortOrder, page, totalPages, paginatedOfferings,
    } = useAdminOffrandes();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Offrandes
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Gérez vos offrandes et suivez les ventes
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={loading || statsLoading}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1C3F] px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
                            >
                                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Rafraîchir
                            </button>
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2 text-sm font-bold text-white shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition"
                            >
                                <Plus className="w-4 h-4" />
                                Nouvelle offrande
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Messages */}
                <AnimatePresence>
                    {(successMessage || errorMessage) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-6 p-4 rounded-xl ${successMessage
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${successMessage
                                    ? 'text-emerald-800 dark:text-emerald-300'
                                    : 'text-rose-800 dark:text-rose-300'
                                    }`}>
                                    {successMessage || errorMessage}
                                </p>
                                <button
                                    onClick={() => setErrorMessage(null)}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tabs */}
                <OffrandesTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Contenu */}
                <AnimatePresence mode="wait">
                    {activeTab === 'gestion' ? (
                        <motion.div
                            key="gestion"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: CONSTANTS.ANIMATION_DURATION }}
                        >
                            <OffrandesCategoriesSummary categories={CATEGORIES_OFFRANDES} offerings={offerings} />

                            <OffrandesSortBar
                                sortKey={sortKey}
                                setSortKey={setSortKey}
                                sortOrder={sortOrder}
                                setSortOrder={setSortOrder}
                            />

                            {loading ? (
                                <OffrandesLoading />
                            ) : offerings.length === 0 ? (
                                <EmptyState onAdd={handleAdd} />
                            ) : (
                                <>
                                    <OffrandesList offerings={paginatedOfferings} onEdit={handleEdit} />
                                    <OffrandesPagination page={page} totalPages={totalPages} onPageChange={setPage} />
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: CONSTANTS.ANIMATION_DURATION }}
                        >
                            <div className="bg-white dark:bg-[#0F1C3F] rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        📊 Statistiques des ventes
                                    </h2>
                                </div>
                                {statsLoading ? (
                                    <OffrandesLoading />
                                ) : statsData ? (
                                    <OffrandesStats statsData={statsData} />
                                ) : (
                                    <EmptyState onAdd={handleAdd} />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}