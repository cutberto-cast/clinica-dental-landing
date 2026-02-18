"use client";
import FadeIn from "./FadeIn";

export default function ContactForm() {
    return (
        <section id="contacto" className="py-24 bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16">

                    <FadeIn direction="right">
                        <div>
                            <h2 className="text-3xl font-extrabold mb-8 text-slate-900 dark:text-white">
                                Envíanos un mensaje
                            </h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nombre Completo</label>
                                        <input className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Ej. Juan Pérez" type="text" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Teléfono</label>
                                        <input className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Ej. 229 123 4567" type="tel" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Correo Electrónico</label>
                                    <input className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="juan@ejemplo.com" type="email" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mensaje</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="¿En qué podemos ayudarte?" rows={4}></textarea>
                                </div>
                                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20" type="submit">
                                    Enviar Solicitud
                                </button>
                            </form>
                        </div>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.2}>
                        <div className="space-y-8">
                            <h2 className="text-3xl font-extrabold mb-8 text-slate-900 dark:text-white">Ubícanos</h2>

                            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl h-[300px] relative overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120612.98661642142!2d-96.22316972688029!3d19.15852554746359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c341424f1c1f73%3A0x6b63753d08233516!2sVeracruz%2C%20Ver.!5e0!3m2!1ses!2smx!4v1708123456789!5m2!1ses!2smx"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0 hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8">
                                <div>
                                    <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                                        <span className="material-symbols-outlined text-primary">pin_drop</span> Dirección
                                    </h5>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Av. Independencia 1234,<br />
                                        Centro Histórico, Veracruz, Ver.
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                                        <span className="material-symbols-outlined text-primary">schedule</span> Horarios
                                    </h5>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Lun - Vie: 9:00 - 19:00 <br />
                                        Sáb: 10:00 - 14:00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </section>
    );
}