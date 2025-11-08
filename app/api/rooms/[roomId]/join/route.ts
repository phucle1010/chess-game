import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { roomService as serverRoomService } from "@/services/server/room.service";

export async function POST(
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
    const body = await request.json().catch(() => ({}));
    const { playWithBot, botDifficulty } = body;

    console.log("Join room request:", { roomId, playWithBot, botDifficulty });

    const result = await serverRoomService.joinRoom(
      roomId,
      user.id,
      playWithBot,
      botDifficulty
    );

    console.log("Join room result:", {
      playerId: result.player?.id,
      roomIsBot: result.room?.is_bot_room,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
