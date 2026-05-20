import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const TIMEZONE = "America/Mexico_City";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const payload = await req.json();
  const { type, record, old_record } = payload;

  if (!record) {
    return new Response("no record", { status: 400 });
  }

  const accessToken = await getValidAccessToken(supabase);
  if (!accessToken) {
    console.log("No hay token de Google Calendar configurado");
    return new Response("no token", { status: 200 });
  }

  // JOIN para obtener datos del paciente y servicio
  const { data: appointment } = await supabase
    .from("appointments")
    .select(`
      *,
      patient:patients(name, phone),
      service:services(name)
    `)
    .eq("id", record.id)
    .single();

  if (!appointment) {
    return new Response("appointment not found", { status: 404 });
  }

  if (type === "INSERT") {
    const event = {
      summary: `Cita — ${appointment.service.name}`,
      description: [
        `Paciente: ${appointment.patient.name}`,
        `Teléfono: ${appointment.patient.phone}`,
        appointment.notes ? `Nota: ${appointment.notes}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      start: { dateTime: appointment.starts_at, timeZone: TIMEZONE },
      end: { dateTime: appointment.ends_at, timeZone: TIMEZONE },
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 60 }],
      },
    };

    const res = await fetch(`${CALENDAR_API}/calendars/primary/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (res.ok) {
      const created = await res.json();
      await supabase
        .from("appointments")
        .update({ google_calendar_event_id: created.id })
        .eq("id", record.id);
    }
  }

  if (type === "UPDATE") {
    const eventId = record.google_calendar_event_id ?? old_record?.google_calendar_event_id;

    if (record.status === "cancelled" && eventId) {
      await fetch(`${CALENDAR_API}/calendars/primary/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } else if (
      eventId &&
      old_record &&
      record.starts_at !== old_record.starts_at
    ) {
      // Reagendamiento
      await fetch(`${CALENDAR_API}/calendars/primary/events/${eventId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: { dateTime: record.starts_at, timeZone: TIMEZONE },
          end: { dateTime: record.ends_at, timeZone: TIMEZONE },
        }),
      });
    }
  }

  return new Response("ok", { headers: corsHeaders });
});

async function getValidAccessToken(supabase: ReturnType<typeof createClient>): Promise<string | null> {
  const { data } = await supabase
    .from("calendar_tokens")
    .select("*")
    .limit(1)
    .single();

  if (!data) return null;

  const now = new Date();
  const expiresAt = new Date(data.expires_at);

  if (expiresAt > now) return data.access_token;

  // Refrescar token
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
      refresh_token: data.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) return null;

  const refreshed = await res.json();
  await supabase
    .from("calendar_tokens")
    .update({
      access_token: refreshed.access_token,
      expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  return refreshed.access_token;
}
