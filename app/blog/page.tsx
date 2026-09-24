import type { Metadata } from "next";
import BlogClient from "./blog-client";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "AI Engineering Insights, RAG Architectures & Enterprise Systems | Indusnet AI",
  description:
    "Technical deep dives on Retrieval-Augmented Generation (RAG), autonomous agent orchestration, enterprise compliance, and private LLM deployments.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "AI Engineering Insights, RAG Architectures & Enterprise Systems | Indusnet AI",
    description:
      "Technical deep dives on Retrieval-Augmented Generation (RAG), autonomous agent orchestration, enterprise compliance, and private LLM deployments.",
    url: "https://www.indusnet-ai.com/blog",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indusnet AI Engineering Insights",
      },
    ],
  },
};

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Engineering Insights", url: "/blog" },
        ]}
      />
      <BlogClient />
    </>
  );
}

