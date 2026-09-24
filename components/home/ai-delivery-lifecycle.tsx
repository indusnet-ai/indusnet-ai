"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Compass, Palette, Cpu, Rocket, TrendingUp, 
  Check, ArrowRight, CheckCircle2, Sparkles, Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LifecycleStage {
  step: string;
  title: string;
  summary: string;
  icon: any;
  duration: string;
  deliverables: string[];
  businessValue: string;
  techStack: string[];
}

const STAGES: LifecycleStage[] = [
  {
    step: "01",
    title: "Discover",
    summary: "Identify valuable AI opportunities.",
    icon: Search,
    duration: "Week 1–2",
    deliverables: [
      "Cognitive task friction & bottleneck scoring",
      "Proprietary enterprise data readiness audit",
      "Regulatory, privacy, and compliance boundary mapping",
      "Feasibility matrix ranked by measurable business return"
    ],
    businessValue: "Pinpoints high-ROI enterprise use cases with rapid feasibility validation.",
    techStack: ["CPMAI Matrix", "Data Audit Scorer", "Security Boundary Review"]
  },
  {
    step: "02",
    title: "Strategize",
    summary: "Define roadmap and architecture.",
    icon: Compass,
    duration: "Week 2–3",
    deliverables: [
      "Frontier vs Private open-weights SLM selection",
      "Hardware compute & VRAM sizing (Cloud VPC vs On-Prem)",
      "Financial ROI and payback timeline modeling",
      "Boardroom-ready 90-day execution milestone plan"
    ],
    businessValue: "Eliminates prototype paralysis with a hardened, cost-bounded architecture roadmap.",
    techStack: ["NVIDIA Sizing Models", "VPC Architecture Blueprint", "ROI Projections"]
  },
  {
    step: "03",
    title: "Design",
    summary: "Design the AI experience and system.",
    icon: Palette,
    duration: "Week 3–4",
    deliverables: [
      "Human-in-the-loop interaction & escalation design",
      "Streaming copilot interface & feedback wireframes",
      "Deterministic safety guardrails & semantic prompt filters",
      "Zero-data-retention data flow specifications"
    ],
    businessValue: "Promotes intuitive enterprise adoption with active hallucination mitigation.",
    techStack: ["Next.js 16 Streaming Wireframes", "NeMo Guardrail Specs", "RBAC Flow"]
  },
  {
    step: "04",
    title: "Build",
    summary: "Engineer applications, agents and workflows.",
    icon: Cpu,
    duration: "Week 4–7",
    deliverables: [
      "Hybrid RAG vector indexing with dense-sparse re-ranking",
      "Multi-agent swarm coordination with sandboxed OpenAPI tools",
      "Semantic caching layers for sub-second latency and significant LLM API cost reduction",
      "Unit testing, regression benchmarking, and ground-truth evaluation"
    ],
    businessValue: "Production-grade, test-covered AI software components ready for integration.",
    techStack: ["PostgreSQL pgvector", "LangChain / LlamaIndex", "Redis Cache", "vLLM"]
  },
  {
    step: "05",
    title: "Deploy",
    summary: "Move AI into production.",
    icon: Rocket,
    duration: "Week 7–9",
    deliverables: [
      "Private VPC deployment (AWS Bedrock / Azure OpenAI / GCP / On-Prem)",
      "Containerized inference clustering with autoscaling policies",
      "Enterprise SSO (SAML 2.0 / Okta) and RBAC synchronization",
      "Stress-load testing and latency SLA validation"
    ],
    businessValue: "Hardened software serving live operational workloads with production-grade uptime targets.",
    techStack: ["Kubernetes", "AWS/Azure VPC Enclaves", "Triton / vLLM", "Docker"]
  },
  {
    step: "06",
    title: "Scale",
    summary: "Govern, optimize and expand.",
    icon: TrendingUp,
    duration: "Ongoing",
    deliverables: [
      "Real-time drift detection and hallucination scoring",
      "Continuous prompt regression testing and model fine-tuning",
      "Dynamic model routing for continuous token cost reduction",
      "Expansion into cross-departmental agentic swarms"
    ],
    businessValue: "Compounding operational returns with enterprise-wide cognitive leverage.",
    techStack: ["Langfuse Observability", "OpenTelemetry", "Continuous Eval CI/CD"]
  }
];

