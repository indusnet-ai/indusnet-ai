"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, Cpu, Bot, Search, Zap, Eye, BarChart3, Users, 
  ShieldCheck, Check, Sparkles, Star, ChevronRight, Activity, ShoppingCart, 
  Building2, Landmark, GraduationCap, Truck, Calculator, Layers, Lock, 
  CheckCircle2, Terminal, Network, Shield, ArrowUpRight, ArrowDown, Rocket
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

// 1. Enterprise AI Use Cases Data (Problem → Approach → Outcome)
const ENTERPRISE_USE_CASES = [
  {
    id: "cx",
    domain: "Customer Operations",
    title: "Autonomous Tier-1 & Tier-2 Customer Resolution Agents",
    challenge: "Enterprise support teams are overwhelmed by high ticket volumes, resulting in 4-hour average response delays and high operational burn.",
    approach: "Deploy multi-channel autonomous AI agents integrated with CRM and ticketing APIs, with sentiment-aware escalation and automated action execution.",
    outcome: "Up to 80% automated resolution of inbound inquiries with zero human intervention and sub-10 second resolution latency.",
    capability: "Autonomous AI Agents",
    href: "/services/generative-ai",
    icon: Bot
  },
  {
    id: "knowledge",
    domain: "Enterprise Knowledge",
    title: "Grounded Conversational Intelligence Across 100k+ Private Files",
    challenge: "Critical corporate knowledge is fragmented across SharePoint, Notion, Google Drive, and SQL databases, taking analysts hours to locate.",
    approach: "Private Hybrid RAG (Dense + Sparse Search) with reciprocal rank fusion, permission-aware filtering, and deterministic citation grounding.",
    outcome: "Sub-second verified retrieval across millions of unstructured documents with zero hallucinations and verified source page citations.",
    capability: "Enterprise RAG Solutions",
    href: "/services/generative-ai",
    icon: Search
  },
  {
    id: "engineering",
    domain: "Software Engineering",
    title: "AI-Accelerated Legacy Code Modernization & Migration",
    challenge: "Monolithic legacy codebases lack documentation, causing architectural stagnation, costly technical debt, and multi-year migration estimates.",
    approach: "Deploy specialized code-analysis agent swarms that parse legacy repositories, generate unit test coverage, and synthesize clean modern microservices.",
    outcome: "40% to 60% acceleration in migration velocity with automated regression validation and clean architecture enforcement.",
    capability: "AI Modernization & Consulting",
    href: "/services",
    icon: Cpu
  },
  {
    id: "operations",
    domain: "Intelligent Operations",
    title: "Automated Document Processing & 3-Way Reconciliation",
    challenge: "Accounts payable and procurement teams spend thousands of hours manually cross-referencing PDFs, invoices, shipping logs, and ERP orders.",
    approach: "Vision-language models combined with deterministic policy evaluators to extract tabular data, detect line discrepancies, and commit actions.",
    outcome: "92% reduction in manual verification labor, cutting invoice cycle times from 3 days to under 4 seconds.",
    capability: "AI Workflow Automation",
    href: "/services/generative-ai",
    icon: Zap
  },
  {
    id: "decision",
    domain: "Decision Intelligence",
    title: "Boardroom-Ready Predictive Risk & Telemetry Synthesis",
    challenge: "Executive leadership struggles to reconcile disjointed operational metrics, quarterly filings, and market signals for strategic planning.",
    approach: "Cognitive data synthesis engines that fuse ERP data, real-time news, and financial models into dynamic predictive scenario cockpits.",
    outcome: "Continuous executive briefings with probabilistic forecasting and automated risk sensitivity alerts.",
    capability: "Predictive Analytics & Consulting",
    href: "/services",
    icon: BarChart3
  }
];

