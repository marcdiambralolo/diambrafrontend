'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, Edit3, Check, X } from 'lucide-react';
import React from 'react';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

interface CustomDateTimePickerProps {
  selected: Date | string | number | null | undefined;
  onChange: (date: Date) => void;
  placeholder?: string;
  minDate?: Date | string | number | null | undefined;
  maxDate?: Date | string | number | null | undefined;
  disabled?: boolean;
  className?: string;
}

type DateLike = Date | string | number | null | undefined;

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
  });
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
] as const;
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const;
const ITEM_HEIGHT = 40;

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

interface ManualTimeInputProps {
  value: Date;
  onChange: (updates: { hours: number; minutes: number }) => void;
}

const ManualTimeInput = ({ value, onChange }: ManualTimeInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHours, setTempHours] = useState(value.getHours().toString().padStart(2, '0'));
  const [tempMinutes, setTempMinutes] = useState(value.getMinutes().toString().padStart(2, '0'));

  const handleSave = () => {
    let hours = parseInt(tempHours, 10);
    let minutes = parseInt(tempMinutes, 10);

    if (isNaN(hours)) hours = 0;
    if (isNaN(minutes)) minutes = 0;

    hours = Math.max(0, Math.min(23, hours));
    minutes = Math.max(0, Math.min(59, minutes));

    onChange({ hours, minutes });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempHours(value.getHours().toString().padStart(2, '0'));
    setTempMinutes(value.getMinutes().toString().padStart(2, '0'));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2"
      >
        <div className="flex items-center gap-1 bg-purple-50 rounded-xl p-1">
          <input
            type="number"
            value={tempHours}
            onChange={(e) => setTempHours(e.target.value)}
            min="0"
            max="23"
            className="w-14 text-center py-2 rounded-lg bg-white border border-purple-200 text-purple-700 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />
          <span className="text-purple-500 font-bold text-xl">:</span>
          <input
            type="number"
            value={tempMinutes}
            onChange={(e) => setTempMinutes(e.target.value)}
            min="0"
            max="59"
            className="w-14 text-center py-2 rounded-lg bg-white border border-purple-200 text-purple-700 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all group"
    >
      <div className="text-center">
        <p className="text-2xl font-black text-purple-700">
          {value.getHours().toString().padStart(2, '0')}
        </p>
        <p className="text-[10px] text-purple-400">Heures</p>
      </div>
      <span className="text-2xl font-bold text-purple-400">:</span>
      <div className="text-center">
        <p className="text-2xl font-black text-purple-700">
          {value.getMinutes().toString().padStart(2, '0')}
        </p>
        <p className="text-[10px] text-purple-400">Minutes</p>
      </div>
      <Edit3 className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

const TimeScroll = React.memo(({
  items,
  value,
  onChange,
  label,
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
      <div className="relative h-48 overflow-hidden rounded-xl bg-gradient-to-b from-gray-50 to-white">
        <div
          ref={ref}
          className="absolute inset-0 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
          onScroll={handleScroll}
          onClick={(e) => e.stopPropagation()}
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

const Calendar = React.memo(({
  viewMonth,
  tempDate,
  isDateDisabled,
  onDateSelect,
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

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

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
          type="button"
          whileHover={!isDisabled ? { scale: 1.05 } : {}}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDisabled) onDateSelect(day, viewMonth.getMonth(), viewMonth.getFullYear());
          }}
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
        weeks.push(<div key={`week-${weeks.length}`} className="flex justify-between gap-1">{daysArray}</div>);
        daysArray = [];
      }
    }

    if (daysArray.length > 0) {
      weeks.push(<div key={`week-${weeks.length}`} className="flex justify-between gap-1">{daysArray}</div>);
    }

    return <div className="space-y-1">{weeks}</div>;
  }, [viewMonth, tempDate, isDateDisabled, onDateSelect, getDaysInMonth, getFirstDayOfMonth]);

  return renderCalendar();
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
  const normalizedSelected = useMemo(() => (selected ? toSafeDate(selected, new Date()) : null), [selected]);

  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(normalizedSelected ?? new Date());
  const [viewMonth, setViewMonth] = useState<Date>(normalizedSelected ?? new Date());
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
  const [inputMode, setInputMode] = useState<'scroll' | 'manual'>('manual');

  const pickerRef = useRef<HTMLDivElement>(null);

  useClickOutside(pickerRef, () => setIsOpen(false));

  useEffect(() => {
    setTempDate(normalizedSelected ?? new Date());
  }, [normalizedSelected]);

  useEffect(() => {
    setViewMonth((prev) => {
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

  const updateDate = useCallback((updates: Partial<{ year: number; month: number; day: number }>) => {
    setTempDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (updates.year !== undefined) newDate.setFullYear(updates.year);
      if (updates.month !== undefined) newDate.setMonth(updates.month);
      if (updates.day !== undefined) newDate.setDate(updates.day);
      return newDate;
    });
  }, []);

  const updateTime = useCallback((updates: { hours: number; minutes: number }) => {
    setTempDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setHours(updates.hours);
      newDate.setMinutes(updates.minutes);
      newDate.setSeconds(0);
      return newDate;
    });
  }, []);

  const changeMonth = useCallback((delta: number) => {
    setViewMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + delta);
      return newDate;
    });
  }, []);

  const changeYear = useCallback((delta: number) => {
    setViewMonth((prev) => {
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
    }
  }, [isDateDisabled]);

  const handleConfirm = useCallback(() => {
    onChange(tempDate);
    setIsOpen(false);
  }, [onChange, tempDate]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
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
            className="absolute z-50 mt-3 w-[480px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête avec onglets */}
            <div className="border-b border-gray-100">
              <div className="flex">
                <button
                  type="button"
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
                  type="button"
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
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => changeYear(-1)}
                        className="rounded-lg p-2 hover:bg-gray-100"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        <ChevronLeftIcon className="h-4 w-4 -ml-2" />
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => changeMonth(-1)}
                        className="rounded-lg p-2 hover:bg-gray-100"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </motion.button>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-700">{MONTHS[viewMonth.getMonth()]}</div>
                      <div className="text-xs text-gray-500">{viewMonth.getFullYear()}</div>
                    </div>

                    <div className="flex gap-1">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => changeMonth(1)}
                        className="rounded-lg p-2 hover:bg-gray-100"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        type="button"
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
                    {DAYS.map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-gray-400">{day}</div>
                    ))}
                  </div>

                  {/* Calendrier */}
                  <Calendar
                    viewMonth={viewMonth}
                    tempDate={tempDate}
                    isDateDisabled={isDateDisabled}
                    onDateSelect={(day, month, year) => updateDate({ day, month, year })}
                  />

                  {/* Bouton Aujourd'hui */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={selectToday}
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 py-2 text-sm font-semibold text-purple-600 transition-all hover:from-purple-100 hover:to-pink-100"
                  >
                    Aujourd'hui
                  </motion.button>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Sélecteur de mode */}
                  <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setInputMode('manual')}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${inputMode === 'manual' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500'}`}
                    >
                      Saisie manuelle
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('scroll')}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${inputMode === 'scroll' ? 'bg-white shadow-md text-purple-600' : 'text-gray-500'}`}
                    >
                      Roue de sélection
                    </button>
                  </div>

                  {/* Contenu selon le mode */}
                  {inputMode === 'manual' ? (
                    <div className="flex justify-center py-4">
                      <ManualTimeInput value={tempDate} onChange={updateTime} />
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <TimeScroll items={hours} value={tempDate.getHours()} onChange={(h) => updateTime({ hours: h, minutes: tempDate.getMinutes() })} label="Heures" />
                      <TimeScroll items={minutes} value={tempDate.getMinutes()} onChange={(m) => updateTime({ hours: tempDate.getHours(), minutes: m })} label="Minutes" />
                    </div>
                  )}

                  {/* Affichage de l'heure sélectionnée */}
                  <div className="text-center pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Heure sélectionnée</p>
                    <p className="text-2xl font-black text-purple-700">
                      {tempDate.getHours().toString().padStart(2, '0')}:{tempDate.getMinutes().toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Boutons de confirmation */}
            <div className="flex gap-2 border-t border-gray-100 p-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-2 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                Confirmer
              </motion.button>
              <motion.button
                type="button"
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