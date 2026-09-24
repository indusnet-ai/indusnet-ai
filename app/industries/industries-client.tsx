"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Activity, ShoppingCart, Building2, Landmark, GraduationCap, Truck, 
  ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, Settings 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const industryDetails = [
  {
    name: "Healthcare & Life Sciences",
    icon: Activity,
    badge: "HIPAA Compliant",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    challenges: [
      "Physician burnout due to excessive EHR clinical documentation requirements.",
      "Strict data privacy regulations (HIPAA, GDPR) blocking public API use.",
      "Complex clinical triage routing in multi-specialty emergency environments."
    ],
    solutions: [
      "Custom ambient clinical intake models structuring patient consultations directly into EHR templates.",
      "VPC-isolated medical document RAG engines searching clinical guidelines and research securely.",
      "High-precision triage classification models assisting medical staff with case routing."
    ],
    outcomes: [
      "Designed to significantly reduce clinician administrative overhead on EHR documentation.",
      "Strict preservation of patient health information (PHI) within private VPC subnet limits.",
      "Deterministic clinical triage assistance with mandatory human-in-the-loop escalation."
    ],
    highlight: "Architecture Pattern: Ambient Clinical Documentation & EHR Integration (Illustrative)"
  },
  {
    name: "Retail & E-commerce",
    icon: ShoppingCart,
    badge: "Hyper-Growth",
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    challenges: [
      "Cart abandonment and engagement drop-off caused by static product discovery.",
      "Slow manual catalog classification delaying new SKU arrivals and seasonal promotions.",
      "Rapid pricing fluctuations requiring dynamic margin protection."
    ],
    solutions: [
      "Real-time personalized shopping agents recommending relevant products contextually.",
      "Multimodal computer vision models auto-tagging attributes and categorizing catalog items in bulk.",
      "Automated dynamic pricing intelligence models optimizing margins within strict policy bounds."
    ],
    outcomes: [
      "Designed to lift average order value (AOV) through contextual personalization.",
      "Accelerates catalog onboarding through automated visual and attribute tagging.",
      "Protects gross margins through automated competitor pricing monitoring."
    ],
    highlight: "Architecture Pattern: Dynamic Catalog Tagging & Personalization (Illustrative)"
  },
  {
    name: "Advanced Manufacturing",
    icon: Building2,
    badge: "Edge Computing",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    challenges: [
      "Microscopic product defects escaping manual conveyor-belt visual inspection.",
      "Unplanned machinery breakdowns stopping core production lines.",
      "Complex warehouse material flows and supply chain buffer mismatches."
    ],
    solutions: [
      "Edge-computing computer vision models scanning components on conveyor lines in real time.",
      "Predictive machine maintenance tracking thermal, vibration, and acoustic telemetry.",
      "Autonomous optimization agents coordinating raw material reorder thresholds."
    ],
    outcomes: [
      "Minimizes component defect escape through continuous high-speed visual inference.",
      "Enables proactive maintenance by continuously detecting telemetry anomalies.",
      "Mitigates inventory stockouts through predictive replenishment triggers."
    ],
    highlight: "Architecture Pattern: High-Speed Edge Computer Vision for Inspection (Illustrative)"
  },
  {
    name: "Banking & Finance",
    icon: Landmark,
    badge: "Maximum Security",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    challenges: [
      "Massive transaction volumes delaying critical anti-money-laundering (AML) fraud detection.",
      "Extended research cycles required for regulatory compliance and commercial loan underwriting.",
      "Strict data sovereignty rules prohibiting public cloud model API exposure."
    ],
    solutions: [
      "Sub-second anomaly detection engines evaluating transaction telemetry in real time.",
      "Private air-gapped RAG knowledge engines summarizing regulatory filings and loan dossiers.",
      "Private VPC deployment of open-weights models for underwriting assistance."
    ],
    outcomes: [
      "Flags anomalous transactions and credit applications prior to settlement.",
      "Substantially reduces manual credit file compilation and compliance audit cycle times.",
      "Zero customer financial data traverses external subnets; fully audit-ready."
    ],
    highlight: "Architecture Pattern: Air-Gapped Regulatory RAG & Underwriting Synthesis (Illustrative)"
  },
  {
    name: "Education & EdTech",
    icon: GraduationCap,
    badge: "Interactive Learning",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    challenges: [
      "One-size-fits-all curricula failing to accommodate varying student learning paces.",
      "Heavy routine grading and essay feedback workloads for academic staff.",
      "Static course content resulting in declining student engagement and completion."
    ],
    solutions: [
      "Conversational learning tutors adapting explanations to individual pupil comprehension.",
      "Structured grading copilots flagging logical writing gaps for teacher review.",
      "Dynamic curriculum generation creating customized practice modules and problem sets."
    ],
    outcomes: [
      "Designed to improve student engagement through responsive, personalized learning loops.",
      "Reduces repetitive manual grading time by providing structured evaluation assistance.",
      "Enables continuous interactive practice with immediate explanatory feedback."
    ],
    highlight: "Architecture Pattern: Adaptive Learning Copilot & Automated Curriculum (Illustrative)"
  },
  {
    name: "Logistics & Supply Chain",
    icon: Truck,
    badge: "Deterministic Routing",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    challenges: [
      "Inefficient multi-stop delivery routes driving up fleet fuel and maintenance costs.",
      "Slow manual customs document and multi-vendor freight invoice reconciliation.",
      "Inaccurate warehouse storage capacity predictions leading to overflow charges."
    ],
    solutions: [
      "Autonomous agent systems optimizing dispatch schedules and multi-stop route plans.",
      "Multimodal OCR document scanners extracting invoice, bill-of-lading, and customs data.",
      "Predictive machine learning models forecasting weekly warehouse slot occupancy."
    ],
    outcomes: [
      "Optimizes multi-stop routes to reduce fuel burn and driver turnaround times.",
      "Automates cross-system 3-way invoice matching between ERP, POs, and freight bills.",
      "Improves warehouse capacity utilization through predictive slotting models."
    ],
    highlight: "Architecture Pattern: Autonomous Freight Reconciliation & Routing (Illustrative)"
  }
];

