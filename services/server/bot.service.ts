import { Chess } from "chess.js";

export interface BotMove {
  from: string;
  to: string;
  promotion?: string;
}

export type BotDifficulty = "easy" | "medium" | "hard";

// Piece-square tables for better positional play
const PIECE_SQUARE_TABLES = {
  pawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  knight: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  bishop: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  rook: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  queen: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  king: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

/**
 * Simple chess bot that makes moves based on difficulty level
 */
export class ChessBot {
  private difficulty: BotDifficulty;

  constructor(difficulty: BotDifficulty = "medium") {
    this.difficulty = difficulty;
  }

  /**
   * Calculate the best move for the bot
   */
  getBestMove(fen: string): BotMove | null {
    const chess = new Chess(fen);

    if (chess.isGameOver()) {
      return null;
    }

    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) {
      return null;
    }

    // Get the last move from history to avoid repetition
    // Only filter if there are multiple moves (to avoid filtering when only one move exists)
    const history = chess.history({ verbose: true });
    const lastMove = history.length > 0 ? history[history.length - 1] : null;

    // Only filter if we have enough moves to work with (at least 3 moves available)
    // This prevents the bot from getting stuck when there are limited moves
    let availableMoves = moves;

    if (lastMove && moves.length > 2) {
      // Filter out moves that reverse the last move (moving piece back)
      // But be less strict - only filter obvious reversals
      const filteredMoves = moves.filter((m) => {
        // Don't move the same piece back to where it came from (obvious reversal)
        const isReversing = m.from === lastMove.to && m.to === lastMove.from;
        return !isReversing;
      });

      // Only use filtered moves if we still have valid options
      if (filteredMoves.length > 0) {
        availableMoves = filteredMoves;
      }
    }

    // Ensure we have moves to work with
    if (availableMoves.length === 0) {
      console.error("No available moves after filtering, using all moves");
      availableMoves = moves;
    }

    if (availableMoves.length === 0) {
      console.error("No moves available at all");
      return null;
    }

    let bestMove: BotMove | null = null;
    try {
      switch (this.difficulty) {
        case "easy":
          bestMove = this.getEasyMove(availableMoves);
          break;
        case "medium":
          bestMove = this.getMediumMove(chess, availableMoves);
          break;
        case "hard":
          bestMove = this.getHardMove(chess, availableMoves);
          break;
        default:
          bestMove = this.getEasyMove(availableMoves);
      }
    } catch (error) {
      console.error("Error in bot move selection:", error);
      // Fallback to easy move with all available moves
      if (moves.length > 0) {
        bestMove = this.getEasyMove(moves);
      } else {
        return null;
      }
    }

    return bestMove;
  }

  /**
   * Easy: Random move
   */
  private getEasyMove(
    moves: Array<{ from: string; to: string; promotion?: string }>
  ): BotMove {
    if (!moves || moves.length === 0) {
      throw new Error("No moves available for easy bot");
    }
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    if (!randomMove) {
      throw new Error("Failed to select random move");
    }
    return {
      from: randomMove.from,
      to: randomMove.to,
      promotion: randomMove.promotion,
    };
  }

  /**
   * Medium: Prefer captures, checks, and development moves, avoid moving pieces back
   */
  private getMediumMove(
    chess: Chess,
    moves: Array<{
      from: string;
      to: string;
      promotion?: string;
      captured?: string;
      san: string;
    }>
  ): BotMove {
    // Prioritize checkmate
    const checkmates = moves.filter((m) => m.san.includes("#"));
    if (checkmates.length > 0) {
      return {
        from: checkmates[0].from,
        to: checkmates[0].to,
        promotion: checkmates[0].promotion,
      };
    }

    // Prioritize captures (especially valuable captures)
    const captures = moves.filter((m) => m.captured);
    if (captures.length > 0) {
      // Sort by piece value (capture higher value pieces)
      const pieceValues: Record<string, number> = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 0,
      };
      const sortedCaptures = captures.sort((a, b) => {
        const aValue =
          a.captured && a.captured in pieceValues ? pieceValues[a.captured] : 0;
        const bValue =
          b.captured && b.captured in pieceValues ? pieceValues[b.captured] : 0;
        return bValue - aValue;
      });
      const bestCapture = sortedCaptures[0];
      return {
        from: bestCapture.from,
        to: bestCapture.to,
        promotion: bestCapture.promotion,
      };
    }

    // Prioritize checks
    const checks = moves.filter((m) => m.san.includes("+"));
    if (checks.length > 0) {
      // Prefer checks that also attack pieces
      const checksWithCapture = checks.filter((m) => m.captured);
      if (checksWithCapture.length > 0) {
        return {
          from: checksWithCapture[0].from,
          to: checksWithCapture[0].to,
          promotion: checksWithCapture[0].promotion,
        };
      }
      return {
        from: checks[0].from,
        to: checks[0].to,
        promotion: checks[0].promotion,
      };
    }

    // Prefer moves that develop pieces (move pieces from back rank)
    const developmentMoves = moves.filter((m) => {
      const fromRow = parseInt(m.from[1]) - 1;
      const toRow = parseInt(m.to[1]) - 1;
      // Moving forward from back rank (row 0 for white, row 7 for black) is development
      const isBackRank = chess.turn() === "w" ? fromRow === 0 : fromRow === 7;
      // White moves up (higher row number), black moves down (lower row number)
      const isForward =
        chess.turn() === "w" ? toRow > fromRow : toRow < fromRow;
      return isBackRank && isForward;
    });

    if (developmentMoves.length > 0) {
      const randomDev =
        developmentMoves[Math.floor(Math.random() * developmentMoves.length)];
      return {
        from: randomDev.from,
        to: randomDev.to,
        promotion: randomDev.promotion,
      };
    }

    // Prefer center control (moves to center squares)
    const centerSquares = ["d4", "d5", "e4", "e5", "c4", "c5", "f4", "f5"];
    const centerMoves = moves.filter((m) => centerSquares.includes(m.to));
    if (centerMoves.length > 0) {
      const randomCenter =
        centerMoves[Math.floor(Math.random() * centerMoves.length)];
      return {
        from: randomCenter.from,
        to: randomCenter.to,
        promotion: randomCenter.promotion,
      };
    }

    // Avoid moving pieces backward (especially pawns)
    const forwardMoves = moves.filter((m) => {
      const fromRow = parseInt(m.from[1]) - 1;
      const toRow = parseInt(m.to[1]) - 1;
      if (chess.turn() === "w") {
        return toRow >= fromRow; // White moves up (higher row number)
      } else {
        return toRow <= fromRow; // Black moves down (lower row number)
      }
    });

    if (forwardMoves.length > 0) {
      const randomForward =
        forwardMoves[Math.floor(Math.random() * forwardMoves.length)];
      return {
        from: randomForward.from,
        to: randomForward.to,
        promotion: randomForward.promotion,
      };
    }

    // Otherwise random (fallback)
    if (moves.length === 0) {
      throw new Error("No moves available for medium bot");
    }
    return this.getEasyMove(moves);
  }

  /**
   * Hard: Iterative deepening with minimax, alpha-beta pruning, quiescence search, and advanced techniques
   */
  private getHardMove(
    chess: Chess,
    moves: Array<{
      from: string;
      to: string;
      promotion?: string;
      captured?: string;
      san: string;
    }>
  ): BotMove {
    // Use iterative deepening: search shallow first, then deeper
    // This allows us to use the best move from previous iteration to order moves better
    const isMaximizing = chess.turn() === "b"; // Black maximizes, white minimizes
    const maxDepth = 5; // Increased to 5-ply for even smarter play

    let bestMove: BotMove | null = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    // Iterative deepening: search from depth 2 to maxDepth
    for (let currentDepth = 2; currentDepth <= maxDepth; currentDepth++) {
      let orderedMoves: Array<{
        from: string;
        to: string;
        promotion?: string;
        captured?: string;
        san: string;
      }>;
      if (bestMove) {
        const bestMoveObj = moves.find(
          (m) => m.from === bestMove!.from && m.to === bestMove!.to
        );
        const otherMoves = moves.filter(
          (m) => !(m.from === bestMove!.from && m.to === bestMove!.to)
        );
        orderedMoves = bestMoveObj
          ? [bestMoveObj, ...otherMoves].slice(0, 25)
          : this.orderMoves(chess, moves).slice(0, 25);
      } else {
        orderedMoves = this.orderMoves(chess, moves).slice(0, 25);
      }

      let alpha = -Infinity;
      let beta = Infinity;
      let currentBestMove: BotMove | null = null;
      let currentBestScore = isMaximizing ? -Infinity : Infinity;

      for (const move of orderedMoves) {
        try {
          chess.move(move);

          // Use quiescence search at leaf nodes for more accurate evaluation
          const score = this.minimax(
            chess,
            currentDepth - 1,
            alpha,
            beta,
            !isMaximizing,
            true
          );

          chess.undo();

          if (isMaximizing) {
            if (score > currentBestScore) {
              currentBestScore = score;
              currentBestMove = {
                from: move.from,
                to: move.to,
                promotion: move.promotion,
              };
            }
            alpha = Math.max(alpha, score);
          } else {
            if (score < currentBestScore) {
              currentBestScore = score;
              currentBestMove = {
                from: move.from,
                to: move.to,
                promotion: move.promotion,
              };
            }
            beta = Math.min(beta, score);
          }

          // Alpha-beta pruning
          if (beta <= alpha) {
            break;
          }
        } catch {
          // If move evaluation fails, undo and continue
          try {
            chess.undo();
          } catch {
            // Ignore undo errors
          }
        }
      }

      // Update best move from this iteration
      if (currentBestMove) {
        bestMove = currentBestMove;
        bestScore = currentBestScore;
      }

      // If we found a winning/losing position, we can stop early
      if (Math.abs(bestScore) > 50000) {
        break;
      }
    }

    // Fallback to easy move if no best move found
    if (!bestMove) {
      if (moves.length === 0) {
        throw new Error("No moves available for hard bot");
      }
      return this.getEasyMove(moves);
    }
    return bestMove;
  }

  /**
   * Minimax algorithm with alpha-beta pruning, null move pruning, late move reduction, and quiescence search
   */
  private minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    useQuiescence: boolean = false
  ): number {
    // Terminal conditions
    if (chess.isGameOver()) {
      try {
        return this.evaluatePosition(chess);
      } catch (error) {
        console.error("Error in evaluatePosition:", error);
        return 0; // Return neutral score on error
      }
    }

    // At depth 0, use quiescence search if enabled, otherwise evaluate
    if (depth === 0) {
      if (useQuiescence) {
        return this.quiescenceSearch(chess, alpha, beta, isMaximizing);
      } else {
        try {
          return this.evaluatePosition(chess);
        } catch (error) {
          console.error("Error in evaluatePosition:", error);
          return 0;
        }
      }
    }

    // Note: Null move pruning removed for now as it requires more complex implementation
    // The late move reduction and iterative deepening provide significant improvements

    try {
      const moves = chess.moves({ verbose: true });
      if (moves.length === 0) {
        return this.evaluatePosition(chess);
      }

      // Increased move limits for better analysis
      // More moves at shallow depths, fewer at deeper levels
      const maxMoves =
        depth === 1
          ? 18
          : depth === 2
            ? 12
            : depth === 3
              ? 10
              : depth === 4
                ? 8
                : 6;
      const orderedMoves = this.orderMoves(chess, moves).slice(0, maxMoves);

      if (isMaximizing) {
        let maxScore = -Infinity;
        for (let i = 0; i < orderedMoves.length; i++) {
          const move = orderedMoves[i];
          try {
            chess.move(move);

            // Late move reduction: reduce depth for moves ordered later (they're likely worse)
            let searchDepth = depth - 1;
            if (
              i > 3 &&
              depth >= 3 &&
              !move.captured &&
              !move.san.includes("+")
            ) {
              searchDepth = Math.max(0, depth - 2); // Reduce depth by 1 for late non-tactical moves
            }

            const score = this.minimax(
              chess,
              searchDepth,
              alpha,
              beta,
              false,
              useQuiescence
            );
            chess.undo();
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) {
              break; // Prune
            }
          } catch {
            try {
              chess.undo();
            } catch {
              // Ignore undo errors
            }
            // Continue with next move
          }
        }
        return maxScore;
      } else {
        let minScore = Infinity;
        for (let i = 0; i < orderedMoves.length; i++) {
          const move = orderedMoves[i];
          try {
            chess.move(move);

            // Late move reduction: reduce depth for moves ordered later
            let searchDepth = depth - 1;
            if (
              i > 3 &&
              depth >= 3 &&
              !move.captured &&
              !move.san.includes("+")
            ) {
              searchDepth = Math.max(0, depth - 2); // Reduce depth by 1 for late non-tactical moves
            }

            const score = this.minimax(
              chess,
              searchDepth,
              alpha,
              beta,
              true,
              useQuiescence
            );
            chess.undo();
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) {
              break; // Prune
            }
          } catch {
            try {
              chess.undo();
            } catch {
              // Ignore undo errors
            }
            // Continue with next move
          }
        }
        return minScore;
      }
    } catch (error) {
      console.error("Error in minimax:", error);
      return 0; // Return neutral score on error
    }
  }

  /**
   * Quiescence search - continue searching until position is "quiet" (no captures/checks)
   * This avoids the horizon effect where the bot misses tactics beyond the search depth
   */
  private quiescenceSearch(
    chess: Chess,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    depth: number = 0,
    maxDepth: number = 3
  ): number {
    // Limit quiescence depth to prevent infinite loops
    if (depth >= maxDepth) {
      return this.evaluatePosition(chess);
    }

    // Evaluate static position first
    const standPat = this.evaluatePosition(chess);

    if (isMaximizing) {
      if (standPat >= beta) {
        return beta; // Beta cutoff
      }
      if (standPat > alpha) {
        alpha = standPat;
      }
    } else {
      if (standPat <= alpha) {
        return alpha; // Alpha cutoff
      }
      if (standPat < beta) {
        beta = standPat;
      }
    }

    // Only search captures and checks (tactical moves)
    const moves = chess.moves({ verbose: true });
    const tacticalMoves = moves.filter(
      (m) => m.captured || m.san.includes("+") || m.san.includes("#")
    );

    // If no tactical moves, return static evaluation
    if (tacticalMoves.length === 0) {
      return standPat;
    }

    // Order tactical moves (captures first, by value)
    const orderedTactical = this.orderMoves(chess, tacticalMoves);

    if (isMaximizing) {
      let maxScore = standPat;
      for (const move of orderedTactical) {
        try {
          chess.move(move);
          const score = this.quiescenceSearch(
            chess,
            alpha,
            beta,
            false,
            depth + 1,
            maxDepth
          );
          chess.undo();
          maxScore = Math.max(maxScore, score);
          alpha = Math.max(alpha, score);
          if (beta <= alpha) {
            break; // Prune
          }
        } catch {
          try {
            chess.undo();
          } catch {
            // Ignore undo errors
          }
        }
      }
      return maxScore;
    } else {
      let minScore = standPat;
      for (const move of orderedTactical) {
        try {
          chess.move(move);
          const score = this.quiescenceSearch(
            chess,
            alpha,
            beta,
            true,
            depth + 1,
            maxDepth
          );
          chess.undo();
          minScore = Math.min(minScore, score);
          beta = Math.min(beta, score);
          if (beta <= alpha) {
            break; // Prune
          }
        } catch {
          try {
            chess.undo();
          } catch {
            // Ignore undo errors
          }
        }
      }
      return minScore;
    }
  }

  /**
   * Order moves for better alpha-beta pruning (best moves first)
   * Improved ordering leads to more effective pruning
   */
  private orderMoves(
    chess: Chess,
    moves: Array<{
      from: string;
      to: string;
      promotion?: string;
      captured?: string;
      san: string;
    }>
  ): Array<{
    from: string;
    to: string;
    promotion?: string;
    captured?: string;
    san: string;
  }> {
    const pieceValues: Record<string, number> = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0,
    };

    return moves.sort((a, b) => {
      // 1. Checkmate moves (highest priority)
      const aCheckmate = a.san.includes("#") ? 10000 : 0;
      const bCheckmate = b.san.includes("#") ? 10000 : 0;
      if (aCheckmate !== bCheckmate) {
        return bCheckmate - aCheckmate;
      }

      // 2. Captures with MVV-LVA (Most Valuable Victim - Least Valuable Attacker)
      // Higher value = capturing more valuable piece with less valuable piece
      if (a.captured && b.captured) {
        const aVictim = pieceValues[a.captured] || 0;
        const bVictim = pieceValues[b.captured] || 0;
        const aAttacker = this.getPieceValue(chess, a.from);
        const bAttacker = this.getPieceValue(chess, b.from);
        const aMVVLVA = aVictim * 10 - aAttacker;
        const bMVVLVA = bVictim * 10 - bAttacker;
        if (aMVVLVA !== bMVVLVA) {
          return bMVVLVA - aMVVLVA;
        }
      } else if (a.captured && !b.captured) {
        return -1; // Captures before non-captures
      } else if (!a.captured && b.captured) {
        return 1;
      }

      // 3. Checks (especially with captures)
      const aCheck = a.san.includes("+") ? (a.captured ? 500 : 100) : 0;
      const bCheck = b.san.includes("+") ? (b.captured ? 500 : 100) : 0;
      if (aCheck !== bCheck) {
        return bCheck - aCheck;
      }

      // 4. Promotions (especially to queen)
      const aPromotion = a.promotion === "q" ? 900 : a.promotion ? 500 : 0;
      const bPromotion = b.promotion === "q" ? 900 : b.promotion ? 500 : 0;
      if (aPromotion !== bPromotion) {
        return bPromotion - aPromotion;
      }

      // 5. Center control (moves to center squares)
      const centerSquares = ["d4", "d5", "e4", "e5", "c4", "c5", "f4", "f5"];
      const aCenter = centerSquares.includes(a.to) ? 10 : 0;
      const bCenter = centerSquares.includes(b.to) ? 10 : 0;
      if (aCenter !== bCenter) {
        return bCenter - aCenter;
      }

      return 0;
    });
  }

  /**
   * Get piece value from square
   */
  private getPieceValue(chess: Chess, square: string): number {
    try {
      const board = chess.board();
      const col = square.charCodeAt(0) - 97;
      const row = 8 - parseInt(square[1]);
      const piece = board[row]?.[col];
      if (!piece) return 0;
      const values: Record<string, number> = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 0,
      };
      return values[piece.type] || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Advanced position evaluation with piece-square tables, mobility, and king safety
   */
  private evaluatePosition(chess: Chess): number {
    // Terminal positions
    if (chess.isCheckmate()) {
      return chess.turn() === "w" ? -100000 : 100000;
    }

    if (chess.isDraw() || chess.isStalemate()) {
      return 0;
    }

    // Piece values (centipawns)
    const pieceValues: Record<string, number> = {
      p: 100,
      n: 320,
      b: 330,
      r: 500,
      q: 900,
      k: 20000,
    };

    let score = 0;
    const board = chess.board();
    const isEndgame = this.isEndgame(chess);

    // Evaluate each piece
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece) {
          const value = pieceValues[piece.type] || 0;
          const pieceSquareTable =
            PIECE_SQUARE_TABLES[piece.type as keyof typeof PIECE_SQUARE_TABLES];

          // Material value
          score += piece.color === "w" ? value : -value;

          // Piece-square table evaluation
          const tableRow = piece.color === "w" ? 7 - row : row;
          const tableCol = piece.color === "w" ? col : 7 - col;
          const squareValue = pieceSquareTable[tableRow][tableCol];
          score += piece.color === "w" ? squareValue : -squareValue;

          // Piece mobility (number of legal moves) - improved calculation
          if (piece.type !== "p" && piece.type !== "k") {
            try {
              const square = `${String.fromCharCode(97 + col)}${8 - row}`;
              const moves = chess.moves({
                square: square as Parameters<typeof chess.moves>[0]["square"],
                verbose: true,
              });
              const mobility = moves.length;
              // Higher mobility bonus for more active pieces
              const mobilityBonus =
                piece.type === "q"
                  ? mobility * 2
                  : piece.type === "r"
                    ? mobility * 1.5
                    : piece.type === "b"
                      ? mobility * 1.2
                      : mobility * 1;
              score += piece.color === "w" ? mobilityBonus : -mobilityBonus;
            } catch {
              // Skip on error
            }
          }

          // Piece coordination bonuses
          if (piece.type === "r" || piece.type === "q") {
            // Rooks and queens on open files are more valuable
            try {
              const file = col;
              const isOpenFile = this.isOpenFile(chess, file);
              if (isOpenFile) {
                score += piece.color === "w" ? 15 : -15;
              }
            } catch {
              // Skip on error
            }
          }

          // Piece activity bonuses - simplified for performance
          if (piece.type === "p") {
            // Only check passed pawn (most important)
            try {
              if (this.isPassedPawn(chess, row, col, piece.color === "w")) {
                const promotionRank = piece.color === "w" ? 7 : 0;
                const distance = Math.abs(row - promotionRank);
                score +=
                  piece.color === "w"
                    ? (7 - distance) * 15
                    : -(7 - distance) * 15;
              }
            } catch {
              // Skip on error
            }
          }

          // Bishop pair bonus - only check once per color
          if (
            piece.type === "b" &&
            col === 0 &&
            row === (piece.color === "w" ? 7 : 0)
          ) {
            try {
              const bishops = board
                .flat()
                .filter((p) => p && p.type === "b" && p.color === piece.color);
              if (bishops.length >= 2) {
                score += piece.color === "w" ? 25 : -25;
              }
            } catch {
              // Skip on error
            }
          }
        }
      }
    }

    // King safety evaluation
    try {
      const whiteKingSquare = this.findKingSquare(chess, "w");
      const blackKingSquare = this.findKingSquare(chess, "b");

      if (whiteKingSquare) {
        const [row, col] = whiteKingSquare;
        const safety = this.evaluateKingSafety(chess, row, col, "w", isEndgame);
        score += safety;
      }

      if (blackKingSquare) {
        const [row, col] = blackKingSquare;
        const safety = this.evaluateKingSafety(chess, row, col, "b", isEndgame);
        score -= safety;
      }
    } catch (error) {
      // If king safety evaluation fails, continue without it
      console.error("Error evaluating king safety:", error);
    }

    // Check bonus/penalty
    if (chess.isCheck()) {
      score += chess.turn() === "w" ? -50 : 50;
    }

    // Control of center squares (more sophisticated)
    const centerSquares = ["d4", "d5", "e4", "e5", "c4", "c5", "f4", "f5"];
    for (const square of centerSquares) {
      const [col, row] = [square.charCodeAt(0) - 97, parseInt(square[1]) - 1];
      const piece = board[7 - row][col];
      if (piece) {
        const centerValue = ["d4", "d5", "e4", "e5"].includes(square) ? 8 : 4;
        score += piece.color === "w" ? centerValue : -centerValue;
      }
    }

    // Pawn structure evaluation
    try {
      const pawnStructure = this.evaluatePawnStructure(chess);
      score += pawnStructure;
    } catch {
      // Skip on error
    }

    // Piece coordination (rooks on same rank/file, pieces supporting each other)
    try {
      const coordination = this.evaluatePieceCoordination(chess);
      score += coordination;
    } catch {
      // Skip on error
    }

    // King activity in endgame
    if (isEndgame) {
      try {
        const whiteKingSquare = this.findKingSquare(chess, "w");
        const blackKingSquare = this.findKingSquare(chess, "b");

        if (whiteKingSquare) {
          const [row, col] = whiteKingSquare;
          // Centralized king is better in endgame
          const centerDistance = Math.abs(row - 3.5) + Math.abs(col - 3.5);
          score += (7 - centerDistance) * 3;
        }

        if (blackKingSquare) {
          const [row, col] = blackKingSquare;
          const centerDistance = Math.abs(row - 3.5) + Math.abs(col - 3.5);
          score -= (7 - centerDistance) * 3;
        }
      } catch {
        // Skip on error
      }
    }

    return score;
  }

  /**
   * Evaluate pawn structure (doubled, isolated, passed pawns)
   */
  private evaluatePawnStructure(chess: Chess): number {
    let score = 0;
    const board = chess.board();

    for (let col = 0; col < 8; col++) {
      let whitePawns = 0;
      let blackPawns = 0;

      for (let row = 0; row < 8; row++) {
        const piece = board[row][col];
        if (piece && piece.type === "p") {
          if (piece.color === "w") {
            whitePawns++;
            // Check if isolated
            if (this.isIsolatedPawn(chess, col, true)) {
              score -= 10;
            }
            // Check if passed
            if (this.isPassedPawn(chess, row, col, true)) {
              score += 20;
            }
          } else {
            blackPawns++;
            // Check if isolated
            if (this.isIsolatedPawn(chess, col, false)) {
              score += 10;
            }
            // Check if passed
            if (this.isPassedPawn(chess, row, col, false)) {
              score -= 20;
            }
          }
        }
      }

      // Doubled pawns penalty
      if (whitePawns > 1) {
        score -= (whitePawns - 1) * 15;
      }
      if (blackPawns > 1) {
        score += (blackPawns - 1) * 15;
      }
    }

    return score;
  }

  /**
   * Evaluate piece coordination (rooks on same rank/file, pieces supporting each other)
   */
  private evaluatePieceCoordination(chess: Chess): number {
    let score = 0;
    const board = chess.board();

    // Rooks on same rank/file
    const whiteRooks: Array<[number, number]> = [];
    const blackRooks: Array<[number, number]> = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === "r") {
          if (piece.color === "w") {
            whiteRooks.push([row, col]);
          } else {
            blackRooks.push([row, col]);
          }
        }
      }
    }

    // Check if rooks are on same rank or file (doubled rooks)
    if (whiteRooks.length >= 2) {
      for (let i = 0; i < whiteRooks.length; i++) {
        for (let j = i + 1; j < whiteRooks.length; j++) {
          if (
            whiteRooks[i][0] === whiteRooks[j][0] ||
            whiteRooks[i][1] === whiteRooks[j][1]
          ) {
            score += 15; // Doubled rooks bonus
          }
        }
      }
    }

    if (blackRooks.length >= 2) {
      for (let i = 0; i < blackRooks.length; i++) {
        for (let j = i + 1; j < blackRooks.length; j++) {
          if (
            blackRooks[i][0] === blackRooks[j][0] ||
            blackRooks[i][1] === blackRooks[j][1]
          ) {
            score -= 15; // Doubled rooks bonus
          }
        }
      }
    }

    return score;
  }

  /**
   * Check if position is endgame (few pieces left)
   */
  private isEndgame(chess: Chess): boolean {
    try {
      const board = chess.board();
      const pieces = board
        .flat()
        .filter((p) => p && p.type !== "k" && p.type !== "p");
      return pieces.length <= 6; // Endgame if 6 or fewer non-pawn pieces
    } catch {
      return false; // Default to not endgame on error
    }
  }

  /**
   * Check if pawn is passed (no enemy pawns in front)
   */
  private isPassedPawn(
    chess: Chess,
    row: number,
    col: number,
    isWhite: boolean
  ): boolean {
    const board = chess.board();
    const direction = isWhite ? -1 : 1;
    const enemyColor = isWhite ? "b" : "w";

    // Check squares in front
    for (let r = row + direction; r >= 0 && r < 8; r += direction) {
      // Check same file
      if (
        board[r][col] &&
        board[r][col]?.type === "p" &&
        board[r][col]?.color === enemyColor
      ) {
        return false;
      }
      // Check adjacent files
      if (
        col > 0 &&
        board[r][col - 1] &&
        board[r][col - 1]?.type === "p" &&
        board[r][col - 1]?.color === enemyColor
      ) {
        return false;
      }
      if (
        col < 7 &&
        board[r][col + 1] &&
        board[r][col + 1]?.type === "p" &&
        board[r][col + 1]?.color === enemyColor
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if pawn is doubled (another pawn on same file)
   */
  private isDoubledPawn(chess: Chess, col: number, isWhite: boolean): boolean {
    const board = chess.board();
    let count = 0;
    for (let row = 0; row < 8; row++) {
      const piece = board[row][col];
      if (
        piece &&
        piece.type === "p" &&
        piece.color === (isWhite ? "w" : "b")
      ) {
        count++;
      }
    }
    return count > 1;
  }

  /**
   * Check if pawn is isolated (no friendly pawns on adjacent files)
   */
  private isIsolatedPawn(chess: Chess, col: number, isWhite: boolean): boolean {
    const board = chess.board();
    const color = isWhite ? "w" : "b";

    // Check left file
    if (col > 0) {
      for (let row = 0; row < 8; row++) {
        const piece = board[row][col - 1];
        if (piece && piece.type === "p" && piece.color === color) {
          return false;
        }
      }
    }

    // Check right file
    if (col < 7) {
      for (let row = 0; row < 8; row++) {
        const piece = board[row][col + 1];
        if (piece && piece.type === "p" && piece.color === color) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Find king's square
   */
  private findKingSquare(
    chess: Chess,
    color: "w" | "b"
  ): [number, number] | null {
    const board = chess.board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === "k" && piece.color === color) {
          return [row, col];
        }
      }
    }
    return null;
  }

  /**
   * Evaluate king safety
   */
  private evaluateKingSafety(
    chess: Chess,
    row: number,
    col: number,
    color: "w" | "b",
    isEndgame: boolean
  ): number {
    let safety = 0;
    const board = chess.board();

    // Count friendly pieces around king
    let friendlyPieces = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const piece = board[r][c];
          if (piece && piece.color === color) {
            friendlyPieces++;
          }
        }
      }
    }
    safety += friendlyPieces * 5;

    // In endgame, king activity is good
    if (isEndgame) {
      try {
        const square = `${String.fromCharCode(97 + col)}${8 - row}`;
        const kingMoves = chess.moves({
          square: square as Parameters<typeof chess.moves>[0]["square"],
          verbose: true,
        });
        safety += kingMoves.length * 3;
      } catch (error) {
        // If king moves calculation fails, skip it
        console.error("Error calculating king moves:", error);
      }
    } else {
      // In opening/middlegame, castled king is safer
      if (
        (color === "w" && row === 7 && (col === 2 || col === 6)) ||
        (color === "b" && row === 0 && (col === 2 || col === 6))
      ) {
        safety += 20; // Castled
      } else if (
        (color === "w" && row === 7 && col >= 2 && col <= 6) ||
        (color === "b" && row === 0 && col >= 2 && col <= 6)
      ) {
        safety += 10; // Behind pawns
      }
    }

    return safety;
  }

  /**
   * Check if file is open (no pawns of either color)
   */
  private isOpenFile(chess: Chess, file: number): boolean {
    try {
      const board = chess.board();
      for (let row = 0; row < 8; row++) {
        const piece = board[row][file];
        if (piece && piece.type === "p") {
          return false; // File has a pawn
        }
      }
      return true; // File is open
    } catch {
      return false;
    }
  }
}

export const botService = {
  /**
   * Get a bot move for a given FEN position
   */
  async getBotMove(
    fen: string,
    difficulty: BotDifficulty = "medium"
  ): Promise<BotMove | null> {
    const bot = new ChessBot(difficulty);
    return bot.getBestMove(fen);
  },
};
