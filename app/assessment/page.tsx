import type { Metadata } from "next";
import AssessmentClient from "./assessment-client";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Enterprise AI Scoper & Project Readiness Assessment | Indusnet AI",
  description:
    "Evaluate enterprise AI readiness, architecture feasibility, and CPMAI project scope. Receive an instant preliminary recommendation and architecture blueprint.",
  alternates: {
    canonical: "/assessment",
  },
  openGraph: {
    title: "Enterprise AI Scoper & Project Readiness Assessment | Indusnet AI",
    description:
      "Evaluate enterprise AI readiness, architecture feasibility, and CPMAI project scope. Receive an instant preliminary recommendation and architecture blueprint.",
    url: "https://www.indusnet-ai.com/assessment",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Enterprise AI Scoping & Readiness Assessment",
      },
    ],
  },
};

export default function AssessmentPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "AI Scoper", url: "/assessment" },
        ]}
      />
      <AssessmentClient />
    </>
  );
}

