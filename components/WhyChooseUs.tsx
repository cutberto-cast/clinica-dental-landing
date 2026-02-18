"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";

export default function WhyChooseUs() {
    const [currentImage, setCurrentImage] = useState(0);

    const images = [
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=2071&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop"
    ];

    const features = [
        { icon: "devices", title: "Tecnología 3D", desc: "Escáneres intraorales para diagnósticos precisos sin moldes incómodos." },
        { icon: "person", title: "Trato Humano", desc: "Planes a tu medida explicados con claridad y paciencia." },
        { icon: "apartment", title: "Espacios Relax", desc: "Clínica diseñada para reducir la ansiedad con aromaterapia y música." },
        { icon: "payments", title: "Financiamiento", desc: "Meses sin intereses y convenios con aseguradoras." }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section className="py-24 bg-white dark:bg-background-dark overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div>
                        <FadeIn direction="right" delay={0.1}>
                            <h3 className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Diferenciadores</h3>
                        </FadeIn>

                        <FadeIn direction="right" delay={0.2}>
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                                Por qué elegir nuestra clínica
                            </h2>
                        </FadeIn>

                        <FadeIn direction="right" delay={0.3}>
                            <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">
                                Nos enfocamos en brindar una experiencia libre de estrés. Combinamos la ciencia médica con la comodidad de un spa.
                            </p>
                        </FadeIn>

                        <div className="grid sm:grid-cols-2 gap-y-8 gap-x-6">
                            {features.map((item, idx) => (
                                <FadeIn key={idx} direction="up" delay={0.4 + (idx * 0.1)}>
                                    <div className="flex gap-4 group">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 group-hover:bg-primary/20 transition-colors rounded-2xl flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined">{item.icon}</span>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h5>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">{item.desc}</p>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>

                    <FadeIn direction="left" delay={0.1}>
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">

                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImage}
                                    src={images[currentImage]}
                                    alt="Instalaciones DentalCare"
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImage(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                                        ${idx === currentImage ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"} `}
                                        aria-label={`Ver imagen ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}