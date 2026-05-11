'use client';
import type { ArticleMutationInput } from '@/hooks/admin/blog/useBlogAdminArticlesWithCache';
import { ArticleHelpers, useBlogAdminArticlesWithCache } from '@/hooks/admin/blog/useBlogAdminArticlesWithCache';
import type { Article } from '@/lib/interfaces';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, ImageIcon, Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import type { ArticleMutationInput as ArticleInput } from '@/hooks/admin/blog/useBlogAdminArticlesWithCache';
import { useEditorDrawerForm } from '@/hooks/admin/blog/useEditorDrawerForm';
import { FileUp } from 'lucide-react';

type ContentFieldProps = {
  value: string;
  onChange: (v: string) => void;
};

export function ContentField({ value, onChange }: ContentFieldProps) {

  return (
    <div>
      <label className="text-xs font-extrabold text-slate-700">Contenu</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={14}
        placeholder={`Écris ton article ici…\n\nAstuce : une ligne = retour chariot, une ligne vide = nouveau paragraphe.`}
        className="mt-1 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#4F83D1]/40 focus:border-[#4F83D1]"
      />

      <div className="mt-1 text-[11px] text-slate-500">Les retours chariot sont conservés à l’enregistrement</div>
    </div>
  );
}

type TitleFieldProps = {
  value: string;
  onChange: (v: string) => void;
};

export function TitleField({ value, onChange }: TitleFieldProps) {

  return (
    <div>
      <label className="text-xs font-extrabold text-slate-700">Titre</label>

      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Titre de l'article…"
        className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#4F83D1]/40 focus:border-[#4F83D1]"
      />
      <div className="mt-1 text-[11px] text-slate-500">Minimum 4 caractères.</div>
    </div>
  );
}

type IllustrationFieldProps = {
  previewUrl: string | null;
  onChange: (file: File | null) => void;
};

