"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useModal } from "./ModalContext";

const servicesData = [
    {
        icon: "cleaning_services",
        title: "Limpieza Profunda",
        cardDesc: "Higiene ultrasónica que elimina placa y sarro para una boca 100% sana y sin mal aliento.",
        modalDesc: "Nuestra profilaxis ultrasónica va mucho más allá del cepillado diario. Es un tratamiento preventivo y estético que elimina el sarro endurecido y las manchas superficiales (café, té, tabaco) sin dañar tu esmalte. Protege tus encías, previene el mal aliento y devuelve el brillo natural a tus dientes en una sola sesión rápida y muy confortable.",
        benefits: ["Eliminación de sarro ultrasónica sin dolor", "Pulido quita-manchas profesional", "Aplicación de flúor para fortalecer el esmalte"],
        image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: "grid_view",
        title: "Ortodoncia Invisible",
        cardDesc: "Alinea tu sonrisa discretamente con guardas transparentes, removibles y cómodas.",
        modalDesc: "Consigue la sonrisa recta y armónica que siempre has querido sin los incómodos alambres metálicos. Utilizamos alineadores transparentes hechos a la medida con tecnología 3D, que mueven tus dientes de forma gradual y predecible. Son casi invisibles, fáciles de limpiar y puedes quitártelos para comer lo que quieras sin restricciones.",
        benefits: ["Diseño 3D computarizado para mayor precisión", "Férulas transparentes y removibles", "Resultados visibles en menor tiempo"],
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: "auto_fix_high",
        title: "Blanqueamiento Láser",
        cardDesc: "Aclara tu sonrisa varios tonos de forma segura, rápida y sin sensibilidad extrema.",
        modalDesc: "Un tratamiento estético de alto impacto que rejuvenece tu rostro al instante. Mediante la aplicación de geles clínicos activados por luz láser, logramos romper las moléculas de pigmento incrustadas en el esmalte. Es un procedimiento 100% seguro, controlado por especialistas para garantizar resultados deslumbrantes minimizando cualquier sensibilidad.",
        benefits: ["Resultados inmediatos en una cita", "Tecnología láser anti-sensibilidad", "Incluye kit de mantenimiento en casa"],
        image: "https://images.unsplash.com/photo-1528148343865-51218c4a13e6?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: "medical_services",
        title: "Implantes Dentales",
        cardDesc: "Reemplaza dientes perdidos con raíces de titanio que lucen y se sienten totalmente naturales.",
        modalDesc: "La solución definitiva para recuperar la confianza al hablar y masticar. Los implantes actúan como raíces artificiales de titanio altamente biocompatibles que se integran a tu hueso de forma segura. Sobre ellos colocamos coronas de porcelana idénticas a tus dientes naturales, ofreciendo una solución permanente, estética y sumamente cómoda.",
        benefits: ["Materiales biocompatibles para toda la vida", "Cirugía guiada mínimamente invasiva", "Apariencia y función 100% natural"],
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: "biotech",
        title: "Endodoncia Sin Dolor",
        cardDesc: "Salva tu diente infectado y elimina el dolor crónico de raíz en una sola cita.",
        modalDesc: "Cuando una caries avanza demasiado, la endodoncia es el único tratamiento que permite conservar tu diente original y evitar la extracción. Retiramos el tejido infectado del interior, limpiamos y sellamos los conductos. Gracias a nuestra anestesia moderna y equipo rotatorio, es un procedimiento rápido y completamente libre de dolor.",
        benefits: ["Anestesia local de última generación", "Uso de tecnología rotatoria de precisión", "Recuperación inmediata y preservación del diente"],
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
    },
    {
        icon: "child_care",
        title: "Odontopediatría",
        cardDesc: "Atención dental especializada para niños, enfocada en prevención y en crear confianza.",
        modalDesc: "Creemos que la primera visita al dentista define la actitud de un niño hacia la salud bucal para toda su vida. Nuestro equipo está capacitado en manejo de conducta para crear un ambiente divertido, paciente y libre de estrés. Nos enfocamos en prevenir caries, guiar el crecimiento dental y enseñarles a cuidar su sonrisa felizmente.",
        benefits: ["Técnicas psicológicas de manejo de conducta", "Tratamientos preventivos (flúor y selladores)", "Ambiente amigable y libre de estrés"],
        image: "https://images.unsplash.com/photo-1629909615184-74f495363b63?q=80&w=800&auto=format&fit=crop",
    },
];

const SMILE_AFTER = "despues.png";
const SMILE_BEFORE = "antes.png";

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

