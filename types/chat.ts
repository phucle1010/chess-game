export interface SendMessageData {
  room_id: string;
  user_id: string;
  message: string;
}

export type { ChatMessage } from "./database";
