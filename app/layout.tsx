import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "UniStayConnect - Student Accommodation Platform",
  description: "Find your perfect student accommodation near your university",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative flex h-auto min-h-screen w-full flex-col bg-white overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

