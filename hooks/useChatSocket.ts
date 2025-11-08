"use client";

import { useEffect } from "react";
import { useSocket } from "@/lib/socket/client";
import { ChatMessage } from "@/types/database";
import { useChatMessages, useSendMessage } from "@/actions/useChat";
import { useQueryClient } from "@tanstack/react-query";

export function useChatSocket(roomId: string | null) {
  const { socket, isConnected } = useSocket();
  const { data: messages = [] } = useChatMessages(roomId);
  const { mutate: sendMessage } = useSendMessage();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !roomId || !isConnected) return;

    const handleNewMessage = (message: ChatMessage) => {
      queryClient.setQueryData<ChatMessage[]>(["chat", roomId], (old = []) => [
        ...old,
        message,
      ]);
    };

    socket.on(`chat:message:${roomId}`, handleNewMessage);
    socket.emit("chat:join", roomId);

    return () => {
      socket.off(`chat:message:${roomId}`, handleNewMessage);
      socket.emit("chat:leave", roomId);
    };
  }, [socket, roomId, isConnected, queryClient]);

  const sendChatMessage = (message: string, userId: string) => {
    if (!roomId) return;

    sendMessage(
      {
        room_id: roomId,
        user_id: userId,
        message,
      },
      {
        onSuccess: (newMessage) => {
          // Emit to socket for real-time updates
          socket?.emit("chat:send", {
            roomId,
            message: newMessage,
          });
        },
      }
    );
  };

  return {
    messages,
    sendChatMessage,
    isConnected,
  };
}
