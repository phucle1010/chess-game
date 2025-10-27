import { ChessPiece, Piece } from "./ChessPiece";
import { Target } from "lucide-react";

interface ChessSquareProps {
  position: [number, number];
  piece: Piece | null;
  onClick?: () => void;
  isLegalMove?: boolean;
  isSelected?: boolean;
}

export const ChessSquare: React.FC<ChessSquareProps> = ({
  position,
  piece,
  onClick,
  isLegalMove = false,
  isSelected = false,
}) => {
  const [row, col] = position;
  const isLight = (row + col) % 2 === 0;

  const getBgColor = () => {
    if (isSelected) {
      return isLight ? "bg-yellow-300" : "bg-yellow-600";
    }
    if (isLegalMove) {
      return isLight ? "bg-blue-200" : "bg-blue-700";
    }
    return isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]";
  };

  return (
    <div
      onClick={onClick}
      className={`w-full h-full aspect-square flex items-center justify-center ${getBgColor()} transition-all duration-200 relative`}
      style={{
        boxShadow: isLight
          ? "inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.05)"
          : "inset 0 1px 2px rgba(0,0,0,0.2), inset 0 -1px 2px rgba(0,0,0,0.15)",
      }}
    >
      {piece && <ChessPiece piece={piece} />}

      {/* Legal move indicator */}
      {isLegalMove && !piece && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-violet-500/60 ring-2 ring-violet-400/80 animate-pulse" />
        </div>
      )}

      {/* Legal capture indicator */}
      {isLegalMove && piece && (
        <div className="absolute inset-0 border-[3px] border-red-500/70 rounded-sm animate-pulse pointer-events-none">
          <div className="absolute top-0.5 right-0.5">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 drop-shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};
