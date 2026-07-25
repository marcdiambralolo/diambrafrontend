'use client';
import { formatEditionDate } from "@/lib/functions";
import { Trophy } from "lucide-react";
import { memo } from 'react';

const EditionCard = memo(({ activeEdition }: { activeEdition: { startDate: string; endDate: string; name?: string } }) => (
    <div className="mb-4 mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-800 via-indigo-600 to-gray-600 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-white text-sm font-semibold">
                        {activeEdition.name || 'Édition Précédente'}
                    </p>
                    <p className="text-white/80 text-xs">
                        Du {formatEditionDate(new Date(activeEdition.startDate))} au {formatEditionDate(new Date(activeEdition.endDate))}
                    </p>
                </div>
            </div>
        </div>
    </div>
));

export default EditionCard;