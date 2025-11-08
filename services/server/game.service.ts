import { createServerClient } from "@/lib/supabase/server";
import { Game } from "@/types/database";

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

export const gameService = {
  async createGame(data: CreateGameData): Promise<Game> {
    const supabase = await createServerClient();
    const { data: game, error } = await supabase
      .from("games")
      .insert({
        room_id: data.room_id,
        white_player_id: data.white_player_id,
        black_player_id: null,
        current_turn: "white",
        status: data.is_bot_game ? "active" : "waiting",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        pgn: "",
        time_control: data.time_control,
        white_time_remaining: data.time_control,
        black_time_remaining: data.time_control,
        is_bot_game: data.is_bot_game || false,
        bot_difficulty: data.bot_difficulty || null,
        bot_color: data.bot_color || null,
      })
      .select()
      .single();

    if (error) throw error;
    return game;
  },

  async getGame(gameId: string): Promise<Game | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (error) throw error;
    return data;
  },

  async getGameByRoom(roomId: string): Promise<Game | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateGame(gameId: string, data: UpdateGameData): Promise<Game> {
    const supabase = await createServerClient();
    const { data: game, error } = await supabase
      .from("games")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", gameId)
      .select()
      .single();

    if (error) throw error;
    return game;
  },

  async getUserGames(userId: string): Promise<Game[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .or(`white_player_id.eq.${userId},black_player_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  },

  async deleteGame(gameId: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase.from("games").delete().eq("id", gameId);

    if (error) throw error;
  },

  async deleteGameByRoom(roomId: string): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase
      .from("games")
      .delete()
      .eq("room_id", roomId);

    if (error) throw error;
  },
};
