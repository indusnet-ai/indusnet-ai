"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, Cpu, Bot, Search, Zap, Eye, BarChart3, Users, 
  ShieldCheck, Check, Sparkles, Star, ChevronRight, Activity, ShoppingCart, 
  Building2, Landmark, GraduationCap, Truck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Trusted Technologies Array
const techLogos = [
  { name: "OpenAI", icon: Sparkles },
  { name: "LangChain", icon: Cpu },
  { name: "Azure AI", icon: ShieldCheck },
  { name: "AWS", icon: Zap },
  { name: "Python", icon: Bot },
  { name: "Supabase", icon: Search },
  { name: "Vector DB", icon: Eye },
  { name: "Next.js", icon: BarChart3 }
];

// Services Array
const services = [
  {
    title: "AI Chatbots & Assistants",
    description: "Multi-channel generative customer service agents resolving up to 80% of support queries autonomously.",
    icon: Bot,
    badge: "Enterprise Ready",
    href: "/services"
  },
  {
    title: "Enterprise RAG Solutions",
    description: "Intelligent cognitive search connecting LLMs to your private SharePoint, Notion, or custom databases securely.",
    icon: Search,
    badge: "Highly Popular",
    href: "/services"
  },
  {
    title: "Autonomous AI Agents",
    description: "Self-correcting agentic workflows executing complex multi-step digital operations across multiple APIs.",
    icon: Zap,
    badge: "Next-Gen AI",
    href: "/services"
  },
  {
    title: "AI Workflow Automation",
    description: "Streamline back-office bottlenecks, document processing, and reporting with customized LLM intelligence.",
    icon: Cpu,
    badge: "Maximize ROI",
    href: "/services"
  },
  {
    title: "Computer Vision",
    description: "Deep learning models for high-speed object recognition, defect detection, and surveillance video analysis.",
    icon: Eye,
    badge: "Deep Learning",
    href: "/services"
  },
  {
    title: "Predictive Analytics",
    description: "Custom machine learning models forecasting demand, supply chain anomalies, and customer churn trends.",
    icon: BarChart3,
    badge: "Big Data",
    href: "/services"
  },
  {
    title: "Technical AI Consulting",
    description: "Strategic roadmapping, hardware sizing, model alignment, security audits, and ROI evaluations.",
    icon: Users,
    badge: "Advisory",
    href: "/services"
  },
  {
    title: "Corporate AI Training",
    description: "Certified developer bootcamps, executive GenAI masterclasses, and certified CPMAI training programs.",
    icon: GraduationCap,
    badge: "Certified",
    href: "/training"
  }
];

// Industries Array
const industries = [
  { name: "Healthcare", desc: "Diagnostic support models, HIPAA-compliant patient triage bots, and automated medical record summarization.", icon: Activity, href: "/industries" },
  { name: "Retail & E-commerce", desc: "Dynamic pricing optimization engines, personal shopper AI agents, and hyper-personalized recommendations.", icon: ShoppingCart, href: "/industries" },
  { name: "Manufacturing", desc: "Predictive maintenance schedules, automated visual quality inspection, and supply chain logistics AI.", icon: Building2, href: "/industries" },
  { name: "Banking & Finance", desc: "AML anomaly detection, automated financial underwriting bots, and private secure quantitative market models.", icon: Landmark, href: "/industries" },
  { name: "Education & EdTech", desc: "Interactive customized tutoring systems, AI grading assistants, and dynamic curriculum generation.", icon: GraduationCap, href: "/industries" },
  { name: "Logistics & Transport", desc: "Intelligent route optimization, autonomous drone dispatching, and dynamic warehouse demand forecasting.", icon: Truck, href: "/industries" }
];

