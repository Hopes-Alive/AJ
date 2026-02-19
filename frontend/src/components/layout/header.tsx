"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { navLinks } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-5 pt-3 pb-1">
      <nav
        className={cn(
          "relative mx-auto max-w-6xl rounded-2xl transition-all duration-700 ease-out",
          scrolled
            ? "bg-background/75 dark:bg-background/60 backdrop-blur-3xl border border-border/50 dark:border-border/30"
            : "bg-background/50 dark:bg-background/25 backdrop-blur-2xl border border-border/25 dark:border-border/10"
        )}
        style={{
          boxShadow: scrolled
            ? [
                "0 1px 2px oklch(0.2 0 0 / var(--shadow-a))",
                "0 4px 16px oklch(0.2 0 0 / calc(var(--shadow-a) * 1.5))",
                "0 16px 48px oklch(0.2 0 0 / calc(var(--shadow-a) * 0.8))",
                "0 0 50px oklch(0.55 0.12 176 / 0.03)",
                "inset 0 1px 0 oklch(1 0 0 / var(--highlight-edge-a))",
              ].join(", ")
            : [
                "0 1px 4px oklch(0.2 0 0 / calc(var(--shadow-a) * 0.5))",
                "inset 0 1px 0 oklch(1 0 0 / var(--highlight-a))",
              ].join(", "),
        }}
      >
        {/* Bottom gradient accent line */}
        <div
          className={cn(
            "absolute inset-x-4 -bottom-px h-px transition-opacity duration-700 rounded-full",
            scrolled ? "opacity-100" : "opacity-0"
          )}
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.55 0.12 176 / 0.35) 30%, oklch(0.5 0.1 195 / 0.25) 70%, transparent 100%)",
          }}
        />

        <div className="flex h-14 sm:h-[60px] items-center justify-between px-4 sm:px-5">
          {/* ─── Logo ─── */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="AJ Fresh Foods"
                width={48}
                height={48}
                className="rounded-lg w-full h-full"
                priority
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-primary/0 group-hover:ring-primary/20 transition-all duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-[17px] font-bold tracking-tight leading-none text-gradient">
                AJ Fresh Foods
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60 dark:text-muted-foreground/80 mt-0.5">
                Wholesale
              </span>
            </div>
          </Link>

          {/* ─── Desktop Nav ─── */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-0.5 px-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group/link relative px-3.5 xl:px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-300",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="relative z-10">{link.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: "oklch(0.55 0.12 176 / 0.08)",
                          boxShadow:
                            "inset 0 1px 0 oklch(1 0 0 / var(--highlight-a)), 0 0 10px oklch(0.55 0.12 176 / 0.05)",
                        }}
                        transition={{
                          type: "spring",
                          bounce: 0.12,
                          duration: 0.5,
                        }}
                      />
                    )}

                    {/* Hover underline */}
                    {!isActive && (
                      <span className="absolute inset-x-3 bottom-0.5 h-[1.5px] scale-x-0 group-hover/link:scale-x-100 rounded-full transition-transform duration-300 origin-center bg-primary/40" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Separator */}
            <div className="h-5 w-px bg-border/60 mx-2.5" />

            <div className="flex items-center gap-2">
              <ModeToggle />

              <Link
                href="/contact"
                className="group/cta relative inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-[13px] font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--cta-gradient-from), var(--cta-gradient-to))",
                  boxShadow: [
                    "0 1px 3px oklch(0.55 0.12 176 / 0.2)",
                    "0 4px 12px oklch(0.55 0.12 176 / 0.12)",
                    "inset 0 1px 0 oklch(1 0 0 / 0.15)",
                  ].join(", "),
                }}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Get a Quote
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                </span>
                {/* Shine sweep on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </Link>
            </div>
          </div>

          {/* ─── Mobile: toggle + hamburger ─── */}
          <div className="flex items-center gap-2 lg:hidden">
            <ModeToggle />
            <button
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300",
                mobileOpen
                  ? "border-primary/30 bg-primary/10"
                  : "border-border/40 bg-card/40 hover:border-primary/20 hover:bg-card/70"
              )}
              style={{
                boxShadow:
                  "inset 0 1px 0 oklch(1 0 0 / var(--highlight-a))",
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col items-center justify-center w-[18px]">
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: 45, y: 5, width: 18 }
                      : { rotate: 0, y: 0, width: 18 }
                  }
                  className="block h-[1.5px] rounded-full bg-foreground origin-center"
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { opacity: 0, scaleX: 0 }
                      : { opacity: 0.7, scaleX: 1 }
                  }
                  className="block h-[1.5px] w-3 rounded-full bg-foreground mt-[5px]"
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  animate={
                    mobileOpen
                      ? { rotate: -45, y: -5, width: 18 }
                      : { rotate: 0, y: 0, width: 14 }
                  }
                  className="block h-[1.5px] rounded-full bg-foreground origin-center mt-[5px]"
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile overlay ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-50 mt-2 mx-auto max-w-6xl rounded-2xl overflow-hidden lg:hidden"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: [
                  "0 4px 16px oklch(0.2 0 0 / calc(var(--shadow-a) * 3))",
                  "0 16px 48px oklch(0.2 0 0 / calc(var(--shadow-a) * 4))",
                  "0 0 50px oklch(0.55 0.12 176 / 0.04)",
                  "inset 0 1px 0 oklch(1 0 0 / var(--highlight-edge-a))",
                ].join(", "),
              }}
            >
              <div className="p-3 space-y-0.5">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.04 + i * 0.04,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-primary/8 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                        )}
                        style={
                          isActive
                            ? {
                                boxShadow:
                                  "inset 0 1px 0 oklch(1 0 0 / var(--highlight-a)), 0 0 12px oklch(0.55 0.12 176 / 0.05)",
                              }
                            : undefined
                        }
                      >
                        {isActive && (
                          <motion.div
                            layoutId="mobile-indicator"
                            className="h-4 w-[3px] rounded-full shrink-0"
                            style={{
                              background:
                                "linear-gradient(180deg, oklch(0.55 0.12 176), oklch(0.5 0.1 195))",
                            }}
                            transition={{
                              type: "spring",
                              bounce: 0.15,
                              duration: 0.4,
                            }}
                          />
                        )}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="px-3 pb-3"
              >
                <div
                  className="h-px mb-3 mx-2"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--border), transparent)",
                  }}
                />
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--cta-gradient-from), var(--cta-gradient-to))",
                    boxShadow: [
                      "0 2px 8px oklch(0.55 0.12 176 / 0.2)",
                      "0 8px 24px oklch(0.55 0.12 176 / 0.1)",
                      "inset 0 1px 0 oklch(1 0 0 / 0.12)",
                    ].join(", "),
                  }}
                >
                  Get a Quote
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
