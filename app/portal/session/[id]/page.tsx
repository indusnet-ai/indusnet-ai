import * as React from "react";
import ClientSessionWorkspace from "./client-workspace";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: PageProps) {
  const { id } = await params;
  return <ClientSessionWorkspace sessionId={id} />;
}
