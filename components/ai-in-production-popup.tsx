"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AIInProductionPopup() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Check if user dismissed it in this session
    const isDismissed = sessionStorage.getItem("hide-ai-in-production-popup");
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500); // 2.5s delay to feel organic
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("hide-ai-in-production-popup", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[360px] overflow-hidden rounded-2xl border border-primary/20 bg-background/90 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(124,58,237,0.3)] text-left"
        >
          {/* Top glow stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-purple-500 to-accent" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 rounded-full p-1 text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] uppercase font-bold text-accent tracking-wider">
                Special program
              </span>
            </div>

            <div className="flex flex-col gap-1 pr-6">
              <h4 className="text-sm font-extrabold text-white tracking-tight leading-tight">
                AI in Production in Four Weeks
              </h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-normal mt-1">
                Discover AI use cases fast with forward deployed engineering. De-risk your AI roadmap with active prototypes.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                asChild
                size="sm"
                className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 text-[11px] px-4 py-1.5 h-auto transition-all"
              >
                <Link href="/solutions/ai-in-production" onClick={handleDismiss} className="flex items-center gap-1">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
              <button
                onClick={handleDismiss}
                className="text-[11px] font-semibold text-muted-foreground hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
