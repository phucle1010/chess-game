import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { gameService as serverGameService } from "@/services/server/game.service";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gameId } = await params;

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    // Get the game to verify ownership
    const game = await serverGameService.getGame(gameId);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Check if user is part of this game
    const isPlayer =
      game.white_player_id === user.id || game.black_player_id === user.id;

    if (!isPlayer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await serverGameService.deleteGame(gameId);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting game:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete game" },
      { status: 500 }
    );
  }
}
