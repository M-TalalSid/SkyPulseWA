import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/context/settings-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "SkyPulse - Real-time Weather Forecast",
    template: "%s | SkyPulse Weather",
  },
  description:
    "Get accurate real-time weather forecasts, hourly and daily predictions, air quality data, and personalized weather insights with SkyPulse.",
  keywords: [
    "weather",
    "forecast",
    "real-time weather",
    "weather app",
    "weather forecast",
    "weather radar",
    "weather alerts",
    "air quality",
  ],
  authors: [{ name: "SkyPulse Team" }],
  creator: "SkyPulse",
  publisher: "SkyPulse",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://skypulse-weather.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SkyPulse - Real-time Weather Forecast",
    description:
      "Get accurate real-time weather forecasts, hourly and daily predictions, air quality data, and personalized weather insights.",
    url: "https://skypulse-weather.vercel.app",
    siteName: "SkyPulse Weather",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SkyPulse Weather App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyPulse - Real-time Weather Forecast",
    description:
      "Get accurate real-time weather forecasts, hourly and daily predictions, air quality data, and personalized weather insights.",
    images: ["/twitter-image.jpg"],
    creator: "@skypulse",
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
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a8a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://api.weatherapi.com" />
        <link rel="dns-prefetch" href="https://api.weatherapi.com" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SettingsProvider>{children}</SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'