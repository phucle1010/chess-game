import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/server/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const redirectUrl = `${request.nextUrl.origin}/auth/reset-password`;
    await authService.resetPassword(body, redirectUrl);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to send reset email" },
      { status: 400 }
    );
  }
}
