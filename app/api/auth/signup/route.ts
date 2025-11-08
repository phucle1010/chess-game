import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/server/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await authService.signUp(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as unknown as Error).message || "Failed to sign up" },
      { status: 400 }
    );
  }
}
