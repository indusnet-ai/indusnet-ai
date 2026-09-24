"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Database, Network, Server, Cpu, Brain, Bot, 
  Workflow, LayoutDashboard, CheckCircle2, Sparkles, 
  ShieldCheck, ArrowDown, ChevronRight, Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArchNode {
  id: string;
  name: string;
  category: "Enterprise" | "Intelligence" | "Execution" | "Applications" | "Outcomes";
  description: string;
  techs: string[];
  metric: string;
  icon: any;
  color: string;
}

const NODES_DATA: Record<string, ArchNode> = {
  data: {
    id: "data",
    name: "Enterprise Data",
    category: "Enterprise",
    description: "Multi-tenant structured & unstructured data ingestion with zero-data retention agreements.",
    techs: ["PostgreSQL", "Snowflake", "SharePoint", "AWS S3"],
    metric: "450k+ Docs Parsed",
    icon: Database,
    color: "#1677FF" // Blue
  },
  knowledge: {
    id: "knowledge",
    name: "Enterprise Knowledge",
    category: "Enterprise",
    description: "Hybrid vector stores & knowledge graphs mapping organizational entities and relationships.",
    techs: ["pgvector", "Neo4j Graph", "Milvus", "Semantic Cache"],
    metric: "99.4% Attribution",
    icon: Network,
    color: "#00D4FF" // Cyan
  },
  systems: {
    id: "systems",
    name: "Enterprise Systems",
    category: "Enterprise",
    description: "Secure zero-trust API connectors bridging live transactional business systems.",
    techs: ["SAP ERP", "Salesforce CRM", "Workday", "Jira"],
    metric: "18 API Connectors",
    icon: Server,
    color: "#1677FF" // Blue
  },
  intelligence: {
    id: "intelligence",
    name: "AI Intelligence Layer",
    category: "Intelligence",
    description: "Deterministic guardrails, semantic middleware firewalls, and dynamic cost/latency routing.",
    techs: ["NeMo Guardrails", "Semantic Routing", "Token Limiting", "RBAC Scoping"],
    metric: "38ms Latency SLA",
    icon: Cpu,
    color: "#1677FF" // Electric Blue
  },
  models: {
    id: "models",
    name: "Foundation Models",
    category: "Execution",
    description: "Dynamic routing between frontier LLMs and private open-weights SLMs running inside private VPCs.",
    techs: ["Claude 3.5 Sonnet", "GPT-4o", "Llama-3 70B", "Mistral"],
    metric: "< 190ms TTFT",
    icon: Brain,
    color: "#00D4FF" // Cyan
  },
  agents: {
    id: "agents",
    name: "Autonomous Agents",
    category: "Execution",
    description: "Goal-oriented multi-agent swarms using ReAct/Reflexion loops with sandboxed tool execution.",
    techs: ["Planner Swarms", "Tool Callers", "Policy Critics", "Self-Correction"],
    metric: "88% Cycle Drop",
    icon: Bot,
    color: "#7C5CFF" // Violet
  },
  workflows: {
    id: "workflows",
    name: "Intelligent Workflows",
    category: "Execution",
    description: "Event-driven asynchronous document pipelines with human-in-the-loop approval thresholds.",
    techs: ["vLLM Orchestration", "Async Queues", "Temporal", "Docker VPC"],
    metric: "High Availability",
    icon: Workflow,
    color: "#1677FF" // Blue
  },
  applications: {
    id: "applications",
    name: "Enterprise Applications",
    category: "Applications",
    description: "Next.js 16 streaming copilots, executive decision cockpits, and automated backend daemons.",
    techs: ["Custom Copilots", "Decision Cockpits", "REST/gRPC APIs", "Microservices"],
    metric: "Sub-Second UX",
    icon: LayoutDashboard,
    color: "#1677FF" // Electric Blue
  },
  outcomes: {
    id: "outcomes",
    name: "Measurable Business Outcomes",
    category: "Outcomes",
    description: "Quantified enterprise value: manual toil elimination, latency optimization, and modelled ROI.",
    techs: ["Sub-Second Triage", "Grounded Citations", "Cost Optimization", "Audit Compliance"],
    metric: "Efficiency Lift",
    icon: CheckCircle2,
    color: "#10B981" // Green
  }
};

