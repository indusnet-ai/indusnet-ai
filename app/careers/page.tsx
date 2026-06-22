"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, MapPin, DollarSign, Clock, Search, 
  ChevronRight, Building, HelpCircle, Phone, Globe, Star
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

export default function CareersPage() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState("All");
  const [selectedLoc, setSelectedLoc] = React.useState("All");

  React.useEffect(() => {
    async function fetchJobs() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
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
  }, []);

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
    <div className="min-h-screen bg-[#030014] text-white flex flex-col font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-border/10 py-6 px-6 md:px-12 backdrop-blur-md sticky top-0 z-50 bg-[#030014]/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            INDUSNET <span className="text-primary">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-border/40 hover:bg-white/5 rounded-full text-xs">
              <Link href="/portal">Portal Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 text-center max-w-4xl mx-auto z-10">
        <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] uppercase tracking-wider rounded-full px-3 py-1 mb-6">
          Careers & Opportunities
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#cbd5e1] to-[#64748b] bg-clip-text text-transparent mb-6 leading-tight">
          Join the Future of <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text">Cognitive Enterprise AI</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          At Indusnet AI, we design, deploy, and scale cognitive automation systems for high-compliance enterprise sectors. Build mission-critical technology with us.
        </p>

        {/* Search & Filter Bar */}
        <div className="bg-white/[0.03] border border-border/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto">
          <div className="flex-grow flex items-center bg-black/20 border border-border/5 rounded-xl px-3 py-2 text-zinc-400">
            <Search className="w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search by job title or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-2.5 px-3 bg-neutral-900 border border-border/40 text-xs rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-[150px]"
            >
              <option value="All">All Departments</option>
              {departments.filter(d => d !== "All").map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="py-2.5 px-3 bg-neutral-900 border border-border/40 text-xs rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-[150px]"
            >
              <option value="All">All Locations</option>
              {locations.filter(l => l !== "All").map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Job Listings Grid */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 pb-24 z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 text-xs">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-3"></div>
            Loading active job positions...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white/[0.02] border border-border/10 rounded-2xl p-16 text-center text-zinc-400 text-xs">
            No active positions match your criteria. Check back soon or search another term!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 border border-border/10 hover:border-primary/30 flex flex-col justify-between overflow-hidden shadow-lg group">
                <CardHeader className="p-6 pb-4">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-2.5 py-0.5">
                      {job.department}
                    </Badge>
                    <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {job.employment_type}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-white group-hover:text-primary transition-colors">
                    {job.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-between">
                  <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-3 mb-6">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-col gap-2.5 border-t border-border/5 pt-4 text-[11px] text-zinc-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <span>{job.salary_range}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-white/5 group-hover:bg-primary group-hover:text-white border border-border/40 group-hover:border-transparent text-white font-semibold text-xs mt-6 transition-all duration-300">
                    <Link href={`/careers/${job.id}`} className="flex items-center justify-center gap-1">
                      View Position <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/10 bg-[#02000c] py-16 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4 text-left">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                INDUSNET <span className="text-primary">AI</span>
              </h2>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                A pioneer in building and deploying verified cognitive orchestration tools for enterprise scale compliance audits and recruitment models.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 text-left">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-zinc-300">Singapore Corporate Office</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park,<br />
                Singapore, SG 408933
              </p>
              <div className="flex flex-col gap-1 text-zinc-400 text-xs mt-1">
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> +65-9448-3805</div>
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> +65-6747-4753</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-left">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-zinc-300">Chennai Headquarters</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Number 46 First Floor, Tansi Nagar,<br />
                Velachery, Chennai, India 600042
              </p>
              <div className="flex flex-col gap-1 text-zinc-400 text-xs mt-1">
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> +91-9884915977</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/5 pt-8 text-center text-zinc-500 text-[11px] flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Indusnet AI Corporation. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
