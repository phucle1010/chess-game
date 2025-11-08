"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { ChatMessage } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatPanelProps {
  hideHeader?: boolean;
  roomId: string | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  userId: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  hideHeader = false,
  messages,
  onSendMessage,
  userId,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Card className="bg-transparent border-0 h-full flex flex-col">
      {!hideHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Chat</CardTitle>
        </CardHeader>
      )}
      <CardContent className="flex-1 flex flex-col gap-3 p-4 pt-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {messages.map((message) => {
              const isSelf = message.user_id === userId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      isSelf
                        ? "bg-violet-600 text-white"
                        : "bg-slate-700 text-slate-100"
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1 opacity-90">
                      {message.user?.username || "Anonymous"}
                    </p>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
