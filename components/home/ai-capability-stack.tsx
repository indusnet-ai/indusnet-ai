"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Network, Bot, Layout, ShieldCheck, 
  Sparkles, CheckCircle2, ArrowRight, Layers, Lock, Database,
  Info, ExternalLink, HelpCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CapabilityItem {
  id: string;
  name: string;
  whatItIs: string;
  whyItMatters: string;
  whereItIsUsed: string;
  relevantUseCase: string;
}

interface CapabilityLayer {
  layerNumber: number;
  layerTitle: string;
  tagline: string;
  icon: any;
  accentColor: string;
  capabilities: CapabilityItem[];
}

const ARCHITECTURE_LAYERS: CapabilityLayer[] = [
  {
    layerNumber: 1,
    layerTitle: "LAYER 1 — INTELLIGENCE",
    tagline: "Foundation Models, Multimodal Reasoning & ML",
    icon: Cpu,
    accentColor: "#7C5CFF", // Violet
    capabilities: [
      {
        id: "foundation-models",
        name: "Foundation Models",
        whatItIs: "Pre-trained deep neural architectures capable of broad linguistic, logical, and code comprehension across zero-shot prompts.",
        whyItMatters: "Provides high-level semantic reasoning without requiring billions in training compute from the enterprise.",
        whereItIsUsed: "Core cognitive engine powering copilots, conversational routing, and code analysis.",
        relevantUseCase: "Routing complex inquiries between Anthropic Claude 3.5 Sonnet and OpenAI GPT-4o based on latency/cost budgets."
      },
      {
        id: "llms",
        name: "LLMs (Large Language Models)",
        whatItIs: "Advanced text transformers specialized in summarization, reasoning, translation, and structured data transformation.",
        whyItMatters: "Turns unstructured paragraphs into clean JSON schemas, SQL queries, or boardroom briefs instantly.",
        whereItIsUsed: "Contract analysis, customer response generation, automated documentation, and email triage.",
        relevantUseCase: "Parsing 200-page vendor Master Service Agreements (MSAs) into structured risk matrices."
      },
      {
        id: "multimodal-ai",
        name: "Multimodal AI",
        whatItIs: "Models trained jointly on text, images, diagrams, PDFs, tables, and audio streams.",
        whyItMatters: "Real enterprise documents are not plain text; they contain scans, signatures, charts, and blueprints.",
        whereItIsUsed: "Invoice OCR, medical image triage, blueprint extraction, and multi-speaker transcription.",
        relevantUseCase: "Extracting complex nested financial tables and handwritten notes from scanned freight manifests."
      },
      {
        id: "machine-learning",
        name: "Machine Learning",
        whatItIs: "Supervised and unsupervised statistical models tailored for tabular regression, classification, and anomaly detection.",
        whyItMatters: "Faster and more deterministic than LLMs for numerical forecasting, fraud detection, and pricing optimization.",
        whereItIsUsed: "Demand forecasting, credit risk scoring, equipment failure prediction, and churn modeling.",
        relevantUseCase: "Predicting equipment breakdown 14 days in advance using plant sensor telemetry."
      }
    ]
  },
  {
    layerNumber: 2,
    layerTitle: "LAYER 2 — KNOWLEDGE",
    tagline: "RAG, Enterprise Search & Knowledge Graphs",
    icon: Network,
    accentColor: "#00D4FF", // Cyan
    capabilities: [
      {
        id: "rag",
        name: "RAG (Retrieval-Augmented Generation)",
        whatItIs: "A design pattern that fetches proprietary company documents and injects them as verifiable context into LLM prompts.",
        whyItMatters: "Actively mitigates model hallucinations by grounding answers directly in private, permissioned corporate archives.",
        whereItIsUsed: "Internal corporate Q&A, HR benefit portals, compliance audit bots, and legal discovery.",
        relevantUseCase: "Instant cross-checking of regulatory filings with verified source citations."
      },
      {
        id: "enterprise-search",
        name: "Enterprise Search",
        whatItIs: "Unified lexical (BM25) and semantic search indexing across SharePoint, Google Drive, Notion, Confluence, and databases.",
        whyItMatters: "Breaks down internal data silos, allowing employees to locate needles in multi-terabyte document haystacks.",
        whereItIsUsed: "Enterprise knowledge hubs, cross-departmental intranet portals, and customer support centers.",
        relevantUseCase: "Allowing financial analysts to locate specific credit clauses across 15 years of archived PDF memos."
      },
      {
        id: "knowledge-graphs",
        name: "Knowledge Graphs",
        whatItIs: "Graph-structured databases (e.g. Neo4j) representing multi-hop relationships between entities, people, policies, and products.",
        whyItMatters: "Pure vector search lacks relationship understanding. Graphs preserve the explicit organizational hierarchy.",
        whereItIsUsed: "Graph RAG, supply chain risk mapping, pharmaceutical drug discovery, and AML fraud networks.",
        relevantUseCase: "Tracing vendor ownership trees across 4 shell corporations to verify conflict-of-interest compliance."
      },
      {
        id: "vector-databases",
        name: "Vector Databases",
        whatItIs: "Specialized high-dimensional vector stores (PostgreSQL pgvector, Milvus, Pinecone) indexing mathematical document embeddings.",
        whyItMatters: "Enables sub-50ms approximate nearest neighbor (ANN) retrieval over millions of chunks.",
        whereItIsUsed: "Semantic caching, real-time recommendation engines, and high-throughput RAG pipelines.",
        relevantUseCase: "Sub-second similarity search over 500,000 product manuals for customer service agents."
      }
    ]
  },
  {
    layerNumber: 3,
    layerTitle: "LAYER 3 — AGENTS",
    tagline: "Autonomous Swarms, Workflows & Tool Execution",
    icon: Bot,
    accentColor: "#7C5CFF", // Violet
    capabilities: [
      {
        id: "ai-agents",
        name: "AI Agents",
        whatItIs: "Autonomous cognitive entities governed by goal directives, system prompts, memory registers, and reasoning loops.",
        whyItMatters: "Moves past passive text generation into active task completion with iterative self-direction.",
        whereItIsUsed: "Tier-1/2 customer deflection, automated code testing, and IT incident triage.",
        relevantUseCase: "An agent autonomously investigating an IT ticket, inspecting cloud logs, and proposing a patch."
      },
      {
        id: "agentic-workflows",
        name: "Agentic Workflows",
        whatItIs: "Choreographed execution pipelines (ReAct, Reflexion, Tree of Thoughts) governing how agents plan, act, and verify intermediate steps.",
        whyItMatters: "Replaces brittle linear scripts with adaptable, self-correcting business logic.",
        whereItIsUsed: "Complex multi-step approvals, invoice reconciliation, and automated regulatory reporting.",
        relevantUseCase: "Automatically parsing a shipment variance, notifying the vendor, and holding the invoice for CFO sign-off."
      },
      {
        id: "multi-agent-systems",
        name: "Multi-Agent Systems",
        whatItIs: "Cooperating swarms of specialized agents (e.g. Planner Agent, Worker Agent, Auditor Agent) coordinating via state machines.",
        whyItMatters: "Specialized agents outperform monolithic prompts by checking each other's work and eliminating blindspots.",
        whereItIsUsed: "Enterprise software development, financial auditing, and pharmaceutical clinical trials.",
        relevantUseCase: "A planner agent delegating document parsing to Worker A and policy verification to Auditor B."
      },
      {
        id: "tool-use",
        name: "Tool Use (Function Calling)",
        whatItIs: "The capability of an LLM to recognize when it needs external computation and emit structured OpenAPI / SQL tool calls.",
        whyItMatters: "Connects abstract language models to real-world corporate databases, payment rails, and transactional APIs.",
        whereItIsUsed: "ERP database updates, Salesforce record commits, calendar scheduling, and calculator execution.",
        relevantUseCase: "An agent issuing a real SQL UPDATE query to an ERP inventory table with OAuth2 token scoping."
      }
    ]
  },
  {
    layerNumber: 4,
    layerTitle: "LAYER 4 — APPLICATIONS",
    tagline: "Copilots, Decision Cockpits & Software",
    icon: Layout,
    accentColor: "#1677FF", // Electric Blue
    capabilities: [
      {
        id: "ai-applications",
        name: "AI Applications",
        whatItIs: "Production-grade enterprise software featuring streaming token responses, deterministic middleware, and audit logs.",
        whyItMatters: "Turns raw AI capability into reliable, intuitive daily tools used by hundreds of employees.",
        whereItIsUsed: "Customer web portals, vendor self-service hubs, and claims management suites.",
        relevantUseCase: "A dedicated insurance claims portal reviewing submitted photos and policy bounds in 30 seconds."
      },
      {
        id: "copilots",
        name: "Enterprise Copilots",
        whatItIs: "Context-aware AI assistants embedded directly into employee IDEs, CRMs, or browser workflows.",
        whyItMatters: "Substantially accelerates daily worker throughput without requiring disruptive context switching (Illustrative scenario).",
        whereItIsUsed: "Developer code synthesis, legal contract drafting, medical record transcription, and sales outreach.",
        relevantUseCase: "A sales copilot drafting personalized enterprise proposals with real-time pricing and margin checks."
      },
      {
        id: "intelligent-interfaces",
        name: "Intelligent Interfaces",
        whatItIs: "Dynamic UI components (generative cards, streaming tables, voice cockpits) that adapt based on the user's intent.",
        whyItMatters: "Replaces clunky static menus with fast, conversational, intent-driven interactions.",
        whereItIsUsed: "Executive search bars, customer support widgets, and complex data visualization tools.",
        relevantUseCase: "An interface dynamically rendering an interactive revenue scenario chart when asked 'What if churn drops 2%?'"
      },
      {
        id: "decision-systems",
        name: "Decision Systems",
        whatItIs: "Cognitive decision support engines synthesizing real-time operational telemetry, news, and risk thresholds.",
        whyItMatters: "Provides executive decision-makers with probabilistic forecasting rather than lagging historical reports.",
        whereItIsUsed: "Boardroom risk briefings, credit line approvals, and automated algorithmic trading.",
        relevantUseCase: "Rapidly evaluating commercial loan applications against complex compliance variables (Illustrative scenario)."
      }
    ]
  },
  {
    layerNumber: 5,
    layerTitle: "LAYER 5 — ENTERPRISE",
    tagline: "Data, APIs, Cloud VPC, Security & Governance",
    icon: ShieldCheck,
    accentColor: "#1677FF", // Electric Blue
    capabilities: [
      {
        id: "data",
        name: "Enterprise Data",
        whatItIs: "Secure ETL and vector ingestion pipelines connecting relational databases, object stores, and streaming Kafka topics.",
        whyItMatters: "AI models are only as good as the cleanliness and freshness of the corporate data feeding them.",
        whereItIsUsed: "Warehouse pipelines, real-time event buses, and unstructured document ingestion buckets.",
        relevantUseCase: "Real-time streaming ingestion of 50,000 daily transaction events into pgvector."
      },
      {
        id: "apis",
        name: "Secure APIs",
        whatItIs: "Zero-trust REST and gRPC API gateways with token scoping, rate limiting, and strict payload validation.",
        whyItMatters: "Prevents unauthorized data exfiltration and protects legacy backends from AI-induced traffic spikes.",
        whereItIsUsed: "Microservice meshes, partner webhooks, and third-party SaaS integrations.",
        relevantUseCase: "Enforcing OAuth2 token expiration and role-based permissions across every agent tool call."
      },
      {
        id: "cloud",
        name: "Cloud & Private VPC",
        whatItIs: "Containerized deployments hosted in isolated Virtual Private Clouds on AWS, Azure, GCP, or bare-metal Kubernetes.",
        whyItMatters: "Ensures complete data sovereignty and zero model training on your proprietary corporate data.",
        whereItIsUsed: "Dedicated enterprise tenant enclaves, private inference endpoints, and on-prem clusters.",
        relevantUseCase: "Running private vLLM clusters with NVIDIA L4 GPUs inside an air-gapped AWS VPC."
      },
      {
        id: "security-gov",
        name: "Security & Governance",
        whatItIs: "Deterministic prompt firewalls (NeMo Guardrails), PII masking filters, and immutable audit logs.",
        whyItMatters: "Enforces SOC-2, HIPAA, and GDPR compliance controls, protecting against prompt injection and data leaks.",
        whereItIsUsed: "Every inbound and outbound model token transmission across the enterprise.",
        relevantUseCase: "Automatically redacting Social Security and credit card numbers before inference happens."
      },
      {
        id: "existing-systems",
        name: "Existing Enterprise Systems",
        whatItIs: "Bidirectional adapters connecting AI intelligence to installed ERP, CRM, HRIS, and legacy mainframe systems.",
        whyItMatters: "Maximizes ROI on millions already invested in SAP, Salesforce, Oracle, and ServiceNow.",
        whereItIsUsed: "Core operational workflows, inventory reconciliations, and payroll processing.",
        relevantUseCase: "Allowing an AI agent to read SAP inventory levels and create purchase orders without legacy refactoring."
      }
    ]
  }
];

