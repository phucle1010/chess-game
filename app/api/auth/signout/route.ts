import { NextResponse } from "next/server";
import { authService } from "@/services/server/auth.service";

export async function POST() {
  try {
    await authService.signOut();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to sign out" },
      { status: 500 }
    );
  }
}
