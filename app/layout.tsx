import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Indusnet AI — AI-First: From Strategy to Software",
    template: "%s | Indusnet AI",
  },
  description:
    "Enterprise AI application development and systems engineering. We architect, engineer, and deploy bespoke generative AI applications, autonomous agents, and private RAG knowledge engines inside your secure enterprise cloud.",
  keywords: [
    "Enterprise AI",
    "AI Application Development",
    "Autonomous AI Agents",
    "Enterprise RAG",
    "Generative AI Consulting",
    "Private LLM Deployment",
    "CPMAI Methodology",
    "Indusnet AI",
  ],
  metadataBase: new URL("https://www.indusnet-ai.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Indusnet AI — AI-First: From Strategy to Software",
    description:
      "Enterprise AI application development and systems engineering. Bespoke copilots, autonomous multi-agent systems, and private RAG knowledge engines.",
    url: "https://www.indusnet-ai.com",
    siteName: "Indusnet AI",
    images: [
      {
        url: "https://www.indusnet-ai.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indusnet AI — Enterprise AI Systems Engineering",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indusnet AI — AI-First: From Strategy to Software",
    description:
      "Enterprise AI application development and systems engineering. Bespoke copilots, autonomous multi-agent systems, and private RAG knowledge engines.",
    images: ["https://www.indusnet-ai.com/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col scroll-smooth">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen bg-grid-pattern">
            {/* Ambient background glows */}
            <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-[1200px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(22,119,255,0.08),transparent_70%)] blur-[80px]" />
            <ScrollProgress />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>

        {/* Google Analytics 4 Script (only active when NEXT_PUBLIC_GA_ID is defined) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
