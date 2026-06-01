"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Activity, ShoppingCart, Building2, Landmark, GraduationCap, Truck, 
  ArrowRight, ShieldAlert, Sparkles, CheckCircle2, TrendingUp, Settings 
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
      "High clinical triage error rates in multi-specialty emergency wards."
    ],
    solutions: [
      "Custom local ambient voice assistants mapping patient discussions directly into EHR templates.",
      "VPC-isolated medical document RAG engines searching patient histories securely.",
      "Machine-learning classification systems routing incoming medical cases with 98%+ precision."
    ],
    outcomes: [
      "Saves clinicians an average of 2.1 hours per day on data entry.",
      "Absolute preservation of patient health information (PHI) within private subnet limits.",
      "ZeroDefect emergency room triage assistance."
    ],
    highlight: "MedIntake Copilot deployed across 14 clinics."
  },
  {
    name: "Retail & E-commerce",
    icon: ShoppingCart,
    badge: "Hyper-Growth",
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    challenges: [
      "High cart abandonment rates due to static recommendation carousels.",
      "Slow manual catalog classification delaying new SKU arrivals.",
      "Massive pricing fluctuations of competitors in highly volatile markets."
    ],
    solutions: [
      "Real-time hyper-personalized personal shopper agents recommending matching outfits.",
      "Computer vision classification models tagging and formatting item uploads in bulk.",
      "Automated dynamic pricing reinforcement models updating product prices every 60 seconds."
    ],
    outcomes: [
      "22% average increase in average order value (AOV).",
      "Cut inventory onboarding delays from 4 days to less than 15 minutes.",
      "Maximized gross margins on highly volatile catalog items."
    ],
    highlight: "OptiPrice dynamic pricing model managing 1.2M SKUs."
  },
  {
    name: "Advanced Manufacturing",
    icon: Building2,
    badge: "Edge Computing",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    challenges: [
      "High product defect rates escaping manual conveyor-belt inspections.",
      "Unplanned machinery breakdowns stopping core production lines.",
      "Complex warehouse logistics mapping and supply chain bottlenecks."
    ],
    solutions: [
      "Edge-computing computer vision models scanning products at 60 FPS.",
      "Predictive machine maintenance tracking thermal and vibration data.",
      "Autonomous optimization agents coordinating raw material orders."
    ],
    outcomes: [
      "Reduced defective inventory leakage to under 0.05%.",
      "Decreased unplanned factory downtime incidents by 44%.",
      "Eliminated inventory stockouts and excess raw material storage fees."
    ],
    highlight: "QCScan conveyor inspection deployed on 8 assembly lines."
  },
  {
    name: "Banking & Finance",
    icon: Landmark,
    badge: "Maximum Security",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    challenges: [
      "Massive transaction volumes delaying critical AML fraud detections.",
      "Long regulatory research times for complex legal loan underwriting.",
      "Data privacy leakage risks through external LLM APIs."
    ],
    solutions: [
      "Anomaly detection engines scanning transactions in sub-5ms latency window.",
      "Private secure RAG knowledge engines summarizing regulatory guidelines.",
      "On-premises deployment of open-source Llama-3 underwriting copilots."
    ],
    outcomes: [
      "Blocks fraudulent credit profile applications before transaction clearance.",
      "Underwriters compile credit summary files 85% faster.",
      "No data escapes internal bank subnets; fully audit-ready."
    ],
    highlight: "SecurUnderwrite RAG deployed for Metro Financial."
  },
  {
    name: "Education & EdTech",
    icon: GraduationCap,
    badge: "Interactive Learning",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    challenges: [
      "One-size-fits-all curricula failing to help slow-learning pupils.",
      "Heavy grading and essay scoring workloads for teaching staff.",
      "Static interactive learning platforms reducing student interest."
    ],
    solutions: [
      "Custom conversational tutors adapting explanations to individual pupil speed.",
      "Deterministic grading copilots flagging logical writing gaps for teacher review.",
      "Dynamic curriculum generation creating customized quiz modules on the fly."
    ],
    outcomes: [
      "40% improvement in student retention and homework completion rates.",
      "Saves instructors up to 12 hours per week on manual grading tasks.",
      "Highly interactive, gamified, and responsive learning loops."
    ],
    highlight: "SmartTutor AI active for 12,000 global students."
  },
  {
    name: "Logistics & Supply Chain",
    icon: Truck,
    badge: "Deterministic Routing",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    challenges: [
      "Inefficient multi-stop delivery routes raising heavy fuel costs.",
      "Slow manual customs document and freight invoice processing.",
      "Inaccurate warehouse storage capacity predictions leading to overflows."
    ],
    solutions: [
      "Autonomous agent systems calculating weather, traffic, and vehicle schedules.",
      "Multimodal OCR document scanners extracting invoice data with 99.8% precision.",
      "Predictive machine learning models forecasting weekly warehouse slot occupancy."
    ],
    outcomes: [
      "18% average reduction in monthly transport fleet fuel expenditures.",
      "Reconcile incoming freight manifest documents in seconds.",
      "Reduced warehouse overflow fees by 62% through predictive slotting."
    ],
    highlight: "OptiRoute AI Agent active across 4 regional hubs."
  }
];

export default function IndustriesPage() {
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
          One-size-fits-all AI models fail to respect compliance and legacy constraints. We design secure, deterministic systems engineered for your specific sector's boundaries.
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
                      <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                        {ind.name}
                      </h2>
                      <p className="text-xs text-primary font-semibold mt-1">Facilitator-Led Custom Delivery</p>
                    </div>
                  </div>
                  <Badge className="bg-white/5 border border-white/10 text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {ind.badge}
                  </Badge>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Challenges Column */}
                  <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6">
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
                  <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6">
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
                  <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6 justify-between h-full">
                    <div className="flex flex-col gap-4">
                      <h3 className="font-bold text-xs uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Measurable Outcomes
                      </h3>
                      <ul className="flex flex-col gap-4">
                        {ind.outcomes.map((out, index) => (
                          <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 mt-1.5 flex-shrink-0" />
                            <span className="font-medium text-white">{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* highlight block */}
                    <div className="mt-6 pt-4 border-t border-border/10">
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-snug">
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
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">How Will AI fit inside your stack?</h2>
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
