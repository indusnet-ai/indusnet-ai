import type { Metadata } from "next";
import GenerativeAiClient from "./generative-ai-client";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Enterprise Generative AI Services, RAG & Private LLMs",
  description:
    "Production generative AI engineering for enterprises. We architect, benchmark, and deploy custom copilots, private VPC RAG knowledge engines, and autonomous agents with zero data retention.",
  alternates: {
    canonical: "/services/generative-ai",
  },
  openGraph: {
    title: "Enterprise Generative AI Services & Architecture | Indusnet AI",
    description:
      "Custom copilots, VPC-isolated RAG systems, and autonomous multi-agent systems engineered in your secure cloud environment.",
    url: "https://www.indusnet-ai.com/services/generative-ai",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Enterprise Generative AI Services — Indusnet AI",
      },
    ],
  },
};

export default function GenerativeAiPage() {
  return (
    <>
      <ServiceJsonLd
        name="Enterprise Generative AI Services"
        description="Production engineering to design, benchmark, build, and deploy custom AI applications, private knowledge systems, and autonomous agents in your secure cloud."
        url="/services/generative-ai"
        serviceType="Generative AI Consulting & Engineering"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Generative AI", url: "/services/generative-ai" },
        ]}
      />
      <GenerativeAiClient />
    </>
  );
}
