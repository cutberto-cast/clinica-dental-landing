"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  isConnected: boolean;
  expiresAt: string | null;
}

export default function CalendarConfig({ isConnected, expiresAt }: Props) {
  const router = useRouter();
  const [disconnecting, setDisconnecting] = useState(false);

  function handleConnect() {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
      redirect_uri: `${window.location.origin}/api/auth/google/callback`,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/calendar.events",
      access_type: "offline",
      prompt: "consent",
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    const supabase = createClient();
    await supabase.from("calendar_tokens").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    router.refresh();
    setDisconnecting(false);
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start gap-4">
        {/* Icono Google Calendar */}
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Google Calendar</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${isConnected
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
              }`}>
              {isConnected ? "Conectado" : "No conectado"}
            </span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isConnected
              ? "Las nuevas citas se crean automáticamente en tu Google Calendar."
              : "Conecta tu Google Calendar para recibir las citas automáticamente."}
          </p>

          {isConnected && expiresAt && (
            <p className="text-xs text-slate-400 mt-1">
              Token válido hasta: {format(new Date(expiresAt), "d 'de' MMMM, HH:mm", { locale: es })}
            </p>
          )}

          <div className="mt-4">
            {isConnected ? (
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="text-sm px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                {disconnecting ? "Desconectando..." : "Desconectar Google Calendar"}
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Conectar Google Calendar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
