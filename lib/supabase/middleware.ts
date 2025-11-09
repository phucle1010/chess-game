import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
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

  const supabase = createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        });
      },
    },
  });

  // For middleware route protection, we use getSession() to avoid rate limiting
  // on every request. However, this is less secure than getUser().
  // For actual user data operations, always use getUser() in API routes.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  // Protect routes that require authentication
  const protectedPaths = ["/game", "/rooms", "/leaderboard"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  const isAuthPath = request.nextUrl.pathname.startsWith("/auth");

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
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
