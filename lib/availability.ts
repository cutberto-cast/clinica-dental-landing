const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getAvailableSlots(
  date: string,
  serviceId: string
): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/available-slots?date=${date}&service_id=${serviceId}`,
    {
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      // No cachear — disponibilidad cambia en tiempo real
      cache: "no-store",
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.slots ?? [];
}

// Devuelve qué días del mes tienen al menos un slot disponible
export async function getAvailableDays(
  year: number,
  month: number,
  serviceId: string
): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/available-slots?year=${year}&month=${month}&service_id=${serviceId}`,
    {
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.available_days ?? [];
}
