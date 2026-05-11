import { api } from "@/lib/api/client";
import offeringsService from "@/lib/api/services/offerings.service";
import { getBookById } from "@/lib/api/services/books.service";
import type { Book, ConsultationOffering, Offering, OfferingAlternative } from "@/lib/interfaces";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getErrorMessage } from '@/lib/utils/errorHelpers';

type BookFormOffering = ConsultationOffering & {
    titre?: string;
    description?: string;
};

type FormScalar = string | number | boolean;

export type BookFormState = {
    price: string | number;
    title: string;
    author: string;
    description: string;
    coverImage: string;
    pdfFileName: string;
    subtitle: string;
    category: string;
    pages: string;
    isActive: boolean;
    offeringAlternatives: OfferingAlternative[];
    offering: BookFormOffering;
};

type PageState = {
    loading: boolean;
    saving: boolean;
    error: string;
    success: boolean;
};

type PageAction =
    | { type: "FETCH_START" }
    | { type: "FETCH_OK" }
    | { type: "FETCH_ERR"; error: string }
    | { type: "SAVE_START" }
    | { type: "SAVE_OK" }
    | { type: "SAVE_ERR"; error: string }
    | { type: "DISMISS_ERROR" };

const INITIAL_PAGE: PageState = {
    loading: true,
    saving: false,
    error: "",
    success: false,
};

function pageReducer(state: PageState, action: PageAction): PageState {
    switch (action.type) {
        case "FETCH_START": return { ...state, loading: true, error: "" };
        case "FETCH_OK": return { ...state, loading: false };
        case "FETCH_ERR": return { ...state, loading: false, error: action.error };
        case "SAVE_START": return { ...state, saving: true, error: "", success: false };
        case "SAVE_OK": return { ...state, saving: false, success: true };
        case "SAVE_ERR": return { ...state, saving: false, error: action.error };
        case "DISMISS_ERROR": return { ...state, error: "" };
        default: return state;
    }
}

export const INITIAL_FORM: BookFormState = {
    title: "",
    author: "",
    description: "",
    coverImage: "",
    pdfFileName: "",
    subtitle: "",
    category: "",
    pages: "",
    isActive: true,
    offeringAlternatives: [],
    offering: { alternatives: [] },
    price: "",
};

export function buildBackUrl(): string {
    return `/admin/books?cb=${Date.now().toString(36)}${Math.random()
        .toString(36)
        .slice(2)}`;
}

function buildFormData(
    form: BookFormState,
    coverFile: File | null,
    pdfFile: File | null
): FormData {
    const fd = new FormData();
    const SKIP_KEYS = new Set<keyof BookFormState>([
        "coverImage",        // blob URL — fichier ajouté séparément
        "offeringAlternatives", // tableau — sérialisé en JSON
        "offering",          // objet — sérialisé séparément
    ]);

    (Object.entries(form) as [keyof BookFormState, BookFormState[keyof BookFormState]][]).forEach(([key, val]) => {
        if (SKIP_KEYS.has(key)) return;
        if (val === undefined || val === null || val === "") return;
        fd.append(key, String(val));
    });

    // Ajout des propriétés directes de l'objet offering (hors alternatives)
    if (form.offering && typeof form.offering === 'object') {
        const offeringRest = Object.fromEntries(
            Object.entries(form.offering).filter(([key]) => key !== 'alternatives')
        ) as Record<string, FormScalar | undefined>;
        Object.entries(offeringRest).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                fd.append(`offering.${k}`, String(v));
            }
        });
    }

    // Ajout de chaque alternative à plat pour compatibilité backend
    form.offeringAlternatives.forEach((alt, idx) => {
        Object.entries(alt).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                fd.append(`offering.alternatives[${idx}].${k}`, String(v));
            }
        });
    });

    if (coverFile) fd.append("coverImage", coverFile);
    if (pdfFile) fd.append("pdfFile", pdfFile);
    return fd;
}

