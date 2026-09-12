import type { Metadata } from "next";
import IndustriesClient from "./industries-client";

export const metadata: Metadata = {
  title: "Industry Solutions | Indusnet AI",
  description: "Bespoke, deterministic AI solutions engineered for Healthcare, Retail, Manufacturing, Banking, Education, and Logistics.",
};

export default function IndustriesPage() {
  return <IndustriesClient />;
}
