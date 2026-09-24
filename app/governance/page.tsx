import type { Metadata } from "next";
import GovernanceClient from "./governance-client";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Responsible AI Architecture, Security & Governance | Indusnet AI",
  description:
    "Explore Indusnet AI's enterprise AI governance framework: customer VPC isolation, Zero Data Retention (ZDR), deterministic guardrails, citation grounding, and SOC 2 / ISO 42001 alignment.",
  alternates: {
    canonical: "/governance",
  },
  openGraph: {
    title: "Responsible AI Architecture, Security & Governance | Indusnet AI",
    description:
      "Explore Indusnet AI's enterprise AI governance framework: customer VPC isolation, Zero Data Retention (ZDR), deterministic guardrails, citation grounding, and SOC 2 / ISO 42001 alignment.",
    url: "https://www.indusnet-ai.com/governance",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indusnet AI Enterprise Governance and Security",
      },
    ],
  },
};

export default function GovernancePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Governance & Security", url: "/governance" },
        ]}
      />
      <ServiceJsonLd
        name="Enterprise AI Security & Governance"
        description="Comprehensive enterprise AI governance: VPC isolation, Zero Data Retention (ZDR), deterministic guardrails, citation grounding, and human-in-the-loop escalation."
        url="/governance"
        serviceType="Enterprise AI Governance & Architecture"
      />
      <GovernanceClient />
    </>
  );
}
