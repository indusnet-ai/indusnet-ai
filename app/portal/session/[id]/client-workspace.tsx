"use client";

import * as React from "react";
import { useAuth, API_BASE_URL } from "../../auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, HelpCircle, 
  Send, Paperclip, FileText, X, Activity, User, Bot, UploadCloud 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientSessionWorkspace({ sessionId }: { sessionId: string }) {
  const { user, apiFetch, loading } = useAuth();
  const router = useRouter();

  const [session, setSession] = React.useState<any>(null);
  const [tender, setTender] = React.useState<any>(null);
  const [matrix, setMatrix] = React.useState<any[]>([]);
  const [chats, setChats] = React.useState<any[]>([]);
  const [fetching, setFetching] = React.useState(true);

  const [message, setMessage] = React.useState("");
  const [attachedFile, setAttachedFile] = React.useState<File | null>(null);
  const [sending, setSending] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/portal");
      return;
    }
    if (user) {
      loadSessionDetails();
    }
  }, [user, loading]);

  React.useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const loadSessionDetails = async () => {
    try {
      setFetching(true);
      const data = await apiFetch(`/sessions/${sessionId}`);
      setSession(data.session);
      setTender(data.tender);
      setMatrix(data.requirement_matrix);
      setChats(data.chats);
    } catch (err) {
      console.error("Error loading session:", err);
      alert("Failed to load workspace details");
      router.push("/portal/dashboard");
    } finally {
      setFetching(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setAttachedFile(file);
      } else {
        alert("Only PDF files are supported for automated compliance extraction.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setAttachedFile(file);
      } else {
        alert("Only PDF files are supported.");
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !attachedFile) return;

    setSending(true);
    const formData = new FormData();
    formData.append("message", message);
    if (attachedFile) {
      formData.append("file", attachedFile);
    }

    // Optimistic User Msg update
    const userMsgContent = message + (attachedFile ? `\n[Uploaded Document: ${attachedFile.name}]` : "");
    const tempUserMsg = {
      id: "temp-user",
      sender: "user",
      message: userMsgContent,
      created_at: new Date().toISOString(),
    };
    setChats((prev) => [...prev, tempUserMsg]);
    setMessage("");
    setAttachedFile(null);

    try {
      const savedToken = localStorage.getItem("copilot_token");
      const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();
      
      // Update session details from response
      setSession((prev: any) => ({
        ...prev,
        compliance_score: data.compliance_score,
      }));
      setMatrix(data.requirement_matrix);
      
      // Add actual agent message
      const agentMsg = {
        id: "temp-agent-" + Date.now(),
        sender: "agent",
        message: data.response,
        created_at: new Date().toISOString(),
      };
      setChats((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      console.error(err);
      alert("Error sending message: " + err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs text-muted-foreground">Loading bidding workspace...</span>
        </div>
      </div>
    );
  }

  const score = session ? parseFloat(session.compliance_score) : 0.00;

  return (
    <div className="flex-grow flex flex-col h-screen max-h-screen overflow-hidden pt-20">
      {/* Top Header Bar */}
      <div className="bg-[#030014]/60 backdrop-blur-md border-b border-border/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full">
            <Link href="/portal/dashboard">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex flex-col text-left">
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              {tender?.title || "Tender Loading..."}
            </h1>
            <span className="text-[10px] text-muted-foreground">Active Compliance Scoping Workspace</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Compliance Score:</span>
          <Badge className="bg-primary/20 border-primary/30 text-primary font-bold text-xs rounded px-2.5 py-0.5">
            {score.toFixed(0)}%
          </Badge>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Checklist panel (40% width) */}
        <div className="w-full md:w-[40%] border-r border-border/10 flex flex-col overflow-y-auto bg-white/[0.01] p-6 text-left gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Requirement Matrix Checklist</h2>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Upload compliance documents in the chat window to satisfy individual checklist items. The agent automatically reviews files and registers audit notes.
            </p>
          </div>

          {/* Checklist progress bar */}
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-border/10">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500" 
              style={{ width: `${score}%` }}
            />
          </div>

          {/* Checklist Items list */}
          <div className="flex flex-col gap-4">
            {matrix.map((req, idx) => (
              <Card key={req.id || idx} className="bg-white/5 border-border/10 p-4 rounded-lg flex flex-col gap-2 relative overflow-hidden">
                {/* Visual Status Indicator strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  req.status === "verified" 
                    ? "bg-green-500" 
                    : req.status === "missing" 
                      ? "bg-red-500" 
                      : "bg-muted-foreground/30"
                }`} />

                <div className="flex items-start justify-between gap-2 pl-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white">{req.title}</span>
                    <span className="text-[10px] text-muted-foreground leading-relaxed">
                      {req.description}
                    </span>
                  </div>
                  {req.status === "verified" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  ) : req.status === "missing" ? (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                  )}
                </div>

                {req.notes && (
                  <div className="mt-1.5 pt-2 border-t border-border/5 pl-2 text-[10px] text-muted-foreground italic bg-black/10 p-2 rounded">
                    <strong>Audit Proof:</strong> {req.notes}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Right Chat panel (60% width) */}
        <div 
          className={`w-full md:w-[60%] flex flex-col justify-between overflow-hidden relative ${
            dragActive ? "bg-primary/5 border-2 border-dashed border-primary/50" : ""
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {/* DRAG AND DROP OVERLAY INDICATION */}
          {dragActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#030014]/90 z-20 pointer-events-none">
              <UploadCloud className="w-12 h-12 text-primary animate-bounce" />
              <span className="text-xs font-bold text-white">Drop Bid compliance PDF to parse</span>
              <span className="text-[10px] text-muted-foreground">Supported format: PDF documents</span>
            </div>
          )}

          {/* Chat Messages Log */}
          <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
            {chats.length === 0 ? (
              <div className="my-auto flex flex-col items-center gap-4 text-center p-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div className="flex flex-col gap-1.5 max-w-sm">
                  <span className="text-xs font-bold text-white">Smart Tender Copilot Online</span>
                  <span className="text-[10px] text-muted-foreground leading-relaxed">
                    Hello! I am your AI Tender Compliance checker. Please upload your registration certificates, audited financial reports, or security PDFs. I will automatically audit them against our checklist matrix!
                  </span>
                </div>
              </div>
            ) : (
              chats.map((chat, idx) => (
                <div 
                  key={chat.id || idx} 
                  className={`flex gap-3 max-w-[85%] ${
                    chat.sender === "user" ? "ml-auto flex-row-reverse text-right" : "text-left"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                    chat.sender === "user" 
                      ? "bg-accent/10 border border-accent/20 text-accent" 
                      : "bg-primary/10 border border-primary/20 text-primary"
                  }`}>
                    {chat.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                      {chat.sender === "user" ? "You (Bidder)" : "Tender Copilot"}
                    </span>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      chat.sender === "user" 
                        ? "bg-accent/10 border border-accent/20 text-white rounded-tr-none" 
                        : "bg-white/5 border border-border/10 text-muted-foreground rounded-tl-none"
                    }`}>
                      {chat.message}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Controls */}
          <div className="p-4 border-t border-border/10 bg-[#030014]/40 backdrop-blur-md flex flex-col gap-3">
            {/* Attached file tag preview */}
            {attachedFile && (
              <div className="bg-primary/10 border border-primary/20 p-2 rounded-lg flex items-center justify-between text-left max-w-md">
                <div className="flex items-center gap-2 text-xs">
                  <FileText className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-[10px] truncate max-w-[200px]">{attachedFile.name}</span>
                    <span className="text-[9px] text-muted-foreground">{(attachedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setAttachedFile(null)} 
                  variant="ghost" 
                  size="icon" 
                  className="w-6 h-6 rounded-full text-muted-foreground hover:text-white hover:bg-white/5"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input 
                type="file" 
                id="file-upload" 
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden" 
              />
              <Button
                type="button"
                onClick={() => document.getElementById("file-upload")?.click()}
                variant="outline"
                size="icon"
                className="rounded-lg border-border/40 hover:bg-white/5 shrink-0"
              >
                <Paperclip className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Input
                type="text"
                placeholder="Type a response or drag/drop compliance PDF here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-lg bg-white/5 border-border/40 focus-visible:ring-primary/60 text-xs flex-grow"
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={sending || (!message.trim() && !attachedFile)}
                className="rounded-lg bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white shrink-0"
              >
                {sending ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
