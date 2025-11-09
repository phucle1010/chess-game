import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { gameService as serverGameService } from "@/services/server/game.service";
import { botService } from "@/services/server/bot.service";
import { Chess } from "chess.js";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { gameId } = body;

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    // Get the game
    const game = await serverGameService.getGame(gameId);

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (!game.is_bot_game) {
      return NextResponse.json(
        { error: "This is not a bot game" },
        { status: 400 }
      );
    }

    if (game.status !== "active") {
      return NextResponse.json(
        { error: "Game is not active" },
        { status: 400 }
      );
    }

    // Get bot move
    const chess = new Chess(game.fen);
    let botMove;
    try {
      botMove = await botService.getBotMove(
        game.fen,
        game.bot_difficulty || "medium"
      );
    } catch (error) {
      console.error("Error getting bot move:", error);
      return NextResponse.json(
        { error: "Failed to calculate bot move" },
        { status: 500 }
      );
    }

    if (!botMove) {
      return NextResponse.json(
        { error: "No valid moves available" },
        { status: 400 }
      );
    }

    // Make the move
    try {
      const move = chess.move({
        from: botMove.from,
        to: botMove.to,
        promotion: botMove.promotion || "q",
      });

      if (!move) {
        return NextResponse.json(
          { error: "Invalid bot move" },
          { status: 400 }
        );
      }

      let status: "active" | "waiting" | "finished" | "abandoned" = game.status;
      let winnerId = game.winner_id;

      if (chess.isCheckmate()) {
        status = "finished";
        // Bot wins if it checkmated the opponent
        // The winner is the player who made the checkmating move (the bot)
        // Since bot_color indicates which color the bot is playing, we need to set winner_id to null for bot wins
        // (or we could create a special bot user, but for now we'll leave it null)
        winnerId = null; // Bot wins - could be handled differently if needed
      } else if (chess.isDraw() || chess.isStalemate()) {
        status = "finished";
        winnerId = null;
      }

      // Update game
      const updatedGame = await serverGameService.updateGame(gameId, {
        fen: chess.fen(),
        pgn: chess.pgn(),
        current_turn: chess.turn() === "w" ? "white" : "black",
        status,
        winner_id: winnerId,
      });

      return NextResponse.json({
        move: botMove,
        game: updatedGame,
      });
    } catch (error) {
      console.error("Error making bot move:", error);
      return NextResponse.json(
        { error: "Failed to make bot move" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Bot move error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
