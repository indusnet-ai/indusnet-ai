"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Network, Bot, Layout, ShieldCheck, 
  Sparkles, CheckCircle2, ArrowRight, Layers, Lock, Database 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StackLayer {
  id: string;
  name: string;
  level: string;
  badge: string;
  tagline: string;
  description: string;
  icon: any;
  accentColor: string;
  components: {
    name: string;
    description: string;
  }[];
  securityAndGov: string;
}

const STACK_LAYERS: StackLayer[] = [
  {
    id: "applications",
    name: "Application & Experience Layer",
    level: "Layer 05",
    badge: "User Facing",
    tagline: "Custom Copilots, Decision Cockpits & Intelligent Software",
    description: "Production-ready enterprise interfaces designed for sub-second latency, streaming responses, and intuitive human-in-the-loop oversight.",
    icon: Layout,
    accentColor: "#FF2D21",
    components: [
      { name: "Enterprise Copilots", description: "Bespoke task assistants embedded within internal CRM, ERP, and customer portals." },
      { name: "Executive Decision Cockpits", description: "Multi-modal dashboards synthesizing cross-departmental telemetry into actionable risk briefs." },
      { name: "Intelligent Workflows", description: "Automated document ingestion, claims routing, and zero-touch compliance checks." },
      { name: "Developer AI Tools", description: "Internal code generation, automated test synthesis, and legacy modernization pipelines." }
    ],
    securityAndGov: "SOC-2 Type II aligned, WCAG 2.1 AA accessible, end-to-end audit logging."
  },
  {
    id: "agents",
    name: "Agentic & Autonomous Layer",
    level: "Layer 04",
    badge: "Autonomous Execution",
    tagline: "Self-Correcting Multi-Agent Swarms & Tool Integration",
    description: "Moving beyond passive chats into active, goal-oriented systems that plan tasks, invoke external enterprise tools, and verify outputs.",
    icon: Bot,
    accentColor: "#10B981",
    components: [
      { name: "Planner & Orchestrator Agents", description: "Deconstruct complex business mandates into validated multi-step execution plans." },
      { name: "OpenAPI Tool Callers", description: "Secure, sandboxed integrations invoking Salesforce, SAP, Jira, and internal microservices." },
      { name: "Self-Correction & Evaluation", description: "Secondary critic agents evaluating intermediate responses against contractual constraints." },
      { name: "Human-in-the-Loop Escalation", description: "Automated policy thresholds that trigger executive approval before monetary or critical commits." }
    ],
    securityAndGov: "OAuth2 scoping per agent, token execution budgeting, cryptographic action ledger."
  },
  {
    id: "knowledge",
    name: "Knowledge & Retrieval Layer",
    level: "Layer 03",
    badge: "Grounded Truth",
    tagline: "Hybrid Enterprise RAG, Vector Stores & Knowledge Graphs",
    description: "Eliminating model hallucinations by grounding every response in verifiable, permission-controlled enterprise data archives.",
    icon: Network,
    accentColor: "#3B82F6",
    components: [
      { name: "Hybrid Sparse + Dense Search", description: "Combines BM25 lexical precision with modern dense vector semantic comprehension." },
      { name: "Enterprise Vector Stores", description: "Scalable pgvector, Milvus, and Pinecone clusters tuned for sub-50ms retrieval." },
      { name: "Knowledge Graphs", description: "Neo4j graph RAG mapping intricate multi-entity organizational relationships and taxonomies." },
      { name: "Semantic Middleware Caching", description: "Redis semantic caches intercepting repeated questions for 80% cost and latency reduction." }
    ],
    securityAndGov: "Document-level ACL filtering, zero data leakage between user tenant roles."
  },
  {
    id: "intelligence",
    name: "Intelligence & Foundation Models",
    level: "Layer 02",
    badge: "Core Cognition",
    tagline: "Frontier LLMs, Fine-Tuned SLMs & Multimodal Reasoning",
    description: "Model-agnostic architecture routing requests dynamically between top frontier APIs and private, open-weights models running inside your VPC.",
    icon: Cpu,
    accentColor: "#8B5CF6",
    components: [
      { name: "Frontier Model Routing", description: "Dynamic cost-aware gateway switching between Claude 3.5 Sonnet, GPT-4o, and Gemini 1.5." },
      { name: "Private Open-Weights SLMs", description: "Llama-3, Mistral, and Qwen hosted in private VPCs for absolute data sovereignty." },
      { name: "Domain-Specific Fine-Tuning", description: "LoRA / QLoRA parameter-efficient adaptation on proprietary corporate dialect and protocols." },
      { name: "Vision & Audio Processing", description: "Document OCR, diagram understanding, and audio transcription multi-modal models." }
    ],
    securityAndGov: "Zero-Data-Retention (ZDR) agreements, confidential compute enclaves."
  },
  {
    id: "foundation",
    name: "Enterprise Security & Infrastructure",
    level: "Layer 01",
    badge: "Hardened Core",
    tagline: "VPC Isolation, Guardrails, SSO & Governance",
    description: "The resilient enterprise bedrock ensuring high-availability inference, regulatory compliance, and total isolation from public model training.",
    icon: ShieldCheck,
    accentColor: "#06B6D4",
    components: [
      { name: "Private VPC & Cloud Isolation", description: "Isolated subnets on AWS Bedrock, Azure OpenAI, GCP Vertex, or on-prem Kubernetes." },
      { name: "Deterministic Safety Guardrails", description: "NeMo Guardrails preventing prompt injections, jailbreaks, and PII leakage." },
      { name: "Enterprise SSO & RBAC", description: "SAML 2.0 / Okta integration enforcing corporate identity policies across all AI access." },
      { name: "End-to-End Tracing & Telemetry", description: "Langfuse / OpenTelemetry tracking latency, cost per token, and hallucination scores." }
    ],
    securityAndGov: "HIPAA, GDPR, SOC-2, and ISO 27001 deployment compliance."
  }
];

