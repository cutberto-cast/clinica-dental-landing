"use client";

interface Props {
  slots: string[];
  selected: string | null;
  onSelect: (slot: string) => void;
  loading?: boolean;
}

export default function TimeSlotPicker({ slots, selected, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">No hay horarios disponibles para este día.</p>
        <p className="text-sm">Selecciona otra fecha.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => (
        <button
          key={slot}
          onClick={() => onSelect(slot)}
          className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all
            ${selected === slot
              ? "bg-primary text-white border-primary shadow-md"
              : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary bg-white dark:bg-slate-800"
            }`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
