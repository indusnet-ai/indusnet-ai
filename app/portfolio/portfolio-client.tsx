"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, ShieldAlert, Cpu, Sparkles, Check, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Terminal, Database, Play,
  ExternalLink, FlaskConical
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github } from "@/components/ui/brand-icons";

const caseStudies = [
  {
    title: "Secure Enterprise RAG Engine",
    client: "Example Engagement: Financial Services",
    badge: "Finance & Compliance",
    metric: "Sub-Second Retrieval",
    repoUrl: "https://github.com/indusnet-ai/RAG",
    problem: "In large-scale financial compliance operations, over 100,000 regulatory guidelines, investment logs, and compliance records are frequently spread across disconnected repositories. Compliance underwriters spend hours searching records, introducing operational latency and verification risk.",
    solution: "We engineered a VPC-isolated RAG architecture. The system parses PDF, DOCX, and tabular files, structures them using hierarchical chunking, and indexes them in a secure vector store with sub-second hybrid retrieval and role-based access control.",
    architecture: "Document ingestion pipeline -> Hierarchical chunking -> VPC-isolated vector store -> Private GPU LLM node with citation verification.",
    results: [
      "Document discovery time targeted from hours down to sub-minute retrieval.",
      "VPC-isolated deployment: zero proprietary or regulatory data traverses public subnets.",
      "Comprehensive verification citations provided for every compliance query."
    ],
    tech: ["Llama-3", "Vector DB", "Hierarchical Chunking", "Private GPU", "Docker"]
  },
  {
    title: "Edge Computer Vision QC Scanner",
    client: "Example Engagement: Advanced Manufacturing",
    badge: "Manufacturing & Robotics",
    metric: "Real-Time Edge Inference (60 FPS)",
    problem: "In high-precision manufacturing, conveyor-speed production requires inspecting high-tolerance industrial components. Manual visual sampling cannot reliably detect microscopic hairline fissures across high-speed continuous assembly.",
    solution: "We deployed an edge computer vision pipeline scanning components in real time. Deployed on NVIDIA Jetson edge systems, an optimized YOLO model detects surface anomalies at 60 frames per second, communicating directly with factory PLCs for automated defect sorting.",
    architecture: "High-FPS camera stream -> TensorRT optimized YOLO inference on NVIDIA Jetson -> Local MQTT broker alerts factory PLC -> Automated defect rejection.",
    results: [
      "Continuous 24/7 visual inspection running at 60 FPS directly on the production line.",
      "Defect detection speed operates within the hardware cycle time of the conveyor.",
      "Substantially mitigates downstream product warranty and assembly failure risks."
    ],
    tech: ["YOLOv8", "TensorRT", "NVIDIA Jetson", "PyTorch", "MQTT"]
  },
  {
    title: "Predictive Analytics & Fraud Shield",
    client: "Example Engagement: FinTech & Digital Payments",
    badge: "FinTech & Payment Gateway",
    metric: "Sub-5ms Inference Latency",
    problem: "High-volume digital payment gateways process millions of transactions daily. Dynamic fraud patterns evade static rule-based filters, resulting in costly payment reversals and merchant friction.",
    solution: "We developed a machine learning payment profiling pipeline. An optimized gradient-boosted decision model evaluates incoming transaction telemetry (device fingerprints, velocity, and geolocation patterns) in under 5 milliseconds.",
    architecture: "Transaction ingestion API -> Telemetry feature engineering -> Sub-5ms inference on dedicated endpoints -> In-memory state cache -> Real-time risk scoring.",
    results: [
      "Sub-5ms scoring introduces zero human-perceivable payment latency.",
      "Continuous anomaly detection adapts to emerging fraud attack vectors.",
      "Automated risk scoring reduces false positive review queues."
    ],
    tech: ["XGBoost", "Feature Store", "FastAPI", "Redis", "Scikit-Learn"]
  },
  {
    title: "Ambient Clinical Intake Assistant",
    client: "Example Engagement: Healthcare Provider",
    badge: "Healthcare & Clinical Care",
    metric: "Automated Clinical Documentation",
    problem: "Physicians and clinical staff often spend hours daily manually typing patient intake files and consultation notes. This extensive administrative documentation burden reduces patient contact time and contributes to clinical burnout.",
    solution: "We developed an ambient clinical intake pipeline. Consultations are transcribed via speech-to-text models, validated for clinical context, and structured into standardized EHR templates using strict local data governance controls.",
    architecture: "Ambient microphone stream -> High-accuracy speech-to-text -> Medical domain language structuring -> PII de-identification filter -> Standard EHR integration.",
    results: [
      "Significantly reduces manual documentation burden after each consultation.",
      "Accelerates patient intake processing while preserving EHR formatting consistency.",
      "Strict role-based isolation ensures patient health data remains fully protected."
    ],
    tech: ["Whisper-Large", "Clinical LLMs", "Next.js", "Python", "FHIR APIs"]
  }
];

