import { createServerClient } from "@/lib/supabase/server";
import { ChatMessage } from "@/types/database";

export interface SendMessageData {
  room_id: string;
  user_id: string;
  message: string;
}

export const chatService = {
  async getMessages(roomId: string, limit = 50): Promise<ChatMessage[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*, user:users(username, email)")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).reverse();
  },

  async sendMessage(data: SendMessageData): Promise<ChatMessage> {
    const supabase = await createServerClient();
    const { data: message, error } = await supabase
      .from("chat_messages")
      .insert({
        room_id: data.room_id,
        user_id: data.user_id,
        message: data.message,
      })
      .select("*, user:users(username, email)")
      .single();

    if (error) throw error;
    return message;
  },
};
