import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Enterprise AI Application Development & Systems Engineering",
  description:
    "Indusnet AI architects, engineers, and deploys production-grade AI applications, autonomous agents, and private RAG systems inside your secure enterprise cloud. AI-First. From Strategy to Software.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Indusnet AI — Enterprise AI Application Development",
    description:
      "Architecting and engineering production AI applications, autonomous agents, and private RAG systems. AI-First. From Strategy to Software.",
    url: "https://www.indusnet-ai.com",
    siteName: "Indusnet AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indusnet AI — AI-First: From Strategy to Software",
      },
    ],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
