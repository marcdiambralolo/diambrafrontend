import { memo, useMemo, useState } from "react";
import { DollarSign, Search, ImageOff } from "lucide-react";
import type { Offering, OfferingAlternative } from "@/lib/interfaces";
import { motion } from "framer-motion";
import Image from "next/image";

type OfferingCategory = "animal" | "vegetal" | "beverage";

const CATEGORY_CONFIG: Record<OfferingCategory, { icon: string; label: string; color: string; bgColor: string }> = {
    animal: {
        icon: "🐾",
        label: "Animal",
        color: "text-amber-700 border-amber-300",
        bgColor: "bg-amber-50"
    },
    vegetal: {
        icon: "🌿",
        label: "Végétal",
        color: "text-green-700 border-green-300",
        bgColor: "bg-green-50"
    },
    beverage: {
        icon: "🥤",
        label: "Boisson",
        color: "text-blue-700 border-blue-300",
        bgColor: "bg-blue-50"
    }
};

// Composant pour afficher l'image ou un fallback
const OfferingImage = memo(({ src, name }: { src?: string; name: string }) => {
    const [imageError, setImageError] = useState(false);

    if (!src || imageError) {
        return (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <ImageOff className="w-5 h-5 text-slate-400" />
            </div>
        );
    }

    return (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <Image
                src={src}
                alt={name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
            />
        </div>
    );
});

OfferingImage.displayName = "OfferingImage";

// Option de sélection personnalisée avec image
const OfferingOption = memo(({ offering, isSelected, onClick }: { 
    offering: Offering; 
    isSelected: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                isSelected 
                    ? 'bg-indigo-50 border-2 border-indigo-400 shadow-sm' 
                    : 'hover:bg-slate-50 border-2 border-transparent'
            }`}
        >
            <OfferingImage src={offering.illustrationUrl} name={offering.name} />
            <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-slate-900">
                        {offering.name}
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                        {offering.price} FCFA
                    </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">
                    {offering.description}
                </p>
            </div>
        </button>
    );
});

OfferingOption.displayName = "OfferingOption";

export const OfferingSelector = memo(({
    alternative,
    offerings,
    onChange
}: {
    alternative: OfferingAlternative;
    offerings: Offering[];
    onChange: (updated: OfferingAlternative) => void;
}) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const config = CATEGORY_CONFIG[alternative.category as OfferingCategory];

    const filteredOfferings = useMemo(() =>
        offerings
            .filter(o => o.category === alternative.category)
            .filter(o =>
                search === "" ||
                o.name.toLowerCase().includes(search.toLowerCase()) ||
                o.description?.toLowerCase().includes(search.toLowerCase())
            ),
        [offerings, alternative.category, search]
    );

    // Offrande sélectionnée
    const selectedOffering = useMemo(() =>
        offerings.find(o => o._id === alternative.offeringId),
        [offerings, alternative.offeringId]
    );

    const handleSelectOffering = (offeringId: string) => {
        onChange({ ...alternative, offeringId });
        setSearch("");
        setIsOpen(false);
    };

    return (
        <motion.div
            layout
            className={`p-3 mb-4 rounded-xl border-2 ${config.color} ${config.bgColor} space-y-3`}
        >
            {/* Header avec catégorie */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className="text-xs font-bold">{config.label}</span>
                </div>
                {selectedOffering && (
                    <div className="flex items-center gap-1 text-xs font-semibold">
                        <DollarSign className="w-3 h-3" />
                        {selectedOffering.price} FCFA
                    </div>
                )}
            </div>

            {/* Affichage de l'offrande sélectionnée avec image */}
            {selectedOffering ? (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/50"
                >
                    <OfferingImage src={selectedOffering.illustrationUrl} name={selectedOffering.name} />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">
                                {selectedOffering.name}
                            </span>
                            <button
                                onClick={() => handleSelectOffering("")}
                                className="text-xs text-red-500 hover:text-red-700"
                            >
                                Changer
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                            {selectedOffering.description}
                        </p>
                    </div>
                </motion.div>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-3 text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white/50 rounded-lg border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition-all"
                >
                    + Sélectionner une offrande
                </button>
            )}

            {/* Sélecteur personnalisé */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                >
                    {/* Barre de recherche */}
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher..."
                            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 \
                                   focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-transparent \
                                   bg-white dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
                        />
                    </div>

                    {/* Liste des offrandes */}
                    <div className="max-h-64 overflow-y-auto space-y-2 rounded-lg bg-white p-2 shadow-lg border border-slate-200">
                        {filteredOfferings.length === 0 ? (
                            <div className="text-center py-8 text-sm text-slate-500">
                                Aucune offrande trouvée
                            </div>
                        ) : (
                            filteredOfferings.map((offering) => (
                                <OfferingOption
                                    key={offering._id}
                                    offering={offering}
                                    isSelected={alternative.offeringId === offering._id!}
                                    onClick={() => handleSelectOffering(offering._id!)}
                                />
                            ))
                        )}
                    </div>
                </motion.div>
            )}

            {/* Quantité (visible seulement si une offrande est sélectionnée) */}
            {selectedOffering && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 pt-2 border-t border-slate-200"
                >
                    <label className="text-xs font-semibold">Quantité:</label>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onChange({ 
                                ...alternative, 
                                quantity: Math.max(1, alternative.quantity - 1) 
                            })}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min={1}
                            max={10}
                            value={alternative.quantity}
                            onChange={(e) => onChange({ 
                                ...alternative, 
                                quantity: Math.max(1, Number(e.target.value)) 
                            })}
                            className="w-16 px-3 py-2 text-sm rounded-lg border border-slate-300 \
                                   focus:ring-2 focus:ring-[#2E5AA6]/40 focus:border-transparent \
                                   bg-white font-bold text-center dark:border-white/10 dark:bg-[#0F1C3F] dark:text-slate-100"
                        />
                        <button
                            onClick={() => onChange({ 
                                ...alternative, 
                                quantity: Math.min(10, alternative.quantity + 1) 
                            })}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                        >
                            +
                        </button>
                    </div>
                    <div className="ml-auto text-right">
                        <div className="text-xs font-semibold text-indigo-600">
                            Total: {selectedOffering.price * alternative.quantity} FCFA
                        </div>
                        {selectedOffering.priceUSD && (
                            <div className="text-xs text-slate-500">
                                ${(selectedOffering.priceUSD * alternative.quantity).toFixed(2)}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Description détaillée */}
            {selectedOffering && selectedOffering.description && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-2 text-xs text-slate-600 border-t border-slate-200"
                >
                    <p className="line-clamp-2">{selectedOffering.description}</p>
                </motion.div>
            )}
        </motion.div>
    );
});

OfferingSelector.displayName = "OfferingSelector";