import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Chess Master - Recover Your Account",
  description:
    "Reset your Chess Master account password. Enter your email to receive a password reset link and regain access to your account.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
