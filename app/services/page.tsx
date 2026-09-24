import type { Metadata } from "next";
import ServicesClient from "./services-client";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Enterprise AI Services & Engineering Capabilities",
  description:
    "Explore our 6 core enterprise AI engineering capabilities: bespoke AI applications, autonomous multi-agent systems, VPC-isolated RAG, edge computer vision, legacy AI modernization, and CPMAI strategy.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Enterprise AI Services & Engineering Capabilities | Indusnet AI",
    description:
      "Production software engineering across bespoke AI applications, autonomous agents, private RAG knowledge systems, and edge automation.",
    url: "https://www.indusnet-ai.com/services",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Enterprise AI Services — Indusnet AI",
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServiceJsonLd
        name="Enterprise AI Engineering Services"
        description="Comprehensive enterprise AI development services from strategy and feasibility scoping to production software delivery."
        url="/services"
        serviceType="Enterprise AI Software Development"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      <ServicesClient />
    </>
  );
}
