"use client";

import Link from 'next/link';
import { useModal } from './ModalContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { openModal } = useModal();
  const [showButton, setShowButton] = useState(false);
  const navItems = ['Servicios', 'Nosotros', 'Testimonios', 'Contacto'];

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowButton(!entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4">

      <header className="
        w-full max-w-7xl
        bg-white/25 dark:bg-slate-900/60 
        backdrop-blur-md 
        border border-white/30 dark:border-slate-700 
        shadow-lg shadow-black/5
        rounded-2xl
        transition-all duration-300
      ">
        <div className="px-3 md:px-6 h-16 md:h-16 flex items-center justify-between gap-4">

          <Link href="/" className="hidden md:flex items-center gap-2 group shrink-0">
            <div className="text-primary size-8 transition-transform group-hover:scale-110">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              DENTAL<span className="text-primary">CARE</span>
            </span>
          </Link>

          <nav className="flex-1 flex items-center overflow-x-auto no-scrollbar md:justify-center md:overflow-visible mask-fade-sides">
            <div className="flex items-center gap-1 md:gap-2 pr-4 md:pr-0">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="
                      px-4 py-2 
                      text-sm font-semibold whitespace-nowrap
                      text-slate-800 dark:text-slate-200 
                      hover:text-primary hover:bg-white/60 dark:hover:bg-slate-800
                      rounded-full transition-all duration-300
                    "
                >
                  {item}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-3 shrink-0 pl-2 border-l border-white/20 md:border-none">
            <a href="tel:600123456" className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 opacity-80 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-primary text-lg">call</span>
              600-123-456
            </a>

            <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${showButton
                ? 'max-w-[160px] opacity-100 translate-y-0'
                : 'max-w-0 opacity-0 -translate-y-1 pointer-events-none'
              }
              `}>
              <button
                onClick={openModal}
                className="bg-primary text-white px-4 md:px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30 flex items-center gap-2 whitespace-nowrap"
              >
                <span className="hidden sm:inline">Agendar</span> Cita
              </button>
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}