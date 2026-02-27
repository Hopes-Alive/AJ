import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShoppingCart, ClipboardList, Search, ArrowRight, Package, Zap, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "Admin";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Welcome banner */}
      <div
        className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
        style={{
          background: "linear-gradient(135deg, oklch(0.16 0.05 172) 0%, oklch(0.12 0.04 190) 60%, oklch(0.10 0.03 220) 100%)",
          boxShadow: "0 16px 48px oklch(0.52 0.13 172 / 0.25), 0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {/* Glow blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, oklch(0.6 0.15 172), transparent 70%)" }} />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, oklch(0.55 0.13 200), transparent 70%)" }} />
        </div>

        <div className="relative">
          <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-1">{greeting}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {userName}
            <span
              className="ml-2 text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, oklch(0.78 0.14 172), oklch(0.68 0.13 192))" }}
            > Admin Portal</span>
          </h1>
          <p className="text-white/40 text-sm mt-1.5">AJ Fresh Foods Wholesale · {user?.email}</p>

          <div className="flex gap-5 mt-6">
            {[
              { label: "Products", value: "130+" },
              { label: "Categories", value: "12" },
              { label: "Dispatch", value: "Fast" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-white font-black text-xl leading-none">{value}</p>
                <p className="text-white/35 text-[10px] font-medium tracking-wide mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <Link
        href="/dashboard/new-order"
        className="group flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
          boxShadow: "0 8px 32px oklch(0.52 0.13 172 / 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
        onMouseEnter={() => {}}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "radial-gradient(ellipse 80% 80% at 10% 50%, oklch(0.65 0.14 172 / 0.3), transparent)" }} />
        <div className="relative w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/10"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.15)" }}>
          <ShoppingCart className="h-7 w-7 text-white" />
        </div>
        <div className="relative flex-1 min-w-0">
          <p className="font-black text-white text-lg leading-tight">Start a New Order</p>
          <p className="text-white/55 text-sm mt-0.5">130+ products across 12 categories</p>
        </div>
        <div className="relative flex items-center gap-2 text-white/70 group-hover:text-white transition-colors shrink-0">
          <span className="text-sm font-semibold hidden sm:block">Order now</span>
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Secondary actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            href: "/dashboard/orders",
            icon: ClipboardList,
            title: "My Orders",
            desc: "View, expand and manage all orders",
            color: "text-blue-500",
            bg: "oklch(0.55 0.18 250 / 0.08)",
            border: "oklch(0.55 0.18 250 / 0.25)",
            glow: "oklch(0.55 0.18 250 / 0.12)",
            hoverBg: "oklch(0.55 0.18 250 / 0.12)",
          },
          {
            href: "/dashboard/lookup",
            icon: Search,
            title: "Order Lookup",
            desc: "Find any order by its order number",
            color: "text-purple-500",
            bg: "oklch(0.52 0.2 300 / 0.07)",
            border: "oklch(0.52 0.2 300 / 0.2)",
            glow: "oklch(0.52 0.2 300 / 0.1)",
            hoverBg: "oklch(0.52 0.2 300 / 0.11)",
          },
        ].map(({ href, icon: Icon, title, desc, color, bg, border, glow }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200"
            style={{
              background: bg,
              borderColor: border,
              boxShadow: `0 2px 12px ${glow}`,
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-background/80 border border-border/60 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)" }}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm">{title}</p>
              <p className="text-muted-foreground text-xs mt-0.5 truncate">{desc}</p>
            </div>
            <ArrowRight className={`h-4 w-4 text-muted-foreground ${color.replace("text-", "group-hover:text-")} group-hover:translate-x-0.5 transition-all shrink-0`} />
          </Link>
        ))}
      </div>

      {/* Info strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Package, label: "130+ Products", sub: "All categories stocked", color: "text-primary", grad: "from-primary/15 to-primary/5", border: "border-primary/15" },
          { icon: Zap, label: "Fast Dispatch", sub: "Reliable delivery", color: "text-amber-500", grad: "from-amber-500/12 to-amber-500/4", border: "border-amber-500/15" },
          { icon: TrendingUp, label: "Wholesale Rates", sub: "Best pricing", color: "text-emerald-500", grad: "from-emerald-500/12 to-emerald-500/4", border: "border-emerald-500/15" },
        ].map(({ icon: Icon, label, sub, color, grad, border }) => (
          <div key={label}
            className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border bg-gradient-to-br ${grad} ${border} text-center`}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.4)" }}>
            <div className="w-9 h-9 rounded-xl bg-background/80 border border-border/40 flex items-center justify-center"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground leading-tight">{label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
