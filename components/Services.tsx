"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import BeforeAfterSlider from "./Beforeafterslider";
import ServiceModal from "./Servicemodal";


const servicesData = [
    {
        icon: "cleaning_services",
        title: "Limpieza Profunda",
        cardDesc: "Higiene ultrasónica que elimina placa y sarro para una boca 100% sana y sin mal aliento.",
        modalDesc: "Nuestra profilaxis ultrasónica va mucho más allá del cepillado diario. Es un tratamiento preventivo y estético que elimina el sarro endurecido y las manchas superficiales (café, té, tabaco) sin dañar tu esmalte. Protege tus encías, previene el mal aliento y devuelve el brillo natural a tus dientes en una sola sesión rápida y muy confortable.",
        benefits: ["Eliminación de sarro ultrasónica sin dolor", "Pulido quita-manchas profesional", "Aplicación de flúor para fortalecer el esmalte"],
        image: "/servicios/limpieza.jpg",
    },
    {
        icon: "grid_view",
        title: "Ortodoncia Invisible",
        cardDesc: "Alinea tu sonrisa discretamente con guardas transparentes, removibles y cómodas.",
        modalDesc: "Consigue la sonrisa recta y armónica que siempre has querido sin los incómodos alambres metálicos. Utilizamos alineadores transparentes hechos a la medida con tecnología 3D, que mueven tus dientes de forma gradual y predecible. Son casi invisibles, fáciles de limpiar y puedes quitártelos para comer lo que quieras sin restricciones.",
        benefits: ["Diseño 3D computarizado para mayor precisión", "Férulas transparentes y removibles", "Resultados visibles en menor tiempo"],
        image: "/servicios/invisible.jpg",
    },
    {
        icon: "auto_fix_high",
        title: "Blanqueamiento Láser",
        cardDesc: "Aclara tu sonrisa varios tonos de forma segura, rápida y sin sensibilidad extrema.",
        modalDesc: "Un tratamiento estético de alto impacto que rejuvenece tu rostro al instante. Mediante la aplicación de geles clínicos activados por luz láser, logramos romper las moléculas de pigmento incrustadas en el esmalte. Es un procedimiento 100% seguro, controlado por especialistas para garantizar resultados deslumbrantes minimizando cualquier sensibilidad.",
        benefits: ["Resultados inmediatos en una cita", "Tecnología láser anti-sensibilidad", "Incluye kit de mantenimiento en casa"],
        image: "/servicios/laser.jpg",
    },
    {
        icon: "medical_services",
        title: "Implantes Dentales",
        cardDesc: "Reemplaza dientes perdidos con raíces de titanio que lucen y se sienten totalmente naturales.",
        modalDesc: "La solución definitiva para recuperar la confianza al hablar y masticar. Los implantes actúan como raíces artificiales de titanio altamente biocompatibles que se integran a tu hueso de forma segura. Sobre ellos colocamos coronas de porcelana idénticas a tus dientes naturales, ofreciendo una solución permanente, estética y sumamente cómoda.",
        benefits: ["Materiales biocompatibles para toda la vida", "Cirugía guiada mínimamente invasiva", "Apariencia y función 100% natural"],
        image: "/servicios/implantes.jpg",
    },
    {
        icon: "biotech",
        title: "Endodoncia Sin Dolor",
        cardDesc: "Salva tu diente infectado y elimina el dolor crónico de raíz en una sola cita.",
        modalDesc: "Cuando una caries avanza demasiado, la endodoncia es el único tratamiento que permite conservar tu diente original y evitar la extracción. Retiramos el tejido infectado del interior, limpiamos y sellamos los conductos. Gracias a nuestra anestesia moderna y equipo rotatorio, es un procedimiento rápido y completamente libre de dolor.",
        benefits: ["Anestesia local de última generación", "Uso de tecnología rotatoria de precisión", "Recuperación inmediata y preservación del diente"],
        image: "/servicios/sindolor.jpg",
    },
    {
        icon: "child_care",
        title: "Odontopediatría",
        cardDesc: "Atención dental especializada para niños, enfocada en prevención y en crear confianza.",
        modalDesc: "Creemos que la primera visita al dentista define la actitud de un niño hacia la salud bucal para toda su vida. Nuestro equipo está capacitado en manejo de conducta para crear un ambiente divertido, paciente y libre de estrés. Nos enfocamos en prevenir caries, guiar el crecimiento dental y enseñarles a cuidar su sonrisa felizmente.",
        benefits: ["Técnicas psicológicas de manejo de conducta", "Tratamientos preventivos (flúor y selladores)", "Ambiente amigable y libre de estrés"],
        image: "/servicios/odontopedriatria.jpg",
    },
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

type Service = typeof servicesData[0];

export default function Services() {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    return (
        <section
            id="servicios"
            className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50 relative min-h-screen flex items-center"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

                {/* Section heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h3 className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-2">
                        Tratamientos
                    </h3>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                        Lo que hacemos por ti
                    </h2>
                    <div className="w-16 md:w-20 h-1 bg-primary mx-auto mt-4 rounded-full" />
                </motion.div>

                {/* Grid + Slider */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 xl:gap-16 items-start">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-2 gap-4 lg:gap-5 content-start w-full"
                    >
                        {servicesData.map((service, index) => (
                            <motion.div
                                variants={item}
                                key={index}
                                onClick={() => setSelectedService(service)}
                                className="relative bg-white dark:bg-background-dark p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 group hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                                        <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                                            {service.icon}
                                        </span>
                                    </div>
                                    <h4
                                        className="text-[13px] sm:text-[14px] md:text-[15px] font-bold text-slate-900 dark:text-white leading-tight flex-1 break-words hyphens-auto"
                                        lang="es"
                                    >
                                        {service.title}
                                    </h4>
                                </div>

                                <p className="text-[11px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed flex-1">
                                    {service.cardDesc}
                                </p>

                                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out mt-auto">
                                    <div className="overflow-hidden">
                                        <div className="pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wide">
                                            Ver más
                                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:sticky lg:top-32"
                    >
                        <BeforeAfterSlider />
                    </motion.div>
                </div>
            </div>

            {/* Modal */}
            <ServiceModal
                service={selectedService}
                onClose={() => setSelectedService(null)}
            />
        </section>
    );
}