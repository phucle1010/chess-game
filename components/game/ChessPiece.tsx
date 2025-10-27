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

// SVG Chess Pieces Components
const KingWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="5" fill="currentColor" />
    <rect x="40" y="55" width="20" height="8" fill="currentColor" />
    <rect x="35" y="63" width="30" height="6" fill="currentColor" />
    <rect x="32" y="69" width="36" height="4" fill="currentColor" />
    <path
      d="M 45 55 L 50 45 L 55 55"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
  </svg>
);

const QueenWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="40" r="5" fill="currentColor" />
    <path
      d="M 40 45 Q 45 50, 50 45 Q 55 50, 60 45 L 55 55 L 50 52 L 45 55 Z"
      fill="currentColor"
    />
    <rect x="35" y="60" width="30" height="6" fill="currentColor" />
    <rect x="32" y="66" width="36" height="4" fill="currentColor" />
  </svg>
);

const RookWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="40" y="40" width="20" height="8" fill="currentColor" />
    <rect x="38" y="48" width="24" height="8" fill="currentColor" />
    <rect x="35" y="56" width="30" height="6" fill="currentColor" />
    <rect x="32" y="62" width="36" height="4" fill="currentColor" />
  </svg>
);

const BishopWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="40" r="6" fill="currentColor" />
    <path d="M 50 45 L 35 65 L 65 65 Z" fill="currentColor" />
    <rect x="32" y="65" width="36" height="4" fill="currentColor" />
  </svg>
);

const KnightWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      d="M 35 50 L 40 45 L 50 40 L 60 42 L 65 48 L 65 60 L 35 60 Z"
      fill="currentColor"
    />
    <circle
      cx="55"
      cy="42"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect x="32" y="60" width="36" height="4" fill="currentColor" />
  </svg>
);

const PawnWhite = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="45" r="8" fill="currentColor" />
    <rect x="42" y="55" width="16" height="12" fill="currentColor" />
  </svg>
);

// Black piece variants with subtle outline
const KingBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="50" r="5" fill="currentColor" />
    <rect x="40" y="55" width="20" height="8" fill="currentColor" />
    <rect x="35" y="63" width="30" height="6" fill="currentColor" />
    <rect x="32" y="69" width="36" height="4" fill="currentColor" />
    <path
      d="M 45 55 L 50 45 L 55 55"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    />
  </svg>
);

const QueenBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="40" r="5" fill="currentColor" />
    <path
      d="M 40 45 Q 45 50, 50 45 Q 55 50, 60 45 L 55 55 L 50 52 L 45 55 Z"
      fill="currentColor"
    />
    <rect x="35" y="60" width="30" height="6" fill="currentColor" />
    <rect x="32" y="66" width="36" height="4" fill="currentColor" />
  </svg>
);

const RookBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="40" y="40" width="20" height="8" fill="currentColor" />
    <rect x="38" y="48" width="24" height="8" fill="currentColor" />
    <rect x="35" y="56" width="30" height="6" fill="currentColor" />
    <rect x="32" y="62" width="36" height="4" fill="currentColor" />
  </svg>
);

const BishopBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="40" r="6" fill="currentColor" />
    <path d="M 50 45 L 35 65 L 65 65 Z" fill="currentColor" />
    <rect x="32" y="65" width="36" height="4" fill="currentColor" />
  </svg>
);

const KnightBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path
      d="M 35 50 L 40 45 L 50 40 L 60 42 L 65 48 L 65 60 L 35 60 Z"
      fill="currentColor"
    />
    <circle
      cx="55"
      cy="42"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect x="32" y="60" width="36" height="4" fill="currentColor" />
  </svg>
);

const PawnBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <circle cx="50" cy="45" r="8" fill="currentColor" />
    <rect x="42" y="55" width="16" height="12" fill="currentColor" />
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
