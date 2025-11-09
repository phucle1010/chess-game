import { Suspense } from "react";
import { Gamepad2 } from "lucide-react";

import { GamePageContent } from "./components/GamePageContent";

function GameLoading() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden p-4">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Loading Card */}
      <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl rounded-2xl p-12 max-w-md w-full">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Game Icon with Gradient Background */}
          <div className="relative">
            <div className="p-4 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg animate-pulse">
              <Gamepad2 className="h-12 w-12 text-white" />
            </div>
            {/* Spinning Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-500/30 border-t-slate-400 animate-spin" />
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Loading Game</h2>
            <p className="text-slate-400 text-sm">
              Preparing your chess board...
            </p>
          </div>

          {/* Loading Dots Animation */}
          <div className="flex items-center space-x-2">
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<GameLoading />}>
      <GamePageContent />
    </Suspense>
  );
}
