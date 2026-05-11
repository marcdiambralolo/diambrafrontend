import { api } from "@/lib/api/client";
import offeringsService from "@/lib/api/services/offerings.service";
import { Book, ConsultationOffering, Offering, OfferingAlternative } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getErrorMessage } from '@/lib/utils/errorHelpers';

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
};

export type PageState = {
    loading: boolean;
    error: string | null;
    success: boolean;
};

export type PageAction =
    | { type: "SUBMIT_START" }
    | { type: "SUBMIT_OK" }
    | { type: "SUBMIT_ERR"; error: string }
    | { type: "RESET_ERROR" };

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
    price: "",
};

export const INITIAL_PAGE: PageState = {
    loading: false,
    error: null,
    success: false,
};

function pageReducer(state: PageState, action: PageAction): PageState {
    switch (action.type) {
        case "SUBMIT_START":
            return { loading: true, error: null, success: false };
        case "SUBMIT_OK":
            return { loading: false, error: null, success: true };
        case "SUBMIT_ERR":
            return { loading: false, error: action.error, success: false };
        case "RESET_ERROR":
            return { ...state, error: null };
        default:
            return state;
    }
}

function formReducer(
    prev: BookFormState,
    patch: Partial<BookFormState>
): BookFormState {
    return { ...prev, ...patch };
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
    ]);

    (Object.entries(form) as [keyof BookFormState, BookFormState[keyof BookFormState]][]).forEach(([key, val]) => {
        if (SKIP_KEYS.has(key)) return;
        if (val === undefined || val === null || val === "") return;
        fd.append(key, String(val));
    });

    const offeringPayload: ConsultationOffering = { alternatives: form.offeringAlternatives };
    fd.append(
        "offering",
        JSON.stringify(offeringPayload)
    );

    if (coverFile) fd.append("coverImage", coverFile);
    if (pdfFile) fd.append("pdfFile", pdfFile);
    return fd;
}

export function useAdminBookNewPage() {
    const router = useRouter();

    const [form, setForm] = useReducer(formReducer, INITIAL_FORM);
    const [page, dispatch] = useReducer(pageReducer, INITIAL_PAGE);

    const coverFileRef = useRef<File | null>(null);
    const pdfFileRef = useRef<File | null>(null);
    const submitLockRef = useRef(false);

    const [offerings, setOfferings] = useState<Offering[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        dispatch({ type: "RESET_ERROR" });
    }, []);

    const normalizeOptionalDate = useCallback((value: string | Date | undefined) => {
        if (typeof value === 'string') return value;
        if (value instanceof Date) return value.toISOString();
        return undefined;
    }, []);

    const handleSubmit = useCallback(async () => {
        if (submitLockRef.current || page.loading) return;
        submitLockRef.current = true;
        dispatch({ type: "SUBMIT_START" });

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

            const formData = buildFormData(
                { ...form, offeringAlternatives: enrichedAlternatives },
                coverFileRef.current,
                pdfFileRef.current
            );

            const res = await api.post("books", formData, {
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

            dispatch({ type: "SUBMIT_OK" });
            router.replace('/admin/books');
            router.refresh();
        } catch (e: unknown) {
            const msg = getErrorMessage(e, "Erreur lors de la création du livre");
            dispatch({ type: "SUBMIT_ERR", error: msg });
        } finally {
            submitLockRef.current = false;
        }
    }, [form, page.loading, offerings, router, normalizeOptionalDate]);

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
    }, [
        form.title, form.subtitle, form.author, form.description,
        form.coverImage, form.category, form.pages, form.isActive,
        form.offeringAlternatives,
        form.pdfFileName, form.price,
    ]);

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

    return {
        setForm, dispatch, handleChange, handleCoverImageSelect,
        handlePdfSelect, handleDismissError, handleSubmit,
        bookPreview, form, coverFileRef, pdfFileRef, page, offerings, loading, error,
    };
}