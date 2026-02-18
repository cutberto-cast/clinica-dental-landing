"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useModal } from "./ModalContext";

export default function CTA() {
    const { openModal } = useModal();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.muted = true;
            
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Autoplay prevenido por el navegador:", error);
                });
            }
        }
    }, []);

    return (
        <section className="relative py-24 overflow-hidden flex items-center justify-center min-h-[500px]">

            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/dental-bg.mp4" type="video/mp4" />
                <div className="absolute inset-0 bg-blue-900" />
            </video>

            <div className="absolute inset-0 bg-blue-900/50 mix-blend-multiply z-10"></div>
            
            <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-xl tracking-tight">
                        Agenda tu cita hoy mismo
                    </h2>

                    <p className="text-blue-100 text-lg md:text-xl mb-10 font-medium drop-shadow-md max-w-2xl mx-auto leading-relaxed">
                        La sonrisa que siempre soñaste está a un mensaje de distancia. Tecnología avanzada y trato humano te esperan.
                    </p>

                    <button
                        onClick={openModal}
                        className="
                            group
                            relative
                            px-10 py-5 rounded-2xl
                            font-bold text-xl text-white
                            
                            /* Efecto Glassmorphism */
                            bg-white/10 
                            backdrop-blur-md 
                            border border-white/30
                            shadow-lg shadow-black/20
                            
                            /* Hover Effects */
                            hover:bg-white/20 
                            hover:scale-105 hover:border-white/60
                            hover:shadow-blue-500/30
                            active:scale-95
                            
                            transition-all duration-300
                            flex items-center gap-3 mx-auto"
                    >
                        <span>Reservar ahora</span>
                        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">
                            calendar_month
                        </span>

                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </button>
                </motion.div>

            </div>
        </section>
    );
}