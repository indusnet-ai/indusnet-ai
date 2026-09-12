"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, ArrowUpRight, Cpu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Industries", href: "/industries" },
  { name: "Training", href: "/training" },
  { name: "AI Scoper", href: "/assessment" },
  { name: "Tender Portal", href: "/portal" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 text-muted-foreground">
        <Sun className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-muted"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle Light / Dark Mode"
    >
      {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/40 shadow-[0_8px_32px_rgba(3,0,20,0.1)] py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-all duration-300">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="flex flex-col text-left font-sans leading-none">
              <span className="font-black text-sm tracking-widest text-foreground">INDUSNET</span>
              <span className="font-extrabold text-[15px] tracking-wide text-primary">AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-200 relative hover:text-foreground",
                  isActive ? "text-foreground bg-muted/80 font-semibold" : "text-muted-foreground"
                )}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Button asChild className="rounded-full bg-primary text-white font-semibold hover:bg-primary/90 hover:shadow-[0_4px_20px_rgba(255,45,33,0.35)] transition-all duration-300 group px-6">
            <Link href="/contact" className="flex items-center gap-1.5">
              Book Consultation
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted rounded-full">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background/95 backdrop-blur-xl border-l border-border/40 p-6 flex flex-col justify-between">
              <div className="flex flex-col gap-8 mt-6">
                <Link href="/" className="flex items-center group mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="flex flex-col text-left font-sans leading-none">
                      <span className="font-black text-sm tracking-widest text-foreground">INDUSNET</span>
                      <span className="font-extrabold text-[15px] tracking-wide text-primary">AI</span>
                    </span>
                  </div>
                </Link>

                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <SheetClose key={link.href} render={
                        <Link
                          href={link.href}
                          className={cn(
                            "px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 text-left flex items-center justify-between",
                            isActive
                              ? "text-primary bg-primary/10 font-bold"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          {link.name}
                          {isActive && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </Link>
                      } />
                    );
                  })}
                </nav>
              </div>

              <div className="flex flex-col gap-4 pt-6 border-t border-border/40">
                <SheetClose render={
                  <Button asChild className="w-full rounded-full bg-primary text-white font-semibold py-6 shadow-lg shadow-primary/25">
                    <Link href="/contact" className="flex items-center justify-center gap-2">
                      Book Consultation
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </Button>
                } />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
