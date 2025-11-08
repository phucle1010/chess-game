import { useState, useEffect } from "react";
import { Game } from "@/types/database";
import { useUpdateGame } from "@/actions/useGames";

export function useGameTimer(game: Game | null | undefined) {
  const { mutate: updateGame } = useUpdateGame();
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  useEffect(() => {
    if (!game || game.status !== "active") {
      if (game) {
        setWhiteTime(game.white_time_remaining);
        setBlackTime(game.black_time_remaining);
      }
      return;
    }

    setWhiteTime(game.white_time_remaining);
    setBlackTime(game.black_time_remaining);

    let lastDbUpdate = Date.now();
    const dbUpdateInterval = 10000;
    let currentWhiteTime = game.white_time_remaining;
    let currentBlackTime = game.black_time_remaining;

    const timer = setInterval(() => {
      const now = Date.now();
      const shouldUpdateDb = now - lastDbUpdate >= dbUpdateInterval;

      if (game.current_turn === "white" && currentWhiteTime > 0) {
        currentWhiteTime -= 1;
        setWhiteTime(currentWhiteTime);

        if (shouldUpdateDb) {
          updateGame({
            gameId: game.id,
            data: {
              white_time_remaining: currentWhiteTime,
            },
          });
          lastDbUpdate = now;
        }
      } else if (game.current_turn === "black" && currentBlackTime > 0) {
        currentBlackTime -= 1;
        setBlackTime(currentBlackTime);

        if (shouldUpdateDb) {
          updateGame({
            gameId: game.id,
            data: {
              black_time_remaining: currentBlackTime,
            },
          });
          lastDbUpdate = now;
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [game, updateGame]);

  return { whiteTime, blackTime };
}
