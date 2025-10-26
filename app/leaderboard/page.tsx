"use client";

import { ArrowLeft, Crown, TrendingUp, TrendingDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

const topPlayers = [
  {
    rank: 1,
    name: "Magnus C.",
    rating: 2850,
    change: "+15",
    avatar: "",
    wins: 342,
    losses: 28,
  },
  {
    rank: 2,
    name: "Hikaru N.",
    rating: 2820,
    change: "+8",
    avatar: "",
    wins: 298,
    losses: 35,
  },
  {
    rank: 3,
    name: "Fabiano C.",
    rating: 2805,
    change: "-5",
    avatar: "",
    wins: 276,
    losses: 42,
  },
  {
    rank: 4,
    name: "Ding L.",
    rating: 2795,
    change: "+12",
    avatar: "",
    wins: 265,
    losses: 38,
  },
  {
    rank: 5,
    name: "Ian N.",
    rating: 2785,
    change: "+3",
    avatar: "",
    wins: 251,
    losses: 45,
  },
  {
    rank: 6,
    name: "Alireza F.",
    rating: 2780,
    change: "+20",
    avatar: "",
    wins: 234,
    losses: 31,
  },
  {
    rank: 7,
    name: "Wesley S.",
    rating: 2775,
    change: "-2",
    avatar: "",
    wins: 223,
    losses: 48,
  },
  {
    rank: 8,
    name: "Levon A.",
    rating: 2770,
    change: "+7",
    avatar: "",
    wins: 218,
    losses: 52,
  },
];

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {topPlayers.slice(0, 3).map((player, index) => (
                <Card
                  key={player.rank}
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
                          <AvatarImage src={player.avatar} alt={player.name} />
                          <AvatarFallback className="bg-violet-600 text-white">
                            {player.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
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
                    <CardTitle className="text-white">{player.name}</CardTitle>
                    <div className="text-2xl text-amber-400 mt-2">
                      {player.rating}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge
                      variant={
                        player.change.startsWith("+")
                          ? "default"
                          : "destructive"
                      }
                      className={
                        player.change.startsWith("+")
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {player.change.startsWith("+") ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {player.change}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Rest of leaderboard */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-0">
                <div className="divide-y divide-white/10">
                  {topPlayers.slice(3).map((player) => (
                    <div
                      key={player.rank}
                      className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="w-12 text-center">
                        <span className="text-2xl text-slate-400">
                          #{player.rank}
                        </span>
                      </div>

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback className="bg-violet-600 text-white">
                          {player.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="text-white">{player.name}</h3>
                        <p className="text-sm text-slate-400">
                          {player.wins}W / {player.losses}L
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl text-amber-400">
                          {player.rating}
                        </p>
                        <Badge
                          variant={
                            player.change.startsWith("+")
                              ? "default"
                              : "destructive"
                          }
                          className={`text-xs ${
                            player.change.startsWith("+")
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {player.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
