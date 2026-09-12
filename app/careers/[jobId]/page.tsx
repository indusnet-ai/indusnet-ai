import type { Metadata } from "next";
import JobDetailClient from "./job-detail-client";

type Props = {
  params: Promise<{ jobId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { jobId } = await params;
  try {
    const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8001";
    const res = await fetch(`${BACKEND_URL}/hr/jobs/${jobId}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const job = await res.json();
      return {
        title: `${job.title} | Careers at Indusnet AI`,
        description: `Apply for ${job.title} (${job.department}) at Indusnet AI in ${job.location}. ${job.description.slice(0, 150)}...`,
      };
    }
  } catch (err) {
    // Fallback if backend is not reachable at build time
  }
  return {
    title: "Career Opportunity | Indusnet AI",
    description: "Explore enterprise Generative AI engineering and architecture positions at Indusnet AI.",
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { jobId } = await params;
  return <JobDetailClient jobId={jobId} />;
}
