"use client";

import * as React from "react";
import { useAuth } from "./auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck, Mail, Lock, User, Building } from "lucide-react";
import Link from "next/link";

export default function PortalLoginPage() {
  const { login, register, loading, user } = useAuth();
  const [isLogin, setIsLogin] = React.useState(true);
  const [role, setRole] = React.useState<"bidder" | "internal_evaluator">("bidder");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({
          email,
          password,
          name: name || undefined,
          company_name: role === "bidder" ? companyName : undefined,
          role,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center pt-24 pb-16 px-4 relative overflow-hidden">
      {/* Background radial lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      
      <div className="w-full max-w-md flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 justify-center group self-center mb-2">
          <span className="font-sans font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent group-hover:to-accent transition-all duration-300">
            INDUSNET <span className="text-primary">COPILOT</span>
          </span>
        </Link>

        <Card className="glassmorphism-card border-none text-left relative overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-2">
                Tender Portal
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {isLogin
                ? "Sign in to access your bidding workspace or review submissions"
                : "Register to manage company bids and track compliance"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg">
                  {errorMsg}
                </div>
              )}

              {/* REGISTER SPECIFIC FIELDS */}
              {!isLogin && (
                <>
                  {/* Role Selection */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-lg border border-border/10 mb-2">
                    <button
                      type="button"
                      onClick={() => setRole("bidder")}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                        role === "bidder"
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      Bidding Org
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("internal_evaluator")}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                        role === "internal_evaluator"
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      Evaluator
                    </button>
                  </div>

                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-lg bg-white/5 border-border/40 pl-10 text-xs"
                      required
                    />
                  </div>

                  {role === "bidder" && (
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="rounded-lg bg-white/5 border-border/40 pl-10 text-xs"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg bg-white/5 border-border/40 pl-10 text-xs"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg bg-white/5 border-border/40 pl-10 text-xs"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs py-5 mt-2 group hover:brightness-110"
              >
                {submitting ? "Processing..." : isLogin ? "Access Workspace" : "Register Credentials"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-2 pb-6 border-t border-border/10 flex justify-center text-[11px]">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have a corporate account?" : "Already registered?"}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg("");
              }}
              className="text-primary hover:underline font-bold ml-1.5"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
