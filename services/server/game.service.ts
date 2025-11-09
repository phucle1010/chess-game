import { createServerClient } from "@/lib/supabase/server";
import { Game } from "@/types/database";
import { userService } from "./user.service";

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

    const currentGame = await this.getGame(gameId);
    if (!currentGame) throw new Error("Game not found");

    const isFinishing =
      data.status === "finished" && currentGame.status !== "finished";

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

    // Update ratings if game just finished and it's not a bot game
    if (isFinishing && !currentGame.is_bot_game) {
      try {
        await this.updatePlayerRatings(game, currentGame);
      } catch (ratingError) {
        console.error("Error updating player ratings:", ratingError);
        // Don't fail the game update if rating update fails
      }
    }

    return game;
  },

  async updatePlayerRatings(
    finishedGame: Game,
    previousGame: Game
  ): Promise<void> {
    if (previousGame.status === "finished") return;

    if (finishedGame.is_bot_game) return;

    if (!finishedGame.winner_id) {
      // Handle draw - update both players with draw
      if (finishedGame.white_player_id && finishedGame.black_player_id) {
        const whiteUser = await userService.getUser(
          finishedGame.white_player_id
        );
        const blackUser = await userService.getUser(
          finishedGame.black_player_id
        );

        if (whiteUser && blackUser) {
          // Calculate rating change for draw (small change)
          const kFactor = 32;
          const expectedWhite =
            1 / (1 + Math.pow(10, (blackUser.rating - whiteUser.rating) / 400));
          const expectedBlack =
            1 / (1 + Math.pow(10, (whiteUser.rating - blackUser.rating) / 400));

          const whiteChange = Math.round(kFactor * (0.5 - expectedWhite));
          const blackChange = Math.round(kFactor * (0.5 - expectedBlack));

          await userService.updateRating(
            finishedGame.white_player_id,
            "draw",
            whiteChange
          );
          await userService.updateRating(
            finishedGame.black_player_id,
            "draw",
            blackChange
          );
        }
      }
      return;
    }

    // Determine winner and loser
    const winnerId = finishedGame.winner_id;
    const loserId =
      finishedGame.white_player_id === winnerId
        ? finishedGame.black_player_id
        : finishedGame.white_player_id;

    if (!loserId) return;

    const winner = await userService.getUser(winnerId);
    const loser = await userService.getUser(loserId);

    if (!winner || !loser) return;

    // Calculate ELO rating change
    const kFactor = 32; // Standard K-factor for chess
    const expectedWinner =
      1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
    const expectedLoser =
      1 / (1 + Math.pow(10, (winner.rating - loser.rating) / 400));

    // Winner gets points, loser loses points
    const winnerChange = Math.round(kFactor * (1 - expectedWinner));
    const loserChange = Math.round(kFactor * (0 - expectedLoser));

    // Update both players' ratings
    await userService.updateRating(winnerId, "win", winnerChange);
    await userService.updateRating(loserId, "loss", loserChange);
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
