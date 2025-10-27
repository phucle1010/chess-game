import { Clock, Crown } from "lucide-react";

import { PieceColor } from "@/types/chess-piece";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface PlayerCardProps {
  name: string;
  rating: number;
  avatar?: string;
  color: PieceColor;
  timeRemaining: number;
  isActive: boolean;
  capturedPieces?: string[];
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  rating,
  avatar,
  color,
  timeRemaining,
  isActive,
  capturedPieces = [],
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card
      className={`${isActive ? "ring-2 ring-violet-500 shadow-lg shadow-violet-500/50" : ""} bg-slate-800/80 border-slate-700 transition-all`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-offset-2 ring-offset-slate-800 ring-slate-600">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback
              className={`${color === "white" ? "bg-slate-100 text-slate-900" : "bg-slate-900 text-white"}`}
            >
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white text-sm sm:text-base truncate">
                {name}
              </h3>
              {color === "white" && (
                <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
              <span className="truncate">Rating: {rating}</span>
              <span
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${color === "white" ? "bg-slate-100" : "bg-slate-900 ring-1 ring-slate-500"}`}
              />
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-shrink-0 ${
              isActive
                ? "bg-violet-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="font-mono text-xs sm:text-sm">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Captured Pieces */}
        {capturedPieces.length > 0 && (
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-700">
            <div className="flex flex-wrap gap-1">
              {capturedPieces.map((piece, index) => (
                <span key={index} className="text-lg sm:text-xl">
                  {piece}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
