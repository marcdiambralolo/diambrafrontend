import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { BookFormState } from "@/hooks/admin/books/useAdminBookNewPage";
import { OfferingAlternative } from "@/lib/interfaces";
import { cx } from "@/lib/functions";

export const inputClass = (hasErr?: boolean) =>
  cx(
    "w-full rounded-xl border-2 bg-white/80 px-4 py-2.5 text-[13px] font-medium text-slate-900",
    "placeholder:text-slate-400 backdrop-blur transition-all",
    "focus:outline-none focus-visible:ring-2",
    "dark:bg-white/5 dark:text-white dark:placeholder:text-white/30",
    hasErr
      ? "border-red-300 focus:border-red-500 focus-visible:ring-red-300/60 dark:border-red-400/40 dark:focus-visible:ring-red-400/30"
      : "border-slate-200 focus:border-indigo-500 focus-visible:ring-indigo-300/60 dark:border-white/10 dark:focus:border-indigo-400 dark:focus-visible:ring-indigo-400/30"
  );

export function useBookFormNew(form: BookFormState, onChange: (field: keyof BookFormState | string, value: unknown) => void, onCoverImageSelect?: (file: File | null) => void, onPdfSelect?: (file: File | null) => void) {
  const [pdfName, setPdfName] = useState<string | null>(form.pdfFileName || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(form.coverImage || null);

  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (form.coverImage && !blobUrlRef.current) {
      setCoverPreview(form.coverImage);
    }
  }, [form.coverImage]);

  const handleCoverSelect = useCallback((file: File | null) => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      blobUrlRef.current = url;
      setCoverPreview(url);
      onChange("coverImage", url);
      onCoverImageSelect?.(file);
    } else {
      setCoverPreview(null);
      onChange("coverImage", "");
      onCoverImageSelect?.(null);
    }
  }, [onChange, onCoverImageSelect]);

  const handlePdfSelect = useCallback((file: File | null) => {
    setPdfName(file?.name ?? null);
    onPdfSelect?.(file ?? null);
  }, [onPdfSelect]);

  const handleOfferingChange = useCallback((alts: OfferingAlternative[]) => {
    onChange("offeringAlternatives", alts);
  }, [onChange]);

  const descLen = useMemo(() => (form.description ?? "").length, [form.description]);

  return {
    coverPreview, pdfName, descLen, handlePdfSelect, handleOfferingChange, handleCoverSelect,
  };
}