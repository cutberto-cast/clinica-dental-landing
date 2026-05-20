"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  availableDays: string[];
  selected: Date | null;
  onSelect: (date: Date) => void;
  onMonthChange: (year: number, month: number) => void;
  loading?: boolean;
}

const DOW_LABELS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

export default function CalendarPicker({ availableDays, selected, onSelect, onMonthChange, loading }: Props) {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;

  useEffect(() => {
    onMonthChange(year, month);
  }, [year, month]);

  const firstDay = startOfMonth(viewDate);
  const lastDay = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  const offset = getDay(firstDay); // 0=domingo

  const availableSet = new Set(availableDays);
  const today = startOfDay(new Date());

  function prevMonth() {
    const prev = subMonths(viewDate, 1);
    if (!isBefore(startOfMonth(prev), today)) {
      setViewDate(prev);
    }
  }

  function nextMonth() {
    setViewDate(addMonths(viewDate, 1));
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 max-w-sm mx-auto">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Mes anterior"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold capitalize text-slate-800 dark:text-slate-100">
          {format(viewDate, "MMMM yyyy", { locale: es })}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Mes siguiente"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Días de semana */}
      <div className="grid grid-cols-7 mb-1">
        {DOW_LABELS.map((d) => (
          <div key={d} className="text-center text-xs text-slate-400 font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const isAvailable = availableSet.has(key);
            const isSelected = selected ? isSameDay(day, selected) : false;
            const isPast = isBefore(day, today);

            return (
              <button
                key={key}
                disabled={!isAvailable || isPast}
                onClick={() => onSelect(day)}
                className={`
                  h-9 w-9 mx-auto rounded-full text-sm font-medium transition-all
                  ${isSelected ? "bg-primary text-white shadow-md" : ""}
                  ${isAvailable && !isPast && !isSelected
                    ? "hover:bg-primary/10 text-slate-800 dark:text-slate-100"
                    : ""}
                  ${!isAvailable || isPast
                    ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                    : "cursor-pointer"}
                `}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
