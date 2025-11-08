import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { roomService as serverRoomService } from "@/services/server/room.service";

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

    if (roomId) {
      const room = await serverRoomService.getRoom(roomId);
      return NextResponse.json(room);
    }

    const rooms = await serverRoomService.getRooms();
    return NextResponse.json(rooms);
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
    const room = await serverRoomService.createRoom({
      name: body.name,
      host_id: user.id,
      max_players: body.max_players || 2,
      is_bot_room: body.is_bot_room,
      bot_difficulty: body.bot_difficulty,
    });

    return NextResponse.json(room);
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
    const { roomId, ...updates } = body;

    const room = await serverRoomService.updateRoom(roomId, updates);
    return NextResponse.json(room);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
