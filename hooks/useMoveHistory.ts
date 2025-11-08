import { useMemo } from "react";
import { Chess } from "chess.js";

export function useMoveHistory(chess: Chess | null): string[] {
  return useMemo(() => {
    if (!chess) return [];

    const history = chess.history();
    const formattedMoves: string[] = [];

    for (let i = 0; i < history.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = history[i] || "";
      const blackMove = history[i + 1] || "";
      formattedMoves.push(`${moveNum}. ${whiteMove} ${blackMove}`.trim());
    }

    return formattedMoves;
  }, [chess]);
}
