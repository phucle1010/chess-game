"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay to not interrupt user experience
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show again for this session
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  // Don't show if dismissed in this session
  useEffect(() => {
    if (localStorage.getItem("pwa-install-dismissed") === "true") {
      setShowPrompt(false);
    }
  }, []);

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-gradient-to-br from-violet-600/95 via-purple-600/95 to-indigo-600/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">
              Install Chess Master
            </h3>
            <p className="text-purple-100 text-sm mb-3">
              Install our app for a better experience. Play chess offline and
              access it quickly from your home screen.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="bg-white text-violet-600 hover:bg-white/90"
                size="sm"
              >
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-purple-100 hover:text-white hover:bg-white/10"
              >
                Maybe later
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-purple-200 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
