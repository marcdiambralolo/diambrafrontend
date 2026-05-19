'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React from 'react';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

interface CustomDateTimePickerProps {
    selected: DateLike;
    onChange: (date: Date) => void;
    placeholder?: string;
    minDate?: DateLike;
    maxDate?: DateLike;
    disabled?: boolean;
    className?: string;
}

// Constantes extraites du composant pour éviter les recréations
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'] as const;
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const;
const ITEM_HEIGHT = 40;

// Hook personnalisé pour la gestion du clic en dehors
const useClickOutside = (ref: React.RefObject<HTMLElement>, onClose: () => void) => {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, ref]);
};

// Composant mémoisé pour la liste défilante des heures/minutes/secondes
const TimeScroll = React.memo(({
    items,
    value,
    onChange,
    label
}: {
    items: number[];
    value: number;
    onChange: (val: number) => void;
    label: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (ref.current && !isScrolling) {
            ref.current.scrollTop = value * ITEM_HEIGHT - ref.current.clientHeight / 2 + ITEM_HEIGHT / 2;
        }
    }, [value, isScrolling]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        setIsScrolling(true);

        const scrollTop = e.currentTarget.scrollTop;
        const selectedIndex = Math.round(scrollTop / ITEM_HEIGHT);

        if (items[selectedIndex] !== undefined && items[selectedIndex] !== value) {
            onChange(items[selectedIndex]);
        }

        scrollTimeout.current = setTimeout(() => setIsScrolling(false), 150);
    }, [items, value, onChange]);

    return (
        <div className="flex-1 text-center">
            <div className="mb-2 text-sm font-semibold text-gray-500">{label}</div>
            <div className="relative h-48 overflow-hidden">
                <div
                    ref={ref}
                    className="absolute inset-0 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none' }}
                    onScroll={handleScroll}
                >
                    <div className="flex flex-col items-center">
                        <div className="h-20" />
                        {items.map((item) => (
                            <div
                                key={item}
                                className={`flex h-10 items-center justify-center text-lg font-semibold transition-all duration-200
                  ${item === value ? 'scale-125 text-purple-600' : 'text-gray-400'}`}
                            >
                                {String(item).padStart(2, '0')}
                            </div>
                        ))}
                        <div className="h-20" />
                    </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-purple-100/20 to-transparent" />
            </div>
        </div>
    );
});

TimeScroll.displayName = 'TimeScroll';

// Composant mémoisé pour le calendrier
const Calendar = React.memo(({
    viewMonth,
    tempDate,
    isDateDisabled,
    onDateSelect
}: {
    viewMonth: Date;
    tempDate: Date;
    isDateDisabled: (date: Date) => boolean;
    onDateSelect: (day: number, month: number, year: number) => void;
}) => {
    const getDaysInMonth = useCallback((date: Date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), []);

    const getFirstDayOfMonth = useCallback((date: Date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1;
    }, []);

    const renderCalendar = useCallback(() => {
        const daysInMonth = getDaysInMonth(viewMonth);
        const firstDay = getFirstDayOfMonth(viewMonth);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weeks: JSX.Element[] = [];
        let daysArray: JSX.Element[] = [];

        // Jours vides
        for (let i = 0; i < firstDay; i++) {
            daysArray.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
            const isSelected = tempDate.getDate() === day &&
                tempDate.getMonth() === viewMonth.getMonth() &&
                tempDate.getFullYear() === viewMonth.getFullYear();
            const isToday = today.getTime() === currentDate.getTime();
            const isDisabled = isDateDisabled(currentDate);

            daysArray.push(
                <motion.button
                    key={day}
                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    onClick={() => !isDisabled && onDateSelect(day, viewMonth.getMonth(), viewMonth.getFullYear())}
                    disabled={isDisabled}
                    className={`
            relative h-10 w-10 rounded-full font-semibold transition-all duration-200
            ${isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                            : isToday && !isSelected
                                ? 'border-2 border-purple-400 text-purple-700'
                                : isDisabled
                                    ? 'cursor-not-allowed text-gray-300'
                                    : 'text-gray-700 hover:bg-purple-100'
                        }
          `}
                >
                    {day}
                    {isToday && !isSelected && (
                        <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-purple-500" />
                    )}
                </motion.button>
            );

            if (daysArray.length === 7) {
                weeks.push(
                    <div key={`week-${weeks.length}`} className="flex justify-between gap-1">
                        {daysArray}
                    </div>
                );
                daysArray = [];
            }
        }

        if (daysArray.length > 0) {
            weeks.push(
                <div key={`week-${weeks.length}`} className="flex justify-between gap-1">
                    {daysArray}
                    {Array.from({ length: 7 - daysArray.length }).map((_, i) => (
                        <div key={`empty-end-${i}`} className="h-10 w-10" />
                    ))}
                </div>
            );
        }

        return weeks;
    }, [viewMonth, tempDate, isDateDisabled, onDateSelect, getDaysInMonth, getFirstDayOfMonth]);

    return <div className="space-y-1">{renderCalendar()}</div>;
});

