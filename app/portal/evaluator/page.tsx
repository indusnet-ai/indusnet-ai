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
  Settings, CheckCircle2, User, RefreshCw, BarChart2,
  Table, Printer, Download, AlertTriangle, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EvaluatorDashboard() {
  const { user, logout, apiFetch, loading } = useAuth();
  const router = useRouter();

  const [sessions, setSessions] = React.useState<any[]>([]);
  const [tenders, setTenders] = React.useState<any[]>([]);
  const [fetching, setFetching] = React.useState(true);
  
  // Dashboard view toggle: "board" | "comparative"
  const [activeTab, setActiveTab] = React.useState<"board" | "comparative">("board");
  
  // Comparative report state
  const [selectedTenderId, setSelectedTenderId] = React.useState<string>("");
  const [comparativeReport, setComparativeReport] = React.useState<any>(null);
  const [loadingReport, setLoadingReport] = React.useState(false);
  
  // Comparative Sheet Header Customization
  const [orgHeader, setOrgHeader] = React.useState("CHENNAI PETROLEUM CORPORATION LIMITED");
  const [docHeader, setDocHeader] = React.useState("TECHNICAL BID COMPARATIVE EVALUATION MATRIX");
  const [tenderNoHeader, setTenderNoHeader] = React.useState("Tender No: CC 0017 23");
  const [workNameHeader, setWorkNameHeader] = React.useState("Engaging Contractor for pipeline, fabrication, and structural jobs");

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
      loadData();
    }
  }, [user, loading]);

  const loadData = async () => {
    try {
      setFetching(true);
      const [sessionsData, tendersData] = await Promise.all([
        apiFetch("/sessions"),
        apiFetch("/tenders")
      ]);
      setSessions(sessionsData);
      setTenders(tendersData);
    } catch (err) {
      console.error("Error loading evaluator dashboard data:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleTenderSelect = async (tenderId: string) => {
    setSelectedTenderId(tenderId);
    if (!tenderId) {
      setComparativeReport(null);
      return;
    }
    
    // Set default work name from selected tender title
    const selectedTender = tenders.find(t => t.id === tenderId);
    if (selectedTender) {
      setWorkNameHeader(`Name of Work: ${selectedTender.title}`);
      setTenderNoHeader(`Tender No: ${selectedTender.id.substring(0, 8).toUpperCase()}`);
    }

    try {
      setLoadingReport(true);
      const data = await apiFetch(`/tenders/${tenderId}/comparative-evaluation`);
      setComparativeReport(data);
    } catch (err) {
      console.error("Error loading comparative evaluation:", err);
      alert("Failed to load comparative evaluation details.");
    } finally {
      setLoadingReport(false);
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
      
      // Reload dashboard data
      loadData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setPublishing(false);
    }
  };

  // Export comparative report to CSV format
  const exportToCSV = () => {
    if (!comparativeReport) return;
    const { tender, comparative_matrix } = comparativeReport;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `\"${orgHeader.replace(/"/g, '""')}\"\n`;
    csvContent += `\"${docHeader.replace(/"/g, '""')}\"\n`;
    csvContent += `\"${tenderNoHeader.replace(/"/g, '""')}\"\n`;
    csvContent += `\"${workNameHeader.replace(/"/g, '""')}\"\n\n`;
    
    const headers = ["Sl. No.", "Item Description", "Tender Requirement"];
    comparative_matrix.forEach((b: any) => {
      headers.push(`M/s. ${b.company_name} (${b.compliance_score.toFixed(0)}%)`);
    });
    
    csvContent += headers.map(h => `\"${h.replace(/"/g, '""')}\"`).join(",") + "\n";
    
    const matrix = tender.requirement_matrix || [];
    matrix.forEach((req: any, idx: number) => {
      const row = [
        `${(idx + 1).toFixed(1)}`,
        req.title,
        req.description || ""
      ];
      
      comparative_matrix.forEach((b: any) => {
        const bidderReq = b.matrix.find((r: any) => r.title === req.title);
        if (bidderReq) {
          const statusStr = bidderReq.status.toUpperCase();
          const notesStr = bidderReq.notes ? ` - ${bidderReq.notes}` : "";
          row.push(`[${statusStr}]${notesStr}`);
        } else {
          row.push("[PENDING]");
        }
      });
      
      csvContent += row.map(r => `\"${r.replace(/"/g, '""')}\"`).join(",") + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Comparative_Evaluation_${tender.id.substring(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <main className="flex-grow flex flex-col pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full gap-8" role="main">
      
      {/* Landscape Print Helper Stylesheet */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          header, button, nav, form, .no-print, [role="tablist"], .badge-header {
            display: none !important;
          }
          .print-sheet {
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .excel-table {
            border: 2px solid black !important;
            width: 100% !important;
          }
          .excel-table th, .excel-table td {
            border: 1px solid black !important;
            color: black !important;
            background: transparent !important;
            font-size: 10px !important;
            padding: 6px !important;
          }
          .excel-table th {
            background-color: #f3f4f6 !important;
            font-weight: bold !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: landscape;
            margin: 0.8cm;
          }
        }
      `}} />

      {/* Header profile bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6 no-print">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent" aria-hidden="true">
            {user?.name ? user.name[0].toUpperCase() : "E"}
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Welcome, {user?.name || "Evaluator"}
              <Badge className="bg-accent/10 border-accent/20 text-accent text-[10px] rounded px-2 badge-header">
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
            onClick={loadData}
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
        
        {/* Left Hand: Dashboard Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* TAB CONTROL SWITCHES (WCAG Compliant) */}
          <div className="flex border-b border-border/10 mb-4 no-print" role="tablist" aria-label="Dashboard Views">
            <button
              onClick={() => setActiveTab("board")}
              role="tab"
              aria-selected={activeTab === "board"}
              className={`py-2 px-4 text-xs font-semibold border-b-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === "board"
                  ? "border-primary text-white"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              Active Sessions
            </button>
            <button
              onClick={() => {
                setActiveTab("comparative");
                if (tenders.length > 0 && !selectedTenderId) {
                  handleTenderSelect(tenders[0].id);
                }
              }}
              role="tab"
              aria-selected={activeTab === "comparative"}
              className={`py-2 px-4 text-xs font-semibold border-b-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === "comparative"
                  ? "border-primary text-white"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              Comparative Evaluation Sheet
            </button>
          </div>

          {/* TAB 1 CONTENT: Monitoring Board */}
          {activeTab === "board" && (
            <section className="flex flex-col gap-4" aria-labelledby="board-heading">
              <h2 id="board-heading" className="text-base font-bold text-white flex items-center gap-2 uppercase tracking-wider no-print">
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
                            <Building className="w-4 h-4 text-primary" aria-hidden="true" /> 
                            {session.company?.name || `Bidder #${session.id.substring(0, 8)}`}
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
                        <Link href={`/portal/session/${session.id}`} aria-label={`Open compliance transcript for ${session.company?.name || 'session'}`}>
                          Open Compliance Transcript
                        </Link>
                      </Button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 2 CONTENT: Comparative Spreadsheet Sheets */}
          {activeTab === "comparative" && (
            <section className="flex flex-col gap-4" aria-labelledby="comparative-heading">
              
              {/* Tender Selector Header (no-print) */}
              <div className="flex flex-col gap-2 p-5 bg-white/5 rounded-xl border border-border/10 no-print">
                <label htmlFor="tender-select" className="text-xs font-semibold text-zinc-300">
                  Select Active Tender Scope:
                </label>
                <select
                  id="tender-select"
                  value={selectedTenderId}
                  onChange={(e) => handleTenderSelect(e.target.value)}
                  className="w-full py-2 px-3 bg-neutral-900 border border-border/40 text-xs rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Choose an active tender --</option>
                  {tenders.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTenderId && loadingReport && (
                <div className="flex flex-col items-center gap-2 p-12 text-zinc-400 text-xs">
                  <Activity className="w-6 h-6 text-primary animate-spin" aria-hidden="true" />
                  Generating Technical Bid Evaluation matrix...
                </div>
              )}

              {selectedTenderId && !loadingReport && comparativeReport && (
                <div className="flex flex-col gap-6 print-sheet">
                  
                  {/* EDIT PANEL (no-print) - Customize header content */}
                  <div className="bg-white/5 border border-border/10 p-4 rounded-xl flex flex-col gap-3 no-print">
                    <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                      <Settings className="w-4 h-4" /> Sheet Header Customization
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 uppercase font-semibold">Organization / Client Name</label>
                        <Input value={orgHeader} onChange={(e) => setOrgHeader(e.target.value)} className="bg-neutral-950/80 border-border/30 py-1.5 h-8 text-xs text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 uppercase font-semibold">Evaluation Sheet Title</label>
                        <Input value={docHeader} onChange={(e) => setDocHeader(e.target.value)} className="bg-neutral-950/80 border-border/30 py-1.5 h-8 text-xs text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 uppercase font-semibold">Tender No. / Code</label>
                        <Input value={tenderNoHeader} onChange={(e) => setTenderNoHeader(e.target.value)} className="bg-neutral-950/80 border-border/30 py-1.5 h-8 text-xs text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-zinc-400 uppercase font-semibold">Name of Work</label>
                        <Input value={workNameHeader} onChange={(e) => setWorkNameHeader(e.target.value)} className="bg-neutral-950/80 border-border/30 py-1.5 h-8 text-xs text-white" />
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex justify-end gap-2 mt-2">
                      <Button onClick={exportToCSV} variant="outline" size="sm" className="border-border/40 text-xs text-zinc-300 hover:bg-white/5">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Export Excel CSV
                      </Button>
                      <Button onClick={() => window.print()} className="bg-primary text-white text-xs hover:brightness-110">
                        <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Sheets
                      </Button>
                    </div>
                  </div>

                  {/* EXCEL SHEET (Printable Grid) */}
                  <div className="bg-[#030014]/50 border border-border/10 rounded-xl overflow-hidden shadow-2xl p-6 text-white print-container flex flex-col gap-4">
                    
                    {/* Sheet Header block */}
                    <div className="text-center flex flex-col gap-1 border-b border-white/20 pb-4">
                      <div className="text-xs uppercase tracking-wider font-extrabold text-primary print:text-black">
                        {orgHeader}
                      </div>
                      <div className="text-sm font-extrabold uppercase print:text-black">
                        {docHeader}
                      </div>
                      <div className="text-[11px] text-zinc-400 print:text-black font-semibold">
                        {tenderNoHeader}
                      </div>
                      <div className="text-xs italic text-zinc-300 print:text-black mt-1.5 font-medium">
                        {workNameHeader}
                      </div>
                    </div>

                    {/* Comparative Matrix Table */}
                    {comparativeReport.comparative_matrix.length === 0 ? (
                      <div className="text-center p-8 text-zinc-400 text-xs">
                        No active bidder proposals have submitted evaluation data yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto w-full max-w-full">
                        <table className="w-full text-xs text-left border-collapse border border-white/10 excel-table">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                              <th className="p-3 border border-white/10 w-[70px] text-center font-bold text-zinc-300 uppercase print:text-black">Sl. No.</th>
                              <th className="p-3 border border-white/10 w-[200px] font-bold text-zinc-300 uppercase print:text-black">Item Description</th>
                              <th className="p-3 border border-white/10 w-[220px] font-bold text-zinc-300 uppercase print:text-black">Tender Requirement</th>
                              
                              {/* Bidder columns */}
                              {comparativeReport.comparative_matrix.map((b: any, idx: number) => (
                                <th key={b.session_id} className="p-3 border border-white/10 text-center font-bold text-primary print:text-black">
                                  <div className="flex flex-col items-center">
                                    <span className="truncate max-w-[150px]">M/s. {b.company_name}</span>
                                    <span className="text-[10px] font-semibold text-zinc-400 mt-0.5">({b.compliance_score.toFixed(0)}% Compliant)</span>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {comparativeReport.tender.requirement_matrix && comparativeReport.tender.requirement_matrix.map((req: any, reqIdx: number) => (
                              <tr key={req.id || reqIdx} className="hover:bg-white/[0.02] border-b border-white/5">
                                <td className="p-3 border border-white/10 text-center text-zinc-300 font-bold print:text-black">
                                  {(reqIdx + 1).toFixed(1)}
                                </td>
                                <td className="p-3 border border-white/10 font-bold text-white print:text-black">
                                  {req.title}
                                </td>
                                <td className="p-3 border border-white/10 text-zinc-300 print:text-black leading-relaxed">
                                  {req.description}
                                </td>
                                
                                {/* Bidder specific checks */}
                                {comparativeReport.comparative_matrix.map((b: any) => {
                                  const bidderReq = b.matrix.find((r: any) => r.title === req.title);
                                  return (
                                    <td key={b.session_id} className="p-3 border border-white/10 text-[11px] align-top">
                                      {bidderReq ? (
                                        <div className="flex flex-col gap-1.5">
                                          <div className="flex items-center gap-1.5">
                                            {bidderReq.status === "verified" ? (
                                              <>
                                                <Badge className="bg-green-500/10 border-green-500/20 text-green-400 rounded px-1.5 py-0">
                                                  ✅ Verified
                                                </Badge>
                                              </>
                                            ) : bidderReq.status === "missing" ? (
                                              <>
                                                <Badge className="bg-red-500/10 border-red-500/20 text-red-400 rounded px-1.5 py-0">
                                                  ❌ Missing
                                                </Badge>
                                              </>
                                            ) : (
                                              <>
                                                <Badge className="bg-zinc-500/10 border-zinc-500/20 text-zinc-400 rounded px-1.5 py-0">
                                                  ⏳ Pending
                                                </Badge>
                                              </>
                                            )}
                                          </div>
                                          {bidderReq.notes && (
                                            <p className="text-[10px] text-zinc-400 leading-relaxed italic bg-black/10 p-2 rounded print:border print:border-black">
                                              {bidderReq.notes}
                                            </p>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-zinc-500 italic">Not evaluated</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

        </div>

        {/* Right Hand: AI Publisher Form (no-print) */}
        <section className="lg:col-span-4 flex flex-col gap-4 no-print" aria-labelledby="publish-heading">
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
