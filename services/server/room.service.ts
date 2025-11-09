import { createServerClient } from "@/lib/supabase/server";
import { Room, RoomPlayer } from "@/types/database";
import { ValidationError } from "@/lib/errors";

import { gameService } from "./game.service";

export interface CreateRoomData {
  name: string;
  host_id: string;
  max_players?: number;
  is_bot_room?: boolean;
  bot_difficulty?: "easy" | "medium" | "hard";
}

export const roomService = {
  async createRoom(data: CreateRoomData): Promise<Room> {
    const supabase = await createServerClient();

    // Check if a room with the same name already exists (only for active/waiting rooms)
    // Case-insensitive check to prevent duplicates like "My Room" and "my room"
    const trimmedName = data.name.trim();
    const { data: existingRooms, error: checkError } = await supabase
      .from("rooms")
      .select("id, name, status")
      .ilike("name", trimmedName)
      .in("status", ["waiting", "active"]);

    if (checkError) {
      throw new Error("Failed to validate room name");
    }

    if (existingRooms && existingRooms.length > 0) {
      throw new ValidationError(
        `A room with the name "${data.name}" already exists. Please choose a different name.`
      );
    }

    const { data: room, error } = await supabase
      .from("rooms")
      .insert({
        name: data.name.trim(),
        host_id: data.host_id,
        max_players: data.is_bot_room ? 1 : data.max_players || 2,
        current_players: 1,
        status: "waiting",
        is_bot_room: data.is_bot_room || false,
        bot_difficulty: data.bot_difficulty || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Add host as player
    await this.joinRoom(room.id, data.host_id);

    return room;
  },

  async getRoom(roomId: string): Promise<Room | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) throw error;
    return data;
  },

  async getRooms(): Promise<Room[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .in("status", ["waiting", "active", "finished"]) // Show all rooms including finished ones for reuse
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  },

  async joinRoom(
    roomId: string,
    userId: string,
    playWithBot?: boolean,
    botDifficulty?: "easy" | "medium" | "hard"
  ): Promise<{ player: RoomPlayer; room: Room }> {
    const supabase = await createServerClient();

    // Check if already in room
    const { data: existing } = await supabase
      .from("room_players")
      .select("*")
      .eq("room_id", roomId)
      .eq("user_id", userId)
      .single();

    if (existing) {
      const currentRoom = await this.getRoom(roomId);
      if (!currentRoom) throw new Error("Room not found");
      return { player: existing, room: currentRoom };
    }

    // Get room to check capacity
    const room = await this.getRoom(roomId);
    if (!room) throw new Error("Room not found");

    const { data: players } = await supabase
      .from("room_players")
      .select("*")
      .eq("room_id", roomId);

    // Check if room is full BEFORE allowing any access
    if (players && players.length >= room.max_players) {
      throw new Error("Room is full");
    }

    // If room is finished, reset it to allow reuse
    if (room.status === "finished") {
      // Delete existing game to reset the board
      if (room.game_id) {
        const { gameService } = await import("./game.service");
        await gameService.deleteGame(room.game_id);
      }

      // Clear all players from finished room to start fresh
      await supabase.from("room_players").delete().eq("room_id", roomId);

      // Reset room status
      await supabase
        .from("rooms")
        .update({
          status: "waiting",
          game_id: null,
          current_players: 0,
          is_bot_room: false,
          bot_difficulty: null,
          max_players: 2,
        })
        .eq("id", roomId);

      // Refresh room data
      const refreshedRoom = await this.getRoom(roomId);
      if (refreshedRoom) {
        Object.assign(room, refreshedRoom);
      }
    }

    // If room is active but has no players, reset it to waiting
    // This allows users to rejoin after leaving
    if (room.status === "active" && (!players || players.length === 0)) {
      await supabase
        .from("rooms")
        .update({
          status: "waiting",
          game_id: null,
        })
        .eq("id", roomId);

      // Refresh room data
      const refreshedRoom = await this.getRoom(roomId);
      if (refreshedRoom) {
        Object.assign(room, refreshedRoom);
      }
    }

    // If playing with bot, convert room to bot room
    if (playWithBot) {
      const { error: updateError } = await supabase
        .from("rooms")
        .update({
          is_bot_room: true,
          bot_difficulty: botDifficulty || "medium",
          max_players: 1, // Bot rooms only need 1 human player
        })
        .eq("id", roomId);

      if (updateError) {
        console.error("Error updating room to bot room:", updateError);
        throw updateError;
      }
    }

    // Determine color
    const whitePlayer = players?.find((p) => p.color === "white");
    const color = whitePlayer ? "black" : "white";

    const { data: player, error } = await supabase
      .from("room_players")
      .insert({
        room_id: roomId,
        user_id: userId,
        color,
      })
      .select()
      .single();

    if (error) throw error;

    // Update room player count
    const { error: countError } = await supabase
      .from("rooms")
      .update({ current_players: (players?.length || 0) + 1 })
      .eq("id", roomId);

    if (countError) {
      console.error("Error updating player count:", countError);
    }

    // Get updated room to return
    const updatedRoom = await this.getRoom(roomId);
    if (!updatedRoom) throw new Error("Room not found after join");

    return { player, room: updatedRoom };
  },

  async leaveRoom(roomId: string, userId: string) {
    const supabase = await createServerClient();

    // Get room info first
    const room = await this.getRoom(roomId);
    if (!room) throw new Error("Room not found");

    // Delete player from room
    const { error } = await supabase
      .from("room_players")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", userId);

    if (error) throw error;

    // Get remaining players
    const { data: players } = await supabase
      .from("room_players")
      .select("*")
      .eq("room_id", roomId);

    const remainingPlayers = players?.length || 0;

    // If host leaves and there are no players left, we could delete the room
    // But for now, we'll just reset it to waiting status
    const updates: Partial<Room> = {
      current_players: remainingPlayers,
    };

    // If a player leaves and there's an active game, delete the game to reset the board
    if (room.game_id && room.status === "active") {
      const { gameService } = await import("./game.service");
      await gameService.deleteGame(room.game_id);
      updates.game_id = null;
    }

    // If no players left or game hasn't started, reset to waiting
    if (remainingPlayers === 0 || !room.game_id) {
      updates.status = "waiting";
      updates.game_id = null;

      // Reset bot room flags if room is empty, so it can be reused
      if (remainingPlayers === 0) {
        updates.is_bot_room = false;
        updates.bot_difficulty = null;
        updates.max_players = 2; // Reset to default 2-player room
      }
    }

    // If host left but there are still players, transfer host to first remaining player
    if (room.host_id === userId && remainingPlayers > 0) {
      const newHost = players?.[0]?.user_id;
      if (newHost) {
        updates.host_id = newHost;
      }
    }

    await supabase.from("rooms").update(updates).eq("id", roomId);
  },

  async getRoomPlayers(roomId: string): Promise<RoomPlayer[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("room_players")
      .select("*, user:users(*)")
      .eq("room_id", roomId);

    if (error) throw error;
    return data || [];
  },

  async updateRoom(roomId: string, updates: Partial<Room>): Promise<Room> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("rooms")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", roomId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRoom(roomId: string, userId: string): Promise<void> {
    const supabase = await createServerClient();

    // Get room info first
    const room = await this.getRoom(roomId);
    if (!room) throw new Error("Room not found");

    // Only host can delete room
    if (room.host_id !== userId) {
      throw new Error("Only the room host can delete the room");
    }

    // Get players count
    const { data: players } = await supabase
      .from("room_players")
      .select("*")
      .eq("room_id", roomId);

    const playerCount = players?.length || 0;

    // Only allow deletion if room is empty
    if (playerCount > 0) {
      throw new Error(
        "Cannot delete room with players. Please remove all players first."
      );
    }

    // Delete all games associated with this room
    try {
      await gameService.deleteGameByRoom(roomId);
    } catch (error) {
      console.error("Error deleting games when deleting room:", error);
      // Continue with room deletion even if game deletion fails
    }

    // Delete all room players (should be empty, but clean up anyway)
    const { error: playersError } = await supabase
      .from("room_players")
      .delete()
      .eq("room_id", roomId);

    if (playersError) {
      console.error("Error deleting room players:", playersError);
      // Continue with room deletion
    }

    // Delete all chat messages for this room
    const { error: chatError } = await supabase
      .from("chat_messages")
      .delete()
      .eq("room_id", roomId);

    if (chatError) {
      console.error("Error deleting chat messages:", chatError);
      // Continue with room deletion
    }

    // Delete the room
    const { error, data } = await supabase
      .from("rooms")
      .delete()
      .eq("id", roomId)
      .select();

    if (error) {
      console.error("Error deleting room:", error);
      throw error;
    }

    // Verify deletion
    if (!data || data.length === 0) {
      throw new Error(
        "Room was not deleted. It may not exist or you may not have permission."
      );
    }
  },
};
