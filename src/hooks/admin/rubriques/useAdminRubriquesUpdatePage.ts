import { api } from "@/lib/api/client";
import type { Rubrique } from '@/lib/interfaces';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from "react";

// Hook personnalisé pour la gestion du toast
function useToast() {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast, setToast };
}

export function useAdminRubriquesUpdatePage() {
  const router = useRouter();
  const params = useParams();
  const rubriqueId = params?.id as string;

  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [editingRubrique, setEditingRubrique] = useState<Rubrique | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { toast, setToast } = useToast();

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleBackToList = useCallback(() => {
    router.push("/admin/rubriques");
  }, [router]);

  const fetchRubriques = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setLoading(true);
    try {
      const { data } = await api.get<Rubrique[]>("/rubriques");
      if (isMountedRef.current) setRubriques(data);
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') {
        console.error('Erreur chargement rubriques:', error);
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRubriques();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rubriqueId && rubriques.length > 0 && isMountedRef.current) {
      setEditingRubrique(rubriques.find(r => r._id === rubriqueId) || null);
    }
  }, [rubriqueId, rubriques]);

  const handleRubriqueSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingRubrique?._id) return;
    setIsSaving(true);
    try {
      await api.patch(`/rubriques/${editingRubrique._id}`, {
        titre: editingRubrique.titre,
        description: editingRubrique.description,
      });
      router.push("/admin/rubriques");
      setToast({ type: 'success', message: 'Rubrique modifiée avec succès.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.response?.data?.message || 'Erreur lors de la modification.' });
    } finally {
      setIsSaving(false);
    }
  }, [editingRubrique, setToast, router]);

  return {
    handleBackToList, setToast, setEditingRubrique, handleRubriqueSubmit,
    loading, isSaving, editingRubrique, toast,
  };
}