export function AiCapabilityStack() {
  const [selectedLayerIndex, setSelectedLayerIndex] = React.useState(2); // Default to LAYER 3: AGENTS
  const [selectedCapability, setSelectedCapability] = React.useState<CapabilityItem>(
    ARCHITECTURE_LAYERS[2].capabilities[0]
  );

  const activeLayer = ARCHITECTURE_LAYERS[selectedLayerIndex];
  const LayerIcon = activeLayer.icon;

  const handleSelectLayer = (idx: number) => {
    setSelectedLayerIndex(idx);
    setSelectedCapability(ARCHITECTURE_LAYERS[idx].capabilities[0]);
  };

  return (
    <section className="relative py-24 bg-muted/15 border-t border-border/60">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
            Enterprise Architecture Map
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
            The AI <span className="text-primary">Capability Architecture</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Enterprise AI requires a modular, defense-in-depth architecture. Explore the 5 interactive layers powering our enterprise deployments. Click any capability to inspect its technical details.
          </p>
        </div>

        {/* Layer Selector Pill Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {ARCHITECTURE_LAYERS.map((layer, idx) => {
            const isSelected = selectedLayerIndex === idx;
            const Icon = layer.icon;
            return (
              <button
                key={layer.layerNumber}
                onClick={() => handleSelectLayer(idx)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? "bg-card border-primary text-foreground shadow-lg shadow-primary/10"
                    : "bg-background/60 hover:bg-muted border-border/70 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
                  style={{ backgroundColor: `${layer.accentColor}20`, color: layer.accentColor }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{layer.layerTitle.split(" — ")[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Architecture Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left: Capability Cards in Active Layer */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between px-1 pb-1">
              <div>
                <span className="text-[11px] font-mono uppercase text-primary font-bold block">
                  {activeLayer.layerTitle}
                </span>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {activeLayer.tagline}
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {activeLayer.capabilities.length} Capabilities
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {activeLayer.capabilities.map((cap) => {
                const isSelected = selectedCapability.id === cap.id;
                return (
                  <button
                    key={cap.id}
                    onClick={() => setSelectedCapability(cap)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 group relative ${
                      isSelected
                        ? "bg-card border-primary shadow-lg shadow-primary/15 scale-102"
                        : "bg-card/60 hover:bg-card border-border/70 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {cap.name}
                      </span>
                      {isSelected ? (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {cap.whatItIs}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Capability Inspector Card */}
          <div className="lg:col-span-6 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: activeLayer.accentColor }}
            />

            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-primary block">
                    Capability Deep-Dive
                  </span>
                  <h4 className="text-xl font-bold font-heading text-foreground mt-0.5">
                    {selectedCapability.name}
                  </h4>
                </div>
                <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs">
                  Enterprise Ready
                </Badge>
              </div>

              {/* 1. What It Is */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground tracking-wider block">
                  What It Is
                </span>
                <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                  {selectedCapability.whatItIs}
                </p>
              </div>

              {/* 2. Why It Matters */}
              <div className="space-y-1 p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-[10px] font-mono uppercase font-bold text-primary tracking-wider block">
                  Why It Matters to Leadership
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {selectedCapability.whyItMatters}
                </p>
              </div>

              {/* 3. Where It Is Used */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground tracking-wider block">
                  Where It Is Used in Architecture
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedCapability.whereItIsUsed}
                </p>
              </div>

              {/* 4. Relevant Enterprise Use Case */}
              <div className="space-y-1 p-3.5 rounded-xl bg-muted/40 border border-border/70">
                <span className="text-[10px] font-mono uppercase font-bold text-foreground tracking-wider block">
                  Production Use Case Example
                </span>
                <p className="text-xs text-foreground/90 leading-relaxed italic">
                  "{selectedCapability.relevantUseCase}"
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-primary text-white hover:bg-primary/90 text-xs px-5 shadow-md shadow-primary/20"
                >
                  <Link href="/services/generative-ai" className="flex items-center gap-1.5">
                    Explore Implementation Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
