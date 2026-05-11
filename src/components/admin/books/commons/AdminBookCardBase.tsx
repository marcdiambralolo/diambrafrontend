"use client";
import { cx } from "@/lib/functions";
import type { Book } from "@/lib/interfaces";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Edit, Power, ShoppingCart, Star } from "lucide-react";
import { useCallback, useMemo } from "react"; 
import { BookOpen } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
 
import { ExternalLink, FileText } from "lucide-react";

interface PdfDownloadBadgeProps {
  pdfUrl: string;
  fileName: string;
  reduce: boolean | null;
}

export const PdfDownloadBadge = memo(function PdfDownloadBadge({ pdfUrl, fileName, reduce, }: PdfDownloadBadgeProps) {

  return (
    <motion.a
      href={pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      download
      whileHover={reduce ? undefined : { scale: 1.03 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      title={`Télécharger : ${fileName}`}
      className={cx(
        "group/pdf inline-flex items-center gap-2 rounded-xl",
        "border border-indigo-200/80 bg-gradient-to-r from-indigo-50 to-blue-50",
        "px-3 py-2 text-[12px] font-bold text-indigo-700",
        "hover:border-indigo-300 hover:from-indigo-100 hover:to-blue-100 hover:shadow-sm",
        "dark:border-indigo-400/25 dark:from-indigo-500/10 dark:to-blue-500/10",
        "dark:text-indigo-300 dark:hover:border-indigo-400/40 dark:hover:from-indigo-500/15 dark:hover:to-blue-500/15",
        "transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700/40",
      )}
    >
      <span
        className={cx(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg",
          "bg-indigo-100 dark:bg-indigo-400/20",
        )}
      >
        <FileText className="h-3.5 w-3.5" />
      </span>

      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400/80">
          PDF
        </span>

        <span className="mt-0.5 max-w-[140px] truncate text-[12px]">
          {fileName}
        </span>
      </span>

      <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 opacity-50 transition-opacity group-hover/pdf:opacity-100" />
    </motion.a>
  );
});

interface StatChipProps {
    icon: React.ElementType;
    value: React.ReactNode;
    title?: string;
}

const StatChip = memo(function StatChip({ icon: Icon, value, title }: StatChipProps) {

    return (
        <span
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75"
            title={title}
        >
            <Icon className="h-3 w-3 shrink-0 text-slate-500 dark:text-white/40" />
            {value}
        </span>
    );
});

interface BookCoverProps {
    src?: string | null;
    title: string;
}

const BookCover = memo(function BookCover({ src, title }: BookCoverProps) {
    if (src) {
        return (
            <div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-xl border border-black/10 shadow-sm dark:border-white/10">
                <Image
                    src={src}
                    alt={`Couverture : ${title}`}
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority={false}
                />
            </div>
        );
    }

    return (
        <div className="flex h-48 w-32 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#DDE7FA] to-[#9BC2FF]/70 dark:from-[#0F1C3F] dark:to-[#162A56]">
            <BookOpen className="h-8 w-8 text-[#2E5AA6] dark:text-[#9BC2FF]" />
        </div>
    );
});

interface AdminBookCardProps {
    book: Book;
    onToggleActive: (bookId: string, isActive: boolean) => void;
    onEdit?: (bookId: string) => void;
    index?: number;
}

export function AdminBookCardBase({
    book,
    onToggleActive,
    onEdit,
    index = 0,
}: AdminBookCardProps) {
    const reduce = useReducedMotion();

    const vm = useMemo(() => {
        const id = book.id ?? book._id ?? "";
        const title = book.title ?? "Sans titre";
        const subtitle = book.subtitle ?? "";
        const author = book.author ?? "Auteur inconnu";
        const category = book.category ?? "";
        const pages = book.pages;
        const description = book.description ?? "";
        const coverImage = book.coverImage ?? null;
        const pdfFileName = book.pdfFileName ?? "pdf.pdf";
        const isActive = Boolean(book.isActive);
        const isAvailable = book.isAvailable !== false;

        const price =
            typeof book.price === "number"
                ? book.price.toLocaleString("fr-FR")
                : "—";

        const rating =
            typeof book.rating === "number"
                ? book.rating.toFixed(1)
                : null;

        const downloadCount =
            typeof book.downloadCount === "number"
                ? String(book.downloadCount)
                : null;

        const purchaseCount =
            typeof book.purchaseCount === "number"
                ? String(book.purchaseCount)
                : null;

        const createdAtLabel = book.createdAt
            ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
                new Date(book.createdAt),
            )
            : null;

        const updatedAtLabel = book.updatedAt
            ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
                new Date(book.updatedAt),
            )
            : null;

        return {
            id,
            title,
            subtitle,
            author,
            category,
            pages,
            description,
            coverImage,
            pdfFileName,
            pdfUrl: pdfFileName,
            isActive,
            isAvailable,
            price,
            rating,
            downloadCount,
            purchaseCount,
            createdAtLabel,
            updatedAtLabel,
        };
    }, [book]);

    const onClickToggle = useCallback(
        () => onToggleActive(vm.id, vm.isActive),
        [onToggleActive, vm.id, vm.isActive],
    );

    const onClickEdit = useCallback(
        () => onEdit?.(vm.id),
        [onEdit, vm.id],
    );

    return (
        <motion.article
            layout
            key={vm.id || index}
            initial={reduce ? undefined : { opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.95 }}
            transition={
                reduce
                    ? { duration: 0 }
                    : { delay: index * 0.04, type: "spring", stiffness: 440, damping: 38 }
            }
            className={cx(
                "group relative overflow-hidden rounded-3xl border-0 p-0",
                "bg-white  backdrop-blur-xl",
                "shadow-2xl shadow-cosmic-indigo/10 hover:shadow-3xl hover:shadow-cosmic-purple/20",
                "transition-all duration-300"
            )}
        >
            <div className="relative p-7 sm:p-10 flex flex-col gap-3">
                <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                        <h3
                            className="line-clamp-2 text-xl font-extrabold tracking-tight text-cosmic-indigo dark:text-cosmic-pink drop-shadow-sm"
                            title={vm.title}
                        >
                            {vm.title}
                        </h3>

                        {vm.subtitle ? (
                            <p className="mt-1 line-clamp-1 text-[15px] font-semibold text-cosmic-purple dark:text-cosmic-pink/80">
                                {vm.subtitle}
                            </p>
                        ) : null}

                        <p className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-cosmic-indigo/80 dark:text-cosmic-pink/70">
                            <span className="font-bold">👤 {vm.author}</span>
                            {vm.pages ? (
                                <>
                                    <span className="text-cosmic-indigo/30 dark:text-cosmic-pink/20">·</span>
                                    <span>{vm.pages}&nbsp;p.</span>
                                </>
                            ) : null}
                        </p>

                        {vm.category ? (
                            <span className="mt-3 inline-flex rounded-xl border-0 bg-cosmic-indigo/10 px-3 py-1 text-xs font-bold text-cosmic-indigo dark:bg-cosmic-purple/20 dark:text-cosmic-pink">
                                {vm.category}
                            </span>
                        ) : null}

                        <motion.button
                            whileHover={reduce ? undefined : { scale: 1.08 }}
                            whileTap={reduce ? undefined : { scale: 0.93 }}
                            onClick={onClickToggle}
                            title={vm.isActive ? "Désactiver" : "Activer"}
                            className={cx(
                                "mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold",
                                vm.isActive
                                    ? "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow hover:from-emerald-500 hover:to-emerald-700"
                                    : "bg-gradient-to-r from-slate-200 to-slate-400 text-cosmic-indigo shadow hover:from-slate-300 hover:to-slate-500 dark:from-white/10 dark:to-white/20 dark:text-cosmic-pink",
                                "transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-indigo/40"
                            )}
                        >
                            <Power className="h-4 w-4" />
                            {vm.isActive ? "Actif" : "Inactif"}
                        </motion.button>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {vm.rating ? (
                                <StatChip
                                    icon={Star}
                                    value={<span className="text-yellow-500 font-bold animate-glow">{vm.rating} <span className="text-xs">/ 5</span></span>}
                                    title="Note"
                                />
                            ) : null}

                            {vm.downloadCount ? (
                                <StatChip
                                    icon={Download}
                                    value={<span className="text-indigo-600 font-bold animate-float">{vm.downloadCount} <span className="text-xs">téléch.</span></span>}
                                    title="Téléchargements"
                                />
                            ) : null}

                            {vm.purchaseCount ? (
                                <StatChip
                                    icon={ShoppingCart}
                                    value={<span className="text-green-600 font-bold animate-pulse">{vm.purchaseCount} <span className="text-xs">achats</span></span>}
                                    title="Achats"
                                />
                            ) : null}

                            {!vm.isAvailable ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-gradient-to-r from-red-100 via-rose-200 to-red-200 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 animate-pulse">
                                    <span className="w-3 h-3 bg-red-400 rounded-full animate-ping mr-1" />
                                    Indisponible
                                </span>
                            ) : null}
                        </div>

                        {vm.pdfUrl ? (
                            <div className="mt-4">
                                <div className="relative group">
                                    <PdfDownloadBadge
                                        pdfUrl={vm.pdfUrl}
                                        fileName={vm.pdfFileName}
                                        reduce={reduce}
                                    />

                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="shrink-0">
                        <BookCover src={vm.coverImage} title={vm.title} />
                    </div>
                </div>

                {vm.description ? (
                    <p className="mt-5 line-clamp-3 text-[14px] leading-relaxed text-cosmic-indigo dark:text-cosmic-pink/80">
                        {vm.description}
                    </p>
                ) : null}

                {Array.isArray(book.offering?.alternatives) && book.offering.alternatives.length > 0 && (
                    <div className="mt-2">
                        <div className="mb-1 flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2E5AA6] dark:text-[#DDE7FA]">
                                Offrandes sélectionnées
                            </span>
                        </div>
                        <ul className="space-y-1">
                            {book.offering.alternatives.map((alt, idx) => (
                                <li key={alt.category + idx} className="flex items-center gap-2 text-xs font-semibold text-[#16315F] dark:text-[#DDE7FA]">
                                    <span className="inline-block w-5 h-5 text-[#2E5AA6] dark:text-[#9BC2FF]">
                                        {alt.icon ? <span>{alt.icon}</span> : <span>{alt.category}</span>}
                                    </span>
                                    <span className="font-bold mr-2">{alt.name || alt.category}</span>
                                    <span className="mr-2 rounded bg-[#DDE7FA] px-2 py-0.5 text-xs text-[#2E5AA6] dark:bg-[#162A56] dark:text-[#9BC2FF]">
                                        {alt.category}
                                    </span>
                                    <span className="mr-2">x{alt.quantity}</span>
                                    {alt.price !== undefined && (
                                        <span className="ml-auto text-xs font-semibold text-[#16315F] dark:text-[#DDE7FA]">
                                            {alt.price.toLocaleString("fr-FR")} FCFA
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200/60 pt-3 dark:border-white/10">
                    {(vm.createdAtLabel || vm.updatedAtLabel) ? (
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-slate-400 dark:text-white/25">
                            {vm.createdAtLabel ? <span>Créé le {vm.createdAtLabel}</span> : null}
                            {vm.updatedAtLabel ? <span>Mise à jour le {vm.updatedAtLabel}</span> : null}
                        </div>
                    ) : null}

                    <div className="flex items-center gap-2">
                        {vm.pdfUrl ? (
                            <motion.a
                                href={vm.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                whileHover={reduce ? undefined : { scale: 1.08 }}
                                whileTap={reduce ? undefined : { scale: 0.93 }}
                                title={`Télécharger ${vm.pdfFileName}`}
                                className={cx(
                                    "inline-flex h-9 w-9 items-center justify-center rounded-xl",
                                    "border border-indigo-200 bg-indigo-50 text-indigo-700",
                                    "hover:bg-indigo-100 hover:shadow-sm",
                                    "dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20",
                                    "transition-all",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:focus-visible:ring-indigo-700/40",
                                )}
                            >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Télécharger</span>
                            </motion.a>
                        ) : null}

                        <motion.button
                            whileHover={reduce ? undefined : { scale: 1.08 }}
                            whileTap={reduce ? undefined : { scale: 0.93 }}
                            onClick={onClickEdit}
                            title="Modifier"
                            className={cx(
                                "inline-flex h-9 w-9 items-center justify-center rounded-xl",
                                "border border-blue-200 bg-blue-50 text-blue-700",
                                "hover:bg-blue-100 hover:shadow-sm",
                                "dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20",
                                "transition-all",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700/40",
                            )}
                        >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                        </motion.button>
                    </div>
                </div>

            </div>
        </motion.article>
    );
}