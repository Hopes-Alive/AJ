"use client";

import { useEffect, useState, useCallback } from "react";
import { getOrders, type Order } from "@/lib/api/orders";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, Clock, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";

/* ── helpers ─────────────────────────────────────────────────── */
function melbDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "numeric", month: "short",
  });
}

function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString("en-AU", { timeZone: "Australia/Melbourne", weekday: "short", day: "numeric" }));
  }
  return days;
}

function isoToMelbDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne", weekday: "short", day: "numeric",
  });
}

/* ── custom tooltip ── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card shadow-xl px-3.5 py-2.5 text-sm min-w-[120px]"
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
      <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className="font-black text-foreground text-base">${payload[0].value.toFixed(2)}</p>
    </div>
  );
}

/* ── status pie config ── */
const STATUS_PIE: Record<string, { label: string; color: string }> = {
  payment_pending: { label: "Payment Pending", color: "#f59e0b" },
  paid:            { label: "Paid",             color: "#10b981" },
  cancelled:       { label: "Cancelled",        color: "#ef4444" },
  pending:         { label: "Pending",          color: "#8b5cf6" },
  in_progress:     { label: "In Progress",      color: "#3b82f6" },
  closed:          { label: "Closed",           color: "#6b7280" },
};

/* ── mini sparkline SVG ── */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const w = 80; const h = 28; const pts = values.length;
  const points = values.map((v, i) => {
    const x = (i / (pts - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── main component ── */
export function DashboardStats() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { setOrders(await getOrders()); } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  /* derived data */
  const days = last7Days();
  const revenueByDay = days.map(day => ({
    day,
    revenue: orders
      .filter(o => isoToMelbDay(o.created_at) === day && o.status !== "cancelled")
      .reduce((s, o) => s + o.subtotal, 0),
    orders: orders.filter(o => isoToMelbDay(o.created_at) === day).length,
  }));

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.subtotal, 0);
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === "paid").length;
  const pendingPayment = orders.filter(o => o.status === "payment_pending").length;
  const weekRevenue = revenueByDay.reduce((s, d) => s + d.revenue, 0);
  const revenueSparkline = revenueByDay.map(d => d.revenue);

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusCounts)
    .map(([key, value]) => ({ name: STATUS_PIE[key]?.label ?? key, value, color: STATUS_PIE[key]?.color ?? "#888" }))
    .filter(d => d.value > 0);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(0)}`,
      sub: `avg $${avgOrderValue.toFixed(0)}/order`,
      icon: DollarSign,
      color: "#10b981",
      bg: "oklch(0.6 0.15 160 / 0.08)",
      border: "oklch(0.6 0.15 160 / 0.2)",
      sparkValues: revenueSparkline,
    },
    {
      label: "Total Orders",
      value: totalOrders,
      sub: `${paidOrders} paid`,
      icon: ShoppingCart,
      color: "#3b82f6",
      bg: "oklch(0.55 0.18 250 / 0.08)",
      border: "oklch(0.55 0.18 250 / 0.2)",
      sparkValues: revenueByDay.map(d => d.orders),
    },
    {
      label: "This Week",
      value: `$${weekRevenue.toFixed(0)}`,
      sub: `${revenueByDay.filter(d => d.orders > 0).length} active days`,
      icon: TrendingUp,
      color: "#8b5cf6",
      bg: "oklch(0.52 0.2 300 / 0.07)",
      border: "oklch(0.52 0.2 300 / 0.2)",
      sparkValues: revenueSparkline,
    },
    {
      label: "Payment Due",
      value: pendingPayment,
      sub: `${((pendingPayment / Math.max(totalOrders, 1)) * 100).toFixed(0)}% of orders`,
      icon: Clock,
      color: "#f59e0b",
      bg: "oklch(0.7 0.18 50 / 0.07)",
      border: "oklch(0.7 0.18 50 / 0.2)",
      sparkValues: [],
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[104px] rounded-2xl border border-border animate-pulse"
              style={{ background: "rgba(0,0,0,0.03)" }} />
          ))}
        </div>
        <div className="flex items-center justify-center h-40 rounded-2xl border border-border"
          style={{ background: "rgba(0,0,0,0.02)" }}>
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center"
        style={{ background: "rgba(0,0,0,0.015)" }}>
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
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg, border, sparkValues }) => (
          <div key={label} className="rounded-2xl border p-4 flex flex-col gap-2"
            style={{ background: bg, borderColor: border, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20`, boxShadow: `0 2px 8px ${color}30` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              {sparkValues.length > 1 && <Sparkline values={sparkValues} color={color} />}
            </div>
            <div>
              <p className="text-2xl font-black text-foreground leading-none">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">{sub}</p>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Revenue bar chart — 2/3 width */}
        <div className="lg:col-span-2 rounded-2xl border border-border p-5"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-black text-foreground">Revenue — Last 7 Days</p>
              <p className="text-xs text-muted-foreground mt-0.5">Total: <span className="font-semibold text-foreground">${weekRevenue.toFixed(2)}</span></p>
            </div>
            <button onClick={fetch}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueByDay} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? "" : `$${v}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)", radius: 8 }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {revenueByDay.map((entry, i) => (
                  <Cell key={i} fill={entry.revenue > 0 ? "oklch(0.52 0.13 172)" : "oklch(0.52 0.13 172 / 0.2)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status donut — 1/3 width */}
        <div className="rounded-2xl border border-border p-5"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <p className="text-sm font-black text-foreground mb-1">Order Status</p>
          <p className="text-xs text-muted-foreground mb-4">{totalOrders} total order{totalOrders !== 1 ? "s" : ""}</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="45%"
                  innerRadius={45} outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={7}
                  formatter={(value) => (
                    <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontWeight: 600 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground/30 text-xs">No data</div>
          )}
        </div>
      </div>

      {/* Recent orders mini-table */}
      {orders.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))" }}>
            <p className="text-sm font-black text-foreground">Recent Orders</p>
            <Link href="/dashboard/orders"
              className="text-xs font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-border/50">
            {orders.slice(0, 5).map(order => {
              const cfg = STATUS_PIE[order.status];
              return (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{order.order_name || "(Unnamed)"}</p>
                    <p className="text-xs text-muted-foreground font-mono">{order.order_number} · {melbDate(order.created_at)}</p>
                  </div>
                  <span className="text-sm font-black text-foreground">${order.subtotal.toFixed(2)}</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ background: `${cfg?.color ?? "#888"}20`, color: cfg?.color ?? "#888" }}>
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
