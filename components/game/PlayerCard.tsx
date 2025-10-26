import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Clock, Crown } from "lucide-react";
import { PieceColor } from "../ChessPiece";

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
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-offset-2 ring-offset-slate-800 ring-slate-600">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback
              className={`${color === "white" ? "bg-slate-100 text-slate-900" : "bg-slate-900 text-white"}`}
            >
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white">{name}</h3>
              {color === "white" && (
                <Crown className="h-4 w-4 text-amber-400" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Rating: {rating}</span>
              <span
                className={`w-3 h-3 rounded-full ${color === "white" ? "bg-slate-100" : "bg-slate-900 ring-1 ring-slate-500"}`}
              />
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isActive
                ? "bg-violet-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Captured Pieces */}
        {capturedPieces.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="flex flex-wrap gap-1">
              {capturedPieces.map((piece, index) => (
                <span key={index} className="text-xl">
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
