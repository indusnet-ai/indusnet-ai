"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileCheck2, 
  Cpu, 
  Scale, 
  CheckCircle2, 
  Server, 
  AlertTriangle, 
  Layers, 
  GitBranch, 
  ArrowRight,
  Database,
  Search,
  KeyRound
} from "lucide-react";
import { trackEvent, ConversionEvents } from "@/lib/analytics";

const governancePillars = [
  {
    icon: Lock,
    number: "01",
    title: "Data Sovereignty & Zero Egress Isolation",
    headline: "Your data stays in your cloud. Always.",
    description:
      "All production architectures deploy directly inside customer-controlled VPCs (AWS Bedrock, Azure OpenAI Private Endpoints, or GCP Vertex AI). Private subnets, private DNS routing, and customer-managed KMS encryption keys ensure zero unauthorized cloud egress.",
    checklist: [
      "Customer-owned VPC/VNet isolation",
      "Customer-managed KMS encryption at rest & in transit",
      "No outbound telemetry to third-party consumer endpoints",
      "Option for fully air-gapped on-premise deployments",
    ],
  },
  {
    icon: Database,
    number: "02",
    title: "Zero Data Retention (ZDR) & Zero Model Training",
    headline: "Client data is never used to train foundation models.",
    description:
      "We enforce enterprise Zero Data Retention agreements with foundation model providers. Prompts, embeddings, and responses are discarded immediately after inference. When full physical air-gapping is required, we deploy open-weights models (Llama 3, Mistral) on dedicated hardware.",
    checklist: [
      "Contractual Zero Data Retention (ZDR) configuration",
      "Zero training or fine-tuning on customer telemetry",
      "Ephemerality by design: stateless inference nodes",
      "Self-hosted weights available for regulated operations",
    ],
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Deterministic Guardrails & Semantic Sanitization",
    headline: "Pre-inference filtering stops malicious and sensitive payloads.",
    description:
      "A dual-layer guardrail pipeline inspects incoming queries before they ever reach an LLM. Automated PII redaction strips sensitive tokens, while deterministic semantic firewalls detect and neutralize prompt injection, jailbreaking, and data extraction attempts.",
    checklist: [
      "Automated PII/PCI/PHI detection and masking",
      "Deterministic prompt injection & jailbreak interception",
      "Policy-based content moderation and topic boundary enforcement",
      "Real-time semantic policy scoring with sub-millisecond overhead",
    ],
  },
  {
    icon: Search,
    number: "04",
    title: "Retrieval Grounding & Hallucination Mitigation",
    headline: "Every answer backed by verifiable enterprise citations.",
    description:
      "We engineer RAG pipelines with strict semantic distance thresholds. Every assertion in generated output is attributed back to specific document coordinates, page numbers, or database record IDs. If confidence scores fall below acceptable thresholds, the system defaults safely.",
    checklist: [
      "Chunk-level source attribution and citation indices",
      "Dual vector + lexical (BM25) hybrid reranking verification",
      "Configurable confidence thresholds with graceful fallback",
      "Self-consistency and hallucination detection checks",
    ],
  },
  {
    icon: Eye,
    number: "05",
    title: "Auditability, Telemetry & Decision Tracing",
    headline: "Complete visibility into every token, decision, and API call.",
    description:
      "Every inference transaction is indexed with OpenTelemetry instrumentation. Engineering teams and compliance auditors receive immutable audit logs recording prompt versions, vector context, model hyperparameters, token consumption, and agent reasoning chains.",
    checklist: [
      "OpenTelemetry-compatible trace generation (Langfuse / Phoenix)",
      "Immutable execution logs for compliance audits",
      "Latency, token economics, and error rate telemetry",
      "Agent execution graph inspection and step playback",
    ],
  },
  {
    icon: Scale,
    number: "06",
    title: "Human-in-the-Loop (HITL) Escalation Gates",
    headline: "High-stakes operations always require human authorization.",
    description:
      "Our agentic workflows classify actions by impact. Read-only and low-risk operations execute autonomously, while state-changing or high-consequence operations (financial transactions, contractual approval, PII modifications) trigger asynchronous human approval gates.",
    checklist: [
      "Reversible vs. irreversible action classification",
      "Asynchronous webhook approvals for enterprise managers",
      "Deterministic fail-safes when external tools time out",
      "Seamless warm-handoff from autonomous agent to human specialist",
    ],
  },
];

