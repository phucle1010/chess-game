"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/actions/useAuth";
import { useRoom, useRoomPlayers, useLeaveRoom } from "@/actions/useRooms";
import { useGameByRoom } from "@/actions/useGames";
import { useGameState } from "@/hooks/useGameState";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useGameActions } from "@/hooks/useGameActions";
import { useMoveHistory } from "@/hooks/useMoveHistory";
import { useResignGame } from "@/hooks/useResignGame";
import { useSocket } from "@/lib/socket/client";
import { Button } from "@/components/ui/button";
import { ChatWidget } from "@/components/game/ChatWidget";
import { HelpTooltip } from "@/components/game/HelpTooltip";
import { GameHeader } from "@/components/game/GameHeader";
import { GameBoardSection } from "@/components/game/GameBoardSection";
import { GameSidebar } from "@/components/game/GameSidebar";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { ResultModal } from "@/components/modals/ResultModal";
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
import { toast } from "sonner";
import { Flag } from "lucide-react";

function GamePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const { data: user } = useAuth();
  const { data: room } = useRoom(roomId);
  const { data: players = [] } = useRoomPlayers(roomId);
  const { data: game } = useGameByRoom(roomId);
  const { mutate: leaveRoom } = useLeaveRoom();
  const { socket } = useSocket();
  const { chess, makeMove } = useGameState(roomId);
  const { messages, sendChatMessage } = useChatSocket(roomId);
  const { whiteTime, blackTime } = useGameTimer(game);
  const moveHistory = useMoveHistory(chess);

  const gameActions = useGameActions({
    game,
    room,
    roomId,
    user,
    players,
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "lose" | "draw">("win");
  const [legalMovesCount, setLegalMovesCount] = useState(0);
  const hasShownJoinToast = useRef<string | null>(null);

  const { resignDialogOpen, setResignDialogOpen, handleResign, confirmResign } =
    useResignGame({
      game,
      user,
      roomId,
      onResignSuccess: () => {
        setGameResult("lose");
        setResultOpen(true);
      },
    });

  useEffect(() => {
    if (user && socket && !socket.connected) {
      socket.connect();
    }
    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, [user, socket]);

  useEffect(() => {
    if (!socket || !roomId || !user) return;

    const handlePlayerJoinedNotification = (data: {
      userId: string;
      username: string;
      roomId: string;
    }) => {
      // Don't show notification for yourself
      if (data.userId !== user.id) {
        toast.success(`${data.username} joined the room!`);
      }
    };

    socket.on(
      `room:player:joined:notification:${roomId}`,
      handlePlayerJoinedNotification
    );

    return () => {
      socket.off(
        `room:player:joined:notification:${roomId}`,
        handlePlayerJoinedNotification
      );
    };
  }, [socket, roomId, user]);

  useEffect(() => {
    if (
      room &&
      user &&
      players.length > 0 &&
      room.id !== hasShownJoinToast.current
    ) {
      const isUserInRoom = players.some((p) => p.user_id === user.id);
      if (isUserInRoom) {
        hasShownJoinToast.current = room.id;
        if (room.is_bot_room) {
          toast.success(
            `You're in the game room! Bot difficulty: ${room.bot_difficulty || "medium"}`
          );
        } else {
          toast.success(`You're in the game room: ${room.name || "Game Room"}`);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, user?.id, players.length]);

  const handleMove = (from: [number, number], to: [number, number]) => {
    if (!chess || !game || !user) return;

    const fromSquare = `${String.fromCharCode(97 + from[1])}${8 - from[0]}`;
    const toSquare = `${String.fromCharCode(97 + to[1])}${8 - to[0]}`;

    const success = makeMove(fromSquare, toSquare);
    if (!success) {
      toast.error("Invalid move");
    }
  };

  const handleLeaveRoom = () => {
    if (!roomId || !user) return;

    leaveRoom(
      { roomId, userId: user.id },
      {
        onSuccess: () => {
          toast.success("Left room");
          router.push("/rooms");
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error ? error.message : "Failed to leave room";
          toast.error(message);
        },
      }
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Please login to play</p>
          <Button onClick={() => router.push("/auth/login")}>Login</Button>
        </div>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">No room selected</p>
          <Button onClick={() => router.push("/rooms")}>Go to Rooms</Button>
        </div>
      </div>
    );
  }

  const isUserInRoom = players.some((p) => p.user_id === user?.id);
  if (room && room.current_players >= room.max_players && !isUserInRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Room is full</p>
          <Button onClick={() => router.push("/rooms")}>Go to Rooms</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 sm:p-4">
      <GameHeader
        room={room}
        game={game}
        user={user}
        players={players}
        onLeaveRoom={handleLeaveRoom}
        onStartGame={gameActions.handleStartGame}
        onResign={handleResign}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <GameSidebar
            roomId={roomId}
            messages={messages}
            moveHistory={moveHistory}
            userId={user.id}
            onSendMessage={(message) => sendChatMessage(message, user.id)}
          />

          <GameBoardSection
            room={room}
            game={game}
            chess={chess}
            user={user}
            players={players}
            whiteTime={whiteTime}
            blackTime={blackTime}
            legalMovesCount={legalMovesCount}
            onMove={handleMove}
            onLegalMovesChange={setLegalMovesCount}
          />
        </div>
      </div>

      <ChatWidget
        roomId={roomId}
        messages={messages}
        onSendMessage={(message) => sendChatMessage(message, user.id)}
        userId={user.id}
      />

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ResultModal
        open={resultOpen}
        onOpenChange={(open) => {
          if (!open) return;
          setResultOpen(open);
        }}
        result={gameResult}
        onPlayAgain={gameActions.handlePlayAgain}
        onBackToHome={gameActions.handleBackToHome}
      />
      <AlertDialog open={resignDialogOpen} onOpenChange={setResignDialogOpen}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Flag className="h-6 w-6 text-red-400" />
              Resign Game?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-base leading-relaxed">
              Are you sure you want to resign? This will end the game
              immediately and you will lose.
              <span className="block mt-2 font-semibold text-red-400">
                This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResign}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl"
            >
              <Flag className="mr-2 h-4 w-4" />
              Yes, Resign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <HelpTooltip />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="text-white">Loading game...</div>
        </div>
      }
    >
      <GamePageContent />
    </Suspense>
  );
}
