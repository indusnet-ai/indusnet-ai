import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Us | Indusnet AI",
  description: "Learn about Indusnet AI, our mission, vision, CPMAI accreditation, executive leadership, and timeline in pioneering enterprise AI implementations.",
};

export default function AboutPage() {
  return <AboutClient />;
}
