import { HelpCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PieceGuide: React.FC = () => {
  const pieces = [
    {
      name: "Pawn",
      symbol: "♟",
      moves: [
        "Moves forward one square",
        "Can move two squares on first move",
        "Captures diagonally one square",
        "Promotes to any piece when reaching the opposite end",
      ],
    },
    {
      name: "Rook",
      symbol: "♜",
      moves: [
        "Moves any number of squares horizontally or vertically",
        "Cannot jump over pieces",
        "Great for controlling files and ranks",
      ],
    },
    {
      name: "Knight",
      symbol: "♞",
      moves: [
        'Moves in an "L" shape: 2 squares in one direction, 1 square perpendicular',
        "Only piece that can jump over others",
        "Always lands on opposite colored square",
      ],
    },
    {
      name: "Bishop",
      symbol: "♝",
      moves: [
        "Moves any number of squares diagonally",
        "Cannot jump over pieces",
        "Each bishop stays on one color throughout the game",
      ],
    },
    {
      name: "Queen",
      symbol: "♛",
      moves: [
        "Moves any number of squares in any direction",
        "Combines the power of rook and bishop",
        "Most powerful piece on the board",
      ],
    },
    {
      name: "King",
      symbol: "♚",
      moves: [
        "Moves one square in any direction",
        "Must be protected at all costs",
        "Can castle with rook under special conditions",
      ],
    },
  ];

  return (
    <Card className="bg-slate-800/80 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-violet-400" />
          <CardTitle className="text-white">Piece Guide</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="pawn" className="w-full">
          <div className="px-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1 bg-slate-900/50 p-1 !h-fit">
              {pieces.map((piece) => (
                <TabsTrigger
                  key={piece.name.toLowerCase()}
                  value={piece.name.toLowerCase()}
                  className="data-[state=active]:bg-violet-600 text-2xl"
                >
                  {piece.symbol}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="h-[200px] px-4 pt-4">
            {pieces.map((piece) => (
              <TabsContent
                key={piece.name.toLowerCase()}
                value={piece.name.toLowerCase()}
                className="mt-0"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{piece.symbol}</span>
                    <h3 className="text-white text-xl">{piece.name}</h3>
                  </div>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    {piece.moves.map((move, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-violet-400 mt-1">•</span>
                        <span>{move}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};