export default function IndustriesClient() {
  return (
    <div className="flex flex-col gap-24 md:gap-32 pt-32 pb-24">
      {/* 1. HERO HEADER */}
      <section className="container mx-auto px-4 md:px-6 relative overflow-hidden text-center max-w-4xl flex flex-col gap-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          <Badge className="bg-accent/10 border-accent/20 text-accent rounded-full px-3 py-1 text-xs">
            Sector-Specific Integration
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Deterministic AI for <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Complex Industries</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          One-size-fits-all AI models fail to respect compliance and legacy constraints. We design secure, deterministic systems engineered for your specific sector&apos;s boundaries.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xs text-muted-foreground/60 italic"
        >
          Industry architectures and target outcomes below represent illustrative solution blueprints engineered by Indusnet AI.
        </motion.p>
      </section>

      {/* 2. DENSE INDUSTRIES GRID */}
      <section className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col gap-16">
          {industryDetails.map((ind, idx) => (
            <Card key={idx} className="glassmorphism-card border-none text-left overflow-hidden relative">
              {/* Radial backdrop highlight */}
              <div className="absolute top-0 right-0 -z-10 w-64 h-64 rounded-full bg-white/[0.01] blur-3xl" />

              <CardContent className="p-8 md:p-12 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${ind.color}`}>
                      <ind.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-foreground tracking-tight leading-tight">
                        {ind.name}
                      </h2>
                      <p className="text-xs text-primary font-semibold mt-1">Facilitator-Led Custom Delivery</p>
                    </div>
                  </div>
                  <Badge className="bg-muted border border-border text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {ind.badge}
                  </Badge>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Challenges Column */}
                  <div className="flex flex-col gap-4 bg-muted/20 border border-border rounded-2xl p-6">
                    <h3 className="font-bold text-xs uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" /> Operational Friction
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {ind.challenges.map((chal, index) => (
                        <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400/60 mt-1.5 flex-shrink-0" />
                          <span>{chal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions Column */}
                  <div className="flex flex-col gap-4 bg-muted/20 border border-border rounded-2xl p-6">
                    <h3 className="font-bold text-xs uppercase text-primary tracking-wider flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-primary animate-[spin_20s_linear_infinite]" /> Bespoke AI Systems
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {ind.solutions.map((sol, index) => (
                        <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcomes Column */}
                  <div className="flex flex-col gap-4 bg-muted/20 border border-border rounded-2xl p-6 justify-between h-full">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-emerald-400" /> Target Business Impact
                        </h3>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                          Illustrative
                        </span>
                      </div>
                      <ul className="flex flex-col gap-4">
                        {ind.outcomes.map((out, index) => (
                          <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 mt-1.5 flex-shrink-0" />
                            <span className="font-medium text-foreground">{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* highlight block */}
                    <div className="mt-6 pt-4 border-t border-border/10">
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-[10px] font-bold text-foreground uppercase tracking-wider leading-snug">
                          {ind.highlight}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. CTA */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="glassmorphism-card rounded-3xl py-16 px-6 md:px-12 text-center flex flex-col gap-6 items-center">
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs">
            Custom Architecture Feasibility
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">How Will AI fit inside your stack?</h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg leading-relaxed">
            Schedule a feasibility call. Our full-stack engineering team will review your database access models, data volumes, security compliance, and draft a baseline workflow schema.
          </p>
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 group">
            <Link href="/contact" className="flex items-center gap-1.5">
              Request Stack Feasibility <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
