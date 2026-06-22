"use client";

import * as React from "react";
import { useAuth, API_BASE_URL } from "../../auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building, MessageSquare, ArrowLeft, RefreshCw, Send, 
  Sparkles, Star, User, Bot, Briefcase, Users, FileText
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function HRCopilotPage() {
  const { user, logout, apiFetch, loading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: (
        "Hello! I am the Indusnet AI Recruitment Copilot. " +
        "I can help you search the database for candidates, match and rank applicants by skills or match scores, " +
        "and generate professional draft offer letters.\n\n" +
        "How can I assist you in your talent acquisition tasks today?"
      )
    }
  ]);
  const [inputMessage, setInputMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/portal");
      return;
    }

    if (user && user.role !== "hr_manager") {
      router.push("/portal/dashboard");
      return;
    }
  }, [user, loading]);

  React.useEffect(() => {
    // Scroll chat to bottom on new message
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim() || sending) return;
    
    const newUserMessage: Message = { role: "user", content: msgText };
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");
    setSending(true);

    try {
      const savedToken = localStorage.getItem("copilot_token");
      
      // We pass the message and conversation history (excluding system prompts if none)
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch(`${API_BASE_URL}/hr/copilot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedToken}`
        },
        body: JSON.stringify({
          message: msgText,
          history: chatHistory
        })
      });

      if (!res.ok) {
        throw new Error("Failed to receive response from Recruitment Copilot");
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Error: ${err.message || "Failed to communicate with Copilot API. Ensure backend is running."}` 
      }]);
    } finally {
      setSending(false);
    }
  };

  const handlePresetQuery = (query: string) => {
    handleSendMessage(query);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear the conversation history?")) {
      setMessages([
        {
          role: "assistant",
          content: "Conversation history cleared. I'm ready for new instructions. How can I help you?"
        }
      ]);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#030014] text-white h-screen">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs text-zinc-400">Loading AI Recruitment Copilot...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow flex flex-col pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto w-full gap-6 text-left h-screen">
      
      {/* Header bar */}
      <header className="flex items-center justify-between border-b border-border/10 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/portal/hr" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Recruitment Copilot Chat
              <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-2">
                HR Agent
              </Badge>
            </h1>
            <span className="text-xs text-zinc-400">Interact with LLM-powered tools to query, filter, rank, and draft offer letters</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleClearHistory}
            variant="outline" 
            className="border-border/40 hover:bg-white/5 text-xs text-zinc-400 h-8 rounded-lg"
          >
            Clear History
          </Button>
          <Button 
            variant="outline" 
            onClick={logout}
            className="border-border/40 hover:bg-white/5 text-xs text-zinc-400 h-8 rounded-lg"
          >
            Log Out
          </Button>
        </div>
      </header>

      {/* Main split dashboard */}
      <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left side: presets & actions info */}
        <section className="lg:w-1/3 flex flex-col gap-4 shrink-0" aria-labelledby="preset-heading">
          <h2 id="preset-heading" className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Copilot Preset Actions
          </h2>

          <Card className="glassmorphism-card border-none p-5 flex flex-col gap-4">
            <p className="text-zinc-400 text-xs leading-relaxed">
              Click any of the quick-action preset buttons below to automatically query the candidate database and run AI commands.
            </p>
            
            <div className="flex flex-col gap-2.5">
              <Button 
                onClick={() => handlePresetQuery("List all available job positions in the system.")}
                className="w-full bg-white/5 hover:bg-white/10 text-white text-xs h-9 justify-start font-medium border border-border/40 rounded-xl"
              >
                <Briefcase className="w-3.5 h-3.5 mr-2 text-primary" /> List All Job Openings
              </Button>
              <Button 
                onClick={() => handlePresetQuery("Find the top candidate applications for our jobs and display their match scores.")}
                className="w-full bg-white/5 hover:bg-white/10 text-white text-xs h-9 justify-start font-medium border border-border/40 rounded-xl"
              >
                <Star className="w-3.5 h-3.5 mr-2 text-accent" /> Find Top Match Candidates
              </Button>
              <Button 
                onClick={() => handlePresetQuery("Search for candidates who have experience or skills in React or Python.")}
                className="w-full bg-white/5 hover:bg-white/10 text-white text-xs h-9 justify-start font-medium border border-border/40 rounded-xl"
              >
                <Users className="w-3.5 h-3.5 mr-2 text-primary" /> Search Candidates (React/Python)
              </Button>
              <Button 
                onClick={() => handlePresetQuery("Draft a formal employment offer letter for candidate John Doe as a Senior Frontend Developer, salary SGD 8,500/month, start date July 1, 2026.")}
                className="w-full bg-white/5 hover:bg-white/10 text-white text-xs h-9 justify-start font-medium border border-border/40 rounded-xl"
              >
                <FileText className="w-3.5 h-3.5 mr-2 text-accent" /> Draft Sample Offer Letter
              </Button>
            </div>

            <div className="border-t border-border/10 my-1" />

            <div className="text-zinc-400 text-[11px] leading-relaxed">
              <strong className="text-white block mb-1">Corporate Addresses:</strong>
              • Chennai: Velachery HQ (Senthilkumar Elu)<br />
              • Singapore: Ubi Ave Office (+65-9448-3805)
            </div>
          </Card>
        </section>

        {/* Right side: terminal-like Chat Console */}
        <section className="flex-grow flex flex-col bg-white/[0.01] border border-border/10 rounded-2xl overflow-hidden shadow-2xl" aria-labelledby="chat-heading">
          <h2 id="chat-heading" className="sr-only">Chat Console</h2>
          {/* Messages window */}
          <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-4 max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-300px)]">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div key={index} className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    isUser 
                      ? "bg-accent/10 border-accent/20 text-accent" 
                      : "bg-primary/10 border-primary/20 text-primary"
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap text-left ${
                    isUser 
                      ? "bg-gradient-to-r from-primary/20 to-accent/20 text-white border border-primary/20" 
                      : "bg-white/[0.03] text-zinc-300 border border-border/5"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            
            {sending && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary animate-bounce" />
                </div>
                <div className="bg-white/[0.02] border border-border/5 rounded-2xl p-4 text-xs text-zinc-500 italic">
                  Recruitment Copilot is thinking & executing tools...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input console */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputMessage); }}
            className="border-t border-border/10 p-4 bg-[#050314] flex gap-2 shrink-0"
          >
            <Input
              type="text"
              placeholder="Ask the recruitment copilot (e.g. Find matching candidates for lead engineer role)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow bg-neutral-900 border-border/40 text-xs text-white rounded-xl h-10 px-4 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
              required
            />
            <Button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className="bg-primary hover:brightness-110 text-white rounded-xl h-10 px-4 aspect-square"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

        </section>
        
      </div>
    </main>
  );
}
