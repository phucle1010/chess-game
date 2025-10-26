import { useState, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export const HelpTooltip: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show help tooltip after 2 seconds on first visit
    const hasSeenHelp = localStorage.getItem("chess-help-seen");
    if (!hasSeenHelp) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("chess-help-seen", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4 duration-500">
      <Card className="bg-gradient-to-br from-violet-600 to-purple-600 border-violet-400 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-yellow-400 rounded-full">
              <Lightbulb className="h-5 w-5 text-violet-900" />
            </div>
            <div className="flex-1">
              <h4 className="text-white mb-2">💡 Tip: Move Suggestions</h4>
              <p className="text-violet-100 text-sm">
                Click on any piece to see all legal moves highlighted on the
                board. Blue circles show where you can move!
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="flex-shrink-0 text-white hover:bg-white/20 -mr-2 -mt-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
