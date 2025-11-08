// Client-side service that calls API routes instead of Supabase directly
import { Room, RoomPlayer } from "@/types/database";
import { fetchWithErrorHandling } from "@/lib/api-error-handler";

export interface CreateRoomData {
  name: string;
  host_id: string;
  max_players?: number;
  is_bot_room?: boolean;
  bot_difficulty?: "easy" | "medium" | "hard";
}

const API_BASE = "/api";

export const roomService = {
  async createRoom(data: CreateRoomData): Promise<Room> {
    const response = await fetchWithErrorHandling(`${API_BASE}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: data.name,
        max_players: data.max_players || 2,
        is_bot_room: data.is_bot_room,
        bot_difficulty: data.bot_difficulty,
      }),
    });

    return response.json();
  },

  async getRoom(roomId: string): Promise<Room | null> {
    try {
      const response = await fetchWithErrorHandling(
        `${API_BASE}/rooms?roomId=${roomId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message?.includes("Not Found")) {
        return null;
      }
      throw error;
    }
  },

  async getRooms(): Promise<Room[]> {
    const response = await fetchWithErrorHandling(`${API_BASE}/rooms`, {
      method: "GET",
      credentials: "include",
    });

    return response.json();
  },

  async joinRoom(
    roomId: string,
    userId: string,
    playWithBot?: boolean,
    botDifficulty?: "easy" | "medium" | "hard"
  ): Promise<{ player: RoomPlayer; room: Room }> {
    const response = await fetchWithErrorHandling(
      `${API_BASE}/rooms/${roomId}/join`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          playWithBot,
          botDifficulty,
        }),
      }
    );

    return response.json();
  },

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    await fetchWithErrorHandling(
      `${API_BASE}/rooms/${roomId}/leave?userId=${userId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
  },

  async getRoomPlayers(roomId: string): Promise<RoomPlayer[]> {
    const response = await fetchWithErrorHandling(
      `${API_BASE}/rooms/${roomId}/players`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    return response.json();
  },

  async updateRoom(roomId: string, updates: Partial<Room>): Promise<Room> {
    const response = await fetchWithErrorHandling(`${API_BASE}/rooms`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        roomId,
        ...updates,
      }),
    });

    return response.json();
  },

  async deleteRoom(roomId: string, userId: string): Promise<void> {
    await fetchWithErrorHandling(
      `${API_BASE}/rooms/${roomId}?userId=${userId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  },
};
