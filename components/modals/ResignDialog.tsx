"use client";

import { Flag } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ResignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ResignDialog({
  open,
  onOpenChange,
  onConfirm,
}: ResignDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Flag className="h-6 w-6 text-red-400" />
            Resign Game?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400 text-base leading-relaxed">
            Are you sure you want to resign? This will end the game immediately
            and you will lose.
            <span className="block mt-2 font-semibold text-red-400">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl"
          >
            <Flag className="mr-2 h-4 w-4" />
            Yes, Resign
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
