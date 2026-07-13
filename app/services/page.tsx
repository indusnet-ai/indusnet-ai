"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, Search, Zap, Cpu, Eye, BarChart3, Users, GraduationCap, Sparkles, 
  Check, ArrowRight, Server, Shield, BrainCircuit 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "core", name: "Enterprise Core AI" },
  { id: "data", name: "Analytics & Vision" },
  { id: "strategy", name: "Consulting & Training" }
];

const serviceDetails = [
  // 1. AI Chatbots
  {
    id: "chatbot",
    category: "core",
    title: "AI Chatbot Development",
    desc: "Deploy highly custom, multi-channel conversational agents that resolve customer or employee inquiries with human-grade empathy and accuracy.",
    icon: Bot,
    features: [
      "Natural Language understanding with custom prompt engineering",
      "Direct API integrations with Zendesk, Salesforce, and internal CRMs",
      "Deterministic safety rails guarding against offensive outputs",
      "Seamless human-in-the-loop transition triggers"
    ],
    benefits: [
      "Up to 80% automated resolution of primary support tickets",
      "24/7/365 availability across Web, WhatsApp, and Slack",
      "Instantaneous, latency-optimized sub-second responses"
    ],
    tech: ["GPT-4o", "Claude 3.5 Sonnet", "LangChain", "Node.js"]
  },
  // 2. RAG Solutions
  {
    id: "rag",
    category: "core",
    title: "Enterprise RAG Solutions",
    desc: "Connect LLMs directly to your private data corpus without risk of hallucinations or third-party leakage. Search SharePoint, Notion, or custom SQL databases semantically.",
    icon: Search,
    features: [
      "Hybrid vector + keyword search index configurations",
      "Hierarchical chunking strategies for dense technical specs",
      "Strict Active Directory and RBAC role-based document access",
      "Source citation links attached to every generated response"
    ],
    benefits: [
      "Eliminate time spent manually searching massive compliance files",
      "100% private data hosting (VPC, private subnet, or on-prem)",
      "Drastic reduction in information research times (90%+)"
    ],
    tech: ["Qdrant", "pgvector", "LlamaIndex", "Azure AI Search"]
  },
  // 3. AI Agents
  {
    id: "agents",
    category: "core",
    title: "Autonomous AI Agents",
    desc: "Build self-correcting agentic workflows capable of using digital tools, calling external APIs, handling loops, and reconciling execution errors without manual intervention.",
    icon: Zap,
    features: [
      "Multi-agent collaborative networks using supervisor models",
      "Interactive tools for browser automation, database writes, and emails",
      "Self-reflection and evaluation loops validating output quality",
      "State preservation and audit logs for debugging agent steps"
    ],
    benefits: [
      "Fully automate end-to-end accounting or logistics workflows",
      "Scale operations without adding redundant administrative personnel",
      "Detect and resolve process errors proactively in real time"
    ],
    tech: ["LangGraph", "CrewAI", "Python", "Supabase"]
  },
  // 4. Generative AI Applications
  {
    id: "genai",
    category: "core",
    title: "Generative AI Applications",
    desc: "Custom-built marketing copy generators, legal document drafting copilots, product image background replacers, and automated audio transcription systems.",
    icon: BrainCircuit,
    features: [
      "Custom UI/UX designed specifically for content workflows",
      "Fine-tuned niche models capturing brand voice and style",
      "Image manipulation using Stable Diffusion and ControlNet",
      "High-speed whisper audio processing pipelines"
    ],
    benefits: [
      "10x increase in weekly marketing material output",
      "Streamlined legal drafting lowering legal counsel billable hours",
      "Standardize tone and branding guidelines across the globe"
    ],
    tech: ["Stable Diffusion", "Whisper", "Next.js", "AWS Bedrock"]
  },
  // 5. Computer Vision
  {
    id: "vision",
    category: "data",
    title: "Computer Vision Systems",
    desc: "Deep learning models executing high-speed object tracking, visual defect detection on factory conveyor belts, and security surveillance analytics.",
    icon: Eye,
    features: [
      "Real-time object detection and classification models",
      "Defect segmentation down to sub-millimeter precision",
      "Edge-computing compatible deployment models (NVIDIA Jetson)",
      "Multi-camera CCTV analysis stream processing"
    ],
    benefits: [
      "Automate factory quality control checks with zero human fatigue",
      "Reduce defective inventory escaping production to under 0.1%",
      "Enhance high-security premise monitoring with automated alarms"
    ],
    tech: ["YOLOv8", "PyTorch", "OpenCV", "Docker"]
  },
  // 6. Predictive Analytics
  {
    id: "analytics",
    category: "data",
    title: "Predictive Analytics",
    desc: "Harness historical enterprise data to forecast inventory requirements, detect fraudulent payment profiles, and identify customers high at risk of churning.",
    icon: BarChart3,
    features: [
      "Time-series forecasting models adapting to seasonal demand",
      "Anomaly detection engines analyzing merchant transactional data",
      "User behavior analysis modeling retention triggers",
      "Interactive executive dashboards built in web platforms"
    ],
    benefits: [
      "Prevent costly stockouts and warehouse storage fees",
      "Instantly block fraudulent transactions before clearance occurs",
      "Target active churn risks with automated customer retention plays"
    ],
    tech: ["XGBoost", "Scikit-Learn", "FastAPI", "PostgreSQL"]
  },
  // 7. AI Automation
  {
    id: "automation",
    category: "data",
    title: "AI Workflow Automation",
    desc: "Construct highly visual intelligent automation nodes integrating OCR invoice scanners, document categorizers, and email draft automation.",
    icon: Cpu,
    features: [
      "Multimodal OCR document data extraction pipelines",
      "Trigger logic connecting Slack, Gmail, Hubspot, and databases",
      "Low-code automation nodes configured for business admins",
      "Automated PDF report generators compiling weekly progress"
    ],
    benefits: [
      "Cut down manual document copy-pasting times by 95%",
      "Instantly process incoming invoices and route approval requests",
      "Ensure clean, structured, and error-free CRM updating"
    ],
    tech: ["n8n", "Tesseract OCR", "Python", "FastAPI"]
  },
  // 8. AI Consulting
  {
    id: "consulting",
    category: "strategy",
    title: "Technical AI Consulting",
    desc: "Formulate your technical AI roadmap. We evaluate security policies, hardware dependencies, cost-to-benefit metrics, and cloud requirements.",
    icon: Users,
    features: [
      "Comprehensive AI feasibility audits of current IT software",
      "Model sizing advisory: Open-source local vs closed APIs",
      "GDPR, HIPAA, and security risk compliance frameworks",
      "Detailed ROI spreadsheets calculating projected savings"
    ],
    benefits: [
      "Avoid expensive model subscription fees and useless projects",
      "Ensure absolute compliance with federal data privacy regulations",
      "Equip executive leadership with clean, data-backed decisions"
    ],
    tech: ["CPMAI Framework", "Infrastructure Auditing", "ROI Mapping"]
  },
  // 9. Corporate AI Training
  {
    id: "training",
    category: "strategy",
    title: "Corporate AI Training",
    desc: "Upgrade your team's skills with certified developer workshops, prompt engineering masterclasses, and certified CPMAI methodology implementation.",
    icon: GraduationCap,
    features: [
      "Custom curricula tailored to your company's technology stack",
      "Hands-on coding labs building internal tools",
      "Executive alignment seminars focusing on AI governance",
      "Facilitator-led CPMAI certification prep sessions"
    ],
    benefits: [
      "Empower internal developers to build and maintain AI in-house",
      "Raise employee alignment and lower adoption resistance",
      "Establish active AI safety governance inside the enterprise"
    ],
    tech: ["Developer Bootcamps", "Prompt Engineering", "CPMAI Prep"]
  }
];

