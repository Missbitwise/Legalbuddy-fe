import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalBuddy — AI Legal Assistant Grounded in RAG",
  description:
    "Ask legal questions, dictate queries, engage in voice calls, and analyze legal documents with AI grounded in statutory context.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
