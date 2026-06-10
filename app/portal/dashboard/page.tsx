"use client";

import * as React from "react";
import { useAuth } from "../auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, Plus, FileText, ArrowRight, UserCheck, 
  Activity, CheckCircle2, AlertCircle, LogOut 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BidderDashboard() {
  const { user, logout, apiFetch, loading } = useAuth();
  const [tenders, setTenders] = React.useState<any[]>([]);
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [fetching, setFetching] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/portal");
      return;
    }

    if (user && user.role === "internal_evaluator") {
      router.push("/portal/evaluator");
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, loading]);

  const loadData = async () => {
    try {
      setFetching(true);
      const [tendersList, sessionsList] = await Promise.all([
        apiFetch("/tenders"),
        apiFetch("/sessions"),
      ]);
      setTenders(tendersList);
      setSessions(sessionsList);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setFetching(false);
    }
  };

  const startOrResumeSession = async (tenderId: string) => {
    try {
      const activeSession = sessions.find((s) => s.tender_id === tenderId);
      if (activeSession) {
        router.push(`/portal/session/${activeSession.id}`);
        return;
      }

      // Create new session
      const newSession = await apiFetch("/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tender_id: tenderId }),
      });
      router.push(`/portal/session/${newSession.id}`);
    } catch (err) {
      alert("Failed to initialize session: " + err);
    }
  };

  if (loading || fetching) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs text-muted-foreground">Loading workspace details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto w-full gap-8">
      {/* Header Profile bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Welcome, {user?.name || "User"}
              <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-2">
                Bidder
              </Badge>
            </h1>
            <span className="text-xs text-muted-foreground">Representing your registered bidding organization</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={logout} 
          className="rounded-full border-border/40 hover:bg-white/5 text-xs text-muted-foreground self-start md:self-center"
        >
          <LogOut className="w-3.5 h-3.5 mr-1.5" /> Log Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="glassmorphism-card border-none text-left p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">{tenders.length}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Available Tenders</span>
          </div>
        </Card>
        <Card className="glassmorphism-card border-none text-left p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">
              {sessions.filter(s => parseFloat(s.compliance_score) === 100).length}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Compliant Sessions</span>
          </div>
        </Card>
        <Card className="glassmorphism-card border-none text-left p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">
              {sessions.filter(s => parseFloat(s.compliance_score) < 100).length}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">In-Progress Bids</span>
          </div>
        </Card>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Open Tenders list */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" /> Active RFPs & Tenders
          </h2>
          {tenders.length === 0 ? (
            <div className="bg-white/5 border border-border/10 p-12 rounded-xl text-center text-muted-foreground text-xs">
              No active tenders found at this moment.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tenders.map((tender) => {
                const session = sessions.find(s => s.tender_id === tender.id);
                return (
                  <Card key={tender.id} className="glassmorphism-card border-none overflow-hidden hover:border-primary/20 transition-all duration-300">
                    <CardHeader className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <CardTitle className="text-base font-bold text-white">{tender.title}</CardTitle>
                          <CardDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {tender.description || "No description provided."}
                          </CardDescription>
                        </div>
                        {session ? (
                          <Badge className="bg-green-500/10 border-green-500/20 text-green-400 text-[9px] rounded">
                            Bid Session Active
                          </Badge>
                        ) : (
                          <Badge className="bg-primary/10 border-primary/20 text-primary text-[9px] rounded">
                            Ready to Start
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0 flex justify-between items-center border-t border-border/5 mt-2 pt-4">
                      {session ? (
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] text-muted-foreground">Compliance Score:</div>
                          <div className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-border/15">
                            {parseFloat(session.compliance_score).toFixed(0)}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-muted-foreground">No bid started yet.</div>
                      )}
                      <Button
                        onClick={() => startOrResumeSession(tender.id)}
                        className={`rounded-full text-xs font-semibold px-5 group ${
                          session 
                            ? "bg-white/5 border border-border/40 hover:bg-white/10 text-white" 
                            : "bg-gradient-to-r from-primary to-accent text-white hover:brightness-110"
                        }`}
                      >
                        {session ? "Launch Workspace" : "Begin Proposal"}{" "}
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Corporate Workspace Guidelines */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-accent" /> Bidder Guidelines
          </h2>
          <Card className="glassmorphism-card border-none p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-white">1. Connect Copilot Workspace</span>
              <span className="text-[10px] text-muted-foreground leading-relaxed">
                Start a bid on any open tender above. This initiates a secure session linked to your company profile.
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-white">2. Check Checklist Matrix</span>
              <span className="text-[10px] text-muted-foreground leading-relaxed">
                Review the list of required certificates, turnover proofs, and technical credentials in the workspace checklist.
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-white">3. Upload Supporting Documents</span>
              <span className="text-[10px] text-muted-foreground leading-relaxed">
                Drag-and-drop your company files (PDF) in the workspace chat. The Copilot will automatically analyze compliance.
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-white">4. Resolve Missing Clauses</span>
              <span className="text-[10px] text-muted-foreground leading-relaxed">
                Engage in natural conversation to clarify gaps, explain details, or provide compliance updates.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
