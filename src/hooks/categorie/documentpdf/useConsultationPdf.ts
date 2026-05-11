import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { api } from '@/lib/api/client';

// ==================== TYPES ====================
export type ConsultationLike = {
    pdfFile?: string | null;
    createdAt?: string;
    dateGeneration?: string;
    status?: string;
    formData?: { firstName?: string; lastName?: string };
    prenoms?: string;
    nom?: string;
    _id?: string;
    titre?: string;
    description?: string;
};

type ConsultationState = {
    data: ConsultationLike | null;
    loading: boolean;
    error: string | null;
    pdfUrl: string | null;
};

// ==================== CONSTANTES ====================
const CONSTANTS = {
    ERROR_MESSAGES: {
        NO_ID: 'Aucun identifiant de consultation fourni',
        LOAD_FAILED: 'Erreur lors du chargement de la consultation',
        PDF_NOT_FOUND: 'Aucun fichier PDF disponible',
    },
    PDF_FILENAME_PREFIX: 'consultation_',
} as const;

// ==================== UTILITAIRES ====================
function toRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === 'object' ? value as Record<string, unknown> : null;
}

function extractConsultationData(data: unknown): ConsultationLike {
    const dataRecord = toRecord(data);
    const nestedConsultation = dataRecord?.consultation;
    const source = toRecord(nestedConsultation) ?? dataRecord;
    const formDataRecord = toRecord(source?.formData);

    return {
        pdfFile: typeof source?.pdfFile === 'string' ? source.pdfFile : null,
        createdAt: typeof source?.createdAt === 'string' ? source.createdAt : undefined,
        dateGeneration: typeof source?.dateGeneration === 'string' ? source.dateGeneration : undefined,
        status: typeof source?.status === 'string' ? source.status : undefined,
        formData: formDataRecord ? {
            firstName: typeof formDataRecord.firstName === 'string' ? formDataRecord.firstName : undefined,
            lastName: typeof formDataRecord.lastName === 'string' ? formDataRecord.lastName : undefined,
        } : undefined,
        prenoms: typeof source?.prenoms === 'string' ? source.prenoms : undefined,
        nom: typeof source?.nom === 'string' ? source.nom : undefined,
        _id: typeof source?._id === 'string' ? source._id : undefined,
        titre: typeof source?.titre === 'string' ? source.titre : undefined,
        description: typeof source?.description === 'string' ? source.description : undefined,
    };
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message || fallback;
    
    if (error && typeof error === 'object') {
        const err = error as {
            name?: string;
            code?: string;
            message?: string;
            response?: { data?: { message?: string }; status?: number };
        };
        
        // Erreur API avec message personnalisé
        if (err.response?.data?.message) {
            return err.response.data.message;
        }
        
        // Erreur HTTP avec status
        if (err.response?.status === 404) {
            return 'Consultation non trouvée';
        }
        if (err.response?.status === 403) {
            return 'Accès non autorisé à cette consultation';
        }
        if (err.response?.status === 401) {
            return 'Session expirée, veuillez vous reconnecter';
        }
        
        return err.message || fallback;
    }
    
    return fallback;
}

function isCanceled(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const err = error as { name?: string; code?: string };
    return err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || err.name === 'AbortError';
}

