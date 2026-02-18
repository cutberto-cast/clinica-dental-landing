"use client";

import FadeIn from "./FadeIn";

const testimonials = [
  { name: "Carlos Rodríguez", role: "Paciente desde 2022", text: "Excelente atención. El trato de la Dra. Valeria es increíble, me sentí muy cómodo durante todo mi tratamiento de ortodoncia." },
  { name: "Ana Martínez", role: "Paciente desde 2023", text: "La tecnología que usan es impresionante. Me hicieron un blanqueamiento y los resultados fueron instantáneos y sin dolor." },
  { name: "Elena Ruiz", role: "Paciente Familiar", text: "Llevé a mis hijos para su limpieza y quedaron encantados. El área para niños y la paciencia del equipo es de 10." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.4, duration: 0.8 }
  }
};
export default function Testimonials() {
  return (
    <section id="testimonios" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FadeIn direction="up">
            <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Pacientes Felices</h3>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">Lo que dicen de nosotros</h2>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex text-amber-400 mb-4">
                {[1, 2, 3, 4, 5].map(star => <span key={star} className="material-symbols-outlined">star</span>)}
              </div>
              <p className="text-slate-600 dark:text-slate-400 italic mb-6">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                  <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 font-bold">
                    {t.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">{t.name}</h5>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}