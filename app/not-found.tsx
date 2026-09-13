import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, Sparkles, MessageSquare, Briefcase } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-24 relative overflow-hidden text-center">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
        <Badge className="bg-primary/10 border-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> 404 Error
        </Badge>

        <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-foreground font-heading">
          4<span className="text-primary">0</span>4
        </h1>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-md leading-relaxed">
            The page you are looking for does not exist, has been removed, or is undergoing architectural updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild className="rounded-full bg-primary text-white font-semibold text-xs px-6 hover:bg-primary/90 shadow-md shadow-primary/25">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" /> Return to Home
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-full border-border hover:bg-muted text-foreground text-xs px-6">
            <Link href="/services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Explore Services
            </Link>
          </Button>

          <Button asChild variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground text-xs px-5">
            <Link href="/contact" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
