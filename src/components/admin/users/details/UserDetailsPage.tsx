"use client";
import Loader from "@/app/admin/loading";
import CacheLink from '@/components/commons/CacheLink';
import { useUserDetailsPage } from "@/hooks/admin/users/useUserDetailsPage";
import { safeString } from "@/lib/utils";
import {
    Activity,
    AlertCircle,
    Calendar,
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    Edit,
    Globe,
    Phone,
    User as UserIcon,
    Mail,
    MapPin,
    CalendarDays,
    Clock,
    Award,
    Crown,
    Sparkles,
    Shield,
    Star,
    TrendingUp
} from "lucide-react";
import React, { useState } from "react";
import { getInitial } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// ANIMATIONS
// ============================================================================

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
};

// ============================================================================
// COMPOSANTS
// ============================================================================

interface UserDetailsHeaderProps {
    username?: string | null;
    role?: string | null;
    email?: string | null;
}

export function UserDetailsHeader({ username, role, email }: UserDetailsHeaderProps) {
    const getRoleColor = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'from-purple-500 to-pink-500';
            case 'user': return 'from-blue-500 to-cyan-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <motion.div 
            variants={fadeInUp}
            className="flex items-start gap-5"
        >
            <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50" />
                <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-3xl font-black text-white shadow-xl">
                    {getInitial(username)}
                </div>
            </div>

            <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                        {safeString(username)}
                    </h1>
                    {email && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            <Mail className="w-3 h-3" />
                            {email}
                        </span>
                    )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${getRoleColor(role || '')} px-3 py-1 text-xs font-bold text-white shadow-md`}>
                        <Shield className="h-3.5 w-3.5" />
                        {safeString(role)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export function UserDetailsNotFound() {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[60vh] grid place-items-center px-4"
        >
            <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Utilisateur introuvable</h3>
                <p className="text-sm text-gray-500 mt-1">L'utilisateur que vous recherchez n'existe pas ou a été supprimé.</p>
                <div className="mt-6">
                    <CacheLink
                        href="/admin/users"
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
                    >
                        Retour à la liste
                    </CacheLink>
                </div>
            </div>
        </motion.div>
    );
}

interface UserDetailsErrorProps {
    error: string;
}

export function UserDetailsError({ error }: UserDetailsErrorProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[60vh] grid place-items-center px-4"
        >
            <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 shadow-xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Erreur</h3>
                <p className="text-sm text-gray-600 mt-2">{error}</p>
                <div className="mt-6">
                    <CacheLink
                        href="/admin/users"
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
                    >
                        Retour à la liste
                    </CacheLink>
                </div>
            </div>
        </motion.div>
    );
}

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    copyValue?: string | null;
    gradient?: boolean;
}

export function InfoRow({ icon, label, value, copyValue, gradient = false }: InfoRowProps) {
    const [copied, setCopied] = useState(false);

    return (
        <motion.div 
            variants={fadeInUp}
            className={`group flex items-start justify-between gap-3 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                gradient 
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100' 
                    : 'bg-gray-50 border border-gray-100'
            }`}
        >
            <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 shrink-0 text-gray-400 group-hover:text-purple-500 transition-colors">
                    {icon}
                </div>
                <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 break-words">{value || '—'}</div>
                </div>
            </div>

            {copyValue && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-800 transition-all"
                    onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(copyValue);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 900);
                        } catch { /* silence */ }
                    }}
                >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copié" : "Copier"}</span>
                </motion.button>
            )}
        </motion.div>
    );
}

interface SectionProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    badge?: string;
}

export function Section({ icon, title, subtitle, children, defaultOpen = true, badge }: SectionProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <motion.section 
            variants={fadeInUp}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full text-left px-6 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-all"
            >
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-purple-500">{icon}</span>
                            <h2 className="text-base font-bold text-gray-900">{title}</h2>
                            {badge && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    {badge}
                                </span>
                            )}
                        </div>
                        {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
                    </div>
                    <div className="shrink-0 text-gray-400">
                        {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 py-5 border-t border-gray-100"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

interface StatPillProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    trend?: number;
}

export function StatPill({ label, value, icon, trend }: StatPillProps) {
    return (
        <motion.div 
            variants={fadeInUp}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all group"
        >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                    {icon && <span className="text-purple-500">{icon}</span>}
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</div>
                </div>
                <div className="text-2xl font-black text-gray-900">{value}</div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-0.5 mt-2 text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className={`w-3 h-3 ${trend < 0 && 'rotate-180'}`} />
                        <span>{Math.abs(trend)}%</span>
                        <span className="text-gray-400 font-normal ml-1">vs mois dernier</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export function formatDateFR(v?: string | number | Date | null) {
    if (!v) return "";
    try {
        return new Date(v).toLocaleString("fr-FR", {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return "";
    }
}

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function UserDetailsPage() {
    const { user, loading, error } = useUserDetailsPage();

    if (loading) return <Loader />;
    if (error) return <UserDetailsError error={error} />;
    if (!user) return <UserDetailsNotFound />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 px-4 py-8">
            <div className="max-w-5xl mx-auto">
                {/* En-tête premium */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden mb-6"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
                    <div className="relative p-6 sm:p-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                            <UserDetailsHeader 
                                username={user.username} 
                                role={user.role} 
                            />
                            <div className="flex flex-wrap gap-3">
                                <CacheLink
                                    href={`/admin/users/${user._id}/edit`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                                >
                                    <Edit className="h-4 w-4" />
                                    Modifier
                                </CacheLink>
                                <CacheLink
                                    href="/admin/users"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                                >
                                    Retour à la liste
                                </CacheLink>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sections */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="space-y-5"
                >
                    {/* Identité & Contact */}
                    <Section
                        icon={<UserIcon className="h-5 w-5" />}
                        title="Identité & Contact"
                        subtitle="Informations personnelles et coordonnées"
                        badge="Copiable"
                        defaultOpen
                    >
                        <div className="grid gap-3 sm:grid-cols-2">
                            <InfoRow icon={<UserIcon className="h-4 w-4" />} label="ID Utilisateur" value={safeString(user._id)} copyValue={safeString(user._id)} gradient />
                            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={safeString(user.email)} copyValue={safeString(user.email)} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} label="Téléphone" value={safeString(user.phone)} copyValue={user.phone ?? null} />
                            <InfoRow icon={<Globe className="h-4 w-4" />} label="Pays" value={safeString(user.country)} />
                            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Créé le" value={formatDateFR(user.createdAt)} />
                            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Mis à jour le" value={formatDateFR(user.updatedAt)} />
                        </div>
                    </Section>

                    {/* Informations personnelles */}
                    <Section
                        icon={<Crown className="h-5 w-5" />}
                        title="Informations personnelles"
                        subtitle="Détails sur l'identité et la naissance"
                        defaultOpen
                    >
                        <div className="grid gap-3 sm:grid-cols-2">
                            <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Nom" value={safeString(user.nom)} />
                            <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Prénoms" value={safeString(user.prenoms)} />
                            <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Genre" value={safeString(user.gender)} />
                            <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="Date de naissance" value={formatDateFR(user.dateNaissance)} />
                            <InfoRow icon={<Clock className="h-4 w-4" />} label="Heure de naissance" value={safeString(user.heureNaissance)} />
                            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Pays de naissance" value={safeString(user.paysNaissance)} />
                            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Ville de naissance" value={safeString(user.villeNaissance)} />
                        </div>
                    </Section>

                    {/* Activité & Progression */}
                    <Section
                        icon={<Activity className="h-5 w-5" />}
                        title="Activité & Progression"
                        subtitle="Statistiques et performances"
                        defaultOpen
                    >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatPill 
                                label="Total jeux" 
                                value={user.totalConsultations ?? user.consultationsCount ?? 0} 
                                icon={<Award className="w-4 h-4" />}
                                trend={12}
                            />
                            <StatPill 
                                label="Taux de réussite" 
                                value="78%" 
                                icon={<Star className="w-4 h-4" />}
                                trend={5}
                            />
                            <StatPill 
                                label="Score moyen" 
                                value="3.2/4" 
                                icon={<TrendingUp className="w-4 h-4" />}
                                trend={-2}
                            />
                            <StatPill 
                                label="Classement" 
                                value="#42" 
                                icon={<Crown className="w-4 h-4" />}
                                trend={8}
                            />
                        </div>
                    </Section>
                </motion.div>
            </div>
        </div>
    );
}