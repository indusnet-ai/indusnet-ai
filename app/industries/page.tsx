import type { Metadata } from "next";
import IndustriesClient from "./industries-client";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Industry AI Solutions — Healthcare, Banking, Manufacturing & Retail",
  description:
    "Domain-specialized enterprise AI architectures. HIPAA-aligned clinical intake, sub-5ms fraud scoring in Banking, high-speed edge vision in Manufacturing, and retail cataloging.",
  alternates: {
    canonical: "/industries",
  },
  openGraph: {
    title: "Industry AI Solutions | Indusnet AI",
    description:
      "Domain-specialized AI architectures engineered for Healthcare, Financial Services, Advanced Manufacturing, Retail, and Logistics.",
    url: "https://www.indusnet-ai.com/industries",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Industry AI Solutions — Indusnet AI",
      },
    ],
  },
};

export default function IndustriesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Industries", url: "/industries" },
        ]}
      />
      <ServiceJsonLd
        name="Vertical Industry AI Engineering"
        description="Domain-tailored enterprise AI systems engineered with strict industry compliance, VPC data boundaries, and operational guardrails."
        url="/industries"
        serviceType="Industry AI Systems Architecture"
      />
      <IndustriesClient />
    </>
  );
}
