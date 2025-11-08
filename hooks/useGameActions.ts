import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/lib/socket/client";
import { useUpdateGame, useCreateGame } from "@/actions/useGames";
import { useUpdateRoom } from "@/actions/useRooms";
import { gameService } from "@/services/client/game.service";
import { roomService } from "@/services/client/room.service";
import { toast } from "sonner";
import { Game, Room, User } from "@/types/database";

interface UseGameActionsProps {
  game: Game | null | undefined;
  room: Room | null | undefined;
  roomId: string | null;
  user: User | null | undefined;
  players: Array<{ user_id: string; color: string | null }>;
}

export function useGameActions({
  game,
  room,
  roomId,
  user,
  players,
}: UseGameActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { mutate: createGame } = useCreateGame();
  const { mutate: updateGame } = useUpdateGame();
  const { mutate: updateRoom } = useUpdateRoom();

  const handleStartGame = () => {
    if (!room || !user || game) return;

    if (room.status === "finished") {
      toast.error("Room is finished. Please restart the room first.");
      return;
    }

    if (room.host_id !== user.id) {
      toast.error("Only the room host can start the game");
      return;
    }

    const isBotRoom = room.is_bot_room === true;
    const hasEnoughPlayers = isBotRoom
      ? players.length >= 1
      : players.length === 2;

    if (!hasEnoughPlayers) {
      toast.error(isBotRoom ? "No players in room" : "Need 2 players to start");
      return;
    }

    const whitePlayer = players.find((p) => p.color === "white");
    const playerId = whitePlayer?.user_id || room.host_id;
    const botColor = whitePlayer ? "black" : "white";

    createGame(
      {
        room_id: room.id,
        white_player_id: playerId,
        time_control: 600,
        is_bot_game: isBotRoom,
        bot_difficulty: isBotRoom ? room.bot_difficulty || "medium" : undefined,
        bot_color: isBotRoom ? botColor : undefined,
      },
      {
        onSuccess: (newGame) => {
          toast.success("Game started!");
          updateRoom({
            roomId: room.id,
            updates: {
              status: "active",
              game_id: newGame.id,
            },
          });
          socket?.emit("game:start", {
            roomId: room.id,
            gameId: newGame.id,
          });
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error ? error.message : "Failed to start game";
          toast.error(message);
        },
      }
    );
  };

  const handleResign = () => {
    if (!game || !user) {
      toast.error("Game or user not found");
      return;
    }

    if (game.status === "finished") {
      toast.error("Game is already finished");
      return;
    }

    let winnerId: string | null = null;
    if (game.is_bot_game) {
      winnerId = null;
    } else {
      winnerId =
        game.white_player_id === user.id
          ? game.black_player_id
          : game.white_player_id;
    }

    updateGame(
      {
        gameId: game.id,
        data: {
          status: "finished",
          winner_id: winnerId,
        },
      },
      {
        onSuccess: () => {
          if (socket) {
            socket.emit("game:end", {
              roomId: roomId!,
              result: { winner_id: winnerId, reason: "resignation" },
            });
          }
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error ? error.message : "Failed to resign";
          toast.error(message);
        },
      }
    );
  };

  const handlePlayAgain = async () => {
    if (!game || !roomId || !user) return;

    try {
      await gameService.deleteGame(game.id);
    } catch (error) {
      console.error("Error deleting game on play again:", error);
    }

    try {
      await roomService.leaveRoom(roomId, user.id);
    } catch (error) {
      console.error("Error leaving room on play again:", error);
    }

    queryClient.removeQueries({ queryKey: ["games", "room", roomId] });
    queryClient.setQueryData(["games", "room", roomId], null);
    queryClient.invalidateQueries({ queryKey: ["games", "room", roomId] });
    queryClient.invalidateQueries({ queryKey: ["games"] });
    queryClient.invalidateQueries({ queryKey: ["rooms", roomId] });
    queryClient.invalidateQueries({ queryKey: ["rooms"] });

    router.push("/rooms");
  };

  const handleBackToHome = async () => {
    if (!game || !roomId || !user) return;

    try {
      await gameService.deleteGame(game.id);
    } catch (error) {
      console.error("Error deleting game on back to home:", error);
    }

    try {
      await roomService.leaveRoom(roomId, user.id);
    } catch (error) {
      console.error("Error leaving room on back to home:", error);
    }

    queryClient.removeQueries({ queryKey: ["games", "room", roomId] });
    queryClient.setQueryData(["games", "room", roomId], null);
    queryClient.invalidateQueries({ queryKey: ["games", "room", roomId] });
    queryClient.invalidateQueries({ queryKey: ["games"] });
    queryClient.invalidateQueries({ queryKey: ["rooms", roomId] });
    queryClient.invalidateQueries({ queryKey: ["rooms"] });

    router.push("/");
  };

  return {
    handleStartGame,
    handleResign,
    handlePlayAgain,
    handleBackToHome,
  };
}
