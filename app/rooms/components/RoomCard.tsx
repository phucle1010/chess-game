"use client";

import { Play, Users, Bot, Trash2 } from "lucide-react";
import { Room } from "@/types/database";
import { User } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoomCardProps {
  room: Room;
  user: User | null;
  onJoin: (roomId: string) => void;
  onDelete: (room: { id: string; name: string }) => void;
}

export function RoomCard({ room, user, onJoin, onDelete }: RoomCardProps) {
  const isUserInRoom = user?.id === room.host_id;
  const canDelete = isUserInRoom && room.current_players === 0;

  return (
    <Card className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle className="text-white">{room.name}</CardTitle>
        <CardDescription className="text-slate-400">
          {room.is_bot_room ? (
            <>
              <Bot className="inline mr-2 h-4 w-4 text-purple-400" />
              Bot Game ({room.bot_difficulty || "medium"})
            </>
          ) : (
            <>
              <Users className="inline mr-2 h-4 w-4 text-indigo-400" />
              {room.current_players} / {room.max_players} players
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {room.status === "finished" ? (
            <Button
              onClick={() => onJoin(room.id)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Play className="mr-2 h-4 w-4" />
              Restart Room
            </Button>
          ) : room.status === "active" &&
            room.current_players >= room.max_players ? (
            <div className="text-sm text-slate-400 text-center">
              Game in progress (Full)
            </div>
          ) : room.current_players >= room.max_players ? (
            <div className="text-sm text-slate-400 text-center">Room Full</div>
          ) : (
            <Button
              onClick={() => onJoin(room.id)}
              variant="gradient"
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" />
              Join Room
            </Button>
          )}

          {canDelete && (
            <Button
              onClick={() => onDelete({ id: room.id, name: room.name })}
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-600/20 hover:border-red-500 hover:text-red-300 transition-all duration-200"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Room
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