export function HeroAiSystem() {
  const [activeNodeKey, setActiveNodeKey] = React.useState<string>("intelligence");
  const activeNode = NODES_DATA[activeNodeKey] || NODES_DATA.intelligence;
  const ActiveIcon = activeNode.icon;

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Background Neural Glows */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[360px] h-[360px] rounded-full bg-primary/10 blur-[100px] animate-pulse" />
        <div className="w-[280px] h-[280px] rounded-full bg-violet-600/10 blur-[90px]" />
      </div>

      {/* Main Operating Architecture Container Card */}
      <div className="w-full bg-card/75 border border-border/80 rounded-3xl p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl relative overflow-hidden space-y-4">
        {/* Telemetry Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono tracking-wider uppercase text-foreground font-bold">
              Enterprise Operating Architecture
            </span>
          </div>

          <Badge variant="outline" className="text-[10px] font-mono py-0 text-primary border-primary/30">
            Interactive System Map
          </Badge>
        </div>

        {/* ========================================================================= */}
        {/* TIER 1: ENTERPRISE (DATA · KNOWLEDGE · SYSTEMS)                          */}
        {/* ========================================================================= */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-muted-foreground">
              01 · Enterprise Inputs
            </span>
            <span className="text-[9px] font-mono text-cyan-500">Ingestion Tier</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "data", label: "Data", icon: Database, color: "#1677FF" },
              { id: "knowledge", label: "Knowledge", icon: Network, color: "#00D4FF" },
              { id: "systems", label: "Systems", icon: Server, color: "#1677FF" }
            ].map((node) => {
              const Icon = node.icon;
              const isSelected = activeNodeKey === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeKey(node.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 group ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-muted/30 hover:bg-muted/60 border-border/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: node.color }} />
                  <span className="text-[10px] font-bold tracking-tight block">
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Connecting Data Pulse Flow Arrow */}
        <div className="flex justify-center -my-1 text-cyan-400">
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-3.5 h-3.5 opacity-80" />
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* TIER 2: AI INTELLIGENCE LAYER (CENTRAL CORE)                             */}
        {/* ========================================================================= */}
        <button
          onClick={() => setActiveNodeKey("intelligence")}
          className={`w-full p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between ${
            activeNodeKey === "intelligence"
              ? "bg-gradient-to-r from-primary/20 via-cyan-500/15 to-violet-500/15 border-primary shadow-md shadow-primary/20"
              : "bg-muted/40 hover:bg-muted/70 border-border/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30 shrink-0 border border-cyan-400/30">
              <Cpu className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase font-bold text-cyan-400 tracking-wider block">
                02 · Central Neural Core
              </span>
              <span className="text-xs font-bold text-foreground block">
                AI Intelligence Layer
              </span>
              <span className="text-[10px] text-muted-foreground">
                Deterministic Guardrails · Semantic Router
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono text-emerald-400 font-bold block">38ms SLA</span>
            <span className="text-[9px] text-cyan-400/80 font-mono">Active Mesh</span>
          </div>
        </button>

        {/* Connecting Data Pulse Flow Arrow */}
        <div className="flex justify-center -my-1 text-cyan-400">
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          >
            <ArrowDown className="w-3.5 h-3.5 opacity-80" />
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* TIER 3: MODELS · AGENTS · WORKFLOWS                                      */}
        {/* ========================================================================= */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-muted-foreground">
              03 · Cognitive Engines
            </span>
            <span className="text-[9px] font-mono text-cyan-400">Execution Tier</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "models", label: "Models", icon: Brain, color: "#00D4FF" },
              { id: "agents", label: "Agents", icon: Bot, color: "#7C5CFF" },
              { id: "workflows", label: "Workflows", icon: Workflow, color: "#1677FF" }
            ].map((node) => {
              const Icon = node.icon;
              const isSelected = activeNodeKey === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeKey(node.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 group ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-muted/30 hover:bg-muted/60 border-border/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: node.color }} />
                  <span className="text-[10px] font-bold tracking-tight block">
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Connecting Data Pulse Flow Arrow */}
        <div className="flex justify-center -my-1 text-cyan-400">
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            <ArrowDown className="w-3.5 h-3.5 opacity-80" />
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* TIER 4 & 5: APPLICATIONS & BUSINESS OUTCOMES                              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveNodeKey("applications")}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              activeNodeKey === "applications"
                ? "bg-primary/10 border-primary shadow-sm"
                : "bg-muted/30 hover:bg-muted/60 border-border/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-mono uppercase text-primary font-bold block">04 · Delivery</span>
              <span className="text-xs font-bold text-foreground block truncate">Applications</span>
            </div>
          </button>

          <button
            onClick={() => setActiveNodeKey("outcomes")}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
              activeNodeKey === "outcomes"
                ? "bg-emerald-500/10 border-emerald-500 shadow-sm"
                : "bg-muted/30 hover:bg-muted/60 border-border/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-mono uppercase text-emerald-500 font-bold block">05 · Impact</span>
              <span className="text-xs font-bold text-foreground block truncate">Outcomes</span>
            </div>
          </button>
        </div>

        {/* Active Node Specification Inspector Drawer */}
        <div className="pt-3 border-t border-border/60 bg-muted/20 -mx-5 -mb-6 p-4 rounded-b-3xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
                style={{ backgroundColor: `${activeNode.color}20`, color: activeNode.color }}
              >
                <ActiveIcon className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-foreground">
                {activeNode.name}
              </span>
            </div>
            <span className="text-[10px] font-mono text-primary font-bold">
              {activeNode.metric}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {activeNode.description}
          </p>

          <div className="flex flex-wrap gap-1 pt-1">
            {activeNode.techs.map((tech, idx) => (
              <span
                key={idx}
                className="text-[9px] font-mono font-medium bg-background border border-border px-2 py-0.5 rounded text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