// ==================== HOOK PRINCIPAL ====================
export function useConsultationPdf() {
    // États
    const [state, setState] = useState<ConsultationState>({
        data: null,
        loading: true,
        error: null,
        pdfUrl: null,
    });
    
    // Refs
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastConsultationIdRef = useRef<string | null>(null);

    // ==================== FONCTIONS UTILITAIRES ====================
    const getConsultationId = useCallback((): string | null => {
        if (typeof window !== 'undefined') {
            // Depuis les paramètres d'URL
            const urlParams = new URLSearchParams(window.location.search);
            const fromQuery = urlParams.get('consultationId');
            if (fromQuery) return fromQuery;
            
            // Depuis le pathname /consultations/:id
            const pathMatch = window.location.pathname.match(/\/consultations\/([^/?#]+)/);
            if (pathMatch) return pathMatch[1];
        }
        
        return null;
    }, []);

    const generatePdfFilename = useCallback((consultationData: ConsultationLike): string => {
        const date = new Date().toISOString().split('T')[0];
        const name = consultationData.prenoms || consultationData.nom || 'document';
        return `${CONSTANTS.PDF_FILENAME_PREFIX}${name}_${date}.pdf`;
    }, []);

    // ==================== CHARGEMENT ====================
    const loadConsultation = useCallback(async () => {
        const consultationId = getConsultationId();
        
        // Validation
        if (!consultationId) {
            if (isMountedRef.current) {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: CONSTANTS.ERROR_MESSAGES.NO_ID,
                }));
            }
            return;
        }

        // Éviter les doubles chargements
        if (lastConsultationIdRef.current === consultationId && state.data !== null) {
            return;
        }
        
        lastConsultationIdRef.current = consultationId;

        // Annuler la requête précédente
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();

        // Reset state
        if (isMountedRef.current) {
            setState(prev => ({ ...prev, loading: true, error: null }));
        }

        try {
            const response = await api.get<unknown>(`/consultations/${consultationId}`, {
                signal: abortControllerRef.current.signal,
            });
            
            const consultationData = extractConsultationData(response.data);
            
            if (!isMountedRef.current) return;
            
            setState({
                data: consultationData,
                loading: false,
                error: null,
                pdfUrl: consultationData.pdfFile || null,
            });
        } catch (err: unknown) {
            if (!isMountedRef.current) return;
            if (isCanceled(err)) return;
            
            setState(prev => ({
                ...prev,
                loading: false,
                error: getErrorMessage(err, CONSTANTS.ERROR_MESSAGES.LOAD_FAILED),
                pdfUrl: null,
            }));
        }
    }, [getConsultationId, state.data]);

    // ==================== ACTIONS ====================
    const handleDownload = useCallback(async () => {
        if (!state.pdfUrl) {
            setState(prev => ({ ...prev, error: CONSTANTS.ERROR_MESSAGES.PDF_NOT_FOUND }));
            return;
        }

        try {
            // Téléchargement via fetch pour plus de contrôle
            const response = await fetch(state.pdfUrl);
            if (!response.ok) throw new Error('Téléchargement échoué');
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = blobUrl;
            link.download = generatePdfFilename(state.data!);
            link.rel = 'noopener noreferrer';
            
            document.body.appendChild(link);
            link.click();
            
            // Nettoyage
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            // Fallback: ouverture directe
            console.log('Téléchargement échoué, ouverture directe du PDF', error);
            const link = document.createElement('a');
            link.href = state.pdfUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [state.pdfUrl, state.data, generatePdfFilename]);

    const handleOpenPdf = useCallback(() => {
        if (state.pdfUrl) {
            window.open(state.pdfUrl, '_blank', 'noopener,noreferrer');
        }
    }, [state.pdfUrl]);

    const reset = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        lastConsultationIdRef.current = null;
        setState({
            data: null,
            loading: true,
            error: null,
            pdfUrl: null,
        });
    }, []);

    // ==================== EFFETS ====================
    useEffect(() => {
        isMountedRef.current = true;
        
        // Chargement initial
        loadConsultation();
        
        // Nettoyage
        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [loadConsultation]);

    // ==================== VALEURS MEMOISÉES ====================
    const hasPdf = useMemo(() => !!state.pdfUrl, [state.pdfUrl]);
    const displayName = useMemo(() => {
        const data = state.data;
        if (data?.formData?.firstName || data?.formData?.lastName) {
            return `${data.formData.firstName || ''} ${data.formData.lastName || ''}`.trim();
        }
        if (data?.prenoms || data?.nom) {
            return `${data.prenoms || ''} ${data.nom || ''}`.trim();
        }
        return null;
    }, [state.data]);

    const isCompleted = useMemo(() => state.data?.status === 'COMPLETED', [state.data?.status]);
    const canDownload = useMemo(() => hasPdf && isCompleted && !state.loading, [hasPdf, isCompleted, state.loading]);

    // ==================== RETOUR ====================
    return {
        // Données
        consultation: state.data,
        loading: state.loading,
        error: state.error,
        pdfUrl: state.pdfUrl,
        
        // Statuts dérivés
        hasPdf,
        displayName,
        isCompleted,
        canDownload,
        
        // Actions
        handleDownload,
        handleOpenPdf,
        reset,
        reload: loadConsultation,
    };
}