const complianceFrameworks = [
  {
    name: "SOC 2 Type II Alignment",
    category: "Security & Confidentiality",
    desc: "Architectural blueprints align strictly with SOC 2 Trust Services Criteria for security, availability, and processing integrity.",
  },
  {
    name: "ISO/IEC 42001 & 27001 Alignment",
    category: "AI Management & Information Security",
    desc: "AI engineering processes are designed around international standards for Artificial Intelligence Management Systems and information risk controls.",
  },
  {
    name: "HIPAA & BAA Readiness",
    category: "Healthcare Data Protection",
    desc: "Healthcare workloads are designed for deployment within BAA-covered cloud enclaves with PHI token redaction and audit logging.",
  },
  {
    name: "GDPR & DPDP Act Alignment",
    category: "Data Privacy & Sovereignty",
    desc: "Architecture supports strict regional data residency routing, deterministic right-to-erasure procedures, and zero cross-border vector replication.",
  },
  {
    name: "CPMAI Methodology",
    category: "Cognitive Project Governance",
    desc: "Certified CPMAI facilitation methodology brings structured scoping, data hygiene, and lifecycle management to AI engineering.",
  },
  {
    name: "Vendor Neutrality",
    category: "Zero Infrastructure Lock-In",
    desc: "Customer retains complete ownership of vector schemas, fine-tuning scripts, application code, and orchestration logic.",
  },
];

const architectureSteps = [
  {
    step: "01",
    title: "Ingress & Sanitization",
    desc: "User query arrives via private API gateway. PII filter redacts sensitive identifiers. NeMo Guardrails block injection attacks.",
  },
  {
    step: "02",
    title: "Grounding & Vector Retrieval",
    desc: "Hybrid search queries the isolated enterprise vector database. Reranker filters out low-relevance chunks to prevent context pollution.",
  },
  {
    step: "03",
    title: "Zero-Retention Inference",
    desc: "Prompt + verified context dispatch to stateless model enclave (Azure/Bedrock/vLLM) under contractual Zero Data Retention terms.",
  },
  {
    step: "04",
    title: "Egress Verification & HITL",
    desc: "Synthesized output undergoes citation verification and safety scoring. High-impact operations halt for human sign-off before execution.",
  },
];

export default function GovernanceClient() {
  return (
    <div className="flex flex-col gap-24 md:gap-32 pt-32 pb-24">
      {/* 1. HERO HEADER */}
      <section className="container mx-auto px-4 md:px-6 relative overflow-hidden text-center max-w-4xl flex flex-col gap-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[420px] h-[420px] rounded-full bg-primary/10 blur-[140px]" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-4 py-1.5 text-xs font-medium tracking-wide">
            Enterprise AI Trust & Governance
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]"
        >
          Responsible AI Architecture,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Security & Enterprise Governance
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
        >
          Enterprise AI cannot be deployed on blind trust. Indusnet AI designs, architects, and enforces
          rigorous data sovereignty, hallucination mitigation, and auditability protocols across every production deployment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Button asChild size="lg" className="rounded-full shadow-lg">
            <Link
              href="/contact"
              onClick={() =>
                trackEvent(ConversionEvents.CTA_DISCUSS_ARCHITECTURE, {
                  location: "governance_hero",
                  target: "/contact",
                })
              }
            >
              Request Governance Architecture Review
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link
              href="/assessment"
              onClick={() =>
                trackEvent(ConversionEvents.CTA_DISCOVER_AI_OPPORTUNITY, {
                  location: "governance_hero",
                  target: "/assessment",
                })
              }
            >
              Evaluate Readiness in AI Scoper
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* 2. THE 6 GOVERNANCE PILLARS */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-muted-foreground">
            Core Principles
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            The Six Pillars of Indusnet AI Enterprise Governance
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Every solution we deliver is engineered around these six immutable technical and contractual guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {governancePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={idx}
                className="bg-card/40 border-border/60 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground font-semibold px-2 py-1 rounded bg-secondary/50">
                      PILLAR {pillar.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-semibold text-primary/90 mb-3">
                      {pillar.headline}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/40 space-y-2">
                    {pillar.checklist.map((item, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. FOUR-STAGE SECURITY PERIMETER */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card/60 to-card/20 p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-muted-foreground">
              Architecture Pipeline
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              The 4-Stage AI Defense-in-Depth Pipeline
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              How user interactions traverse the Indusnet AI secure boundary from prompt entry to validated completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {architectureSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-border/40 bg-background/50 p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="text-2xl font-mono font-bold text-primary/70">
                    {step.step}
                  </div>
                  <h4 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPLIANCE & FRAMEWORKS ALIGNMENT */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-muted-foreground">
            Compliance & Standards
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Enterprise Compliance & Standards Alignment
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Engineered to pass scrutiny by Chief Information Security Officers, Data Protection Officers, and enterprise legal teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complianceFrameworks.map((fw, idx) => (
            <Card key={idx} className="bg-card/40 border-border/60">
              <CardContent className="p-6 space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary">
                  {fw.category}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {fw.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {fw.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. VENDOR NEUTRALITY & CODE OWNERSHIP */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <Badge className="bg-primary/10 border-primary/20 text-primary text-xs">
              Architectural Sovereignty
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Zero Lock-In. Full Customer Ownership.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              When Indusnet AI builds an enterprise solution, the intellectual property, vector schemas, custom orchestration code, and deployment scripts belong 100% to you. We design vendor-agnostic abstraction layers so you can swap foundation model providers whenever performance, pricing, or compliance mandates change.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">
                Talk to an Enterprise Architect
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/services">
                Explore Core Capabilities
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
