import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cita confirmada | Clínica Dental",
};

interface SearchParams {
  id?: string;
  service?: string;
  date?: string;
  time?: string;
}

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { service, date, time } = params;

  // Formatear fecha para mostrar
  let dateDisplay = date ?? "";
  if (date) {
    const [year, month, day] = date.split("-");
    const months = [
      "enero","febrero","marzo","abril","mayo","junio",
      "julio","agosto","septiembre","octubre","noviembre","diciembre",
    ];
    dateDisplay = `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-light dark:bg-background-dark pt-24 pb-16 flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
            {/* Icono de éxito */}
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              ¡Cita confirmada!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Tu cita ha sido agendada exitosamente.
            </p>

            {/* Detalles */}
            {(service || date || time) && (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-sm text-left space-y-2 mb-6">
                {service && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Servicio</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{decodeURIComponent(service)}</span>
                  </div>
                )}
                {date && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Fecha</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100 capitalize">{dateDisplay}</span>
                  </div>
                )}
                {time && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Hora</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{time} hrs</span>
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300 mb-6 text-left">
              <p className="font-semibold mb-1">¿Necesitas cambiar o cancelar tu cita?</p>
              <p>Comunícate con nosotros al menos 24 horas antes al teléfono del consultorio.</p>
            </div>

            <Link
              href="/"
              className="inline-block bg-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
