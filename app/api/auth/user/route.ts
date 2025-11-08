import { NextResponse } from "next/server";
import { authService } from "@/services/server/auth.service";

export async function GET() {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to get user" },
      { status: 500 }
    );
  }
}
