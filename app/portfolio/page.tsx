import type { Metadata } from "next";
import PortfolioClient from "./portfolio-client";

export const metadata: Metadata = {
  title: "Case Studies & Portfolio | Indusnet AI",
  description: "Explore real enterprise AI implementations, RAG knowledge engines, autonomous logistics agents, and clinical triage assistants built by Indusnet AI.",
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
