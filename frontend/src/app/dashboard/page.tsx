import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShoppingCart, ClipboardList, Search, ArrowRight } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "Admin";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-4xl mx-auto space-y-5">

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
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, oklch(0.6 0.15 172), transparent 70%)" }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, oklch(0.55 0.13 200), transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 opacity-5"
            style={{ background: "radial-gradient(ellipse, oklch(0.7 0.2 172), transparent 70%)" }} />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-1">{greeting}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {userName}
              <span
                className="ml-2 text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, oklch(0.78 0.14 172), oklch(0.68 0.13 192))" }}
              > Admin Portal</span>
            </h1>
            <p className="text-white/35 text-sm mt-1.5">AJ Fresh Foods Wholesale · {user?.email}</p>
          </div>

          <Link
            href="/dashboard/new-order"
            className="group shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "white",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            New Order
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Live stats + charts */}
      <DashboardStats />

      {/* Quick nav */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            href: "/dashboard/orders",
            icon: ClipboardList,
            title: "Manage Orders",
            desc: "View, expand, update and track all orders",
            color: "#3b82f6",
            bg: "oklch(0.55 0.18 250 / 0.07)",
            border: "oklch(0.55 0.18 250 / 0.22)",
            glow: "oklch(0.55 0.18 250 / 0.1)",
          },
          {
            href: "/dashboard/lookup",
            icon: Search,
            title: "Order Lookup",
            desc: "Find any order instantly by order number",
            color: "#8b5cf6",
            bg: "oklch(0.52 0.2 300 / 0.07)",
            border: "oklch(0.52 0.2 300 / 0.2)",
            glow: "oklch(0.52 0.2 300 / 0.1)",
          },
        ].map(({ href, icon: Icon, title, desc, color, bg, border, glow }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 hover:scale-[1.01]"
            style={{
              background: bg,
              borderColor: border,
              boxShadow: `0 2px 12px ${glow}`,
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              style={{ background: `${color}18`, boxShadow: `0 4px 12px ${color}28` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm">{title}</p>
              <p className="text-muted-foreground text-xs mt-0.5 truncate">{desc}</p>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:translate-x-0.5"
              style={{ background: `${color}15` }}>
              <ArrowRight className="h-3.5 w-3.5" style={{ color }} />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
