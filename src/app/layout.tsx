import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormAI — AI-Powered Workout Form Analyzer",
  description:
    "Upload any workout video and get instant, expert-level biomechanical feedback. Fix your form, prevent injuries, hit new PRs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
