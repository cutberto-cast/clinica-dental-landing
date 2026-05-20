import { createClient } from "@/lib/supabase/server";
import ServicesManager from "@/components/admin/ServicesManager";
import type { Service } from "@/lib/types";

export const metadata = { title: "Servicios | Admin" };

export default async function ServiciosPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Servicios</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Administra el catálogo de servicios del consultorio.
        </p>
      </div>
      <ServicesManager initialServices={(services ?? []) as Service[]} />
    </div>
  );
}
