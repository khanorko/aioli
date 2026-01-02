import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AIoli | Analyze Your Website's AI Visibility & SEO Score",
  description: "Analyze your website for traditional SEO and AI visibility. See how well your site is prepared for both search engines and AI assistants.",
  metadataBase: new URL("https://aioli-one.vercel.app"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  keywords: ["SEO analysis", "AI visibility", "ChatGPT optimization", "Claude optimization", "website analysis", "search engine optimization", "LLM readiness"],
  authors: [{ name: "AIoli" }],
  creator: "AIoli",
  publisher: "AIoli",
  openGraph: {
    title: "AIoli - AI-powered SEO Analysis",
    description: "Analyze your website for traditional SEO and AI visibility. See how well your site is prepared for both search engines and AI assistants.",
    url: "https://aioli-one.vercel.app",
    siteName: "AIoli",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIoli - AI-powered SEO Analysis Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIoli - AI-powered SEO Analysis",
    description: "Analyze your website for traditional SEO and AI visibility.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "i7iJtRLNjPn59memqPiQb2bzCR82O1LVR_R64VfWZIw",
    other: {
      "msvalidate.01": "5F45E79919709ECD2F6256032A9ABACE",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
