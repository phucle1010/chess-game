import { Game } from "./database";

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

export interface BotMoveResponse {
  move: {
    from: string;
    to: string;
    promotion?: string;
  };
  game: Game;
}
