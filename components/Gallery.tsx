"use client";

import { motion } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=2070&auto=format&fit=crop"
];

const infiniteImages = [...images, ...images];

export default function Gallery() {
  return (
    <section className="py-24 bg-white dark:bg-background-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Nuestras Instalaciones
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Espacios diseñados para tu comodidad y seguridad.
        </p>
      </div>

      <div className="relative w-full">

        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white dark:from-background-dark to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white dark:from-background-dark to-transparent pointer-events-none"></div>

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-6 flex-nowrap"
            animate={{ x: "-50%" }}
            transition={{
              ease: "linear",
              duration: 30,
              repeat: Infinity,
            }}
            style={{ width: "max-content" }}
          >
            {infiniteImages.map((src, idx) => (
              <div
                key={idx}
                className="relative w-[300px] h-[200px] md:w-[400px] md:h-[300px] flex-shrink-0 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Instalación ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}