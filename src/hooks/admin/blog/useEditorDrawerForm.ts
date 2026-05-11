import { useState, useEffect, useMemo } from 'react';
import { useLivePreview } from './useLivePreview';
import type { Article } from '@/lib/interfaces';

export function useEditorDrawerForm(initial: Article | null) {
  const [content, setContent] = useLivePreview(initial?.content ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [published, setPublished] = useState(Boolean(initial?.published));
  const [illustration, setIllustration] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setTitle(initial?.title ?? '');
    setContent(initial?.content ?? '');
    setPublished(Boolean(initial?.published));
    setIllustration(null);
  }, [initial, setContent]);

  useEffect(() => {
    if (!illustration) {
      setLocalPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(illustration);
    setLocalPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [illustration]);

  const previewUrl = localPreviewUrl ?? initial?.illustrationUrl ?? null;
  const canSave = title.trim().length >= 3 && content.trim().length >= 10;
  const stats = useMemo(() => {
    const normalized = content.replace(/\r\n/g, '\n');
    const lines = normalized.length ? normalized.split('\n').length : 0;
    const words = normalized.trim().split(/\s+/).filter(Boolean).length;

    return { lines, words };
  }, [content]);

  return {
    setTitle, setContent, setIllustration,
    previewUrl, canSave, stats, title, content, published, illustration,
  };
}