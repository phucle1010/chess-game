"use client";

import { useEffect } from "react";
import { useSocket } from "@/lib/socket/client";
import { useRoom, useRoomPlayers } from "@/actions/useRooms";
import { useQueryClient } from "@tanstack/react-query";
import { Room, RoomPlayer } from "@/types/database";

export function useRoomSocket(roomId: string | null) {
  const { socket, isConnected } = useSocket();
  const { data: room } = useRoom(roomId);
  const { data: players = [] } = useRoomPlayers(roomId);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !roomId || !isConnected) return;

    socket.emit("room:join", roomId);

    const handlePlayerJoined = (player: RoomPlayer) => {
      queryClient.setQueryData<RoomPlayer[]>(
        ["rooms", roomId, "players"],
        (old = []) => {
          if (old.find((p) => p.id === player.id)) return old;
          return [...old, player];
        }
      );
    };

    const handlePlayerLeft = (playerId: string) => {
      queryClient.setQueryData<RoomPlayer[]>(
        ["rooms", roomId, "players"],
        (old = []) => old.filter((p) => p.id !== playerId)
      );
    };

    const handleRoomUpdate = (updatedRoom: Room) => {
      queryClient.setQueryData(["rooms", roomId], updatedRoom);
    };

    socket.on(`room:player:joined:${roomId}`, handlePlayerJoined);
    socket.on(`room:player:left:${roomId}`, handlePlayerLeft);
    socket.on(`room:update:${roomId}`, handleRoomUpdate);

    return () => {
      socket.off(`room:player:joined:${roomId}`, handlePlayerJoined);
      socket.off(`room:player:left:${roomId}`, handlePlayerLeft);
      socket.off(`room:update:${roomId}`, handleRoomUpdate);
      socket.emit("room:leave", roomId);
    };
  }, [socket, roomId, isConnected, queryClient]);

  return {
    room,
    players,
    isConnected,
  };
}
