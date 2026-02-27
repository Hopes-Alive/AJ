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
        {ALL_STATUSES.map(([value, cfg]) => (
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
  const totalValue = orders.reduce((s, o) => s + o.subtotal, 0);

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

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap mb-5 p-1 rounded-xl border border-border/60 w-fit max-w-full"
        style={{ background: "rgba(0,0,0,0.025)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)" }}>
        <button onClick={() => setFilterStatus("all")}
          className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
            filterStatus === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          All <span className="ml-1 opacity-60">{orders.length}</span>
        </button>
        {ALL_STATUSES.filter(([s]) => counts[s]).map(([value, cfg]) => (
          <button key={value} onClick={() => setFilterStatus(value)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              filterStatus === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
            {cfg.label} <span className="opacity-60">{counts[value]}</span>
          </button>
        ))}
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
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors text-left bg-card"
              >
                {/* Order number + name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-foreground text-sm truncate">
                      {order.order_name || "(Unnamed order)"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground flex-wrap">
                    <span className="font-mono font-semibold text-foreground/60">{order.order_number}</span>
                    <span className="opacity-30">·</span>
                    <span>{new Date(order.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</span>
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
                <div className="bg-card">
                  {/* Status editor */}
                  <div className="mx-4 mb-0 mt-0 rounded-2xl border border-border overflow-hidden"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                    <div className="px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap"
                      style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))" }}>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Update Status</p>
                        <StatusSelector orderId={order.id} current={order.status} onUpdated={handleUpdated} />
                      </div>
                      <button onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" /> Full details
                      </button>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid sm:grid-cols-3 gap-3 px-4 py-4">
                    {/* Delivery */}
                    <div className="rounded-2xl border border-border p-4"
                      style={{ background: "rgba(0,0,0,0.015)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Delivery</p>
                      </div>
                      <p className="text-sm text-foreground font-medium leading-snug">{order.delivery_address}</p>
                    </div>

                    {/* Date + cartons */}
                    <div className="rounded-2xl border border-border p-4"
                      style={{ background: "rgba(0,0,0,0.015)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Placed</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{totalCartons} carton{totalCartons !== 1 ? "s" : ""}</p>
                    </div>

                    {/* Notes */}
                    <div className="rounded-2xl border border-border p-4"
                      style={{ background: "rgba(0,0,0,0.015)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <FileText className="h-3.5 w-3.5 text-purple-500" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Notes</p>
                      </div>
                      <p className="text-sm text-foreground font-medium">{order.notes || <span className="text-muted-foreground/50 italic">No notes</span>}</p>
                    </div>
                  </div>

                  {/* Product table */}
                  <div className="px-4 pb-5">
                    <div className="rounded-2xl border border-border overflow-hidden"
                      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <div className="px-4 py-3 border-b border-border flex items-center gap-2"
                        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.025), rgba(0,0,0,0.01))" }}>
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Order Items · {order.items.length} product{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/20">
                            <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-semibold">Product</th>
                            <th className="text-center px-3 py-2.5 text-xs text-muted-foreground font-semibold">Qty</th>
                            <th className="text-center px-3 py-2.5 text-xs text-muted-foreground font-semibold">Price</th>
                            <th className="text-right px-4 py-2.5 text-xs text-muted-foreground font-semibold">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {order.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-3">
                                <p className="font-semibold text-foreground text-sm">{item.productName}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.groupName} · {item.pack}</p>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-foreground text-xs font-bold">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center text-sm text-muted-foreground font-medium">
                                ${(item.customPrice ?? 0).toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-bold text-foreground">${item.lineTotal.toFixed(2)}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-border">
                            <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">
                              Subtotal
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-lg font-black text-foreground">${order.subtotal.toFixed(2)}</span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
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
