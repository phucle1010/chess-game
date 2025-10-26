import { useDrag } from "react-dnd";

export type PieceType =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king";
export type PieceColor = "white" | "black";

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

interface ChessPieceProps {
  piece: Piece;
  position: [number, number];
}

const pieceSymbols: Record<PieceColor, Record<PieceType, string>> = {
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

export const ChessPiece: React.FC<ChessPieceProps> = ({ piece, position }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: { piece, position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => drag(node)}
      className={`chess-piece cursor-move select-none transition-all duration-200 ${
        isDragging ? "opacity-50 scale-110" : "hover:scale-110"
      }`}
      data-color={piece.color}
    >
      <span className="piece-symbol text-[clamp(2rem,6vw,3.5rem)] leading-none block">
        {pieceSymbols[piece.color][piece.type]}
      </span>

      <style>{`
        .chess-piece {
          transform-style: preserve-3d;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
        }
        
        .chess-piece:active {
          cursor: grabbing;
        }
        
        .chess-piece[data-color="white"] .piece-symbol {
          color: #ffffff;
          text-shadow: 
            0 1px 0 rgba(200, 200, 200, 0.8),
            0 2px 4px rgba(0, 0, 0, 0.5),
            0 -1px 0 rgba(255, 255, 255, 0.3),
            2px 2px 6px rgba(0, 0, 0, 0.3);
          filter: 
            drop-shadow(0 1px 1px rgba(255, 255, 255, 0.5))
            drop-shadow(0 -1px 0 rgba(180, 180, 180, 0.4));
        }
        
        .chess-piece[data-color="black"] .piece-symbol {
          color: #2c2c2c;
          text-shadow: 
            0 1px 0 rgba(60, 60, 60, 0.9),
            0 2px 6px rgba(0, 0, 0, 0.9),
            0 -1px 0 rgba(40, 40, 40, 0.6),
            1px 1px 3px rgba(0, 0, 0, 0.8);
          filter: 
            drop-shadow(0 1px 0 rgba(80, 80, 80, 0.6))
            drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
        }
      `}</style>
    </div>
  );
};
