import type { SupabaseClient } from "@supabase/supabase-js";

const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

export interface CalendarEvent {
  id?: string;
  summary: string;
  description: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  reminders?: {
    useDefault: boolean;
    overrides?: { method: string; minutes: number }[];
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getValidAccessToken(supabase: SupabaseClient<any>): Promise<string | null> {
  const { data, error } = await supabase
    .from("calendar_tokens")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const now = new Date();
  const expiresAt = new Date(data.expires_at as string);

  if (expiresAt > now) return data.access_token as string;

  // Token expirado — refrescar
  const refreshed = await refreshAccessToken(data.refresh_token as string);
  if (!refreshed) return null;

  await supabase
    .from("calendar_tokens")
    .update({
      access_token: refreshed.access_token,
      expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id as string);

  return refreshed.access_token as string;
}

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) return null;
  return res.json();
}

export async function createCalendarEvent(
  accessToken: string,
  event: CalendarEvent
): Promise<{ id: string } | null> {
  const res = await fetch(
    `${CALENDAR_API}/calendars/primary/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!res.ok) return null;
  return res.json();
}

export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<boolean> {
  const res = await fetch(
    `${CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return res.ok || res.status === 404;
}

export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  event: Partial<CalendarEvent>
): Promise<boolean> {
  const res = await fetch(
    `${CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  return res.ok;
}

export function buildCalendarEvent(
  serviceName: string,
  patientName: string,
  patientPhone: string,
  patientNotes: string | null,
  startsAt: string,
  endsAt: string,
  timezone = "America/Mexico_City"
): CalendarEvent {
  return {
    summary: `Cita — ${serviceName}`,
    description: [
      `Paciente: ${patientName}`,
      `Teléfono: ${patientPhone}`,
      patientNotes ? `Nota: ${patientNotes}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
    start: { dateTime: startsAt, timeZone: timezone },
    end: { dateTime: endsAt, timeZone: timezone },
    reminders: {
      useDefault: false,
      overrides: [{ method: "popup", minutes: 60 }],
    },
  };
}