export default function PortfolioClient() {
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
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-3 py-1 text-xs">
              Solution Showcases
            </Badge>
            <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-400 rounded-full px-3 py-1 text-xs">
              Illustrative Scenarios
            </Badge>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Enterprise AI <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Solution Showcases</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          Explore representative solution architectures we design and build. Each showcase illustrates how we solve complex enterprise friction points with private, production-grade AI systems.
        </motion.p>
      </section>

      {/* 2. CASE STUDIES DEEP showcase */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-col gap-12">
        {caseStudies.map((study, idx) => (
          <Card key={idx} className="bg-[#08111F] border border-[#162238] hover:border-primary/40 rounded-2xl text-left overflow-hidden shadow-md transition-all duration-300">
            <CardContent className="p-8 md:p-10 flex flex-col gap-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#162238]">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 border border-primary/25 text-primary rounded-md px-2.5 py-0.5 text-xs font-mono font-semibold">
                      {study.badge}
                    </Badge>
                    <Badge className="bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-md px-2.5 py-0.5 text-[10px] font-mono font-semibold">
                      Illustrative Architecture
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground tracking-tight mt-2">{study.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">Context: <span className="text-foreground font-medium">{study.client}</span></p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-primary/10 border border-primary/25 rounded-xl px-4 py-2 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-primary">{study.metric}</span>
                  </div>
                </div>
              </div>

              {/* Core Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Problem & Solution */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  {/* Problem */}
                  <div className="flex flex-col gap-2.5 bg-[#0D1828]/70 border border-[#162238] rounded-xl p-5">
                    <h3 className="font-mono font-bold text-xs uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" /> The Friction
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {study.problem}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="flex flex-col gap-2.5 bg-[#0D1828]/70 border border-[#162238] rounded-xl p-5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-mono font-bold text-xs uppercase text-primary tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-primary" /> Engineered Solution
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {study.solution}
                    </p>
                  </div>
                </div>

                {/* Architecture & Metrics */}
                <div className="lg:col-span-5 flex flex-col gap-5 justify-between h-full">
                  {/* Architecture */}
                  <div className="flex flex-col gap-3 bg-[#0D1828]/70 border border-[#162238] rounded-xl p-5">
                    <h3 className="font-mono font-bold text-xs uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-cyan-400" /> System Architecture
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-mono leading-relaxed bg-[#050B14] border border-[#162238] rounded-lg p-3">
                      {study.architecture}
                    </p>
                  </div>

                  {/* Metrics/Outcomes list */}
                  <div className="flex flex-col gap-3 bg-[#0D1828]/70 border border-[#162238] rounded-xl p-5">
                    <h3 className="font-mono font-bold text-xs uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" /> Target System Outcomes (Illustrative)
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {study.results.map((res, index) => (
                        <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technologies footer */}
              <div className="border-t border-[#162238] pt-5 mt-1 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Database className="w-3.5 h-3.5 text-primary" /> Integrated Technologies:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {study.tech.map((t, index) => (
                    <Badge key={index} className="bg-[#0D1828] border border-[#162238] text-muted-foreground font-mono text-[11px] hover:border-primary/30 px-2.5 py-0.5 rounded-md">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 3. CTA */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-[#08111F] border border-[#162238] rounded-3xl py-14 px-6 md:px-12 text-center flex flex-col gap-6 items-center shadow-xl">
          <Badge className="bg-primary/10 border-primary/25 text-primary font-mono rounded-full px-3 py-1 text-xs">
            Secure Prototyping
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Let's Design Your Secure Proof-of-Concept</h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg leading-relaxed">
            Unsure of LLM hallucinations or vector storage setups? We build secure, sandbox environments loaded with your private data to illustrate functionality before committing to heavy scaling costs.
          </p>
          <Button asChild size="lg" className="rounded-full bg-primary text-white font-bold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-300 group">
            <Link href="/contact" className="flex items-center gap-1.5">
              Consult a Solutions Architect <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
