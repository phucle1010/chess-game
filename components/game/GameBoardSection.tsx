"use client";

import { Chess } from "chess.js";
import { ChessBoard3D } from "@/components/game/ChessBoard3D";
import { PlayerCard } from "@/components/game/PlayerCard";
import { GameStats } from "@/components/game/GameStats";
import { Room, Game, User } from "@/types/database";

interface GameBoardSectionProps {
  room: Room | null | undefined;
  game: Game | null | undefined;
  chess: Chess | null;
  user: User | null;
  players: Array<{ user_id: string; color: string | null; user?: User }>;
  whiteTime: number;
  blackTime: number;
  legalMovesCount: number;
  onMove: (from: [number, number], to: [number, number]) => void;
  onLegalMovesChange?: (count: number) => void;
}

export function GameBoardSection({
  room,
  game,
  chess,
  user,
  players,
  whiteTime,
  blackTime,
  legalMovesCount,
  onMove,
  onLegalMovesChange,
}: GameBoardSectionProps) {
  const whitePlayer = players.find((p) => p.color === "white");
  const blackPlayer = players.find((p) => p.color === "black");

  const isActive =
    (whitePlayer?.user_id === user?.id && game?.current_turn === "white") ||
    (blackPlayer?.user_id === user?.id && game?.current_turn === "black");

  return (
    <div className="flex flex-col gap-4 lg:gap-6 lg:flex-1 order-1 lg:order-2 min-w-0">
      <PlayerCard
        name={
          game?.is_bot_game && game.bot_color === "black"
            ? `Bot (${game.bot_difficulty || "medium"})`
            : blackPlayer?.user?.username || "Waiting..."
        }
        rating={blackPlayer?.user?.rating || 1200}
        color="black"
        timeRemaining={blackTime}
        isActive={game?.current_turn === "black"}
        capturedPieces={[]}
      />

      <GameStats
        legalMovesCount={legalMovesCount}
        movesPlayed={chess ? chess.history().length : 0}
        isActive={isActive}
      />

      <div className="flex justify-center px-2 py-4 lg:px-4 lg:py-8">
        {!room ? (
          <div className="text-white">Loading room...</div>
        ) : !game ? (
          <div className="text-center text-white space-y-4">
            {room.host_id === user?.id ? (
              <>
                <p className="text-lg">
                  {room.is_bot_room
                    ? "Click &apos;Start Game&apos; button to begin"
                    : players.length < 2
                      ? "Waiting for another player..."
                      : "Click &apos;Start Game&apos; button to begin"}
                </p>
              </>
            ) : (
              <p className="text-lg">Waiting for host to start the game...</p>
            )}
          </div>
        ) : !chess ? (
          <div className="text-white">Initializing board...</div>
        ) : (
          <ChessBoard3D
            fen={game.fen}
            onMove={(from, to) => onMove(from, to)}
            currentTurn={game.current_turn || "white"}
            onCapture={() => {}}
            onLegalMovesChange={onLegalMovesChange}
            chess={chess}
          />
        )}
      </div>

      <PlayerCard
        name={
          game?.is_bot_game && game.bot_color === "white"
            ? `Bot (${game.bot_difficulty || "medium"})`
            : whitePlayer?.user?.username || "Waiting..."
        }
        rating={whitePlayer?.user?.rating || 1200}
        color="white"
        timeRemaining={whiteTime}
        isActive={game?.current_turn === "white"}
        capturedPieces={[]}
      />
    </div>
  );
}