export function AiDeliveryLifecycle() {
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const current = STAGES[activeStepIndex];
  const StepIcon = current.icon;

  return (
    <section className="relative py-24 overflow-hidden bg-[#050B14] border-t border-[#162238]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full bg-primary/5">
            Engineering Methodology
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-[#F5F7FA]">
            From Strategy <span className="text-primary">to Software</span>
          </h2>
          <p className="text-[#A7B4C5] text-base sm:text-lg leading-relaxed">
            Move seamlessly from boardroom strategy to hardened production code. A disciplined, 6-stage engineering journey built for enterprise speed, security, and measurable ROI.
          </p>
        </div>

        {/* Animated Journey Road Map Line */}
        <div className="relative max-w-5xl mx-auto mb-10">
          {/* Connecting Background Line */}
          <div className="hidden lg:block absolute top-1/2 left-6 right-6 h-0.5 bg-[#162238] -translate-y-1/2 -z-10" />

          {/* Stepper Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STAGES.map((s, idx) => {
              const isSelected = activeStepIndex === idx;
              const isPast = activeStepIndex > idx;
              const Icon = s.icon;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 group relative cursor-pointer ${
                    isSelected
                      ? "bg-[#0D1828] border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                      : isPast
                      ? "bg-[#08111F] border-emerald-500/40 text-[#F5F7FA]"
                      : "bg-[#08111F] border-[#162238] text-[#A7B4C5] hover:border-primary/40 hover:text-[#F5F7FA]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs font-bold ${isSelected ? "text-primary" : "text-[#6F7E91]"}`}>
                      {s.step}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-primary text-white shadow-sm"
                          : "bg-[#0D1828] text-[#A7B4C5] group-hover:text-primary"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#F5F7FA] group-hover:text-primary transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-[10px] text-[#A7B4C5] line-clamp-1 mt-0.5">
                      {s.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Deep-Dive Showcase Card */}
        <div className="max-w-4xl mx-auto bg-[#08111F] border border-[#162238] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: Stage Overview & Value */}
            <div className="md:col-span-6 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                  <StepIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">Stage {current.step}</span>
                    <Badge variant="outline" className="text-[10px] py-0 border-[#162238] text-[#A7B4C5]">
                      {current.duration}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-[#F5F7FA] mt-0.5">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-base font-semibold text-[#F5F7FA] leading-snug">
                {current.summary}
              </p>

              <div className="p-4 rounded-2xl bg-[#0D1828] border border-[#162238] space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-primary tracking-wider block">
                  What this means for your business
                </span>
                <p className="text-xs text-[#A7B4C5] leading-relaxed">
                  {current.businessValue}
                </p>
              </div>

              {/* Tech Stack Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6F7E91] block font-bold">
                  Key Tooling & Frameworks
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {current.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-[#0D1828] border border-[#162238] px-2.5 py-1 rounded-md text-[#F5F7FA]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Technical Deliverables */}
            <div className="md:col-span-6 bg-[#050B14] border border-[#162238] rounded-2xl p-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary block">
                Deliverables & Verification
              </span>

              <div className="space-y-3">
                {current.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs text-foreground/90 leading-relaxed font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : STAGES.length - 1))}
                  className="font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Stage {STAGES[(activeStepIndex > 0 ? activeStepIndex - 1 : STAGES.length - 1)].step}
                </button>
                <button
                  onClick={() => setActiveStepIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : 0))}
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Stage {STAGES[(activeStepIndex < STAGES.length - 1 ? activeStepIndex + 1 : 0)].step} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
