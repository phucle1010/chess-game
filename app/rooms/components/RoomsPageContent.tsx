"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import {
  useRooms,
  useCreateRoom,
  useJoinRoom,
  useDeleteRoom,
} from "@/actions/useRooms";
import { useAuth } from "@/actions/useAuth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JoinRoomDialog } from "@/components/modals/JoinRoomDialog";
import { DeleteRoomDialog } from "@/components/modals/DeleteRoomDialog";

import { CreateRoomForm } from "./CreateRoomForm";
import { RoomList } from "./RoomList";

export function RoomsPageContent() {
  const router = useRouter();
  const { data: user } = useAuth();
  const { data: rooms = [], isLoading } = useRooms();
  const { mutate: createRoom, isPending: isCreatingRoom } = useCreateRoom();
  const { mutate: joinRoom, isPending: isJoiningRoom } = useJoinRoom();
  const { mutate: deleteRoom, isPending: isDeletingRoom } = useDeleteRoom();
  const [roomName, setRoomName] = useState("");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleCreateRoom = () => {
    if (!user) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    createRoom(
      {
        name: roomName,
        host_id: user.id,
        max_players: 2,
      },
      {
        onSuccess: () => {
          toast.success("Room created!");
          setRoomName("");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to create room");
        },
      }
    );
  };

  const handleJoinRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
    setJoinDialogOpen(true);
  };

  const handleJoinRoom = (
    playWithBot: boolean,
    botDifficulty: "easy" | "medium" | "hard"
  ) => {
    if (!user || !selectedRoomId) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    joinRoom(
      { roomId: selectedRoomId, userId: user.id, playWithBot, botDifficulty },
      {
        onSuccess: (result) => {
          setJoinDialogOpen(false);
          if (playWithBot) {
            toast.success(`Joined bot game (${botDifficulty} difficulty)!`);
          } else {
            toast.success(
              `Successfully joined room: ${result.room?.name || "Game Room"}!`
            );
          }
          router.push(`/game?roomId=${selectedRoomId}`);
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to join room");
        },
      }
    );
  };

  const handleDeleteRoom = () => {
    if (!roomToDelete || !user) return;

    deleteRoom(
      { roomId: roomToDelete.id, userId: user.id },
      {
        onSuccess: () => {
          toast.success("Room deleted successfully");
          setDeleteDialogOpen(false);
          setRoomToDelete(null);
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to delete room");
        },
      }
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please Login</CardTitle>
            <CardDescription>
              You need to be logged in to view rooms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-purple-200 hover:text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Chess Rooms
          </h1>
          <CreateRoomForm
            roomName={roomName}
            onRoomNameChange={setRoomName}
            onCreateRoom={handleCreateRoom}
            isCreating={isCreatingRoom}
          />
        </div>

        <RoomList
          rooms={rooms}
          isLoading={isLoading}
          user={user}
          onJoin={handleJoinRoomClick}
          onDelete={(room) => {
            setRoomToDelete(room);
            setDeleteDialogOpen(true);
          }}
        />
      </div>

      <JoinRoomDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onJoin={handleJoinRoom}
        isJoining={isJoiningRoom}
      />

      <DeleteRoomDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteRoom}
        roomName={roomToDelete?.name || ""}
        isDeleting={isDeletingRoom}
      />
    </div>
  );
}
