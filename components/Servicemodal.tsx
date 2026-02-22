"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "./ModalContext";

interface Service {
    icon: string;
    title: string;
    cardDesc: string;
    modalDesc: string;
    benefits: string[];
    image: string;
}

interface ServiceModalProps {
    service: Service | null;
    onClose: () => void;
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
    const { openModal } = useModal();

    const handleWhatsAppInfo = (serviceTitle: string) => {
        const phone = "5215512345678";
        const message = `Hola, me interesa el tratamiento de *${serviceTitle}*. ¿Podrían darme más información sobre precios o el proceso?`;
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    };

    const handleBookAppointment = () => {
        onClose();
        setTimeout(() => openModal(), 150);
    };

    return (
        <AnimatePresence>
            {service && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[85dvh]"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>

                        {/* Image — sin overlay */}
                        <div className="w-full h-32 sm:h-48 relative shrink-0">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Title below image */}
                        <div className="px-6 pt-5 pb-0 bg-white dark:bg-slate-900 shrink-0">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                                {service.title}
                            </h2>
                        </div>

                        {/* Scrollable body */}
                        <div className="p-5 sm:p-8 overflow-y-auto bg-white dark:bg-slate-900 flex-1 min-h-0 overscroll-contain">
                            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                                {service.modalDesc}
                            </p>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                                ¿Por qué elegirnos?
                            </h3>
                            <ul className="space-y-4 mb-2">
                                {service.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-green-500 bg-green-500/10 rounded-full p-1 text-sm font-bold shrink-0">
                                            check
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                                            {benefit}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Footer actions */}
                        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleBookAppointment}
                                    className="w-full bg-primary hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group order-1 sm:order-2"
                                >
                                    Agendar Cita
                                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                                        event_available
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleWhatsAppInfo(service.title)}
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
    );
}