"use client";

import { ChatPanel } from "@/components/game/ChatPanel";
import { MoveHistory } from "@/components/game/MoveHistory";
import { PieceGuide } from "@/components/game/PieceGuide";
import { ChatMessage } from "@/types/database";

interface GameSidebarProps {
  roomId: string | null;
  messages: ChatMessage[];
  moveHistory: string[];
  userId: string;
  onSendMessage: (message: string) => void;
}

export function GameSidebar({
  roomId,
  messages,
  moveHistory,
  userId,
  onSendMessage,
}: GameSidebarProps) {
  return (
    <div className="w-full lg:w-80 xl:w-96 space-y-4 lg:space-y-6 order-2 lg:order-1">
      <div className="hidden xl:block">
        <ChatPanel
          roomId={roomId}
          messages={messages}
          onSendMessage={onSendMessage}
          userId={userId}
        />
      </div>
      <MoveHistory moves={moveHistory} />
      <div className="grid gap-4">
        <PieceGuide />
      </div>
    </div>
  );
}
