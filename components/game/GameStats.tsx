import { Activity, Target, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface GameStatsProps {
  legalMovesCount?: number;
  movesPlayed: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  legalMovesCount = 0,
  movesPlayed,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <Card className="bg-slate-800/80 border-slate-700">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl text-white">{movesPlayed}</p>
              <p className="text-xs text-slate-400">Moves</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/80 border-slate-700">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl text-white">
                {legalMovesCount}
              </p>
              <p className="text-xs text-slate-400">Legal Moves</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/80 border-slate-700">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            <div className="text-center">
              <p className="text-xl sm:text-2xl text-white">
                {legalMovesCount > 0 ? "✓" : "-"}
              </p>
              <p className="text-xs text-slate-400">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
