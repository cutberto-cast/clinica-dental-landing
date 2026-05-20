"use client";

import type { Service } from "@/lib/types";
import Image from "next/image";

interface Props {
  service: Service;
  onSelect: (service: Service) => void;
}

export default function ServiceCard({ service, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(service)}
      className="group text-left border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {service.image_url && (
        <div className="relative w-full h-36 mb-4 rounded-lg overflow-hidden">
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-primary transition-colors">
        {service.name}
      </h3>
      {service.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {service.description}
        </p>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {service.duration} min
        </span>
        {service.price !== null && (
          <span className="font-semibold text-primary">
            ${service.price.toLocaleString("es-MX")}
          </span>
        )}
      </div>
    </button>
  );
}
