"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Settings, Flag } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ChessBoard3D } from "@/components/game/ChessBoard3D";
import { PlayerCard } from "@/components/game/PlayerCard";
import { ChatPanel } from "@/components/game/ChatPanel";
import { ChatWidget } from "@/components/game/ChatWidget";
import { MoveHistory } from "@/components/game/MoveHistory";
import { PieceGuide } from "@/components/game/PieceGuide";
import { GameStats } from "@/components/game/GameStats";
// import { BoardLegend } from "@/components/game/BoardLegend";
import { HelpTooltip } from "@/components/game/HelpTooltip";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { ResultModal } from "@/components/modals/ResultModal";
import { PieceColor, Piece } from "@/components/game/ChessPiece";

const pieceSymbols: Record<PieceColor, Record<string, string>> = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
};

export default function GamePage() {
  const router = useRouter();

  const [currentTurn, setCurrentTurn] = useState<PieceColor>("white");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes
  const [blackTime, setBlackTime] = useState(600);
  const [whiteCaptured, setWhiteCaptured] = useState<string[]>([]);
  const [blackCaptured, setBlackCaptured] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "lose" | "draw">("win");
  const [legalMovesCount, setLegalMovesCount] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentTurn === "white" && whiteTime > 0) {
        setWhiteTime((prev) => prev - 1);
      } else if (currentTurn === "black" && blackTime > 0) {
        setBlackTime((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTurn, whiteTime, blackTime]);

  const handleMove = (
    from: [number, number],
    to: [number, number],
    piece: Piece
  ) => {
    const fromNotation = `${String.fromCharCode(97 + from[1])}${8 - from[0]}`;
    const toNotation = `${String.fromCharCode(97 + to[1])}${8 - to[0]}`;
    const moveNotation = `${piece.type[0].toUpperCase()}${fromNotation}-${toNotation}`;

    setMoveHistory([...moveHistory, moveNotation]);
    setCurrentTurn(currentTurn === "white" ? "black" : "white");
  };

  const handleCapture = (piece: Piece) => {
    const symbol = pieceSymbols[piece.color][piece.type];
    if (piece.color === "white") {
      setBlackCaptured([...blackCaptured, symbol]);
    } else {
      setWhiteCaptured([...whiteCaptured, symbol]);
    }
  };

  const handleResign = () => {
    setGameResult("lose");
    setResultOpen(true);
  };

  const handlePlayAgain = () => {
    setResultOpen(false);
    // Reset game state would go here
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 sm:p-4">
      {/* Header */}
      <div className="max-w-[1800px] mx-auto mb-2 sm:mb-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Leave Game
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handleResign}
              variant="outline"
              className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Flag className="mr-2 h-4 w-4" />
              Resign
            </Button>
            <Button
              onClick={() => setSettingsOpen(true)}
              variant="outline"
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Game Layout */}
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Sidebar - Chat & Move History */}
          <div className="w-full lg:w-80 xl:w-96 space-y-4 lg:space-y-6 order-2 lg:order-1">
            <div className="hidden xl:block">
              <ChatPanel />
            </div>
            <MoveHistory moves={moveHistory} />
            <div className="grid gap-4">
              <PieceGuide />
              {/* <BoardLegend /> */}
            </div>
          </div>

          {/* Center - Chess Board */}
          <div className="flex flex-col gap-4 lg:gap-6 lg:flex-1 order-1 lg:order-2 min-w-0">
            {/* Black Player */}
            <PlayerCard
              name="Opponent"
              rating={1842}
              color="black"
              timeRemaining={blackTime}
              isActive={currentTurn === "black"}
              capturedPieces={blackCaptured}
            />

            {/* Game Stats */}
            <GameStats
              legalMovesCount={legalMovesCount}
              movesPlayed={moveHistory.length}
            />

            {/* Chess Board */}
            <div className="flex justify-center px-2 py-4 lg:px-4 lg:py-8">
              <ChessBoard3D
                onMove={handleMove}
                currentTurn={currentTurn}
                onCapture={handleCapture}
                onLegalMovesChange={setLegalMovesCount}
              />
            </div>

            {/* White Player */}
            <PlayerCard
              name="You"
              rating={1650}
              color="white"
              timeRemaining={whiteTime}
              isActive={currentTurn === "white"}
              capturedPieces={whiteCaptured}
            />
          </div>
        </div>
      </div>

      {/* Mobile Chat Widget */}
      <ChatWidget />

      {/* Modals & Tooltips */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ResultModal
        open={resultOpen}
        onOpenChange={setResultOpen}
        result={gameResult}
        onPlayAgain={handlePlayAgain}
        onBackToHome={() => router.push("/")}
      />
      <HelpTooltip />
    </div>
  );
}
