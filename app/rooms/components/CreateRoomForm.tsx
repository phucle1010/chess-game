"use client";

import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateRoomFormProps {
  roomName: string;
  onRoomNameChange: (name: string) => void;
  onCreateRoom: () => void;
  isCreating: boolean;
}

export function CreateRoomForm({
  roomName,
  onRoomNameChange,
  onCreateRoom,
  isCreating,
}: CreateRoomFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap items-end">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="room-name" className="text-white mb-2 block">
            Room Name
          </Label>
          <Input
            id="room-name"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => onRoomNameChange(e.target.value)}
          />
        </div>
        <Button onClick={onCreateRoom} variant="gradient" disabled={isCreating}>
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Room
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
