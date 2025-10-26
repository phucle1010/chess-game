import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Chess Game | Chess Master",
  description:
    "Play chess with friends or the computer online. Experience beautiful visuals, real-time moves, and global gameplay.",
  keywords: [
    "online chess",
    "play chess",
    "chess game",
    "multiplayer chess",
    "chess app",
    "game vs computer",
    "Chess Master",
  ],
  openGraph: {
    title: "Online Chess Game | Chess Master",
    description:
      "Enjoy interactive chess online with global leaderboards, beautiful board visuals, and seamless gameplay.",
    url: "https://your-domain.com/game",
    siteName: "Chess Master",
    type: "website",
    images: [
      {
        url: "/og/game.png",
        width: 1200,
        height: 630,
        alt: "Chess Master game preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Chess Game | Chess Master",
    description:
      "Play online chess and challenge your friends on Chess Master.",
    images: ["/og/game.png"],
  },
};

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[100dvh] w-full">{children}</div>;
}
