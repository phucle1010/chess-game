"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Crown, Users } from "lucide-react";
import { useMemo } from "react";

import { useTopPlayers } from "@/actions/useUsers";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LeaderboardPageContent() {
  const router = useRouter();
  const { data: users = [], isLoading } = useTopPlayers(100);

  const topPlayers = useMemo(() => {
    return users
      .map((user, index) => ({
        rank: index + 1,
        name: user.username,
        rating: user.rating,
        avatar: "",
        wins: user.wins || 0,
        losses: user.losses || 0,
        draws: user.draws || 0,
        id: user.id,
      }))
      .filter((user) => user.rating > 0 || user.wins > 0 || user.losses > 0);
  }, [users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-purple-200 hover:text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-10 w-10 text-amber-400" />
            <h1 className="text-white">Global Leaderboard</h1>
          </div>
          <p className="text-purple-200">
            Top chess players from around the world
          </p>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="bg-white/10 border-white/20 mb-6">
            <TabsTrigger
              value="global"
              className="data-[state=active]:bg-violet-600"
            >
              Global
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-violet-600"
            >
              Friends
            </TabsTrigger>
            <TabsTrigger
              value="country"
              className="data-[state=active]:bg-violet-600"
            >
              Country
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[...Array(3)].map((_, i) => (
                  <Card
                    key={i}
                    className="bg-white/10 backdrop-blur-md border-white/20 animate-pulse"
                  >
                    <CardHeader className="text-center pb-3">
                      <div className="h-20 w-20 bg-white/10 rounded-full mx-auto mb-4" />
                      <div className="h-6 bg-white/10 rounded w-24 mx-auto mb-2" />
                      <div className="h-8 bg-white/10 rounded w-16 mx-auto" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : topPlayers.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">
                    No players found. Be the first to play and appear on the
                    leaderboard!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {topPlayers.slice(0, 3).map((player, index) => (
                    <Card
                      key={player.id}
                      className={`bg-white/10 backdrop-blur-md border-white/20 ${
                        index === 0
                          ? "md:order-2 md:scale-105"
                          : index === 1
                            ? "md:order-1"
                            : "md:order-3"
                      }`}
                    >
                      <CardHeader className="text-center pb-3">
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <Avatar className="h-20 w-20 ring-4 ring-offset-2 ring-offset-transparent ring-amber-400">
                              <AvatarImage
                                src={player.avatar}
                                alt={player.name}
                              />
                              <AvatarFallback className="bg-violet-600 text-white">
                                {player.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0
                                  ? "bg-yellow-400 text-yellow-900"
                                  : index === 1
                                    ? "bg-slate-400 text-slate-900"
                                    : "bg-amber-600 text-amber-100"
                              }`}
                            >
                              {player.rank}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-white">
                          {player.name}
                        </CardTitle>
                        <div className="text-2xl text-amber-400 mt-2">
                          {player.rating}
                        </div>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-slate-400">
                          {player.wins}W / {player.losses}L
                          {player.draws > 0 && ` / ${player.draws}D`}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {topPlayers.length > 3 && (
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="p-0">
                      <div className="divide-y divide-white/10">
                        {topPlayers.slice(3).map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                          >
                            <div className="w-12 text-center">
                              <span className="text-2xl text-slate-400">
                                #{player.rank}
                              </span>
                            </div>

                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={player.avatar}
                                alt={player.name}
                              />
                              <AvatarFallback className="bg-violet-600 text-white">
                                {player.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <h3 className="text-white font-semibold">
                                {player.name}
                              </h3>
                              <p className="text-sm text-slate-400">
                                {player.wins}W / {player.losses}L
                                {player.draws > 0 && ` / ${player.draws}D`}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xl text-amber-400 font-bold">
                                {player.rating}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="friends">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">
                  Connect with friends to see their rankings
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="country">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <p className="text-slate-400">
                  Country leaderboards coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
