'use client';
import { useTermsSections } from '@/hooks/terms/useTermsSections';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import {
    AlertCircle, ArrowLeft, Brain, ExternalLink, Gamepad2, MapPin, Phone, Shield
} from 'lucide-react';
import React, { memo } from 'react';
import CacheLink from '../commons/CacheLink';

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
                    <h2 className="text-lg font-bold text-purple-900">
                        <span className="text-purple-500 mr-2">{number}.</span>
                        {title}
                    </h2>
                    <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-purple-400 to-transparent rounded-full group-hover:w-24 transition-all duration-500" />
                </div>
            </div>

            <div className="pl-11 space-y-2 text-sm text-purple-700 leading-relaxed">
                {children}
            </div>
        </motion.section>
    );
});

const ContactCard = memo(() => (
    <motion.div
        variants={fadeInUp}
        className="mt-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-6 border border-purple-100"
    >
        <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                    Support technique
                </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
        </div>

        <h3 className="text-center text-sm font-semibold text-purple-800 mb-4">
            Une question sur le jeu ? Notre équipe est là pour vous aider
        </h3>

        <div className="space-y-3">
            <motion.a
                whileHover={{ x: 4 }}
                href="tel:+2250758385387"
                className="flex items-center gap-3 rounded-xl bg-white p-3 transition-all hover:shadow-md border border-purple-100"
            >
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-2">
                    <Phone className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Téléphone
                    </div>
                    <div className="text-sm font-semibold text-purple-800">+225 07 58 38 53 87</div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-300" />
            </motion.a>

            <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-purple-100">
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-2">
                    <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        En ligne
                    </div>
                    <div className="text-sm font-medium text-purple-700">
                        Disponible partout dans le monde
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
));

export default function TermsPageClient() {
    const sections = useTermsSections();

    return (
        <div className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-purple-100"
            >
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            whileHover={{ x: -4 }}
                            className="flex items-center gap-2"
                        >
                            <CacheLink
                                href="/star/profil"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-500 transition-colors hover:text-purple-700"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Retour au jeu
                            </CacheLink>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <div className="relative overflow-hidden">
                <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3"
                    >
                        Conditions d'utilisation
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-purple-500 text-sm"
                    >
                        Dernière mise à jour : <span className="font-semibold text-purple-700">21 avril 2026</span>
                    </motion.p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="rounded-2xl bg-white border border-purple-100 shadow-sm overflow-hidden"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="m-6 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-purple-100 p-1.5 mt-0.5">
                                <AlertCircle className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-purple-800 mb-1">
                                    En jouant à <span className="text-purple-600">Diambra</span>, vous acceptez ces conditions.
                                </p>
                                <p className="text-xs text-purple-600">
                                    Ce jeu est un divertissement purement ludique.
                                </p>
                            </div>
                        </div>
                    </motion.div>

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

                    <div className="mx-6 my-6">
                        <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
                    </div>

                    <div className="px-6 pb-6">
                        <ContactCard />
                    </div>

                    <motion.div
                        variants={fadeInUp}
                        className="border-t border-purple-100 bg-purple-50/30 p-6 flex flex-col sm:flex-row gap-3"
                    >
                        <motion.div {...scaleOnHover} className="flex-1">
                            <CacheLink
                                href="/star/profil"
                                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
                            >
                                <Gamepad2 className="h-4 w-4" />
                                Commencer à jouer
                            </CacheLink>
                        </motion.div>

                        <motion.div {...scaleOnHover} className="flex-1">
                            <CacheLink
                                href="/about"
                                className="flex items-center justify-center gap-2 w-full bg-white border-2 border-purple-200 text-purple-700 font-bold py-3 rounded-xl transition-all hover:border-purple-300 hover:text-purple-600"
                            >
                                <Brain className="h-4 w-4" />
                                En savoir plus
                            </CacheLink>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-[10px] text-purple-400 mt-8"
                >
                    © 2026 Diambra · Tous droits réservés.
                </motion.p>
            </div>
        </div>
    );
}