"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

interface DashboardHeaderProps {
  userEmail?: string;
  userName?: string;
}

export function DashboardHeader({ userEmail, userName }: DashboardHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const displayName = userName || userEmail?.split("@")[0] || "Admin";

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-background/95 backdrop-blur-sm border-b border-border/60 px-4 h-[54px]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>
        <span className="text-[13px] font-semibold text-foreground tracking-tight">AJ Fresh Foods</span>
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="text-primary font-semibold text-[11px]">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      </header>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
