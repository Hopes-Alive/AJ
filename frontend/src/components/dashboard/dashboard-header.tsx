"use client";

import { useState } from "react";
import { Menu, LayoutDashboard, ShoppingCart, ClipboardList, Search } from "lucide-react";
import { Sidebar } from "./sidebar";
import { usePathname } from "next/navigation";

const PAGE_META: Record<string, { label: string; icon: typeof LayoutDashboard }> = {
  "/dashboard":           { label: "Overview",     icon: LayoutDashboard },
  "/dashboard/new-order": { label: "New Order",    icon: ShoppingCart },
  "/dashboard/orders":    { label: "My Orders",    icon: ClipboardList },
  "/dashboard/lookup":    { label: "Order Lookup", icon: Search },
};

interface DashboardHeaderProps {
  userEmail?: string;
  userName?: string;
}

export function DashboardHeader({ userEmail, userName }: DashboardHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const displayName = userName || userEmail?.split("@")[0] || "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();
  const meta = PAGE_META[pathname] ?? { label: "Dashboard", icon: LayoutDashboard };
  const Icon = meta.icon;

  return (
    <>
      <header
        className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page title */}
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-black text-sm text-foreground">{meta.label}</span>
        </div>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-black"
          style={{
            background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
            boxShadow: "0 2px 8px oklch(0.52 0.13 172 / 0.3)",
          }}
        >
          {initials}
        </div>
      </header>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
