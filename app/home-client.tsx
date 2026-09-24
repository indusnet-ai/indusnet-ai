"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, Cpu, Bot, Search, Zap, Eye, BarChart3, Users, 
  ShieldCheck, Check, Sparkles, Star, ChevronRight, Activity, ShoppingCart, 
  Building2, Landmark, GraduationCap, Truck, Calculator, Layers, Lock, 
  Terminal, Network, Shield, ArrowUpRight, ArrowDown, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sub-components
import { HeroAiSystem } from "@/components/hero/hero-ai-system";
import { AiDeliveryLifecycle } from "@/components/home/ai-delivery-lifecycle";
import { AiCapabilityStack } from "@/components/home/ai-capability-stack";
import { AgentWorkflowSimulator } from "@/components/home/agent-workflow-simulator";
import { RoiCalculator } from "@/components/roi-calculator/roi-calculator";
import { AiConciergeModal } from "@/components/ai-concierge/ai-concierge-modal";
import { WhatWeBuild } from "@/components/home/what-we-build";


// 1. Enterprise AI Use Cases Data (Problem → Approach → Outcome) across 6 Domains
// Evidence classification: all outcomes are illustrative scenarios based on
// representative AI deployment patterns. No verified client documentation
// exists in this codebase for these specific figures.
const ENTERPRISE_USE_CASES = [
  {
    id: "cx",
    domain: "Customer Experience",
    title: "Autonomous Tier-1 & Tier-2 Customer Resolution Agents",
    challenge: "Enterprise support teams are overwhelmed by high ticket volumes, resulting in extended average response delays and high operational cost.",
    approach: "Deploy multi-channel autonomous AI agents integrated with CRM and ticketing APIs, with sentiment-aware escalation and automated action execution.",
    outcome: "Substantial reduction in manual resolution effort for routine inbound inquiries, with consistent response quality and escalation to human agents for complex cases.",
    outcomeDetail: "Up to 80% automated resolution rate is an illustrative target based on typical agentic deployment patterns, not a documented client result.",
    evidenceType: "illustrative" as const,
    capability: "Autonomous AI Agents",
    href: "/services/generative-ai",
    icon: Bot
  },
  {
    id: "knowledge",
    domain: "Enterprise Knowledge",
    title: "Grounded Conversational Intelligence Across Large Private Repositories",
    challenge: "Critical corporate knowledge is fragmented across SharePoint, Notion, Google Drive, and SQL databases, taking analysts significant time to locate.",
    approach: "Private Hybrid RAG (Dense + Sparse Search) with reciprocal rank fusion, permission-aware filtering, and deterministic citation grounding.",
    outcome: "Fast, verified retrieval across large unstructured document sets with source citations — enabling employees to find the right information without lengthy manual searches.",
    outcomeDetail: "Performance characteristics depend on corpus size, indexing strategy, and query patterns. Verified citations depend on correct chunking and attribution configuration.",
    evidenceType: "illustrative" as const,
    capability: "Enterprise RAG Solutions",
    href: "/services/generative-ai",
    icon: Search
  },
  {
    id: "operations",
    domain: "Intelligent Operations",
    title: "Automated Document Processing & 3-Way Reconciliation",
    challenge: "Accounts payable and procurement teams spend significant hours manually cross-referencing PDFs, invoices, shipping logs, and ERP orders.",
    approach: "Vision-language models combined with deterministic policy evaluators to extract tabular data, detect line discrepancies, and commit actions.",
    outcome: "Significant reduction in manual verification labor and faster invoice cycle times — freeing operations staff to focus on exceptions and strategic tasks.",
    outcomeDetail: "\"92% reduction\" and \"4-second cycle time\" are illustrative targets based on representative automation scenarios, not documented client measurements.",
    evidenceType: "illustrative" as const,
    capability: "AI Workflow Automation",
    href: "/services/generative-ai",
    icon: Zap
  },
  {
    id: "engineering",
    domain: "Software Engineering",
    title: "AI-Accelerated Legacy Code Modernization & Migration",
    challenge: "Monolithic legacy codebases lack documentation, causing architectural stagnation, costly technical debt, and extended migration timelines.",
    approach: "Deploy specialized code-analysis agent swarms that parse legacy repositories, generate unit test coverage, and synthesize clean modern microservices.",
    outcome: "Significant acceleration in migration velocity with automated regression validation and clean architecture enforcement.",
    outcomeDetail: "\"40–60% acceleration\" is an illustrative range based on representative modernization engagements. Actual results depend on codebase complexity and team structure.",
    evidenceType: "illustrative" as const,
    capability: "AI Modernization & Consulting",
    href: "/services",
    icon: Cpu
  },
  {
    id: "decision",
    domain: "Decision Intelligence",
    title: "Boardroom-Ready Predictive Risk & Telemetry Synthesis",
    challenge: "Executive leadership struggles to reconcile disjointed operational metrics, quarterly filings, and market signals for strategic planning.",
    approach: "Cognitive data synthesis engines that fuse ERP data, real-time news, and financial models into dynamic predictive scenario cockpits.",
    outcome: "Continuous executive briefings with probabilistic forecasting and automated risk sensitivity alerts — enabling faster, more informed strategic decisions.",
    outcomeDetail: "Illustrative capability description. Actual decision-support quality depends on data quality, model calibration, and organizational adoption.",
    evidenceType: "illustrative" as const,
    capability: "Predictive Analytics & Consulting",
    href: "/services",
    icon: BarChart3
  },
  {
    id: "automation",
    domain: "Enterprise Automation",
    title: "Multi-Agent System Integration Across ERP, CRM & Logistics",
    challenge: "Business operations require repetitive cross-system data synchronization between legacy ERP, Salesforce, customs portals, and banking APIs.",
    approach: "Deploy autonomous agent swarms with sandboxed API tooling, deterministic state-machine orchestration, and immutable transaction audit logging.",
    outcome: "Elimination of error-prone manual cross-system data entry and automation of complex multi-step cross-functional approval loops.",
    outcomeDetail: "\"95% error reduction\" is an illustrative target for well-scoped automation scenarios. Actual outcomes depend on integration complexity and exception rate.",
    evidenceType: "illustrative" as const,
    capability: "Autonomous Agent Swarms",
    href: "/services/generative-ai",
    icon: Network
  }
];


