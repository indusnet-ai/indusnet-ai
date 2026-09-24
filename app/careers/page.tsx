import type { Metadata } from "next";
import CareersClient from "./careers-client";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "AI Engineering & Systems Careers | Indusnet AI",
  description:
    "Join the next generation of AI software engineering at Indusnet AI. Explore active positions in Singapore and Chennai across systems architecture, LLM engineering, and CPMAI delivery.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "AI Engineering & Systems Careers | Indusnet AI",
    description:
      "Join the next generation of AI software engineering at Indusnet AI. Explore active positions in Singapore and Chennai across systems architecture, LLM engineering, and CPMAI delivery.",
    url: "https://www.indusnet-ai.com/careers",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indusnet AI Careers",
      },
    ],
  },
};

export default function CareersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Careers", url: "/careers" },
        ]}
      />
      <CareersClient />
    </>
  );
}

