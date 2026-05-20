import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const serviceId = url.searchParams.get("service_id");
  const date = url.searchParams.get("date");
  const year = url.searchParams.get("year");
  const month = url.searchParams.get("month");

  if (!serviceId) {
    return new Response(
      JSON.stringify({ error: "service_id requerido" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Modo: días disponibles del mes
  if (year && month) {
    const availableDays = await getAvailableDaysForMonth(
      supabase,
      serviceId,
      parseInt(year),
      parseInt(month)
    );
    return new Response(
      JSON.stringify({ available_days: availableDays }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Modo: slots disponibles para una fecha específica
  if (!date) {
    return new Response(
      JSON.stringify({ error: "date requerido" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const slots = await getAvailableSlots(supabase, serviceId, date);
  return new Response(
    JSON.stringify({ slots }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

async function getAvailableSlots(
  supabase: ReturnType<typeof createClient>,
  serviceId: string,
  date: string
): Promise<string[]> {
  // 1. Obtener duración del servicio
  const { data: service } = await supabase
    .from("services")
    .select("duration")
    .eq("id", serviceId)
    .eq("is_active", true)
    .single();

  if (!service) return [];
  const duration = service.duration;

  // 2. Obtener regla base del día de semana
  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  const { data: rule } = await supabase
    .from("availability_rules")
    .select("start_time, end_time")
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true)
    .single();

  if (!rule) return [];

  // 3. Verificar bloqueo de día completo
  const { data: fullDayBlock } = await supabase
    .from("blocked_slots")
    .select("id")
    .eq("is_full_day", true)
    .eq("date", date)
    .maybeSingle();

  if (fullDayBlock) return [];

  // 4. Generar todos los slots posibles
  const allSlots = generateSlots(rule.start_time, rule.end_time, duration);

  // 5. Obtener citas existentes del día (no canceladas)
  const dayStart = `${date}T00:00:00+00:00`;
  const dayEnd = `${date}T23:59:59+00:00`;

  const { data: appointments } = await supabase
    .from("appointments")
    .select("starts_at, ends_at")
    .not("status", "in", '("cancelled","no_show")')
    .gte("starts_at", dayStart)
    .lte("starts_at", dayEnd);

  // 6. Obtener bloqueos parciales del día
  const { data: partialBlocks } = await supabase
    .from("blocked_slots")
    .select("start_at, end_at")
    .eq("is_full_day", false)
    .gte("end_at", dayStart)
    .lte("start_at", dayEnd);

  // 7. Filtrar slots con colisiones
  const now = new Date();

  const available = allSlots.filter((slot) => {
    const [h, m] = slot.split(":").map(Number);
    const slotStart = new Date(`${date}T${slot}:00`);
    const slotEnd = new Date(slotStart.getTime() + duration * 60000);

    // No mostrar slots ya pasados (en el día de hoy)
    if (slotStart <= now) return false;

    const collidesWithAppt = (appointments ?? []).some((a: { starts_at: string; ends_at: string }) =>
      overlaps(slotStart, slotEnd, new Date(a.starts_at), new Date(a.ends_at))
    );

    const collidesWithBlock = (partialBlocks ?? []).some((b: { start_at: string; end_at: string }) =>
      overlaps(slotStart, slotEnd, new Date(b.start_at), new Date(b.end_at))
    );

    return !collidesWithAppt && !collidesWithBlock;
  });

  return available;
}

async function getAvailableDaysForMonth(
  supabase: ReturnType<typeof createClient>,
  serviceId: string,
  year: number,
  month: number
): Promise<string[]> {
  const daysInMonth = new Date(year, month, 0).getDate();
  const availableDays: string[] = [];

  // Obtener reglas activas una sola vez
  const { data: rules } = await supabase
    .from("availability_rules")
    .select("day_of_week, start_time, end_time")
    .eq("is_active", true);

  if (!rules || rules.length === 0) return [];

  const { data: service } = await supabase
    .from("services")
    .select("duration")
    .eq("id", serviceId)
    .eq("is_active", true)
    .single();

  if (!service) return [];

  // Obtener bloqueos del mes
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

  const { data: fullDayBlocks } = await supabase
    .from("blocked_slots")
    .select("date")
    .eq("is_full_day", true)
    .gte("date", monthStart)
    .lte("date", monthEnd);

  const blockedDates = new Set((fullDayBlocks ?? []).map((b: { date: string }) => b.date));
  const activeDays = new Set(rules.map((r: { day_of_week: number }) => r.day_of_week));

  const now = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateObj = new Date(dateStr + "T12:00:00");

    // Excluir días pasados
    if (dateObj < now) continue;

    const dow = dateObj.getDay();
    if (!activeDays.has(dow)) continue;
    if (blockedDates.has(dateStr)) continue;

    availableDays.push(dateStr);
  }

  return availableDays;
}

function generateSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  let current = sh * 60 + sm;
  const end = eh * 60 + em;

  while (current + durationMinutes <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    current += durationMinutes;
  }

  return slots;
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && aEnd > bStart;
}
