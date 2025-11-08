import { NextResponse } from "next/server";
import { authService } from "@/services/server/auth.service";

export async function GET() {
  try {
    const session = await authService.getSession();
    return NextResponse.json(session);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to get session" },
      { status: 500 }
    );
  }
}
