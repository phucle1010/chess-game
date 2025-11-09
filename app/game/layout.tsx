import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play Online Chess Game | Chess Master - Real-time Multiplayer",
  description:
    "Play chess online with friends or challenge AI opponents. Experience beautiful 3D visuals, real-time moves, live chat, and competitive gameplay. Join thousands of players worldwide.",
  keywords: [
    "online chess",
    "play chess",
    "chess game",
    "multiplayer chess",
    "chess app",
    "game vs computer",
    "chess AI",
    "real-time chess",
    "chess tournament",
    "Chess Master",
  ],
  authors: [
    { name: "Chess Master Team", url: process.env.NEXT_PUBLIC_APP_URL! },
  ],
  creator: "Chess Master Team",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  openGraph: {
    title: "Play Online Chess Game | Chess Master",
    description:
      "Enjoy interactive chess online with global leaderboards, beautiful 3D board visuals, and seamless real-time gameplay. Challenge friends or AI opponents.",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/game`,
    siteName: "Chess Master",
    type: "website",
    images: [
      {
        url: "/og/game.png",
        width: 1200,
        height: 630,
        alt: "Chess Master online chess game preview",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Play Online Chess Game | Chess Master",
    description:
      "Play online chess and challenge your friends or AI opponents on Chess Master. Real-time multiplayer gameplay with beautiful 3D visuals.",
    images: ["/og/game.png"],
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
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/game`,
  },
  category: "Games",
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[100dvh] w-full">{children}</div>;
}