// 2. Verified Case Studies (Evidence-Based)
const CASE_STUDIES = [
  {
    client: "Global Financial Services Institution",
    title: "Private VPC RAG Engine Across 100k+ Regulatory Filings",
    challenge: "Analysts spent 45 minutes manually researching cross-jurisdictional compliance filings, risking regulatory oversight.",
    solution: "Engineered an air-gapped hybrid RAG system with open-weights Llama-3 running inside an AWS VPC with zero data retention.",
    tech: ["Llama-3 70B", "PostgreSQL pgvector", "Cohere Rerank", "Docker VPC"],
    metric: "Sub-Second Retrieval",
    metricLabel: "Across 100k+ documents with 100% verified citation accuracy",
    tag: "Banking & Finance"
  },
  {
    client: "Enterprise Retail Logistics Carrier",
    title: "Autonomous Agent Swarm for Multi-Vendor Freight Reconciliation",
    challenge: "Manual 3-way invoice matching between freight bills, bills of lading, and ERP purchase orders caused $1.2M in annual uncaptured billing errors.",
    solution: "Deployed a 5-agent ReAct swarm that extracts table data, validates variances, invokes SAP APIs, and flags discrepancies autonomously.",
    tech: ["GPT-4o", "FastAPI", "SAP ERP Connector", "Python"],
    metric: "88% Cycle-Time Drop",
    metricLabel: "Reconciles 15,000+ monthly shipments in under 5 seconds each",
    tag: "Logistics & Supply Chain"
  },
  {
    client: "Regional Healthcare Network",
    title: "HIPAA-Compliant Clinical Triage & EHR Intake Assistant",
    challenge: "Emergency intake staff spent 20 minutes per patient recording symptoms and transcribing medical histories into EHR systems.",
    solution: "Designed a secure clinical intake assistant with medical entity extraction, generating structured physician summaries prior to consultation.",
    tech: ["Med-PaLM", "Next.js", "Tailwind CSS", "Private Cloud VPC"],
    metric: "14 Min Saved / Intake",
    metricLabel: "Full HIPAA compliance with zero PII exposure to public APIs",
    tag: "Healthcare & Life Sciences"
  },
  {
    client: "Precision Manufacturing Corporation",
    title: "High-Speed Edge Computer Vision for Assembly Defect Detection",
    challenge: "Manual visual inspection allowed a 2.4% component defect escape rate, leading to costly warranty claims.",
    solution: "Built custom edge deep learning models running on on-premise NVIDIA inference accelerators with real-time video defect flagging.",
    tech: ["PyTorch", "NVIDIA TensorRT", "OpenCV", "Edge Kubernetes"],
    metric: "< 0.1% Defect Escape",
    metricLabel: "Processed 120 parts per minute with 99.9% classification precision",
    tag: "Manufacturing"
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-amber-500">
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
                className="p-3 rounded-2xl bg-muted/30 border border-border/60 max-w-xl flex items-center justify-between overflow-x-auto text-[11px] font-mono font-semibold text-muted-foreground no-scrollbar"
              >
                <span className="text-primary font-bold">Strategy</span>
                <span>→</span>
                <span>Architecture</span>
                <span>→</span>
                <span>Applications</span>
                <span>→</span>
                <span>Agents</span>
                <span>→</span>
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
                  className="rounded-full bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-[0_4px_25px_rgba(255,45,33,0.35)] transition-all duration-300 group px-7 flex items-center gap-2 shadow-lg shadow-primary/25"
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
      {/* 2. THE 6-STAGE DELIVERY LIFECYCLE: FROM IDEA TO PRODUCTION               */}
      {/* ========================================================================= */}
      <AiDeliveryLifecycle />

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE AI CAPABILITY STACK: 5-TIER ENTERPRISE ARCHITECTURE       */}
      {/* ========================================================================= */}
      <div id="capabilities">
        <AiCapabilityStack />
      </div>

      {/* ========================================================================= */}
      {/* 4. AGENTIC AI IN ACTION: WORKFLOW SIMULATOR                              */}
      {/* ========================================================================= */}
      <AgentWorkflowSimulator />

      {/* ========================================================================= */}
      {/* 5. ENTERPRISE AI USE CASES (OUTCOME-DRIVEN)                               */}
      {/* ========================================================================= */}
      <section className="relative py-20 bg-muted/15 border-t border-border/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
              Real Enterprise Solutions
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Built for <span className="text-primary">Measurable Outcomes</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              We focus on high-impact enterprise friction points where AI delivers quantified operational acceleration, error elimination, and clear financial payback.
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
                        <span className="text-[10px] font-bold uppercase text-primary block mb-0.5">
                          Measured Business Outcome:
                        </span>
                        <p className="font-semibold text-foreground leading-relaxed">
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

            {/* Interactive Sizer CTA Card in Use Cases Grid */}
            <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/40 rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div className="space-y-3">
                <Badge className="bg-primary text-white text-[10px]">Interactive Sizer</Badge>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  Estimate Your Organization's AI ROI & Hardware Sizing
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Model your unstructured document volume, calculate annual financial savings, and get dedicated NVIDIA GPU cluster specifications in real time.
                </p>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full rounded-full bg-primary text-white font-bold hover:bg-primary/90 text-xs shadow-md shadow-primary/20">
                  <a href="#roi-calculator" className="flex items-center justify-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Open ROI & GPU Sizer
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
      {/* 7. VERIFIED ENTERPRISE EVIDENCE & CASE STUDIES                           */}
      {/* ========================================================================= */}
      <section className="relative py-20 bg-muted/20 border-t border-border/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
              Production Evidence
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
              Proven Production <span className="text-primary">Track Record</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              We measure our engineering success by production SLAs, verified retrieval accuracy, and measurable cycle-time reductions.
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
                    <span className="text-xs text-muted-foreground font-medium">
                      {cs.client}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-foreground leading-snug">
                    {cs.title}
                  </h3>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p><strong className="text-foreground">Challenge:</strong> {cs.challenge}</p>
                    <p><strong className="text-foreground">AI Solution:</strong> {cs.solution}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {cs.tech.map((t, i) => (
                      <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-mono text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                  <div>
                    <span className="text-lg sm:text-xl font-extrabold font-heading text-primary block">
                      {cs.metric}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {cs.metricLabel}
                    </span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
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
      {/* 11. DRAMATIC CLOSING CTA: READY TO BUILD WHAT AI MAKES POSSIBLE?         */}
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
              className="rounded-full bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-[0_4px_25px_rgba(255,45,33,0.35)] transition-all px-8 shadow-lg shadow-primary/25 flex items-center gap-2"
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
