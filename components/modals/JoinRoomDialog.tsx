"use client";

import { useState } from "react";
import { Play, Users, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (
    playWithBot: boolean,
    botDifficulty: "easy" | "medium" | "hard"
  ) => void;
  isJoining: boolean;
}

export function JoinRoomDialog({
  open,
  onOpenChange,
  onJoin,
  isJoining,
}: JoinRoomDialogProps) {
  const [playWithBot, setPlayWithBot] = useState(false);
  const [botDifficulty, setBotDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");

  const handleJoin = () => {
    onJoin(playWithBot, botDifficulty);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPlayWithBot(false);
      setBotDifficulty("medium");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <Button variant="dark" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleJoin} variant="gradient" disabled={isJoining}>
            {isJoining ? (
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
  );
}
