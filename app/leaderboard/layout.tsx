import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chess Leaderboard | Top Players & Rankings | Chess Master",
  description:
    "View the global chess leaderboard and see top-ranked players worldwide. Track ratings, wins, losses, and compete to become the #1 Chess Master. See where you rank among the best.",
  keywords: [
    "chess leaderboard",
    "chess rankings",
    "top chess players",
    "chess ratings",
    "chess tournament",
    "chess competition",
    "best chess players",
    "chess statistics",
    "global chess leaderboard",
    "Chess Master",
  ],
  authors: [
    { name: "Chess Master Team", url: process.env.NEXT_PUBLIC_APP_URL! },
  ],
  creator: "Chess Master Team",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  openGraph: {
    title: "Chess Leaderboard | Top Players & Rankings | Chess Master",
    description:
      "View the global chess leaderboard and see top-ranked players worldwide. Track your progress and compete to become the #1 Chess Master.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/leaderboard`,
    siteName: "Chess Master",
    type: "website",
    images: [
      {
        url: "/og/leaderboard.png",
        width: 1200,
        height: 630,
        alt: "Chess Master global leaderboard",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess Leaderboard | Top Players & Rankings",
    description:
      "View the global chess leaderboard and see top-ranked players. Track your progress and compete to become #1.",
    images: ["/og/leaderboard.png"],
    creator: "@chessmasterteam",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/leaderboard`,
  },
  category: "Games",
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
