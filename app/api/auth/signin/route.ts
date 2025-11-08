import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/server/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await authService.signIn(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to sign in" },
      { status: 401 }
    );
  }
}
