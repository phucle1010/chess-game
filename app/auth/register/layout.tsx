import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Create Account - Chess Master",
  description:
    "Create your Chess Master account to start playing online chess, track your progress, compete on leaderboards, and challenge players worldwide.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/register`,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
