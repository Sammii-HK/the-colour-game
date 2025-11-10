import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import StructuredData from "@/components/StructuredData";
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
  title: "Daily CSS Colour - Free Color Palette Generator & Design Inspiration",
  description: "Get beautiful CSS colors delivered daily to your inbox. Free color palette generator with hex codes, RGB values, HSL values, and design inspiration. Perfect for web developers, designers, and artists. 147 CSS named colors with professional email delivery.",
  keywords: [
    // Primary SEO targets
    "CSS colors", "color palette generator", "hex color codes", "RGB color values", "HSL color values",
    "web design colors", "daily color inspiration", "CSS named colors", "color scheme generator",
    // Design tools
    "design colors", "web developer tools", "color picker", "color reference", "web safe colors",
    "color combinations", "design inspiration", "color theory", "web colors", "CSS color names",
    // Long-tail keywords for ranking
    "free color palette generator", "CSS color reference guide", "daily design inspiration email",
    "web design color schemes", "color palette for websites", "CSS hex color codes list",
    "daily color newsletter", "design color inspiration", "web development colors"
  ],
  authors: [{ name: "The Colour Game", url: "https://thecolorgame.uk" }],
  creator: "The Colour Game",
  publisher: "The Colour Game", 
  category: "Design Tools",
  classification: "Web Development Tool",
  openGraph: {
    title: "Daily CSS Colour - Free Color Palette Generator & Design Inspiration",
    description: "Get beautiful CSS colors delivered daily. Free color palette generator with hex codes, RGB values, and design inspiration for web developers and designers.",
    type: "website",
    locale: "en_US",
    url: "https://thecolorgame.uk",
    siteName: "The Colour Game",
    images: [
      {
        url: "https://thecolorgame.uk/api/og",
        width: 1200,
        height: 630,
        alt: "Daily CSS Colour - Beautiful color palettes and hex codes for web designers and developers",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily CSS Colour - Free Color Generator",
    description: "Beautiful CSS colors delivered daily. Free hex codes, RGB values, and design inspiration for web developers.",
    site: "@thecolorgame",
    creator: "@thecolorgame",
    images: ["https://thecolorgame.uk/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large', 
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://thecolorgame.uk",
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'Daily CSS Colour RSS Feed' }
      ]
    }
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default', 
    'format-detection': 'telephone=no',
    'theme-color': '#4F46E5',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <StructuredData />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Dark mode detection and application
            try {
              if (localStorage.getItem('color-scheme') === 'dark' || 
                  (!localStorage.getItem('color-scheme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          `
        }} />
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://thecolorgame.uk" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
