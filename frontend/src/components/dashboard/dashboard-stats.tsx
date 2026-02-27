"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getOrders, type Order } from "@/lib/api/orders";
import { categories } from "@/data/products";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell,
  PieChart, Pie, PieLabelRenderProps,
} from "recharts";
import {
  TrendingUp, DollarSign, ShoppingCart, Clock,
  RefreshCw, Loader2, Calendar, ChevronDown, Package,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── helpers ─────────────────────────────────────────────────── */

function toMelbDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne", year: "numeric", month: "2-digit", day: "2-digit",
  }); // "dd/mm/yyyy"
}

function melbShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne", day: "numeric", month: "short",
  });
}

function todayMelb(): string {
  return new Date().toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne", year: "numeric", month: "2-digit", day: "2-digit",
  });
}

function daysAgoMelb(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne", year: "numeric", month: "2-digit", day: "2-digit",
  });
}

/** "dd/mm/yyyy" → Date object at midnight */
function parseMelbDate(s: string): Date {
  const [dd, mm, yyyy] = s.split("/");
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
}

/** "yyyy-mm-dd" input value → "dd/mm/yyyy" display */
function inputToMelb(s: string): string {
  if (!s) return "";
  const [y, m, d] = s.split("-");
  return `${d}/${m}/${y}`;
}

/** "dd/mm/yyyy" → "yyyy-mm-dd" for <input type="date"> */
function melbToInput(s: string): string {
  if (!s) return "";
  const [dd, mm, yyyy] = s.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

/* ── group → category map ─── */
const GROUP_TO_CAT: Record<string, string> = {};
for (const cat of categories) {
  for (const grp of cat.groups) {
    GROUP_TO_CAT[grp.name] = cat.name;
  }
}

/* ── status config ── */
const STATUS_CFG: Record<string, { label: string; color: string }> = {
  payment_pending: { label: "Payment Pending", color: "#f59e0b" },
  paid:            { label: "Paid",             color: "#10b981" },
  cancelled:       { label: "Cancelled",        color: "#ef4444" },
  pending:         { label: "Pending",          color: "#8b5cf6" },
  in_progress:     { label: "In Progress",      color: "#3b82f6" },
  closed:          { label: "Closed",           color: "#6b7280" },
};

/* ── CATEGORY COLORS ── */
const CAT_COLORS = [
  "#10b981","#3b82f6","#f59e0b","#ef4444","#8b5cf6",
  "#06b6d4","#f97316","#84cc16","#ec4899","#14b8a6","#a855f7","#64748b",
];

/* ── mini sparkline ── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const W = 72; const H = 26;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - (v / max) * H;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={W} height={H} className="opacity-70">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── custom tooltips ── */
function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5"
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <p className="font-black text-base text-foreground">${(payload[0].value ?? 0).toFixed(2)}</p>
    </div>
  );
}

