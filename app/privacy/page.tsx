"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Lock, FileText, ArrowLeft, BarChart3 } from "lucide-react";
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
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight text-foreground"
        >
          Privacy Policy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm max-w-xl mx-auto"
        >
          Last updated: September 2026. This Privacy Policy details how Indusnet AI collects, protects, and handles proprietary data, corporate enquiries, and analytics metrics.
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
          <Button asChild variant="ghost" className="w-fit -ml-2 text-xs text-muted-foreground hover:text-foreground rounded-full">
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
                  <span className="font-bold text-xs text-foreground">Full Transparency</span>
                  <span className="text-[10px] text-muted-foreground">We never sell client data or use corporate queries to train public AI models.</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism-card border-none">
              <CardContent className="p-5 flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-xs text-foreground">Encrypted Storage</span>
                  <span className="text-[10px] text-muted-foreground">VPC database connection pools and TLS encryption protect scheduling and scoper logs.</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism-card border-none">
              <CardContent className="p-5 flex items-start gap-3.5">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-xs text-foreground">CPMAI Compliant</span>
                  <span className="text-[10px] text-muted-foreground">Adheres to Cognilytica's Cognitive Project Management AI governance rules.</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Policy content */}
          <div className="prose prose-invert max-w-none text-xs text-muted-foreground leading-relaxed flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">1. Data We Collect</h2>
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
              <h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">2. How We Use Your Data</h2>
              <p>
                We do not distribute or monetize client profiles. Information is utilized exclusively to:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
                <li>Compile architectural recommendations, hardware requirements, and project scoping estimates.</li>
                <li>Establish meeting times, send calendar credentials, and verify security protocols.</li>
                <li>Distribute our periodic AI Insights briefings (which can be opted-out at any time).</li>
                <li>Deliver authorized diagnostic assessments under corporate CPMAI frameworks.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">3. LLM Safety & Vector Isolation</h2>
              <p>
                For our custom enterprise applications and search engines:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
                <li>We enforce zero-data-retention agreements to guarantee your proprietary assets are never stored or used as training datasets by external foundation model providers.</li>
                <li>Private data indices, vector databases, and document parsers are isolated within virtual private networks (VPCs) under strict encryption boundaries.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">4. Storage & Infrastructure Security</h2>
              <p>
                All incoming leads and assessment data are stored in secure PostgreSQL database clusters with SSL/TLS encryption. Write access from public web handlers is restricted to parameterized, sanitized queries through server-only connections. Public browser clients have no direct access to read, query, or enumerate database records.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">5. Web Analytics & Measurement</h2>
              <p>
                To understand visitor navigation patterns, optimize page load times, and measure campaign effectiveness, our website utilizes privacy-conscious analytics tools (such as Google Analytics 4). These tools collect aggregated and anonymized telemetry including pages visited, session duration, device viewport sizes, and conversion milestones (such as consultation requests or newsletter signups).
              </p>
              <p className="mt-1">
                Analytics telemetry does not capture passwords, private contact form messages, or financial credentials. You can opt out of analytics tracking or enable your browser's "Do Not Track" header at any time without restricting your access to our public website.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">6. Your Rights & Contacts</h2>
              <p>
                You retain complete authority over your personal information. You can request the inspection, correction, or permanent removal of subscription records or booked slot schedules at any time by contacting our governance team at: <strong>info@indusnet-ai.com</strong>.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
