import { Card, CardContent } from "../ui/card";
import { Target } from "lucide-react";

export const BoardLegend: React.FC = () => {
  return (
    <Card className="bg-slate-800/80 border-slate-700">
      <CardContent className="p-4">
        <h4 className="text-white mb-3 text-sm">Board Indicators</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded border-2 border-yellow-600 flex-shrink-0" />
            <span className="text-slate-300">Selected piece</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-300 rounded flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-violet-500 ring-1 ring-violet-400" />
            </div>
            <span className="text-slate-300">Legal move</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-300 rounded border-2 border-red-500 flex items-center justify-center flex-shrink-0 relative">
              <Target className="w-3 h-3 text-red-500 absolute top-0 right-0" />
            </div>
            <span className="text-slate-300">Capture available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
