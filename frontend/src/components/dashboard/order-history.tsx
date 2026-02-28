"use client";

import { useState, useEffect, useCallback } from "react";
import { getOrders, updateOrderStatus, type Order } from "@/lib/api/orders";
import { OrderStatusBadge, STATUS_CONFIG, ALL_STATUSES } from "./order-status-badge";
import { OrderDetailModal } from "./order-detail-modal";
import {
  ChevronDown, Loader2, RefreshCw, ClipboardList,
  MapPin, FileText, Calendar, Package, Check,
  ExternalLink, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

function melbDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "numeric", month: "short", year: "numeric",
  });
}

function melbDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }) + " AEDT";
}

function StatusSelector({
  orderId, current, onUpdated,
}: {
  orderId: string;
  current: Order["status"];
  onUpdated: (updated: Order) => void;
}) {
  const [selected, setSelected] = useState<Order["status"]>(current);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isDirty = selected !== current;

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateOrderStatus(orderId, selected);
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
      setSelected(current);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <select
        value={selected}
        onChange={e => setSelected(e.target.value as Order["status"])}
        className="text-sm border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer font-medium"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        {ALL_STATUSES.filter(([v]) => ["payment_pending", "paid", "cancelled"].includes(v)).map(([value, cfg]) => (
          <option key={value} value={value}>{cfg.label}</option>
        ))}
      </select>

      {isDirty && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
            boxShadow: "0 4px 12px oklch(0.52 0.13 172 / 0.35)",
          }}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          {saving ? "Saving…" : "Save"}
        </button>
      )}

      {saved && !isDirty && (
        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
          <Check className="h-3.5 w-3.5" /> Saved!
        </span>
      )}
    </div>
  );
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<Order["status"] | "all">("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true); setError(null);
    try { setOrders(await getOrders()); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to load"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  function handleUpdated(updated: Order) {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
  }

  const filtered = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);
  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const totalValue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.subtotal, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, oklch(0.52 0.13 172 / 0.15), oklch(0.44 0.11 192 / 0.15))", boxShadow: "0 4px 20px oklch(0.52 0.13 172 / 0.12)" }}>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">Loading your orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <ClipboardList className="h-6 w-6 text-destructive/60" />
        </div>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, oklch(0.52 0.13 172 / 0.1), oklch(0.44 0.11 192 / 0.08))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}>
          <ClipboardList className="h-9 w-9 text-primary/30" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-foreground mb-1">No orders yet</h3>
          <p className="text-muted-foreground text-sm">Orders placed will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, oklch(0.55 0.18 250 / 0.15), oklch(0.5 0.16 260 / 0.1))", boxShadow: "0 2px 8px oklch(0.55 0.18 250 / 0.12)" }}>
            <ClipboardList className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground">My Orders</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""} · <span className="font-semibold text-foreground">${totalValue.toFixed(2)}</span> total</p>
          </div>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl px-3 py-1.5 hover:bg-muted transition-all"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Orders", value: orders.length, icon: ClipboardList, color: "text-blue-500", bg: "oklch(0.55 0.18 250 / 0.08)" },
          { label: "Total Value", value: `$${totalValue.toFixed(0)}`, icon: TrendingUp, color: "text-emerald-500", bg: "oklch(0.6 0.15 160 / 0.08)" },
          { label: "In Progress", value: counts.in_progress ?? 0, icon: Package, color: "text-primary", bg: "oklch(0.52 0.13 172 / 0.08)" },
          { label: "Payment Due", value: counts.payment_pending ?? 0, icon: RefreshCw, color: "text-orange-500", bg: "oklch(0.7 0.18 50 / 0.08)" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-border/80 p-4" style={{ background: bg, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <Icon className={cn("h-4 w-4 mb-2", color)} />
            <p className="text-xl font-black text-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs — scrollable on mobile */}
      <div className="mb-5 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-border/60 w-fit min-w-full sm:min-w-0"
          style={{ background: "rgba(0,0,0,0.025)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)" }}>
          <button onClick={() => setFilterStatus("all")}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0",
              filterStatus === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            All <span className="ml-1 opacity-60">{orders.length}</span>
          </button>
          {ALL_STATUSES.filter(([s]) => counts[s]).map(([value, cfg]) => (
            <button key={value} onClick={() => setFilterStatus(value)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0",
                filterStatus === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
              {cfg.label} <span className="opacity-60">{counts[value]}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm rounded-2xl border border-dashed border-border">
          No orders with this status.
        </div>
      )}

      {/* Order cards */}
      <div className="space-y-3">
        {filtered.map(order => {
          const isExpanded = expandedId === order.id;
          const cfg = STATUS_CONFIG[order.status];
          const totalCartons = order.items.reduce((s, i) => s + i.quantity, 0);

          return (
            <div
              key={order.id}
              className="rounded-2xl overflow-hidden border transition-all duration-300"
              style={{
                borderColor: isExpanded ? cfg.border : "rgba(0,0,0,0.08)",
                boxShadow: isExpanded
                  ? `0 8px 32px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.06)`
                  : "0 2px 8px rgba(0,0,0,0.04)",
                background: isExpanded ? `radial-gradient(ellipse 120% 80% at 0% 0%, ${cfg.glow}, transparent 60%)` : undefined,
              }}
            >
              {/* Status bar accent */}
              <div className={cn("h-1 w-full bg-gradient-to-r", cfg.bar)} />

              {/* Row header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-muted/20 transition-colors text-left bg-card"
              >
                {/* Order number + name */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-foreground text-sm truncate leading-tight">
                    {order.order_name || "(Unnamed order)"}
                  </p>
                  {/* Mobile: compact 2-line meta */}
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground sm:hidden flex-wrap">
                    <span className="font-mono font-semibold text-foreground/50 text-[10px]">{order.order_number}</span>
                    <span className="opacity-30">·</span>
                    <span className="font-bold text-foreground/80">${order.subtotal.toFixed(2)}</span>
                  </div>
                  {/* Tablet/desktop: full meta */}
                  <div className="hidden sm:flex items-center gap-2 mt-0.5 text-xs text-muted-foreground flex-wrap">
                    <span className="font-mono font-semibold text-foreground/60">{order.order_number}</span>
                    <span className="opacity-30">·</span>
                    <span>{melbDate(order.created_at)}</span>
                    <span className="opacity-30">·</span>
                    <span>{totalCartons} carton{totalCartons !== 1 ? "s" : ""}</span>
                    <span className="opacity-30">·</span>
                    <span className="font-bold text-foreground">${order.subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <OrderStatusBadge status={order.status} />

                <div className={cn(
                  "w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
                  isExpanded ? "bg-primary border-primary text-primary-foreground rotate-180" : "border-border text-muted-foreground"
                )}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </div>
              </button>

              {/* Expanded panel */}
              {isExpanded && (
                <div
                  className="border-t border-border/60"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, transparent 100%)" }}
                >
                  {/* Top action bar */}
                  <div className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap border-b border-border/40"
                    style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.02), transparent)" }}>
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-[3px] rounded-full" style={{ background: cfg.color ?? "#888" }} />
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.18em]">Update Status</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Change this order&apos;s payment status</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusSelector orderId={order.id} current={order.status} onUpdated={handleUpdated} />
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-primary border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" /> Full view
                      </button>
                    </div>
                  </div>

                  {/* Info strip: 3 detail tiles */}
                  <div className="grid sm:grid-cols-3 gap-3 px-4 pt-4">
                    {/* Delivery */}
                    <div
                      className="rounded-2xl p-4 border border-border/60 relative overflow-hidden"
                      style={{ background: "rgba(16,185,129,0.04)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10"
                        style={{ background: "radial-gradient(circle, #10b981, transparent 70%)", transform: "translate(30%, -30%)" }} />
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">Delivery To</p>
                      </div>
                      <p className="text-sm text-foreground font-semibold leading-snug">{order.delivery_address}</p>
                    </div>

                    {/* Placed */}
                    <div
                      className="rounded-2xl p-4 border border-border/60 relative overflow-hidden"
                      style={{ background: "rgba(59,130,246,0.04)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10"
                        style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", transform: "translate(30%, -30%)" }} />
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">Placed</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-snug">{melbDateTime(order.created_at)}</p>
                      <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                        {totalCartons} carton{totalCartons !== 1 ? "s" : ""} &middot; {order.items.length} product{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Notes */}
                    <div
                      className="rounded-2xl p-4 border border-border/60 relative overflow-hidden"
                      style={{ background: "rgba(139,92,246,0.04)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10"
                        style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)", transform: "translate(30%, -30%)" }} />
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <FileText className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/60">Notes</p>
                      </div>
                      {order.notes
                        ? <p className="text-sm text-foreground font-medium leading-snug">{order.notes}</p>
                        : <p className="text-sm text-muted-foreground/40 italic">No notes added</p>}
                    </div>
                  </div>

                  {/* Product table */}
                  <div className="px-4 pt-4 pb-5">
                    <div className="rounded-2xl border border-border/70 overflow-hidden"
                      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                      {/* Table header */}
                      <div
                        className="px-5 py-3 flex items-center justify-between border-b border-border/60"
                        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.015))" }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
                            Order Items · <span className="text-foreground">{order.items.length}</span> product{order.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <p className="text-[10px] font-semibold text-muted-foreground">{totalCartons} cartons total</p>
                      </div>

                      <div className="divide-y divide-border/40">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-muted/20 transition-colors group"
                          >
                            {/* Index bubble */}
                            <span className="w-5 h-5 rounded-md text-[9px] font-black text-muted-foreground/40 bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-muted">
                              {idx + 1}
                            </span>

                            {/* Name + meta */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-foreground truncate leading-tight">{item.productName}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.groupName} · {item.pack}</p>
                            </div>

                            {/* Qty badge */}
                            <span
                              className="inline-flex items-center justify-center min-w-[1.8rem] h-6 px-1.5 rounded-lg text-xs font-black shrink-0"
                              style={{
                                background: "oklch(0.52 0.13 172 / 0.12)",
                                color: "oklch(0.44 0.11 172)",
                                border: "1px solid oklch(0.52 0.13 172 / 0.2)",
                              }}
                            >
                              ×{item.quantity}
                            </span>

                            {/* Price per unit — hidden on mobile */}
                            <div className="hidden sm:flex flex-col items-end shrink-0 min-w-[52px]">
                              <span className="text-xs text-muted-foreground font-medium">${(item.customPrice ?? 0).toFixed(2)}</span>
                              <span className="text-[9px] text-muted-foreground/40">ea.</span>
                            </div>

                            {/* Line total */}
                            <div className="flex flex-col items-end shrink-0 min-w-[58px]">
                              <span className="text-sm font-black text-foreground">${item.lineTotal.toFixed(2)}</span>
                              {/* show unit price on mobile under total */}
                              <span className="text-[9px] text-muted-foreground/40 sm:hidden">${(item.customPrice ?? 0).toFixed(2)} ea.</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Subtotal footer */}
                      <div
                        className="flex items-center justify-between px-5 py-4 border-t-2 border-border/60"
                        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.025), rgba(0,0,0,0.01))" }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-muted-foreground">{totalCartons} carton{totalCartons !== 1 ? "s" : ""}</span>
                          <span className="text-muted-foreground/30">·</span>
                          <span className="text-xs font-semibold text-muted-foreground">{order.items.length} product{order.items.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-muted-foreground">Order Total</span>
                          <span
                            className="text-xl font-black"
                            style={{
                              background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
                              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            }}
                          >${order.subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  );
}
