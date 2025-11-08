import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Chess Master | Online Chess Game & Leaderboard",
  description:
    "Play chess online, track your progress, and view the global chess leaderboard. Challenge your friends and become a Chess Master.",
  keywords: [
    "chess",
    "online chess",
    "chess game",
    "leaderboard",
    "multiplayer chess",
    "play chess online",
    "chess ratings",
    "chess master",
  ],
  authors: [{ name: "Chess Master Team", url: "https://your-domain.com" }],
  creator: "Chess Master Team",
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "Chess Master | Online Chess Game & Leaderboard",
    description:
      "Play, compete and rise to the top – see the best chess players worldwide.",
    url: "https://your-domain.com",
    siteName: "Chess Master",
    type: "website",
    images: [
      {
        url: "/og/main.png",
        width: 1200,
        height: 630,
        alt: "Chess Master Open Graph Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess Master | Play Chess Online & Track Your Ranking",
    description:
      "Join Chess Master to compete against top players online and view real-time chess leaderboards.",
    images: ["/og/main.png"],
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* SEO Enhancements */}
        <meta name="theme-color" content="#4f46e5" />
        <link rel="canonical" href="https://your-domain.com/" />
      </head>
      <body
        className={`${roboto.variable} antialiased bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 `}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Chess Master",
              url: "https://your-domain.com",
              description:
                "Play chess online, track your progress, and view the global chess leaderboard. Challenge your friends and become a Chess Master.",
              publisher: {
                "@type": "Organization",
                name: "Chess Master Team",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
