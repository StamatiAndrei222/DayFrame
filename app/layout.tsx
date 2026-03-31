import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Dayframe",
    template: "%s | Dayframe",
  },
  description:
    "Dayframe helps you transform messy goals into clear, prioritized daily action.",
  applicationName: "Dayframe",
  keywords: [
    "productivity assistant",
    "task planner",
    "next.js portfolio project",
    "ai productivity",
    "daily planning",
  ],
  openGraph: {
    title: "Dayframe",
    description:
      "A calm productivity assistant that turns messy goals into prioritized tasks and a focused today plan.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dayframe",
    description:
      "Plan your day with calm clarity using task prioritization, today planning, and mock AI suggestions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
