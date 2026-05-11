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

export const MEDIUM_SPECIALTIES = [
    'Tarot',
    'Oracle',
    'Astrologie',
    'Médiumnité pure',
    'Lecture énergétique',
    'Numérologie',
    'Interprétation des rêves',
    'Guidance spirituelle',
    'Tradition africaine / ancêtres',
    'Coaching et développement personnel',
] as const;

export const MEDIUM_DOMAINS = [
    'Amour et relations',
    'Couple',
    'Famille',
    'Travail et carrière',
    'Finances',
    'Mission de vie',
    'Spiritualité',
    'Blocages énergétiques',
] as const;

export const MEDIUM_METHODS = [
    'Chat écrit',
    'Appel audio',
    'Appel vidéo',
    'Message vocal',
    'Consultation différée (réponse plus tard)',
] as const;

export type MediumInscriptionForm = {
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
    nomconsultant: string;
};

type ArrayField = 'specialties' | 'domains' | 'methods';

function buildInitialForm(user?: Partial<User> | null): MediumInscriptionForm {
    return {
        photo: null,
        presentation:
            typeof user?.presentation === 'string'
                ? user.presentation
                : '',
        specialties:
            Array.isArray(user?.specialties)
                ? user.specialties
                : [],
        specialtyOther:
            typeof (user?.specialtyOther ?? (user as any)?.specialty_other) === 'string'
                ? (user?.specialtyOther ?? (user as any)?.specialty_other)!
                : '',
        domains:
            Array.isArray(user?.domains)
                ? user.domains
                : [],
        methods:
            Array.isArray(user?.methods)
                ? user.methods
                : [],
        experience:
            typeof (user?.experience ?? (user as any)?.experienceYears) === 'string'
                ? (user?.experience ?? (user as any)?.experienceYears)!
                : typeof (user as any)?.experienceYears === 'number'
                    ? String((user as any).experienceYears)
                    : '',
        phone:
            typeof user?.phone === 'string'
                ? user.phone
                : '',
        video:
            typeof (user?.video ?? (user as any)?.videoLink) === 'string'
                ? (user?.video ?? (user as any)?.videoLink)!
                : '',
        ethical: !!user?.ethical,
        nomconsultant:
            typeof user?.nomconsultant === 'string'
                ? user.nomconsultant
                : '',
    };
}

function appendArrayToFormData(formData: FormData, key: ArrayField, values: string[]) {
    values.forEach((value, index) => {
        formData.append(`${key}[${index}]`, value);
    });
}

export function getMediumRegistrationErrorMessage(error: unknown): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || error.message || 'Erreur lors de l’envoi.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Erreur lors de l’envoi.';
}

export const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-[#4F83D1] focus:ring-2 focus:ring-[#4F83D1]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

export const checkboxLabelClass =
    'flex items-center gap-2 rounded-lg border border-transparent px-2 py-1 transition hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-900';

export const useMediumUpdate = () => {
    const user = useAuthStore((s) => s.user);
    const router = useRouter();
    const toast = useToast();

    const [form, setForm] = useState<MediumInscriptionForm>(() => buildInitialForm(user));
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const photoBlobUrlRef = useRef<string | null>(null);
    const posterBlobUrlRef = useRef<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.phone) return;
        setForm((prev) => ({
            ...prev,
            phone: prev.phone || user.phone || '',
        }));
    }, [user]);

    useEffect(() => {
        return () => {
            if (photoBlobUrlRef.current) {
                URL.revokeObjectURL(photoBlobUrlRef.current);
                photoBlobUrlRef.current = null;
            }
            if (posterBlobUrlRef.current) {
                URL.revokeObjectURL(posterBlobUrlRef.current);
                posterBlobUrlRef.current = null;
            }
        };
    }, []);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        []
    );

    const handleSelectChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const toggleArrayField = useCallback(
        (field: ArrayField, value: string, checked: boolean) => {
            setForm((prev) => ({
                ...prev,
                [field]: checked
                    ? [...prev[field], value]
                    : prev[field].filter((item) => item !== value),
            }));
        },
        []
    );

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

    const validationError = useMemo(() => {
        if (!form.photo) return 'La photo de profil est obligatoire.';
        if (!form.phone.trim()) return 'Le téléphone est obligatoire.';
        if (form.specialties.length === 0) return 'Veuillez sélectionner au moins une spécialité.';
        if (form.domains.length === 0) return 'Veuillez sélectionner au moins un domaine.';
        return '';
    }, [form]);

    const canSubmit = !validationError;

    const handleSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (validationError) {
                setError(validationError);
                return;
            }

            if (!(form.photo instanceof File) || !form.photo.name || form.photo.size === 0) {
                setError('La photo de profil est obligatoire et doit être un fichier image valide.');
                return;
            }

            setLoading(true);
            setError('');
            setSuccess(false);

            try {
                const formData = new FormData();

                formData.append('presentation', form.presentation.trim());
                formData.append('phone', form.phone.trim());
                formData.append('ethical', String(form.ethical));
                formData.append('videoLink', form.video.trim());
                formData.append('experience', form.experience);
                formData.append('nomconsultant', form.nomconsultant);


                if (form.specialtyOther.trim()) {
                    formData.append('specialtyOther', form.specialtyOther.trim());
                }

                appendArrayToFormData(formData, 'specialties', form.specialties);
                appendArrayToFormData(formData, 'domains', form.domains);
                appendArrayToFormData(formData, 'methods', form.methods);

                formData.append('photo', form.photo);

                if (posterFile) {
                    formData.append('poster', posterFile);
                }
                await api.post('/users/register-medium', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                setSuccess(true);
                toast('✅ Vos informations ont été modifiées avec succès !');
                router.push('/star/monprofil');
            } catch (err: unknown) {

                setError(getMediumRegistrationErrorMessage(err));
            } finally {
                setLoading(false);
            }

        },
        [form, posterFile, router, toast, validationError]
    );

    return {
        form, success, loading, photoPreview, posterPreview, error, canSubmit,
        handleChange, handleSubmit, handleSelectChange,
        toggleArrayField, handlePhotoSelect, handlePosterSelect,
    };
};