function BeforeAfterSlider() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (hasAnimated) return;
        const delay = setTimeout(() => {
            setHasAnimated(true);
            let start = 30;
            let direction = 1;
            let current = start;
            setPosition(start);

            const interval = setInterval(() => {
                current += direction * 1.5;
                if (current >= 70) { direction = -1; }
                if (current <= 50 && direction === -1) {
                    clearInterval(interval);
                    setPosition(50);
                    return;
                }
                setPosition(current);
            }, 16);
        }, 600);
        return () => clearTimeout(delay);
    }, [hasAnimated]);

    const updatePosition = useCallback((clientX: number) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const raw = ((clientX - rect.left) / rect.width) * 100;
        setPosition(Math.min(100, Math.max(0, raw)));
    }, []);

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e: MouseEvent) => updatePosition(e.clientX);
        const onUp = () => setIsDragging(false);
        
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [isDragging, updatePosition]);

    const onTouchStart = () => setIsDragging(true);
    const onTouchMove = (e: React.TouchEvent) => updatePosition(e.touches[0].clientX);
    const onTouchEnd = () => setIsDragging(false);

    return (
        <div className="flex flex-col w-full max-w-md lg:w-[420px] ml-auto shrink-0">
            <div
                ref={containerRef}
                className="relative rounded-3xl overflow-hidden shadow-2xl w-full aspect-[4/5] bg-slate-100"
                style={{ userSelect: "none", touchAction: "none" }}
            >
                <img
                    src={SMILE_AFTER}
                    alt="Sonrisa después"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                    Después
                </div>

                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                    <img
                        src={SMILE_BEFORE}
                        alt="Sonrisa antes"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 40%)" }}
                    />

                    <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                        Antes
                    </div>
                </div>

                <div
                    className="absolute top-0 bottom-0 w-[1.5px] bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)] pointer-events-none"
                    style={{ left: `${position}%` }}
                />

                <div
                    className="absolute z-20"
                    style={{ 
                        left: `${position}%`, 
                        top: "82%",
                        transform: "translate(-50%, -50%)",
                        cursor: isDragging ? "grabbing" : "grab"
                    }}
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <motion.div 
                        animate={{ scale: isDragging ? 1.08 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center border border-white/40 hover:bg-white/30 transition-colors"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-md">
                            <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                </div>

            </div>

            <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-4 flex items-center justify-center gap-1.5 font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
                </svg>
                Arrastra para comparar
            </p>
        </div>
    );
}

export default function Services() {
    const [selectedService, setSelectedService] = useState<typeof servicesData[0] | null>(null);
    const { openModal } = useModal();

    const handleWhatsAppInfo = (serviceTitle: string) => {
        const phone = "5215512345678";
        const message = `Hola, me interesa el tratamiento de *${serviceTitle}*. ¿Podrían darme más información sobre precios o el proceso?`;
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    };

    const handleBookAppointment = () => {
        setSelectedService(null);
        setTimeout(() => openModal(), 150);
    };

    return (
        <section id="servicios" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50 relative min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h3 className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-2">Tratamientos</h3>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Lo que hacemos por ti</h2>
                    <div className="w-16 md:w-20 h-1 bg-primary mx-auto mt-4 rounded-full" />
                </motion.div>

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
                                className="relative bg-white dark:bg-background-dark p-5 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 group hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">{service.icon}</span>
                                    </div>
                                    <h4 className="text-[14px] md:text-[15px] font-bold text-slate-900 dark:text-white leading-tight flex-1">
                                        {service.title}
                                    </h4>
                                </div>
                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed flex-1">
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

            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedService(null)}
                            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedService(null)}
                                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>

                            <div className="w-full h-40 sm:h-48 relative shrink-0">
                                <img 
                                    src={selectedService.image} 
                                    alt={selectedService.title} 
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-6">
                                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                                        {selectedService.title}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 overflow-y-auto bg-white dark:bg-slate-900">
                                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                                    {selectedService.modalDesc}
                                </p>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">¿Por qué elegirnos?</h3>
                                <ul className="space-y-4 mb-2">
                                    {selectedService.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-green-500 bg-green-500/10 rounded-full p-1 text-sm font-bold shrink-0">check</span>
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleBookAppointment}
                                        className="w-full bg-primary hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group order-1 sm:order-2"
                                    >
                                        Agendar Cita
                                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">event_available</span>
                                    </button>
                                    <button
                                        onClick={() => handleWhatsAppInfo(selectedService.title)}
                                        className="w-full bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white py-3.5 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 order-2 sm:order-1 border border-slate-200 dark:border-slate-700 shadow-sm"
                                    >
                                        <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        Saber más
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}