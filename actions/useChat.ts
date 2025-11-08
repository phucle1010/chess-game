"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService, SendMessageData } from "@/services/client/chat.service";

export function useChatMessages(roomId: string | null) {
  return useQuery({
    queryKey: ["chat", roomId],
    queryFn: () => (roomId ? chatService.getMessages(roomId) : []),
    enabled: !!roomId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageData) => chatService.sendMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chat", variables.room_id] });
    },
  });
}
