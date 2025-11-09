"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import { useGameByRoom, useUpdateGame } from "@/actions/useGames";
import { useSocket } from "@/lib/socket/client";
import { gameService } from "@/services/client/game.service";
import { useQueryClient } from "@tanstack/react-query";

export function useGameState(roomId: string | null, userId?: string | null) {
  const { data: game } = useGameByRoom(roomId);
  const { mutate: updateGame } = useUpdateGame();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [chess, setChess] = useState<Chess | null>(null);
  const [isMyTurn] = useState(false);
  const botMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const botMoveInProgressRef = useRef<boolean>(false); // Prevent multiple simultaneous bot moves
  const botMoveStartTimeRef = useRef<number | null>(null); // Track when bot move started

  // Initialize chess instance when game data changes
  useEffect(() => {
    if (game && game.id) {
      try {
        // Use game FEN if available, otherwise use default starting position
        const fen =
          game.fen ||
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        const chessInstance = new Chess(fen);
        setChess(chessInstance);
      } catch (error) {
        console.error("Error initializing chess:", error);
        // Fallback to default position
        try {
          const chessInstance = new Chess();
          setChess(chessInstance);
        } catch (fallbackError) {
          console.error(
            "Error initializing chess with default position:",
            fallbackError
          );
        }
      }
    } else {
      // Explicitly reset to null when no game exists
      setChess(null);
    }
  }, [game?.id, game?.fen]); // Only depend on game ID and FEN to avoid unnecessary resets

  // Handle bot moves automatically
  useEffect(() => {
    if (!game || !chess || !game.is_bot_game || game.status !== "active") {
      if (botMoveTimeoutRef.current) {
        clearTimeout(botMoveTimeoutRef.current);
        botMoveTimeoutRef.current = null;
      }
      botMoveInProgressRef.current = false;
      botMoveStartTimeRef.current = null;
      return;
    }

    // Check if flag is stuck (been true for too long)
    if (botMoveInProgressRef.current && botMoveStartTimeRef.current) {
      const timeSinceStart = Date.now() - botMoveStartTimeRef.current;
      if (timeSinceStart > 1000) {
        // If stuck for more than 1 second, reset
        console.warn(
          "Bot move flag stuck for",
          timeSinceStart,
          "ms, resetting..."
        );
        botMoveInProgressRef.current = false;
        botMoveStartTimeRef.current = null;
        if (botMoveTimeoutRef.current) {
          clearTimeout(botMoveTimeoutRef.current);
          botMoveTimeoutRef.current = null;
        }
      } else {
        // Still in progress, wait
        return;
      }
    }

    // Prevent multiple simultaneous bot move calls
    if (botMoveInProgressRef.current) {
      return;
    }

    // Check if it's the bot's turn
    // Use chess instance as primary source, game.current_turn as secondary check
    const chessTurn = chess.turn(); // 'w' or 'b'

    // Primary check: use chess instance turn (most reliable)
    const isBotTurnByChess =
      (game.bot_color === "white" && chessTurn === "w") ||
      (game.bot_color === "black" && chessTurn === "b");

    if (isBotTurnByChess && !chess.isGameOver()) {
      // Clear any existing timeout
      if (botMoveTimeoutRef.current) {
        clearTimeout(botMoveTimeoutRef.current);
      }

      // Set flag to prevent multiple calls
      botMoveInProgressRef.current = true;
      botMoveStartTimeRef.current = Date.now();

      // Make bot move immediately for faster response
      botMoveTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await gameService.makeBotMove(game.id);

          if (result.game) {
            // Update local chess instance with new FEN immediately
            try {
              const updatedChess = new Chess(result.game.fen);
              setChess(updatedChess);
            } catch (error) {
              console.error(
                "Error updating chess instance after bot move:",
                error
              );
            }

            // Emit socket event for real-time updates
            if (socket) {
              socket.emit("game:move", {
                roomId,
                from: result.move.from,
                to: result.move.to,
                promotion: result.move.promotion,
              });
            }

            // Update game cache directly - this will trigger the useEffect again
            // but the botMoveInProgressRef flag will prevent duplicate calls
            queryClient.setQueryData(["games", "room", roomId], result.game);
            queryClient.setQueryData(["games", result.game.id], result.game);
          }
        } catch (error: unknown) {
          console.error("Error making bot move:", error);
        } finally {
          // Reset flag immediately after bot move completes (no delay)
          botMoveInProgressRef.current = false;
          botMoveStartTimeRef.current = null;
        }
      }, 50); // Minimal delay for smooth UX (50ms)
    } else {
      // Not bot's turn, reset flag
      botMoveInProgressRef.current = false;
      botMoveStartTimeRef.current = null;
    }

    return () => {
      if (botMoveTimeoutRef.current) {
        clearTimeout(botMoveTimeoutRef.current);
        botMoveTimeoutRef.current = null;
      }
      // Reset flag if effect is cleaning up and move hasn't completed
      // This prevents the flag from getting stuck when component unmounts or game changes
      if (botMoveInProgressRef.current) {
        const timeSinceStart = botMoveStartTimeRef.current
          ? Date.now() - botMoveStartTimeRef.current
          : 0;
        if (timeSinceStart > 100) {
          // Only reset if it's been more than 100ms (allow normal completion)
          botMoveInProgressRef.current = false;
          botMoveStartTimeRef.current = null;
        }
      }
    };
  }, [game, chess, socket, roomId, queryClient]);

  // Safety mechanism: Reset botMoveInProgress flag if it's been stuck for too long
  // Check more frequently (every 500ms) for faster recovery
  useEffect(() => {
    if (!game || !game.is_bot_game) {
      // Reset flag immediately if not a bot game
      botMoveInProgressRef.current = false;
      botMoveStartTimeRef.current = null;
      if (botMoveTimeoutRef.current) {
        clearTimeout(botMoveTimeoutRef.current);
        botMoveTimeoutRef.current = null;
      }
      return;
    }

    // Check every 500ms if flag is stuck
    const safetyInterval = setInterval(() => {
      if (botMoveInProgressRef.current && botMoveStartTimeRef.current) {
        const timeSinceStart = Date.now() - botMoveStartTimeRef.current;
        if (timeSinceStart > 800) {
          // Reset if stuck for more than 800ms
          console.warn(
            "Bot move flag stuck for",
            timeSinceStart,
            "ms, resetting..."
          );
          botMoveInProgressRef.current = false;
          botMoveStartTimeRef.current = null;
          // Clear any pending timeout as well
          if (botMoveTimeoutRef.current) {
            clearTimeout(botMoveTimeoutRef.current);
            botMoveTimeoutRef.current = null;
          }
        }
      }
    }, 500); // Check every 500ms

    return () => clearInterval(safetyInterval);
  }, [game?.id, game?.fen, game?.is_bot_game]);

  // Listen for move events from socket
  useEffect(() => {
    if (!socket || !roomId || !game) return;

    const handleMove = (data: {
      from: string;
      to: string;
      promotion?: string;
    }) => {
      console.log("Received move event from socket:", data);

      // Don't process moves if we already have the latest game state
      // The game will be refetched and chess instance will update from FEN
      // This prevents double-processing moves
      if (chess) {
        try {
          // Check if this move is already in the current position
          const currentFen = chess.fen();
          const testChess = new Chess(currentFen);
          const move = testChess.move({
            from: data.from,
            to: data.to,
            promotion: data.promotion || "q",
          });

          if (move) {
            // Only update if the move results in a different FEN
            // This means it's a new move we haven't processed
            const newFen = testChess.fen();
            if (newFen !== currentFen) {
              console.log("Processing new move from socket");
              setChess(testChess);
              // Game will be updated by the server, just sync local state
            }
          }
        } catch (error) {
          // Move might already be applied, that's okay
          console.log("Move from socket may already be applied:", error);
        }
      }
    };

    socket.on(`game:move:${roomId}`, handleMove);

    return () => {
      socket.off(`game:move:${roomId}`, handleMove);
    };
  }, [socket, roomId, chess, game]);

  const makeMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (!chess || !game || !socket || !roomId || !userId) return false;

      try {
        // Create a copy of the chess instance to make the move
        const chessCopy = new Chess(chess.fen());
        const move = chessCopy.move({
          from,
          to,
          promotion: promotion || "q",
        });

        if (move) {
          const newFen = chessCopy.fen();
          const newPgn = chessCopy.pgn();
          const newTurn = chessCopy.turn() === "w" ? "white" : "black";

          console.log("Player move made:", {
            from,
            to,
            newFen,
            newTurn,
            isBotGame: game.is_bot_game,
            botColor: game.bot_color,
          });

          // Update local chess instance immediately
          setChess(chessCopy);

          // Emit move to socket
          socket.emit("game:move", {
            roomId,
            from,
            to,
            promotion: promotion || "q",
          });

          // Check for game end conditions
          let gameStatus: "active" | "waiting" | "finished" | "abandoned" =
            game.status;
          let winnerId: string | null = game.winner_id;

          if (chessCopy.isCheckmate()) {
            // The player who made the move wins (they checkmated the opponent)
            gameStatus = "finished";
            winnerId = userId || null;
          } else if (chessCopy.isStalemate()) {
            // Stalemate - draw
            gameStatus = "finished";
            winnerId = null;
          } else if (chessCopy.isDraw()) {
            // Draw (threefold repetition, insufficient material, etc.)
            gameStatus = "finished";
            winnerId = null;
          }

          // Update game in database
          updateGame(
            {
              gameId: game.id,
              data: {
                fen: newFen,
                pgn: newPgn,
                current_turn: newTurn,
                status: gameStatus,
                winner_id: winnerId,
              },
            },
            {
              onSuccess: (updatedGame) => {
                console.log(
                  "Game updated, bot should move next if it's their turn",
                  {
                    newTurn,
                    botColor: updatedGame.bot_color,
                    isBotTurn:
                      (updatedGame.bot_color === "white" &&
                        newTurn === "white") ||
                      (updatedGame.bot_color === "black" &&
                        newTurn === "black"),
                    gameStatus: updatedGame.status,
                  }
                );
                // Force refetch to ensure everything is in sync
                // The bot move check will run when game updates
              },
            }
          );

          return true;
        }
      } catch (error) {
        console.error("Invalid move:", error);
      }

      return false;
    },
    [chess, game, socket, roomId, updateGame, userId]
  );

  return {
    game,
    chess,
    makeMove,
    isMyTurn,
  };
}
