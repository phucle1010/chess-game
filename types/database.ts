export interface User {
  id: string;
  email: string;
  username: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  room_id: string;
  white_player_id: string;
  black_player_id: string | null;
  current_turn: "white" | "black";
  status: "waiting" | "active" | "finished" | "abandoned";
  winner_id: string | null;
  fen: string;
  pgn: string;
  time_control: number; // in seconds
  white_time_remaining: number;
  black_time_remaining: number;
  is_bot_game: boolean;
  bot_difficulty: "easy" | "medium" | "hard" | null;
  bot_color: "white" | "black" | null;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  host_id: string;
  max_players: number;
  current_players: number;
  status: "waiting" | "active" | "finished";
  game_id: string | null;
  is_bot_room: boolean;
  bot_difficulty: "easy" | "medium" | "hard" | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: {
    username: string;
    email: string;
  };
}

export interface RoomPlayer {
  id: string;
  room_id: string;
  user_id: string;
  color: "white" | "black" | null;
  joined_at: string;
  user?: User;
}
