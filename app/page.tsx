import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Indusnet AI | Enterprise AI Solutions & CPMAI Training",
  description:
    "Transforming enterprises with bespoke Generative AI applications, custom RAG knowledge engines, autonomous AI agents, technical consulting, and certified CPMAI training.",
};

export default function HomePage() {
  return <HomeClient />;
}
