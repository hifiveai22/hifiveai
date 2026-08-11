import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hifiveai.co"),
  title: "HiFiveAI: AI-Native People Operating System",
  description:
    "HiFiveAI connects hiring, people, payroll, global workforce, and operations through one AI intelligence layer for faster, data-backed workforce decisions.",
  keywords: [
    "HiFiveAI",
    "People Operating System",
    "HR",
    "Payroll",
    "AI",
    "Talent Acquisition",
    "Compliance",
    "EOR",
    "Global Payroll",
    "HRIS",
  ],
  authors: [{ name: "HiFiveAI" }],
  creator: "HiFiveAI",
  alternates: {
    canonical: "https://www.hifiveai.co/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.hifiveai.co/",
    siteName: "HiFiveAI",
    title: "HiFiveAI: AI-Native People Operating System",
    description:
      "HiFiveAI connects hiring, people, payroll, global workforce, and operations through one AI intelligence layer for faster, data-backed workforce decisions.",
    images: [
      {
        url: "https://www.hifiveai.co/og-image.png",
        width: 1200,
        height: 630,
        alt: "HiFiveAI: AI-Native People Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HiFiveAI: AI-Native People Operating System",
    description:
      "HiFiveAI connects hiring, people, payroll, global workforce, and operations through one AI intelligence layer for faster, data-backed workforce decisions.",
    images: ["https://www.hifiveai.co/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#F5F0E8"/><polygon points="16,6 25.5,12.9 21.9,24.1 10.1,24.1 6.5,12.9" stroke="#B07D2E" stroke-width="1.2" fill="none"/><circle cx="16" cy="6" r="2" fill="#B07D2E"/><circle cx="25.5" cy="12.9" r="2" fill="#B07D2E"/><circle cx="21.9" cy="24.1" r="2" fill="#B07D2E"/><circle cx="10.1" cy="24.1" r="2" fill="#B07D2E"/><circle cx="6.5" cy="12.9" r="2" fill="#B07D2E"/><circle cx="16" cy="16" r="1.5" fill="#B07D2E" opacity="0.6"/></svg>'),
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HiFiveAI",
  url: "https://www.hifiveai.co/",
  logo: "https://www.hifiveai.co/logo.svg",
  description:
    "HiFiveAI connects hiring, people, payroll, global workforce, and operations through one AI intelligence layer for faster, data-backed workforce decisions.",
  sameAs: [
    "https://linkedin.com/company/hifiveai",
    "https://twitter.com/hifiveai",
    "https://github.com/hifiveai",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hello@hifiveai.co",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HiFiveAI",
  url: "https://www.hifiveai.co/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.hifiveai.co/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
