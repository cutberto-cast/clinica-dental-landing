import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase redirige aquí después de que el usuario hace clic en el Magic Link.
// Este handler intercambia el `code` por una sesión real y establece las cookies.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    console.error("Auth callback error:", error, errorDescription);
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent(errorDescription ?? error)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("Code exchange error:", exchangeError.message);
  }

  return NextResponse.redirect(`${origin}/admin/login?error=link_invalido`);
}
