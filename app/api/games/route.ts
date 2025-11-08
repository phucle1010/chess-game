import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { gameService as serverGameService } from "@/services/server/game.service";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get("roomId");
    const gameId = searchParams.get("gameId");

    if (gameId) {
      const game = await serverGameService.getGame(gameId);
      return NextResponse.json(game);
    }

    if (roomId) {
      const game = await serverGameService.getGameByRoom(roomId);
      return NextResponse.json(game);
    }

    const games = await serverGameService.getUserGames(user.id);
    return NextResponse.json(games);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

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
    const game = await serverGameService.createGame({
      room_id: body.room_id,
      white_player_id: user.id,
      time_control: body.time_control || 600,
      is_bot_game: body.is_bot_game,
      bot_difficulty: body.bot_difficulty,
      bot_color: body.bot_color,
    });

    return NextResponse.json(game);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, ...updates } = body;

    const game = await serverGameService.updateGame(gameId, updates);
    return NextResponse.json(game);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
