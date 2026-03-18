import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { UserProvider } from "@/lib/user-context"
import { Chatbot } from "@/components/ui/chatbot"

const _geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Civillio | India's Smart Civic Services Platform",
  description: "India's most powerful civic services app — Government documents, PAN card, Voter ID, Aadhaar, Grievances, and CiviBot AI all in one place.",
  generator: "Civillio",
  keywords: ["civic services", "pan card", "voter id", "aadhaar", "grievance", "government", "India", "civil engineering", "ERP"],
  authors: [{ name: "Civillio Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Civillio",
    startupImage: "/icons/icon-512.png",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
    shortcut: "/icons/icon-192.png",
  },
  openGraph: {
    title: "Civillio — India's Smart Civic Services Platform",
    description: "Government documents, Grievances, Civil ERP & CiviBot AI — all in one app.",
    type: "website",
    images: [{ url: "/icons/icon-512.png" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#6d28d9",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Civillio" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
      </head>
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased`}>
        <UserProvider>
          {children}
          <Chatbot />
        </UserProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('[Civillio] Service Worker registered:', reg.scope);
                  }).catch(function(err) {
                    console.log('[Civillio] Service Worker registration failed:', err);
                  });
                });
              }
            `
          }}
        />
      </body>
    </html>
  )
}
