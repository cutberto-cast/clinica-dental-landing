import { createClient } from "@/lib/supabase/server";
import AgendaView from "@/components/admin/AgendaView";
import type { Appointment } from "@/lib/types";

export const metadata = { title: "Agenda | Admin" };

export default async function AdminPage() {
  const supabase = await createClient();

  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 7);

  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      patient:patients(id, name, phone, email),
      service:services(id, name, duration, price)
    `)
    .gte("starts_at", from.toISOString())
    .lt("starts_at", to.toISOString())
    .not("status", "eq", "cancelled")
    .order("starts_at", { ascending: true });

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Agenda</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Próximas citas (7 días)</p>
      </div>
      <AgendaView appointments={(appointments ?? []) as Appointment[]} />
    </div>
  );
}
