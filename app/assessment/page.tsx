import type { Metadata } from "next";
import AssessmentClient from "./assessment-client";

export const metadata: Metadata = {
  title: "AI Scoping & Assessment | Indusnet AI",
  description: "Complete the Cognitive Project Management for AI (CPMAI) project scoping wizard for your enterprise AI implementation.",
};

export default function AssessmentPage() {
  return <AssessmentClient />;
}
