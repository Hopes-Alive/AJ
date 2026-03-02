"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  ArrowRight,
  ArrowLeft,
  Package2,
} from "lucide-react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

type Mode = "loading" | "register" | "login";

const BRAND_ITEMS = [
  { label: "130+ Products", sub: "across all categories" },
  { label: "12 Categories", sub: "groceries to beverages" },
  { label: "Fast Dispatch", sub: "reliable delivery" },
];

const CATEGORIES = [
  "Beverages", "Coffee & Honey", "Dried Fruits", "Rice",
  "Noodles", "Snacks", "Dairy", "Charcoal", "Candies",
  "Shan Masala", "Cleaning", "Harris Juice",
];

export function AdminAuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("loading");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/admin/status`);
        const json = await res.json();
        setMode(json.data?.registered ? "login" : "register");
      } catch {
        setMode("login");
      }
    }
    checkAdminStatus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();

    if (mode === "register") {
      const res = await fetch(`${BACKEND_URL}/api/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Failed to create account");
        setSubmitting(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setSubmitting(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Invalid email or password");
      setSubmitting(false);
      return;
    }

    if (!data.user?.user_metadata?.is_admin) {
      await supabase.auth.signOut();
      setError("Access denied. This portal is for administrators only.");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex w-full min-h-screen">

      {/* ── Left branding panel (hidden on mobile) ── */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, oklch(0.18 0.05 172) 0%, oklch(0.13 0.04 190) 50%, oklch(0.10 0.03 220) 100%)",
        }}
      >
        {/* Decorative radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 30% 40%, oklch(0.45 0.12 172 / 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Top-right accent circle */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "oklch(0.5 0.12 172 / 0.08)" }}
        />
        <div
          className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "oklch(0.5 0.10 195 / 0.07)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-12">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
              <Image src="/images/logo.png" alt="AJ Fresh Foods" fill className="object-contain p-1" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">AJ Fresh Foods</p>
              <p className="text-white/40 text-[10px] tracking-widest uppercase mt-0.5">Wholesale</p>
            </div>
          </Link>

          {/* Hero text */}
          <div className="mt-auto mb-auto pt-16">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-primary/80 text-xs font-semibold tracking-[0.2em] uppercase">
                Admin Portal
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-6">
              Manage Your
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, oklch(0.78 0.14 172), oklch(0.68 0.13 192))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Wholesale Orders
              </span>
            </h1>

            <p className="text-white/50 text-base leading-relaxed max-w-sm">
              Place and track orders, manage pricing, and keep your customers stocked — all from one place.
            </p>

            {/* Stats row */}
            <div className="flex gap-8 mt-10">
              {BRAND_ITEMS.map(item => (
                <div key={item.label}>
                  <p className="text-white font-bold text-lg">{item.label}</p>
                  <p className="text-white/35 text-xs mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div className="mt-auto">
            <p className="text-white/20 text-[10px] font-semibold tracking-widest uppercase mb-3">Product Categories</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <span
                  key={cat}
                  className="text-[11px] text-white/30 border border-white/8 rounded-full px-3 py-1"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-12 bg-background relative">

        {/* Back to site — top left */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to site
        </Link>

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center gap-2">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center">
            <Image src="/images/logo.png" alt="AJ Fresh Foods" fill className="object-contain p-1.5" />
          </div>
          <p className="text-sm font-semibold text-foreground">AJ Fresh Foods</p>
        </div>

        <div className="w-full max-w-[400px]">

          {/* Loading state */}
          {mode === "loading" && (
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Checking portal status…</p>
            </div>
          )}

          {mode !== "loading" && (
            <>
              {/* Form header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    {mode === "register" ? "First-time setup" : "Secure access"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
                  {mode === "register" ? "Set up your account" : "Welcome back"}
                </h2>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                  {mode === "register"
                    ? "Create the administrator account to start managing orders."
                    : "Sign in to your admin dashboard to manage orders and pricing."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ajfreshfoods.com.au"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "register" ? "Min. 8 characters" : "••••••••"}
                      required
                      minLength={mode === "register" ? 8 : undefined}
                      className="w-full pl-11 pr-11 py-3 rounded-xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                    <p className="text-sm text-destructive leading-relaxed">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-primary-foreground transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                  style={{
                    background: submitting
                      ? "oklch(0.5 0.12 176)"
                      : "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 190))",
                    boxShadow: submitting ? "none" : "0 4px 24px oklch(0.52 0.13 172 / 0.35)",
                  }}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Package2 className="h-4 w-4" />
                  )}
                  {submitting
                    ? mode === "register" ? "Creating account…" : "Signing in…"
                    : mode === "register" ? "Create admin account" : "Sign in to dashboard"}
                  {!submitting && (
                    <ArrowRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              </form>

              {/* Footer note */}
              <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground/50 text-center">
                  Restricted to authorised administrators only
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
