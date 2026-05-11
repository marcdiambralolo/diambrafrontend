"use client";
import { SortField, SortOrder, useAdminBooksWithCache } from "@/hooks/admin/books/useAdminBooksWithCache";
import { AnimatePresence, motion,Variants } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, Filter, Loader2, MoreHorizontal, Plus, Search, Sparkles, X } from "lucide-react";
import React, { memo } from "react";
import { AdminBookCardBase } from "../commons/AdminBookCardBase";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};


// ==================== LOADING STATE PREMIUM ====================
const BooksLoading = memo(() => (
  <div className="flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-b from-white to-gray-50">
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm max-w-xs w-full mx-auto">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Loader2 className="mx-auto h-10 w-10 text-indigo-500" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm font-semibold text-gray-600"
      >
        Chargement des livres...
      </motion.p>
    </div>
  </div>
));

BooksLoading.displayName = 'BooksLoading';

// ==================== NO RESULTS STATE ====================
export function NoBooksResult() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl bg-white border border-gray-100 p-12 text-center shadow-sm"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
        <BookOpen className="h-8 w-8 text-indigo-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat</h3>
      <p className="text-gray-500">Essayez de modifier vos critères de recherche ou vos filtres</p>
    </motion.div>
  );
}

// ==================== PAGINATION PREMIUM ====================
interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const ElegantPagination: React.FC<PaginationProps> = ({ page, pageCount, onPageChange, className = "" }) => {
  if (pageCount <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", pageCount);
      } else if (page >= pageCount - 2) {
        pages.push(1, "...", pageCount - 3, pageCount - 2, pageCount - 1, pageCount);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", pageCount);
      }
    }
    return pages;
  };

  return (
    <nav className={`flex items-center justify-center gap-2 mt-8 ${className}`} aria-label="Pagination">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.button>

      {getPages().map((p, i) =>
        typeof p === "number" ? (
          <motion.button
            key={p}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`min-w-[36px] h-9 rounded-lg font-semibold transition-all duration-200
              ${p === page
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-indigo-600 border border-gray-200"
              }
            `}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </motion.button>
        ) : (
          <span key={"ellipsis-" + i} className="px-2 text-gray-400">
            <MoreHorizontal className="inline h-4 w-4" />
          </span>
        )
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </nav>
  );
};

// ==================== SEARCH INPUT ====================
interface BookSearchInputProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

export function BookSearchInput({ searchQuery, setSearchQuery }: BookSearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Rechercher par titre, auteur, description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ==================== FILTER BUTTON ====================
interface BookFilterPanelProps {
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
}

export function BookFilterPanel({ showFilters, setShowFilters }: BookFilterPanelProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setShowFilters(!showFilters)}
      className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${showFilters
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
        : "border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-600"
        }`}
    >
      <Filter className="h-4 w-4" />
      Filtres
      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
    </motion.button>
  );
}

// ==================== ERROR ALERT ====================
interface AdminBooksErrorAlertProps {
  error: string | null;
  onClose: () => void;
}

export const AdminBooksErrorAlert: React.FC<AdminBooksErrorAlertProps> = ({ error, onClose }) => (
  <AnimatePresence>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <button
            onClick={onClose}
            className="text-rose-500 transition-colors hover:text-rose-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ==================== HEADER PREMIUM ====================
interface AdminBooksHeaderProps {
  booksCount: number;
}

export const AdminBooksHeader: React.FC<AdminBooksHeaderProps> = ({ booksCount }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
    className="mb-8"
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5 mb-3">
          <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
            Administration
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
          Gestion des Livres
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez votre catalogue de <span className="font-bold text-indigo-600">{booksCount}</span> livre{booksCount > 1 ? "s" : ""} PDF
        </p>
      </div>

      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href="/admin/books/new"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg"
      >
        <Plus className="h-4 w-4" />
        Ajouter un livre
      </motion.a>
    </div>
  </motion.div>
);

// ==================== FILTERS PANEL CONTENT ====================
interface BookFiltersPanelContentProps {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (v: 'all' | 'active' | 'inactive') => void;
  sortField: SortField;
  setSortField: (v: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (v: SortOrder) => void;
  categories: string[];
  setSearchQuery: (v: string) => void;
}

export function BookFiltersPanelContent({
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  categories,
  setSearchQuery
}: BookFiltersPanelContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-5 pt-5 border-t border-gray-100"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Catégorie */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
            Catégorie
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Statut */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
            Statut
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs uniquement</option>
            <option value="inactive">Inactifs uniquement</option>
          </select>
        </div>

        {/* Tri */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
            Trier par
          </label>
          <div className="flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
            >
              <option value="title">Titre</option>
              <option value="pageCount">Nombre de pages</option>
              <option value="createdAt">Date d'ajout</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-indigo-200 hover:text-indigo-600"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bouton reset */}
      <div className="mt-5 flex justify-end">
        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setStatusFilter('all');
            setSortField('createdAt');
            setSortOrder('desc');
          }}
          className="text-xs font-medium text-gray-500 transition-colors hover:text-indigo-600"
        >
          Réinitialiser tous les filtres
        </button>
      </div>
    </motion.div>
  );
}

// ==================== FILTERS PRINCIPAL ====================
interface BookFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (v: 'all' | 'active' | 'inactive') => void;
  sortField: SortField;
  setSortField: (v: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (v: SortOrder) => void;
  categories: string[];
  filteredCount: number;
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  categories,
  filteredCount,
}) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
    className="mb-6"
  >
    <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <BookSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <BookFilterPanel showFilters={showFilters} setShowFilters={setShowFilters} />
      </div>

      <AnimatePresence>
        {showFilters && (
          <BookFiltersPanelContent
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            setSearchQuery={setSearchQuery}
          />
        )}
      </AnimatePresence>
    </div>

    {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all') && (
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        <span>
          <span className="font-bold text-gray-900">{filteredCount}</span> résultat{filteredCount > 1 ? 's' : ''} trouvé{filteredCount > 1 ? 's' : ''}
        </span>
      </div>
    )}
  </motion.div>
);

// ==================== COMPOSANT PRINCIPAL ====================
export default function AdminBooksPage() {
  const {
    pageSize, page, pageCount, paginatedBooks, books, isLoading, error, searchQuery,
    selectedCategory, sortOrder, statusFilter, sortField, showFilters, categories, filteredAndSortedBooks,
    setShowFilters, setSortOrder, setSortField, setStatusFilter, setSelectedCategory,
    setError, setSearchQuery, handleToggleActive, handleEditBook, setPage,
  } = useAdminBooksWithCache();

  if (isLoading) return <BooksLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <AdminBooksHeader booksCount={books.length} />

        {/* Error Alert */}
        <AdminBooksErrorAlert
          error={typeof error === 'string' ? error : (error ? String(error) : null)}
          onClose={() => setError(undefined)}
        />

        {/* Filtres (seulement si des livres existent) */}
        {books.length > 0 && (
          <BookFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            filteredCount={filteredAndSortedBooks.length}
          />
        )}

        {/* Liste des livres */}
        {filteredAndSortedBooks.length === 0 ? (
          <NoBooksResult />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {paginatedBooks.map((book, idx) => (
              <motion.div
                key={book._id || idx}
                variants={fadeInUp}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <AdminBookCardBase
                  book={book}
                  onToggleActive={handleToggleActive}
                  onEdit={handleEditBook}
                  index={idx + (page - 1) * pageSize}
                />
              </motion.div>
            ))}

            {/* Pagination */}
            <ElegantPagination
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
              className="mt-6"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}