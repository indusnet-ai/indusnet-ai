"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, Sparkles, Check, ArrowRight, HelpCircle, ChevronDown, 
  Landmark, GraduationCap, Activity, ArrowDown, Building, 
  FileText, Send, Clock, Play, AlertTriangle, Lightbulb, TrendingUp 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// FAQs Specific to 3-2-1 GO
const faqs = [
  {
    question: "What is the Catalyst Assessment Framework?",
    answer: "The Catalyst Assessment Framework is our proprietary methodology for rapid AI use case prioritization and discovery. It analyzes your business context, existing data models, and workflows to output a prioritized portfolio of opportunities, compressing months of traditional consulting discovery into just 48 hours."
  },
  {
    question: "How long does it take to go from use case selection to a deployed MVP?",
    answer: "With our Forward Deployed Engineering (FDE) model, the entire path runs in exactly four weeks. This includes the initial discovery, selecting three candidate use cases, building two working prototypes in days, and shipping the final selected MVP directly to your users."
  },
  {
    question: "What makes 3-2-1 GO different from other consultancies?",
    answer: "Traditional consultancies charge you six figures just to deliver a PDF report of recommendations. We deliver working software in your actual environment. By week two, your stakeholders are testing working prototypes built in days. You see concrete evidence and code before committing to a full production build."
  },
  {
    question: "What is the compounding 'Flywheel Effect' of the platform?",
    answer: "Every AI use case we build for your company utilizes reusable patterns (data pipelines, semantic index layers, agent routing rules) from our code accelerators library. This means that each subsequent usecase is significantly cheaper, faster, and easier to build, creating a compounding value cycle."
  }
];

// Timeline Weeks
const timelineWeeks = [
  {
    week: "01",
    title: "Discover",
    desc: "Our Catalyst engineer runs the Assessment Framework against your organization's data context, technical footprint, and competitive landscape. We output a prioritized portfolio of use cases in 48 hours."
  },
  {
    week: "02",
    title: "Refine",
    desc: "We validate and refine candidates with your stakeholders. Effort, business value, and urgency metrics are established. You select the top three to advance."
  },
  {
    week: "03",
    title: "Prototype",
    desc: "Our engineers build two functional prototypes in your actual environment. Each prototype ships in 1-2 days, providing concrete evidence before any major production commit."
  },
  {
    week: "04",
    title: "Deploy",
    desc: "The winning prototype is built to full production grade and deployed to your users. KPIs are tracked, metrics are calculated, and ownership is handed off cleanly to your IT team."
  }
];

// Customer Stories
const stories = [
  {
    tag: "Life Sciences",
    title: "Clinical Trial EDC Automation",
    metric: "20 days to 2 days",
    desc: "Replaced five complex manual spreadsheet macros and multiple handoffs with a guided, secure web application that automated paper protocol conversions. Cut operational startup delay by 90%."
  },
  {
    tag: "Education",
    title: "K-12 Engagement Platform",
    metric: "200k+ Active Users",
    desc: "Deployed assignment recommendation engines, engagement retrospectives, and automated routing flows across departments, all within a single 4-week engagement."
  },
  {
    tag: "Sales Intelligence",
    title: "Conversation Analytics Tool",
    metric: "3.5 Days to Prototype",
    desc: "Built a working prototype in under 4 days that extracts sales conversation text to pinpoint booking objections, transfer triggers, and drop-off points."
  },
  {
    tag: "Industrial",
    title: "Automated P&ID Data Extraction",
    metric: "25% Cost Reduction",
    desc: "Created a visual AI framework to extract and classify engineering specs from complex piping and instrumentation diagrams, raising defect review accuracy to 99.4%."
  }
];

