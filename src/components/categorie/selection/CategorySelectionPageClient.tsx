"use client";
import CategoryLoadingSpinner from "@/components/categorie/commons/CategoryLoadingSpinner";
import { getCategories } from "@/lib/api/services/categories.service";
import { CategorieAdmin } from "@/lib/interfaces";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence,Variants  } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Star, Compass, ArrowRight, FolderOpen, Zap } from "lucide-react";

// Icône aléatoire pour chaque catégorie (variété visuelle)
const categoryIcons = [Sparkles, Star, Compass, FolderOpen, Zap];

const getRandomIcon = (index: number) => {
    const Icon = categoryIcons[index % categoryIcons.length];
    return <Icon className="w-5 h-5" />;
};

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
};

const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
        },
    },
};

export default function CategorySelectionPageClient() {
    const router = useRouter();
    const { data: categories, isLoading, isError, error } = useQuery<CategorieAdmin[]>({
        queryKey: ["categories"],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
 
    if (isLoading) return <CategoryLoadingSpinner />;

    if (isError || error || !categories) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
                >
                    <div className="text-6xl mb-4">😔</div>
                    <h2 className="text-xl font-bold text-red-700 mb-2">Erreur de chargement</h2>
                    <p className="text-red-600 mb-4">
                        Impossible de charger les catégories. Veuillez réessayer.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </motion.div>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center"
                >
                    <div className="text-6xl mb-4">📭</div>
                    <h2 className="text-xl font-bold text-amber-700 mb-2">Aucune catégorie</h2>
                    <p className="text-amber-600">
                        Aucune catégorie n&apos;est disponible pour le moment.
                    </p>
                </motion.div>
            </div>
        );
    }

    const handleCategoryClick = (categoryId: string, titre: string) => {
        // Feedback haptique léger (vibration si supporté)
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        router.push(`/star/category/${categoryId}/selection?r=${titre}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
            {/* Décoration de fond */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-100/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* En-tête avec animation */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-3 shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Découvrez votre guidance
                    </h1>

                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choisissez une catégorie pour commencer votre voyage spirituel
                    </p>

                    <div className="flex justify-center gap-2 mt-6">
                        <div className="h-1 w-12 bg-indigo-200 rounded-full" />
                        <div className="h-1 w-12 bg-indigo-400 rounded-full" />
                        <div className="h-1 w-12 bg-indigo-200 rounded-full" />
                    </div>
                </motion.div>

                {/* Grille des catégories */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2"
                >
                    <AnimatePresence>
                        {categories.map((cat, index) => (
                            <motion.button
                                key={cat._id}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCategoryClick(cat._id, cat.titre!)}
                                className="group relative w-full text-left overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                {/* Gradient de fond au hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Barre de couleur décorative */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                                <div className="relative p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Icône et titre */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                                                    {getRandomIcon(index)}
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                    {cat.nom}
                                                </h2>
                                            </div>

                                            {/* Description */}
                                            {cat.description && (
                                                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors">
                                                    {cat.description}
                                                </p>
                                            )}

                                            {/* Indicateur visuel */}
                                            <div className="mt-4 flex items-center text-xs text-indigo-400 font-medium gap-1 group-hover:gap-2 transition-all">
                                                <span>Explorer</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>

                                        {/* Élément décoratif */}
                                        <div className="hidden sm:block">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Sparkles className="w-5 h-5 text-indigo-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Footer avec statistiques (optionnel) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-xs text-gray-400">
                        {categories.length} catégorie{categories.length > 1 ? 's' : ''} disponible{categories.length > 1 ? 's' : ''}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}