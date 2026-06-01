"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, ShieldAlert, Cpu, Sparkles, Check, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Terminal, Database, Play 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const caseStudies = [
  {
    title: "Secure Enterprise RAG Engine",
    client: "Metro Financial Group",
    badge: "Finance & Compliance",
    metric: "91% Faster Document Search",
    problem: "Metro Financial Group had over 100,000 regulatory guidelines, compliance files, and investment logs spread across disjointed servers. Underwriters spent up to 6 hours daily searching records, introducing massive human error risks and deal delays.",
    solution: "We engineered a VPC-isolated RAG search assistant. The system parses PDF, Docx, and SQL files, structures them using LlamaIndex hierarchical chunking, and indexes them in a secure Qdrant vector store. Sub-second semantic search is paired with strict role-based access controls.",
    architecture: "Ingestion pipeline parses documents with LlamaParse -> Chunks vectors with text-embedding-3-large -> Stores in Qdrant VPC instance -> Llama-3.1-70B running on private Azure GPU node generates responses with verified citations.",
    results: [
      "Document search time sliced from 6 hours to less than 30 seconds.",
      "100% private deployment: no regulatory PHI/PII data escaped their secure subnet.",
      "Zero compliance underwriting omissions reported since active deployment."
    ],
    tech: ["Llama-3.1", "Qdrant", "LlamaIndex", "Azure GPU", "Docker"]
  },
  {
    title: "Edge Computer Vision QC Scanner",
    client: "Sato Heavy Industries",
    badge: "Manufacturing & Robotics",
    metric: "Defect Escape Rate < 0.05%",
    problem: "Sato Heavy Industries manufactured high-speed turbine shafts. Manual inspections on conveyor belts failed to detect microscopic hairline fractures, resulting in occasional catastrophic rotor turbine failures post-assembly.",
    solution: "We deployed custom high-speed computer vision systems scanning conveyor shafts in real time. Deployed on NVIDIA Jetson Edge devices, the YOLOv8 model classifies microscopic surface defects at 60 frames per second, instantly triggering pneumatic defect ejectors.",
    architecture: "High-FPS camera capture -> TensorRT optimized YOLOv8 segmentation on NVIDIA Jetson edge nodes -> Local MQTT broker alerts factory PLC -> Pneumatic ejector clears defective SKUs.",
    results: [
      "Microscopic defect escapes plummeted from 2.4% to less than 0.05%.",
      "Conveyor-belt visual inspections operate 24/7/365 with zero inspection fatigue.",
      "Prevented millions of dollars in potential product warranty liability."
    ],
    tech: ["YOLOv8", "TensorRT", "NVIDIA Jetson", "PyTorch", "MQTT"]
  },
  {
    title: "Predictive Analytics & Fraud Shield",
    client: "GlobalPay Commerce",
    badge: "FinTech & Payment Gateway",
    metric: "Reclaimed $4.2M in Fraud",
    problem: "GlobalPay Commerce processed millions of payment transactions daily. Dynamic fraud vectors bypassed traditional rule-based filters, costing the platform massive payment chargeback penalties and lost merchant credibility.",
    solution: "We engineered a machine learning payment profiling pipeline. An XGBoost model trained on historical fraud logs evaluates incoming payment metadata (device, geolocation, velocity, volume) in less than 5 milliseconds, flagging suspicious profiles for instant verification.",
    architecture: "Incoming payment request API -> Feature extraction -> XGBoost inference on AWS SageMaker -> Sub-5ms scoring -> Redis state management -> Fraud alert trigger.",
    results: [
      "Successfully blocked $4.2 million in fraudulent payment attempts within 6 months.",
      "Inference completes in 4.8ms, introducing zero perceived transaction latency.",
      "Slashed merchant dispute chargeback penalties by 68%."
    ],
    tech: ["XGBoost", "AWS SageMaker", "FastAPI", "Redis", "Scikit-Learn"]
  },
  {
    title: "Ambient Clinical Intake Assistant",
    client: "CareAll Healthcare System",
    badge: "Healthcare & Patient Care",
    metric: "2.1 Hours Saved Daily per Dev/Doc",
    problem: "Physicians at CareAll spent up to 3 hours daily typing up clinical intake files. This severe documentation burnout drastically lowered daily patient consultation times and degraded clinical diagnostic quality.",
    solution: "We created a HIPAA-compliant voice ingestion system. The tablet recorder captures the patient-physician discussion ambiently, Whisper translates the conversation, and a fine-tuned Med-PaLM model structures the medical transcript directly into standard EHR note layouts.",
    architecture: "Ambient tablet microphone -> High-speed Whisper audio-to-text -> Med-PaLM custom instruction fine-tuned pipeline -> Strict PII redact validator -> Direct FHIR EHR API update.",
    results: [
      "Doctors save an average of 2.1 hours daily on manual clinical documentation.",
      "Increased daily patient consultation capacity by 34% per clinic.",
      "100% HIPAA and GDPR audit compliance using private local cloud servers."
    ],
    tech: ["Whisper-Large", "Med-PaLM", "Next.js", "Python", "FHIR APIs"]
  }
];

