"use server";

import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

/**
 * Validates and sanitizes redirect URLs to prevent open redirect vulnerabilities
 * Only allows relative paths or same-origin URLs
 */
function validateRedirectUrl(url: string, request: NextRequest): string | null {
  try {
    // If it's already a relative path, validate it
    if (url.startsWith("/")) {
      // Ensure it doesn't contain dangerous patterns
      if (
        url.startsWith("//") || // Protocol-relative URLs
        url.includes("\n") || // Newline injection
        url.includes("\r") || // Carriage return
        url.includes("%0a") || // URL-encoded newline
        url.includes("%0d") || // URL-encoded carriage return
        url.includes("javascript:") || // JavaScript protocol
        url.includes("data:") || // Data protocol
        url.includes("vbscript:") // VBScript protocol
      ) {
        return null;
      }
      return url;
    }

    // If it's a full URL, check if it's from the same origin
    const redirectUrl = new URL(url, request.url);
    const requestOrigin = new URL(request.url);

    // Only allow same-origin redirects
    if (
      redirectUrl.origin === requestOrigin.origin &&
      redirectUrl.pathname.startsWith("/")
    ) {
      return redirectUrl.pathname + redirectUrl.search;
    }

    return null;
  } catch {
    // Invalid URL format
    return null;
  }
}

/**
 * Protects routes and validates redirect URLs before redirecting
 */
export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  // If response is a redirect, validate the redirect URL
  if (
    response.status === 307 ||
    response.status === 308 ||
    response.status === 301 ||
    response.status === 302
  ) {
    const location = response.headers.get("location");

    if (location) {
      const validatedUrl = validateRedirectUrl(location, request);

      if (!validatedUrl) {
        // Invalid redirect URL, redirect to home instead
        const safeRedirect = new URL("/", request.url);
        return NextResponse.redirect(safeRedirect);
      }

      // If the validated URL is different from the original, update the redirect
      if (validatedUrl !== location) {
        const safeRedirect = new URL(validatedUrl, request.url);
        return NextResponse.redirect(safeRedirect);
      }
    }
  }

  // Check for redirect parameter in query string and validate it
  const redirectParam = request.nextUrl.searchParams.get("redirect");
  if (redirectParam) {
    const validatedRedirect = validateRedirectUrl(redirectParam, request);

    if (validatedRedirect) {
      // Update the redirect parameter with validated URL
      request.nextUrl.searchParams.set("redirect", validatedRedirect);
    } else {
      // Remove invalid redirect parameter
      request.nextUrl.searchParams.delete("redirect");
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
