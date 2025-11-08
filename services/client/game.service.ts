// Client-side service that calls API routes instead of Supabase directly
import { Game } from "@/types/database";
import { fetchWithErrorHandling } from "@/lib/api-error-handler";

export interface CreateGameData {
  room_id: string;
  white_player_id: string;
  time_control: number;
  is_bot_game?: boolean;
  bot_difficulty?: "easy" | "medium" | "hard";
  bot_color?: "white" | "black";
}

export interface UpdateGameData {
  fen?: string;
  pgn?: string;
  current_turn?: "white" | "black";
  status?: "waiting" | "active" | "finished" | "abandoned";
  winner_id?: string | null;
  white_time_remaining?: number;
  black_time_remaining?: number;
}

const API_BASE = "/api";

export const gameService = {
  async createGame(data: CreateGameData): Promise<Game> {
    const response = await fetchWithErrorHandling(`${API_BASE}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        room_id: data.room_id,
        time_control: data.time_control,
        is_bot_game: data.is_bot_game,
        bot_difficulty: data.bot_difficulty,
        bot_color: data.bot_color,
      }),
    });

    return response.json();
  },

  async getGame(gameId: string): Promise<Game | null> {
    try {
      const response = await fetchWithErrorHandling(
        `${API_BASE}/games?gameId=${gameId}`,
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

  async getGameByRoom(roomId: string): Promise<Game | null> {
    try {
      const response = await fetchWithErrorHandling(
        `${API_BASE}/games?roomId=${roomId}`,
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

  async updateGame(gameId: string, data: UpdateGameData): Promise<Game> {
    const response = await fetchWithErrorHandling(`${API_BASE}/games`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        gameId,
        ...data,
      }),
    });

    return response.json();
  },

  async getUserGames(): Promise<Game[]> {
    const response = await fetchWithErrorHandling(`${API_BASE}/games`, {
      method: "GET",
      credentials: "include",
    });

    return response.json();
  },

  async makeBotMove(
    gameId: string
  ): Promise<{
    move: { from: string; to: string; promotion?: string };
    game: Game;
  }> {
    const response = await fetchWithErrorHandling(
      `${API_BASE}/games/bot-move`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ gameId }),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || "Failed to make bot move");
    }

    return response.json();
  },

  async deleteGame(gameId: string): Promise<void> {
    const response = await fetchWithErrorHandling(
      `${API_BASE}/games/${gameId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || "Failed to delete game");
    }
  },
};
