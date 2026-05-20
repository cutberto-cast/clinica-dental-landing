import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CreateAppointmentPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: CreateAppointmentPayload = await req.json();
    const { patient_name, patient_phone, patient_email, service_id, starts_at, notes } = body;

    if (!patient_name || !patient_phone || !service_id || !starts_at) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: nombre, teléfono, servicio y horario." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Llama a la función SECURITY DEFINER que valida, previene race conditions y crea la cita
    const { data, error } = await supabase.rpc("create_appointment", {
      p_patient_name: patient_name,
      p_patient_phone: patient_phone,
      p_patient_email: patient_email ?? null,
      p_service_id: service_id,
      p_starts_at: starts_at,
      p_notes: notes ?? null,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 422 }
      );
    }

    return NextResponse.json({ appointmentId: data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/appointments error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
