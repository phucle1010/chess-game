import { ChatMessage } from "@/types/chat";
import { SendMessageData } from "@/types/chat";
import { fetchWithErrorHandling } from "@/lib/api-error-handler";

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
