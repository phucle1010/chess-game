"use client";

import { Crown, Play, Trophy, Users, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useSignOut } from "@/actions/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { data: user } = useAuth();
  const { mutate: signOut } = useSignOut();

  const onNavigate = (
    page: "game" | "leaderboard" | "rooms" | "auth/login"
  ) => {
    router.push(page);
  };

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-16 w-16 text-amber-400" />
            <h1 className="text-white text-6xl">Chess Master</h1>
          </div>
          <p className="text-purple-200 text-xl">
            Challenge players worldwide in the ultimate chess experience
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            {user ? (
              <>
                <span className="text-purple-200">
                  Welcome, {user.username}!
                </span>
                <Button onClick={handleSignOut} variant="outline">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => onNavigate("auth/login")}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Quick Play Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-violet-600">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Quick Play</CardTitle>
              </div>
              <CardDescription className="text-purple-200">
                Jump into a game immediately with random matchmaking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => onNavigate("rooms")}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white group-hover:scale-105 transition-transform"
              >
                Start Game
              </Button>
            </CardContent>
          </Card>

          {/* Create Game Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-amber-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Play with Friend</CardTitle>
              </div>
              <CardDescription className="text-purple-200">
                Create a private game and invite your friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => onNavigate("rooms")}
                variant="outline"
                className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 group-hover:scale-105 transition-transform"
              >
                Create Room
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-green-500/20 mb-3">
                  <Trophy className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-white mb-2">Ranked Matches</h3>
                <p className="text-purple-200 text-sm">
                  Climb the ladder and prove your skills
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-blue-500/20 mb-3">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-white mb-2">Live Chat</h3>
                <p className="text-purple-200 text-sm">
                  Communicate with your opponent
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-amber-500/20 mb-3">
                  <Crown className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-white mb-2">Leaderboards</h3>
                <p className="text-purple-200 text-sm">
                  Compete for the top spot globally
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Link */}
        <div className="text-center">
          <Button
            onClick={() => onNavigate("leaderboard")}
            variant="ghost"
            className="text-purple-200 hover:text-white hover:bg-white/10"
          >
            <Trophy className="h-4 w-4 mr-2" />
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}
