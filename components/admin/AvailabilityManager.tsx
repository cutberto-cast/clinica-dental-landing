"use client";

import { useState } from "react";
import type { AvailabilityRule } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface Props {
  rules: AvailabilityRule[];
  dayNames: string[];
}

export default function AvailabilityManager({ rules, dayNames }: Props) {
  const [localRules, setLocalRules] = useState(rules);
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  async function saveRule(rule: AvailabilityRule) {
    setSaving(rule.day_of_week);
    const supabase = createClient();

    if (rule.id) {
      await supabase
        .from("availability_rules")
        .update({
          start_time: rule.start_time,
          end_time: rule.end_time,
          is_active: rule.is_active,
        })
        .eq("id", rule.id);
    } else {
      const { data } = await supabase
        .from("availability_rules")
        .insert({
          day_of_week: rule.day_of_week,
          start_time: rule.start_time,
          end_time: rule.end_time,
          is_active: rule.is_active,
        })
        .select()
        .single();

      if (data) {
        setLocalRules((prev) =>
          prev.map((r) => (r.day_of_week === rule.day_of_week ? data : r))
        );
      }
    }

    setSaving(null);
    setSaved(rule.day_of_week);
    setTimeout(() => setSaved(null), 2000);
  }

  function updateRule(dow: number, patch: Partial<AvailabilityRule>) {
    setLocalRules((prev) =>
      prev.map((r) => (r.day_of_week === dow ? { ...r, ...patch } : r))
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
      {localRules.map((rule) => (
        <div key={rule.day_of_week} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Toggle + nombre día */}
          <div className="flex items-center gap-3 sm:w-36">
            <button
              onClick={() => {
                const updated = { ...rule, is_active: !rule.is_active };
                updateRule(rule.day_of_week, { is_active: !rule.is_active });
                saveRule(updated);
              }}
              className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary
                ${rule.is_active ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"}`}
              aria-label={`Activar ${dayNames[rule.day_of_week]}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                  ${rule.is_active ? "translate-x-4" : ""}`}
              />
            </button>
            <span className={`font-medium text-sm ${rule.is_active ? "text-slate-800 dark:text-slate-100" : "text-slate-400"}`}>
              {dayNames[rule.day_of_week]}
            </span>
          </div>

          {/* Horarios */}
          <div className={`flex items-center gap-3 flex-1 ${!rule.is_active ? "opacity-40 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Desde</label>
              <input
                type="time"
                value={rule.start_time}
                onChange={(e) => updateRule(rule.day_of_week, { start_time: e.target.value })}
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <span className="text-slate-400 text-sm">—</span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Hasta</label>
              <input
                type="time"
                value={rule.end_time}
                onChange={(e) => updateRule(rule.day_of_week, { end_time: e.target.value })}
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-sm bg-white dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Botón guardar */}
          <button
            onClick={() => saveRule(rule)}
            disabled={saving === rule.day_of_week}
            className="text-xs px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 sm:w-24"
          >
            {saving === rule.day_of_week ? (
              <span className="flex items-center gap-1 justify-center">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </span>
            ) : saved === rule.day_of_week ? (
              "✓ Guardado"
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
