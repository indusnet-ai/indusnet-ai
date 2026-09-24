"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Search,
  Zap,
  Cpu,
  BarChart3,
  Network,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// What We Build — 6 executive-level capability categories
// Systematically answering: 1) What is it? 2) Problem solved 3) What we build 4) Who needs it
const CAPABILITIES = [
  {
    id: "applications",
    title: "AI Applications",
    whatItIs: "Production software and intuitive interfaces powered by enterprise AI models.",
    problemSolved: "Workforces and customers lose hours to fragmented data silos, static portals, and repetitive manual queries.",
    whatWeBuild: "Custom enterprise copilots, streaming web/mobile portals, and decision cockpits integrated into existing software stacks.",
    whoNeedsIt: "Chief Product Officers, Enterprise Business Unit Heads, and Digital Experience Leaders.",
    icon: Cpu,
    color: "text-[#1677FF]",
    bg: "bg-[#1677FF]/10",
    border: "border-[#1677FF]/20",
    href: "/services/generative-ai",
  },
  {
    id: "agents",
    title: "AI Agents",
    whatItIs: "Goal-driven autonomous systems that plan, invoke enterprise tools, and execute multi-step workflows.",
    problemSolved: "Complex cross-system tasks require manual coordination, error-prone data re-entry, and extended turnaround cycles.",
    whatWeBuild: "Multi-agent coordinated swarms with sandboxed API tool calling, state memory, and human-in-the-loop escalation gates.",
    whoNeedsIt: "COOs, VP of Operations, and Engineering Leaders modernizing critical business processes.",
    icon: Bot,
    color: "text-[#7C5CFF]",
    bg: "bg-[#7C5CFF]/10",
    border: "border-[#7C5CFF]/20",
    href: "/services/generative-ai",
  },
  {
    id: "knowledge",
    title: "Enterprise Knowledge",
    whatItIs: "Private RAG and knowledge graph systems connecting AI directly to organizational data.",
    problemSolved: "Analysts spend hours searching through unindexed SharePoint, Confluence, PDFs, and SQL records with risk of misinformation.",
    whatWeBuild: "VPC-isolated hybrid RAG pipelines with dense/sparse retrieval, hierarchical chunking, and verifiable source citations.",
    whoNeedsIt: "Chief Legal Officers, Compliance Directors, and Knowledge Management Executives.",
    icon: Search,
    color: "text-[#00D4FF]",
    bg: "bg-[#00D4FF]/10",
    border: "border-[#00D4FF]/20",
    href: "/services/generative-ai",
  },
  {
    id: "automation",
    title: "Intelligent Automation",
    whatItIs: "End-to-end cognitive automation that eliminates repetitive back-office and document operations.",
    problemSolved: "Teams spend thousands of hours manually reviewing unstructured invoices, shipping bills, and multi-system reconciliations.",
    whatWeBuild: "Multimodal document extraction pipelines, automated 3-way reconciliation engines, and policy verification bots.",
    whoNeedsIt: "CFOs, Finance Directors, Procurement Leaders, and Shared Services Heads.",
    icon: Zap,
    color: "text-[#1677FF]",
    bg: "bg-[#1677FF]/10",
    border: "border-[#1677FF]/20",
    href: "/services",
  },
  {
    id: "modernization",
    title: "AI Modernization",
    whatItIs: "Upgrading existing legacy applications, codebases, and systems with embedded AI capabilities.",
    problemSolved: "Legacy enterprise architectures are costly to rewrite from scratch, yet hold back modernization initiatives.",
    whatWeBuild: "API adapter layers, automated legacy code translation pipelines, regression test harnesses, and microservice refactoring.",
    whoNeedsIt: "CIOs, Chief Architects, and VP of Application Development managing core system debt.",
    icon: Network,
    color: "text-[#7C5CFF]",
    bg: "bg-[#7C5CFF]/10",
    border: "border-[#7C5CFF]/20",
    href: "/services",
  },
  {
    id: "decision",
    title: "Decision Intelligence",
    whatItIs: "Predictive analytics and scenario synthesis transforming raw operational data into forward-looking decisions.",
    problemSolved: "Leadership relies on lagging historical dashboards rather than predictive foresight and real-time anomaly detection.",
    whatWeBuild: "Time-series forecasting models, automated fraud and anomaly scoring engines, and boardroom predictive telemetry cockpits.",
    whoNeedsIt: "Chief Risk Officers, VP of Strategy, and Revenue Operations Leaders.",
    icon: BarChart3,
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10",
    border: "border-[#10B981]/20",
    href: "/services",
  },
];

export function WhatWeBuild() {
  return (
    <section className="relative py-20 md:py-28 border-t border-border/60">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-14"
        >
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full mb-4"
          >
            What We Build
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground mb-4">
            Enterprise AI that solves{" "}
            <span className="text-primary">real business problems.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
            We design, engineer, and deploy AI systems organized around what your
            organization needs to achieve — bridging strategic intent with robust, production-grade software.
          </p>
        </motion.div>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            const isFeatured = idx === 0;
            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
              >
                <Link
                  href={cap.href}
                  className={`group flex flex-col justify-between gap-5 p-6 rounded-2xl border transition-all duration-300 h-full ${
                    isFeatured
                      ? "bg-gradient-to-br from-[#0D1828] to-[#08111F] border-primary/40 shadow-sm hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                      : "bg-[#08111F] border-[#162238] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: Icon + Title */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl ${cap.bg} border border-[#162238] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0`}
                      >
                        <Icon className={`w-5 h-5 ${cap.color}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-heading text-[#F5F7FA] group-hover:text-primary transition-colors">
                          {cap.title}
                        </h3>
                        <p className="text-[11px] text-[#A7B4C5] leading-snug">
                          {cap.whatItIs}
                        </p>
                      </div>
                    </div>

                    {/* 4-Question Structured Body */}
                    <div className="space-y-3 pt-1 text-xs">
                      {/* Business Problem */}
                      <div className="bg-[#050B14]/60 border border-[#162238] rounded-xl p-3">
                        <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground block mb-0.5">
                          Problem Solved
                        </span>
                        <p className="text-[11px] text-[#A7B4C5] leading-relaxed">
                          {cap.problemSolved}
                        </p>
                      </div>

                      {/* What Indusnet AI Builds */}
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                        <span className="text-[10px] font-mono uppercase font-bold text-primary block mb-0.5">
                          What We Deliver
                        </span>
                        <p className="text-[11px] text-[#F5F7FA] font-medium leading-relaxed">
                          {cap.whatWeBuild}
                        </p>
                      </div>

                      {/* Target Stakeholder */}
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <span className="text-primary font-bold">Target Stakeholders:</span>
                        <span className="truncate">{cap.whoNeedsIt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary pt-2 border-t border-[#162238] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore AI Capabilities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Contextual CTA Bridge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#08111F] border border-[#162238] shadow-sm"
        >
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              Strategic Evaluation
            </span>
            <p className="text-sm font-semibold text-foreground">
              Ready to evaluate which capability delivers highest operational leverage for your organization?
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              asChild
              size="sm"
              className="rounded-full bg-primary text-white font-bold hover:bg-primary/90 text-xs px-5 shadow-md shadow-primary/20"
            >
              <Link href="/assessment" className="flex items-center gap-1.5">
                Discover Your AI Opportunity
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("open-ai-concierge", { detail: {} })
                  );
                }
              }}
              className="text-xs text-muted-foreground hover:text-foreground font-medium px-2 py-1 transition-colors cursor-pointer"
            >
              or Talk to Our AI →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
