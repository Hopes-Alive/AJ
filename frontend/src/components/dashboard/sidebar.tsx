"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, ShoppingCart, ClipboardList,
  Search, LogOut, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/new-order", label: "New Order", icon: ShoppingCart },
  { href: "/dashboard/orders", label: "Orders", icon: ClipboardList },
  { href: "/dashboard/lookup", label: "Lookup", icon: Search },
];

interface SidebarProps { onClose?: () => void }

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
    <div className="flex flex-col h-full w-60 bg-background border-r border-border/60">

      {/* Brand */}
      <div className="flex items-center justify-between h-[60px] px-5 border-b border-border/60">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-md overflow-hidden shrink-0">
            <Image src="/images/logo.png" alt="" fill className="object-contain" />
          </div>
          <span className="font-semibold text-[13px] text-foreground tracking-tight">AJ Fresh Foods</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "bg-primary/8 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-primary" />
              )}
              <Icon className={cn("h-[15px] w-[15px] shrink-0", isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground")} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4 border-t border-border/60 pt-3">
        <div className="px-3 py-2 mb-1 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <span className="text-primary text-[10px] font-bold">A</span>
          </div>
          <span className="text-[11px] text-muted-foreground truncate">Admin</span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
        >
          <LogOut className="h-[15px] w-[15px] shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}
