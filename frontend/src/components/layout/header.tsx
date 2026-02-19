"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Home,
  Users,
  Package,
  Wrench,
  MessageSquare,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Users },
  { href: "/products", label: "Products", icon: Package },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/contact", label: "Contact", icon: MessageSquare },
];

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
    <header className="sticky top-0 z-50 w-full pointer-events-none">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8 pt-3 sm:pt-4">
        <nav
          className={cn(
            "pointer-events-auto relative rounded-2xl transition-all duration-500 ease-out",
            scrolled
              ? "bg-background/85 dark:bg-background/75 backdrop-blur-2xl shadow-lg shadow-black/[0.06] dark:shadow-black/[0.2] border border-border/50 dark:border-border/30"
              : "bg-background/65 dark:bg-background/45 backdrop-blur-xl border border-border/30 dark:border-border/20"
          )}
        >
          {/* Top accent */}
          <div
            className="absolute inset-x-4 top-0 h-[2px] rounded-full overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.55 0.12 176 / 0.5), oklch(0.5 0.1 195 / 0.3), transparent)",
            }}
          />

          <div className="px-4 sm:px-5 lg:px-6">
            <div className="flex h-14 sm:h-16 items-center justify-between">
              {/* ─── Logo ─── */}
              <Link
                href="/"
                className="group flex items-center gap-2.5 shrink-0"
              >
                <div className="relative h-9 w-9 sm:h-10 sm:w-10 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/images/logo.png"
                    alt="AJ Fresh Foods"
                    width={40}
                    height={40}
                    className="rounded-lg w-full h-full"
                    priority
                  />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm sm:text-[15px] font-bold tracking-tight leading-none">
                    AJ Fresh Foods
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.12em] text-primary mt-0.5">
                    Wholesale
                  </span>
                </div>
              </Link>

              {/* ─── Desktop Nav ─── */}
              <div className="hidden lg:flex items-center gap-0.5">
                {navItems.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "group/link relative px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-colors duration-300",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="relative z-10">{link.label}</span>

                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg bg-primary/8 dark:bg-primary/12"
                          transition={{
                            type: "spring",
                            bounce: 0.18,
                            duration: 0.5,
                          }}
                        />
                      )}

                      {!isActive && (
                        <span className="absolute inset-x-3 bottom-0 h-px scale-x-0 group-hover/link:scale-x-100 rounded-full transition-transform duration-300 origin-center bg-primary/25" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* ─── Right side ─── */}
              <div className="flex items-center gap-2">
                <ModeToggle />

                <Link
                  href="/contact"
                  className="hidden lg:inline-flex group/cta relative items-center gap-1.5 rounded-lg px-4 py-2 text-[12px] sm:text-[13px] font-semibold text-primary-foreground overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--cta-gradient-from), var(--cta-gradient-to))",
                    boxShadow: [
                      "0 1px 3px oklch(0.55 0.12 176 / 0.15)",
                      "0 4px 10px oklch(0.55 0.12 176 / 0.1)",
                      "inset 0 1px 0 oklch(1 0 0 / 0.12)",
                    ].join(", "),
                  }}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Get a Quote
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </Link>

                {/* ─── Mobile hamburger ─── */}
                <button
                  className={cn(
                    "relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg transition-all duration-300 lg:hidden",
                    mobileOpen
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label="Toggle menu"
                >
                  <div className="flex flex-col items-center justify-center w-[17px]">
                    <motion.span
                      animate={
                        mobileOpen
                          ? { rotate: 45, y: 5, width: 17 }
                          : { rotate: 0, y: 0, width: 17 }
                      }
                      className="block h-[1.5px] rounded-full bg-current origin-center"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                    <motion.span
                      animate={
                        mobileOpen
                          ? { opacity: 0, scaleX: 0 }
                          : { opacity: 0.6, scaleX: 1 }
                      }
                      className="block h-[1.5px] w-3 rounded-full bg-current mt-[4px]"
                      transition={{ duration: 0.2 }}
                    />
                    <motion.span
                      animate={
                        mobileOpen
                          ? { rotate: -45, y: -5, width: 17 }
                          : { rotate: 0, y: 0, width: 13 }
                      }
                      className="block h-[1.5px] rounded-full bg-current origin-center mt-[4px]"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* ─── Mobile overlay ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto fixed left-3 right-3 sm:left-5 sm:right-5 top-[72px] sm:top-[80px] z-50 rounded-2xl overflow-hidden lg:hidden"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: [
                  "0 8px 32px oklch(0.15 0 0 / 0.12)",
                  "0 20px 48px oklch(0.15 0 0 / 0.08)",
                ].join(", "),
              }}
            >
              <div className="p-2 space-y-0.5">
                {navItems.map((link, i) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.03 + i * 0.04,
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-3 text-[14px] font-medium rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-primary/8 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                        )}
                      >
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200",
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "bg-muted/40 text-muted-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1">{link.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-dot"
                            className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                            transition={{
                              type: "spring",
                              bounce: 0.15,
                              duration: 0.4,
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-3 pb-3"
              >
                <div
                  className="h-px mb-3 mx-2"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--border), transparent)",
                  }}
                />

                <a
                  href="tel:0450767508"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-muted/25 mb-2 transition-colors hover:bg-muted/40"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">0450 767 508</p>
                    <p className="text-[10px] text-muted-foreground">
                      Mon–Fri 7am–5pm
                    </p>
                  </div>
                </a>

                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--cta-gradient-from), var(--cta-gradient-to))",
                    boxShadow: [
                      "0 2px 8px oklch(0.55 0.12 176 / 0.15)",
                      "0 6px 20px oklch(0.55 0.12 176 / 0.08)",
                      "inset 0 1px 0 oklch(1 0 0 / 0.1)",
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
