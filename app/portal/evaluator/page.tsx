"use client";

import * as React from "react";
import { useAuth, API_BASE_URL } from "../auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building, FileText, Plus, LogOut, Activity, 
  Settings, CheckCircle2, User, RefreshCw, BarChart2 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EvaluatorDashboard() {
  const { user, logout, apiFetch, loading } = useAuth();
  const router = useRouter();

  const [sessions, setSessions] = React.useState<any[]>([]);
  const [fetching, setFetching] = React.useState(true);
  
  // Create Tender Form State
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tenderFile, setTenderFile] = React.useState<File | null>(null);
  const [publishing, setPublishing] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/portal");
      return;
    }

    if (user && user.role !== "internal_evaluator") {
      router.push("/portal/dashboard");
      return;
    }

    if (user) {
      loadSessions();
    }
  }, [user, loading]);

  const loadSessions = async () => {
    try {
      setFetching(true);
      const data = await apiFetch("/sessions");
      setSessions(data);
    } catch (err) {
      console.error("Error loading sessions:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTenderFile(e.target.files[0]);
    }
  };

  const handlePublishTender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setPublishing(true);
    const formData = new FormData();
    formData.append("title", title);
    if (description) {
      formData.append("description", description);
    }
    if (tenderFile) {
      formData.append("file", tenderFile);
    }

    try {
      const savedToken = localStorage.getItem("copilot_token");
      const res = await fetch(`${API_BASE_URL}/tenders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to publish tender");
      }

      alert("Tender successfully published with AI-extracted requirement matrix!");
      setTitle("");
      setDescription("");
      setTenderFile(null);
      
      // Reload sessions list
      loadSessions();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setPublishing(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="flex-grow flex items-center justify-center" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <span className="text-xs text-zinc-400">Loading evaluator dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow flex flex-col pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto w-full gap-8" role="main">
      
      {/* Header profile bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent" aria-hidden="true">
            {user?.name ? user.name[0].toUpperCase() : "E"}
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Welcome, {user?.name || "Evaluator"}
              <Badge className="bg-accent/10 border-accent/20 text-accent text-[10px] rounded px-2">
                Internal Evaluator
              </Badge>
            </h1>
            <span className="text-xs text-zinc-400">Manage tender checklists and monitor bidder submission compliance</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={loadSessions}
            aria-label="Refresh bidding sessions"
            className="rounded-full text-zinc-400 hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button 
            variant="outline" 
            onClick={logout} 
            aria-label="Log Out"
            className="rounded-full border-border/40 hover:bg-white/5 text-xs text-zinc-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" /> Log Out
          </Button>
        </div>
      </header>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
        
        {/* Active Bids Monitoring Board */}
        <section className="lg:col-span-8 flex flex-col gap-4" aria-labelledby="board-heading">
          <h2 id="board-heading" className="text-base font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <BarChart2 className="w-5 h-5 text-accent" aria-hidden="true" /> Bidder Sessions & Progress
          </h2>

          {sessions.length === 0 ? (
            <div className="bg-white/5 border border-border/10 p-12 rounded-xl text-center text-zinc-400 text-xs">
              No bidders have initialized any sessions yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sessions.map((session) => (
                <article key={session.id} className="glassmorphism-card border-none p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                        {session.tender?.title || "Tender Title"}
                      </span>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-primary" aria-hidden="true" /> Session ID: {session.id.substring(0, 8)}...
                      </h3>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-zinc-400">Compliance Score</span>
                      <Badge className={`font-bold text-xs rounded px-2.5 py-0.5 ${
                        parseFloat(session.compliance_score) === 100 
                          ? "bg-green-500/10 border-green-500/20 text-green-400" 
                          : "bg-primary/10 border-primary/20 text-primary"
                      }`}>
                        {parseFloat(session.compliance_score).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border/5 pt-4 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-400 text-[10px]">Session Status</span>
                      <span className="text-white capitalize">{session.status.replace("_", " ")}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                      <span className="text-zinc-400 text-[10px]">Last Active</span>
                      <span className="text-white">
                        {new Date(session.last_activity).toLocaleDateString()} {new Date(session.last_activity).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <Button asChild className="w-full rounded-lg bg-white/5 border border-border/40 hover:bg-white/10 text-white text-xs mt-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <Link href={`/portal/session/${session.id}`} aria-label={`Open compliance transcript for session ${session.id.substring(0, 8)}`}>
                      Open Compliance Transcript
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* AI Requirement Matrix Publisher Form */}
        <section className="lg:col-span-4 flex flex-col gap-4" aria-labelledby="publish-heading">
          <h2 id="publish-heading" className="text-base font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Plus className="w-5 h-5 text-primary" aria-hidden="true" /> Publish New Tender
          </h2>

          <Card className="glassmorphism-card border-none p-6">
            <form onSubmit={handlePublishTender} aria-labelledby="publish-heading" className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tender-title" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Tender Title
                </label>
                <Input
                  type="text"
                  id="tender-title"
                  placeholder="e.g. Enterprise AI Agent Deployment 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-lg bg-white/5 border-border/40 text-xs text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="tender-desc" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Description
                </label>
                <Textarea
                  id="tender-desc"
                  placeholder="Briefly summarize the tender goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-lg bg-white/5 border-border/40 text-xs text-white min-h-[80px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="tender-pdf" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Tender Specifications (PDF)
                </label>
                <div className="border border-dashed border-border/40 hover:border-primary/50 transition-all rounded-lg p-4 text-center cursor-pointer relative focus-within:ring-2 focus-within:ring-primary">
                  <input
                    type="file"
                    id="tender-pdf"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileText className="w-6 h-6 text-primary mx-auto mb-1.5" aria-hidden="true" />
                  <span className="text-[10px] text-zinc-400 block truncate max-w-[200px] mx-auto">
                    {tenderFile ? tenderFile.name : "Select Tender PDF File"}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={publishing}
                className="w-full rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs py-5 mt-2 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {publishing ? "Extracting Requirements..." : "Publish & Generate Matrix"}
              </Button>
            </form>
          </Card>
        </section>
      </div>
    </main>
  );
}
