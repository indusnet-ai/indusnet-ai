import type { Metadata } from "next";
import AboutClient from "./about-client";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About Indusnet AI — Enterprise AI Systems & Engineering Team",
  description: "Learn about Indusnet AI, our engineering mission, CPMAI accreditation, executive leadership, and proven delivery methodology for enterprise AI solutions.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Indusnet AI — Enterprise AI Systems & Engineering Team",
    description: "Learn about Indusnet AI, our engineering mission, CPMAI accreditation, executive leadership, and proven delivery methodology for enterprise AI solutions.",
    url: "https://www.indusnet-ai.com/about",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Indusnet AI",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />
      <AboutClient />
    </>
  );
}

