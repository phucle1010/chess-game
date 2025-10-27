import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isSelf: boolean;
}

interface ChatPanelProps {
  hideHeader?: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ hideHeader = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Opponent",
      text: "Good luck!",
      timestamp: new Date(),
      isSelf: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      text: inputValue,
      timestamp: new Date(),
      isSelf: true,
    };

    setMessages([...messages, newMessage]);
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSelf ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.isSelf
                      ? "bg-violet-600 text-white"
                      : "bg-slate-700 text-slate-100"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
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
