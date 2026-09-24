import type { Metadata } from "next";
import PortfolioClient from "./portfolio-client";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Enterprise AI Architecture Blueprints & Solution Showcases",
  description:
    "Inspect illustrative architecture blueprints for enterprise RAG, high-speed edge computer vision (60 FPS), predictive payment fraud detection, and ambient clinical intake.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Enterprise AI Architecture Blueprints | Indusnet AI",
    description:
      "Technical architectures and illustrative blueprints for enterprise AI systems, edge inference, and private RAG search engines.",
    url: "https://www.indusnet-ai.com/portfolio",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Enterprise AI Architecture Blueprints — Indusnet AI",
      },
    ],
  },
};

export default function PortfolioPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Solution Showcases", url: "/portfolio" },
        ]}
      />
      <PortfolioClient />
    </>
  );
}