// Case Studies
const caseStudies = [
  {
    title: "Enterprise RAG Engine for Global Finance",
    desc: "Connected 100k+ private regulatory documents to a secure Llama-3 system, slicing document search times by 91%.",
    metric: "91% Faster Research",
    tag: "Finance",
    tech: ["Llama-3", "Qdrant", "Azure", "LangChain"]
  },
  {
    title: "Autonomous Agent Workflow for Retail Logistics",
    desc: "Replaced manual invoice clearing with autonomous AI agents that reconcile shipment logs and flag anomalies.",
    metric: "84% Lower Processing Cost",
    tag: "Logistics",
    tech: ["GPT-4o", "Supabase", "FastAPI", "Python"]
  },
  {
    title: "Clinical Triage AI Assistant",
    desc: "Created a HIPAA-compliant medical intake assistant guiding patient routing and providing physician summaries.",
    metric: "98% Triage Accuracy",
    tag: "Healthcare",
    tech: ["Med-PaLM", "Next.js", "Tailwind", "Python"]
  }
];

// Testimonials
const testimonials = [
  {
    quote: "Indusnet AI delivered a secure RAG database solution that completely changed how our analysts research compliance files. Speed is incredible, and security is flawless.",
    author: "Dr. Rajesh Mukhopadhyay",
    role: "VP of Digital Innovation",
    company: "Metro Financial Group",
    rating: 5
  },
  {
    quote: "Their Corporate GenAI Developer Bootcamp trained 40 of our core engineers. Three weeks later, they shipped an internal code-generation copilot that saves 6 hours per dev weekly.",
    author: "Sarah Jenkins",
    role: "Chief Technology Officer",
    company: "OmniTech Solutions",
    rating: 5
  },
  {
    quote: "We hired them to consult on our visual quality inspection system. The computer vision model they designed reduced our manufacturing defect escape rate from 2.4% to less than 0.1%.",
    author: "Kenji Sato",
    role: "Director of Operations",
    company: "Sato Heavy Industries",
    rating: 5
  }
];

