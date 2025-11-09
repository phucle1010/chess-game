"use client";

import { Users } from "lucide-react";
import { Room } from "@/types/database";
import { User } from "@/types/database";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoomCard } from "./RoomCard";

interface RoomListProps {
  rooms: Room[];
  isLoading: boolean;
  user: User | null;
  onJoin: (roomId: string) => void;
  onDelete: (room: { id: string; name: string }) => void;
}

export function RoomList({
  rooms,
  isLoading,
  user,
  onJoin,
  onDelete,
}: RoomListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card
            key={index}
            className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-xl animate-pulse"
          >
            <CardHeader>
              <div className="h-6 bg-slate-700/50 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-700/30 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-slate-700/40 rounded w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl rounded-2xl p-12 max-w-md w-full text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
              <Users className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">
                No Rooms Available
              </h3>
              <p className="text-slate-400">
                Be the first to create a room and start playing!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          user={user}
          onJoin={onJoin}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
