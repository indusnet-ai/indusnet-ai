import type { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact & Consultation | Indusnet AI",
  description: "Schedule a custom technical engineering consultation or reach our offices in Singapore and Chennai.",
};

export default function ContactPage() {
  return <ContactClient />;
}
