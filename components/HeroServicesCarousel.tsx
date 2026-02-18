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


const infiniteServices = [...services, ...services];

export default function HeroServicesCarousel() {
    return (
        <div className="relative overflow-hidden py-3 -mx-5 sm:-mx-8 lg:-mx-20 !ml-0 !mr-0">

            <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />

            <motion.div
                className="flex items-center gap-10 whitespace-nowrap"
                animate={{ x: "-50%" }}
                transition={{
                    ease: "linear",
                    duration: 10,
                    repeat: Infinity,
                }}
            >
                {infiniteServices.map((service, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-3 text-slate-500 hover:text-[#6366f1] transition-colors duration-300 cursor-default"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] opacity-60 shrink-0" />
                        <span className="text-base font-semibold tracking-wide uppercase font-sans">
                            {service}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}