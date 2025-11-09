import { Room, RoomPlayer } from "./database";

export interface CreateRoomData {
  name: string;
  host_id: string;
  max_players?: number;
  is_bot_room?: boolean;
  bot_difficulty?: "easy" | "medium" | "hard";
}

export interface JoinRoomData {
  roomId: string;
  userId: string;
  playWithBot?: boolean;
  botDifficulty?: "easy" | "medium" | "hard";
}

export interface JoinRoomResponse {
  player: RoomPlayer;
  room: Room;
}