export default function PortfolioPage() {
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
            Proven Engineering
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Bespoke AI <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Case Studies</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          We do not just construct simple mockups. We deploy high-performance, high-compliance machine learning systems that save actual enterprise capital.
        </motion.p>
      </section>

      {/* 2. CASE STUDIES DEEP showcase */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-col gap-16">
        {caseStudies.map((study, idx) => (
          <Card key={idx} className="glassmorphism-card border-none text-left overflow-hidden">
            <CardContent className="p-8 md:p-12 flex flex-col gap-8">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/10">
                <div>
                  <Badge className="bg-primary/10 border border-primary/20 text-primary rounded px-2.5 py-0.5 text-xs font-semibold">
                    {study.badge}
                  </Badge>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">{study.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">Client: <span className="text-white font-medium">{study.client}</span></p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <span className="text-sm font-bold text-emerald-400">{study.metric}</span>
                </div>
              </div>

              {/* Core Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Problem & Solution */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Problem */}
                  <div className="flex flex-col gap-2.5 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                    <h3 className="font-bold text-xs uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" /> The Friction
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {study.problem}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="flex flex-col gap-2.5 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                    <h3 className="font-bold text-xs uppercase text-primary tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-primary" /> Engineered Solution
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {study.solution}
                    </p>
                  </div>
                </div>

                {/* Architecture & Metrics */}
                <div className="lg:col-span-5 flex flex-col gap-6 justify-between h-full">
                  {/* Architecture */}
                  <div className="flex flex-col gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                    <h3 className="font-bold text-xs uppercase text-accent tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-accent" /> System Architecture
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-mono leading-relaxed bg-black/40 border border-white/5 rounded-xl p-3">
                      {study.architecture}
                    </p>
                  </div>

                  {/* Metrics/Outcomes list */}
                  <div className="flex flex-col gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                    <h3 className="font-bold text-xs uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" /> Quantifiable Outcomes
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {study.results.map((res, index) => (
                        <li key={index} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white font-medium">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technologies footer */}
              <div className="border-t border-border/10 pt-6 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Database className="w-4 h-4 text-primary" /> Integrated Technologies:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {study.tech.map((t, index) => (
                    <Badge key={index} className="bg-white/5 border border-white/10 text-muted-foreground text-xs hover:bg-white/10 px-2.5 py-0.5 rounded">
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
        <div className="glassmorphism-card rounded-3xl py-16 px-6 md:px-12 text-center flex flex-col gap-6 items-center">
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs">
            Secure Prototyping
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Let's Design Your Secure Proof-of-Concept</h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg leading-relaxed">
            Unsure of LLM hallucinations or vector storage setups? We build secure, sandbox environments loaded with your private data to illustrate functionality before committing to heavy scaling costs.
          </p>
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 group">
            <Link href="/contact" className="flex items-center gap-1.5">
              Consult a Solutions Architect <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
