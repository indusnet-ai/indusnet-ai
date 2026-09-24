import type { Metadata } from "next";
import TrainingClient from "./training-client";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Corporate AI Training & CPMAI Bootcamps | Indusnet AI",
  description:
    "Upskill software engineering teams and executive leadership with certified CPMAI methodology bootcamps, developer workshops, and enterprise GenAI masterclasses.",
  alternates: {
    canonical: "/training",
  },
  openGraph: {
    title: "Corporate AI Training & CPMAI Bootcamps | Indusnet AI",
    description:
      "Upskill software engineering teams and executive leadership with certified CPMAI methodology bootcamps, developer workshops, and enterprise GenAI masterclasses.",
    url: "https://www.indusnet-ai.com/training",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Corporate AI Training & CPMAI Bootcamps",
      },
    ],
  },
};

export default function TrainingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Corporate Training", url: "/training" },
        ]}
      />
      <ServiceJsonLd
        name="Corporate AI Training & CPMAI Bootcamps"
        description="Upskill software teams and executive leadership with certified CPMAI methodology bootcamps, developer workshops, and enterprise GenAI masterclasses."
        url="/training"
        serviceType="Enterprise AI Training & Workforce Upskilling"
      />
      <TrainingClient />
    </>
  );
}