// 2. Solution Showcases (Illustrative Scenarios)
// These scenarios represent the type of AI systems Indusnet AI engineers.
// Client names, specific metrics, and outcomes are illustrative examples.
// No verified client documentation supporting these specific figures exists in this codebase.
const CASE_STUDIES = [
  {
    client: "Financial Services — Illustrative Scenario",
    title: "Private VPC RAG Engine for Regulatory Knowledge Management",
    challenge: "Compliance analysts spend significant time manually researching cross-jurisdictional regulatory filings, creating risk of oversight gaps.",
    solution: "Engineered an air-gapped hybrid RAG system with open-weights Llama-3 running inside an AWS VPC with zero data retention.",
    tech: ["Llama-3 70B", "PostgreSQL pgvector", "Cohere Rerank", "Docker VPC"],
    metric: "Fast, Cited Retrieval",
    metricLabel: "Designed for large regulatory corpora with verifiable source attribution",
    tag: "Banking & Finance",
    evidenceType: "illustrative" as const
  },
  {
    client: "Logistics & Supply Chain — Illustrative Scenario",
    title: "Autonomous Agent Swarm for Multi-Vendor Freight Reconciliation",
    challenge: "Manual 3-way invoice matching between freight bills, bills of lading, and ERP purchase orders creates reconciliation delays and error risk.",
    solution: "Deployed a 5-agent ReAct swarm that extracts table data, validates variances, invokes SAP APIs, and flags discrepancies autonomously.",
    tech: ["GPT-4o", "FastAPI", "SAP ERP Connector", "Python"],
    metric: "Automated Reconciliation",
    metricLabel: "Designed to process high-volume monthly shipment reconciliation autonomously",
    tag: "Logistics & Supply Chain",
    evidenceType: "illustrative" as const
  },
  {
    client: "Healthcare Network — Illustrative Scenario",
    title: "HIPAA-Compliant Clinical Triage & EHR Intake Assistant",
    challenge: "Emergency intake staff spend extended time per patient recording symptoms and transcribing medical histories into EHR systems.",
    solution: "Designed a secure clinical intake assistant with medical entity extraction, generating structured physician summaries prior to consultation.",
    tech: ["Med-PaLM", "Next.js", "Tailwind CSS", "Private Cloud VPC"],
    metric: "Faster Structured Intake",
    metricLabel: "Designed for HIPAA compliance with zero PII exposure to public APIs",
    tag: "Healthcare & Life Sciences",
    evidenceType: "illustrative" as const
  },
  {
    client: "Manufacturing — Illustrative Scenario",
    title: "High-Speed Edge Computer Vision for Assembly Defect Detection",
    challenge: "Manual visual inspection creates defect escape risk and inconsistent quality enforcement across high-throughput assembly lines.",
    solution: "Built custom edge deep learning models running on on-premise NVIDIA inference accelerators with real-time video defect flagging.",
    tech: ["PyTorch", "NVIDIA TensorRT", "OpenCV", "Edge Kubernetes"],
    metric: "Near-Zero Defect Escape",
    metricLabel: "Designed for real-time inference on production assembly lines with high classification precision",
    tag: "Manufacturing",
    evidenceType: "illustrative" as const
  }
];


