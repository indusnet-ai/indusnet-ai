"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Search, Compass, Cpu, Network, Rocket, TrendingUp, 
  CheckCircle2, ArrowRight, ShieldCheck, FileCode, Check 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LifecycleStage {
  step: string;
  title: string;
  subtitle: string;
  icon: any;
  duration: string;
  deliverables: string[];
  outcome: string;
}

const STAGES: LifecycleStage[] = [
  {
    step: "01",
    title: "Discover",
    subtitle: "Identify High-Value AI Opportunities",
    icon: Search,
    duration: "Week 1–2",
    deliverables: [
      "Cognitive workload & bottleneck audit",
      "Proprietary data readiness & quality scoring",
      "Compliance, security, and privacy boundary analysis"
    ],
    outcome: "Prioritized matrix of high-impact AI opportunities ranked by feasibility and financial return."
  },
  {
    step: "02",
    title: "Strategize",
    subtitle: "Define Architecture & Business Case",
    icon: Compass,
    duration: "Week 2–3",
    deliverables: [
      "Target model selection (Frontier vs Private SLMs)",
      "Hardware sizing (VRAM, QPS, Cloud vs On-Prem)",
      "Financial ROI and payback period modeling"
    ],
    outcome: "Executive architectural blueprint and board-ready business case with fixed milestones."
  },
  {
    step: "03",
    title: "Build",
    subtitle: "Engineer Applications & Agents",
    icon: Cpu,
    duration: "Week 3–6",
    deliverables: [
      "Custom RAG vector indexing & semantic chunking",
      "Multi-agent workflow orchestration & tool-calling",
      "Deterministic safety guardrails & hallucination filters"
    ],
    outcome: "Hardened, test-covered AI software components running in isolated development sandboxes."
  },
  {
    step: "04",
    title: "Integrate",
    subtitle: "Connect Enterprise Systems & Data",
    icon: Network,
    duration: "Week 5–7",
    deliverables: [
      "Zero-trust API bridges to ERP, CRM, and databases",
      "Enterprise SSO / RBAC access governance",
      "Event-driven messaging and semantic caching"
    ],
    outcome: "Unified ecosystem connecting AI intelligence to real-time corporate data flows securely."
  },
  {
    step: "05",
    title: "Deploy",
    subtitle: "Move from Prototype to Production",
    icon: Rocket,
    duration: "Week 7–9",
    deliverables: [
      "Private VPC deployment (AWS / Azure / On-Prem)",
      "Containerized vLLM / Triton inference clustering",
      "Automated evaluation suites & stress-load validation"
    ],
    outcome: "Live, resilient production AI application serving internal users or external customers."
  },
  {
    step: "06",
    title: "Scale",
    subtitle: "Govern, Monitor & Optimize Continuously",
    icon: TrendingUp,
    duration: "Ongoing",
    deliverables: [
      "Real-time drift detection & token latency monitoring",
      "Continuous prompt regression testing & fine-tuning",
      "Token cost optimization & model routing"
    ],
    outcome: "Measurable, compounding business value with guaranteed SLA uptime and governance compliance."
  }
];

export function AiDeliveryLifecycle() {
  const [activeStep, setActiveStep] = React.useState(0);
  const current = STAGES[activeStep];
  const Icon = current.icon;

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
            The Indusnet Delivery Methodology
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
            From AI Idea to <span className="text-primary">Production Software</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Eliminate prototype paralysis. Our disciplined six-stage engineering lifecycle moves your organization from strategy and sandbox validation to hardened, scalable enterprise software.
          </p>
        </div>

        {/* Step Navigation Pill Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {STAGES.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`group px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-card hover:bg-muted border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={`font-mono ${isActive ? "text-white" : "text-primary"}`}>
                  {s.step}
                </span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Card */}
        <div className="max-w-4xl mx-auto bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle Stage Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Stage Overview */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">Stage {current.step}</span>
                    <Badge variant="outline" className="text-[10px] py-0 border-border">
                      {current.duration}
                    </Badge>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mt-0.5">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm font-semibold text-foreground/90">
                {current.subtitle}
              </p>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">
                  Guaranteed Outcome
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {current.outcome}
                </p>
              </div>
            </div>

            {/* Right Deliverables List */}
            <div className="md:col-span-6 bg-background/60 border border-border/60 rounded-2xl p-6 space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                Stage Deliverables & Verification
              </span>

              <div className="space-y-3">
                {current.deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs text-foreground/90 leading-relaxed font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <button
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : STAGES.length - 1))}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Previous Stage
                </button>
                <button
                  onClick={() => setActiveStep((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0))}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Next Stage →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
