"use client";

import { useState } from "react";
import { MessageCircle, X, Minus } from "lucide-react";
import { ChatMessage } from "@/types/database";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { ChatPanel } from "./ChatPanel";

interface ChatWidgetProps {
  roomId: string;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  userId: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  roomId,
  messages,
  onSendMessage,
  userId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/50 transition-all duration-300 hover:scale-110 xl:hidden"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {messages.length}
          </span>
        )}
      </Button>

      {/* Chat Panel Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 xl:hidden",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Chat Panel Slider */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 w-full max-w-md xl:hidden",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[70vh] max-h-[600px] overflow-hidden rounded-t-xl shadow-2xl bg-slate-800/95 backdrop-blur-sm">
          {/* Drag Handle */}
          <div className="flex items-center justify-center py-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
          </div>

          {/* Chat Header */}
          <div className="px-4 pb-2 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Chat</h3>
              <Button
                onClick={() => setIsOpen(false)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-400 hover:text-white"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="h-[calc(70vh-80px)] overflow-hidden">
            <ChatPanel
              hideHeader={true}
              roomId={roomId}
              messages={messages}
              onSendMessage={onSendMessage}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </>
  );
};
