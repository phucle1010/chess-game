"use client";

import { Crown } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/actions/useAuth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, isFetching, data } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (data === undefined) return;
    setIsInitialLoad(false);
  }, [data]);

  if (isInitialLoad && (isLoading || isFetching)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 relative overflow-hidden">
        {/* 3D Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Loading Card */}
        <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl rounded-2xl p-12 max-w-md w-full">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Crown Icon with Gradient Background */}
            <div className="relative">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg animate-pulse">
                <Crown className="h-12 w-12 text-white" />
              </div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 border-t-purple-400 animate-spin" />
            </div>

            {/* Loading Dots Animation */}
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
