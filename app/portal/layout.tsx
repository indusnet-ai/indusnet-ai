"use client";

import { AuthProvider } from "./auth-context";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#030014] text-white flex flex-col font-sans">
        {children}
      </div>
    </AuthProvider>
  );
}
