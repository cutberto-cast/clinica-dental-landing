"use client";

import { motion, Variants } from "framer-motion";

const servicesData = [
    { icon: "cleaning_services", title: "Limpieza", desc: "Higiene profunda y preventiva." },
    { icon: "grid_view", title: "Ortodoncia", desc: "Brackets y alineadores invisibles." },
    { icon: "auto_fix_high", title: "Blanqueamiento", desc: "Sonrisa brillante en una sesión." },
    { icon: "medical_services", title: "Implantes", desc: "Recupera tus dientes perdidos." },
    { icon: "biotech", title: "Endodoncia", desc: "Salva tu diente sin dolor." },
    { icon: "child_care", title: "Niños", desc: "Atención divertida y sin miedo." },
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export default function Services() {
    return (
        <section id="servicios" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h3 className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-2">Especialidades</h3>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Nuestros Servicios</h2>
                    <div className="w-16 md:w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"
                >
                    {servicesData.map((service, index) => (
                        <motion.div
                            variants={item}
                            key={index}
                            className="bg-white dark:bg-background-dark 
                                    p-4 md:p-8  /* Padding reducido en móvil */
                                    rounded-2xl shadow-sm hover:shadow-xl 
                                    border border-slate-100 dark:border-slate-800 
                                    group hover:-translate-y-2 transition-all duration-300">

                            <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3 md:mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <span className="material-symbols-outlined text-xl md:text-3xl">{service.icon}</span>
                            </div>

                            <h4 className="text-sm md:text-xl font-bold mb-2 text-slate-900 dark:text-white truncate">
                                {service.title}
                            </h4>
                            <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">
                                {service.desc}
                            </p>

                            <a href="#" className="text-primary font-bold text-xs md:text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                Ver más <span className="material-symbols-outlined text-[10px] md:text-sm">arrow_forward</span>
                            </a>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}