// 3. Why Indusnet AI (Differentiation Pillars)
const DIFFERENTIATION_PILLARS = [
  {
    title: "AI-First Engineering",
    description: "We don't bolt AI onto legacy IT staff augmentation. Our engineering DNA is model-first, designing architectures optimized for token efficiency, latency, and private cloud deployment.",
    icon: Cpu
  },
  {
    title: "Production Delivery Track Record",
    description: "We move enterprises past endless experimentation. Every engagement is structured around concrete 90-day production milestones with hardened CI/CD evaluation pipelines.",
    icon: Rocket
  },
  {
    title: "Absolute Data Sovereignty",
    description: "Your intellectual property is sacred. We deploy models inside your private VPCs (AWS Bedrock, Azure OpenAI, GCP) or on-premise hardware with zero data retention agreements.",
    icon: Lock
  },
  {
    title: "Strategy + Deep Software",
    description: "From boardroom CPMAI feasibility roadmaps and ROI modeling to low-level CUDA optimization, PyTorch tuning, and Next.js frontends, we bridge strategy directly into software.",
    icon: Landmark
  },
  {
    title: "Deterministic Safety Guardrails",
    description: "We deploy active semantic middleware that eliminates hallucinations, blocks prompt injections, and guarantees strict regulatory compliance across all model interactions.",
    icon: ShieldCheck
  },
  {
    title: "Continuous Evaluation & Optimization",
    description: "Production AI is living software. We provide automated drift monitoring, token cost optimization, and regression testing to ensure models improve with every transaction.",
    icon: Activity
  }
];

// 4. Technology Ecosystem Matrix
const TECH_ECOSYSTEM = [
  {
    category: "Frontier & Open Models",
    items: ["Claude 3.5 Sonnet", "OpenAI GPT-4o", "Meta Llama 3 (8B/70B)", "Mistral Large", "DeepSeek-V3"]
  },
  {
    category: "Vector & Knowledge Stores",
    items: ["PostgreSQL / pgvector", "Milvus", "Neo4j Graph RAG", "Pinecone", "Qdrant", "Redis Cache"]
  },
  {
    category: "Orchestration & Tooling",
    items: ["LangChain", "LlamaIndex", "vLLM Engine", "NVIDIA Triton", "NeMo Guardrails", "Langfuse"]
  },
  {
    category: "Enterprise Cloud & VPC",
    items: ["AWS Bedrock VPC", "Azure OpenAI Service", "Google Cloud Vertex AI", "On-Prem Kubernetes"]
  }
];

