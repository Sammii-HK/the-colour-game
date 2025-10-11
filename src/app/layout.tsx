import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Daily CSS Colour - Discover Beautiful CSS Colors Every Day",
  description: "Get a new CSS named colour delivered to your inbox every morning. Discover beautiful colours, learn their values, and get inspired for your next design project.",
  keywords: ["CSS", "colors", "colours", "design", "web development", "daily", "email", "newsletter"],
  authors: [{ name: "Daily CSS Colour" }],
  openGraph: {
    title: "Daily CSS Colour",
    description: "Discover a new CSS colour every day",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily CSS Colour",
    description: "Discover a new CSS colour every day",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  
  return (
    <html lang="en">
      <head>
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
