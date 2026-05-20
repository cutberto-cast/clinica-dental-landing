"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { BlockedSlot } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface Props {
  initialBlocks: BlockedSlot[];
}

interface NewBlock {
  type: "full_day" | "range";
  date: string;
  start_at: string;
  end_at: string;
  reason: string;
}

const EMPTY: NewBlock = {
  type: "full_day",
  date: "",
  start_at: "",
  end_at: "",
  reason: "",
};

export default function BlockedSlotsManager({ initialBlocks }: Props) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [form, setForm] = useState<NewBlock>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.date) {
      setError("La fecha es requerida");
      return;
    }
    if (form.type === "range" && (!form.start_at || !form.end_at)) {
      setError("Indica la hora de inicio y fin");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> =
      form.type === "full_day"
        ? {
            is_full_day: true,
            date: form.date,
            start_at: null,
            end_at: null,
            reason: form.reason || null,
          }
        : {
            is_full_day: false,
            date: null,
            start_at: `${form.date}T${form.start_at}:00`,
            end_at: `${form.date}T${form.end_at}:00`,
            reason: form.reason || null,
          };

    const { data, error: err } = await supabase
      .from("blocked_slots")
      .insert(payload)
      .select()
      .single();

    if (err) {
      setError(err.message);
    } else if (data) {
      setBlocks((prev) => [data, ...prev]);
      setForm(EMPTY);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("blocked_slots").delete().eq("id", id);
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      {/* Formulario */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Agregar bloqueo</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          {/* Tipo */}
          <div className="flex gap-3">
            {(["full_day", "range"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors
                  ${form.type === t
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
              >
                {t === "full_day" ? "Día completo" : "Rango de horas"}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {form.type === "range" && (
              <>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Hora inicio</label>
                  <input
                    type="time"
                    value={form.start_at}
                    onChange={(e) => setForm({ ...form, start_at: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Hora fin</label>
                  <input
                    type="time"
                    value={form.end_at}
                    onChange={(e) => setForm({ ...form, end_at: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            )}
            <div className={form.type === "range" ? "sm:col-span-2" : ""}>
              <label className="block text-xs text-slate-500 mb-1">Razón (opcional)</label>
              <input
                type="text"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Ej. Vacaciones, cita personal..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando...</>
            ) : (
              "Agregar bloqueo"
            )}
          </button>
        </form>
      </div>

      {/* Lista */}
      <div>
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wide">
          Bloqueos activos y futuros
        </h2>
        {blocks.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No hay bloqueos configurados.</p>
        ) : (
          <div className="space-y-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${block.is_full_day ? "bg-red-400" : "bg-orange-400"}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {block.is_full_day
                        ? `Día completo — ${block.date}`
                        : `${block.start_at ? format(new Date(block.start_at), "d MMM · HH:mm", { locale: es }) : ""} – ${block.end_at ? format(new Date(block.end_at), "HH:mm", { locale: es }) : ""}`
                      }
                    </p>
                    {block.reason && (
                      <p className="text-xs text-slate-400">{block.reason}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(block.id)}
                  disabled={deleting === block.id}
                  className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
                  aria-label="Eliminar bloqueo"
                >
                  {deleting === block.id ? (
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
