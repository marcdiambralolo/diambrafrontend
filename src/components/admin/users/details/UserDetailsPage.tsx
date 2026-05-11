"use client";
import CacheLink from '@/components/commons/CacheLink';
import { formatDateFR } from "@/components/admin/consultations/DisplayConsultationCard/helpers";
import { InfoRow } from "@/components/admin/users/details/InfoRow";
import Section from "@/components/admin/users/details/SectionOne";
import { StatPill } from "@/components/admin/users/details/StatPill";
import UserAspectsTexte from "@/components/admin/users/details/UserAspectsTexte";
import UserDetailsError from "@/components/admin/users/details/UserDetailsError";
import UserDetailsHeader from "@/components/admin/users/details/UserDetailsHeader";
import UserDetailsLoading from "@/components/admin/users/details/UserDetailsLoading";
import UserDetailsNotFound from "@/components/admin/users/details/UserDetailsNotFound";
import { useUserDetailsPage } from "@/hooks/admin/users/useUserDetailsPage";
import { joinList, safeString } from "@/lib/utils";
import {
    Activity, Calendar, Edit, Globe,
    Layers, Phone, Settings2, Shield, User as UserIcon
} from "lucide-react";

export default function UserDetailsPage() {
    const { user, loading, error } = useUserDetailsPage();

    if (loading) return <UserDetailsLoading />;
    if (error) return <UserDetailsError error={error} />;
    if (!user) return <UserDetailsNotFound />;

    return (
        <div className="w-full mx-auto  max-w-5xl px-4 py-10 bg-white text-slate-900">
            <div className="rounded-[28px] p-[1px] bg-[conic-gradient(from_180deg,rgba(124,58,237,0.20),rgba(6,182,212,0.14),rgba(236,72,153,0.12),rgba(124,58,237,0.20))] shadow-[0_24px_70px_-40px_rgba(2,6,23,0.35)]">
                <div className="relative rounded-[27px] border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7 overflow-hidden">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <UserDetailsHeader username={user.username} role={user.role} />
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                            <CacheLink
                                href={`/admin/users/${user._id}/edit`}
                                className="inline-flex items-center gap-2 rounded-2xl bg-cosmic-indigo hover:bg-cosmic-purple px-4 py-2.5 text-sm font-extrabold text-white shadow-sm dark:bg-cosmic-pink dark:hover:bg-cosmic-indigo"
                            >
                                <Edit className="h-4 w-4" />
                                Modifier
                            </CacheLink>
                            <CacheLink
                                href="/admin/users"
                                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-slate-800"
                            >
                                Retour à la liste
                            </CacheLink>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <StatPill label="Consultations" value={user.consultationsCount ?? user.totalConsultations ?? 0} />
                        <StatPill label="Terminées" value={user.consultationsCompleted ?? 0} />
                        <StatPill label="Livres lus" value={user.booksRead ?? 0} />
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-5">
                <Section
                    icon={<UserIcon className="h-5 w-5" />}
                    title="Identité & Contact"
                    subtitle="Toutes les informations de base (copiable)."
                    defaultOpen
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <InfoRow icon={<UserIcon className="h-4 w-4" />} label="ID" value={safeString(user._id)} copyValue={safeString(user._id)} />
                        <InfoRow icon={<Shield className="h-4 w-4" />} label="Grade" value={safeString(user.grade)} />
                        <InfoRow icon={<Phone className="h-4 w-4" />} label="Téléphone" value={safeString(user.phone)} copyValue={user.phone ?? null} />
                        <InfoRow icon={<Globe className="h-4 w-4" />} label="Pays" value={safeString(user.country)} />
                        <InfoRow icon={<Layers className="h-4 w-4" />} label="Type utilisateur" value={safeString(user.userType)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Créé le" value={formatDateFR(typeof user.createdAt === 'string' ? user.createdAt : undefined)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Mis à jour le" value={formatDateFR(typeof user.updatedAt === 'string' ? user.updatedAt : undefined)} />
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Nom" value={safeString(user.nom)} />
                        <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Prénoms" value={safeString(user.prenoms)} />
                        <InfoRow icon={<UserIcon className="h-4 w-4" />} label="Genre" value={safeString(user.gender)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date de naissance" value={formatDateFR(typeof user.dateNaissance === 'string' ? user.dateNaissance : typeof user.dateOfBirth === 'string' ? user.dateOfBirth : undefined)} />
                        <InfoRow icon={<Calendar className="h-4 w-4" />} label="Heure de naissance" value={safeString(user.heureNaissance)} />
                        <InfoRow icon={<Globe className="h-4 w-4" />} label="Pays de naissance" value={safeString(user.paysNaissance)} />
                        <InfoRow icon={<Globe className="h-4 w-4" />} label="Ville de naissance" value={safeString(user.villeNaissance)} />
                    </div>
                </Section>
                <Section
                    icon={<Settings2 className="h-5 w-5" />}
                    title="Préférences & Permissions"
                    subtitle="Préférences (langue, notifications) + permissions & rôles."
                    defaultOpen
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        <InfoRow icon={<Settings2 className="h-4 w-4" />} label="Langue" value={safeString(user.preferences?.language)} />
                        <InfoRow icon={<Settings2 className="h-4 w-4" />} label="Notifications" value={user.preferences?.notifications ? "Oui" : "Non"} />
                        <InfoRow icon={<Settings2 className="h-4 w-4" />} label="Newsletter" value={user.preferences?.newsletter ? "Oui" : "Non"} />
                        <InfoRow icon={<Shield className="h-4 w-4" />} label="Permissions custom" value={joinList(user.customPermissions)} />
                        <InfoRow icon={<Shield className="h-4 w-4" />} label="Spécialités" value={joinList(user.specialties)} />
                        <InfoRow icon={<Activity className="h-4 w-4" />} label="Rating" value={safeString(user.rating)} />
                    </div>
                </Section>
                
                <Section
                    icon={<Activity className="h-5 w-5" />}
                    title="Activité & Progression"
                    subtitle="Tout ce qui montre l’usage et l’avancement."
                    defaultOpen
                >
                    <div className="grid gap-3 sm:grid-cols-4">
                        <StatPill label="Total consultations" value={user.totalConsultations ?? user.consultationsCount ?? 0} />
                        <StatPill label="Consultations complétées" value={user.consultationsCompleted ?? 0} />
                        <StatPill label="Rituels complétés" value={user.rituelsCompleted ?? 0} />
                        <StatPill label="Livres lus" value={user.booksRead ?? 0} />
                    </div>
                </Section>

                <UserAspectsTexte aspectsTexte={user.aspectsTexte} />
            </div>
        </div>
    );
}