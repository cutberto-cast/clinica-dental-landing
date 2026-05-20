export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration: number;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AvailabilityRule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

export interface BlockedSlot {
  id: string;
  date: string | null;
  start_at: string | null;
  end_at: string | null;
  reason: string | null;
  is_full_day: boolean;
  created_at: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  service_id: string;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  notes: string | null;
  internal_notes: string | null;
  google_calendar_event_id: string | null;
  created_at: string;
  updated_at: string;
  // joined
  patient?: Patient;
  service?: Service;
}

export interface CreateAppointmentPayload {
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  service_id: string;
  starts_at: string;
  notes?: string;
}
