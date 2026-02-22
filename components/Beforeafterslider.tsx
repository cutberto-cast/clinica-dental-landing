"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const SMILE_AFTER = "despues.png";
const SMILE_BEFORE = "antes.png";

export default function BeforeAfterSlider() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (hasAnimated) return;
        const delay = setTimeout(() => {
            setHasAnimated(true);
            let direction = 1;
            let current = 30;
            setPosition(current);

            const interval = setInterval(() => {
                current += direction * 1.5;
                if (current >= 70) direction = -1;
                if (current <= 50 && direction === -1) {
                    clearInterval(interval);
                    setPosition(50);
                    return;
                }
                setPosition(current);
            }, 16);
        }, 600);
        return () => clearTimeout(delay);
    }, [hasAnimated]);

    const updatePosition = useCallback((clientX: number) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const raw = ((clientX - rect.left) / rect.width) * 100;
        setPosition(Math.min(100, Math.max(0, raw)));
    }, []);

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e: MouseEvent) => updatePosition(e.clientX);
        const onUp = () => setIsDragging(false);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [isDragging, updatePosition]);

    const onTouchStart = () => setIsDragging(true);
    const onTouchMove = (e: React.TouchEvent) => updatePosition(e.touches[0].clientX);
    const onTouchEnd = () => setIsDragging(false);

    return (
        <div className="flex flex-col w-full max-w-md lg:w-[420px] ml-auto shrink-0">
            <div
                ref={containerRef}
                className="relative rounded-3xl overflow-hidden shadow-2xl w-full aspect-[4/5] bg-slate-100"
                style={{ userSelect: "none", touchAction: "none" }}
            >
                {/* After image (base layer) */}
                <img
                    src={SMILE_AFTER}
                    alt="Sonrisa después"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 z-10 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                    Después
                </div>

                {/* Before image (clipped layer) */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                    <img
                        src={SMILE_BEFORE}
                        alt="Sonrisa antes"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 40%)" }}
                    />
                    <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                        Antes
                    </div>
                </div>

                {/* Divider line */}
                <div
                    className="absolute top-0 bottom-0 w-[1.5px] bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)] pointer-events-none"
                    style={{ left: `${position}%` }}
                />

                {/* Drag handle */}
                <div
                    className="absolute z-20"
                    style={{
                        left: `${position}%`,
                        top: "82%",
                        transform: "translate(-50%, -50%)",
                        cursor: isDragging ? "grabbing" : "grab",
                    }}
                    onMouseDown={onMouseDown}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <motion.div
                        animate={{ scale: isDragging ? 1.08 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center border border-white/40 hover:bg-white/30 transition-colors"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-md">
                            <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </motion.div>
                </div>
            </div>

            <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-4 flex items-center justify-center gap-1.5 font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                </svg>
                Arrastra para comparar
            </p>
        </div>
    );
}