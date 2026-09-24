"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, MapPin, DollarSign, Clock, Search, 
  ChevronRight, Building, Phone, Mail, ArrowRight, Sparkles, Cpu, Send
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string;
  employment_type: string;
  location: string;
  salary_range: string;
  description: string;
  requirements: string;
  status: string;
}

const staticPositions = [
  {
    title: "Senior Generative AI & RAG Engineer",
    department: "Applied AI Research",
    location: "Chennai / Hybrid",
    employment_type: "Full-Time",
    desc: "Architect VPC-isolated retrieval engines, hybrid vector/lexical pipelines, and custom agentic workflows using Llama-3, LangChain, and Qdrant/Milvus.",
    skills: ["Python", "PyTorch", "LlamaIndex", "Vector DBs", "Azure GPU / AWS"],
  },
  {
    title: "Applied Computer Vision Engineer",
    department: "Edge & Robotics",
    location: "Chennai / On-Site",
    employment_type: "Full-Time",
    desc: "Develop high-FPS defect detection pipelines, TensorRT optimizations, and real-time YOLOv8 object segmentation models deployed on NVIDIA Jetson edge systems.",
    skills: ["YOLOv8", "TensorRT", "NVIDIA Jetson", "OpenCV", "C++ / Python"],
  },
  {
    title: "Full-Stack AI Platform Architect",
    department: "Platform Engineering",
    location: "Chennai / Singapore / Hybrid",
    employment_type: "Full-Time",
    desc: "Design and implement production-grade full-stack cognitive applications, asynchronous LLM streaming interfaces, and secure enterprise SSO auth gateways.",
    skills: ["Next.js 15/16", "TypeScript", "FastAPI", "PostgreSQL", "Docker"],
  },
];

