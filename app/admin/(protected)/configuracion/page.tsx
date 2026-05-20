import { createClient } from "@/lib/supabase/server";
import CalendarConfig from "@/components/admin/CalendarConfig";

export const metadata = { title: "Configuración | Admin" };

export default async function ConfiguracionPage() {
  const supabase = await createClient();

  const { data: token } = await supabase
    .from("calendar_tokens")
    .select("id, expires_at, updated_at")
    .limit(1)
    .maybeSingle();

  const isConnected = !!token;
  const expiresAt = token?.expires_at ?? null;

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Configuración</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Conexión con Google Calendar y ajustes del consultorio.
        </p>
      </div>
      <div className="space-y-6">
        <CalendarConfig isConnected={isConnected} expiresAt={expiresAt} />
      </div>
    </div>
  );
}
