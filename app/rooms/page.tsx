"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Users,
  Play,
  Bot,
  Trash2,
  Loader2,
  ArrowLeft,
} from "lucide-react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RoomsPage() {
  const router = useRouter();
  const { data: user } = useAuth();
  const { data: rooms = [], isLoading } = useRooms();
  const { mutate: createRoom, isPending: isCreatingRoom } = useCreateRoom();
  const { mutate: joinRoom, isPending: isJoiningRoom } = useJoinRoom();
  const { mutate: deleteRoom, isPending: isDeletingRoom } = useDeleteRoom();
  const [roomName, setRoomName] = useState("");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [playWithBot, setPlayWithBot] = useState(false);
  const [botDifficulty, setBotDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");
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
          setRoomName(""); // Clear input
          // Don't redirect - stay on rooms page
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
    setPlayWithBot(false);
    setBotDifficulty("medium");
  };

  const handleJoinRoom = () => {
    if (!user || !selectedRoomId) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    console.log("Joining room with options:", {
      roomId: selectedRoomId,
      playWithBot,
      botDifficulty,
    });

    joinRoom(
      { roomId: selectedRoomId, userId: user.id, playWithBot, botDifficulty },
      {
        onSuccess: (result) => {
          console.log("Join room success:", {
            roomIsBot: result.room?.is_bot_room,
            botDifficulty: result.room?.bot_difficulty,
          });
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
          console.error("Join room error:", error);
          toast.error(error.message || "Failed to join room");
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
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreateRoom}
                variant="gradient"
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? (
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
        </div>

        {isLoading ? (
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
        ) : rooms.length === 0 ? (
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
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
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
                        onClick={() => handleJoinRoomClick(room.id)}
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
                      <div className="text-sm text-slate-400 text-center">
                        Room Full
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleJoinRoomClick(room.id)}
                        variant="gradient"
                        className="w-full"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Join Room
                      </Button>
                    )}

                    {/* Delete button for host when room is empty */}
                    {user?.id === room.host_id &&
                      room.current_players === 0 && (
                        <Button
                          onClick={() => {
                            setRoomToDelete({ id: room.id, name: room.name });
                            setDeleteDialogOpen(true);
                          }}
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
            ))}
          </div>
        )}
      </div>

      {/* Join Room Dialog */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Play className="h-5 w-5 text-purple-400" />
              Join Room
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-base">
              Choose how you want to play this game
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Play Mode Selection Cards */}
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setPlayWithBot(false)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                  !playWithBot
                    ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800/70"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !playWithBot
                      ? "border-purple-400 bg-purple-500"
                      : "border-slate-500"
                  }`}
                >
                  {!playWithBot && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-indigo-500/20">
                    <Users className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <Label
                      htmlFor="wait-player"
                      className="text-white font-semibold cursor-pointer block"
                    >
                      Wait for Real Player
                    </Label>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Play against another human player
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPlayWithBot(true)}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                  playWithBot
                    ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800/70"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    playWithBot
                      ? "border-purple-400 bg-purple-500"
                      : "border-slate-500"
                  }`}
                >
                  {playWithBot && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Bot className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <Label
                      htmlFor="play-bot"
                      className="text-white font-semibold cursor-pointer block"
                    >
                      Play with Bot
                    </Label>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Challenge an AI opponent
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Bot Difficulty Selection */}
            {playWithBot && (
              <div className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label
                  htmlFor="bot-difficulty"
                  className="text-slate-300 font-medium flex items-center gap-2"
                >
                  <Bot className="h-4 w-4 text-purple-400" />
                  Bot Difficulty
                </Label>
                <Select
                  value={botDifficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") =>
                    setBotDifficulty(value)
                  }
                >
                  <SelectTrigger
                    id="bot-difficulty"
                    className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem
                      value="easy"
                      className="text-white hover:bg-slate-700 focus:bg-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-green-400">●</span>
                        Easy
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      className="text-white hover:bg-slate-700 focus:bg-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        Medium
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="hard"
                      className="text-white hover:bg-slate-700 focus:bg-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-red-400">●</span>
                        Hard
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="dark" onClick={() => setJoinDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleJoinRoom}
              variant="gradient"
              disabled={isJoiningRoom}
            >
              {isJoiningRoom ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Join Room
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Room Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              Delete Room
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete the room &quot;
              {roomToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (roomToDelete && user) {
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
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeletingRoom}
            >
              {isDeletingRoom ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
