"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import AppointmentCard from "./AppointmentCard";

interface Props {
  appointments: Appointment[];
}

export default function AgendaView({ appointments }: Props) {
  const [list, setList] = useState(appointments);

  // Agrupar por día
  const groups: Record<string, Appointment[]> = {};
  for (const appt of list) {
    const key = format(new Date(appt.starts_at), "yyyy-MM-dd");
    if (!groups[key]) groups[key] = [];
    groups[key].push(appt);
  }

  function handleStatusChange(id: string, newStatus: AppointmentStatus) {
    setList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  }

  if (list.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-medium">No hay citas en los próximos 7 días</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([dateKey, dayAppts]) => {
        const date = new Date(dateKey + "T12:00:00");
        const isToday = isSameDay(date, new Date());
        return (
          <div key={dateKey}>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">
              <span className="capitalize">
                {isToday ? "Hoy — " : ""}
                {format(date, "EEEE d 'de' MMMM", { locale: es })}
              </span>
              <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full px-2 py-0.5">
                {dayAppts.length}
              </span>
            </h2>
            <div className="space-y-3">
              {dayAppts.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
