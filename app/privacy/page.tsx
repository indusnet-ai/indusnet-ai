"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16 pt-32 pb-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <section className="container mx-auto px-4 md:px-6 max-w-4xl flex flex-col gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto"
        >
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 w-fit">
            <Shield className="w-3.5 h-3.5" /> Legal & Governance
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight"
        >
          Privacy Policy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm max-w-xl mx-auto"
        >
          Last updated: June 3, 2026. This Privacy Policy details how Indusnet AI collects, protects, and handles proprietary data and user credentials.
        </motion.p>
      </section>

      <section className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-8 text-left"
        >
          {/* Back link */}
          <Button asChild variant="ghost" className="w-fit -ml-2 text-xs text-muted-foreground hover:text-white rounded-full">
            <Link href="/" className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </Button>

          {/* Quick Metrics Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="glassmorphism-card border-none">
              <CardContent className="p-5 flex items-start gap-3.5">
                <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-xs text-white">Full Transparency</span>
                  <span className="text-[10px] text-muted-foreground">We never sell your data or use code queries to train public LLMs.</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism-card border-none">
              <CardContent className="p-5 flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-xs text-white">Strict RLS Controls</span>
                  <span className="text-[10px] text-muted-foreground">Row-level Postgres locks protect scheduling & scoper logs.</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism-card border-none">
              <CardContent className="p-5 flex items-start gap-3.5">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-xs text-white">CPMAI Compliant</span>
                  <span className="text-[10px] text-muted-foreground">Adheres to strict Cognitive Project Management governance rules.</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Policy content */}
          <div className="prose prose-invert max-w-none text-xs text-muted-foreground leading-relaxed flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">1. Data We Collect</h2>
              <p>
                Indusnet AI collects details only necessary to scope and deliver bespoke engineering products. This includes:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2 text-muted-foreground">
                <li><strong>Contact Information</strong>: Name, designation, company name, corporate email address, and phone number when submitting general inquiries or booking consulting calls.</li>
                <li><strong>Scoping Variables</strong>: Project details, operational friction summaries, software stack requirements, database metrics, and POC sample sizes inputted on the CPMAI Scoper.</li>
                <li><strong>Automated Metrics</strong>: Standard browser attributes, IP addresses, cookie preferences, and navigational click logs to monitor site performance.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">2. How We Use Your Data</h2>
              <p>
                We do not distribute or monetize client profiles. Information is utilized exclusively to:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
                <li>Compile architectural recommendations, hardware requirements, and project scoping estimates.</li>
                <li>Establish meeting times, send Google Meet calendar credentials, and verify security protocols.</li>
                <li>Distribute our monthly AI Insights newsletter briefings (which can be opted-out at any point).</li>
                <li>Deliver authorized diagnostic assessments under corporate CPMAI frameworks.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">3. LLM Safety & Vector Isolation</h2>
              <p>
                For our custom enterprise applications and search engines:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
                <li>We enforce zero-data-retention APIs (e.g. OpenAI Enterprise API agreements) to guarantee your proprietary assets are never stored or used as training datasets by external model providers.</li>
                <li>Private data indices, vector databases (e.g., Qdrant, Pinecone), and document parsers are isolated within virtual private networks (VPCs) under encryption boundaries.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">4. Storage & RLS Security</h2>
              <p>
                All incoming leads and assessment data are stored in secure Supabase PostgreSQL servers. Write access is restricted via **Postgres Row-Level Security (RLS)** policies. This guarantees that anonymous web requests can only insert record payloads but cannot read, fetch, or modify historical records.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">5. Your Rights & Contacts</h2>
              <p>
                You retain complete authority over your credentials. You can request the removal of subscription details, inquiry summaries, or booked slot schedules at any time by contacting our legal officer at: **info@indusnet-ai.com**.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
