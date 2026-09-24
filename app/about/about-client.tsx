"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Compass, Award, Cpu, ShieldCheck, Zap, ArrowRight, UserCheck, Briefcase, Users } from "lucide-react";
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
    desc: "Engineered our flagship private enterprise RAG architecture, designed to allow regulated banking and healthcare environments to index private documentation safely.",
  },
  {
    year: "2026",
    title: "Agentic Automation Focus",
    desc: "Established a dedicated R&D lab for autonomous AI agents, deploying self-healing digital pipelines in manufacturing and logistics.",
  },
];

const competencies = [
  { title: "CPMAI Methodology", desc: "Cognitive Project Management for AI framework alignment, bringing structured governance to machine learning delivery.", icon: Award },
  { title: "Azure AI Ecosystem", desc: "Enterprise architecture leveraging Azure OpenAI, Cognitive Search, and private cloud enclaves.", icon: ShieldCheck },
  { title: "AWS Bedrock & VPC", desc: "Specialized AWS Bedrock and SageMaker architectures delivering low-latency, isolated VPC deployments.", icon: Cpu },
  { title: "LangChain & Agent Tooling", desc: "Advanced orchestration implementations using LangChain, LangGraph, and deterministic state machines.", icon: Zap }
];

export default function AboutClient() {
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
          <Card className="bg-[#08111F] border border-[#162238] hover:border-primary/40 rounded-2xl text-left h-full shadow-md transition-all duration-300">
            <CardContent className="p-8 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-sm">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Our Mission</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To equip mid-market and enterprise organizations with secure, private, and audit-ready artificial intelligence solutions. We replace manual friction with intelligent agents while maintaining absolute compliance and data custody.
              </p>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="bg-[#08111F] border border-[#162238] hover:border-primary/40 rounded-2xl text-left h-full shadow-md transition-all duration-300">
            <CardContent className="p-8 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shadow-sm">
                <Compass className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Our Vision</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To become the most trusted global facilitator of certified cognitive project management methodologies and bespoke agentic networks, setting the standard for compliant, deterministic, and self-correcting machine learning architectures.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. FOUNDER FOCUS */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="bg-[#08111F] border border-[#162238] rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left shadow-xl">
          {/* Founder Bio */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <Badge className="bg-primary/10 border-primary/25 text-primary font-mono w-fit rounded-full px-3 py-1 text-xs">
              Executive Leadership
            </Badge>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              Bespoke AI Engineered by <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Enterprise Veterans</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Founded by tech innovators with over two decades of systems integration and software engineering heritage, Indusnet AI was spun out to answer a single question from our enterprise clients: <em>"How do we deploy LLMs securely on our own cloud without sending proprietary data to third parties?"</em>
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Under our leadership, we have combined cognitive methodologies (CPMAI) with pure software engineering logic. We do not just build chatbots; we build self-healing agentic integrations that connect securely to legacy mainframe systems, private databases, and workflow pipelines.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Srinivasan Subramani</p>
                <p className="text-xs text-muted-foreground font-mono">Chief Executive Officer (CEO) | Certified CPMAI Facilitator</p>
              </div>
            </div>
          </div>

          {/* Picture / Avatar Placeholder Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 rounded-2xl bg-gradient-to-tr from-[#0D1828] to-[#08111F] border border-[#162238] p-1 flex items-center justify-center overflow-hidden group shadow-lg">
              <div className="w-full h-full rounded-xl bg-[#08111F]/90 flex flex-col items-center justify-center gap-3 p-6 text-center border border-[#162238] group-hover:border-primary/40 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-bold text-foreground text-sm">Certified CPMAI</h4>
                <p className="text-[10px] text-muted-foreground font-mono">Cognitive Project Management for AI Methodology</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MILITARY-GRADE TIMELINE */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl flex flex-col gap-12 text-center">
        <div className="flex flex-col gap-3 max-w-xl mx-auto">
          <Badge className="bg-primary/10 border-primary/25 text-primary font-mono w-fit mx-auto rounded-full px-3 py-1 text-xs">
            Our Journey
          </Badge>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Timeline of Milestones</h2>
          <p className="text-muted-foreground text-sm">
            A chronological mapping of our evolution, from pioneering local experiments to facilitating global enterprise transformations.
          </p>
        </div>

        <div className="relative border-l border-[#162238] ml-4 md:ml-32 text-left flex flex-col gap-12 py-4">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative pl-8 md:pl-12 group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#050B14] border-2 border-primary group-hover:border-cyan-400 group-hover:scale-125 transition-all duration-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-cyan-400 transition-all" />
              </div>

              {/* Event Content */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/25 w-fit px-2.5 py-0.5 rounded-md">
                  {evt.year}
                </span>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
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

      {/* 5. TECHNOLOGY ECOSYSTEM & COMPETENCIES */}
      <section className="container mx-auto px-4 md:px-6 flex flex-col gap-12 text-center max-w-5xl">
        <div className="flex flex-col gap-3 max-w-xl mx-auto">
          <Badge className="bg-primary/10 border-primary/25 text-primary font-mono w-fit mx-auto rounded-full px-3 py-1 text-xs">
            Technology Ecosystem
          </Badge>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Our Core Competencies</h2>
          <p className="text-muted-foreground text-sm">
            We engineer across enterprise cloud environments, certified cognitive methodologies, and modern AI orchestration frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {competencies.map((comp, idx) => (
            <Card key={idx} className="bg-[#08111F] border border-[#162238] hover:border-primary/40 rounded-xl text-left shadow-sm transition-all duration-300">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-sm">
                  <comp.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-base text-foreground">{comp.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{comp.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. CAREERS & RECRUITMENT */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-[#08111F] border border-[#162238] rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left shadow-xl">
          <div className="md:col-span-8 flex flex-col gap-4">
            <Badge className="bg-primary/10 border-primary/25 text-primary font-mono w-fit rounded-full px-3 py-1 text-xs">
              Careers & Talent Acquisition
            </Badge>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              Join the <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Next Generation</span> of AI Engineering
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We are constantly seeking brilliant software architects, prompt engineers, and AI developers who want to build secure, agentic machine learning solutions for enterprise environments.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center w-full">
            <Button asChild size="lg" className="rounded-full bg-primary text-white font-bold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-300 w-full">
              <Link href="/careers" className="flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4" />
                Explore Careers
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-[#08111F] border border-[#162238] rounded-3xl py-12 px-6 md:px-12 text-center flex flex-col gap-6 items-center shadow-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Let's Create Your AI Strategy Together</h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg leading-relaxed">
            Partner with certified CPMAI facilitators and full-stack software architects to construct a compliant, highly secure roadmap for your company.
          </p>
          <Button asChild size="lg" className="rounded-full bg-primary text-white font-bold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-300 group">
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
