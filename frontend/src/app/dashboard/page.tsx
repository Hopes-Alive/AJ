import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ShoppingCart, ClipboardList, Search, ArrowRight,
  TrendingUp, Package, Zap,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = (user?.user_metadata?.full_name as string | undefined)
    ?.split(" ")[0] ?? "Admin";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Greeting */}
      <div className="pt-2">
        <p className="text-sm text-muted-foreground font-medium">{greeting}</p>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
          {userName} <span className="text-muted-foreground/40">👋</span>
        </h1>
      </div>

      {/* Primary CTA — New Order */}
      <Link
        href="/dashboard/new-order"
        className="group flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
          boxShadow: "0 8px 32px oklch(0.52 0.13 172 / 0.30)",
        }}
      >
        {/* bg glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(ellipse 80% 80% at 10% 50%, oklch(0.65 0.14 172 / 0.25), transparent)" }} />

        <div className="relative w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
          <ShoppingCart className="h-7 w-7 text-white" />
        </div>
        <div className="relative flex-1 min-w-0">
          <p className="font-black text-white text-lg leading-tight">Start a New Order</p>
          <p className="text-white/60 text-sm mt-0.5">130+ wholesale products across 12 categories</p>
        </div>
        <div className="relative flex items-center gap-1.5 text-white/70 group-hover:text-white transition-colors shrink-0">
          <span className="text-sm font-semibold hidden sm:block">Order now</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>

      {/* Secondary actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/orders"
          className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/15 transition-colors">
            <ClipboardList className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-sm">My Orders</p>
            <p className="text-muted-foreground text-xs mt-0.5 truncate">View and manage all orders</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        <Link
          href="/dashboard/lookup"
          className="group flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-purple-500/40 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-200"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/15 transition-colors">
            <Search className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-sm">Order Lookup</p>
            <p className="text-muted-foreground text-xs mt-0.5 truncate">Find any order by number</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </div>

      {/* Info strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Package, label: "130+ Products", sub: "All categories", color: "text-primary" },
          { icon: Zap, label: "Fast Dispatch", sub: "Reliable delivery", color: "text-amber-500" },
          { icon: TrendingUp, label: "Wholesale Pricing", sub: "Best rates", color: "text-emerald-500" },
        ].map(({ icon: Icon, label, sub, color }) => (
          <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card text-center">
            <Icon className={`h-5 w-5 ${color}`} />
            <div>
              <p className="text-xs font-bold text-foreground">{label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-muted/40 border border-border/60 text-sm text-muted-foreground">
        <Package className="h-4 w-4 shrink-0 text-muted-foreground/60" />
        <span>
          Need help?{" "}
          <a href="mailto:info@ajfreshfoods.com.au" className="text-primary hover:underline font-medium">
            info@ajfreshfoods.com.au
          </a>
        </span>
      </div>
    </div>
  );
}
