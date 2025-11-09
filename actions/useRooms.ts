"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roomService } from "@/services/client/room.service";
import { Room } from "@/types/database";
import { CreateRoomData } from "@/types/room";

export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomService.getRooms(),
    staleTime: 30000,
  });
}

export function useRoom(roomId: string | null) {
  return useQuery({
    queryKey: ["rooms", roomId],
    queryFn: () => (roomId ? roomService.getRoom(roomId) : null),
    enabled: !!roomId,
    staleTime: 10000,
  });
}

export function useRoomPlayers(roomId: string | null) {
  return useQuery({
    queryKey: ["rooms", roomId, "players"],
    queryFn: () => (roomId ? roomService.getRoomPlayers(roomId) : []),
    enabled: !!roomId,
    staleTime: 10000,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoomData) => roomService.createRoom(data),
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.setQueryData(["rooms", room.id], room);
    },
  });
}

export function useJoinRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      userId,
      playWithBot,
      botDifficulty,
    }: {
      roomId: string;
      userId: string;
      playWithBot?: boolean;
      botDifficulty?: "easy" | "medium" | "hard";
    }) => roomService.joinRoom(roomId, userId, playWithBot, botDifficulty),
    onSuccess: (result, variables) => {
      // Clear ALL game-related cache for this room first (fresh start)
      queryClient.removeQueries({
        queryKey: ["games", "room", variables.roomId],
      });
      queryClient.setQueryData(["games", "room", variables.roomId], null);

      // Update room cache with the returned room data
      if (result.room) {
        queryClient.setQueryData(["rooms", variables.roomId], result.room);
      }

      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["rooms", variables.roomId] });
      queryClient.invalidateQueries({
        queryKey: ["rooms", variables.roomId, "players"],
      });
      queryClient.invalidateQueries({
        queryKey: ["games", "room", variables.roomId],
      });
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      // Force refetch to get fresh data
      queryClient.refetchQueries({ queryKey: ["rooms", variables.roomId] });
      queryClient.refetchQueries({
        queryKey: ["rooms", variables.roomId, "players"],
      });
      queryClient.refetchQueries({
        queryKey: ["games", "room", variables.roomId],
      });
    },
  });
}

export function useLeaveRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      roomService.leaveRoom(roomId, userId),
    onSuccess: (_, variables) => {
      // Clear ALL game-related cache for this room
      queryClient.removeQueries({
        queryKey: ["games", "room", variables.roomId],
      });
      queryClient.removeQueries({ queryKey: ["games"], exact: false });
      queryClient.setQueryData(["games", "room", variables.roomId], null);

      // Invalidate and refetch room data to ensure fresh state
      queryClient.invalidateQueries({ queryKey: ["rooms", variables.roomId] });
      queryClient.invalidateQueries({
        queryKey: ["rooms", variables.roomId, "players"],
      });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });

      // Force refetch to get fresh data
      queryClient.refetchQueries({ queryKey: ["rooms", variables.roomId] });
      queryClient.refetchQueries({
        queryKey: ["rooms", variables.roomId, "players"],
      });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      updates,
    }: {
      roomId: string;
      updates: Partial<Room>;
    }) => roomService.updateRoom(roomId, updates),
    onSuccess: (room) => {
      queryClient.setQueryData(["rooms", room.id], room);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      roomService.deleteRoom(roomId, userId),
    onSuccess: (_, variables) => {
      // Remove room from cache
      queryClient.removeQueries({ queryKey: ["rooms", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}
