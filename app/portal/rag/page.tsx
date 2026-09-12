"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Lock, Mail, AlertCircle, Eye, EyeOff, Bot, Database, Search, 
  FileText, Upload, Sparkles, LogOut, CheckCircle2, ShieldCheck, 
  Cpu, ArrowRight, Play, RefreshCw, Layers, Plus, Filter, 
  Download, ExternalLink, HardDrive, Terminal, HelpCircle, FileCode, Check
} from "lucide-react";
import Link from "next/link";

// Sample Pre-indexed Collections
const INITIAL_COLLECTIONS = [
  { id: "metro_fin_v2", name: "Metro Financial Underwriting Rules", docsCount: 142, chunksCount: 18450, updated: "2 hours ago" },
  { id: "mnre_reg_2026", name: "MNRE Renewable Energy Guidelines", docsCount: 89, chunksCount: 11200, updated: "1 day ago" },
  { id: "careall_hipaa", name: "CareAll EHR Diagnostic Standards", docsCount: 64, chunksCount: 8900, updated: "3 days ago" }
];

// Sample Indexed Documents
const INITIAL_DOCUMENTS = [
  { id: "doc-1", filename: "Metro_Underwriting_Guidelines_v4.2.pdf", size: "4.8 MB", chunks: 320, type: "PDF", uploadedAt: "2026-07-20", status: "Sample Document" },
  { id: "doc-2", filename: "Commercial_Loan_Compliance_2026.docx", size: "2.1 MB", chunks: 145, type: "DOCX", uploadedAt: "2026-07-21", status: "Sample Document" },
  { id: "doc-3", filename: "Risk_Mitigation_Matrix_PHI.pdf", size: "7.4 MB", chunks: 512, type: "PDF", uploadedAt: "2026-07-22", status: "Sample Document" },
  { id: "doc-4", filename: "ESG_Debt_Tier_Specifications.sql", size: "1.2 MB", chunks: 98, type: "SQL", uploadedAt: "2026-07-24", status: "Sample Document" }
];

// Sample Pre-loaded RAG Chat Sessions & Responses
const SAMPLE_QUERIES = [
  "What are the Tier-1 underwriting debt-to-income limits for commercial green bonds?",
  "Summarize Section 4.2 risk mitigation protocols for non-recourse infrastructure loans.",
  "What compliance documents are required for private subnet vector storage?"
];

const PRESET_RESPONSES: Record<string, { answer: string; sources: { doc: string; chunk: string; similarity: string; excerpt: string }[] }> = {
  "What are the Tier-1 underwriting debt-to-income limits for commercial green bonds?": {
    answer: "According to Metro Financial Underwriting Guidelines v4.2 (Section 8.1), Tier-1 commercial green bond issuances enforce a strict Maximum Debt-to-Income (DTI) ratio of 42.5%. For projects exceeding $50M in capital expenditure, an adjusted Debt Service Coverage Ratio (DSCR) of 1.35x is mandatory prior to credit committee sign-off.",
    sources: [
      { doc: "Metro_Underwriting_Guidelines_v4.2.pdf", chunk: "Chunk #108 (p. 44)", similarity: "High Relevance", excerpt: "Tier-1 commercial green bond issuances enforce a strict Maximum DTI ratio of 42.5%. For projects exceeding $50M in CapEx, DSCR threshold must equal or exceed 1.35x..." },
      { doc: "Commercial_Loan_Compliance_2026.docx", chunk: "Chunk #42 (p. 12)", similarity: "High Relevance", excerpt: "Green energy credit facility compliance requires dual verification of CapEx limits and DTI ceilings under Section 8.1 standards." }
    ]
  },
  "Summarize Section 4.2 risk mitigation protocols for non-recourse infrastructure loans.": {
    answer: "Section 4.2 mandates a three-tier risk mitigation framework for non-recourse infrastructure financing:\n1. 100% Escrow Account Reserve covering 6 months of debt principal & interest.\n2. Independent Engineering Performance Guarantee from an accredited audit firm.\n3. Mandatory Business Interruption Insurance with a minimum indemnity period of 180 days.",
    sources: [
      { doc: "Risk_Mitigation_Matrix_PHI.pdf", chunk: "Chunk #215 (p. 89)", similarity: "High Relevance", excerpt: "Section 4.2: Non-recourse infrastructure loans require 6-month escrow reserve funding, independent performance guarantees, and 180-day indemnity coverage..." }
    ]
  },
  "What compliance documents are required for private subnet vector storage?": {
    answer: "Private subnet deployment of vector store requires:\n- SOC-2 Type II Compliance Certificate\n- VPC Isolation Architecture Diagram (no public ingress/egress)\n- TLS 1.3 Encryption-in-transit and AES-256 Encryption-at-rest keys\n- Zero Data Retention Attestation from model inference providers.",
    sources: [
      { doc: "Commercial_Loan_Compliance_2026.docx", chunk: "Chunk #88 (p. 27)", similarity: "High Relevance", excerpt: "VPC vector database cluster provisioning requires verified AES-256 encryption at rest and zero egress logging..." }
    ]
  }
};

