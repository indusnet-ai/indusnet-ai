import type { Metadata } from "next";
import PrivacyClient from "./privacy-client";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection | Indusnet AI",
  description:
    "Review Indusnet AI's enterprise data privacy policy: zero model training on client data, VPC database encryption, and CPMAI compliance.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy & Data Protection | Indusnet AI",
    description:
      "Review Indusnet AI's enterprise data privacy policy: zero model training on client data, VPC database encryption, and CPMAI compliance.",
    url: "https://www.indusnet-ai.com/privacy",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indusnet AI Privacy Policy",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy" },
        ]}
      />
      <PrivacyClient />
    </>
  );
}
