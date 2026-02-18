"use client";

import { motion } from "framer-motion";

const services = [
    "Limpieza Dental",
    "Ortodoncia Invisible",
    "Blanqueamiento",
    "Implantes Dentales",
    "Diseño de Sonrisa",
    "Odontopediatría",
    "Urgencias 24h"
];

const infiniteServices = [...services, ...services, ...services, ...services];

export default function HeroServicesCarousel() {
    return (
        <div className="relative overflow-hidden py-3 -mx-5 sm:-mx-8 lg:-mx-20 !ml-0 !mr-0 border-t border-slate-100 dark:border-slate-800/50 mt-8">

            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white dark:from-background-dark to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white dark:from-background-dark to-transparent pointer-events-none" />

            <motion.div
                className="flex items-center gap-10 whitespace-nowrap will-change-transform" // will-change-transform ayuda al rendimiento en móviles
                animate={{ x: "-50%" }}
                transition={{
                    ease: "linear",
                    duration: 40,
                    repeat: Infinity,
                }}
            >
                {infiniteServices.map((service, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-accent-blue transition-colors duration-300 cursor-default group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/60 group-hover:bg-accent-blue shrink-0 transition-colors" />
                        <span className="text-sm sm:text-base font-semibold tracking-wide uppercase font-sans">
                            {service}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}