export default function Home() {
  return (
    <div className="flex flex-col gap-24 md:gap-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-32 overflow-hidden bg-grid-pattern">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 -z-10 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-accent/10 blur-[100px]" />

        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Enterprise AI Systems
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-heading"
            >
              Transforming Businesses with <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">AI & Automation</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-xl leading-relaxed"
            >
              Bespoke AI solutions, high-performance RAG knowledge systems, autonomous agent workflows, strategic consulting, and certified corporate AI training.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all duration-300 group">
                <Link href="/contact" className="flex items-center gap-2">
                  Book Consultation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-border/60 hover:bg-white/5 transition-all text-muted-foreground hover:text-white">
                <Link href="/services">Explore Services</Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Visual Block */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full flex items-center justify-center border border-primary/20 bg-primary/5 backdrop-blur-2xl shadow-[0_0_50px_rgba(124,58,237,0.15)] group"
            >
              {/* Rotating Outer Rings */}
              <div className="absolute inset-0 rounded-full border border-dashed border-accent/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-primary/20 animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute inset-10 rounded-full border border-border/40 animate-[spin_20s_linear_infinite]" />

              {/* Central Premium Glass Chip */}
              <div className="absolute w-40 h-40 rounded-3xl bg-gradient-to-br from-white/10 to-white/0 border border-white/15 backdrop-blur-xl flex flex-col items-center justify-center gap-4 shadow-2xl p-6 group-hover:border-primary/40 transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-bold">Indusnet Engine</p>
                  <p className="text-xs text-white font-medium mt-1">Active Inference</p>
                </div>
              </div>

              {/* Floating Orbiting Info Cards */}
              <div className="absolute -top-4 -right-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl animate-[bounce_5s_infinite_ease-in-out] max-w-[140px]">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">RAG Search</p>
                <p className="text-xs text-white font-semibold mt-1">98.4% Acc.</p>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl animate-[bounce_6s_infinite_ease-in-out_1s] max-w-[140px]">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">AI Agents</p>
                <p className="text-xs text-white font-semibold mt-1">Active Tasks</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED TECHNOLOGIES SECTION */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="glassmorphism-card rounded-3xl py-10 px-8 flex flex-col gap-8 items-center text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            Built using industry-leading AI models & architectures
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-center w-full">
            {techLogos.map((tech, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-border/40 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300">
                  <tech.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground/80 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="container mx-auto px-4 md:px-6 flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <Badge className="bg-primary/10 border-primary/20 text-primary w-fit mx-auto px-3 py-1 text-xs rounded-full">
            Enterprise Solutions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Bespoke <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Offerings</span> Built to Scale
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            From proof-of-concepts to heavy production-grade workloads, we engineer the intelligence your business needs to stay ahead.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => (
            <Card key={idx} className="glassmorphism-card border-none flex flex-col h-full text-left">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <srv.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="bg-white/5 border-white/10 text-muted-foreground text-[10px] w-fit font-semibold px-2 py-0.5 rounded">
                    {srv.badge}
                  </Badge>
                  <h3 className="font-bold text-lg text-white leading-snug">{srv.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{srv.description}</p>
                </div>
                <Link href={srv.href} className="text-xs font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1.5 mt-auto pt-2">
                  Learn More <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. INDUSTRIES SECTION */}
      <section className="container mx-auto px-4 md:px-6 flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <Badge className="bg-accent/10 border-accent/20 text-accent w-fit mx-auto px-3 py-1 text-xs rounded-full">
            Tailored Industry Expertise
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            AI Solutions Crafted for <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Your Sector</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            General models fail to solve complex sector workflows. We design custom models tailored to your industry constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => (
            <Card key={idx} className="glassmorphism-card border-none text-left">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <ind.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-base text-white">{ind.name}</h3>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{ind.desc}</p>
                <Link href={ind.href} className="text-xs font-semibold text-accent hover:text-white transition-colors flex items-center gap-1 mt-2">
                  View Solutions <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. PORTFOLIO PREVIEW */}
      <section className="container mx-auto px-4 md:px-6 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="text-left max-w-2xl flex flex-col gap-3">
            <Badge className="bg-primary/10 border-primary/20 text-primary w-fit px-3 py-1 text-xs rounded-full">
              Case Studies
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Real Impact. <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Proven Results.</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Explore how we help modern enterprises automate operations, reduce costs, and leverage proprietary intellectual property.
            </p>
          </div>
          <Button asChild className="rounded-full border-border/60 hover:bg-white/5 text-muted-foreground hover:text-white" variant="outline">
            <Link href="/portfolio" className="flex items-center gap-1.5">
              View All Case Studies <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {caseStudies.map((study, idx) => (
            <Card key={idx} className="glassmorphism-card border-none flex flex-col text-left group">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 border-primary/20 text-primary rounded px-2.5 py-0.5 text-[10px]">
                      {study.tag}
                    </Badge>
                    <span className="text-xs font-semibold text-emerald-400">{study.metric}</span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors leading-snug">
                    {study.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {study.desc}
                  </p>
                </div>
                <div className="flex flex-col gap-4 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {study.tech.map((t, index) => (
                      <span key={index} className="text-[10px] text-muted-foreground/80 bg-white/5 border border-white/5 rounded px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="container mx-auto px-4 md:px-6 flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <Badge className="bg-primary/10 border-primary/20 text-primary w-fit mx-auto px-3 py-1 text-xs rounded-full">
            Client Success
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            What <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Enterprise Leaders</span> Say
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Trusted by chief innovation officers, technology leads, and directors across sectors worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <Card key={idx} className="glassmorphism-card border-none text-left flex flex-col justify-between p-6 gap-6">
              <div className="flex flex-col gap-4">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-xs italic leading-relaxed">
                  "{test.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                  {test.author[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{test.author}</h4>
                  <p className="text-[10px] text-muted-foreground">{test.role}, <span className="text-primary">{test.company}</span></p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-3xl overflow-hidden glassmorphism-card border-none py-20 px-8 md:px-16 text-center flex flex-col gap-8 items-center max-w-5xl mx-auto">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 -z-10 w-80 h-80 rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 rounded-full bg-accent/10 blur-[80px]" />

          <Badge className="bg-primary/10 border-primary/20 text-primary px-3 py-1 text-xs rounded-full">
            Accelerate Growth
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl font-heading leading-tight">
            Ready to Build Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Enterprise AI Roadmap?</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl leading-relaxed">
            Let's sit down for a custom engineering consultation. We'll analyze your current workflows, private data architecture, and potential ROI.
          </p>
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300">
              <Link href="/contact" className="flex items-center gap-2">
                Book Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-border/60 hover:bg-white/5 transition-all text-muted-foreground hover:text-white">
              <Link href="/training">View Training Bootcamps</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
