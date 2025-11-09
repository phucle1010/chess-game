"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gameService } from "@/services/client/game.service";
import { CreateGameData, UpdateGameData } from "@/types/game";

export function useGame(gameId: string | null) {
  return useQuery({
    queryKey: ["games", gameId],
    queryFn: () => (gameId ? gameService.getGame(gameId) : null),
    enabled: !!gameId,
  });
}

export function useGameByRoom(roomId: string | null) {
  return useQuery({
    queryKey: ["games", "room", roomId],
    queryFn: () => (roomId ? gameService.getGameByRoom(roomId) : null),
    enabled: !!roomId,
    // No polling - rely on socket events and cache updates
    staleTime: 10000, // Consider data fresh for 10 seconds
  });
}

export function useUserGames() {
  return useQuery({
    queryKey: ["games", "user"],
    queryFn: () => gameService.getUserGames(),
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGameData) => gameService.createGame(data),
    onSuccess: (game) => {
      // Invalidate and refetch game queries
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.setQueryData(["games", game.id], game);
      queryClient.setQueryData(["games", "room", game.room_id], game);
      // Force refetch the room's game
      queryClient.refetchQueries({ queryKey: ["games", "room", game.room_id] });
    },
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, data }: { gameId: string; data: UpdateGameData }) =>
      gameService.updateGame(gameId, data),
    onSuccess: (game) => {
      queryClient.setQueryData(["games", game.id], game);
      queryClient.setQueryData(["games", "room", game.room_id], game);
      // Invalidate to trigger re-render, but don't refetch (use cache)
      queryClient.invalidateQueries({
        queryKey: ["games", "room", game.room_id],
      });
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}
