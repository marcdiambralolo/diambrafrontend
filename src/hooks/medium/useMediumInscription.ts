import { api } from '@/lib/api/client';
import type { User } from '@/lib/interfaces';
import { useAuthStore } from '@/lib/store/auth.store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    useCallback, useEffect, useMemo, useRef, useState,
    type ChangeEvent, type FormEvent,
} from 'react';
import { useToast } from '../categorie/useToast';

// ============================================
// TYPES & CONSTANTS
// ============================================

export type MediumTermsSection = {
    title: string;
    intro?: string;
    items?: string[];
    footer?: string;
};

export const mediumTermsSections: MediumTermsSection[] = [
    {
        title: '1. Responsabilité individuelle',
        items: [
            'Vous êtes seul responsable des consultations, conseils et services que vous proposez.',
            'Les propos, recommandations ou orientations que vous donnez aux consultants n’engagent que vous.',
            'La plateforme MON ÉTOILE agit uniquement comme interface de mise en relation entre vous et les personnes qui souhaitent vous consulter.',
        ],
    },
    {
        title: '2. Respect et intégrité dans les consultations',
        items: [
            'Exercer sa pratique avec respect et bienveillance envers les consultants.',
            'Faire preuve de transparence et d’honnêteté dans ses services.',
            'Ne pas abuser de la vulnérabilité, de la crédulité ou des difficultés personnelles des consultants.',
            'Éviter toute forme de manipulation, de pression psychologique ou d’exploitation financière.',
        ],
        footer: 'La confiance du public est un élément essentiel dans les pratiques spirituelles et divinatoires. Elle doit être protégée et honorée par une conduite irréprochable.',
    },
    {
        title: '3. Interdiction des abus',
        items: [
            'De faire des promesses irréalistes ou trompeuses.',
            'D’exploiter la peur ou la détresse des consultants.',
            'D’encourager des dépendances aux consultations.',
            'D’exiger ou de solliciter des paiements abusifs ou injustifiés.',
        ],
        footer: 'Tout comportement contraire à ces principes pourra entraîner la suspension ou la suppression du profil sur la plateforme.',
    },
    {
        title: '4. Évaluation par les utilisateurs',
        intro: 'Afin de garantir un espace transparent et fiable, les consultants ont la possibilité de laisser des avis et commentaires sur les services reçus.',
        items: [
            'D’apprécier la qualité des prestations.',
            'D’encourager les pratiques sérieuses.',
            'De maintenir un environnement fondé sur la confiance.',
        ],
    },
    {
        title: '5. Engagement moral',
        intro: 'En rejoignant la plateforme MON ÉTOILE, vous reconnaissez exercer une activité qui touche à la dimension intime et spirituelle de la vie des personnes.',
        footer: 'Cette responsabilité exige une conduite empreinte de sagesse, de discernement et d’intégrité. La plateforme encourage ainsi une pratique de la voyance et de l’accompagnement spirituel éthique, responsable et respectueuse de la dignité humaine.',
    },
];

export const MEDIUM_SPECIALTIES = [
    'Tarot et Oracle',
    'Médecine traditionnelle',
    'Astrologie',
    'Médiumnité et voyance',
    'Soins énergétiques',
    'Numérologie',
    'Interprétation des rêves',
    'Guidance spirituelle',
    'Initiation et Enseignement',
    'Coaching et développement personnel',
] as const;

export const MEDIUM_DOMAINS = [
    'Amour et relations',
    'Santé et bien-être',
    'Famille',
    'Travail et carrière',
    'Finances',
    'Mission de vie',
    'Spiritualité',
    'Blocages énergétiques',
] as const;

export const MEDIUM_METHODS = [
    'Message écrit',
    'Appel audio ou vidéo',
    'Message vocal',
    'Rendez-vous',
] as const;

export type MediumInscriptionForm = {
    nomconsultant: string;
    photo: File | null;
    presentation: string;
    specialties: string[];
    specialtyOther: string;
    domains: string[];
    methods: string[];
    experience: string;
    phone: string;
    video: string;
    ethical: boolean;
};

type ArrayField = 'specialties' | 'domains' | 'methods';

// ============================================
// UTILITAIRES
// ============================================

const MAX_PRESENTATION_LENGTH = 900;
const MAX_SPECIALTY_OTHER_LENGTH = 100;
const MAX_PHONE_LENGTH = 20;

function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,6}[-\s\.]?[0-9]{1,6}$/;
    return phoneRegex.test(phone.trim());
}

function sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, ''); // Évite les injections XSS basiques
}

