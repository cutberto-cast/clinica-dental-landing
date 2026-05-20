"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const STATUS_LABELS: Record<AppointmentStatus, { label: string; color: string }> = {
  pending:   { label: "Pendiente",   color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  confirmed: { label: "Confirmada",  color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  completed: { label: "Completada",  color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Cancelada",   color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  no_show:   { label: "No asistió",  color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400" },
};

interface Props {
  appointment: Appointment;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}

export default function AppointmentCard({ appointment: appt, onStatusChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = STATUS_LABELS[appt.status];
  const start = new Date(appt.starts_at);
  const end = new Date(appt.ends_at);

  async function updateStatus(newStatus: AppointmentStatus) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appt.id);

    if (!error) onStatusChange(appt.id, newStatus);
    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button
        className="w-full text-left p-4 flex items-start gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Hora */}
        <div className="text-center w-14 shrink-0">
          <div className="text-base font-bold text-slate-800 dark:text-slate-100">
            {format(start, "HH:mm")}
          </div>
          <div className="text-xs text-slate-400">{format(end, "HH:mm")}</div>
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {appt.patient?.name}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {appt.service?.name} · {appt.service?.duration} min
          </p>
        </div>

        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform mt-1 ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 pb-4 pt-3 space-y-3">
          {/* Datos del paciente */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-slate-400 text-xs">Teléfono</p>
              <a href={`tel:${appt.patient?.phone}`} className="font-medium text-primary hover:underline">
                {appt.patient?.phone}
              </a>
            </div>
            {appt.patient?.email && (
              <div>
                <p className="text-slate-400 text-xs">Email</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">{appt.patient.email}</p>
              </div>
            )}
            {appt.service?.price && (
              <div>
                <p className="text-slate-400 text-xs">Precio</p>
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  ${appt.service.price.toLocaleString("es-MX")} MXN
                </p>
              </div>
            )}
          </div>

          {appt.notes && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-sm">
              <p className="text-slate-400 text-xs mb-0.5">Nota del paciente</p>
              <p className="text-slate-700 dark:text-slate-300">{appt.notes}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex flex-wrap gap-2 pt-1">
            {appt.status === "pending" && (
              <button
                onClick={() => updateStatus("confirmed")}
                disabled={loading}
                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Confirmar
              </button>
            )}
            {(appt.status === "pending" || appt.status === "confirmed") && (
              <button
                onClick={() => updateStatus("completed")}
                disabled={loading}
                className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Marcar completada
              </button>
            )}
            {(appt.status === "pending" || appt.status === "confirmed") && (
              <>
                <button
                  onClick={() => updateStatus("no_show")}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
                >
                  No asistió
                </button>
                <button
                  onClick={() => updateStatus("cancelled")}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