export function useAdminBookEditPage() {
    const router = useRouter();
    const params = useParams();
    const bookId = (params?.id ?? "") as string;

    const [form, setForm] = useReducer(
        (prev: BookFormState, patch: Partial<BookFormState>) => ({ ...prev, ...patch }),
        INITIAL_FORM
    );
    const [page, dispatch] = useReducer(pageReducer, INITIAL_PAGE);

    const coverFileRef = useRef<File | null>(null);
    const pdfFileRef = useRef<File | null>(null);
    const submitLockRef = useRef(false);

    const [offerings, setOfferings] = useState<Offering[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOfferings() {
            setLoading(true);
            try {
                const data = await offeringsService.list();
                setOfferings(data);
            } catch {
                setError('Erreur lors du chargement des offrandes');
            } finally {
                setLoading(false);
            }
        }
        fetchOfferings();
    }, []);

    useEffect(() => {
        if (!bookId) return;
        let cancelled = false;
        dispatch({ type: "FETCH_START" });
        (async () => {
            try {
                const book = await getBookById(bookId);
                if (cancelled) return;
                if (!book) {
                    throw new Error('Livre introuvable');
                }
                let fromDb: OfferingAlternative[] = [];
                if (book.offering && Array.isArray(book.offering.alternatives)) {
                    fromDb = book.offering.alternatives;
                } else if (Array.isArray(book.offeringAlternatives)) {
                    fromDb = book.offeringAlternatives;
                }
                setForm({
                    title: book.title ?? '',
                    author: book.author ?? '',
                    description: book.description ?? '',
                    coverImage: book.coverImage ?? '',
                    pdfFileName: book.pdfFileName ?? '',
                    subtitle: book.subtitle ?? '',
                    category: book.category ?? '',
                    pages: String(book.pages ?? ''),
                    isActive: Boolean(book.isActive),
                    offeringAlternatives: fromDb,
                    offering: book.offering ?? { alternatives: fromDb },
                    price: book.price ?? '',
                });
                dispatch({ type: "FETCH_OK" });
            } catch (e: unknown) {
                if (cancelled) return;
                dispatch({
                    type: "FETCH_ERR",
                    error: getErrorMessage(e, "Livre introuvable"),
                });
            }
        })();
        return () => { cancelled = true; };
    }, [bookId]);

    const handleChange = useCallback(
        (field: keyof BookFormState | string, value: unknown) => {
            setForm({ [field]: value } as Partial<BookFormState>);
        },
        []
    );

    const handleCoverImageSelect = useCallback((file: File | null) => {
        coverFileRef.current = file;
    }, []);

    const handlePdfSelect = useCallback((file: File | null) => {
        pdfFileRef.current = file;
    }, []);

    const handleDismissError = useCallback(() => {
        dispatch({ type: "DISMISS_ERROR" });
    }, []);

    const normalizeOptionalDate = useCallback((value: string | Date | undefined) => {
        if (typeof value === 'string') return value;
        if (value instanceof Date) return value.toISOString();
        return undefined;
    }, []);

    const handleSubmit = useCallback(async () => {
        if (submitLockRef.current || page.saving) return;
        submitLockRef.current = true;
        dispatch({ type: "SAVE_START" });

        try {
            // Enrichir les alternatives d'offrandes avec les infos de offerings
            const enrichedAlternatives = form.offeringAlternatives.map((alt) => {
                const found = offerings.find(
                    (o) => o._id === alt.offeringId || o.offeringId === alt.offeringId
                );
                return found
                    ? {
                        ...alt,
                        name: found.name,
                        description: found.description,
                        price: found.price,
                        priceUSD: found.priceUSD,
                        createdAt: normalizeOptionalDate(found.createdAt),
                        updatedAt: normalizeOptionalDate(found.updatedAt),
                    }
                    : alt;
            });

            // Construction explicite de l'objet offering (hors alternatives)
            const offering: BookFormOffering = {
                alternatives: enrichedAlternatives,
            };
            if (form.offering.titre) offering.titre = form.offering.titre;
            if (form.offering.description) offering.description = form.offering.description;

            const formData = buildFormData(
                { ...form, offering, offeringAlternatives: enrichedAlternatives },
                coverFileRef.current,
                pdfFileRef.current
            );

            const res = await api.patch(`/books/${bookId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { coverUrl, pdfUrl } = (res.data ?? {}) as {
                coverUrl?: string;
                pdfUrl?: string;
            };
            if (coverUrl || pdfUrl) {
                setForm({
                    ...(coverUrl ? { coverImage: coverUrl } : {}),
                    ...(pdfUrl ? { pdfFileName: pdfUrl } : {}),
                });
            }

            dispatch({ type: "SAVE_OK" });
            router.replace('/admin/books');
            router.refresh();
        } catch (e: unknown) {
            dispatch({
                type: "SAVE_ERR",
                error: getErrorMessage(e, "Erreur lors de la modification du livre"),
            });
        } finally {
            submitLockRef.current = false;
        }
    }, [form, page.saving, offerings, bookId, router, normalizeOptionalDate]);

    const bookPreview = useMemo(() => {
        const normalizedPrice = typeof form.price === 'number'
            ? form.price
            : form.price.trim() === ''
                ? ''
                : Number.isFinite(Number(form.price))
                    ? Number(form.price)
                    : null;

        const lebook: Book = {
            title: form.title,
            subtitle: form.subtitle,
            author: form.author,
            description: form.description,
            coverImage: form.coverImage,
            category: form.category,
            pages: Number(form.pages),
            isActive: form.isActive,
            offeringAlternatives: form.offeringAlternatives,
            pageCount: Number(form.pages),
            offering: {
                alternatives: form.offeringAlternatives,
            },
            pdfFileName: form.pdfFileName,
            price: normalizedPrice
        };
        return lebook;
    }, [form]);
    
    const saving = page.saving ?? false;
    const success = page.success ?? false;
    const backUrl = `/admin/books?cb=${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

    return {
        handlePdfSelect, handleSubmit, dismissError: handleDismissError,
        handleBookFormChange: handleChange, handleCoverSelect: handleCoverImageSelect,
        formState: form, previewBook: bookPreview, error, saving, success, loading,
        backUrl, offerings,
    };
}