export default function AiInProductionPage() {
  const formRef = React.useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{ success?: boolean; message?: string } | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setSubmitStatus({ success: false, message: "Name and Email are required fields." });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          service: "3-2-1 GO AI Scoping Request",
          message: message || "Requesting a Catalyst Assessment scoping demo."
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitStatus({ success: true, message: "Success! Your request has been received. Our Catalyst engineer will contact you shortly." });
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
      } else {
        setSubmitStatus({ success: false, message: data.error || "Something went wrong. Please try again." });
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-24 md:gap-32 pt-32 pb-24">
      {/* 1. HERO HEADER */}
      <section className="container mx-auto px-4 md:px-6 relative overflow-hidden text-center max-w-5xl flex flex-col gap-6 items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-accent/15 border-accent/20 text-accent rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider">
            3-2-1 GO Program
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-heading max-w-3xl"
        >
          AI in Production. <br/>
          <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">Four Weeks.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl"
        >
          **3** refined use cases. **2** functional prototypes. **1** production MVP deployed. <br/>
          De-risk your enterprise AI roadmap with forward deployed engineering and guaranteed outcomes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 justify-center pt-2"
        >
          <Button onClick={scrollToForm} size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300">
            Discover Your AI Use Cases <ArrowDown className="ml-2 w-4 h-4" />
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-border/60 hover:bg-white/5 text-muted-foreground hover:text-white">
            <Link href="/services/generative-ai">Explore GenAI Services</Link>
          </Button>
        </motion.div>

        {/* 4-column Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-heading">3.5 Days</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1 text-center">First Prototype</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading">95x</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1 text-center">Max Documented ROI</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-heading">4 Wks</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1 text-center">Kickoff to MVP</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-accent font-heading">$16M</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1 text-center">LTV Unlocked</span>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-12">
          <Badge className="bg-destructive/10 border-destructive/20 text-destructive-foreground w-fit mx-auto px-3 py-1 text-xs rounded-full font-semibold">
            What is Broken
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Deploying AI is Easy. Adoption is Hard.
          </h2>
          <p className="text-muted-foreground text-sm">
            Most enterprise AI initiatives stall before reaching production. Legacy models, fragmented data, and slow prioritization processes create execution bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glassmorphism-card border-none text-left">
            <CardContent className="p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
              </div>
              <h3 className="font-bold text-base text-white">Tools ≠ Transformation</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Handing employees a generic chatbot doesn't change how workflows happen. Real value requires custom integrations into actual operating platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism-card border-none text-left">
            <CardContent className="p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-destructive-foreground" />
              </div>
              <h3 className="font-bold text-base text-white">One Bet at a Time</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Most organizations commit to single, massive projects based on guesswork. If they pick the wrong use case, months of development are completely wasted.
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism-card border-none text-left">
            <CardContent className="p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-destructive-foreground" />
              </div>
              <h3 className="font-bold text-base text-white">Shadow IT Sprawl</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Employees use ungoverned external tools when IT lacks a unified, secure platform, posing severe compliance, data privacy, and legal risks.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. HOW WE FIX IT: 3-2-1 GO */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-12">
          <Badge className="bg-primary/10 border-primary/20 text-primary w-fit mx-auto px-3 py-1 text-xs rounded-full font-semibold">
            How We Fix It
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            3-2-1 GO: Forward Deployed Engineering
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            We embed a specialized engineering team directly in your environment, utilizing pre-built accelerators to deliver functional code rapidly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4 text-left p-6 bg-white/[0.01] border border-white/5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 select-none leading-none">3</div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Step One</span>
            <h3 className="text-xl font-extrabold text-white">3 Refined Use Cases</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              We analyze your actual workflows using our Catalyst Assessment Framework to discover, score, and prioritize the top three highest-value opportunities.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-left p-6 bg-white/[0.01] border border-white/5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 select-none leading-none">2</div>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Step Two</span>
            <h3 className="text-xl font-extrabold text-white">2 Functional Prototypes</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              We build two working prototypes in days inside your environment. Stakeholders get real, interactive software to evaluate before making any big decisions.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-left p-6 bg-white/[0.01] border border-white/5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 select-none leading-none">1</div>
            <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Step Three</span>
            <h3 className="text-xl font-extrabold text-white">1 MVP Deployed</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              The winning prototype with the strongest business ROI is optimized, hardened, and deployed directly to your users with verified telemetry tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE TIMELINE (WEEK-BY-WEEK) */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <Badge className="bg-primary/10 border-primary/20 text-primary w-fit mx-auto px-3 py-1 text-xs rounded-full font-semibold">
            Execution Roadmap
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight font-heading">
            Kickoff to Deployed MVP in 4 Weeks
          </h2>
        </div>

        <div className="relative border-l border-white/10 pl-6 ml-4 flex flex-col gap-12 text-left">
          {timelineWeeks.map((tw, idx) => (
            <div key={idx} className="relative group">
              {/* Bullet icon */}
              <div className="absolute -left-10 top-0.5 w-7 h-7 rounded-full bg-background border border-primary/40 flex items-center justify-center group-hover:border-primary transition-colors text-[10px] font-bold text-primary">
                {tw.week}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{tw.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
                  {tw.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CUSTOMER STORIES */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 w-fit mx-auto px-3 py-1 text-xs rounded-full font-semibold">
            FDE in Action
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Guaranteed Outcomes in Practice
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, idx) => (
            <Card key={idx} className="glassmorphism-card border-none text-left">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 border-primary/20 text-primary px-2.5 py-0.5 text-[10px]">
                      {story.tag}
                    </Badge>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5"/> {story.metric}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white leading-snug">{story.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{story.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. FAQs SECTION */}
      <section className="container mx-auto px-4 md:px-6 max-w-3xl flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <Badge className="bg-accent/10 border-accent/20 text-accent w-fit mx-auto px-3 py-1 text-xs rounded-full font-semibold">
            FAQs
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight font-heading">
            Got 3-2-1 GO Questions?
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className="glassmorphism-card border-none rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 text-white hover:text-primary transition-colors font-bold text-sm sm:text-base"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. SCOPINGDemo FORM */}
      <section ref={formRef} className="container mx-auto px-4 md:px-6 max-w-2xl">
        <Card className="glassmorphism-card border-none p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 -z-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 -z-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-pulse" />
          
          <CardContent className="p-0 flex flex-col gap-6 text-left">
            <div className="flex flex-col gap-2">
              <Badge className="bg-accent/15 border-accent/20 text-accent w-fit px-3 py-0.5 text-[10px] rounded font-bold uppercase tracking-wider">
                Catalyst Intake
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Request a Scoping Demo
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Describe your business operations, and we will run our Catalyst Assessment Framework to identify your top AI use cases before you commit to anything.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/90">Contact Name *</label>
                  <Input 
                    type="text" 
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border-white/10 hover:border-white/20 focus:border-primary text-white rounded-xl placeholder:text-muted-foreground/60"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/90">Work Email *</label>
                  <Input 
                    type="email" 
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 hover:border-white/20 focus:border-primary text-white rounded-xl placeholder:text-muted-foreground/60"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Company / Organization</label>
                <Input 
                  type="text" 
                  placeholder="Enter company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-white/5 border-white/10 hover:border-white/20 focus:border-primary text-white rounded-xl placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Describe Your Operations & Data Stack</label>
                <Textarea 
                  placeholder="Briefly detail what data platforms (e.g. Snowflake, AWS, Databricks) you run, and where your primary workflow bottlenecks are."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/5 border-white/10 hover:border-white/20 focus:border-primary text-white rounded-xl resize-none placeholder:text-muted-foreground/60 text-xs sm:text-sm"
                />
              </div>

              {submitStatus && (
                <div className={`p-4 rounded-xl text-xs font-medium border ${submitStatus.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-destructive/10 border-destructive/20 text-destructive-foreground"}`}>
                  {submitStatus.message}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full sm:w-fit rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 shadow-lg mt-2 ml-auto"
              >
                {submitting ? "Submitting..." : "Submit Scoping Request"} <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
