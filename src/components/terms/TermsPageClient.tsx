'use client';
import { useTermsSections } from '@/hooks/terms/useTermsSections';
import { motion, useReducedMotion,Variants  } from 'framer-motion';
import {
    AlertCircle,
    ArrowLeft,
    FileText,
    MapPin,
    Phone,
    Shield,
    Sparkles,
    CheckCircle,
    ExternalLink
} from 'lucide-react';
import CacheLink from '../commons/CacheLink';
import React, { memo } from 'react';

 const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
};

const scaleOnHover: Variants = {
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
};

// ==================== SECTION PREMIUM ====================
interface SectionProps {
    number: string;
    title: string;
    icon: React.ElementType;
    iconColor: string;
    children: React.ReactNode;
}

const Section = memo<SectionProps>(({ number, title, icon: Icon, iconColor, children }) => {
    const reduceMotion = useReducedMotion();

    return (
        <motion.section
            variants={fadeInUp}
            className="mb-8 scroll-mt-24 group"
            id={`section-${number}`}
        >
            <div className="flex items-start gap-3 mb-4">
                <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: 5 }}
                    className={`${iconColor} p-2 rounded-xl shadow-sm flex-shrink-0`}
                >
                    <Icon className="w-5 h-5" />
                </motion.div>

                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">
                        <span className="text-indigo-500 mr-2">{number}.</span>
                        {title}
                    </h2>
                    <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-indigo-400 to-transparent rounded-full group-hover:w-24 transition-all duration-500" />
                </div>
            </div>

            <div className="pl-11 space-y-2 text-sm text-gray-700 leading-relaxed">
                {children}
            </div>
        </motion.section>
    );
});

// ==================== CONTACT CARD PREMIUM ====================
const ContactCard = memo(() => (
    <motion.div
        variants={fadeInUp}
        className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 border border-indigo-100"
    >
        <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Assistance dédiée
                </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
        </div>

        <h3 className="text-center text-sm font-semibold text-gray-800 mb-4">
            Une question ? Notre équipe est là pour vous aider
        </h3>

        <div className="space-y-3">
            <motion.a
                whileHover={{ x: 4 }}
                href="tel:+2250758385387"
                className="flex items-center gap-3 rounded-xl bg-white p-3 transition-all hover:shadow-md border border-gray-100"
            >
                <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
                    <Phone className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Téléphone
                    </div>
                    <div className="text-sm font-semibold text-gray-800">+225 07 58 38 53 87</div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-300" />
            </motion.a>

            <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-gray-100">
                <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-2">
                    <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Adresse
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                        Diambra, Abidjan, Côte d'Ivoire
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
));

// ==================== COMPOSANT PRINCIPAL ====================
export default function TermsPageClient() {
    const sections = useTermsSections();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
            {/* Header Sticky Premium */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100"
            >
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            whileHover={{ x: -4 }}
                            className="flex items-center gap-2"
                        >
                            <CacheLink
                                href="/"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Retour
                            </CacheLink>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5"
                        >
                            <Sparkles className="h-3 w-3 text-indigo-600" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                                Version 2.0
                            </span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Effet de fond décoratif */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-100/30 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100/20 blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 mb-6 shadow-sm"
                    >
                        <FileText className="h-4 w-4 text-indigo-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                            Documents légaux
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3"
                    >
                        Conditions d'utilisation
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-sm"
                    >
                        Dernière mise à jour : <span className="font-semibold text-gray-700">21 avril 2026</span>
                    </motion.p>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
                >
                    {/* Alerte d'acceptation */}
                    <motion.div
                        variants={fadeInUp}
                        className="m-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-indigo-100 p-1.5 mt-0.5">
                                <AlertCircle className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 mb-1">
                                    En utilisant <span className="text-indigo-600">Diambra</span>, vous acceptez ces conditions.
                                </p>
                                <p className="text-xs text-gray-600">
                                    Si vous n'êtes pas d'accord, veuillez ne pas utiliser notre plateforme.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sections */}
                    <div className="px-6">
                        {sections.map((section, idx) => (
                            <Section
                                key={section.number + idx}
                                number={section.number}
                                title={section.title}
                                icon={section.icon}
                                iconColor={section.iconColor}
                            >
                                {section.content}
                            </Section>
                        ))}
                    </div>

                    {/* Séparateur */}
                    <div className="mx-6 my-6">
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    </div>

                    {/* Section Contact */}
                    <div className="px-6 pb-6">
                        <ContactCard />
                    </div>

                    {/* Boutons CTA */}
                    <motion.div
                        variants={fadeInUp}
                        className="border-t border-gray-100 bg-gray-50/50 p-6 flex flex-col sm:flex-row gap-3"
                    >
                        <motion.div {...scaleOnHover} className="flex-1">
                            <CacheLink
                                href="/auth/register"
                                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Créer un compte
                            </CacheLink>
                        </motion.div>

                        <motion.div {...scaleOnHover} className="flex-1">
                            <CacheLink
                                href="/auth/login"
                                className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all hover:border-indigo-300 hover:text-indigo-600"
                            >
                                Se connecter
                            </CacheLink>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Footer note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-[10px] text-gray-400 mt-8"
                >
                    © 2026 Diambra - Tous droits réservés
                </motion.p>
            </div>
        </div>
    );
}