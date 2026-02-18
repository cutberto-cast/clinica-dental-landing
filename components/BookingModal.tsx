"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, FormEvent } from "react";
import { useModal } from "./ModalContext";

export default function BookingModal() {
    const { isModalOpen, closeModal } = useModal();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        service: "Limpieza Dental",
        date: "",
        time: "",
    });

    const [phoneError, setPhoneError] = useState("");

    const isPhoneValid = formData.phone.length === 10;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "phone") {
            // Strip spaces and non-numeric characters
            const cleaned = value.replace(/\s/g, "").replace(/\D/g, "");
            // Limit to 10 digits
            const limited = cleaned.slice(0, 10);

            setFormData(prev => ({ ...prev, phone: limited }));

            if (limited.length > 0 && limited.length < 10) {
                setPhoneError("El número debe tener 10 dígitos");
            } else {
                setPhoneError("");
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isPhoneValid) return;

        const dentistPhone = "2722815138";

        const fechaTexto = formData.date
            ? formData.date
            : "Fecha pendiente por definir";

        const message =
            `Hola, me interesa agendar una cita en DentalCare.%0A%0A` +
            `*Paciente:* ${formData.name}%0A` +
            `*Teléfono:* ${formData.phone}%0A` +
            `*Servicio:* ${formData.service}%0A` +
            `*Fecha deseada:* ${fechaTexto}%0A` +
            `*Hora:* ${formData.time || "Por definir"}`;

        window.open(`https://wa.me/${dentistPhone}?text=${message}`, '_blank');
        closeModal();
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-lg 
                                    bg-white/30 dark:bg-slate-900/80 
                                    backdrop-blur-2xl 
                                    border border-white/50 dark:border-white/10
                                    shadow-2xl shadow-black/20
                                    rounded-3xl overflow-hidden p-8">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-500"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-white/50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">calendar_add_on</span>
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                                Agenda tu Visita
                            </h2>
                            <p className="text-xs font-bold text-slate-800 mb-2 uppercase ">
                                Completa los datos y confirmaremos disponibilidad vía WhatsApp.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="space-y-4">
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-600 group-focus-within:text-[#0258d5] transition-colors">person</span>
                                    <input
                                        required
                                        name="name"
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Tu Nombre"
                                        className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0258d5] transition-all outline-none font-medium placeholder:font-normal placeholder:text-slate-600"
                                    />
                                </div>

                                {/* Phone field with real-time validation */}
                                <div className="relative group">
                                    <span className={`material-symbols-outlined absolute left-4 top-3.5 transition-colors
                                        ${phoneError
                                            ? "text-red-500"
                                            : isPhoneValid
                                                ? "text-[#0daa0d]"
                                                : "text-slate-600 group-focus-within:text-[#0258d5]"
                                        }`}>
                                        smartphone
                                    </span>
                                    <input
                                        required
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="Tu Celular (10 dígitos)"
                                        className={`w-full pl-12 pr-10 py-3 bg-white/50 dark:bg-black/20 border rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 transition-all outline-none font-medium placeholder:font-normal placeholder:text-slate-600
                                            ${phoneError
                                                ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                                : isPhoneValid
                                                    ? "border-green-400 focus:ring-green-500/20 focus:border-green-500"
                                                    : "border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-[#0258d5]"
                                            }`}
                                    />
                                    {/* Validation icon on the right */}
                                    {formData.phone.length > 0 && (
                                        <span className={`material-symbols-outlined absolute right-4 top-3.5 text-lg transition-colors
                                            ${isPhoneValid ? "text-[#0daa0d]" : "text-red-500"}`}>
                                            {isPhoneValid ? "check_circle" : "cancel"}
                                        </span>
                                    )}
                                </div>
                                {/* Error message */}
                                {phoneError && (
                                    <p className="text-xs text-red-500 font-medium -mt-2 ml-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">error</span>
                                        {phoneError}
                                    </p>
                                )}
                            </div>

                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-600 group-focus-within:text-[#0258d5] transition-colors">dentistry</span>
                                <select
                                    name="service"
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0258d5] transition-all outline-none font-medium appearance-none cursor-pointer text-slate-700 dark:text-slate-200"
                                >
                                    <option>Información / Presupuesto</option>
                                    <option>Limpieza Dental</option>
                                    <option>Blanqueamiento</option>
                                    <option>Ortodoncia</option>
                                    <option>Implantes</option>
                                    <option>Dolor / Urgencia</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <p className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider ml-1">Preferencia de Cita (Opcional)</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <input
                                            name="date"
                                            onChange={handleChange}
                                            type="date"
                                            className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0258d5] transition-all outline-none font-medium text-slate-600 dark:text-slate-300"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <input
                                            name="time"
                                            onChange={handleChange}
                                            type="time"
                                            className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0258d5] transition-all outline-none font-medium text-slate-600 dark:text-slate-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!isPhoneValid}
                                className={`w-full mt-4
                                        py-4 rounded-xl 
                                        font-bold text-lg 
                                        border
                                        flex items-center justify-center gap-3
                                        group
                                        transition-all duration-300
                                        ${isPhoneValid
                                            ? `bg-gradient-to-r from-[#25D366] to-[#0daa0d] 
                                               hover:to-[#228c12]
                                               text-white 
                                               shadow-lg shadow-green-500/30 
                                               hover:shadow-green-500/50 hover:-translate-y-1
                                               border-white/20
                                               backdrop-blur-sm
                                               cursor-pointer`
                                            : `bg-transparent
                                               text-slate-400 dark:text-slate-500
                                               border-slate-300 dark:border-slate-600
                                               cursor-not-allowed`
                                        }`}
                            >
                                <span>Enviar mensaje</span>
                                <svg
                                    className={`w-6 h-6 fill-current transition-transform duration-300 ${isPhoneValid ? "group-hover:scale-110" : "opacity-40"}`}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </button>

                            <p className="text-center text-[11px] text-slate-700 mt-2">
                                Serás redirigido al chat oficial de la clínica.
                            </p>

                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}