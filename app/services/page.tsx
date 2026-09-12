import type { Metadata } from "next";
import ServicesClient from "./services-client";

export const metadata: Metadata = {
  title: "Services & Capabilities | Indusnet AI",
  description: "Explore Indusnet AI services including RAG solutions, autonomous AI agents, computer vision, predictive analytics, technical consulting, and corporate AI training.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
