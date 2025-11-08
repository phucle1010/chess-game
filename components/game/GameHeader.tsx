"use client";

import { ArrowLeft, Settings, Flag, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Room, Game, User } from "@/types/database";

interface GameHeaderProps {
  room: Room | null | undefined;
  game: Game | null | undefined;
  user: User | null;
  players: Array<{ user_id: string; color: string | null }>;
  onLeaveRoom: () => void;
  onStartGame: () => void;
  onResign: () => void;
  onOpenSettings: () => void;
}

export function GameHeader({
  room,
  game,
  user,
  players,
  onLeaveRoom,
  onStartGame,
  onResign,
  onOpenSettings,
}: GameHeaderProps) {
  return (
    <div className="max-w-[1800px] mx-auto mb-2 sm:mb-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={onLeaveRoom}
          variant="ghost"
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Leave Game
        </Button>

        <div className="flex gap-2">
          {!game && room && room.host_id === user?.id && (
            <Button
              onClick={onStartGame}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={
                (room.is_bot_room && players.length < 1) ||
                (!room.is_bot_room && players.length < 2)
              }
            >
              <Play className="mr-2 h-4 w-4" />
              Start Game
            </Button>
          )}
          {game && (game.status === "active" || game.status === "waiting") && (
            <Button
              onClick={onResign}
              variant="outline"
              className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Flag className="mr-2 h-4 w-4" />
              Resign
            </Button>
          )}
          <Button
            onClick={onOpenSettings}
            variant="outline"
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
