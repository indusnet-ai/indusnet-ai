"use client";

import * as React from "react";
import { useAuth, API_BASE_URL } from "../auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Building, Users, Briefcase, FileText, CheckCircle2, XCircle, Clock, 
  Search, RefreshCw, BarChart2, Star, Mail, Phone, Calendar, 
  MapPin, GraduationCap, Award, Compass, ExternalLink, ArrowRight, MessageSquare,
  Printer, Edit, Eye, Save, Send
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HRDashboard() {
  const { user, logout, apiFetch, loading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = React.useState<any[]>([]);
  const [applications, setApplications] = React.useState<any[]>([]);
  const [fetching, setFetching] = React.useState(true);
  
  // Filtering states
  const [selectedJobId, setSelectedJobId] = React.useState<string>("All");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [minScore, setMinScore] = React.useState(0);

  // Selected candidate profile (for slide-out detail)
  const [selectedCandidateId, setSelectedCandidateId] = React.useState<string | null>(null);
  const [candidateProfile, setCandidateProfile] = React.useState<any>(null);
  const [loadingProfile, setLoadingProfile] = React.useState(false);
  const [reanalyzing, setReanalyzing] = React.useState(false);

  // Offer letter modal states
  const [offerModalOpen, setOfferModalOpen] = React.useState(false);
  const [raisingOffer, setRaisingOffer] = React.useState(false);
  
  // Inputs
  const [offerName, setOfferName] = React.useState("");
  const [offerEmail, setOfferEmail] = React.useState("");
  const [offerPhone, setOfferPhone] = React.useState("");
  const [offerAddress, setOfferAddress] = React.useState("");
  const [annualCTC, setAnnualCTC] = React.useState("");
  const [variablePay, setVariablePay] = React.useState("");
  const [additionalNotes, setAdditionalNotes] = React.useState("");

  // Offer Letter content & status
  const [offerLetterText, setOfferLetterText] = React.useState("");
  const [offerStatus, setOfferStatus] = React.useState("draft"); // 'draft', 'sent'
  const [offerId, setOfferId] = React.useState<string | null>(null);

  // Toggle view
  const [offerStep, setOfferStep] = React.useState<"form" | "preview">("form");
  const [isPreviewEditMode, setIsPreviewEditMode] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/portal");
      return;
    }

    if (user && user.role !== "hr_manager") {
      // Redirect bidders to bidder dashboard and evaluators to evaluator dashboard
      if (user.role === "internal_evaluator") {
        router.push("/portal/evaluator");
      } else {
        router.push("/portal/dashboard");
      }
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, loading]);

  const loadDashboardData = async () => {
    try {
      setFetching(true);
      const [jobsData, appsData] = await Promise.all([
        apiFetch("/hr/jobs/all"),
        apiFetch("/hr/applications")
      ]);
      setJobs(jobsData);
      setApplications(appsData);
    } catch (err) {
      console.error("Error loading HR dashboard data:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleSelectCandidate = async (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setLoadingProfile(true);
    try {
      const profile = await apiFetch(`/hr/candidates/${candidateId}`);
      setCandidateProfile(profile);
    } catch (err) {
      console.error("Error loading candidate profile:", err);
      alert("Failed to load candidate details.");
      setSelectedCandidateId(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdateStatus = async (statusVal: string) => {
    if (!selectedCandidateId || !candidateProfile) return;
    try {
      const savedToken = localStorage.getItem("copilot_token");
      const res = await fetch(`${API_BASE_URL}/hr/applications/${selectedCandidateId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedToken}`
        },
        body: JSON.stringify({ status: statusVal })
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      const updatedApp = await res.json();
      
      // Update local profiles/lists
      setCandidateProfile((prev: any) => ({
        ...prev,
        application: { ...prev.application, application_status: statusVal }
      }));
      setApplications((prev) => prev.map(app => app.id === selectedCandidateId ? { ...app, application_status: statusVal } : app));
      
      alert(`Status updated to ${statusVal} and corresponding email notification sent.`);
    } catch (err: any) {
      alert("Failed to update candidate status: " + err.message);
    }
  };

  const handleReanalyze = async () => {
    if (!selectedCandidateId) return;
    setReanalyzing(true);
    try {
      const updatedAnalysis = await apiFetch(`/hr/analysis/${selectedCandidateId}/reanalyze`, {
        method: "POST"
      });
      setCandidateProfile((prev: any) => ({
        ...prev,
        analysis: updatedAnalysis,
        application: { ...prev.application, ai_score: updatedAnalysis.job_match_score }
      }));
      // Update list
      setApplications((prev) => prev.map(app => app.id === selectedCandidateId ? { ...app, ai_score: updatedAnalysis.job_match_score } : app));
      alert("AI Analysis refreshed successfully.");
    } catch (err: any) {
      alert("Reanalysis failed: " + err.message);
    } finally {
      setReanalyzing(false);
    }
  };

  const handleOpenOfferModal = () => {
    if (!candidateProfile) return;
    setOfferName(candidateProfile.application.name || "");
    setOfferEmail(candidateProfile.application.email || "");
    setOfferPhone(candidateProfile.application.phone || "");
    setAdditionalNotes("");
    
    // Check if an offer already exists for this candidate
    if (candidateProfile.offer) {
      setOfferAddress(candidateProfile.offer.candidate_address || "");
      setAnnualCTC(candidateProfile.offer.annual_ctc || "");
      setVariablePay(candidateProfile.offer.variable_pay || "");
      setOfferLetterText(candidateProfile.offer.offer_letter_text || "");
      setOfferStatus(candidateProfile.offer.status || "draft");
      setOfferId(candidateProfile.offer.id);
      setOfferStep("preview");
    } else {
      setOfferAddress("");
      setAnnualCTC("");
      setVariablePay("");
      setOfferLetterText("");
      setOfferStatus("draft");
      setOfferId(null);
      setOfferStep("form");
    }
    setOfferModalOpen(true);
  };

  const handleGenerateOffer = async () => {
    if (!selectedCandidateId) return;
    setRaisingOffer(true);
    try {
      const savedToken = localStorage.getItem("copilot_token");
      const res = await fetch(`${API_BASE_URL}/hr/applications/${selectedCandidateId}/offer/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedToken}`
        },
        body: JSON.stringify({
          annual_ctc: annualCTC,
          variable_pay: variablePay,
          candidate_address: offerAddress,
          candidate_name: offerName,
          candidate_email: offerEmail,
          candidate_phone: offerPhone,
          additional_instructions: additionalNotes
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to generate offer letter");
      }

      const offerData = await res.json();
      setOfferLetterText(offerData.offer_letter_text);
      setOfferId(offerData.id);
      setOfferStatus(offerData.status);
      setOfferStep("preview");
      
      // Update local profiles/lists
      setCandidateProfile((prev: any) => ({
        ...prev,
        application: { 
          ...prev.application, 
          name: offerName, 
          email: offerEmail, 
          phone: offerPhone 
        },
        offer: offerData
      }));
      setApplications((prev) => prev.map(app => app.id === selectedCandidateId ? { 
        ...app, 
        name: offerName, 
        email: offerEmail 
      } : app));
      
    } catch (err: any) {
      alert("Error generating offer: " + err.message);
    } finally {
      setRaisingOffer(false);
    }
  };

  const handleSaveOfferDraft = async () => {
    if (!selectedCandidateId) return;
    setRaisingOffer(true);
    try {
      const savedToken = localStorage.getItem("copilot_token");
      const res = await fetch(`${API_BASE_URL}/hr/applications/${selectedCandidateId}/offer/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedToken}`
        },
        body: JSON.stringify({
          offer_letter_text: offerLetterText,
          annual_ctc: annualCTC,
          variable_pay: variablePay,
          candidate_address: offerAddress
        })
      });

      if (!res.ok) throw new Error("Failed to save draft");
      
      const offerData = await res.json();
      setOfferLetterText(offerData.offer_letter_text);
      setCandidateProfile((prev: any) => ({
        ...prev,
        offer: offerData
      }));
      setIsPreviewEditMode(false);
      alert("Draft saved successfully.");
    } catch (err: any) {
      alert("Error saving draft: " + err.message);
    } finally {
      setRaisingOffer(false);
    }
  };

  const handleApproveAndSendOffer = async () => {
    if (!selectedCandidateId) return;
    setRaisingOffer(true);
    try {
      // First save any unsaved edits if in edit mode
      if (isPreviewEditMode) {
        const savedToken = localStorage.getItem("copilot_token");
        const res = await fetch(`${API_BASE_URL}/hr/applications/${selectedCandidateId}/offer/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${savedToken}`
          },
          body: JSON.stringify({
            offer_letter_text: offerLetterText,
            annual_ctc: annualCTC,
            variable_pay: variablePay,
            candidate_address: offerAddress
          })
        });
        if (!res.ok) throw new Error("Failed to save draft edits before sending");
      }

      const savedToken = localStorage.getItem("copilot_token");
      const sendRes = await fetch(`${API_BASE_URL}/hr/applications/${selectedCandidateId}/offer/approve-and-send`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${savedToken}`
        }
      });

      if (!sendRes.ok) {
        const errData = await sendRes.json();
        throw new Error(errData.detail || "Failed to send email");
      }

      const resData = await sendRes.json();
      alert(resData.message || "Offer approved and sent to candidate!");
      
      // Update local profiles/lists status
      setCandidateProfile((prev: any) => ({
        ...prev,
        application: { ...prev.application, application_status: "offered" },
        offer: { ...prev.offer, status: "sent" }
      }));
      setApplications((prev) => prev.map(app => app.id === selectedCandidateId ? { ...app, application_status: "offered" } : app));
      setOfferStatus("sent");
      setOfferModalOpen(false);
    } catch (err: any) {
      alert("Error sending offer: " + err.message);
    } finally {
      setRaisingOffer(false);
    }
  };

  const handlePrintPDF = () => {
    const printContent = document.getElementById("offer-notepad-print-area");
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=850,height=900");
    if (!printWindow) {
      alert("Please allow popups to print/download the PDF.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Offer Letter - ${offerName}</title>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
                background: #ffffff;
                color: #000000;
                -webkit-print-color-adjust: exact;
              }
              .page {
                width: 210mm;
                padding: 20mm;
                margin: 0 auto;
                box-sizing: border-box;
                background: #ffffff;
              }
              .no-print {
                display: none;
              }
            }
            body {
              background: #f1f5f9;
              font-family: 'Times New Roman', Times, serif;
              font-size: 14px;
              color: #1e293b;
              margin: 20px;
              padding: 0;
            }
            .page {
              background: #ffffff;
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              margin: 20px auto;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
              box-sizing: border-box;
              position: relative;
            }
            /* Table formatting */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-family: sans-serif;
              font-size: 13px;
              color: #1e293b;
            }
            tr {
              border-bottom: 1px solid #e2e8f0;
            }
            th, td {
              padding: 10px;
              text-align: left;
            }
            th {
              border-bottom: 2px solid #cbd5e1;
              background-color: #f1f5f9;
              font-weight: bold;
              color: #0f172a;
            }
            blockquote {
              border-left: 4px solid #cbd5e1;
              padding-left: 15px;
              margin: 15px 0;
              color: #475569;
              font-style: italic;
            }
            h1, h2, h3 {
              font-family: sans-serif;
              color: #0f172a;
            }
            h1 {
              font-size: 22px;
              margin-top: 30px;
              margin-bottom: 15px;
              text-align: center;
            }
            h2 {
              font-size: 18px;
              margin-top: 25px;
              margin-bottom: 12px;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 5px;
            }
            h3 {
              font-size: 15px;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            p {
              margin-top: 0;
              margin-bottom: 15px;
              line-height: 1.6;
            }
            li {
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <div class="page">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderMarkdownToHTML = (text: string) => {
    if (!text) return "";
    let html = text;

    // Blockquotes
    html = html.replace(/^>\s+(.*?)$/gm, '<blockquote style="border-left: 4px solid #cbd5e1; padding-left: 15px; margin: 15px 0; color: #475569; font-style: italic;">$1</blockquote>');

    // Tables
    html = html.replace(/(?:\|.*\|(?:\n|$))+/g, (tableContent) => {
      const rows = tableContent.trim().split('\n');
      if (rows.length < 2) return tableContent;
      
      let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: sans-serif; font-size: 13px; color: #1e293b;">';
      rows.forEach((row, i) => {
        if (row.includes('---')) return; // skip alignment row
        const cells = row.split('|').slice(1, -1).map(c => c.trim());
        if (cells.length === 0) return;
        
        const rowStyle = i === 0 
          ? 'border-bottom: 2px solid #cbd5e1; background-color: #f1f5f9; font-weight: bold; color: #0f172a;'
          : i % 2 === 0 ? 'border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;' : 'border-bottom: 1px solid #e2e8f0;';
          
        tableHtml += `<tr style="${rowStyle}">`;
        cells.forEach(cell => {
          const cellTag = i === 0 ? 'th' : 'td';
          let parsedCell = cell;
          if (parsedCell.startsWith('**') && parsedCell.endsWith('**')) {
            parsedCell = `<strong>${parsedCell.slice(2, -2)}</strong>`;
          }
          tableHtml += `<${cellTag} style="padding: 10px; text-align: left;">${parsedCell}</${cellTag}>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table>';
      return tableHtml;
    });

    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3 style="color: #0f172a; margin-top: 20px; margin-bottom: 10px; font-family: sans-serif; font-size: 15px; font-weight: 700;">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 style="color: #0f172a; margin-top: 25px; margin-bottom: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; font-family: sans-serif; font-size: 18px; font-weight: 700;">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 style="color: #0f172a; margin-top: 30px; margin-bottom: 15px; text-align: center; font-family: sans-serif; font-size: 22px; font-weight: 800;">$1</h1>');

    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullet points
    html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li style="margin-left: 20px; margin-bottom: 5px; color: #334155;">$1</li>');

    // Paragraphs
    const paragraphs = html.split('\n\n');
    return paragraphs.map(p => {
      const p_strip = p.trim();
      if (!p_strip) return "";
      if (p_strip.startsWith('<h') || p_strip.startsWith('<table') || p_strip.startsWith('<tr') || p_strip.startsWith('<blockquote') || p_strip.startsWith('<li')) {
        return p_strip;
      }
      return `<p style="margin-top: 0; margin-bottom: 15px; line-height: 1.6; color: #334155;">${p_strip.replace(/\n/g, '<br/>')}</p>`;
    }).join('\n');
  };

  // KPIs
  const kpis = React.useMemo(() => {
    const totalJobs = jobs.length;
    const totalApps = applications.length;
    const reviewApps = applications.filter(a => a.application_status === "review").length;
    const interviewApps = applications.filter(a => a.application_status === "interview").length;
    const offeredApps = applications.filter(a => a.application_status === "offered").length;
    
    // Average AI score for all candidates
    const avgScore = totalApps > 0 
      ? applications.reduce((acc, curr) => acc + parseFloat(curr.ai_score), 0) / totalApps 
      : 0;

    return { totalJobs, totalApps, reviewApps, interviewApps, offeredApps, avgScore: avgScore.toFixed(0) };
  }, [jobs, applications]);

  // Filtered applications
  const filteredApplications = React.useMemo(() => {
    return applications.filter(app => {
      const matchesJob = selectedJobId === "All" || app.job_id === selectedJobId;
      const matchesStatus = selectedStatus === "All" || app.application_status === selectedStatus;
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            app.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScore = parseFloat(app.ai_score) >= minScore;
      return matchesJob && matchesStatus && matchesSearch && matchesScore;
    });
  }, [applications, selectedJobId, selectedStatus, searchTerm, minScore]);

  if (loading || fetching) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#030014] text-white h-screen">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs text-zinc-400">Loading HR recruitment dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow flex flex-col pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full gap-8 text-left">
      
      {/* Header bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
            {user?.name ? user.name[0].toUpperCase() : "HR"}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              HR Recruitment Portal
              <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-2">
                HR Manager
              </Badge>
            </h1>
            <span className="text-xs text-zinc-400">Monitor applicant pipelines, inspect parsed resumes, and review AI scoring insights</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white text-xs rounded-full">
            <Link href="/portal/hr/copilot">
              <MessageSquare className="w-4 h-4 mr-1.5" /> AI Recruitment Copilot
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={logout}
            className="rounded-full border-border/40 hover:bg-white/5 text-xs text-zinc-400"
          >
            Log Out
          </Button>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="Recruitment Performance Indicators">
        <Card className="glassmorphism-card border-none p-5 flex flex-col justify-between">
          <div>
            <Briefcase className="w-5 h-5 text-primary mb-2" />
            <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Active Job Postings</span>
          </div>
          <span className="text-2xl font-extrabold text-white mt-2">{kpis.totalJobs}</span>
        </Card>
        <Card className="glassmorphism-card border-none p-5 flex flex-col justify-between">
          <div>
            <Users className="w-5 h-5 text-accent mb-2" />
            <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Total Applications</span>
          </div>
          <span className="text-2xl font-extrabold text-white mt-2">{kpis.totalApps}</span>
        </Card>
        <Card className="glassmorphism-card border-none p-5 flex flex-col justify-between">
          <div>
            <Clock className="w-5 h-5 text-yellow-500 mb-2" />
            <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Interview Pipeline</span>
          </div>
          <span className="text-2xl font-extrabold text-white mt-2">{kpis.interviewApps}</span>
        </Card>
        <Card className="glassmorphism-card border-none p-5 flex flex-col justify-between">
          <div>
            <Star className="w-5 h-5 text-green-500 mb-2" />
            <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Average Match Score</span>
          </div>
          <span className="text-2xl font-extrabold text-white mt-2">{kpis.avgScore}%</span>
        </Card>
      </section>

      {/* Filters Board */}
      <section className="bg-white/[0.02] border border-border/10 rounded-2xl p-5 flex flex-col md:flex-row gap-4" aria-label="Filters Panel">
        <div className="flex-grow flex items-center bg-black/20 border border-border/5 rounded-xl px-3 py-2 text-zinc-400 min-w-[200px]">
          <Search className="w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search candidate name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[9px] uppercase font-bold text-zinc-400">Position</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="py-2 px-3 bg-neutral-900 border border-border/40 text-xs rounded-xl text-white focus:outline-none"
            >
              <option value="All">All Jobs</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-[9px] uppercase font-bold text-zinc-400">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 bg-neutral-900 border border-border/40 text-xs rounded-xl text-white focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="review">Review</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-[9px] uppercase font-bold text-zinc-400">Min Match Score</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="py-2 px-3 bg-neutral-900 border border-border/40 text-xs rounded-xl text-white focus:outline-none"
            >
              <option value="0">Show All</option>
              <option value="50">&gt; 50% Match</option>
              <option value="75">&gt; 75% Match</option>
              <option value="90">&gt; 90% Match</option>
            </select>
          </div>
        </div>
      </section>

      {/* Candidates Pipeline Table */}
      <section className="glassmorphism-card border-none overflow-hidden" aria-labelledby="table-heading">
        <h2 id="table-heading" className="sr-only">Candidate Applications</h2>
        {filteredApplications.length === 0 ? (
          <div className="p-16 text-center text-zinc-400 text-xs">
            No candidates found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/10 bg-white/[0.02] text-zinc-400">
                  <th className="p-4 font-semibold uppercase">Candidate Info</th>
                  <th className="p-4 font-semibold uppercase">Target Position</th>
                  <th className="p-4 font-semibold uppercase text-center">AI Score</th>
                  <th className="p-4 font-semibold uppercase text-center">Status</th>
                  <th className="p-4 font-semibold uppercase text-right">Applied On</th>
                  <th className="p-4 font-semibold uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const matchingJob = jobs.find(j => j.id === app.job_id);
                  const score = parseFloat(app.ai_score);
                  
                  return (
                    <tr key={app.id} className="border-b border-border/5 hover:bg-white/[0.01]">
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-white text-sm">{app.name}</span>
                          <span className="text-zinc-400">{app.email}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{matchingJob?.title || "Applied Position"}</span>
                          <span className="text-zinc-500 text-[10px]">{matchingJob?.department}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <Badge className={`font-bold rounded-lg px-2 py-0.5 ${
                          score >= 85 
                            ? "bg-green-500/10 border-green-500/20 text-green-400" 
                            : score >= 70 
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                              : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        }`}>
                          {score.toFixed(0)}% Match
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <Badge className={`capitalize font-bold rounded-lg px-2.5 py-0.5 ${
                          app.application_status === "offered" 
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : app.application_status === "rejected"
                              ? "bg-red-500/10 border-red-500/20 text-red-400"
                              : app.application_status === "interview"
                                ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                                : "bg-neutral-500/10 border-neutral-500/20 text-zinc-400"
                        }`}>
                          {app.application_status}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-right text-zinc-400">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button 
                          onClick={() => handleSelectCandidate(app.id)}
                          className="bg-white/5 border border-border/40 hover:bg-white/10 text-white text-[11px] h-7 px-3 rounded-lg"
                        >
                          View Profile <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Candidate Profile Details Drawer / Sheet */}
      <Sheet open={selectedCandidateId !== null} onOpenChange={(open) => { if(!open) setSelectedCandidateId(null); }}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl bg-[#08051a] border-l border-border/10 overflow-y-auto text-white p-6 text-left">
          
          {loadingProfile || !candidateProfile ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-primary mb-2" />
              Loading Candidate Profile & AI Insights...
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* Drawer Header */}
              <SheetHeader className="p-0 border-b border-border/10 pb-4 text-left">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col">
                    <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-2.5 py-0.5 mb-2 w-max">
                      {jobs.find(j => j.id === candidateProfile.application.job_id)?.title || "Target Job"}
                    </Badge>
                    <SheetTitle className="text-xl font-bold text-white">{candidateProfile.application.name}</SheetTitle>
                    <SheetDescription className="text-zinc-400 text-xs flex items-center gap-2 mt-1">
                      <Mail className="w-3.5 h-3.5" /> {candidateProfile.application.email}
                      <span>•</span>
                      <Phone className="w-3.5 h-3.5" /> {candidateProfile.application.phone}
                    </SheetDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block font-semibold uppercase">AI Match Score</span>
                    <span className="text-3xl font-extrabold text-primary">{parseFloat(candidateProfile.application.ai_score).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Main Action Bar */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/5">
                  <Button onClick={handleReanalyze} disabled={reanalyzing} className="bg-white/5 border border-border/40 hover:bg-white/10 text-white text-[11px] h-8 rounded-lg">
                    {reanalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
                    Refresh Analysis
                  </Button>
                  <Button asChild className="bg-white/5 border border-border/40 hover:bg-white/10 text-white text-[11px] h-8 rounded-lg">
                    <a href={candidateProfile.application.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open Resume File
                    </a>
                  </Button>
                  
                  {/* Status transitions */}
                  <div className="flex gap-1 ml-auto">
                    {candidateProfile.application.application_status !== "review" && (
                      <Button onClick={() => handleUpdateStatus("review")} variant="outline" className="border-border/40 hover:bg-white/5 text-[10px] h-8 px-2.5 rounded-lg text-zinc-300">
                        Mark Under Review
                      </Button>
                    )}
                    {candidateProfile.application.application_status !== "interview" && (
                      <Button onClick={() => handleUpdateStatus("interview")} className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] h-8 px-2.5 rounded-lg">
                        Invite to Interview
                      </Button>
                    )}
                    {candidateProfile.application.application_status !== "offered" ? (
                      <Button onClick={handleOpenOfferModal} className="bg-green-600 hover:bg-green-700 text-white text-[10px] h-8 px-2.5 rounded-lg">
                        Extend Offer
                      </Button>
                    ) : (
                      <Button onClick={handleOpenOfferModal} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] h-8 px-2.5 rounded-lg">
                        View Offer Letter
                      </Button>
                    )}
                    {candidateProfile.application.application_status !== "rejected" && (
                      <Button onClick={() => handleUpdateStatus("rejected")} className="bg-red-950/40 border border-red-500/20 hover:bg-red-900/40 text-red-400 text-[10px] h-8 px-2.5 rounded-lg">
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </SheetHeader>

              {/* Parsed content & analysis tabs */}
              <div className="flex flex-col gap-6 text-sm">
                
                {/* Summary block */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-zinc-400">AI Profile Summary</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed bg-white/[0.01] border border-border/5 p-4 rounded-xl">
                    {candidateProfile.analysis?.summary || "No parsed summary available."}
                  </p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-green-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" /> Key Strengths
                    </h3>
                    <ul className="list-disc list-inside text-zinc-300 text-xs flex flex-col gap-1">
                      {candidateProfile.analysis?.strengths ? (
                        candidateProfile.analysis.strengths.map((str: string, i: number) => <li key={i}>{str}</li>)
                      ) : (
                        <li>No strengths parsed.</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-red-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-400" /> Gaps / Development Areas
                    </h3>
                    <ul className="list-disc list-inside text-zinc-300 text-xs flex flex-col gap-1">
                      {candidateProfile.analysis?.weaknesses ? (
                        candidateProfile.analysis.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)
                      ) : (
                        <li>No gaps/weaknesses identified.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Parsed Experience / Education structure */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-zinc-400">Parsed Experience & Education</h3>
                  <div className="flex flex-col gap-2.5 bg-black/20 p-4 border border-border/5 rounded-xl">
                    
                    {/* Education list */}
                    {candidateProfile.analysis?.parsed_resume?.education && candidateProfile.analysis.parsed_resume.education.length > 0 && (
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-bold text-white flex items-center gap-1 text-[11px] uppercase tracking-wider text-accent">
                          <GraduationCap className="w-4 h-4 text-accent" /> Education
                        </span>
                        {candidateProfile.analysis.parsed_resume.education.map((edu: any, idx: number) => (
                          <div key={idx} className="pl-5 border-l border-border/10 py-1 flex justify-between">
                            <div>
                              <strong className="text-white">{edu.degree} in {edu.field}</strong>
                              <span className="block text-zinc-400 text-[10px]">{edu.school}</span>
                            </div>
                            <span className="text-zinc-500 text-[10px]">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Experience list */}
                    {candidateProfile.analysis?.parsed_resume?.experience && candidateProfile.analysis.parsed_resume.experience.length > 0 && (
                      <div className="flex flex-col gap-1 text-xs mt-3">
                        <span className="font-bold text-white flex items-center gap-1 text-[11px] uppercase tracking-wider text-primary">
                          <Briefcase className="w-4 h-4 text-primary" /> Experience
                        </span>
                        {candidateProfile.analysis.parsed_resume.experience.map((exp: any, idx: number) => (
                          <div key={idx} className="pl-5 border-l border-border/10 py-2 flex flex-col gap-0.5">
                            <div className="flex justify-between items-start">
                              <strong className="text-white">{exp.title}</strong>
                              <span className="text-zinc-500 text-[10px]">{exp.start_date} - {exp.end_date}</span>
                            </div>
                            <span className="text-zinc-400 text-[10px] font-semibold">{exp.company}</span>
                            {exp.description && (
                              <p className="text-[10px] text-zinc-500 leading-normal mt-1">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI-Generated Interview Questions */}
                {candidateProfile.analysis?.recommended_interview_questions && candidateProfile.analysis.recommended_interview_questions.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-zinc-400">AI-Generated Interview Questions</h3>
                    <div className="flex flex-col gap-3">
                      {candidateProfile.analysis.recommended_interview_questions.map((q: any, i: number) => (
                        <div key={i} className="bg-white/[0.01] border border-border/5 p-3 rounded-xl flex flex-col gap-1.5 text-xs text-left">
                          <span className="font-bold text-primary">Question {i+1}: {q.question}</span>
                          <span className="text-zinc-400 text-[10px]"><strong>Intent:</strong> {q.purpose}</span>
                          <span className="text-zinc-500 text-[10px]"><strong>Expected Response:</strong> {q.expected_answer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Raise Offer Letter Modal */}
      <Dialog open={offerModalOpen} onOpenChange={setOfferModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#07051a] border border-border/10 text-white p-6 rounded-xl">
          <DialogHeader className="border-b border-border/10 pb-4 text-left">
            <DialogTitle className="text-xl font-bold text-white">
              {offerStatus === "sent" ? "View Sent Offer Letter" : "Raise Employment Offer Letter (INR)"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Provide CTC details and candidate coordinates. Our Recruitment Copilot will draft the A4 contract based on standard legal formats.
            </DialogDescription>
          </DialogHeader>

          {offerStep === "form" ? (
            <div className="flex flex-col gap-5 my-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Column 1: Candidate Details */}
                <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-border/5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary">Candidate Coordinates</h3>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase">Full Name</label>
                    <Input 
                      value={offerName} 
                      onChange={(e) => setOfferName(e.target.value)} 
                      className="bg-black/20 border-border/40 focus:border-primary text-xs text-white" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase">Email Address</label>
                    <Input 
                      type="email"
                      value={offerEmail} 
                      onChange={(e) => setOfferEmail(e.target.value)} 
                      className="bg-black/20 border-border/40 focus:border-primary text-xs text-white" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase">Contact Number</label>
                    <Input 
                      value={offerPhone} 
                      onChange={(e) => setOfferPhone(e.target.value)} 
                      className="bg-black/20 border-border/40 focus:border-primary text-xs text-white" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase">Residential Address</label>
                    <Textarea 
                      rows={3}
                      value={offerAddress} 
                      onChange={(e) => setOfferAddress(e.target.value)} 
                      placeholder="Enter candidate's complete postal address"
                      className="bg-black/20 border-border/40 focus:border-primary text-xs text-white min-h-[80px]" 
                    />
                  </div>
                </div>

                {/* Column 2: Offer Info */}
                <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-border/5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-accent">Compensation Structure</h3>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase">Annual CTC (INR)</label>
                    <Input 
                      value={annualCTC} 
                      onChange={(e) => setAnnualCTC(e.target.value)} 
                      placeholder="e.g. 924000 or 9,24,000"
                      className="bg-black/20 border-border/40 focus:border-primary text-xs text-white" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase">Variable Pay (Annual INR)</label>
                    <Input 
                      value={variablePay} 
                      onChange={(e) => setVariablePay(e.target.value)} 
                      placeholder="e.g. 0 or 100000"
                      className="bg-black/20 border-border/40 focus:border-primary text-xs text-white" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase">Custom Notes / Template Reference</label>
                    <Textarea 
                      rows={5}
                      value={additionalNotes} 
                      onChange={(e) => setAdditionalNotes(e.target.value)} 
                      placeholder="Paste formatting instructions, customized clauses, or another company's sample letter to mimic layout details."
                      className="bg-black/20 border-border/40 focus:border-primary text-xs text-white min-h-[110px]" 
                    />
                  </div>
                </div>

              </div>
              
              <DialogFooter className="mt-4 pt-4 border-t border-border/5">
                <Button variant="outline" onClick={() => setOfferModalOpen(false)} className="border-border/40 hover:bg-white/5 text-xs text-zinc-300">
                  Cancel
                </Button>
                <Button onClick={handleGenerateOffer} disabled={raisingOffer || !annualCTC} className="bg-primary hover:bg-primary/90 text-white font-medium text-xs rounded px-4 h-9">
                  {raisingOffer ? <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> : null}
                  Draft Offer Letter
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="flex flex-col gap-4 my-2 text-left">
              {/* Document Action Panel */}
              <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-border/5">
                <Button 
                  onClick={() => setIsPreviewEditMode(!isPreviewEditMode)} 
                  variant="outline" 
                  className="border-border/40 hover:bg-white/5 text-xs text-zinc-300 h-8"
                >
                  {isPreviewEditMode ? (
                    <>
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> View PDF Preview
                    </>
                  ) : (
                    <>
                      <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Letter Text
                    </>
                  )}
                </Button>

                <Button 
                  onClick={handlePrintPDF} 
                  variant="outline" 
                  className="border-border/40 hover:bg-white/5 text-xs text-zinc-300 h-8"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" /> Print / Download PDF
                </Button>

                {offerStatus !== "sent" && (
                  <Button 
                    onClick={() => setOfferStep("form")} 
                    variant="outline" 
                    className="border-border/40 hover:bg-white/5 text-xs text-zinc-300 h-8"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Re-configure
                  </Button>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Offer Status:</span>
                  <Badge className={offerStatus === "sent" ? "bg-green-500/10 border-green-500/20 text-green-400 font-bold text-[10px] capitalize" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 font-bold text-[10px] capitalize"}>
                    {offerStatus === "sent" ? "Approved & Sent" : "Draft"}
                  </Badge>
                </div>
              </div>

              {/* Preview Content */}
              <div className="overflow-x-auto max-h-[55vh] p-2 bg-black/40 rounded-xl border border-border/5">
                {isPreviewEditMode ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={offerLetterText}
                      onChange={(e) => setOfferLetterText(e.target.value)}
                      className="w-full min-h-[45vh] bg-black/50 text-white font-mono p-4 border border-border/40 focus:border-primary text-xs leading-normal resize-y"
                    />
                    <p className="text-[10px] text-zinc-400">
                      * Markdown syntax is supported. Double newline inserts paragraph breaks. Standard markdown tables render as corporate components.
                    </p>
                  </div>
                ) : (
                  /* A4 Paper Container with Company Notepad */
                  <div 
                    id="offer-notepad-print-area" 
                    className="bg-white text-slate-800 p-12 shadow-2xl rounded-sm border border-slate-200 mx-auto w-[210mm] min-h-[297mm] text-[13px] leading-relaxed select-text font-serif text-left"
                  >
                    {/* Company Notepad Header */}
                    <div style={{ textAlign: "center", borderBottom: "2px double #cbd5e1", paddingBottom: "15px", marginBottom: "25px" }}>
                      <h1 style={{ color: "#0f172a", margin: 0, fontFamily: "sans-serif", fontSize: "26px", fontWeight: "800", letterSpacing: "-0.03em", textTransform: "uppercase" }}>
                        INDUSNET <span style={{ color: "#2563eb" }}>AI</span>
                      </h1>
                      <p style={{ color: "#64748b", margin: "3px 0", fontFamily: "sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: "600" }}>
                        Next-Gen Enterprise Recruitment
                      </p>
                      <div style={{ marginTop: "8px", fontFamily: "sans-serif", fontSize: "9px", color: "#475569", lineHeight: "1.4" }}>
                        Velachery HQ: Number 46 First Floor, Tansi Nagar, Velachery, Chennai, India 600042 | Phone: +91-9884915977<br />
                        Singapore Branch: 51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park, SG 408933 | Phone: +65-9448-3805
                      </div>
                    </div>

                    {/* Letter Body Rendered */}
                    <div 
                      className="offer-letter-document-body"
                      dangerouslySetInnerHTML={{ __html: renderMarkdownToHTML(offerLetterText) }} 
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4 pt-4 border-t border-border/5">
                <Button variant="outline" onClick={() => setOfferModalOpen(false)} className="border-border/40 hover:bg-white/5 text-xs text-zinc-300">
                  Close
                </Button>
                
                {offerStatus !== "sent" && (
                  <>
                    <Button onClick={handleSaveOfferDraft} disabled={raisingOffer} className="bg-white/5 border border-border/40 hover:bg-white/10 text-white text-xs px-4 h-9">
                      <Save className="w-3.5 h-3.5 mr-1.5" /> Save Draft
                    </Button>
                    <Button onClick={handleApproveAndSendOffer} disabled={raisingOffer} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 h-9">
                      {raisingOffer ? <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
                      Approve & Send Offer Email
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </main>
  );
}
