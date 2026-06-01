"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, BookOpen, Clock, Calendar, ArrowRight, Sparkles, 
  ChevronRight, BrainCircuit, HeartPulse, Building2, ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const articles = [
  {
    title: "What is RAG (Retrieval-Augmented Generation)?",
    category: "AI Architecture",
    date: "May 28, 2026",
    readTime: "6 min read",
    desc: "A deep dive into how semantic search databases connect Large Language Models to private corporate files safely, bypassing model hallucinations and third-party data leaks.",
    excerpt: "RAG has emerged as the definitive bridge between general generative knowledge and private, siloed corporate intelligence. In this breakdown, we analyze embedding chunking, vector indexing, and citation systems.",
    icon: BrainCircuit,
    featured: true,
    slug: "what-is-rag"
  },
  {
    title: "AI Agents vs Chatbots: Understanding Autonomy Levels",
    category: "Workflow Automation",
    date: "May 20, 2026",
    readTime: "5 min read",
    desc: "Discover why standard chat interfaces are fading, replaced by autonomous agents utilizing tools, loops, self-correction, and multiple supervisor models.",
    icon: Sparkles,
    featured: false,
    slug: "ai-agents-vs-chatbots"
  },
  {
    title: "HIPAA-Compliant AI in Modern Healthcare",
    category: "Healthcare Compliance",
    date: "May 12, 2026",
    readTime: "4 min read",
    desc: "How hospital systems are deploying ambient clinical transcription recorders and diagnostic support networks completely inside private, audit-ready VPC subnets.",
    icon: HeartPulse,
    featured: false,
    slug: "hipaa-compliant-ai-healthcare"
  },
  {
    title: "The Future of Generative AI: On-Premises & Edge Inference",
    category: "Infrastructure",
    date: "May 04, 2026",
    readTime: "7 min read",
    desc: "Model pricing is dropping, but private hardware custody is rising. Why enterprise leaders are investing in private local GPU cloud configurations.",
    icon: Building2,
    featured: false,
    slug: "future-of-genai-on-premise"
  },
  {
    title: "Top AI Automation Trends for Mid-Market Enterprises",
    category: "Enterprise Strategy",
    date: "April 26, 2026",
    readTime: "5 min read",
    desc: "Reconciling invoices, auto-updating CRMs, and compiling regulatory portfolios: where the highest ROI lies in 2026 for automated workflows.",
    icon: ShieldCheck,
    featured: false,
    slug: "ai-automation-trends-enterprise"
  }
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const filteredArticles = articles.filter(
    (art) =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPost = filteredArticles.find((art) => art.featured);
  const regularPosts = filteredArticles.filter((art) => !art.featured || searchQuery !== "");

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
            Indusnet AI Insights
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Latest Technical & Strategic <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Insights</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          We write exhaustive, detailed technical reviews and corporate roadmaps mapping out the realities of enterprise AI deployments.
        </motion.p>
      </section>

      {/* 2. SEARCH & FILTER BLOCK */}
      <section className="container mx-auto px-4 md:px-6 max-w-2xl flex justify-center">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles by topic, title, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-white/5 border-border/40 focus-visible:ring-primary/60 pl-11 text-xs"
          />
        </div>
      </section>

      {/* 3. FEATURED POST showcase */}
      {featuredPost && searchQuery === "" && (
        <section className="container mx-auto px-4 md:px-6 max-w-5xl">
          <Card className="glassmorphism-card border-none text-left overflow-hidden relative">
            <CardContent className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image / Icon Visual */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-56 h-56 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center gap-4 text-center p-6 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl" />
                  <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
                    <featuredPost.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{featuredPost.category}</span>
                  <span className="text-xs text-white font-medium">Flagship Research</span>
                </div>
              </div>

              {/* Summary Text */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                  </span>
                  <Badge className="bg-primary/15 text-primary border border-primary/20 text-[10px] rounded px-2">
                    {featuredPost.category}
                  </Badge>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight hover:text-primary transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <Button asChild className="w-fit rounded-full bg-gradient-to-r from-primary to-accent text-white mt-2 group">
                  <Link href={`/blog/${featuredPost.slug}`} className="flex items-center gap-1.5 text-xs font-semibold">
                    Read Full Article <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 4. POSTS GRID */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularPosts.map((art, idx) => (
            <Card key={idx} className="glassmorphism-card border-none text-left flex flex-col justify-between group">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {art.readTime}
                    </span>
                  </div>

                  <Badge className="bg-white/5 border border-white/10 text-muted-foreground text-[10px] w-fit px-2 py-0.5 rounded">
                    {art.category}
                  </Badge>

                  <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors leading-snug">
                    <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {art.desc}
                  </p>
                </div>

                <Link href={`/blog/${art.slug}`} className="text-xs font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1 pt-2 mt-auto">
                  Read Article <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}

          {filteredArticles.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col gap-4">
              <p className="text-muted-foreground text-sm">No articles matched your search query. Try another term!</p>
              <Button onClick={() => setSearchQuery("")} className="w-fit mx-auto rounded-full bg-white/5 border border-border/40 text-xs">
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 5. NEWSLETTER CTA */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="glassmorphism-card rounded-3xl py-12 px-6 md:px-12 text-center flex flex-col gap-6 items-center">
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs">
            Join 4,000+ Subscribers
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Subscribe to AI Insights</h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg leading-relaxed">
            Receive our exhaustive monthly briefings compiling deployment diagrams, open-source model ratings, and CPMAI course updates.
          </p>
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300">
            <a href="#subscribe-footer" className="flex items-center gap-1.5">
              Subscribe Now <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
