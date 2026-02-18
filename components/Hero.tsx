"use client";

import FadeIn from "./FadeIn";
import HeroServicesCarousel from "./HeroServicesCarousel";
import { useModal } from "./ModalContext";

export default function Hero() {
    const { openModal } = useModal();

    const socialLinks = [
        { name: "WhatsApp", url: "https://wa.me/5215512345678", color: "hover:text-[#25D366]", icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /> },
        { name: "Facebook", url: "https://facebook.com", color: "hover:text-[#1877F2]", icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
        { name: "Instagram", url: "https://instagram.com", color: "hover:text-[#E1306C]", icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /> },
        { name: "TikTok", url: "https://tiktok.com", color: "hover:text-black", icon: <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /> }
    ];

    return (
        <section id="hero" className="relative min-h-[100dvh] lg:h-[100dvh] lg:min-h-[560px] flex flex-col lg:flex-row lg:items-center overflow-hidden bg-slate-50">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-[10%] -top-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl opacity-60" />
                <div className="absolute right-0 bottom-0 w-[35%] h-[45%] bg-purple-100/60 rounded-full blur-3xl opacity-70" />
            </div>

            <div className="hidden lg:block absolute bottom-0 right-0 z-10 pointer-events-none">
                <FadeIn delay={0.3} direction="left">
                    <img
                        src="/avatar2.png"
                        alt="Dental 3D Illustration"
                        className="
                            block object-contain drop-shadow-2xl animate-float
                            w-[55vw] translate-x-[2vw]
                            sm:w-[50vw] sm:translate-x-0
                            md:w-[44vw]
                            lg:w-[48vw]
                            [@media(max-height:960px)]:max-w-[400px]
                            [@media(min-height:960px)]:max-w-[600px]
                        "
                    />
                </FadeIn>
            </div>

            <div className="
                relative z-20 w-full
                flex-grow flex flex-col justify-center px-5 pt-28 pb-10
                lg:flex-grow-0 lg:h-full lg:py-0 lg:px-8 lg:pl-[80px] lg:pr-0
            ">
                <div className="
                    w-full
                    flex flex-col items-center text-center
                    max-w-full
                    lg:block lg:text-left lg:items-start
                    lg:max-w-[50%]
                    sm:max-w-[54%] md:max-w-[52%]
                ">

                    <FadeIn delay={0.2} direction="up">
                        <h1 className="
                            font-bold text-slate-800 leading-[1.1] tracking-tight font-sans
                            text-4xl sm:text-5xl
                            lg:text-[clamp(1.6rem,4.5vw,4.5rem)]
                            mb-3 lg:mb-5
                            [@media(max-height:800px)]:mb-2
                        ">
                            Haz de tu sonrisa  <br />
                            <span className="text-[#6366f1]">tu mejor firma.</span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.3} direction="up">
                        <p className="
                            text-slate-500 leading-relaxed font-medium
                            text-sm sm:text-[0.95rem]
                            lg:text-[clamp(0.78rem,1.3vw,1.125rem)]
                            mb-4 lg:mb-5
                            [@media(max-height:800px)]:mb-2
                        ">
                            Más que un tratamiento, ofrecemos confianza. Atención personalizada, procesos cuidadosos y soluciones modernas pensadas para tu salud dental.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.4} direction="up">
                        <div className="
                            flex flex-wrap gap-2.5
                            justify-center
                            lg:justify-start
                            mb-4 lg:mb-7
                            [@media(max-height:800px)]:mb-3
                        ">
                            <button
                                onClick={openModal}
                                className="
                                    bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold rounded-lg
                                    transition-all shadow-lg shadow-indigo-500/30
                                    hover:shadow-indigo-500/40 active:scale-95
                                    px-5 py-2.5 text-sm
                                    sm:px-7 sm:py-3 sm:text-base
                                    lg:px-8 lg:py-3.5 lg:text-lg
                                "
                            >
                                Agenda una cita
                            </button>
                        </div>
                    </FadeIn>

                    {/* Carrusel */}
                    <FadeIn delay={0.5} direction="up">
                        <div className="
                            w-full
                            mb-3 lg:mb-5
                            [@media(max-height:800px)]:mb-2
                            [@media(max-height:640px)]:hidden
                        ">
                            <HeroServicesCarousel />
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.6} direction="up">
                        <div className="
                            flex items-center gap-4 lg:gap-6
                            justify-center
                            lg:justify-start
                        ">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className={`transition-all duration-300 text-slate-400 ${social.color} hover:scale-110`}
                                >
                                    <svg
                                        className="w-5 h-5 lg:w-6 lg:h-6 fill-current"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        {social.icon}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </FadeIn>

                </div>
            </div>

            <div className="block lg:hidden relative z-10 w-full mt-auto pointer-events-none">
                <FadeIn delay={0.3} direction="up">
                    <img
                        src="/avatar4.png"
                        alt="Dental 3D Illustration Mobile"
                        className="w-full object-cover object-bottom"
                    />
                </FadeIn>
            </div>

        </section>
    );
}