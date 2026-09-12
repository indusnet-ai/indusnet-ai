import type { Metadata } from "next";
import TrainingClient from "./training-client";

export const metadata: Metadata = {
  title: "Corporate AI Training & CPMAI Bootcamps | Indusnet AI",
  description: "Upskill software teams and leadership with certified CPMAI methodology bootcamps, developer workshops, and executive GenAI masterclasses.",
};

export default function TrainingPage() {
  return <TrainingClient />;
}
