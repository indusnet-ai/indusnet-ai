import type { Metadata } from "next";
import { Suspense } from "react";
import ContactClient from "./contact-client";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Enterprise AI Technical Consultation & Office Locations | Indusnet AI",
  description:
    "Schedule an enterprise AI consultation with our systems architects. Connect with our engineering headquarters in Chennai or regional office in Singapore.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Enterprise AI Technical Consultation & Office Locations | Indusnet AI",
    description:
      "Schedule an enterprise AI consultation with our systems architects. Connect with our engineering headquarters in Chennai or regional office in Singapore.",
    url: "https://www.indusnet-ai.com/contact",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Indusnet AI Consultation",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Contact & Consultation", url: "/contact" },
        ]}
      />
      <Suspense fallback={<div className="min-h-screen bg-[#050B14]" />}>
        <ContactClient />
      </Suspense>
    </>
  );
}