Calendar.displayName = 'Calendar';

export function CustomDateTimePicker({
    selected,
    onChange,
    placeholder = 'Sélectionner une date et heure',
    minDate,
    maxDate,
    disabled = false,
    className = '',
}: CustomDateTimePickerProps) {
    const normalizedSelected = useMemo(
        () => (selected ? toSafeDate(selected, new Date()) : null),
        [selected]
    );

    const [isOpen, setIsOpen] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(normalizedSelected ?? new Date());
    const [viewMonth, setViewMonth] = useState<Date>(normalizedSelected ?? new Date());
    const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');

    const pickerRef = useRef<HTMLDivElement>(null);

    useClickOutside(pickerRef, () => setIsOpen(false));

    // Mise à jour de la vue quand la date temporaire change
    useEffect(() => {
        setViewMonth(prev => {
            if (prev.getMonth() === tempDate.getMonth() && prev.getFullYear() === tempDate.getFullYear()) {
                return prev;
            }
            return new Date(tempDate);
        });
    }, [tempDate]);

    const isDateDisabled = useCallback((date: Date): boolean => {
        const min = minDate ? toSafeDate(minDate) : null;
        const max = maxDate ? toSafeDate(maxDate) : null;
        if (min && date < min) return true;
        if (max && date > max) return true;
        return false;
    }, [minDate, maxDate]);

    // Fonction pour la sélection de la date (validation immédiate)
    const updateDate = useCallback((updates: Partial<{ year: number; month: number; day: number; hours: number; minutes: number; seconds: number }>) => {
        setTempDate(prevDate => {
            const newDate = new Date(prevDate);
            if (updates.year !== undefined) newDate.setFullYear(updates.year);
            if (updates.month !== undefined) newDate.setMonth(updates.month);
            if (updates.day !== undefined) newDate.setDate(updates.day);
            if (updates.hours !== undefined) newDate.setHours(updates.hours);
            if (updates.minutes !== undefined) newDate.setMinutes(updates.minutes);
            if (updates.seconds !== undefined) newDate.setSeconds(updates.seconds);

            if (!isDateDisabled(newDate)) {
                onChange(newDate); // Validation immédiate pour la date
                return newDate;
            }
            return prevDate;
        });
    }, [isDateDisabled, onChange]);

    // Fonction pour la sélection de l'heure (sans validation immédiate)
    const updateTime = useCallback((updates: Partial<{ hours: number; minutes: number; seconds: number }>) => {
        setTempDate(prevDate => {
            const newDate = new Date(prevDate);
            if (updates.hours !== undefined) newDate.setHours(updates.hours);
            if (updates.minutes !== undefined) newDate.setMinutes(updates.minutes);
            if (updates.seconds !== undefined) newDate.setSeconds(updates.seconds);

            if (!isDateDisabled(newDate)) {
                // NE PAS appeler onChange ici - on attend la confirmation
                return newDate;
            }
            return prevDate;
        });
    }, [isDateDisabled]);

    const changeMonth = useCallback((delta: number) => {
        setViewMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + delta);
            return newDate;
        });
    }, []);

    const changeYear = useCallback((delta: number) => {
        setViewMonth(prev => {
            const newDate = new Date(prev);
            newDate.setFullYear(prev.getFullYear() + delta);
            return newDate;
        });
    }, []);

    const selectToday = useCallback(() => {
        const today = new Date();
        if (!isDateDisabled(today)) {
            setTempDate(today);
            setViewMonth(today);
            onChange(today); // Validation immédiate pour "Aujourd'hui"
        }
    }, [isDateDisabled, onChange]);

    const handleConfirm = useCallback(() => {
        onChange(tempDate); // Validation finale uniquement au clic sur Confirmer
        setIsOpen(false);
    }, [onChange, tempDate]);

    // Mémorisation des props pour les composants enfants mémoisés
    const calendarProps = useMemo(() => ({
        viewMonth,
        tempDate,
        isDateDisabled,
        onDateSelect: (day: number, month: number, year: number) => updateDate({ day, month, year })
    }), [viewMonth, tempDate, isDateDisabled, updateDate]);

    const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
    const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
    const seconds = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

    return (
        <div className={`relative ${className}`} ref={pickerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(prev => !prev)}
                disabled={disabled}
                className={`
          flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 transition-all duration-200
          ${disabled
                        ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                        : isOpen
                            ? 'border-purple-500 bg-white shadow-lg ring-4 ring-purple-100'
                            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }
        `}
            >
                <span className={normalizedSelected ? 'text-gray-700' : 'text-gray-400'}>
                    {normalizedSelected ? formatDateTimeFR(normalizedSelected) : placeholder}
                </span>
                <CalendarIcon className={`h-5 w-5 transition-colors ${isOpen ? 'text-purple-500' : 'text-gray-400'}`} />
            </button>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute z-50 mt-3 w-[420px] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
                    >
                        {/* Header avec onglets */}
                        <div className="border-b border-gray-100">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab('date')}
                                    className={`
                    flex-1 py-3 text-sm font-semibold transition-all
                    ${activeTab === 'date'
                                            ? 'border-b-2 border-purple-500 text-purple-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }
                  `}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        Date
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('time')}
                                    className={`
                    flex-1 py-3 text-sm font-semibold transition-all
                    ${activeTab === 'time'
                                            ? 'border-b-2 border-purple-500 text-purple-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }
                  `}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <ClockIcon className="h-4 w-4" />
                                        Heure
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            {activeTab === 'date' ? (
                                <>
                                    {/* Navigation mois/année */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => changeYear(-1)}
                                                className="rounded-lg p-2 hover:bg-gray-100"
                                            >
                                                <ChevronLeftIcon className="h-4 w-4" />
                                                <ChevronLeftIcon className="h-4 w-4 -ml-2" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => changeMonth(-1)}
                                                className="rounded-lg p-2 hover:bg-gray-100"
                                            >
                                                <ChevronLeftIcon className="h-4 w-4" />
                                            </motion.button>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-sm font-bold text-gray-700">
                                                {MONTHS[viewMonth.getMonth()]}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {viewMonth.getFullYear()}
                                            </div>
                                        </div>

                                        <div className="flex gap-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => changeMonth(1)}
                                                className="rounded-lg p-2 hover:bg-gray-100"
                                            >
                                                <ChevronRightIcon className="h-4 w-4" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => changeYear(1)}
                                                className="rounded-lg p-2 hover:bg-gray-100"
                                            >
                                                <ChevronRightIcon className="h-4 w-4" />
                                                <ChevronRightIcon className="h-4 w-4 -ml-2" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Jours de la semaine */}
                                    <div className="mb-2 grid grid-cols-7 gap-1">
                                        {DAYS.map(day => (
                                            <div key={day} className="text-center text-xs font-semibold text-gray-400">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendrier mémoisé */}
                                    <Calendar {...calendarProps} />

                                    {/* Bouton Aujourd'hui */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={selectToday}
                                        className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 py-2 text-sm font-semibold text-purple-600 transition-all hover:from-purple-100 hover:to-pink-100"
                                    >
                                        Aujourd'hui
                                    </motion.button>
                                </>
                            ) : (
                                <div className="flex gap-4">
                                    <TimeScroll
                                        items={hours}
                                        value={tempDate.getHours()}
                                        onChange={(h) => updateTime({ hours: h })}
                                        label="Heures"
                                    />
                                    <TimeScroll
                                        items={minutes}
                                        value={tempDate.getMinutes()}
                                        onChange={(m) => updateTime({ minutes: m })}
                                        label="Minutes"
                                    />
                                    <TimeScroll
                                        items={seconds}
                                        value={tempDate.getSeconds()}
                                        onChange={(s) => updateTime({ seconds: s })}
                                        label="Secondes"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-2 border-t border-gray-100 p-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirm}
                                className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-2 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                            >
                                Confirmer
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsOpen(false)}
                                className="flex-1 rounded-xl border border-gray-200 py-2 font-semibold text-gray-600 transition-all hover:bg-gray-50"
                            >
                                Annuler
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Fonctions utilitaires (à placer dans un fichier utils séparé normalement)
function toSafeDate(value: DateLike, fallback?: Date): Date {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return new Date(value);
    }

    if (typeof value === 'string' || typeof value === 'number') {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed;
        }
    }

    return fallback ? new Date(fallback) : new Date();
}

function formatDateTimeFR(date: Date): string {
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

type DateLike = Date | string | number | null | undefined;