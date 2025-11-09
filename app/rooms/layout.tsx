import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chess Rooms | Create & Join Game Rooms | Chess Master",
  description:
    "Create or join chess game rooms to play with friends or AI opponents. Choose your difficulty level, invite players, and start playing instantly. Find the perfect chess match.",
  keywords: [
    "chess rooms",
    "create chess room",
    "join chess game",
    "chess multiplayer",
    "chess lobby",
    "chess matchmaking",
    "private chess game",
    "chess room list",
    "Chess Master",
  ],
  authors: [
    { name: "Chess Master Team", url: process.env.NEXT_PUBLIC_APP_URL! },
  ],
  creator: "Chess Master Team",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  openGraph: {
    title: "Chess Rooms | Create & Join Game Rooms | Chess Master",
    description:
      "Create or join chess game rooms. Play with friends, challenge AI opponents, or find random matches. Start your chess journey today.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/rooms`,
    siteName: "Chess Master",
    type: "website",
    images: [
      {
        url: "/og/rooms.png",
        width: 1200,
        height: 630,
        alt: "Chess Master game rooms",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess Rooms | Create & Join Game Rooms",
    description:
      "Create or join chess game rooms to play with friends or AI. Find the perfect match and start playing instantly.",
    images: ["/og/rooms.png"],
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
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/rooms`,
  },
  category: "Games",
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
