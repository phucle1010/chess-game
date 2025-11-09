import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Chess Master - Sign In to Play Chess Online",
  description:
    "Sign in to Chess Master to play online chess, track your progress, compete on the leaderboard, and challenge players worldwide.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
