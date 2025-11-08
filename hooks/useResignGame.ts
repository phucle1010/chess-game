import { useState } from "react";
import { useUpdateGame } from "@/actions/useGames";
import { useSocket } from "@/lib/socket/client";
import { toast } from "sonner";
import { Game, User } from "@/types/database";

interface UseResignGameProps {
  game: Game | null | undefined;
  user: User | null | undefined;
  roomId: string | null;
  onResignSuccess: () => void;
}

export function useResignGame({
  game,
  user,
  roomId,
  onResignSuccess,
}: UseResignGameProps) {
  const { mutate: updateGame } = useUpdateGame();
  const { socket } = useSocket();
  const [resignDialogOpen, setResignDialogOpen] = useState(false);

  const handleResign = () => {
    setResignDialogOpen(true);
  };

  const confirmResign = () => {
    if (!game || !user) {
      toast.error("Game or user not found");
      return;
    }

    if (game.status === "finished") {
      toast.error("Game is already finished");
      setResignDialogOpen(false);
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
          setResignDialogOpen(false);

          if (socket) {
            socket.emit("game:end", {
              roomId: roomId!,
              result: { winner_id: winnerId, reason: "resignation" },
            });
          }

          onResignSuccess();
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error ? error.message : "Failed to resign";
          toast.error(message);
        },
      }
    );
  };

  return {
    resignDialogOpen,
    setResignDialogOpen,
    handleResign,
    confirmResign,
  };
}
