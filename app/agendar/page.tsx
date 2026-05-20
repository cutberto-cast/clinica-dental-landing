import { createClient } from "@/lib/supabase/server";
import BookingFlow from "@/components/booking/BookingFlow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Service } from "@/lib/types";

export const metadata = {
  title: "Agenda tu cita | Clínica Dental",
  description: "Reserva tu cita dental en segundos. Elige el servicio, fecha y horario que mejor te convenga.",
};

export default async function AgendarPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-light dark:bg-background-dark pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Agenda tu cita
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Reserva en segundos. Sin esperas, sin llamadas.
            </p>
          </div>
          <BookingFlow services={(services ?? []) as Service[]} />
        </div>
      </main>
      <Footer />
    </>
  );
}
