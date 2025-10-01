import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // IMPORTANT: ensures Open Graph/Twitter images resolve to absolute URLs
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kedaar.dev"
  ),
  title: "Kedaar's Mac",
  description: "Kedaar's Personal Portfolio",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    url: "/",
    title: "Kedaar's Mac",
    description: "Kedaar's Personal Portfolio",
    images: [
      {
        url: "/images/og-kedaar.png",
        width: 1200,
        height: 630,
        alt: "Kedaar's Mac",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kedaar's Mac",
    description: "Kedaar's Personal Portfolio",
    images: ["/images/og-kedaar.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
