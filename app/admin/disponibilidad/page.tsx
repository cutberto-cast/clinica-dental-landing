import { createClient } from "@/lib/supabase/server";
import AvailabilityManager from "@/components/admin/AvailabilityManager";
import type { AvailabilityRule } from "@/lib/types";

export const metadata = { title: "Disponibilidad | Admin" };

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default async function DisponibilidadPage() {
  const supabase = await createClient();

  const { data: rules } = await supabase
    .from("availability_rules")
    .select("*")
    .order("day_of_week", { ascending: true });

  // Asegurar que los 7 días existan (aunque estén inactivos)
  const fullRules: AvailabilityRule[] = Array.from({ length: 7 }, (_, dow) => {
    const existing = (rules ?? []).find((r: AvailabilityRule) => r.day_of_week === dow);
    return existing ?? {
      id: "",
      day_of_week: dow,
      start_time: "09:00",
      end_time: "18:00",
      is_active: false,
      created_at: "",
    };
  });

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Disponibilidad</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configura los horarios de atención por día de semana.
        </p>
      </div>
      <AvailabilityManager rules={fullRules} dayNames={DAY_NAMES} />
    </div>
  );
}
