"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, Clock, Users, Trophy, BookOpen, Award, CheckCircle2, 
  ArrowRight, ShieldCheck, Cpu, Library 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const trainingPrograms = [
  {
    title: "CPMAI Methodological Training",
    badge: "Enterprise Standard",
    duration: "4 Days (Facilitator-Led)",
    audience: "Project Managers, AI Directors, Business Analysts, IT Leaders",
    outcome: "Certified CPMAI facilitating rights + implementation template database",
    desc: "Cognitive Project Management for AI (CPMAI) is the leading global methodology for managing AI, machine learning, and cognitive computing projects successfully.",
    curriculum: [
      "Phase 1: Business Case Alignment & AI Feasibility Auditing",
      "Phase 2: Data Requirements, Ingestion, and Cleaning Parameters",
      "Phase 3: Model Selection & Algorithm Architecture Construction",
      "Phase 4: Model Training, Weight Optimization, and Hyperparameter Tuning",
      "Phase 5: Model Deployment, Observability Dashboards, and API Integrations",
      "Phase 6: Active Model Monitoring, Drift Scanning, and Iteration Loops"
    ],
    highlight: true,
    color: "border-primary/40 shadow-[0_0_30px_rgba(124,58,237,0.1)] bg-gradient-to-tr from-primary/5 to-transparent"
  },
  {
    title: "Generative AI Developer Bootcamp",
    badge: "Engineering Focus",
    duration: "4 Weeks (Weekend Format)",
    audience: "Software Engineers, Full-Stack Developers, Database Architects",
    outcome: "Working secure RAG search engine + autonomous agent deployed on private cloud",
    desc: "A hands-on, high-intensity technical program designed to transition standard developers into enterprise-grade GenAI application engineers.",
    curriculum: [
      "System Prompting & Advanced Engineering Safety Rails (Guardrails)",
      "Semantic Search & Dense Embeddings Vector Database Setup (Qdrant/pgvector)",
      "Orchestration Systems: LangChain, LlamaIndex, & Multi-Agent State management",
      "Model Hosting: Ollama, vLLM, and private GPU hardware considerations",
      "Deployment Pipelines: FastAPI, Docker, and secure microservices",
      "Fine-Tuning: Parameter-Efficient Fine-Tuning (PEFT) and LoRA configurations"
    ],
    highlight: false,
    color: "border-border/40 hover:border-primary/30"
  },
  {
    title: "GenAI Executive Masterclass",
    badge: "Strategy & Governance",
    duration: "1 Day (8 Hours Intensive)",
    audience: "C-Level Officers, VPs, Directors of Innovation",
    outcome: "Custom Enterprise AI Governance template + ROI cost estimation spreadsheets",
    desc: "Prepare leadership to navigate budgeting, risk management, legal privacy concerns, and ROI metrics when implementing AI inside the organization.",
    curriculum: [
      "The Economic Imperative: What is and is not possible with LLMs",
      "Data Custody: Closed API Risks vs. Open-Source Local Architectures",
      "AI Safety & Governance: Mitigating bias, leaks, and compliance gaps",
      "Feasibility Roadmapping: Structuring high-ROI, quick-win AI projects",
      "Budgeting & Sizing: GPU Cloud fees vs. On-Premise hardware costs",
      "Culture & Adoption: Upskilling paths and lowering employee resistance"
    ],
    highlight: false,
    color: "border-border/40 hover:border-accent/30"
  },
  {
    title: "AI Fundamentals Bootcamp",
    badge: "All-Staff Alignment",
    duration: "2 Days (Virtual Facilitated)",
    audience: "Department Managers, Operations Teams, Corporate Personnel",
    outcome: "Certified Prompt Engineer credentials + custom workflow automation scripts",
    desc: "Elevate the baseline AI literacy of your entire organization. Learn how to securely use AI tools to automate daily spreadsheets, report writing, and emails.",
    curriculum: [
      "Understanding LLMs: How prompt engines function under the hood",
      "Advanced Prompt Engineering: Few-shot, chain-of-thought, and system rules",
      "AI Productivity Tools: Secure use of ChatGPT, Claude, and Gemini",
      "Workflow Automation: Connecting spreadsheets to automated email draft triggers",
      "Data Privacy Safety: Strict rules against uploading proprietary corporate data",
      "Collaborative workflows: Standardizing prompts across corporate units"
    ],
    highlight: false,
    color: "border-border/40 hover:border-primary/30"
  }
];

export default function TrainingPage() {
  return (
    <div className="flex flex-col gap-24 md:gap-32 pt-32 pb-24">
      {/* 1. HERO HEADER */}
      <section className="container mx-auto px-4 md:px-6 relative overflow-hidden text-center max-w-4xl flex flex-col gap-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-3 py-1 text-xs">
            Upskill & Certify
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Certified <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Corporate AI Training</span> & CPMAI Facilitation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          Do not let your workforce fall behind the curve. We provide certified methodology alignment, hands-on engineering bootcamps, and executive governance workshops.
        </motion.p>
      </section>

      {/* 2. PROGRAMS CATALOG */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-col gap-12">
        <div className="flex flex-col gap-16">
          {trainingPrograms.map((prog, idx) => (
            <Card key={idx} className={`glassmorphism-card border-none text-left overflow-hidden ${prog.color}`}>
              <CardContent className="p-8 md:p-10 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-tight">
                        {prog.title}
                      </h2>
                      <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary" /> {prog.duration}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-accent" /> {prog.audience}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                    {prog.badge}
                  </Badge>
                </div>

                {/* Description & outcome */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 flex flex-col gap-5">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {prog.desc}
                    </p>

                    <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 flex flex-col gap-2">
                      <p className="text-xs uppercase font-bold text-accent tracking-wider flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-accent animate-bounce" /> Certified Outcome
                      </p>
                      <p className="text-xs text-white leading-relaxed font-semibold">
                        {prog.outcome}
                      </p>
                    </div>
                  </div>

                  {/* Curriculum Details */}
                  <div className="lg:col-span-7 flex flex-col gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6">
                    <h3 className="font-bold text-xs uppercase text-white tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-primary" /> Curriculum Modules
                    </h3>
                    <ul className="grid grid-cols-1 gap-3">
                      {prog.curriculum.map((item, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. CERTIFICATION STANDARDS */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl text-center flex flex-col gap-8 items-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">CPMAI Certification Facilitation</h2>
        <p className="text-muted-foreground text-xs md:text-sm max-w-xl leading-relaxed">
          As accredited CPMAI training facilitators, we align our curricula strictly with the global Cognitive Project Management for AI methodology. This ensures your workforce learns the deterministic project guidelines proven to avoid common model deployment bottlenecks.
        </p>
      </section>

      {/* 4. CTA */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="glassmorphism-card rounded-3xl py-16 px-6 md:px-12 text-center flex flex-col gap-6 items-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Need a Custom Team Curriculum?</h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg leading-relaxed">
            We write bespoke training programs tailored exactly to your company's software integrations, model compliance restrictions, and private data subnets.
          </p>
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 group">
            <Link href="/contact" className="flex items-center gap-1.5">
              Request Custom Syllabus <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
