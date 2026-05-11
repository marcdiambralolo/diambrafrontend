'use client';
import { useBooksWithCache } from '@/hooks/cache/useBooksWithCache';
import { cx } from '@/lib/functions';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Image from "next/image";
import { useMemo } from 'react';
import { BookOpen, Loader2, XCircle } from 'lucide-react';
import { memo } from 'react';

export function BooksError({ error }: { error: string }) {
  return (
    <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
      <p className="text-red-700 font-semibold">{error}</p>
      <p className="mt-2 text-sm text-red-500">Veuillez réessayer plus tard</p>
    </div>
  );
}

export function BooksListLoading() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-700 font-semibold">Chargement des livres...</p>
      </div>
    </div>
  );
}

export const SkeletonCard = memo(function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 0.75, 0.4] }}
      transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.1 }}
      className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <div className="h-56 bg-slate-200/70 dark:bg-white/10" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-16 rounded-xl bg-slate-100/80 dark:bg-white/5" />
        <div className="h-8 rounded-xl bg-slate-200/60 dark:bg-white/10" />
      </div>
    </motion.div>
  );
});

export const EmptyState = memo(function EmptyState() {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300/60 bg-white/50 py-20 text-center dark:border-white/10 dark:bg-white/3"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/10 dark:to-orange-500/10">
        <BookOpen className="h-8 w-8 text-amber-500/70 dark:text-amber-400/60" />
      </div>

      <div>
        <p className="text-base font-extrabold text-slate-700 dark:text-white/70">
          Aucun livre disponible
        </p>
        <p className="mt-1 text-[12px] text-slate-400 dark:text-white/30">
          La bibliothèque est vide pour le moment. Revenez bientôt !
        </p>
      </div>
    </div>
  );
});

export const BookNotFound = ({ error, onBack }: { error?: string; onBack: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-[#162A56] flex items-center justify-center p-4">
    <div className="text-center">
      <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />

      <p className="text-white font-bold">{error ?? 'Livre introuvable.'}</p>
      <button
        onClick={onBack}
        className="mt-4 px-5 py-2 rounded-xl bg-white/10 text-white text-[13px] hover:bg-white/20 transition-colors"
      >
        Retour au catalogue
      </button>
    </div>
  </div>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function PaginationLivres({
  currentPage,
  totalPages,
  total,
  itemsPerPage,
  onPageChange,
  loading = false,
}: PaginationProps) {
  const getVisiblePageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm dark:border-[color:var(--theme-border)] dark:bg-[#0F1C3F] mt-8"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {((currentPage - 1) * itemsPerPage) + 1}
          </span>
          {' - '}
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {Math.min(currentPage * itemsPerPage, total)}
          </span>
          {' sur '}
          <span className="font-bold text-gray-900 dark:text-gray-100">{total}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {getVisiblePageNumbers.map((page, index) => (
              page === '...'
                ? <span key={`ellipsis-${index}`} className="px-1.5 text-gray-400 text-[10px]">•••</span>
                : <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className={`min-w-[28px] px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${page === currentPage ? 'scale-105 bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] text-white shadow-md' : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#13274C]'} disabled:opacity-30`}
                >
                  {page}
                </button>
            ))}
          </div>

          <div className="rounded-lg bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-2.5 py-1 text-[10px] font-bold text-white shadow-md sm:hidden">
            {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="p-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronsRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function LivresPageClient() {
  const {
    safeSetPage, handlePurchase, isLoading, books, error, errorMsg,
    paginatedBooks, page, totalPages, total, itemsPerPage,
  } = useBooksWithCache();

  if (isLoading) return <BooksListLoading />;
  if (error) return <BooksError error={errorMsg} />;
  if (books.length === 0) return <EmptyState />;

  return (
    <div className="max-w-2xl mx-auto px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-black dark:text-white">
            LIBRAIRIE ESOTHERIQUE
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {paginatedBooks.length === 0
          ? Array.from({ length: itemsPerPage }).map((_, i) => (
            <SkeletonCard key={i} index={i} />
          ))
          : paginatedBooks.map((book) => (
            <div
              key={book.id || book._id || book.title}
              className={cx(
                "group overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)]",
                "transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_-34px_rgba(15,23,42,0.4)]"
              )}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[28px] bg-slate-100">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width:768px)100vw,33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl text-slate-300">
                    <span>📚</span>
                  </div>
                )}
              </div>

              <div className="px-2 pb-2 pt-4">
                <h3 className="text-lg font-black tracking-tight text-slate-950">
                  {book.title}
                </h3>

                {book.subtitle ? (
                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
                    {book.subtitle}
                  </p>
                ) : null}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handlePurchase(book)}
                    className={cx(
                      "rounded-xl px-5 py-2",
                      "text-base font-extrabold tracking-wide text-white",
                      "bg-slate-900 transition-all duration-300 hover:scale-105 hover:bg-slate-800"
                    )}
                  >
                    <span>Consulter</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <PaginationLivres
        currentPage={page}
        totalPages={totalPages}
        total={total!}
        itemsPerPage={itemsPerPage}
        onPageChange={safeSetPage}
        loading={isLoading}
      />
    </div>
  );
}