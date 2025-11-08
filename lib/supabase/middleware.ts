import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          return request.cookies.get(key)?.value ?? null;
        },
        setItem: (key: string, value: string) => {
          // Update response with new cookie
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(key, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });
        },
        removeItem: (key: string) => {
          // Update response to remove cookie
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete(key);
        },
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect routes that require authentication
  const protectedPaths = ["/game", "/rooms", "/leaderboard"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  const isAuthPath = request.nextUrl.pathname.startsWith("/auth");

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    // Only set redirect if it's a safe path (relative, same origin)
    const safePath = request.nextUrl.pathname.startsWith("/")
      ? request.nextUrl.pathname
      : "/";
    redirectUrl.searchParams.set("redirect", safePath);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to home if accessing auth pages while logged in
  if (isAuthPath && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}