export default function RAGPortalPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("analyst@metrofinancial.com");
  const [password, setPassword] = useState<string>("••••••••••••");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");

  // RAG App state
  const [selectedCollection, setSelectedCollection] = useState(INITIAL_COLLECTIONS[0]);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "assistant"; text: string; sources?: any[]; timestamp: string }>>([
    {
      sender: "assistant",
      text: "Welcome to the Indusnet AI RAG Engine Interactive Demo. How can I assist your compliance research today?",
      timestamp: "09:00 AM"
    }
  ]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"chat" | "documents" | "settings">("chat");

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTab, setUploadTab] = useState<"file" | "web" | "youtube" | "podcast">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>("");
  const [webUrl, setWebUrl] = useState<string>("");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSearching]);

  // Handle Login via Backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/backend/rag/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("rag_token", data.access_token);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(true); // Fallback to client auth
      }
    } catch (err) {
      setIsAuthenticated(true); // Fallback
    } finally {
      setLoginLoading(false);
    }
  };

  // One-click Demo Sign In
  const handleDemoSignIn = () => {
    setEmail("analyst@metrofinancial.com");
    setPassword("demo123");
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      setIsAuthenticated(true);
    }, 400);
  };

  // Handle RAG Search Query via Backend API
  const handleSendQuery = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isSearching) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Push user message
    setMessages((prev) => [...prev, { sender: "user", text: query, timestamp: timeStr }]);
    if (!textToSend) setInputQuery("");
    setIsSearching(true);

    try {
      const res = await fetch("/api/backend/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, collection_name: selectedCollection.id })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            text: data.answer,
            sources: data.sources,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsSearching(false);
        return;
      }
    } catch (err) {
      // Proceed to fallback preset response if backend offline
    }

    // Fallback RAG Pipeline Simulation
    setTimeout(() => {
      const preset = PRESET_RESPONSES[query];
      const answerText = preset 
        ? preset.answer 
        : `Synthesizing response for query: "${query}" across ${selectedCollection.docsCount} pre-indexed compliance documents.\n\nKey Finding: Based on the sample compliance documents, the system identified relevant reference sections. All compliance constraints are aligned with standard guidelines.`;

      const sourceList = preset ? preset.sources : [
        { doc: documents[0]?.filename || "Metro_Underwriting_Guidelines.pdf", chunk: "Section (p. 6)", similarity: "Sample Match", excerpt: "Sample relevant text passage from document reference..." },
        { doc: documents[1]?.filename || "Compliance_Log.docx", chunk: "Section (p. 22)", similarity: "Sample Match", excerpt: "Verified against compliance policies..." }
      ];

      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: answerText,
          sources: sourceList,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsSearching(false);
    }, 1200);
  };

  // Handle File Pick from Native File Explorer
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadFileName(file.name);
    }
  };

  // Handle Drag and Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setUploadFileName(file.name);
    }
  };

  // Handle Ingestion Submit (Files, Web, YouTube, Audio)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let name = uploadFileName || (selectedFile ? selectedFile.name : "");

    if (uploadTab === "web") {
      if (!webUrl) return;
      name = webUrl.replace(/^https?:\/\//, '').slice(0, 30) + " (Web Page)";
    } else if (uploadTab === "youtube") {
      if (!youtubeUrl) return;
      name = "YouTube Transcript: " + youtubeUrl.slice(-11);
    } else if (!name) {
      return;
    }

    setUploadStatus("Uploading source file -> Extracting text chunks -> Generating embeddings -> Indexing demo collection...");

    // Try backend upload endpoint if file selected
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("file_name", name);

        const res = await fetch("/api/backend/rag/upload", {
          method: "POST",
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          setDocuments((prev) => [data.document, ...prev]);
          setSelectedFile(null);
          setUploadFileName("");
          setUploadStatus("");
          setShowUploadModal(false);
          return;
        }
      } catch (err) {
        // Fallback to local ingestion
      }
    }

    // Fallback Ingestion Pipeline
    setTimeout(() => {
      const fileSizeStr = selectedFile 
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        : uploadTab === "web" ? "Web Source" : uploadTab === "youtube" ? "Audio Transcript" : "3.4 MB";

      const newDoc = {
        id: `doc-${Date.now()}`,
        filename: name.endsWith('.pdf') || name.endsWith('.docx') || name.includes('(') ? name : `${name}.pdf`,
        size: fileSizeStr,
        chunks: Math.floor(Math.random() * 150) + 40,
        type: uploadTab === "web" ? "URL" : uploadTab === "youtube" ? "YOUTUBE" : uploadTab === "podcast" ? "AUDIO" : name.split('.').pop()?.toUpperCase() || "PDF",
        uploadedAt: new Date().toISOString().split('T')[0],
        status: "Indexed (Demo)"
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedFile(null);
      setUploadFileName("");
      setWebUrl("");
      setYoutubeUrl("");
      setUploadStatus("");
      setShowUploadModal(false);
    }, 1400);
  };

  // IF NOT AUTHENTICATED: Render Demo Entrance Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center relative overflow-hidden bg-background">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 -z-10 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[130px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Demo / Prototype Banner */}
          <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs p-3.5 rounded-2xl mb-4 flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-800 dark:text-amber-200">[Demo / Prototype Only]</strong>
              <p className="text-[11px] mt-0.5 text-amber-700/90 dark:text-amber-300/90">
                This RAG workstation is an interactive frontend prototype demonstrating vector search workflows using static sample dataset collections.
              </p>
            </div>
          </div>

          <Card className="glassmorphism-card border border-border shadow-2xl overflow-hidden rounded-3xl">
            <CardContent className="p-8 md:p-10 flex flex-col gap-6">
              {/* Header */}
              <div className="text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <Badge className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full px-3 py-0.5 text-[10px] uppercase font-bold tracking-wider mb-2">
                    Static Prototype
                  </Badge>
                  <h1 className="text-2xl font-extrabold text-foreground tracking-tight font-heading">
                    RAG Portal Demo
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Indusnet AI Vector Search & Document QA Workstation
                  </p>
                </div>
              </div>

              {/* Enter Demo Button */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={loginLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold h-11 hover:brightness-110 shadow-lg shadow-primary/20 transition-all gap-2"
                >
                  {loginLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Loading Demo Workstation...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4" /> Enter RAG Demo Workstation <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>

              <div className="pt-2 text-center border-t border-border/50">
                <p className="text-[11px] text-muted-foreground">
                  Need a custom enterprise RAG cluster setup?{" "}
                  <Link href="/contact" className="text-primary hover:underline font-medium">
                    Contact Architect
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // AUTHENTICATED: Render RAG Workspace Dashboard
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 container mx-auto flex flex-col gap-6">
      {/* Demo / Prototype Banner */}
      <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>
            <strong className="font-semibold text-amber-800 dark:text-amber-200">[Demo / Prototype Only]</strong> Interactive RAG workstation preview with static sample collections.
          </span>
        </div>
        <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] uppercase font-mono hidden sm:inline-flex">
          Sample Data
        </Badge>
      </div>

      {/* Top Header Bar */}
      <Card className="glassmorphism-card border border-border rounded-2xl overflow-hidden">
        <CardContent className="p-4 md:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-foreground text-base tracking-tight">RAG Workstation (Demo)</h1>
                <Badge className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] rounded px-2 font-mono">
                  Static Prototype
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>Model: <strong className="text-foreground font-mono">Sample RAG Simulation</strong></span>
                <span>•</span>
                <span>Vector DB: <strong className="text-foreground font-mono">Static Sample Collection</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-1 rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo User</span>
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuthenticated(false)}
              className="rounded-lg border-border hover:bg-muted text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main RAG Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Vector Collections & Documents */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Active Collection Switcher */}
          <Card className="glassmorphism-card border border-border rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xs uppercase text-primary tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-primary" /> Static Sample Collections
                </h2>
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-mono">
                  Sample Data
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                {INITIAL_COLLECTIONS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollection(col)}
                    className={`p-3 rounded-xl text-left border transition-all flex flex-col gap-1 ${
                      selectedCollection.id === col.id
                        ? "bg-primary/15 border-primary/40 shadow-sm"
                        : "bg-muted/40 border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">{col.name}</span>
                      {selectedCollection.id === col.id && (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{col.chunksCount.toLocaleString()} vector chunks</span>
                      <span>Updated {col.updated}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Indexed Documents Panel */}
          <Card className="glassmorphism-card border border-border rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xs uppercase text-accent tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-accent" /> Indexed Files ({documents.length})
                </h2>
                <Button
                  size="sm"
                  onClick={() => setShowUploadModal(true)}
                  className="rounded-lg bg-accent text-white text-xs hover:brightness-110 h-7 px-2.5 gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Upload File
                </Button>
              </div>

              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-muted/30 border border-border rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <FileCode className="w-4 h-4 text-primary" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-xs text-foreground truncate">{doc.filename}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.size} • {doc.chunks} chunks</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-mono flex-shrink-0">
                      {doc.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Main Area: Interactive RAG Chat Assistant */}
        <div className="lg:col-span-8">
          <Card className="glassmorphism-card border border-border rounded-2xl overflow-hidden flex flex-col h-[640px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="font-bold text-xs text-foreground uppercase tracking-wider">RAG Query Assistant</span>
                <span className="text-xs text-muted-foreground">• Active: <strong className="text-foreground">{selectedCollection.name}</strong></span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessages([{
                  sender: "assistant",
                  text: "Chat cleared. Ask a new question to run RAG vector retrieval.",
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }])}
                className="text-[11px] text-muted-foreground hover:text-foreground h-7"
              >
                Clear Conversation
              </Button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-black/10">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-none shadow-md"
                        : "bg-muted/90 border border-border text-foreground rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Cited RAG Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-border/40 flex flex-col gap-2">
                        <span className="text-[10px] uppercase font-bold text-accent tracking-wider flex items-center gap-1">
                          <Database className="w-3 h-3" /> Retrieved Citations ({msg.sources.length})
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.sources.map((src: any, sIdx: number) => (
                            <div key={sIdx} className="bg-background/80 border border-border p-2.5 rounded-lg flex flex-col gap-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-semibold text-primary">{src.doc}</span>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-mono">
                                  {src.similarity} Match
                                </Badge>
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground">{src.chunk}</span>
                              <p className="text-[10px] italic text-muted-foreground/90 bg-muted/40 p-1.5 rounded border border-border/30">
                                "{src.excerpt}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-muted-foreground px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isSearching && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted/40 border border-border rounded-xl w-fit animate-pulse">
                  <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                  <span>Searching knowledge base & generating citations...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Sample Queries */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-muted-foreground uppercase flex-shrink-0">Sample Queries:</span>
              {SAMPLE_QUERIES.map((sq, sqIdx) => (
                <button
                  key={sqIdx}
                  onClick={() => handleSendQuery(sq)}
                  className="text-[11px] bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
                >
                  "{sq.slice(0, 45)}..."
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 border-t border-border bg-muted/40 flex items-center gap-3">
              <Input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                placeholder="Ask a question about guidelines, loan rules, or compliance..."
                className="bg-muted border-border text-foreground text-xs h-10 rounded-xl focus-visible:ring-primary/60"
              />
              <Button
                onClick={() => handleSendQuery()}
                disabled={!inputQuery.trim() || isSearching}
                className="rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold h-10 px-5 hover:brightness-110 flex-shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Upload / Ingest Source Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glassmorphism-card border border-border max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl">
            <CardContent className="p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Upload className="w-4 h-4 text-accent" /> Ingest Knowledge Source
                </h3>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-muted rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setUploadTab("file")}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                    uploadTab === "file" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab("web")}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                    uploadTab === "web" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Web Page
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab("youtube")}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                    uploadTab === "youtube" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  YouTube
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab("podcast")}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                    uploadTab === "podcast" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Audio/Podcast
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
                {uploadTab === "file" && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".pdf,.docx,.doc,.txt,.sql,.csv,.mp3,.wav"
                      className="hidden"
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Document Title / Target Label</label>
                      <Input
                        type="text"
                        required
                        value={uploadFileName}
                        onChange={(e) => setUploadFileName(e.target.value)}
                        placeholder="e.g. ESG_Compliance_Report_2026.pdf"
                        className="bg-muted border-border text-foreground text-xs rounded-xl"
                      />
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-primary/40 hover:border-primary p-6 rounded-xl text-center flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group"
                    >
                      <Upload className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {selectedFile ? selectedFile.name : "Click to select a file or Drag & Drop"}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {selectedFile 
                            ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Indexing`
                            : "Supports PDF, DOCX, TXT, SQL, and CSV files"}
                        </p>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] rounded px-2.5 py-0.5 mt-1 font-mono">
                        {selectedFile ? "File Selected" : "Browse Files"}
                      </Badge>
                    </div>
                  </>
                )}

                {uploadTab === "web" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Target Web Page URL</label>
                    <Input
                      type="url"
                      required
                      value={webUrl}
                      onChange={(e) => setWebUrl(e.target.value)}
                      placeholder="https://mnre.gov.in/guidelines/renewable-policy-2026"
                      className="bg-muted border-border text-foreground text-xs rounded-xl"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Extracts clean text, cleans HTML boilerplate, and stores vector embeddings.</p>
                  </div>
                )}

                {uploadTab === "youtube" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">YouTube Video URL</label>
                    <Input
                      type="url"
                      required
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=example"
                      className="bg-muted border-border text-foreground text-xs rounded-xl"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Fetches auto-generated/closed caption transcripts for semantic search.</p>
                  </div>
                )}

                {uploadTab === "podcast" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Audio File Name / Podcast Episode</label>
                    <Input
                      type="text"
                      required
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      placeholder="e.g. Energy_Sector_Keynote_Speech.mp3"
                      className="bg-muted border-border text-foreground text-xs rounded-xl"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Runs Whisper speech-to-text transcription before vector embedding.</p>
                  </div>
                )}

                {uploadStatus && (
                  <p className="text-[11px] text-primary font-mono bg-primary/10 p-2.5 rounded-lg border border-primary/20 animate-pulse">
                    {uploadStatus}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    className="rounded-xl text-xs border-border text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-primary text-white text-xs font-semibold"
                  >
                    Ingest & Index Source
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
