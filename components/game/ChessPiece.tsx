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
}

// SVG Chess Pieces Components - Professional Design
const KingWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="30" r="5" fill="currentColor" />
    <line
      x1="50"
      y1="35"
      x2="50"
      y2="45"
      stroke="currentColor"
      strokeWidth="3"
    />
    <rect x="42" y="45" width="16" height="6" fill="currentColor" rx="1" />
    <rect x="38" y="51" width="24" height="5" fill="currentColor" rx="1" />
    <rect x="34" y="56" width="32" height="4" fill="currentColor" rx="1" />
    <rect x="30" y="60" width="40" height="8" fill="currentColor" rx="2" />
    <path
      d="M 48 18 L 50 15 L 52 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const QueenWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="25" r="6" fill="currentColor" />
    <path
      d="M 35 30 L 40 35 L 50 32 L 60 35 L 65 30 L 62 42 L 38 42 Z"
      fill="currentColor"
    />
    <rect x="36" y="42" width="28" height="5" fill="currentColor" rx="1" />
    <rect x="32" y="47" width="36" height="4" fill="currentColor" rx="1" />
    <rect x="28" y="51" width="44" height="8" fill="currentColor" rx="2" />
    <polygon
      points="40,20 45,25 50,18 55,25 60,20 55,30 45,30"
      fill="currentColor"
    />
  </svg>
);

const RookWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="40" y="25" width="20" height="6" fill="currentColor" rx="1" />
    <rect x="38" y="31" width="24" height="5" fill="currentColor" rx="1" />
    <rect x="36" y="36" width="28" height="8" fill="currentColor" rx="1" />
    <rect x="34" y="44" width="32" height="4" fill="currentColor" rx="1" />
    <rect x="30" y="48" width="40" height="10" fill="currentColor" rx="2" />
    <rect x="38" y="22" width="4" height="4" fill="currentColor" />
    <rect x="58" y="22" width="4" height="4" fill="currentColor" />
  </svg>
);

const BishopWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      d="M 50 15 L 60 20 L 55 28 Q 50 25, 45 28 L 40 20 Z"
      fill="currentColor"
    />
    <rect x="48" y="28" width="4" height="15" fill="currentColor" rx="2" />
    <rect x="38" y="43" width="24" height="5" fill="currentColor" rx="1" />
    <rect x="34" y="48" width="32" height="4" fill="currentColor" rx="1" />
    <rect x="30" y="52" width="40" height="8" fill="currentColor" rx="2" />
  </svg>
);

const KnightWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      d="M 30 45 L 38 30 L 45 25 L 52 28 L 60 35 L 62 45 L 62 52 L 58 58 L 50 62 L 38 60 L 30 58 Z"
      fill="currentColor"
    />
    <path
      d="M 38 30 Q 40 28, 45 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="52" cy="32" r="3" fill="currentColor" />
    <rect x="32" y="55" width="30" height="4" fill="currentColor" rx="1" />
    <rect x="28" y="59" width="38" height="8" fill="currentColor" rx="2" />
  </svg>
);

const PawnWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="30" r="7" fill="currentColor" />
    <ellipse cx="50" cy="42" rx="12" ry="5" fill="currentColor" />
    <rect x="40" y="42" width="20" height="6" fill="currentColor" rx="2" />
    <rect x="36" y="48" width="28" height="4" fill="currentColor" rx="1" />
    <rect x="32" y="52" width="36" height="8" fill="currentColor" rx="2" />
  </svg>
);

