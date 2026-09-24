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

// What We Build — 6 executive-level capability categories
// Organized around what enterprise buyers are trying to achieve, not technologies.
const CAPABILITIES = [
  {
    id: "applications",
    title: "AI Applications",
    description:
      "Production-ready applications powered by enterprise AI — from intelligent copilots and knowledge assistants to decision-support systems used daily by your teams.",
    icon: Cpu,
    color: "text-[#1677FF]",
    bg: "bg-[#1677FF]/10",
    border: "border-[#1677FF]/20",
    href: "/services/generative-ai",
  },
  {
    id: "agents",
    title: "AI Agents",
    description:
      "Autonomous intelligent systems that understand intent, access enterprise tools, execute multi-step workflows, and deliver verified outcomes — with human oversight built in.",
    icon: Bot,
    color: "text-[#7C5CFF]",
    bg: "bg-[#7C5CFF]/10",
    border: "border-[#7C5CFF]/20",
    href: "/services/generative-ai",
  },
  {
    id: "knowledge",
    title: "Enterprise Knowledge",
    description:
      "RAG-powered knowledge systems that give employees and AI agents instant, accurate access to your private organizational data — with verified source citations and grounded attribution.",
    icon: Search,
    color: "text-[#00D4FF]",
    bg: "bg-[#00D4FF]/10",
    border: "border-[#00D4FF]/20",
    href: "/services/generative-ai",
  },
  {
    id: "automation",
    title: "Intelligent Automation",
    description:
      "AI-powered workflows that eliminate manual, repetitive operations across document processing, cross-system reconciliation, approvals, and multi-step business processes.",
    icon: Zap,
    color: "text-[#1677FF]",
    bg: "bg-[#1677FF]/10",
    border: "border-[#1677FF]/20",
    href: "/services",
  },
  {
    id: "modernization",
    title: "AI Modernization",
    description:
      "Upgrade existing software, legacy codebases, and manual workflows with AI capabilities — extending the life and value of enterprise systems without rebuilding from scratch.",
    icon: Network,
    color: "text-[#7C5CFF]",
    bg: "bg-[#7C5CFF]/10",
    border: "border-[#7C5CFF]/20",
    href: "/services",
  },
  {
    id: "decision",
    title: "Decision Intelligence",
    description:
      "Turning enterprise data into timely, actionable decisions — from predictive risk synthesis and scenario modeling to boardroom-ready intelligence briefings.",
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
            We design and engineer AI systems organized around what your
            organization needs to achieve — not around technology for its own
            sake.
          </p>
        </motion.div>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl ${cap.bg} border border-[#162238] flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon className={`w-5 h-5 ${cap.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2">
                      <h3
                        className="text-base font-bold font-heading text-[#F5F7FA] group-hover:text-primary transition-colors"
                      >
                        {cap.title}
                      </h3>
                      <p className="text-xs text-[#A7B4C5] leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary pt-2 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA bridge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 flex items-center gap-3 text-sm text-muted-foreground"
        >
          <span className="w-8 h-px bg-border/80" />
          <span>
            Not sure where to start?{" "}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("open-ai-concierge", { detail: {} })
                  );
                }
              }}
              className="text-primary font-semibold hover:underline underline-offset-2"
            >
              Talk to our AI and get a recommendation in 2 minutes →
            </button>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
