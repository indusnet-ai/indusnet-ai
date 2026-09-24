import type { Metadata } from "next";
import PortfolioClient from "./portfolio-client";

export const metadata: Metadata = {
  title: "Solution Showcases & Architecture Blueprints | Indusnet AI",
  description: "Explore representative enterprise AI solution architectures, RAG knowledge systems, autonomous logistics agents, and clinical triage assistants engineered by Indusnet AI.",
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
