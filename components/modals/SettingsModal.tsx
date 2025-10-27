import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
          <DialogDescription className="text-slate-400">
            Customize your chess experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sound Settings */}
          <div className="space-y-4">
            <h3 className="text-sm text-slate-300">Sound</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects" className="text-slate-200">
                Sound Effects
              </Label>
              <Switch id="sound-effects" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="voice-chat" className="text-slate-200">
                Voice Chat
              </Label>
              <Switch id="voice-chat" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume" className="text-slate-200">
                Volume
              </Label>
              <Slider
                id="volume"
                defaultValue={[70]}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Display Settings */}
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <h3 className="text-sm text-slate-300">Display</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="highlight-moves" className="text-slate-200">
                Highlight Legal Moves
              </Label>
              <Switch id="highlight-moves" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-coords" className="text-slate-200">
                Show Coordinates
              </Label>
              <Switch id="show-coords" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="board-theme" className="text-slate-200">
                Board Theme
              </Label>
              <Select defaultValue="classic">
                <SelectTrigger
                  id="board-theme"
                  className="bg-slate-700 border-slate-600"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="marble">Marble</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <h3 className="text-sm text-slate-300">Gameplay</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-queen" className="text-slate-200">
                Auto-Queen Promotion
              </Label>
              <Switch id="auto-queen" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="confirm-moves" className="text-slate-200">
                Confirm Moves
              </Label>
              <Switch id="confirm-moves" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-control" className="text-slate-200">
                Default Time Control
              </Label>
              <Select defaultValue="10">
                <SelectTrigger
                  id="time-control"
                  className="bg-slate-700 border-slate-600"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="3">3 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