export default function ServicesPage() {
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
            Detailed Service Catalog
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Explore Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI & Engineering Capabilities</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          Whether you need advisory, prototyping, custom engineering, or full-scale organizational training, we deliver deterministic outcomes.
        </motion.p>
      </section>

      {/* FEATURED: GENERATIVE AI SERVICES */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent backdrop-blur-xl">
            <div className="absolute top-0 right-0 -z-10 w-60 h-60 rounded-full bg-primary/10 blur-[80px]" />
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/25 text-primary border-primary/30 text-xs">Featured Services</Badge>
                  <span className="text-xs font-semibold text-accent flex items-center gap-1"><Sparkles className="w-3 h-3"/> Free Workshop Scoping</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Generative AI Services & LLM Deployments</h3>
                <p className="text-muted-foreground text-xs sm:text-sm max-w-xl leading-relaxed">
                  Design roadmap workshops, private RAG installations, custom agent pipelines, and local model training. Move securely from sandbox validation to high-volume production.
                </p>
              </div>
              <Button asChild className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 shrink-0">
                <Link href="/services/generative-ai" className="flex items-center gap-1.5">
                  Explore GenAI <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* 2. TABBED SERVICES EXPLORER */}
      <section className="container mx-auto px-4 md:px-6 max-w-6xl">
        <Tabs defaultValue="core" className="w-full flex flex-col items-center gap-12">
          <TabsList className="bg-white/5 border border-white/10 rounded-full p-1.5 h-auto flex flex-wrap gap-2 max-w-full justify-center">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="rounded-full px-6 py-2.5 text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => {
            const list = serviceDetails.filter((s) => s.category === cat.id);
            return (
              <TabsContent key={cat.id} value={cat.id} className="w-full grid grid-cols-1 gap-10 mt-0">
                {list.map((srv, idx) => (
                  <Card key={idx} className="glassmorphism-card border-none text-left overflow-hidden">
                    <CardContent className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: Summary */}
                      <div className="lg:col-span-5 flex flex-col gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <srv.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                          {srv.title}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {srv.desc}
                        </p>
                        
                        <div className="flex flex-col gap-2 pt-2">
                          <p className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-1.5">
                            <Server className="w-3.5 h-3.5 text-primary" /> Core Tech Stack
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {srv.tech.map((t, index) => (
                              <Badge key={index} className="bg-white/5 border border-white/10 text-muted-foreground text-xs hover:bg-white/10 px-2 py-0.5 rounded">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button asChild className="w-fit rounded-full bg-white/5 border-border/40 hover:bg-white/10 text-muted-foreground hover:text-white mt-2" variant="outline">
                          <Link href="/contact" className="flex items-center gap-1.5 text-xs font-semibold">
                            Request Consultation <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      </div>

                      {/* Right: Detailed lists */}
                      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl p-6">
                        {/* Features Column */}
                        <div className="flex flex-col gap-4">
                          <h3 className="font-bold text-xs uppercase text-primary tracking-wider flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-primary" /> Key Features
                          </h3>
                          <ul className="flex flex-col gap-3">
                            {srv.features.map((feat, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
                                <span className="leading-relaxed">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Benefits Column */}
                        <div className="flex flex-col gap-4">
                          <h3 className="font-bold text-xs uppercase text-accent tracking-wider flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-accent" /> Business Value
                          </h3>
                          <ul className="flex flex-col gap-3">
                            {srv.benefits.map((bene, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 flex-shrink-0" />
                                <span className="leading-relaxed font-medium text-white/90">{bene}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            );
          })}
        </Tabs>
      </section>

      {/* 3. TRUST BANNER */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="glassmorphism-card rounded-3xl p-8 md:p-12 text-center flex flex-col gap-6 items-center">
          <Badge className="bg-accent/10 border-accent/20 text-accent rounded-full px-2.5 py-0.5 text-xs">
            Security & Governance Standard
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Deterministic & Audit-Ready Models</h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-xl leading-relaxed">
            Every custom implementation we deploy includes complete observability dashboards, error-logging databases, model alignment metrics, and strict VPC constraints protecting your company's legal integrity.
          </p>
        </div>
      </section>
    </div>
  );
}