export default function CareersClient() {
  const isStaticMode = process.env.NEXT_PUBLIC_CAREERS_MODE !== "live";

  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(!isStaticMode);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("All");
  const [selectedLoc, setSelectedLoc] = React.useState("All");

  React.useEffect(() => {
    if (isStaticMode) return;

    async function fetchJobs() {
      try {
        const API_URL = "/api/backend";
        const res = await fetch(`${API_URL}/hr/jobs?status=active`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [isStaticMode]);

  const departments = React.useMemo(() => {
    const depts = new Set<string>();
    jobs.forEach(job => depts.add(job.department));
    return ["All", ...Array.from(depts)];
  }, [jobs]);

  const locations = React.useMemo(() => {
    const locs = new Set<string>();
    jobs.forEach(job => locs.add(job.location));
    return ["All", ...Array.from(locs)];
  }, [jobs]);

  const filteredJobs = React.useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.requirements.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === "All" || job.department === selectedDept;
      const matchesLoc = selectedLoc === "All" || job.location === selectedLoc;
      return matchesSearch && matchesDept && matchesLoc;
    });
  }, [jobs, searchTerm, selectedDept, selectedLoc]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-border/40 py-6 px-6 md:px-12 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-all duration-300">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="flex flex-col text-left font-sans leading-none">
                <span className="font-black text-sm tracking-widest text-foreground">INDUSNET</span>
                <span className="font-extrabold text-[15px] tracking-wide text-primary">AI</span>
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild className="rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 shadow-md shadow-primary/20 px-5">
              <Link href="/contact">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 text-center max-w-4xl mx-auto z-10">
        <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] uppercase tracking-wider rounded-full px-3 py-1 mb-6">
          Careers & Opportunities
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-foreground font-heading">
          Join the Future of <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Enterprise AI Solutions</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          At Indusnet AI, we design, deploy, and scale production-grade cognitive automation systems for high-compliance enterprise sectors. Build mission-critical technology with us.
        </p>

        {isStaticMode && (
          <div className="glassmorphism-card border-none rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-4 h-4" /> We're Actively Hiring
              </span>
              <p className="text-sm font-semibold text-foreground">
                Looking for exceptional machine learning engineers, AI researchers, and platform architects.
              </p>
              <p className="text-xs text-muted-foreground">
                Email your CV, portfolio, or GitHub profile to{" "}
                <a href="mailto:careers@indusnet-ai.com" className="text-primary font-semibold hover:underline">
                  careers@indusnet-ai.com
                </a>
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-primary text-white font-semibold text-xs flex-shrink-0 hover:bg-primary/90 shadow-md shadow-primary/25">
              <a href="mailto:careers@indusnet-ai.com?subject=Engineering%20Application%20-%20Indusnet%20AI" className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5" /> Email Your CV
              </a>
            </Button>
          </div>
        )}

        {!isStaticMode && (
          /* Search & Filter Bar for Live Mode */
          <div className="bg-muted border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto">
            <div className="flex-grow flex items-center bg-background/50 border border-border rounded-xl px-3 py-2 text-muted-foreground">
              <Search className="w-4 h-4 mr-2" />
              <input
                type="text"
                placeholder="Search by job title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-foreground text-xs w-full focus:outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="py-2.5 px-3 bg-background border border-border text-xs rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-[150px]"
              >
                <option value="All">All Departments</option>
                {departments.filter(d => d !== "All").map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={selectedLoc}
                onChange={(e) => setSelectedLoc(e.target.value)}
                className="py-2.5 px-3 bg-background border border-border text-xs rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-[150px]"
              >
                <option value="All">All Locations</option>
                {locations.filter(l => l !== "All").map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 pb-24 z-10">
        {isStaticMode ? (
          /* Static Positions Grid */
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2 text-left">
              <h2 className="text-2xl font-bold text-foreground font-heading">Core Open Disciplines</h2>
              <p className="text-xs text-muted-foreground">
                We review applications continuously for the following roles across our Chennai and Singapore hubs:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staticPositions.map((pos, idx) => (
                <Card key={idx} className="glassmorphism-card border-none hover:border-primary/30 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg group text-left">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-2.5 py-0.5">
                        {pos.department}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {pos.employment_type}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {pos.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between gap-6">
                    <p className="text-muted-foreground text-[12px] leading-relaxed">
                      {pos.desc}
                    </p>

                    <div className="flex flex-col gap-3 border-t border-border pt-4">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{pos.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pos.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] text-muted-foreground bg-muted border border-border/60 rounded px-2 py-0.5">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button asChild className="w-full bg-muted group-hover:bg-primary group-hover:text-white border border-border group-hover:border-transparent text-foreground font-semibold text-xs transition-all duration-300">
                      <a href={`mailto:careers@indusnet-ai.com?subject=${encodeURIComponent(`Application for ${pos.title} - Indusnet AI`)}`} className="flex items-center justify-center gap-1">
                        Apply via Email <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Dynamic Live Mode Listings */
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-xs">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-3"></div>
                Loading active job positions...
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-muted/50 border border-border rounded-2xl p-16 text-center text-muted-foreground text-xs">
                No active positions match your criteria. Check back soon or search another term!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="bg-muted/30 hover:bg-muted/60 transition-all duration-300 border border-border hover:border-primary/30 flex flex-col justify-between overflow-hidden shadow-lg group text-left">
                    <CardHeader className="p-6 pb-4">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-2.5 py-0.5">
                          {job.department}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {job.employment_type}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
                      <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-3 mb-6">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-col gap-2.5 border-t border-border pt-4 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-accent" />
                          <span>{job.salary_range}</span>
                        </div>
                      </div>

                      <Button asChild className="w-full bg-muted group-hover:bg-primary group-hover:text-white border border-border group-hover:border-transparent text-foreground font-semibold text-xs mt-6 transition-all duration-300">
                        <Link href={`/careers/${job.id}`} className="flex items-center justify-center gap-1">
                          View Position <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-16 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4 text-left">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                INDUSNET <span className="text-primary">AI</span>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                A pioneer in building and deploying production-grade cognitive orchestration tools for enterprise scale compliance audits and recruitment models.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 text-left">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-muted-foreground">Singapore Corporate Office</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park,<br />
                Singapore, SG 408933
              </p>
              <div className="flex flex-col gap-1 text-muted-foreground text-xs mt-1">
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> <a href="tel:+6594483805" className="hover:text-primary transition-colors">+65-9448-3805</a></div>
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> <a href="tel:+6567474753" className="hover:text-primary transition-colors">+65-6747-4753</a></div>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-left">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-muted-foreground">Chennai Headquarters</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Number 46 First Floor, Tansi Nagar,<br />
                Velachery, Chennai, India 600042
              </p>
              <div className="flex flex-col gap-1 text-muted-foreground text-xs mt-1">
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> <a href="tel:+919884915977" className="hover:text-primary transition-colors">+91-9884915977</a></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-[11px] flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Indusnet AI Corporation. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