function buildInitialForm(user?: Partial<User> | null): MediumInscriptionForm {
    return {
        photo: null,
        presentation: typeof user?.presentation === 'string' ? user.presentation : '',
        specialties: Array.isArray(user?.specialties) ? user.specialties : [],
        specialtyOther: typeof (user?.specialtyOther ?? (user as any)?.specialty_other) === 'string'
            ? (user?.specialtyOther ?? (user as any)?.specialty_other)!
            : '',
        domains: Array.isArray(user?.domains) ? user.domains : [],
        methods: Array.isArray(user?.methods) ? user.methods : [],
        experience: typeof (user?.experience ?? (user as any)?.experienceYears) === 'string'
            ? (user?.experience ?? (user as any)?.experienceYears)!
            : typeof (user as any)?.experienceYears === 'number'
                ? String((user as any).experienceYears)
                : '',
        phone: typeof user?.phone === 'string' ? user.phone : '',
        video: typeof (user?.video ?? (user as any)?.videoLink) === 'string'
            ? (user?.video ?? (user as any)?.videoLink)!
            : '',
        ethical: !!user?.ethical,
        nomconsultant: typeof user?.nomconsultant === 'string' ? user.nomconsultant : '',
    };
}

function appendArrayToFormData(formData: FormData, key: ArrayField, values: string[]) {
    values.forEach((value, index) => {
        formData.append(`${key}[${index}]`, value);
    });
}

export function getMediumRegistrationErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        if (error.code === 'ECONNABORTED') return 'La requête a pris trop de temps. Veuillez réessayer.';
        if (error.response?.status === 413) return 'Le fichier est trop volumineux. Maximum 5MB.';
        if (error.response?.status === 429) return 'Trop de tentatives. Veuillez patienter.';
        return error.response?.data?.message || error.message || 'Erreur lors de l’envoi.';
    }
    if (error instanceof Error) return error.message;
    return 'Erreur lors de l’envoi.';
}

// ============================================
// HOOK PRINCIPAL
// ============================================


