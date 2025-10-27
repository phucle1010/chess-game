import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveHistoryProps {
  moves: string[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  // Group moves into pairs (white, black)
  const movePairs: Array<[string, string?]> = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push([moves[i], moves[i + 1]]);
  }

  return (
    <Card className="bg-slate-800/80 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white">Move History</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ScrollArea className="h-[300px] pr-4">
          {movePairs.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No moves yet</p>
          ) : (
            <div className="space-y-1">
              {movePairs.map((pair, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[auto_1fr_1fr] gap-3 py-2 px-3 rounded hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-slate-500">{index + 1}.</span>
                  <span className="text-white font-mono text-sm">
                    {pair[0]}
                  </span>
                  <span className="text-slate-300 font-mono text-sm">
                    {pair[1] || ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
