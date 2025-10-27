import { useState } from "react";

import { Board, Piece, PieceColor } from "@/types/chess-piece";

import { ChessSquare } from "./ChessSquare";
import { MoveIndicator } from "./MoveIndicator";

const initialBoard: Board = [
  [
    { type: "rook", color: "black" },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black" },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black" },
  ],
  Array(8).fill({ type: "pawn", color: "black" }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: "pawn", color: "white" }),
  [
    { type: "rook", color: "white" },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white" },
  ],
];

interface ChessBoard3DProps {
  onMove: (from: [number, number], to: [number, number], piece: Piece) => void;
  currentTurn: PieceColor;
  onCapture?: (piece: Piece) => void;
  onLegalMovesChange?: (count: number) => void;
}

export const ChessBoard3D: React.FC<ChessBoard3DProps> = ({
  onMove,
  currentTurn,
  onCapture,
  onLegalMovesChange,
}) => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(
    null
  );
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);

  const makeMove = (to: [number, number]) => {
    if (!selectedSquare) return;

    const [fromRow, fromCol] = selectedSquare;
    const [toRow, toCol] = to;

    const piece = board[fromRow][fromCol];
    if (!piece) return;

    if (piece.color !== currentTurn) return;

    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return;

    if (!isValidMove(piece, selectedSquare, to, board)) return;

    // Capture piece
    if (targetPiece && onCapture) {
      onCapture(targetPiece);
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;

    setBoard(newBoard);
    onMove(selectedSquare, to, piece);

    // Clear selection and legal moves after move
    setSelectedSquare(null);
    setLegalMoves([]);
    if (onLegalMovesChange) {
      onLegalMovesChange(0);
    }
  };

  // Calculate all legal moves for a piece
  const calculateLegalMoves = (from: [number, number]): [number, number][] => {
    const [fromRow, fromCol] = from;
    const piece = board[fromRow][fromCol];
    if (!piece) return [];

    const moves: [number, number][] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const to: [number, number] = [row, col];
        const targetPiece = board[row][col];

        // Skip if same square
        if (row === fromRow && col === fromCol) continue;

        // Skip if trying to capture own piece
        if (targetPiece && targetPiece.color === piece.color) continue;

        // Check if move is valid
        if (isValidMove(piece, from, to, board)) {
          moves.push(to);
        }
      }
    }

    return moves;
  };

  // Handle piece selection (for showing legal moves)
  const handleSquareClick = (position: [number, number]) => {
    const [row, col] = position;
    const piece = board[row][col];

    // If clicking on own piece, select it and show legal moves
    if (piece && piece.color === currentTurn) {
      setSelectedSquare(position);
      const moves = calculateLegalMoves(position);
      setLegalMoves(moves);
      if (onLegalMovesChange) {
        onLegalMovesChange(moves.length);
      }
    } else if (selectedSquare) {
      // If a piece is selected, try to move to clicked square
      makeMove(position);
    } else {
      // Clear selection
      setSelectedSquare(null);
      setLegalMoves([]);
      if (onLegalMovesChange) {
        onLegalMovesChange(0);
      }
    }
  };

  const isValidMove = (
    piece: Piece,
    from: [number, number],
    to: [number, number],
    board: Board
  ): boolean => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    if (fromRow === toRow && fromCol === toCol) return false;

    switch (piece.type) {
      case "pawn": {
        const direction = piece.color === "white" ? -1 : 1;
        const startRow = piece.color === "white" ? 6 : 1;

        if (fromCol === toCol) {
          if (toRow === fromRow + direction && !board[toRow][toCol]) {
            return true;
          }
          if (
            fromRow === startRow &&
            toRow === fromRow + 2 * direction &&
            !board[toRow][toCol] &&
            !board[fromRow + direction][fromCol]
          ) {
            return true;
          }
        }

        if (colDiff === 1 && toRow === fromRow + direction) {
          if (board[toRow][toCol]) {
            return true;
          }
        }
        return false;
      }

      case "rook":
        if (fromRow === toRow || fromCol === toCol) {
          return isPathClear(from, to, board);
        }
        return false;

      case "knight":
        return (
          (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
        );

      case "bishop":
        if (rowDiff === colDiff) {
          return isPathClear(from, to, board);
        }
        return false;

      case "queen":
        if (fromRow === toRow || fromCol === toCol || rowDiff === colDiff) {
          return isPathClear(from, to, board);
        }
        return false;

      case "king":
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return false;
    }
  };

  const isPathClear = (
    from: [number, number],
    to: [number, number],
    board: Board
  ): boolean => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol]) {
        return false;
      }
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  };

  // Check if a square is a legal move
  const isSquareLegalMove = (position: [number, number]): boolean => {
    return legalMoves.some(
      ([row, col]) => row === position[0] && col === position[1]
    );
  };

  // Check if a square is selected
  const isSquareSelected = (position: [number, number]): boolean => {
    if (!selectedSquare) return false;
    return (
      selectedSquare[0] === position[0] && selectedSquare[1] === position[1]
    );
  };

  // Get selected piece name for indicator
  const getSelectedPieceName = (): string | undefined => {
    if (!selectedSquare) return undefined;
    const [row, col] = selectedSquare;
    const piece = board[row][col];
    if (!piece) return undefined;
    return piece.type.charAt(0).toUpperCase() + piece.type.slice(1);
  };

  return (
    <div className="relative w-full">
      {/* Move Indicator */}
      <MoveIndicator
        show={legalMoves.length > 0}
        pieceName={getSelectedPieceName()}
      />

      {/* Chess Board Container */}
      <div className="w-full max-w-[min(90vw,600px)] mx-auto px-2 sm:px-0">
        {/* Board flat layout */}
        <div className="board-container relative">
          <div className="grid grid-cols-8 w-full aspect-square bg-slate-900 rounded-lg overflow-hidden shadow-lg border-4 border-slate-700/50 relative">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const position: [number, number] = [rowIndex, colIndex];
                return (
                  <ChessSquare
                    key={`${rowIndex}-${colIndex}`}
                    position={position}
                    piece={piece}
                    onClick={() => handleSquareClick(position)}
                    isLegalMove={isSquareLegalMove(position)}
                    isSelected={isSquareSelected(position)}
                  />
                );
              })
            )}
          </div>

          {/* Coordinate labels - hidden on mobile, shown on sm+ */}
          <div className="hidden sm:flex absolute -bottom-8 left-0 right-0 justify-around px-2">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((letter) => (
              <div key={letter} className="w-[12.5%] text-center">
                <span className="text-slate-400 text-sm">{letter}</span>
              </div>
            ))}
          </div>

          <div className="hidden sm:flex absolute -left-8 top-0 bottom-0 flex-col justify-around py-2">
            {["8", "7", "6", "5", "4", "3", "2", "1"].map((number) => (
              <div key={number} className="h-[12.5%] flex items-center">
                <span className="text-slate-400 text-sm">{number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .board-container {
          /* Flat board - no 3D effects */
        }
      `}</style>
    </div>
  );
};
