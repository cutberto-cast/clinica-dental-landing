"use client";

import FadeIn from "./FadeIn";

export default function AboutUs() {
    const benefits = [
        "Especialistas certificados internacionalmente",
        "Tecnología dental de última generación",
        "Atención 100% personalizada",
        "Ambiente clínico relajado y moderno"
    ];

    return (
        <section id="nosotros" className="py-24 bg-white dark:bg-background-dark overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div className="relative">
                        <FadeIn direction="right" delay={0.2}>
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                            <div className="relative z-10 w-full h-[500px] rounded-2xl shadow-2xl overflow-hidden">
                                <img
                                    src="/doc.png"
                                    alt="Doctora especialista"
                                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                                    style={{
                                        objectPosition: 'center 20%'
                                    }}
                                />
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.5} className="absolute -bottom-6 -right-6 z-20 hidden md:block">
                            <div className="bg-primary p-6 rounded-xl shadow-xl shadow-primary/20 border border-white/20 backdrop-blur-md">
                                <p className="text-white font-bold text-3xl">10+</p>
                                <p className="text-blue-100 text-sm">Años de experiencia</p>
                            </div>
                        </FadeIn>
                    </div>

                    <div>
                        <FadeIn direction="left" delay={0.3}>
                            <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Sobre Nosotros</h3>
                        </FadeIn>

                        <FadeIn direction="left" delay={0.4}>
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                                Dra. Valeria Méndez
                            </h2>
                        </FadeIn>

                        <FadeIn direction="left" delay={0.5}>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                                En DentalCare, creemos que una sonrisa sana es la puerta a una vida mejor. Nuestro enfoque humano y personalizado garantiza resultados excepcionales, utilizando siempre los últimos avances en odontología digital.
                            </p>
                        </FadeIn>

                        <ul className="space-y-4">
                            {benefits.map((item, index) => (
                                <li key={index}>
                                    <FadeIn direction="left" delay={0.6 + (index * 0.1)}>
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-full text-sm font-bold">
                                                check
                                            </span>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {item}
                                            </span>
                                        </div>
                                    </FadeIn>
                                </li>
                            ))}
                        </ul>

                        <FadeIn direction="up" delay={1.0}>
                            <button className="mt-8 text-primary font-bold border-b-2 border-primary/20 hover:border-primary pb-1 transition-all">
                                Conoce a todo el equipo
                            </button>
                        </FadeIn>
                    </div>

                </div>
            </div>
        </section>
    );
}