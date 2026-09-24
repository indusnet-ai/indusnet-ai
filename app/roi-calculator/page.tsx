import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, Calculator, Sparkles } from "lucide-react";
import { RoiCalculator } from "@/components/roi-calculator/roi-calculator";

export const metadata: Metadata = {
  title: "Enterprise AI ROI Estimator & GPU Sizing | Indusnet AI",
  description:
    "Model your enterprise AI business case. Calculate illustrative net savings and private GPU compute sizing based on your operational inputs.",
  openGraph: {
    title: "Enterprise AI ROI Estimator & GPU Sizing | Indusnet AI",
    description:
      "Model your enterprise AI business case. Calculate illustrative net savings and private GPU compute sizing based on your operational inputs.",
    url: "https://www.indusnet-ai.com/roi-calculator",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Enterprise AI ROI Estimator & GPU Sizing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise AI ROI Estimator & GPU Sizing | Indusnet AI",
    description:
      "Model your enterprise AI business case. Calculate illustrative net savings and private GPU compute sizing based on your operational inputs.",
    images: ["/og-image.png"],
  },
};

export default function RoiCalculatorPage() {
  return (
    <div className="pt-24 pb-20 flex flex-col gap-10">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-semibold flex items-center gap-1">
            <Calculator className="w-3 h-3 text-primary" /> AI ROI Estimator
          </span>
        </nav>
      </div>

      {/* Main Interactive Calculator */}
      <RoiCalculator />
    </div>
  );
}
