"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

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
            "group toast group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-slate-900/98 group-[.toaster]:via-slate-800/95 group-[.toaster]:to-slate-900/98 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-slate-700/50 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-violet-500/30 group-[.toaster]:ring-1 group-[.toaster]:ring-violet-500/20",
          description: "group-[.toast]:text-slate-200/90",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-violet-600 group-[.toast]:to-purple-600 group-[.toast]:text-white group-[.toast]:hover:from-violet-700 group-[.toast]:hover:to-purple-700 group-[.toast]:shadow-lg group-[.toast]:shadow-violet-500/30",
          cancelButton:
            "group-[.toast]:bg-slate-700/80 group-[.toast]:text-slate-300 group-[.toast]:hover:bg-slate-600/80 group-[.toast]:backdrop-blur-sm",
          success:
            "group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-emerald-600/95 group-[.toaster]:via-emerald-500/90 group-[.toaster]:to-emerald-600/95 group-[.toaster]:border-emerald-400/50 group-[.toaster]:text-white group-[.toaster]:shadow-emerald-500/40 group-[.toaster]:ring-emerald-400/30",
          error:
            "group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-red-600/95 group-[.toaster]:via-red-500/90 group-[.toaster]:to-red-600/95 group-[.toaster]:border-red-400/50 group-[.toaster]:text-white group-[.toaster]:shadow-red-500/40 group-[.toaster]:ring-red-400/30",
          warning:
            "group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-amber-600/95 group-[.toaster]:via-amber-500/90 group-[.toaster]:to-amber-600/95 group-[.toaster]:border-amber-400/50 group-[.toaster]:text-white group-[.toaster]:shadow-amber-500/40 group-[.toaster]:ring-amber-400/30",
          info: "group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-blue-600/95 group-[.toaster]:via-indigo-500/90 group-[.toaster]:to-blue-600/95 group-[.toaster]:border-blue-400/50 group-[.toaster]:text-white group-[.toaster]:shadow-blue-500/40 group-[.toaster]:ring-blue-400/30",
        },
      }}
      closeButton={false}
      position="top-center"
      richColors
      expand={true}
      duration={4000}
      {...props}
    />
  );
};

export { Toaster };
