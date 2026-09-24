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
  executiveMeaning: string;
  deliveryActivity: string;
  deliverables: string[];
  techStack: string[];
}

const STAGES: LifecycleStage[] = [
  {
    step: "01",
    title: "Discover",
    summary: "Identify valuable AI opportunities and evaluate enterprise feasibility.",
    icon: Search,
    duration: "Weeks 1–2",
    executiveMeaning: "Leadership gains objective clarity on high-impact workflows, data readiness, and ROI boundaries before capital commitment.",
    deliveryActivity: "We audit cognitive task friction, profile private data sources, define security perimeters, and calculate payback timelines.",
    deliverables: [
      "Cognitive task friction & workflow bottleneck audit",
      "Enterprise data readiness & access permission audit",
      "Regulatory, privacy, and compliance boundary mapping",
      "Feasibility matrix prioritized by measurable business value"
    ],
    techStack: ["CPMAI Matrix", "Data Readiness Audit", "Zero-Trust Security Review"]
  },
  {
    step: "02",
    title: "Strategize",
    summary: "Formulate architecture, model selection, and milestone roadmap.",
    icon: Compass,
    duration: "Weeks 2–3",
    executiveMeaning: "Eliminates proof-of-concept paralysis by establishing a cost-bounded technical and operational blueprint.",
    deliveryActivity: "We select optimal frontier vs private open-weights models, size GPU compute environments, and establish 90-day production milestones.",
    deliverables: [
      "Model selection matrix (Frontier APIs vs Private SLMs)",
      "Compute & VRAM sizing (Cloud VPC vs Dedicated On-Prem)",
      "Payback timeline & token cost boundary modeling",
      "Boardroom-ready 90-day production milestone plan"
    ],
    techStack: ["Model Routing Specs", "VPC Architecture Blueprint", "ROI Projections"]
  },
  {
    step: "03",
    title: "Design",
    summary: "Design the user experience, interaction paradigms, and safety guardrails.",
    icon: Palette,
    duration: "Weeks 3–4",
    executiveMeaning: "Ensures rapid employee adoption, intuitive interfaces, and strict hallucination mitigation before writing application code.",
    deliveryActivity: "We wireframe conversational and streaming cockpits, define human-in-the-loop escalation gates, and craft semantic guardrails.",
    deliverables: [
      "Streaming copilot and conversational interface wireframes",
      "Human-in-the-loop escalation workflows & approval gates",
      "Deterministic safety guardrails & semantic prompt filters",
      "Zero-data-retention data flow specifications"
    ],
    techStack: ["Next.js Streaming UIs", "NeMo Guardrail Specs", "RBAC Policy Matrix"]
  },
  {
    step: "04",
    title: "Build",
    summary: "Engineer applications, agents, knowledge pipelines, and APIs.",
    icon: Cpu,
    duration: "Weeks 4–7",
    executiveMeaning: "Translates strategic architecture into robust, unit-tested enterprise software with ground-truth validation.",
    deliveryActivity: "We implement hybrid RAG indices, multi-agent state machines, OpenAPI sandboxes, and semantic caching layers.",
    deliverables: [
      "Hybrid dense-sparse vector indexing with cross-encoder re-ranking",
      "Autonomous multi-agent execution loops with sandboxed tools",
      "Semantic caching layers minimizing latency and token costs",
      "Comprehensive evaluation suites with ground-truth regression benchmarks"
    ],
    techStack: ["PostgreSQL pgvector", "LangChain / LlamaIndex", "Redis", "vLLM Engine"]
  },
  {
    step: "05",
    title: "Integrate",
    summary: "Connect intelligence directly into installed enterprise systems.",
    icon: Layers,
    duration: "Weeks 7–8",
    executiveMeaning: "Unlocks the value of existing investments in ERP, CRM, and databases without requiring disruptive system overhauls.",
    deliveryActivity: "We engineer bidirectional adapters for SAP, Salesforce, SQL data warehouses, and identity providers under strict zero-trust controls.",
    deliverables: [
      "Bidirectional connectors for ERP, CRM, and transactional systems",
      "Enterprise SSO (SAML 2.0 / Okta) and role-based access synchronization",
      "Zero-trust API gateways with rate limiting and payload validation",
      "End-to-end integration and data consistency stress testing"
    ],
    techStack: ["REST / gRPC Gateways", "SAP / Salesforce RFC", "SAML 2.0 / Okta", "OAuth2 Scoping"]
  },
  {
    step: "06",
    title: "Deploy",
    summary: "Roll out hardened software into isolated enterprise production environments.",
    icon: Rocket,
    duration: "Weeks 8–9",
    executiveMeaning: "Achieves safe production launch in your private VPC with strict compliance, high availability, and zero vendor lock-in.",
    deliveryActivity: "We orchestrate containerized inference clusters, configure auto-scaling policies, and conduct live production readiness reviews.",
    deliverables: [
      "Private VPC enclave deployment (AWS Bedrock / Azure / GCP / On-Prem)",
      "High-availability containerized clustering with autoscaling policies",
      "Production latency SLA and load validation under peak concurrency",
      "SOC-2 / HIPAA compliance audit signoff and disaster recovery runbooks"
    ],
    techStack: ["Kubernetes", "AWS / Azure VPC Enclaves", "Docker", "Triton Server"]
  },
  {
    step: "07",
    title: "Scale",
    summary: "Monitor, optimize token economics, and expand agent capabilities.",
    icon: TrendingUp,
    duration: "Ongoing",
    executiveMeaning: "Compounds operational returns over time through continuous performance optimization and cross-departmental leverage.",
    deliveryActivity: "We monitor real-time token drift, fine-tune models on feedback loops, dynamically route queries for cost reduction, and scale agent swarms.",
    deliverables: [
      "Real-time latency, drift detection, and hallucination scoring",
      "Dynamic model routing for continuous token cost reduction",
      "Continuous regression testing and selective parameter fine-tuning",
      "Expansion blueprints for cross-departmental agentic swarms"
    ],
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
            Move systematically from boardroom strategy to hardened production code. A disciplined, 7-stage engineering journey built for enterprise velocity, governance, and measurable ROI.
          </p>
        </div>

        {/* Animated Journey Road Map Line */}
        <div className="relative max-w-5xl mx-auto mb-10">
          {/* Connecting Background Line */}
          <div className="hidden lg:block absolute top-1/2 left-6 right-6 h-0.5 bg-[#162238] -translate-y-1/2 -z-10" />

          {/* Stepper Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {STAGES.map((s, idx) => {
              const isSelected = activeStepIndex === idx;
              const isPast = activeStepIndex > idx;
              const Icon = s.icon;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2.5 group relative cursor-pointer ${
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
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
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
                      {s.duration}
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
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm shrink-0">
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

              <p className="text-sm font-semibold text-[#F5F7FA] leading-snug">
                {current.summary}
              </p>

              {/* Executive Meaning */}
              <div className="p-3.5 rounded-2xl bg-[#0D1828] border border-[#162238] space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-primary tracking-wider block">
                  Executive Meaning (Business Perspective)
                </span>
                <p className="text-xs text-[#A7B4C5] leading-relaxed">
                  {current.executiveMeaning}
                </p>
              </div>

              {/* Delivery Activity */}
              <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-primary tracking-wider block">
                  Delivery Activity (What Indusnet AI Does)
                </span>
                <p className="text-xs text-[#F5F7FA] leading-relaxed">
                  {current.deliveryActivity}
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
