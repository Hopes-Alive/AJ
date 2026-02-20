"use client";

import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/data/navigation";
import { Mail, Phone, MapPin, Clock, ArrowUpRight, ArrowRight } from "lucide-react";

const hours = [
  { day: "Mon – Fri", time: "7 am – 6 pm", open: true },
  { day: "Saturday", time: "8 am – 5 pm", open: true },
  { day: "Sunday", time: "Closed", open: false },
];

const contactLinks = [
  { icon: Phone, label: "+61 450 767 508", href: "tel:+61450767508" },
  { icon: Phone, label: "+61 416 121 649", href: "tel:+61416121649" },
  { icon: Mail, label: "ali@ajfreshfoods.com.au", href: "mailto:ali@ajfreshfoods.com.au" },
  { icon: Mail, label: "admin@ajfreshfoods.com.au", href: "mailto:admin@ajfreshfoods.com.au" },
  { icon: MapPin, label: "17 Camino Cres, Cranbourne West VIC 3977", href: "https://maps.google.com/?q=17+Camino+Cres+Cranbourne+West+VIC+3977" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient accent bar */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, oklch(0.55 0.12 176), oklch(0.5 0.1 190), transparent 95%)",
        }}
      />

      <div className="absolute inset-0 -z-10 bg-muted/40 dark:bg-muted/60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Brand banner ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-10 pb-8 sm:pt-14 sm:pb-10 lg:pt-16 lg:pb-12">
          <Link href="/" className="inline-block group flex-shrink-0">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="AJ Fresh Foods"
                width={110}
                height={110}
                className="rounded-2xl transition-transform duration-300 group-hover:scale-105 w-20 h-20 sm:w-[110px] sm:h-[110px]"
              />
              {/* Glow behind logo */}
              <div
                className="absolute -inset-3 rounded-3xl -z-10 opacity-40"
                style={{
                  background: "radial-gradient(circle, oklch(0.55 0.12 176 / 0.12), transparent 70%)",
                }}
              />
            </div>
          </Link>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              AJ Fresh Foods
            </h3>
            <p className="text-xs text-primary font-semibold uppercase tracking-[0.2em] mt-1">
              Wholesale Distribution
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 max-w-md">
              Your trusted partner for quality grocery products — serving
              retailers and supermarkets across Australia.
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border/50 dark:bg-border/30" />

        {/* ── Columns ── */}
        <div className="grid gap-8 sm:gap-10 py-8 sm:py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-6">
              Get in Touch
            </h4>
            <div className="space-y-4">
              {contactLinks.map((item) => {
                const inner = (
                  <div className="flex items-center gap-3.5 group/link">
                    <div className="h-10 w-10 rounded-xl bg-primary/8 dark:bg-primary/12 border border-primary/10 flex items-center justify-center transition-all duration-300 group-hover/link:bg-primary/15 group-hover/link:scale-105">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover/link:text-foreground transition-colors duration-300">
                      {item.label}
                    </span>
                  </div>
                );

                return item.href ? (
                  <a key={item.label} href={item.href} className="block">
                    {inner}
                  </a>
                ) : (
                  <div key={item.label}>{inner}</div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group/nav inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-primary/30 group-hover/nav:bg-primary transition-colors duration-300"
                    />
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/nav:opacity-50 group-hover/nav:translate-x-0 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-6">
              Business Hours
            </h4>
            <div className="rounded-2xl p-5 bg-card/70 dark:bg-card/50 border border-border/40 dark:border-border/25">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-lg bg-primary/8 dark:bg-primary/12 flex items-center justify-center">
                  <Clock className="h-3 w-3 text-primary/60" />
                </div>
                <span className="text-[11px] text-muted-foreground/50 font-semibold uppercase tracking-wider">
                  Opening Times
                </span>
              </div>
              <ul className="space-y-3">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {h.day}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          h.open ? "bg-emerald-500/60" : "bg-muted-foreground/20"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold ${
                          h.open ? "text-foreground" : "text-muted-foreground/40"
                        }`}
                      >
                        {h.time}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick CTA */}
            <Link
              href="/contact"
              className="group/cta mt-5 flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-300"
            >
              Get a wholesale quote
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-border/40 dark:border-border/25 py-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} AJ Fresh Foods Pty Ltd. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground/50 hover:text-primary transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground/50 hover:text-primary transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
