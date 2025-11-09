"use client";

import { Star, Trophy, X, Minus, Target, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserStats {
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
  winRate: number;
}

interface UserStatisticsProps {
  stats: UserStats;
}

export function UserStatistics({ stats }: UserStatisticsProps) {
  return (
    <Card className="mb-8 bg-gradient-to-br from-white/5 via-white/8 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-900/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5 pointer-events-none" />
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/15 border border-amber-500/20 shadow-lg shadow-amber-500/10">
            <TrendingUp className="h-4 w-4 text-amber-300" />
          </div>
          <div>
            <CardTitle className="text-white text-xl font-semibold tracking-tight">
              Your Statistics
            </CardTitle>
            <CardDescription className="text-purple-200/60 text-sm mt-0.5">
              Track your chess performance and progress
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Rating Stat */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/15 via-amber-600/10 to-amber-500/8 border border-amber-500/20 hover:border-amber-400/30 hover:bg-gradient-to-br hover:from-amber-500/20 hover:via-amber-600/15 hover:to-amber-500/12 transition-all duration-500 p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-600/0 group-hover:from-amber-500/5 group-hover:to-amber-600/3 transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/25 to-amber-600/20 border border-amber-500/25 shadow-sm">
                  <Star className="h-3.5 w-3.5 text-amber-300" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl md:text-3xl font-bold text-amber-300 tracking-tight">
                  {stats.rating}
                </div>
                <div className="text-[10px] md:text-xs text-purple-200/50 font-medium uppercase tracking-wider">
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Wins Stat */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/15 via-emerald-600/10 to-green-500/8 border border-green-500/20 hover:border-green-400/30 hover:bg-gradient-to-br hover:from-green-500/20 hover:via-emerald-600/15 hover:to-green-500/12 transition-all duration-500 p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-600/0 group-hover:from-green-500/5 group-hover:to-emerald-600/3 transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-500/25 to-emerald-600/20 border border-green-500/25 shadow-sm">
                  <Trophy className="h-3.5 w-3.5 text-green-300" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl md:text-3xl font-bold text-green-300 tracking-tight">
                  {stats.wins}
                </div>
                <div className="text-[10px] md:text-xs text-purple-200/50 font-medium uppercase tracking-wider">
                  Wins
                </div>
              </div>
            </div>
          </div>

          {/* Losses Stat */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/15 via-rose-600/10 to-red-500/8 border border-red-500/20 hover:border-red-400/30 hover:bg-gradient-to-br hover:from-red-500/20 hover:via-rose-600/15 hover:to-red-500/12 transition-all duration-500 p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-rose-600/0 group-hover:from-red-500/5 group-hover:to-rose-600/3 transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-red-500/25 to-rose-600/20 border border-red-500/25 shadow-sm">
                  <X className="h-3.5 w-3.5 text-red-300" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl md:text-3xl font-bold text-red-300 tracking-tight">
                  {stats.losses}
                </div>
                <div className="text-[10px] md:text-xs text-purple-200/50 font-medium uppercase tracking-wider">
                  Losses
                </div>
              </div>
            </div>
          </div>

          {/* Draws Stat */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/15 via-cyan-600/10 to-blue-500/8 border border-blue-500/20 hover:border-blue-400/30 hover:bg-gradient-to-br hover:from-blue-500/20 hover:via-cyan-600/15 hover:to-blue-500/12 transition-all duration-500 p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-600/0 group-hover:from-blue-500/5 group-hover:to-cyan-600/3 transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/25 to-cyan-600/20 border border-blue-500/25 shadow-sm">
                  <Minus className="h-3.5 w-3.5 text-blue-300" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl md:text-3xl font-bold text-blue-300 tracking-tight">
                  {stats.draws}
                </div>
                <div className="text-[10px] md:text-xs text-purple-200/50 font-medium uppercase tracking-wider">
                  Draws
                </div>
              </div>
            </div>
          </div>

          {/* Win Rate Stat */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/15 via-purple-600/10 to-violet-500/8 border border-violet-500/20 hover:border-violet-400/30 hover:bg-gradient-to-br hover:from-violet-500/20 hover:via-purple-600/15 hover:to-violet-500/12 transition-all duration-500 p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-600/0 group-hover:from-violet-500/5 group-hover:to-purple-600/3 transition-all duration-500" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500/25 to-purple-600/20 border border-violet-500/25 shadow-sm">
                  <Target className="h-3.5 w-3.5 text-violet-300" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl md:text-3xl font-bold text-violet-300 tracking-tight">
                  {stats.winRate}%
                </div>
                <div className="text-[10px] md:text-xs text-purple-200/50 font-medium uppercase tracking-wider">
                  Win Rate
                </div>
                {stats.totalGames > 0 && (
                  <div className="mt-2.5 h-1 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400/60 to-purple-500/60 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${stats.winRate}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
