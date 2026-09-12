import type { Metadata } from "next";
import BlogClient from "./blog-client";

export const metadata: Metadata = {
  title: "AI Engineering Insights & Blog | Indusnet AI",
  description: "Read deep dives on Retrieval-Augmented Generation (RAG), autonomous AI agents, HIPAA healthcare compliance, and edge inference.",
};

export default function BlogPage() {
  return <BlogClient />;
}