function CatTooltip({ active, payload, label, mode }: {
  active?: boolean; payload?: { value: number; payload: { revenue: number; cartons: number } }[];
  label?: string; mode: "revenue" | "cartons";
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 min-w-[150px]"
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">{label}</p>
      <div className="space-y-1">
        <p className="text-sm font-black text-foreground">${d.revenue.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground font-medium">{d.cartons} cartons</p>
      </div>
    </div>
  );
}

/* ── preset range options ── */
const PRESETS = [
  { label: "7d",   days: 7  },
  { label: "14d",  days: 14 },
  { label: "30d",  days: 30 },
  { label: "All",  days: 0  },
];

/* ─────────────────────────────────────────────────────── */
export function DashboardStats() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* date range state */
  const [preset, setPreset] = useState<number>(7); // 0 = all time
  const [customFrom, setCustomFrom] = useState(""); // "yyyy-mm-dd"
  const [customTo, setCustomTo]     = useState(""); // "yyyy-mm-dd"
  const [showCustom, setShowCustom] = useState(false);

  /* category chart toggle */
  const [catMode, setCatMode] = useState<"revenue" | "cartons">("revenue");

  const load = useCallback(async () => {
    setLoading(true);
    try { setOrders(await getOrders()); } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── date filter ── */
  const filteredOrders = useMemo(() => {
    if (showCustom && customFrom && customTo) {
      const from = new Date(`${customFrom}T00:00:00`);
      const to   = new Date(`${customTo}T23:59:59`);
      return orders.filter(o => {
        const d = new Date(o.created_at);
        return d >= from && d <= to;
      });
    }
    if (preset === 0) return orders;
    const fromStr = daysAgoMelb(preset - 1);
    const fromDate = parseMelbDate(fromStr);
    return orders.filter(o => new Date(o.created_at) >= fromDate);
  }, [orders, preset, showCustom, customFrom, customTo]);

  /* ── date axis labels ── */
  const dateLabels = useMemo(() => {
    const days = showCustom && customFrom && customTo
      ? Math.round((new Date(`${customTo}T00:00:00`).getTime() - new Date(`${customFrom}T00:00:00`).getTime()) / 86400000) + 1
      : preset === 0 ? 14 : preset;
    const pts: { day: string; full: string }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      if (showCustom && customFrom) {
        const base = new Date(`${customFrom}T00:00:00`);
        base.setDate(base.getDate() + (days - 1 - i));
        pts.push({
          day: base.toLocaleDateString("en-AU", { timeZone: "Australia/Melbourne", weekday: "short", day: "numeric" }),
          full: base.toLocaleDateString("en-AU", { timeZone: "Australia/Melbourne", year: "numeric", month: "2-digit", day: "2-digit" }),
        });
      } else {
        d.setDate(d.getDate() - i);
        pts.push({
          day: d.toLocaleDateString("en-AU", { timeZone: "Australia/Melbourne", weekday: "short", day: "numeric" }),
          full: d.toLocaleDateString("en-AU", { timeZone: "Australia/Melbourne", year: "numeric", month: "2-digit", day: "2-digit" }),
        });
      }
    }
    return pts;
  }, [preset, showCustom, customFrom, customTo]);

  /* ── revenue by day ── */
  const revenueByDay = useMemo(() => dateLabels.map(({ day }) => ({
    day,
    revenue: filteredOrders.filter(o => {
      const mD = new Date(o.created_at).toLocaleDateString("en-AU", { timeZone: "Australia/Melbourne", weekday: "short", day: "numeric" });
      return mD === day && o.status !== "cancelled";
    }).reduce((s, o) => s + o.subtotal, 0),
  })), [filteredOrders, dateLabels]);

  /* ── category breakdown ── */
  const categoryData = useMemo(() => {
    const map: Record<string, { revenue: number; cartons: number; color: string }> = {};
    const catNames = categories.map(c => c.name);
    catNames.forEach((n, i) => { map[n] = { revenue: 0, cartons: 0, color: CAT_COLORS[i % CAT_COLORS.length] }; });

    for (const order of filteredOrders) {
      if (order.status === "cancelled") continue;
      for (const item of order.items) {
        const catName = GROUP_TO_CAT[item.groupName] ?? item.groupName;
        if (!map[catName]) map[catName] = { revenue: 0, cartons: 0, color: CAT_COLORS[Object.keys(map).length % CAT_COLORS.length] };
        map[catName].revenue += item.lineTotal;
        map[catName].cartons += item.quantity;
      }
    }
    return Object.entries(map)
      .map(([name, d]) => ({ name, ...d }))
      .filter(d => d.revenue > 0 || d.cartons > 0)
      .sort((a, b) => b[catMode] - a[catMode]);
  }, [filteredOrders, catMode]);

  /* ── summary stats ── */
  const totalRevenue   = filteredOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.subtotal, 0);
  const totalOrders    = filteredOrders.length;
  const paidOrders     = filteredOrders.filter(o => o.status === "paid").length;
  const pendingPayment = filteredOrders.filter(o => o.status === "payment_pending").length;
  const periodRevenue  = revenueByDay.reduce((s, d) => s + d.revenue, 0);
  const avgOrderValue  = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusCounts = filteredOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1; return acc;
  }, {});
  const pieData = Object.entries(statusCounts)
    .map(([key, value]) => ({ name: STATUS_CFG[key]?.label ?? key, value, color: STATUS_CFG[key]?.color ?? "#888" }))
    .filter(d => d.value > 0);

  const statCards = [
    { label: "Revenue",     value: `$${totalRevenue.toFixed(0)}`,  sub: `avg $${avgOrderValue.toFixed(0)}/order`, icon: DollarSign, color: "#10b981", bg: "oklch(0.6 0.15 160 / 0.08)", border: "oklch(0.6 0.15 160 / 0.2)", spark: revenueByDay.map(d => d.revenue) },
    { label: "Orders",      value: totalOrders,                     sub: `${paidOrders} paid`,                     icon: ShoppingCart, color: "#3b82f6", bg: "oklch(0.55 0.18 250 / 0.08)", border: "oklch(0.55 0.18 250 / 0.2)", spark: revenueByDay.map(d => d.revenue > 0 ? 1 : 0) },
    { label: "Period Total", value: `$${periodRevenue.toFixed(0)}`, sub: `selected period`,                        icon: TrendingUp,   color: "#8b5cf6", bg: "oklch(0.52 0.2 300 / 0.07)",  border: "oklch(0.52 0.2 300 / 0.2)",  spark: revenueByDay.map(d => d.revenue) },
    { label: "Payment Due", value: pendingPayment,                  sub: `${((pendingPayment / Math.max(totalOrders, 1)) * 100).toFixed(0)}% of orders`, icon: Clock, color: "#f59e0b", bg: "oklch(0.7 0.18 50 / 0.07)", border: "oklch(0.7 0.18 50 / 0.2)", spark: [] },
  ];

  /* ── date range label ── */
  const rangeLabel = showCustom && customFrom && customTo
    ? `${customFrom} → ${customTo}`
    : preset === 0 ? "All time" : `Last ${preset} days`;

  /* ── loading / empty ── */
  if (loading) return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[104px] rounded-2xl border border-border animate-pulse" style={{ background: "rgba(0,0,0,0.03)" }} />
        ))}
      </div>
      <div className="flex items-center justify-center h-40 rounded-2xl border border-border" style={{ background: "rgba(0,0,0,0.02)" }}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center" style={{ background: "rgba(0,0,0,0.015)" }}>
      <ShoppingCart className="h-10 w-10 text-muted-foreground/25 mx-auto mb-3" />
      <p className="text-sm font-semibold text-muted-foreground mb-1">No orders yet</p>
      <p className="text-xs text-muted-foreground/60 mb-5">Charts and insights will appear once you start placing orders.</p>
      <Link href="/dashboard/new-order"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
        style={{ background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))", boxShadow: "0 4px 14px oklch(0.52 0.13 172 / 0.3)" }}>
        <ShoppingCart className="h-4 w-4" /> Place first order
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">

      {/* ── Date range bar ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Presets */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-muted/30">
          {PRESETS.map(p => (
            <button
              key={p.days}
              onClick={() => { setPreset(p.days); setShowCustom(false); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                !showCustom && preset === p.days
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >{p.label}</button>
          ))}
        </div>

        {/* Custom range toggle */}
        <button
          onClick={() => setShowCustom(v => !v)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
            showCustom
              ? "bg-primary/10 border-primary/30 text-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          Custom
          <ChevronDown className={cn("h-3 w-3 transition-transform", showCustom && "rotate-180")} />
        </button>

        {showCustom && (
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={customFrom}
              max={customTo || melbToInput(todayMelb())}
              onChange={e => setCustomFrom(e.target.value)}
              className="text-xs border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-xs text-muted-foreground font-medium">to</span>
            <input
              type="date"
              value={customTo}
              min={customFrom}
              max={melbToInput(todayMelb())}
              onChange={e => setCustomTo(e.target.value)}
              className="text-xs border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}

        <span className="ml-auto text-xs text-muted-foreground font-medium">{rangeLabel}</span>

        <button onClick={load}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg, border, spark }) => (
          <div key={label} className="rounded-2xl border p-4 flex flex-col gap-2"
            style={{ background: bg, borderColor: border, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20`, boxShadow: `0 2px 8px ${color}28` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              {spark.length > 1 && <Sparkline values={spark} color={color} />}
            </div>
            <div>
              <p className="text-2xl font-black text-foreground leading-none">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">{sub}</p>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Revenue + Status row ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Revenue bar chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border p-5"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-black text-foreground">Revenue Over Time</p>
              <p className="text-xs text-muted-foreground mt-0.5">{rangeLabel} · <span className="font-semibold text-foreground">${periodRevenue.toFixed(2)}</span> total</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={revenueByDay} barSize={Math.max(8, Math.min(32, Math.floor(320 / revenueByDay.length)))}
              margin={{ top: 22, right: 4, bottom: 0, left: -12 }}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}
                interval={revenueByDay.length > 14 ? Math.floor(revenueByDay.length / 7) : 0} />
              <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}
                tickFormatter={v => v === 0 ? "" : `$${v}`} />
              <Tooltip content={<RevenueTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)", radius: 8 }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {revenueByDay.map((entry, i) => (
                  <Cell key={i} fill={entry.revenue > 0 ? "oklch(0.52 0.13 172)" : "oklch(0.52 0.13 172 / 0.18)"} />
                ))}
                <LabelList dataKey="revenue" position="top"
                  formatter={(v: number) => v > 0 ? `$${v.toFixed(0)}` : ""}
                  style={{ fontSize: 9, fontWeight: 700, fill: "var(--muted-foreground)" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status donut */}
        <div className="rounded-2xl border border-border p-5"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <p className="text-sm font-black text-foreground mb-1">Order Status</p>
          <p className="text-xs text-muted-foreground mb-3">{totalOrders} orders · {rangeLabel}</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={148}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%"
                    innerRadius={38} outerRadius={60}
                    paddingAngle={3} dataKey="value" strokeWidth={0} labelLine={false}
                    label={(props: PieLabelRenderProps) => {
                      const { cx, cy, midAngle, outerRadius, percent } = props;
                      if ((percent ?? 0) < 0.07) return null;
                      const R = Math.PI / 180;
                      const r = (outerRadius as number) + 13;
                      const x = (cx as number) + r * Math.cos(-(midAngle as number) * R);
                      const y = (cy as number) + r * Math.sin(-(midAngle as number) * R);
                      return (
                        <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                          style={{ fontSize: 9, fontWeight: 800, fill: "var(--foreground)" }}>
                          {`${((percent ?? 0) * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map(e => (
                  <div key={e.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
                    <span className="text-[11px] text-muted-foreground flex-1 truncate font-medium">{e.name}</span>
                    <span className="text-[11px] font-black text-foreground">{e.value}</span>
                    <span className="text-[10px] text-muted-foreground/60 w-8 text-right">
                      {((e.value / Math.max(totalOrders, 1)) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground/30 text-xs">No data</div>
          )}
        </div>
      </div>

      {/* ── Category sales chart ── */}
      <div className="rounded-2xl border border-border p-5"
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="text-sm font-black text-foreground">Sales by Category</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {rangeLabel} · {categoryData.length} active categor{categoryData.length !== 1 ? "ies" : "y"}
            </p>
          </div>
          {/* Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-muted/30">
            <button
              onClick={() => setCatMode("revenue")}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                catMode === "revenue" ? "bg-background text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <DollarSign className="h-3 w-3" /> Revenue
            </button>
            <button
              onClick={() => setCatMode("cartons")}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                catMode === "cartons" ? "bg-background text-foreground shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Package className="h-3 w-3" /> Cartons
            </button>
          </div>
        </div>

        {categoryData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={Math.max(200, categoryData.length * 38)}>
              <BarChart data={categoryData} layout="vertical" barSize={22}
                margin={{ top: 2, right: 70, bottom: 2, left: 4 }}>
                <XAxis type="number" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false}
                  tickFormatter={v => catMode === "revenue" ? `$${v}` : `${v}`} />
                <YAxis type="category" dataKey="name" width={110}
                  tick={{ fontSize: 10, fill: "var(--foreground)", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={(p) => <CatTooltip {...p} mode={catMode} />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                <Bar dataKey={catMode} radius={[0, 6, 6, 0]}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                  <LabelList dataKey={catMode} position="right"
                    formatter={(v: number) => catMode === "revenue" ? `$${v.toFixed(0)}` : `${v} ctn`}
                    style={{ fontSize: 10, fontWeight: 700, fill: "var(--foreground)" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Summary table below chart */}
            <div className="mt-4 border-t border-border/50 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {categoryData.slice(0, 8).map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2 p-2.5 rounded-xl border border-border/50"
                    style={{ background: `${cat.color}08` }}>
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: cat.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-foreground truncate">{cat.name}</p>
                      <p className="text-[10px] text-muted-foreground">${cat.revenue.toFixed(0)} · {cat.cartons} ctn</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground/30 text-xs">
            No category data for this period
          </div>
        )}
      </div>

      {/* ── Recent orders ── */}
      {filteredOrders.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))" }}>
            <p className="text-sm font-black text-foreground">Recent Orders</p>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-border/50">
            {filteredOrders.slice(0, 5).map(order => {
              const cfg = STATUS_CFG[order.status];
              return (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{order.order_name || "(Unnamed)"}</p>
                    <p className="text-xs text-muted-foreground font-mono">{order.order_number} · {melbShort(order.created_at)}</p>
                  </div>
                  <span className="text-sm font-black text-foreground">${order.subtotal.toFixed(2)}</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${cfg?.color ?? "#888"}18`, color: cfg?.color ?? "#888" }}>
                    {cfg?.label ?? order.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
