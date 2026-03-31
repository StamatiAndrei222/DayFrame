import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dayframe",
  description:
    "Dayframe helps you transform messy goals into clear, prioritized daily action.",
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
