import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { AIInProductionPopup } from "@/components/ai-in-production-popup";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Indusnet AI | Enterprise AI Solutions & CPMAI Training",
  description:
    "Transforming enterprises with bespoke Generative AI applications, custom RAG knowledge engines, autonomous AI agents, technical consulting, and certified CPMAI training.",
  keywords: [
    "Indusnet AI",
    "Enterprise AI Consulting",
    "Custom AI Solutions",
    "Generative AI",
    "Corporate AI Training",
    "RAG Knowledge Assistant",
    "CPMAI Training India",
    "AI Agent Automation",
  ],
  metadataBase: new URL("https://indusnet-ai.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Indusnet AI | Enterprise AI Solutions & Consulting",
    description:
      "Transforming enterprises with bespoke Generative AI, custom RAG knowledge engines, autonomous AI agents, and certified CPMAI training.",
    url: "https://indusnet-ai.com",
    siteName: "Indusnet AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indusnet AI | Enterprise AI Solutions & Consulting",
    description:
      "Transforming enterprises with bespoke Generative AI, custom RAG knowledge engines, autonomous AI agents, and certified CPMAI training.",
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
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col scroll-smooth">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen bg-grid-pattern">
            {/* Ambient background glows */}
            <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-[1200px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.08),transparent_70%)] blur-[80px]" />
            <ScrollProgress />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <AIInProductionPopup />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
