"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Compass, Sparkles, Award, Cpu, ShieldCheck, Zap, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const timelineEvents = [
  {
    year: "2023",
    title: "Inception & Seed Phase",
    desc: "Indusnet AI launched as a dedicated deep-tech branch of Indusnet Technologies, focusing purely on custom Large Language Model integrations.",
  },
  {
    year: "2024",
    title: "CPMAI Facilitation & Accreditation",
    desc: "Secured certified CPMAI training facilitation rights. Launched our first corporate Generative AI Developer Bootcamps across Asia-Pacific.",
  },
  {
    year: "2025",
    title: "Scale & RAG Search Launch",
    desc: "Shipped our flagship secure enterprise RAG knowledge engine, enabling fortune-500 banks and healthcare systems to ingest private data safely.",
  },
  {
    year: "2026",
    title: "Agentic Automation Focus",
    desc: "Established a dedicated R&D lab for autonomous AI agents, deploying self-healing digital pipelines in manufacturing and logistics.",
  },
];

const accreditations = [
  { title: "CPMAI Facilitator", desc: "Certified Cognitive Project Management for AI methodology facilitator, ensuring highest success rates.", icon: Award },
  { title: "Azure Gold Partner", desc: "Enterprise partnership providing state-of-the-art Azure AI, Cognitive Services, and secure cloud environments.", icon: ShieldCheck },
  { title: "AWS Select Partner", desc: "Specialized AWS Bedrock and SageMaker architects delivering high-speed inference setups.", icon: Cpu },
  { title: "LangChain Integrator", desc: "Officially recognized integration consultants for custom autonomous LLM workflows and orchestrations.", icon: Zap }
];

export default function AboutPage() {
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
            Our Lineage & Vision
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Pioneering <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Enterprise AI Implementation</span> with Rigor & Security
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          We bridge the massive gap between cutting-edge AI academic models and actual, high-security, high-ROI enterprise production workloads.
        </motion.p>
      </section>

      {/* 2. VISION, MISSION & VALUES GRID */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mission */}
          <Card className="glassmorphism-card border-none text-left h-full">
            <CardContent className="p-8 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Our Mission</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To equip mid-market and enterprise organizations with secure, private, and audit-ready artificial intelligence solutions. We replace manual friction with intelligent agents while maintaining absolute compliance and data custody.
              </p>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="glassmorphism-card border-none text-left h-full">
            <CardContent className="p-8 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Compass className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Our Vision</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To become the most trusted global facilitator of certified cognitive project management methodologies and bespoke agentic networks, setting the standard for compliant, deterministic, and self-correcting machine learning architectures.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. FOUNDER FOCUS */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="glassmorphism-card rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          {/* Founder Bio */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <Badge className="bg-primary/10 border-primary/20 text-primary w-fit rounded-full px-2.5 py-0.5 text-xs">
              Executive Leadership
            </Badge>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Bespoke AI Engineered by <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Enterprise Veterans</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Founded by tech innovators with over two decades of systems integration and software engineering heritage, Indusnet AI was spun out to answer a single question from our enterprise clients: <em>"How do we deploy LLMs securely on our own cloud without sending proprietary data to third parties?"</em>
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Under our leadership, we have combined cognitive methodologies (CPMAI) with pure software engineering logic. We do not just build chatbots; we build self-healing agentic integrations that connect securely to legacy mainframe systems, private databases, and workflow pipelines.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Senthilkumar Elu</p>
                <p className="text-xs text-muted-foreground">Founder & Managing Director | Certified CPMAI Facilitator</p>
              </div>
            </div>
          </div>

          {/* Picture / Avatar Placeholder Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 rounded-2xl bg-gradient-to-tr from-primary/10 to-accent/10 border border-border/40 p-1 flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="w-full h-full rounded-xl bg-background/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 p-6 text-center border border-white/5 group-hover:border-primary/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-white text-sm">Certified CPMAI</h4>
                <p className="text-[10px] text-muted-foreground">Highest Standard in AI Implementation Methodology</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MILITARY-GRADE TIMELINE */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl flex flex-col gap-12 text-center">
        <div className="flex flex-col gap-3 max-w-xl mx-auto">
          <Badge className="bg-accent/10 border-accent/20 text-accent w-fit mx-auto rounded-full px-3 py-1 text-xs">
            Our Journey
          </Badge>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Timeline of Milestones</h2>
          <p className="text-muted-foreground text-sm">
            A chronological mapping of our evolution, from pioneering local experiments to facilitating global enterprise transformations.
          </p>
        </div>

        <div className="relative border-l border-border/60 ml-4 md:ml-32 text-left flex flex-col gap-12 py-4">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative pl-8 md:pl-12 group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background border-2 border-primary group-hover:border-accent group-hover:scale-125 transition-all duration-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-accent transition-all" />
              </div>

              {/* Event Content */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-primary bg-primary/10 border border-primary/20 w-fit px-2.5 py-0.5 rounded-md">
                  {evt.year}
                </span>
                <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                  {evt.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-2xl">
                  {evt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ACCREDITATIONS & ACCREDITED PARTNERS */}
      <section className="container mx-auto px-4 md:px-6 flex flex-col gap-12 text-center max-w-5xl">
        <div className="flex flex-col gap-3 max-w-xl mx-auto">
          <Badge className="bg-primary/10 border-primary/20 text-primary w-fit mx-auto rounded-full px-3 py-1 text-xs">
            Authorized Partner
          </Badge>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Our Accreditations</h2>
          <p className="text-muted-foreground text-sm">
            We are deeply aligned with global cloud nodes, certified methodology providers, and active frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accreditations.map((acc, idx) => (
            <Card key={idx} className="glassmorphism-card border-none text-left">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <acc.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-base text-white">{acc.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{acc.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="glassmorphism-card rounded-3xl py-12 px-6 md:px-12 text-center flex flex-col gap-6 items-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Let's Create Your AI Strategy Together</h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg leading-relaxed">
            Partner with certified CPMAI facilitators and full-stack software architects to construct a compliant, highly secure roadmap for your company.
          </p>
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 group">
            <Link href="/contact" className="flex items-center gap-1.5">
              Let's Consult
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
