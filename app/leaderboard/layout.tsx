import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chess Leaderboard | Chess Master",
  description:
    "See the top chess players on the Chess Master global leaderboard.",
  keywords: [
    "chess leaderboard",
    "chess ratings",
    "top chess players",
    "online chess",
    "play chess",
    "chess game",
    "ranking",
    "Chess Master",
  ],
  openGraph: {
    title: "Chess Leaderboard | Chess Master",
    description:
      "View global, friends, and country chess rankings. Check out top chess players and their stats.",
    url: "https://your-domain.com/leaderboard",
    siteName: "Chess Master",
    type: "website",
    images: [
      {
        url: "/og/leaderboard.png",
        width: 1200,
        height: 630,
        alt: "Chess Master leaderboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess Leaderboard | Chess Master",
    description: "See the top chess players and their ratings on Chess Master.",
    images: ["/og/leaderboard.png"],
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[100dvh] w-full">{children}</div>;
}