export const useMediumInscription = () => {
    const user = useAuthStore((s) => s.user);
    const router = useRouter();
    const toast = useToast();

    // État
    const [isClient, setIsClient] = useState(false);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [form, setForm] = useState<MediumInscriptionForm>(() => buildInitialForm(user));
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs pour cleanup
    const photoBlobUrlRef = useRef<string | null>(null);
    const posterBlobUrlRef = useRef<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Reset du formulaire quand l'utilisateur change
    useEffect(() => {
        setForm(buildInitialForm(user));
    }, [user]);

    // Mise à jour du téléphone depuis l'utilisateur
    useEffect(() => {
        if (!user?.phone) return;
        setForm((prev) => ({
            ...prev,
            phone: prev.phone || user.phone || '',
        }));
    }, [user]);

    // Cleanup des URLs objet
    useEffect(() => {
        return () => {
            if (photoBlobUrlRef.current) URL.revokeObjectURL(photoBlobUrlRef.current);
            if (posterBlobUrlRef.current) URL.revokeObjectURL(posterBlobUrlRef.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    // ============================================
    // HANDLERS OPTIMISÉS
    // ============================================

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Validation spécifique par champ
        let sanitizedValue: string;
        if (name === 'presentation' || name === 'nomconsultant' || name === 'specialtyOther') {
            // On ne fait pas de trim pour conserver tous les espaces saisis
            sanitizedValue = value.replace(/[<>]/g, '');
            if (sanitizedValue.length > MAX_PRESENTATION_LENGTH) {
                sanitizedValue = sanitizedValue.slice(0, MAX_PRESENTATION_LENGTH);
            }
        } else {
            sanitizedValue = sanitizeString(value);
            if (name === 'specialtyOther' && sanitizedValue.length > MAX_SPECIALTY_OTHER_LENGTH) {
                sanitizedValue = sanitizedValue.slice(0, MAX_SPECIALTY_OTHER_LENGTH);
            }
            if (name === 'phone') {
                sanitizedValue = sanitizedValue.slice(0, MAX_PHONE_LENGTH);
            }
        }

        setForm((prev) => ({ ...prev, [name]: sanitizedValue }));
    }, []);

    const handleSelectChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const toggleArrayField = useCallback((field: ArrayField, value: string, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter((item) => item !== value),
        }));
    }, []);

    const handlePhotoSelect = useCallback((file: File | null) => {
        if (photoBlobUrlRef.current) {
            URL.revokeObjectURL(photoBlobUrlRef.current);
            photoBlobUrlRef.current = null;
        }
        if (file) {
            const url = URL.createObjectURL(file);
            photoBlobUrlRef.current = url;
            setPhotoPreview(url);
        } else {
            setPhotoPreview(null);
        }
        setForm((prev) => ({ ...prev, photo: file }));
    }, []);

    const handlePosterSelect = useCallback((file: File | null) => {
        if (posterBlobUrlRef.current) {
            URL.revokeObjectURL(posterBlobUrlRef.current);
            posterBlobUrlRef.current = null;
        }
        if (file) {
            const url = URL.createObjectURL(file);
            posterBlobUrlRef.current = url;
            setPosterPreview(url);
        } else {
            setPosterPreview(null);
        }
        setPosterFile(file);
    }, []);

    const handleContinue = useCallback(() => {
        if (!termsAccepted) {
            setError('Vous devez accepter le règlement et les conditions générales pour continuer.');
            return;
        }
        setError('');
        setHasAcceptedTerms(true);
        setForm((prev) => ({ ...prev, ethical: true }));
    }, [termsAccepted]);

    // Validation intensive avec memo
    // Dans ton hook, modifie le useMemo validationError comme ceci :
    const validationError = useMemo(() => {
        // ⚠️ NE PAS vérifier ethical ici - elle est gérée par hasAcceptedTerms
        if (!form.photo) return 'La photo de profil est obligatoire.';
        if (!form.phone.trim()) return 'Le téléphone est obligatoire.';
        if (!isValidPhone(form.phone)) return 'Le numéro de téléphone n\'est pas valide.';
        if (form.specialties.length === 0) return 'Veuillez sélectionner au moins une spécialité.';
        if (form.domains.length === 0) return 'Veuillez sélectionner au moins un domaine.';
        if (form.presentation.length < 5) return 'La présentation doit faire au moins 50 caractères (détaillez votre parcours).';
        if (form.presentation.length > MAX_PRESENTATION_LENGTH) return `La présentation ne peut pas dépasser ${MAX_PRESENTATION_LENGTH} caractères.`;
        if (!form.nomconsultant.trim()) return 'Le nom du consultant est obligatoire.';
        return '';
    }, [form.photo, form.phone, form.specialties, form.domains, form.presentation, form.nomconsultant]);

    const canSubmit = !validationError;

    // Soumission avec AbortController pour éviter les memory leaks
    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validationError) {
            setError(validationError);
            return;
        }

        if (!(form.photo instanceof File) || !form.photo.name || form.photo.size === 0) {
            setError('La photo de profil est obligatoire et doit être un fichier image valide.');
            return;
        }

        // Annuler la requête précédente si elle existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setIsSubmitting(true);
        setError('');
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('presentation', form.presentation.trim());
            formData.append('phone', form.phone.trim());
            formData.append('ethical', String(form.ethical));
            formData.append('videoLink', form.video.trim());
            formData.append('experience', form.experience);
            formData.append('nomconsultant', form.nomconsultant.trim());

            if (form.specialtyOther.trim()) {
                formData.append('specialtyOther', form.specialtyOther.trim());
            }

            appendArrayToFormData(formData, 'specialties', form.specialties);
            appendArrayToFormData(formData, 'domains', form.domains);
            appendArrayToFormData(formData, 'methods', form.methods);
            formData.append('photo', form.photo);
            if (posterFile) formData.append('poster', posterFile);

            const result = await api.post('/users/register-medium', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                signal: controller.signal,
                timeout: 30000,
            });

            if (result.status === 201 || result.status === 200) {
                setSuccess(true);
                toast('✅ Candidature envoyée avec succès !');
                router.push('/star/medium/inscription-success');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
                 return;
            }
            setError(getMediumRegistrationErrorMessage(err));
        } finally {
            setLoading(false);
            setIsSubmitting(false);
            abortControllerRef.current = null;
        }
    }, [form, posterFile, router, toast, validationError]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Retour optimisé avec des références stables
    return useMemo(() => ({
        form,
        success,
        hasAcceptedTerms,
        loading,
        photoPreview,
        posterPreview,
        error,
        termsAccepted,
        canSubmit,
        isSubmitting,
        setTermsAccepted,
        handleChange,
        handleContinue,
        handleSubmit,
        handleSelectChange,
        toggleArrayField,
        handlePhotoSelect,
        handlePosterSelect,
        isClient,
    }), [form, success, hasAcceptedTerms, loading, photoPreview, posterPreview, error, termsAccepted, canSubmit, isSubmitting, handleChange, handleContinue, handleSubmit, handleSelectChange, toggleArrayField, handlePhotoSelect, handlePosterSelect, isClient]);
};