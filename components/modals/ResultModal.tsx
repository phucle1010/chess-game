import { Trophy, Medal, Award } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: "win" | "lose" | "draw";
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  open,
  onOpenChange,
  result,
  onPlayAgain,
  onBackToHome,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const getResultConfig = () => {
    switch (result) {
      case "win":
        return {
          title: "Victory!",
          description: "Congratulations! You won the game.",
          icon: Trophy,
          iconColor: "text-yellow-400",
          bgGradient: "from-yellow-500/20 to-amber-500/20",
          points: "+25",
        };
      case "lose":
        return {
          title: "Defeat",
          description: "Better luck next time!",
          icon: Medal,
          iconColor: "text-slate-400",
          bgGradient: "from-slate-500/20 to-slate-600/20",
          points: "-10",
        };
      case "draw":
        return {
          title: "Draw",
          description: "The game ended in a draw.",
          icon: Award,
          iconColor: "text-blue-400",
          bgGradient: "from-blue-500/20 to-cyan-500/20",
          points: "+5",
        };
    }
  };

  const config = getResultConfig();
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent
        className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl text-white sm:max-w-[400px] [&>button]:hidden"
        onInteractOutside={(e) => {
          // Prevent closing by clicking outside
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with Escape key
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <div
            className={`flex justify-center mb-4 py-6 bg-gradient-to-br ${config.bgGradient} rounded-lg transition-all duration-1000 ${
              isAnimating
                ? "scale-110 rotate-12 animate-pulse"
                : "scale-100 rotate-0"
            }`}
          >
            <Icon
              className={`h-20 w-20 ${config.iconColor} transition-all duration-500 ${
                isAnimating ? "animate-bounce" : ""
              }`}
            />
          </div>
          <DialogTitle
            className={`text-center text-2xl transition-all duration-500 ${
              isAnimating ? "scale-105" : "scale-100"
            }`}
          >
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl text-white">{config.points}</p>
              <p className="text-xs text-slate-400 mt-1">Rating</p>
            </div>
            <div className="text-center border-x border-slate-700">
              <p className="text-2xl text-white">32</p>
              <p className="text-xs text-slate-400 mt-1">Moves</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-white">15:42</p>
              <p className="text-xs text-slate-400 mt-1">Duration</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <Button onClick={onPlayAgain} variant="gradient" className="w-full">
              Play Again
            </Button>
            <Button onClick={onBackToHome} variant="dark" className="w-full">
              Back to Home
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
