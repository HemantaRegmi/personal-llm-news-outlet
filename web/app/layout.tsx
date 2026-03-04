import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Weekly | Evidence-Based Tech News",
  description:
    "A professional weekly digest for software development, computer science, and AI/ML with objective summaries and source links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
