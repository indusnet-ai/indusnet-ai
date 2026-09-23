"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Database, Brain, Network, Bot, LayoutDashboard, 
  Sparkles, CheckCircle2, ArrowRight, Zap, Shield, Cpu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SystemNode {
  id: string;
  name: string;
  category: string;
  icon: any;
  status: string;
  metric: string;
  techs: string[];
  color: string;
}

const NODES: SystemNode[] = [
  {
    id: "data",
    name: "Enterprise Data",
    category: "Ingestion Layer",
    icon: Database,
    status: "Zero-Data Retention",
    metric: "450k+ Docs Parsed",
    techs: ["SharePoint", "PostgreSQL", "Snowflake", "SAP ERP"],
    color: "#06B6D4" // Cyan
  },
  {
    id: "models",
    name: "Foundation Models",
    category: "Inference Mesh",
    icon: Brain,
    status: "VPC Model Routing",
    metric: "< 190ms TTFT",
    techs: ["Claude 3.5 Sonnet", "GPT-4o", "Llama-3 70B", "Mistral"],
    color: "#8B5CF6" // Violet
  },
  {
    id: "knowledge",
    name: "Knowledge & RAG",
    category: "Retrieval Layer",
    icon: Network,
    status: "Hybrid Sparse+Dense",
    metric: "99.4% Attribution",
    techs: ["pgvector", "Neo4j Graph", "Cohere Rerank", "Semantic Cache"],
    color: "#3B82F6" // Blue
  },
  {
    id: "agents",
    name: "Autonomous Agents",
    category: "Agentic Swarms",
    icon: Bot,
    status: "ReAct & Reflexion",
    metric: "18 Tools Integrated",
    techs: ["Planner Agent", "OpenAPI Caller", "Policy Auditor", "Self-Corrector"],
    color: "#10B981" // Emerald
  },
  {
    id: "apps",
    name: "Production Software",
    category: "Enterprise Delivery",
    icon: LayoutDashboard,
    status: "SOC2 & HIPAA Ready",
    metric: "99.99% Availability",
    techs: ["Custom Copilots", "REST/gRPC APIs", "Executive Cockpits", "Automated Ops"],
    color: "#FF2D21" // Primary Red
  }
];

export function HeroAiSystem() {
  const [selectedNode, setSelectedNode] = React.useState<SystemNode>(NODES[3]); // default to Agents
  const [telemetryCount, setTelemetryCount] = React.useState(12480);

  // Subtle telemetry pulse
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryCount((prev) => prev + Math.floor(Math.random() * 7) + 1);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Background Neural Glows */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="w-[320px] h-[320px] rounded-full bg-primary/10 blur-[90px] animate-pulse" />
        <div className="w-[280px] h-[280px] rounded-full bg-violet-600/10 blur-[80px]" />
      </div>

      {/* Interactive System Canvas Card */}
      <div className="relative w-full bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl overflow-hidden">
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono tracking-wider uppercase text-muted-foreground font-semibold">
              Indusnet Neural Orchestrator
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <Badge variant="outline" className="text-[10px] py-0 border-emerald-500/30 text-emerald-500 bg-emerald-500/5">
              Online
            </Badge>
            <span className="hidden sm:inline">Active Operations: {telemetryCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Central Orchestrator & Node Grid */}
        <div className="py-6 space-y-4">
          {/* Central AI Engine Hub */}
          <div className="relative p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-violet-500/10 to-cyan-500/10 border border-primary/30 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                <Cpu className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">AI Intelligence & Middleware</p>
                <p className="text-[11px] text-muted-foreground">Deterministic Guardrails · Semantic Routing</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Latency</span>
              <p className="text-xs font-mono font-bold text-foreground">38ms avg</p>
            </div>
          </div>

          {/* Interactive Connected Nodes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Connected Enterprise Infrastructure (Click to Inspect)
              </span>
              <span className="text-[10px] text-primary font-medium">
                {selectedNode.name} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NODES.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const Icon = node.icon;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`group text-left p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-md shadow-primary/10"
                        : "bg-background/40 hover:bg-muted/50 border-border/70 hover:border-border"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${node.color}15`,
                        color: node.color,
                        border: `1px solid ${node.color}35`
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground truncate">
                          {node.name}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate block">
                        {node.metric}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Node Architecture Inspector Drawer */}
        <div className="pt-4 border-t border-border/60 bg-muted/20 -mx-6 -mb-7 p-5 rounded-b-3xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {selectedNode.category}
              </span>
              <Badge variant="outline" className="text-[9px] py-0 border-primary/20 text-foreground">
                {selectedNode.status}
              </Badge>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {selectedNode.metric}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {selectedNode.techs.map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-background border border-border px-2.5 py-1 rounded-md text-foreground flex items-center gap-1 shadow-2xs"
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
