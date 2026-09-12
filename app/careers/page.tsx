import type { Metadata } from "next";
import CareersClient from "./careers-client";

export const metadata: Metadata = {
  title: "Careers & Open Positions | Indusnet AI",
  description: "Join the next generation of AI software engineering at Indusnet AI. Explore active positions in Singapore and Chennai.",
};

export default function CareersPage() {
  return <CareersClient />;
}
