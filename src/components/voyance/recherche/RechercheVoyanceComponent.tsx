"use client";
import { api } from "@/lib/api/client";
import { useCallback, useMemo, useState } from "react";
import { cx, toMediaUrl } from "@/lib/functions";
import { User } from "@/lib/interfaces";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { memo } from "react";

type PdfLikePaginationProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    onPage: (page: number) => void;
};

export const UI_PAGE_COUNT = 10;

export const PdfLikePagination = memo(function PdfLikePagination({
    page,
    totalPages,
    onPrev,
    onNext,
    onPage,
}: PdfLikePaginationProps) {

    return (
        <div className="mt-6 flex items-center justify-center gap-2">
            <button
                type="button"
                onClick={onPrev}
                disabled={page <= 1}
                className={cx(
                    "inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition",
                    page <= 1
                        ? "cursor-not-allowed border-[#1C3A6B] bg-[#162A56] text-[#4F83D1]/50"
                        : "border-[#2E5AA6] bg-[#162A56] text-white hover:bg-[#2E5AA6]"
                )}
                aria-label="Page précédente"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#1C3A6B] bg-[#162A56] px-3 py-2 text-[12px] font-extrabold text-[#E5E7EB] shadow-md">
                {Array.from({ length: UI_PAGE_COUNT }).map((_, index) => {
                    const currentPage = index + 1;
                    const isActive = currentPage === page;
                    const isEnabled = currentPage <= totalPages;

                    return (
                        <React.Fragment key={currentPage}>
                            <button
                                type="button"
                                onClick={() => {
                                    if (isEnabled) onPage(currentPage);
                                }}
                                disabled={!isEnabled}
                                className={cx(
                                    "h-8 w-8 rounded-xl border text-[12px] font-black tabular-nums transition",
                                    isActive
                                        ? "border-[#4F83D1] bg-[#2E5AA6] text-white shadow"
                                        : isEnabled
                                            ? "border-[#1C3A6B] bg-[#162A56] text-[#E5E7EB] hover:bg-[#2E5AA6] hover:text-white"
                                            : "cursor-not-allowed border-[#1C3A6B] bg-[#162A56] text-[#4F83D1]/50"
                                )}
                                aria-label={`Aller à la page ${currentPage}`}
                            >
                                {currentPage}
                            </button>

                            {currentPage < UI_PAGE_COUNT ? (
                                <span className="select-none font-black text-[#4F83D1]/60">{currentPage === 2 ? "–" : "-"}</span>
                            ) : null}
                        </React.Fragment>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={onNext}
                disabled={page >= totalPages}
                className={cx(
                    "inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition",
                    page >= totalPages
                        ? "cursor-not-allowed border-[#1C3A6B] bg-[#162A56] text-[#4F83D1]/50"
                        : "border-[#2E5AA6] bg-[#162A56] text-white hover:bg-[#2E5AA6]"
                )}
                aria-label="Page suivante"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
});

export type PractitionerType = "Médium" | "Voyante" | "Astrologue" | "Coach" | "Numérologue" | "Consultant";

export const PractitionerCard = memo(function PractitionerCard({
    practitioner,
    onConsultClick,
}: {
    practitioner: User;
    onConsultClick: (p: User) => void;

}) {
    const initial = practitioner.nom.slice(0, 1).toUpperCase();
    const specialties = Array.isArray(practitioner.specialties)
        ? practitioner.specialties.filter((value: unknown): value is string => typeof value === "string" && value.trim().length > 0).slice(0, 5)
        : [];

    const photoUrl = useMemo(
        () => toMediaUrl(practitioner.photo || practitioner.profilePicture || practitioner.avatar),
        [practitioner.avatar, practitioner.photo, practitioner.profilePicture]
    );

    return (
        <article className="group w-full overflow-hidden rounded-[32px] border border-[#1C3A6B] bg-[#162A56] p-4 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative overflow-hidden rounded-[28px] border border-[#2E5AA6] bg-[#0F1C3F]">
                <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#2E5AA6]/10 to-transparent" />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent to-[#2E5AA6]/30" />

                <div className="relative aspect-[4/4.7]">
                    {photoUrl ? (
                        <Image src={photoUrl} alt={practitioner.nom} fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                    ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-b from-[#2E5AA6]/30 to-[#162A56] text-6xl font-black text-white">
                            {initial}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 flex flex-col items-center text-center">
                <h3 className="max-w-[16rem] text-xl font-black tracking-tight text-white sm:text-2xl">
                    {practitioner.username || practitioner.nom}
                </h3>

                <div className="mt-3 min-h-[3.5rem]">
                    {specialties.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-2">
                            {specialties.map((specialty) => (
                                <span
                                    key={specialty}
                                    className="rounded-full border border-[#4F83D1] bg-[#2E5AA6]/20 px-3 py-1.5 text-[11px] font-extrabold text-[#9BC2FF] shadow-sm"
                                >
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm font-semibold leading-relaxed text-[#AFC0DE]">
                            {practitioner.specialties || practitioner.presentation}            </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onConsultClick(practitioner)}
                    className="mt-5 w-full rounded-[20px] bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] px-4 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-[0_16px_40px_-28px_rgba(79,131,209,0.85)] transition hover:scale-[1.01] hover:shadow-lg"
                >
                    Consulter
                </button>
            </div>
        </article>
    );
});

export default function RechercheVoyanceComponent() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            const url = `/users/consultants/search?q=${encodeURIComponent(query)}`;
            const res = await api.get<{ consultants: User[] }>(url);
            setResults(res.data?.consultants || []);
        } catch (e) {
            setError("Erreur lors de la recherche. Veuillez réessayer." + e);
        } finally {
            setLoading(false);
        }
    }, [query]);

    const ResultsGrid = useMemo(() => {
        if (results.length > 0) {
            return (
                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {results.map((p) => (
                        <PractitionerCard
                            key={p._id}
                            practitioner={p}
                            onConsultClick={() => { }}
                        />
                    ))}
                </div>
            );
        } else if (searched && !loading && !error) {
            return (
                <div className="mt-8 rounded-3xl border border-[#2E5AA6] bg-[#162A56] p-8 text-center text-base font-semibold text-[#9BC2FF] shadow-lg">
                    Aucun consultant trouvé pour ce mot clé.<br />Essayez un autre terme ou une autre spécialité.
                </div>
            );
        } else {
            return (
                <div className="mt-8 text-center text-slate-400 text-base">
                    Saisissez un mot clé pour lancer la recherche
                </div>
            );
        }
    }, [results, searched, loading, error]);

    return (
        <main className="min-h-screen mt-8 bg-gradient-to-b from-[#070B1A] via-[#162A56] to-[#0F1C3F] text-white">
            <section className="text-center py-20 px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    Trouvez votre guide spirituel ✨
                </h1>

                <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                    Experts certifiés en voyance, tarot, astrologie, coaching et spiritualité. Trouvez le consultant qui vous correspond vraiment.
                </p>
            </section>

            <section className="max-w-3xl mx-auto px-4">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleSearch();
                    }}
                    className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-wrap gap-3 items-center justify-center"
                >
                    <input
                        type="text"
                        placeholder="Nom, spécialité, amour, carrière, guidance..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="flex-1 min-w-[220px] px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none text-white placeholder:text-slate-300"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#2E5AA6] to-[#4F83D1] hover:scale-105 transition text-white shadow-lg"
                    >
                        Rechercher
                    </button>
                </form>
            </section>
            <section className="max-w-6xl mx-auto px-4 py-16">
                {loading && (
                    <div className="text-center text-blue-200 animate-pulse text-lg font-semibold">
                        Recherche des meilleurs consultants...
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-400 font-semibold mb-8">{error}</div>
                )}
                {ResultsGrid}
            </section>
        </main>
    );
}