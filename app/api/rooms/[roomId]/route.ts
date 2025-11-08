import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { roomService as serverRoomService } from "@/services/server/room.service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    await serverRoomService.deleteRoom(roomId, user.id);
    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete room" },
      { status: 500 }
    );
  }
}
