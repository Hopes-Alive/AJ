import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const firstName = (user?.user_metadata?.full_name as string | undefined)
    ?.split(" ")[0] ?? "Admin";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-AU", {
    weekday: "long", day: "numeric", month: "long",
  });
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-2xl mx-auto pt-2 pb-16">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs text-muted-foreground/60 font-medium tracking-wide uppercase mb-3">
          {dateStr}
        </p>
        <h1 className="text-[28px] font-bold text-foreground leading-tight tracking-tight">
          {greeting}, {firstName}.
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Manage wholesale orders for AJ Fresh Foods.
        </p>
      </div>

      {/* Primary action */}
      <Link
        href="/dashboard/new-order"
        className="group flex items-center justify-between w-full px-6 py-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/[0.03] transition-all duration-200 mb-3"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg border border-primary/30 bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/12 transition-colors">
            <Plus className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-[15px] leading-none mb-1">New Order</p>
            <p className="text-xs text-muted-foreground">Browse 130+ products across 12 categories</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
      </Link>

      {/* Secondary actions */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        {[
          { href: "/dashboard/orders", label: "Orders", desc: "View & manage all orders" },
          { href: "/dashboard/lookup", label: "Lookup", desc: "Find any order by number" },
        ].map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-3 px-5 py-4 rounded-xl border border-border bg-card hover:border-border hover:bg-muted/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-[14px] text-foreground">{label}</p>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-border/50 mb-8" />

      {/* Catalogue context */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
          Catalogue
        </p>
        {[
          { stat: "130+", label: "Products available" },
          { stat: "12", label: "Product categories" },
          { stat: "AJ", label: "Fresh Foods wholesale" },
        ].map(({ stat, label }) => (
          <div key={stat} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
            <span className="text-[13px] text-muted-foreground">{label}</span>
            <span className="text-[13px] font-semibold text-foreground">{stat}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
