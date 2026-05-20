import { createClient } from "@/lib/supabase/server";
import BlockedSlotsManager from "@/components/admin/BlockedSlotsManager";
import type { BlockedSlot } from "@/lib/types";

export const metadata = { title: "Bloqueos | Admin" };

export default async function BloqueosPage() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  const { data: blocks } = await supabase
    .from("blocked_slots")
    .select("*")
    .or(`date.gte.${today},end_at.gte.${new Date().toISOString()}`)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Bloqueos</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Bloquea días completos o rangos de horas específicos.
        </p>
      </div>
      <BlockedSlotsManager initialBlocks={(blocks ?? []) as BlockedSlot[]} />
    </div>
  );
}