export function AiCapabilityStack() {
  const [selectedLayerId, setSelectedLayerId] = React.useState("agents");
  const activeLayer = STACK_LAYERS.find((l) => l.id === selectedLayerId) || STACK_LAYERS[0];
  const Icon = activeLayer.icon;

  return (
    <section className="relative py-24 bg-muted/20 border-y border-border/60">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
            Full-Stack Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
            The Enterprise <span className="text-primary">AI Capability Stack</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Enterprise AI cannot rely on a single API call. We build modular, multi-tier architectures designed for enterprise security, deterministic reliability, and rapid scaling.
          </p>
        </div>

        {/* Stack Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Layer Selector Stack */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block px-2 mb-3">
              Explore Architectural Layers (Top to Bottom)
            </span>

            {STACK_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              const LayerIcon = layer.icon;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? "bg-card border-primary shadow-lg shadow-primary/10 translate-x-1"
                      : "bg-card/60 hover:bg-card border-border/70 hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${layer.accentColor}18`,
                        color: layer.accentColor,
                        border: `1px solid ${layer.accentColor}35`
                      }}
                    >
                      <LayerIcon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                          {layer.level}
                        </span>
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {layer.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate max-w-[240px]">
                        {layer.tagline}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-muted text-muted-foreground border-border/60"
                    }`}
                  >
                    {layer.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Layer Inspector Card */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
            {/* Ambient Background Gradient Accent */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: activeLayer.accentColor }}
            />

            <div className="space-y-6">
              {/* Layer Title & Overview */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${activeLayer.accentColor}20`,
                      color: activeLayer.accentColor,
                      border: `1px solid ${activeLayer.accentColor}40`
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-primary">
                      {activeLayer.level} Overview
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                      {activeLayer.name}
                    </h3>
                  </div>
                </div>

                <Badge variant="outline" className="text-xs font-semibold py-1 px-3 border-primary/30 text-primary">
                  {activeLayer.badge}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeLayer.description}
              </p>

              {/* Core Components Grid */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                  Key Technical Capabilities
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeLayer.components.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{comp.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                        {comp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Governance Box */}
              <div className="p-4 rounded-xl bg-background/80 border border-border/80 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Lock className="w-4 h-4 text-primary shrink-0" />
                  <span>Compliance & Governance:</span>
                </div>
                <span className="text-muted-foreground text-[11px] text-right">
                  {activeLayer.securityAndGov}
                </span>
              </div>

              {/* Layer Action Button */}
              <div className="pt-2 flex items-center justify-end">
                <Button asChild size="sm" className="rounded-full bg-primary text-white hover:bg-primary/90 text-xs px-5">
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
