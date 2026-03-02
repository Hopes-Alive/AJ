"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, ShoppingCart, ClipboardList, Search,
  LogOut, X, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
    color: "#10b981",
    desc: "Charts & summary",
  },
  {
    href: "/dashboard/new-order",
    label: "New Order",
    icon: ShoppingCart,
    color: "#3b82f6",
    desc: "Create an order",
  },
  {
    href: "/dashboard/orders",
    label: "My Orders",
    icon: ClipboardList,
    color: "#8b5cf6",
    desc: "View & manage",
  },
  {
    href: "/dashboard/lookup",
    label: "Order Lookup",
    icon: Search,
    color: "#f59e0b",
    desc: "Find by number",
  },
];

interface SidebarProps { onClose?: () => void; }

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      className="flex flex-col h-full w-64 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0f1a17 0%, #0d1a19 50%, #0a1512 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Brand header */}
      <div className="relative px-5 py-5 border-b border-white/[0.07]">
        <div className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(ellipse 120% 100% at 0% 0%, oklch(0.52 0.13 172 / 0.3), transparent 70%)" }} />
        <div className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="relative w-10 h-10 rounded-2xl overflow-hidden shrink-0"
              style={{
                border: "1.5px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 16px oklch(0.52 0.13 172 / 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.08)",
              }}
            >
              <Image src="/images/logo.png" alt="AJ Fresh Foods" fill className="object-contain p-1.5" />
            </div>
            <div>
              <p className="font-black text-white text-sm leading-none">AJ Fresh Foods</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "#10b981", boxShadow: "0 0 4px #10b981" }}
                />
                <p className="text-[10px] text-white/40 font-semibold tracking-wide">Admin Portal</p>
              </div>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] px-3 pb-3">Navigation</p>

        {navItems.map(({ href, label, icon: Icon, exact, color, desc }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
                isActive ? "text-white" : "text-white/40 hover:text-white/80"
              )}
              style={isActive ? {
                background: `linear-gradient(135deg, ${color}28, ${color}12)`,
                border: `1px solid ${color}35`,
                boxShadow: `0 4px 20px ${color}20`,
              } : {
                border: "1px solid transparent",
              }}
            >
              {/* Icon box */}
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  isActive ? "" : "group-hover:scale-110"
                )}
                style={{
                  background: isActive ? `${color}30` : "rgba(255,255,255,0.06)",
                  boxShadow: isActive ? `0 2px 10px ${color}35` : undefined,
                }}
              >
                <Icon className="h-4 w-4" style={{ color: isActive ? color : undefined }} />
              </div>

              {/* Label + desc */}
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-bold leading-none", isActive ? "text-white" : "text-white/60 group-hover:text-white/90")}>
                  {label}
                </p>
                <p className="text-[10px] text-white/25 mt-0.5 group-hover:text-white/40 transition-colors">{desc}</p>
              </div>

              {/* Active arrow */}
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color }} />
              )}

              {/* Active left border accent */}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

      {/* Sign out */}
      <div className="px-3 py-4">
        <button
          onClick={handleSignOut}
          className="group flex items-center gap-3 w-full px-3 py-3 rounded-2xl text-sm font-semibold text-white/35 hover:text-red-400 transition-all duration-200"
          style={{ border: "1px solid transparent" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "";
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.05] group-hover:bg-red-500/15 transition-colors">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