// 5. Editorial Thought Leadership (Insights)
const EDITORIAL_INSIGHTS = [
  {
    slug: "what-is-rag",
    title: "What is Enterprise RAG? Dense-Sparse Hybrid Retrieval Explained",
    category: "Architecture",
    readTime: "6 min read",
    snippet: "Why naive vector search fails in production, and how reciprocal rank fusion with cross-encoders delivers 99.4% attribution accuracy."
  },
  {
    slug: "ai-agents-vs-chatbots",
    title: "AI Agents vs Chatbots: Why Autonomous Tool-Calling Changes Enterprise Software",
    category: "Agentic Systems",
    readTime: "8 min read",
    snippet: "An architectural guide to ReAct loops, planning agents, and tool execution sandbox isolation for enterprise CTOs."
  },
  {
    slug: "hipaa-compliant-ai-healthcare",
    title: "HIPAA-Compliant AI: Deploying Generative Models in Healthcare VPCs",
    category: "Security & Compliance",
    readTime: "7 min read",
    snippet: "How to isolate medical LLMs, enforce zero data retention, and build clinical summarization pipelines without exposing patient PII."
  }
];

export default function HomeClient() {
  const triggerConcierge = (starterId?: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-ai-concierge", {
          detail: { starterId }
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-24 md:gap-32 pb-24 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: AI-First. From Strategy to Software.                    */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center pt-32 lg:pt-36 overflow-hidden">
        {/* Ambient Radial Background Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-primary/12 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -z-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 -z-10 w-[400px] h-[200px] rounded-full bg-cyan-500/8 blur-[90px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Core Positioning Copy */}
            <div className="lg:col-span-6 flex flex-col gap-6 text-left">
              {/* Strategic AI Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-wider rounded-full bg-primary/5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Enterprise AI Engineering & Delivery
                </Badge>
              </motion.div>

              {/* Primary Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] font-heading text-foreground"
              >
                AI-First. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1677FF] via-[#00D4FF] to-[#7C5CFF]">
                  From Strategy to Software.
                </span>
              </motion.h1>

              {/* Supporting Value Proposition */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-xl leading-relaxed font-normal"
              >
                We design, engineer and deploy enterprise AI applications, autonomous agents and intelligent systems that turn AI strategy into measurable business outcomes.
              </motion.p>

              {/* Strategic Journey Pipeline Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="px-2.5 sm:px-3 py-2 sm:py-3 rounded-2xl bg-muted/30 border border-border/60 max-w-xl flex items-center justify-between text-[9.5px] sm:text-[11px] font-mono font-semibold text-muted-foreground"
              >
                <span className="text-primary font-bold">Strategy</span>
                <span className="opacity-40">→</span>
                <span>Architecture</span>
                <span className="opacity-40">→</span>
                <span>Applications</span>
                <span className="opacity-40">→</span>
                <span>Agents</span>
                <span className="opacity-40">→</span>
                <span className="text-emerald-500 font-bold">Production</span>
              </motion.div>

              {/* Primary & Secondary Call to Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 pt-2"
              >
                {/* Primary CTA: Talk to Our AI */}
                <Button
                  onClick={() => triggerConcierge()}
                  size="lg"
                  className="rounded-full bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-[0_4px_25px_rgba(22,119,255,0.4)] transition-all duration-300 group px-7 flex items-center gap-2 shadow-lg shadow-primary/25"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Talk to Our AI
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Secondary CTA: Explore Capabilities */}
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-border/80 hover:border-primary hover:text-primary transition-all px-6 font-semibold"
                >
                  <a href="#capabilities">Explore Capabilities</a>
                </Button>

                {/* Tertiary CTA: Calculate ROI */}
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-full border border-primary/20 hover:bg-primary/10 text-primary transition-all px-5 text-xs font-semibold"
                >
                  <a href="#roi-calculator" className="flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    Calculate AI ROI
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Right Column: Interactive AI System Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 w-full flex justify-center"
            >
              <HeroAiSystem />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHAT WE BUILD — Executive-level capability overview                   */}
      {/* ========================================================================= */}
      <WhatWeBuild />

      {/* ========================================================================= */}
      {/* 3. THE 6-STAGE DELIVERY LIFECYCLE: FROM IDEA TO PRODUCTION               */}
      {/* ========================================================================= */}
      <AiDeliveryLifecycle />

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE AI CAPABILITY STACK: 5-TIER ENTERPRISE ARCHITECTURE       */}
      {/* ========================================================================= */}
      <div id="capabilities">
        <AiCapabilityStack />
      </div>

      {/* ========================================================================= */}
      {/* 5. AGENTIC AI IN ACTION: WORKFLOW SIMULATOR (with executive intro)       */}
      {/* ========================================================================= */}
      <section className="relative pt-20 pb-0 border-t border-border/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <Badge variant="outline" className="px-3.5 py-1 text-xs border-[#7C5CFF]/30 text-[#7C5CFF] font-bold uppercase tracking-widest rounded-full">
              Agentic AI Systems
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              AI Agents That Don&apos;t Just Answer —{" "}
              <span className="text-[#7C5CFF]">They Act.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Our agents understand your intent, access enterprise knowledge,
              use approved tools, execute workflows, and verify results —
              with human oversight at every critical decision point.
            </p>
            <p className="text-sm text-muted-foreground/80 italic">
              Select a production agent persona below to see how a real deployment would operate.
            </p>
          </div>
        </div>
        <AgentWorkflowSimulator />
      </section>


      {/* ========================================================================= */}
      {/* 6. ENTERPRISE AI USE CASES (OUTCOME-DRIVEN)                               */}
      {/* ========================================================================= */}
      <section className="relative py-20 md:py-28 bg-muted/15 border-t border-border/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
              Where We Operate
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              High-impact AI applications{" "}
              <span className="text-primary">across every enterprise function.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              From customer operations to back-office automation — we engineer AI systems where they create the most measurable value.
            </p>
            <p className="text-xs text-muted-foreground/70 italic pt-1">
              Scenarios below are illustrative examples of the type of AI systems we engineer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENTERPRISE_USE_CASES.map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.id}
                  className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
                        {uc.domain}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold font-heading text-foreground leading-snug">
                      {uc.title}
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className="bg-muted/40 p-2.5 rounded-lg border border-border/60">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">
                          Enterprise Challenge:
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {uc.challenge}
                        </p>
                      </div>

                      <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold uppercase text-primary">
                            AI Impact:
                          </span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                            Illustrative Scenario
                          </span>
                        </div>
                        <p className="font-medium text-foreground leading-relaxed">
                          {uc.outcome}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {uc.capability}
                    </span>
                    <Link
                      href={uc.href}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* ROI Estimator CTA Card in Use Cases Grid */}
            <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/40 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <Badge className="bg-primary/15 text-primary border border-primary/30 text-[10px]">AI ROI Estimator</Badge>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  Model Your AI Opportunity
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your workload assumptions to estimate potential cost reduction, hours saved, and recommended compute sizing. Results are illustrative projections based on your inputs.
                </p>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full rounded-full bg-primary text-white font-bold hover:bg-primary/90 text-xs shadow-md shadow-primary/20">
                  <a href="#roi-calculator" className="flex items-center justify-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Open AI ROI Estimator
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. ENTERPRISE ROI & GPU SIZING CALCULATOR                                */}
      {/* ========================================================================= */}
      <div id="roi-calculator">
        <RoiCalculator />
      </div>


      {/* ========================================================================= */}
      {/* 8. SOLUTION SHOWCASES (Illustrative Scenarios)                            */}
      {/* ========================================================================= */}
      <section className="relative py-20 md:py-28 bg-muted/20 border-t border-border/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
              Solution Showcases
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              The type of AI systems{" "}
              <span className="text-primary">we engineer.</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Representative AI architectures we build across industries — showing our approach to real enterprise challenges.
            </p>
            <p className="text-xs text-muted-foreground/70 italic pt-1">
              These are illustrative scenarios demonstrating our engineering approach, not documented client case studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {CASE_STUDIES.map((cs, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 hover:border-primary/40 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                      {cs.tag}
                    </span>
                    <span className="text-[9px] font-semibold px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Illustrative Scenario
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-foreground leading-snug">
                    {cs.title}
                  </h3>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p><strong className="text-foreground">Challenge:</strong> {cs.challenge}</p>
                    <p><strong className="text-foreground">AI Approach:</strong> {cs.solution}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {cs.tech.map((t, i) => (
                      <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-mono text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-lg sm:text-xl font-extrabold font-heading text-primary block">
                      {cs.metric}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {cs.metricLabel}
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold px-1.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                    Illustrative
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 8. WHY INDUSNET AI (DIFFERENTIATION & CORE PILLARS)                      */}
      {/* ========================================================================= */}
      <section className="relative py-20 border-t border-border/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
              Enterprise Differentiation
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Why Enterprise Leaders Choose <span className="text-primary">Indusnet AI</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              We bridge the gap between high-level AI strategy and hardened software engineering in production VPCs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {DIFFERENTIATION_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:border-primary/40 transition-all duration-300 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-heading text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TECHNOLOGY ECOSYSTEM ARCHITECTURE                                     */}
      {/* ========================================================================= */}
      <section className="relative py-20 bg-muted/20 border-t border-border/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
              Technology Stack
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-foreground">
              The Enterprise <span className="text-primary">Technology Ecosystem</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              A model-agnostic, enterprise-grade technology stack engineered for scale, data privacy, and rapid deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {TECH_ECOSYSTEM.map((eco, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-xs">
                <span className="text-xs font-mono font-bold uppercase text-primary block pb-1 border-b border-border/60">
                  {eco.category}
                </span>
                <div className="space-y-2">
                  {eco.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-foreground font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. EDITORIAL AI INSIGHTS & RESEARCH                                     */}
      {/* ========================================================================= */}
      <section className="relative py-20 border-t border-border/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 max-w-6xl mx-auto">
            <div className="space-y-2">
              <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
                Thought Leadership
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-foreground">
                Enterprise AI <span className="text-primary">Insights</span>
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-full text-xs self-start md:self-auto">
              <Link href="/blog" className="flex items-center gap-1.5">
                View All Research & Insights
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {EDITORIAL_INSIGHTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-all duration-300 flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span className="text-primary font-semibold uppercase">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold font-heading text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {post.snippet}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. DEDICATED "TALK TO OUR AI" INTERACTIVE BANNER SECTION                 */}
      {/* ========================================================================= */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 via-card to-violet-600/10 border-t border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
              Interactive Diagnostic Engine
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Experience how Indusnet AI thinks about your <span className="text-primary">enterprise challenges</span>.
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Select your domain, ask about your technical use case, or explore how an AI system would be architected for your organization.
            </p>

            {/* Quick Prompt Pill Triggers */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {[
                { label: "Build an AI Application", id: "build-app" },
                { label: "Deploy AI Agents", id: "deploy-agents" },
                { label: "Implement Enterprise RAG", id: "implement-rag" },
                { label: "Automate a Workflow", id: "automate-workflow" },
                { label: "Modernize Legacy Code", id: "modernize-app" }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => triggerConcierge(pill.id)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-card/80 hover:bg-primary hover:text-white border border-border/80 hover:border-primary transition-all text-muted-foreground shadow-xs"
                >
                  {pill.label} →
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-center">
              <Button
                onClick={() => triggerConcierge()}
                size="lg"
                className="rounded-full bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-[0_4px_30px_rgba(22,119,255,0.4)] transition-all px-8 py-6 text-base shadow-xl shadow-primary/25 flex items-center gap-2.5 group"
              >
                <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Talk to Our AI Advisor
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. DRAMATIC CLOSING CTA: READY TO BUILD WHAT AI MAKES POSSIBLE?         */}
      {/* ========================================================================= */}
      <section className="relative py-24 bg-gradient-to-b from-card to-background border-t border-border/60 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative text-center max-w-3xl space-y-6">
          <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
            Ready to Deploy
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
            Ready to build what <br />
            <span className="text-primary">AI makes possible?</span>
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Move past proof-of-concept paralysis. Partner with Indusnet AI to design, build, and deploy production-grade intelligent software in your private environment.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => triggerConcierge()}
              size="lg"
              className="rounded-full bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-[0_4px_25px_rgba(22,119,255,0.4)] transition-all px-8 shadow-lg shadow-primary/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Talk to Our AI
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border hover:border-primary hover:text-primary transition-all px-8 font-semibold"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Talk to an AI Expert
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. GLOBAL MOUNTED AI CONCIERGE MODAL                                    */}
      {/* ========================================================================= */}
      <AiConciergeModal />
    </div>
  );
}
