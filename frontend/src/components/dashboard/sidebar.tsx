"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, ShoppingCart, ClipboardList, Search, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true, color: "oklch(0.52 0.13 172)", glow: "oklch(0.52 0.13 172 / 0.25)" },
  { href: "/dashboard/new-order", label: "New Order", icon: ShoppingCart, color: "oklch(0.52 0.13 172)", glow: "oklch(0.52 0.13 172 / 0.25)" },
  { href: "/dashboard/orders", label: "My Orders", icon: ClipboardList, color: "oklch(0.55 0.18 250)", glow: "oklch(0.55 0.18 250 / 0.25)" },
  { href: "/dashboard/lookup", label: "Order Lookup", icon: Search, color: "oklch(0.52 0.2 300)", glow: "oklch(0.52 0.2 300 / 0.25)" },
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
    <div className="flex flex-col h-full w-64 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, oklch(0.98 0.005 172) 0%, oklch(0.97 0.003 172) 100%)",
        borderRight: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "2px 0 20px rgba(0,0,0,0.05)",
      }}>

      {/* Brand header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]"
        style={{ background: "linear-gradient(135deg, oklch(0.52 0.13 172 / 0.06), oklch(0.44 0.11 192 / 0.03))" }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-border/50 shrink-0"
            style={{ boxShadow: "0 2px 8px oklch(0.52 0.13 172 / 0.2), inset 0 1px 0 rgba(255,255,255,0.5)" }}>
            <Image src="/images/logo.png" alt="AJ Fresh Foods" fill className="object-contain p-1" />
          </div>
          <div>
            <p className="font-black text-foreground text-sm leading-none">AJ Fresh Foods</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 font-medium tracking-wide">Admin Portal</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] px-3 pb-2">Menu</p>
        {navItems.map(({ href, label, icon: Icon, exact, color, glow }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                isActive ? "text-white" : "text-muted-foreground hover:text-foreground hover:bg-black/[0.04]"
              )}
              style={isActive ? {
                background: `linear-gradient(135deg, ${color}, ${color.replace(")", " / 0.8)")})`,
                boxShadow: `0 4px 16px ${glow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
              } : {}}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                isActive ? "bg-white/20" : "bg-transparent"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-black/[0.06]">
        <button onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/15 transition-all duration-200 group"
        >
          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors">
            <LogOut className="h-4 w-4" />
          </div>
          Sign out
        </button>
      </div>
    </div>
  );
}
