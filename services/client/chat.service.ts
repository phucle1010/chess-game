// Client-side service that calls API routes instead of Supabase directly
import { ChatMessage } from "@/types/database";
import { fetchWithErrorHandling } from "@/lib/api-error-handler";

export interface SendMessageData {
  room_id: string;
  user_id: string;
  message: string;
}

const API_BASE = "/api";

export const chatService = {
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    const response = await fetchWithErrorHandling(
      `${API_BASE}/chat/${roomId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    return response.json();
  },

  async sendMessage(data: SendMessageData): Promise<ChatMessage> {
    const response = await fetchWithErrorHandling(
      `${API_BASE}/chat/${data.room_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: data.message,
        }),
      }
    );

    return response.json();
  },
};
