"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Service } from "@/lib/types";
import { getAvailableSlots, getAvailableDays } from "@/lib/availability";
import BookingSteps from "./BookingSteps";
import ServiceCard from "./ServiceCard";
import CalendarPicker from "./CalendarPicker";
import TimeSlotPicker from "./TimeSlotPicker";
import PatientForm from "./PatientForm";

type Step = 1 | 2 | 3 | 4;

interface Props {
  services: Service[];
}

export default function BookingFlow({ services }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingDays, setLoadingDays] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Paso 1 → 2
  function handleServiceSelect(service: Service) {
    setSelectedService(service);
    setSelectedDate(null);
    setSelectedSlot(null);
    setAvailableDays([]);
    setStep(2);
  }

  // Cambio de mes en el calendario
  const handleMonthChange = useCallback(
    async (year: number, month: number) => {
      if (!selectedService) return;
      setLoadingDays(true);
      const days = await getAvailableDays(year, month, selectedService.id);
      setAvailableDays(days);
      setLoadingDays(false);
    },
    [selectedService]
  );

  // Paso 2 → 3
  async function handleDateSelect(date: Date) {
    if (!selectedService) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep(3);
    setLoadingSlots(true);
    const dateStr = format(date, "yyyy-MM-dd");
    const slots = await getAvailableSlots(dateStr, selectedService.id);
    setAvailableSlots(slots);
    setLoadingSlots(false);
  }

  // Paso 3 → 4
  function handleSlotSelect(slot: string) {
    setSelectedSlot(slot);
    setStep(4);
  }

  // Submit final
  async function handleSubmit(formData: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  }) {
    if (!selectedService || !selectedDate || !selectedSlot) return;

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const timezone = process.env.NEXT_PUBLIC_TIMEZONE ?? "America/Mexico_City";

    const startsAt = new Date(`${dateStr}T${selectedSlot}:00`);
    const startsAtISO = startsAt.toISOString();

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_name: formData.name,
        patient_phone: formData.phone,
        patient_email: formData.email || null,
        service_id: selectedService.id,
        starts_at: startsAtISO,
        notes: formData.notes || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Error al agendar la cita");
    }

    const { appointmentId } = await res.json();
    router.push(
      `/agendar/confirmacion?id=${appointmentId}&service=${encodeURIComponent(selectedService.name)}&date=${dateStr}&time=${selectedSlot}`
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
      <BookingSteps current={step} />

      {/* Paso 1: Selección de servicio */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            ¿Qué servicio necesitas?
          </h2>
          {services.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay servicios disponibles.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} onSelect={handleServiceSelect} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Paso 2: Selección de fecha */}
      {step === 2 && selectedService && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-slate-500 hover:text-primary flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Atrás
            </button>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Elige una fecha
              </h2>
              <p className="text-sm text-slate-500">Servicio: {selectedService.name}</p>
            </div>
          </div>
          <CalendarPicker
            availableDays={availableDays}
            selected={selectedDate}
            onSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
            loading={loadingDays}
          />
        </div>
      )}

      {/* Paso 3: Selección de horario */}
      {step === 3 && selectedService && selectedDate && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setStep(2)}
              className="text-sm text-slate-500 hover:text-primary flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Atrás
            </button>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Elige un horario
              </h2>
              <p className="text-sm text-slate-500 capitalize">
                {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })} · {selectedService.duration} min
              </p>
            </div>
          </div>
          <TimeSlotPicker
            slots={availableSlots}
            selected={selectedSlot}
            onSelect={handleSlotSelect}
            loading={loadingSlots}
          />
        </div>
      )}

      {/* Paso 4: Datos del paciente */}
      {step === 4 && selectedService && selectedDate && selectedSlot && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Tus datos
            </h2>
            <p className="text-sm text-slate-500">Rellena el formulario para confirmar tu cita.</p>
          </div>
          <PatientForm
            service={selectedService}
            date={selectedDate}
            timeSlot={selectedSlot}
            onSubmit={handleSubmit}
            onBack={() => setStep(3)}
          />
        </div>
      )}
    </div>
  );
}