export function IllustrationField({ previewUrl, onChange }: IllustrationFieldProps) {

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold text-slate-700">Illustration</div>
          <div className="mt-1 text-[11px] text-slate-500">Optionnel. Formats image classiques (jpg/png/webp).</div>
        </div>
        <label
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white hover:bg-slate-800 cursor-pointer"
          title="Choisir une image"
        >
          <FileUp className="h-4 w-4" />
          Choisir
          <input
            type="file"
            accept="image/*"
            onChange={e => onChange(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        {previewUrl ? (
          <div className="relative h-52 w-full">
            <Image
              src={previewUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              unoptimized={previewUrl.startsWith('blob:') || previewUrl.startsWith('data:')}
            />
          </div>
        ) : (
          <div className="flex h-52 w-full items-center justify-center text-slate-500">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ImageIcon className="h-5 w-5" />
              Aucune illustration
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface EditorDrawerProps {
  initial: Article | null;
  onClose: () => void;
  onSave: (input: ArticleInput) => Promise<void>;
  saving: boolean;
}

export function EditorDrawer({ initial, onClose, onSave, saving }: EditorDrawerProps) {
  const {
    setTitle, setContent, setIllustration,
    previewUrl, canSave, stats, title, content, published, illustration,
  } = useEditorDrawerForm(initial);

  return (
    <div className="relative w-full max-w-5xl mx-auto my-8 overflow-hidden text-slate-900 rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_-40px_rgba(2,6,23,0.35)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <div className="absolute -inset-[2px] opacity-[0.55]">
          <div className="absolute inset-0 rounded-[30px] bg-[conic-gradient(from_180deg,rgba(124,58,237,0.18),rgba(6,182,212,0.14),rgba(236,72,153,0.12),rgba(124,58,237,0.18))]" />
          <div className="absolute inset-[1px] rounded-[28px] bg-white" />
        </div>
      </div>

      <header className="relative px-5 sm:px-7 pt-6 pb-4 border-b border-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mt-1 text-sm text-slate-600">
              Rédige proprement, ajoute une illustration, puis publie quand tu es prêt.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
              <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
                {stats.words} mots
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-1">
                {stats.lines} lignes
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative px-5 sm:px-7 py-6">
        <div className="grid gap-4  grid-cols-1">
          <div className="space-y-4">
            <TitleField value={title} onChange={setTitle} />
            <ContentField value={content} onChange={setContent} />
            <IllustrationField previewUrl={previewUrl} onChange={setIllustration} />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="rounded-2xl bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#2E5AA6]/20 hover:from-[#244A8A] hover:to-[#3E6FB5] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={saving || !canSave}
                onClick={async () => {
                  await onSave({
                    title: title.trim(),
                    content: content.trim(),
                    published,
                    illustration,
                  });
                }}
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>

              <button
                type="button"
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-slate-800"
                onClick={onClose}
              >
                Annuler
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-6">
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="text-xs font-extrabold text-slate-700">Aperçu</div>
                <div className="text-[11px] text-slate-500">
                  Rendu fidèle des retours chariot (comme un texte final).
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-black tracking-tight text-slate-900">
                  {title.trim() ? title : 'Titre…'}
                </h3>

                <div className="
                      mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4
                      text-sm text-slate-800 leading-relaxed
                      whitespace-pre-wrap break-words
                    "
                >
                  {content || 'Le contenu apparaîtra ici…'}
                </div>
              </div>
            </div>

            {!canSave ? (
              <div className="mt-2 text-[11px] text-slate-500">
                Le titre doit faire au moins <span className="font-bold">3</span> caractères et le contenu au moins{' '}
                <span className="font-bold">10</span>.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export const CONSTANTS = {
  PAGE_SIZE: 6,
  PREVIEW_LENGTH: 500,
  ANIMATION_DURATION: 0.2,
  DEBOUNCE_DELAY_MS: 300,
} as const;

// ==================== TYPES ====================
interface ArticleIllustrationProps {
  url?: string;
  onError?: () => void;
}

interface ArticleActionsProps {
  article: Article;
  onEdit: (a: Article) => void;
  onDelete: (a: Article) => void;
  isDeleting?: boolean;
}

interface ArticleContentPreviewProps {
  content: string;
  expanded: boolean;
  canExpand: boolean;
  onToggleExpand: () => void;
}

// ==================== COMPOSANTS OPTIMISÉS ====================

const ArticleIllustration = memo(({ url, onError }: ArticleIllustrationProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  if (!url || hasError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4 text-[12px] text-slate-700"
      >
        <ImageIcon className="h-5 w-5 text-slate-400" />
        <span>Aucune illustration</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 group"
    >
      <div className="relative h-48 w-full">
        <Image
          src={url}
          alt="Illustration de l'article"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={url.startsWith('blob:') || url.startsWith('data:')}
          onError={handleError}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
});

ArticleIllustration.displayName = 'ArticleIllustration';

const ArticleActions = memo(({ article, onEdit, onDelete, isDeleting }: ArticleActionsProps) => {
  return (
    <div className="relative flex flex-col gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onEdit(article)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2 text-[12px] font-bold text-white hover:from-slate-700 hover:to-slate-800 transition-all shadow-md"
        type="button"
      >
        <Pencil className="h-4 w-4" />
        Éditer
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onDelete(article)}
        disabled={isDeleting}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 px-3 py-2 text-[12px] font-bold text-white hover:from-rose-700 hover:to-rose-800 transition-all shadow-md disabled:opacity-50"
        type="button"
      >
        {isDeleting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
        Supprimer
      </motion.button>
    </div>
  );
});

ArticleActions.displayName = 'ArticleActions';

const ArticleContentPreview = memo(({ content, expanded, canExpand, onToggleExpand }: ArticleContentPreviewProps) => {
  return (
    <div className="mt-2">
      <div className={[
        'relative rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300',
        expanded ? '' : 'max-h-40 overflow-hidden'
      ].join(' ')}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0 text-[13px] leading-relaxed text-slate-700 break-words">{children}</p>,
            h1: ({ children }) => <h1 className="mb-2 text-[16px] font-black tracking-tight text-slate-900">{children}</h1>,
            h2: ({ children }) => <h2 className="mb-2 text-[15px] font-extrabold tracking-tight text-slate-900">{children}</h2>,
            h3: ({ children }) => <h3 className="mb-2 text-[14px] font-extrabold text-slate-900">{children}</h3>,
            ul: ({ children }) => <ul className="my-2 list-disc pl-5 text-[13px] text-slate-700">{children}</ul>,
            ol: ({ children }) => <ol className="my-2 list-decimal pl-5 text-[13px] text-slate-700">{children}</ol>,
            li: ({ children }) => <li className="my-1">{children}</li>,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:decoration-indigo-600 transition">
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-2 border-l-4 border-indigo-300 pl-4 text-[13px] italic text-slate-600 bg-indigo-50/50 rounded-r-lg">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="rounded-md bg-white px-1.5 py-0.5 text-[12px] font-semibold text-rose-600 border border-slate-200">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="my-2 overflow-auto rounded-xl border border-slate-200 bg-slate-900 p-4 text-[12px] text-slate-100">
                {children}
              </pre>
            ),
            hr: () => <hr className="my-4 border-slate-200" />,
          }}
        >
          {content || '—'}
        </ReactMarkdown>

        {!expanded && canExpand && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
        )}
      </div>

      {canExpand && (
        <motion.button
          type="button"
          onClick={onToggleExpand}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-700 transition shadow-md"
        >
          {expanded ? (
            <><span>Réduire</span> <ChevronUp className="h-4 w-4" /></>
          ) : (
            <><span>Afficher tout</span> <ChevronDown className="h-4 w-4" /></>
          )}
        </motion.button>
      )}
    </div>
  );
});

ArticleContentPreview.displayName = 'ArticleContentPreview';

const ArticleCard = memo(({
  article,
  expanded,
  canExpand,
  onToggleExpand,
  helpers,
  onEdit,
  onDelete,
  isDeleting
}: {
  article: Article;
  expanded: boolean;
  canExpand: boolean;
  onToggleExpand: () => void;
  helpers: ArticleHelpers;
  onEdit: (a: Article) => void;
  onDelete: (a: Article) => void;
  isDeleting?: boolean;
}) => {
  const normalizedContent = useMemo(() =>
    (article.content ?? '').replace(/\r\n/g, '\n'),
    [article.content]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: CONSTANTS.ANIMATION_DURATION }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="relative rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden">
        <article className="relative p-6">
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-black text-slate-900 line-clamp-2 mb-2">
                {article.title}
              </h3>
              <ArticleContentPreview
                content={normalizedContent}
                expanded={expanded}
                canExpand={canExpand}
                onToggleExpand={onToggleExpand}
              />
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="rounded-full bg-slate-100 px-2.5 py-1">
                  📅 Créé: {helpers.asDate(article.createdAt)}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">
                  ✏️ MAJ: {helpers.asDate(article.updatedAt)}
                </span>
              </div>
            </div>

            <ArticleActions
              article={article}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          </div>

          <ArticleIllustration url={article.illustrationUrl} />
        </article>
      </div>
    </motion.div>
  );
});

ArticleCard.displayName = 'ArticleCard';

// ==================== PAGINATION ====================
const BlogAdminPagination = memo(({
  articles,
  expandedById,
  toggleExpand,
  helpers,
  goEdit,
  handleDelete,
  deletingId,
}: {
  articles: Article[];
  expandedById: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  helpers: ArticleHelpers;
  goEdit: (a: Article) => void;
  handleDelete: (a: Article) => void;
  deletingId?: string | null;
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(articles.length / CONSTANTS.PAGE_SIZE));
  const paginated = useMemo(() =>
    articles.slice((page - 1) * CONSTANTS.PAGE_SIZE, page * CONSTANTS.PAGE_SIZE),
    [articles, page]
  );

  const goToPage = useCallback((p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  // Reset page when articles change
  useEffect(() => {
    setPage(1);
  }, [articles.length]);

  return (
    <div className="flex flex-col gap-8">
      <AnimatePresence mode="wait">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginated.map((article) => {
            const expanded = Boolean(expandedById[article._id]);
            const canExpand = typeof article.content === 'string' && article.content.length > CONSTANTS.PREVIEW_LENGTH;

            return (
              <ArticleCard
                key={article._id}
                article={article}
                expanded={expanded}
                canExpand={canExpand}
                onToggleExpand={() => toggleExpand(article._id)}
                helpers={helpers}
                onEdit={goEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === article._id}
              />
            );
          })}
        </div>
      </AnimatePresence>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-6 select-none" aria-label="Pagination">
          <button
            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-40"
            onClick={() => goToPage(1)}
            disabled={page === 1}
            aria-label="Première page"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-40"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            aria-label="Page précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  className={`rounded-lg px-3 py-2 font-bold text-sm transition-all ${pageNum === page
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  onClick={() => goToPage(pageNum)}
                  aria-current={pageNum === page ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-40"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Page suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-40"
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages}
            aria-label="Dernière page"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </nav>
      )}
    </div>
  );
});

BlogAdminPagination.displayName = 'BlogAdminPagination';

// ==================== ÉDITEUR ====================
const BlogAdminEditorView = memo(({
  isEditorView,
  urlView,
  urlId,
  editing,
  saving,
  loading,
  setError,
  goList,
  createArticle,
  updateArticle,
}: {
  isEditorView: boolean;
  urlView: string;
  urlId: string | null;
  editing: Article | null;
  saving: boolean;
  loading: boolean;
  setError: (e: string | null) => void;
  goList: () => void;
  createArticle: (input: ArticleMutationInput) => Promise<any>;
  updateArticle: (id: string, input: ArticleMutationInput) => Promise<any>;
}) => {
  if (!isEditorView) return null;

  const isCreating = urlView === 'create';
  const isEditing = urlView === 'edit';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 mb-6 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-sm"
      >
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={goList}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md transition-all"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          <div className="text-center">
            <div className="text-sm font-black text-slate-900">
              {isCreating ? '✏️ Nouvel article' : '📝 Édition de l\'article'}
            </div>
          </div>

          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      </motion.div>

      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      }>
        {isCreating && (
          <EditorDrawer
            key="drawer-create"
            saving={saving}
            initial={null}
            onClose={goList}
            onSave={async (input) => {
              setError(null);
              await createArticle(input);
              goList();
            }}
          />
        )}
        {isEditing && urlId && (
          <EditorDrawer
            key={`drawer-edit-${urlId}`}
            saving={saving}
            initial={editing}
            onClose={goList}
            onSave={async (input) => {
              setError(null);
              if (!editing?._id) return;
              await updateArticle(editing._id, input);
              goList();
            }}
          />
        )}
      </Suspense>

      {isEditing && urlId && !editing && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 text-center"
        >
          ⚠️ Article introuvable ou non chargé.
        </motion.div>
      )}
    </>
  );
});

BlogAdminEditorView.displayName = 'BlogAdminEditorView';

// ==================== EMPTY STATE ====================
const EmptyState = memo(({ message, onAction }: { message: string; onAction?: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-12 text-center shadow-sm"
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>
      <div className="relative">
        <div className="text-6xl mb-4">📝</div>
        <div className="text-sm font-semibold text-slate-600">{message}</div>
        {onAction && (
          <button
            onClick={onAction}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            Créer un article
          </button>
        )}
      </div>
    </motion.div>
  );
});

EmptyState.displayName = 'EmptyState';

// ==================== COMPOSANT PRINCIPAL ====================
const BlogAdmin = memo(function BlogAdmin() {
  const {
    goList, goCreate, goEdit, setError, refresh, handleSearch,
    handleDeleteWithLoading, toggleExpand, createArticle, updateArticle,
    urlView, urlId, q, stats, loading, saving, error, deletingId,
    isEditorView, editing, filtered, expandedById, emptyState, helpers,
  } = useBlogAdminArticlesWithCache();

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-8 shadow-xl"
        >
          <div className="absolute inset-0 bg-black/20 rounded-3xl" />
          <div className="relative text-center">
            <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
              Gestion des articles
            </h1>
            <p className="mt-2 text-indigo-100">Créez, modifiez et organisez votre contenu</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-4 mb-8 justify-center"
        >
          <div className="rounded-2xl bg-white p-4 shadow-md border border-indigo-100 place-self-center">
            <div className="text-sm font-semibold text-indigo-600">Total articles</div>
            <div className="text-3xl font-black text-slate-800">{stats.total}</div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6">
            <BlogAdminEditorView
              isEditorView={isEditorView}
              urlView={urlView}
              urlId={urlId}
              editing={editing}
              saving={saving}
              loading={loading}
              setError={setError}
              goList={goList}
              createArticle={createArticle}
              updateArticle={updateArticle}
            />

            {!isEditorView && (
              <section>
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={q}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Rechercher par titre..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => refresh()}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                      type="button"
                    >
                      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      Actualiser
                    </button>
                    <button
                      onClick={goCreate}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white hover:from-emerald-700 hover:to-green-700 transition shadow-md"
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                      Nouvel article
                    </button>
                  </div>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-rose-800">{String(error)}</div>
                        <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-800">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Articles List */}
                {emptyState ? (
                  <EmptyState message={emptyState} onAction={goCreate} />
                ) : (
                  <BlogAdminPagination
                    articles={filtered}
                    expandedById={expandedById}
                    toggleExpand={toggleExpand}
                    helpers={helpers}
                    goEdit={goEdit}
                    handleDelete={handleDeleteWithLoading}
                    deletingId={deletingId}
                  />
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
});

export default BlogAdmin;