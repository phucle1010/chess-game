import { Lightbulb } from "lucide-react";

interface MoveIndicatorProps {
  show: boolean;
  pieceName?: string;
}

export const MoveIndicator: React.FC<MoveIndicatorProps> = ({
  show,
  pieceName,
}) => {
  if (!show) return null;

  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 animate-in fade-in slide-in-from-top-2 duration-300 w-full max-w-sm px-4">
      <div className="bg-violet-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 border-2 border-violet-400">
        <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 animate-pulse flex-shrink-0" />
        <span className="text-sm sm:text-base text-center">
          {pieceName ? `${pieceName} - ` : ""}Click to move
        </span>
      </div>
    </div>
  );
};
