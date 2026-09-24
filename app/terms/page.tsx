import type { Metadata } from "next";
import TermsClient from "./terms-client";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Terms of Service | Indusnet AI",
  description:
    "Review Indusnet AI's terms of service regarding the CPMAI AI Scoper, architectural advisory services, and digital platform usage.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | Indusnet AI",
    description:
      "Review Indusnet AI's terms of service regarding the CPMAI AI Scoper, architectural advisory services, and digital platform usage.",
    url: "https://www.indusnet-ai.com/terms",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indusnet AI Terms of Service",
      },
    ],
  },
};

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Terms of Service", url: "/terms" },
        ]}
      />
      <TermsClient />
    </>
  );
}
