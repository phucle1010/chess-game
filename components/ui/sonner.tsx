"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

type ToasterProps_ = ToasterProps;

const Toaster = ({ ...props }: ToasterProps_) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps_["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-800/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-white group-[.toaster]:border-slate-700 group-[.toaster]:shadow-lg group-[.toaster]:shadow-violet-500/20",
          description: "group-[.toast]:text-slate-300",
          actionButton:
            "group-[.toast]:bg-violet-600 group-[.toast]:text-white group-[.toast]:hover:bg-violet-700",
          cancelButton:
            "group-[.toast]:bg-slate-700 group-[.toast]:text-slate-300 group-[.toast]:hover:bg-slate-600",
          success:
            "group-[.toaster]:bg-emerald-600/95 group-[.toaster]:border-emerald-500 group-[.toaster]:text-white group-[.toaster]:shadow-emerald-500/20",
          error:
            "group-[.toaster]:bg-red-600/95 group-[.toaster]:border-red-500 group-[.toaster]:text-white group-[.toaster]:shadow-red-500/20",
          warning:
            "group-[.toaster]:bg-amber-600/95 group-[.toaster]:border-amber-500 group-[.toaster]:text-white group-[.toaster]:shadow-amber-500/20",
          info: "group-[.toaster]:bg-blue-600/95 group-[.toaster]:border-blue-500 group-[.toaster]:text-white group-[.toaster]:shadow-blue-500/20",
        },
      }}
      icons={{
        success: <CheckCircle2 className="h-5 w-5" />,
        error: <XCircle className="h-5 w-5" />,
        warning: <AlertCircle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
      }}
      closeButton
      position="top-right"
      richColors
      {...props}
    />
  );
};

export { Toaster };