// Black pieces
const KingBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="30" r="5" fill="currentColor" />
    <line
      x1="50"
      y1="35"
      x2="50"
      y2="45"
      stroke="currentColor"
      strokeWidth="3"
    />
    <rect x="42" y="45" width="16" height="6" fill="currentColor" rx="1" />
    <rect x="38" y="51" width="24" height="5" fill="currentColor" rx="1" />
    <rect x="34" y="56" width="32" height="4" fill="currentColor" rx="1" />
    <rect x="30" y="60" width="40" height="8" fill="currentColor" rx="2" />
    <path
      d="M 48 18 L 50 15 L 52 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const QueenBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="25" r="6" fill="currentColor" />
    <path
      d="M 35 30 L 40 35 L 50 32 L 60 35 L 65 30 L 62 42 L 38 42 Z"
      fill="currentColor"
    />
    <rect x="36" y="42" width="28" height="5" fill="currentColor" rx="1" />
    <rect x="32" y="47" width="36" height="4" fill="currentColor" rx="1" />
    <rect x="28" y="51" width="44" height="8" fill="currentColor" rx="2" />
    <polygon
      points="40,20 45,25 50,18 55,25 60,20 55,30 45,30"
      fill="currentColor"
    />
  </svg>
);

const RookBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="40" y="25" width="20" height="6" fill="currentColor" rx="1" />
    <rect x="38" y="31" width="24" height="5" fill="currentColor" rx="1" />
    <rect x="36" y="36" width="28" height="8" fill="currentColor" rx="1" />
    <rect x="34" y="44" width="32" height="4" fill="currentColor" rx="1" />
    <rect x="30" y="48" width="40" height="10" fill="currentColor" rx="2" />
    <rect x="38" y="22" width="4" height="4" fill="currentColor" />
    <rect x="58" y="22" width="4" height="4" fill="currentColor" />
  </svg>
);

const BishopBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      d="M 50 15 L 60 20 L 55 28 Q 50 25, 45 28 L 40 20 Z"
      fill="currentColor"
    />
    <rect x="48" y="28" width="4" height="15" fill="currentColor" rx="2" />
    <rect x="38" y="43" width="24" height="5" fill="currentColor" rx="1" />
    <rect x="34" y="48" width="32" height="4" fill="currentColor" rx="1" />
    <rect x="30" y="52" width="40" height="8" fill="currentColor" rx="2" />
  </svg>
);

const KnightBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      d="M 30 45 L 38 30 L 45 25 L 52 28 L 60 35 L 62 45 L 62 52 L 58 58 L 50 62 L 38 60 L 30 58 Z"
      fill="currentColor"
    />
    <path
      d="M 38 30 Q 40 28, 45 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="52" cy="32" r="3" fill="currentColor" />
    <rect x="32" y="55" width="30" height="4" fill="currentColor" rx="1" />
    <rect x="28" y="59" width="38" height="8" fill="currentColor" rx="2" />
  </svg>
);

const PawnBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="30" r="7" fill="currentColor" />
    <ellipse cx="50" cy="42" rx="12" ry="5" fill="currentColor" />
    <rect x="40" y="42" width="20" height="6" fill="currentColor" rx="2" />
    <rect x="36" y="48" width="28" height="4" fill="currentColor" rx="1" />
    <rect x="32" y="52" width="36" height="8" fill="currentColor" rx="2" />
  </svg>
);

const pieceComponents: Record<PieceColor, Record<PieceType, React.FC>> = {
  white: {
    king: KingWhite,
    queen: QueenWhite,
    rook: RookWhite,
    bishop: BishopWhite,
    knight: KnightWhite,
    pawn: PawnWhite,
  },
  black: {
    king: KingBlack,
    queen: QueenBlack,
    rook: RookBlack,
    bishop: BishopBlack,
    knight: KnightBlack,
    pawn: PawnBlack,
  },
};

export const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
  const PieceComponent = pieceComponents[piece.color][piece.type];

  return (
    <div
      className={`chess-piece cursor-pointer select-none transition-all duration-200 hover:scale-110`}
      data-color={piece.color}
    >
      <div className="piece-icon w-full h-full flex items-center justify-center text-[clamp(1.5rem,5vw,3.5rem)]">
        <PieceComponent />
      </div>

      <style>{`
        .chess-piece {
          transform-style: preserve-3d;
        }
        
        .chess-piece[data-color="white"] .piece-icon {
          color: #ffffff;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        
        .chess-piece[data-color="black"] .piece-icon {
          color: #1a1a1a;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.8));
        }
      `}</style>
    </div>
  );
};
