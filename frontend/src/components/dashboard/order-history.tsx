"use client";

import { useState, useEffect, useCallback } from "react";
import { getOrders, updateOrderStatus, type Order } from "@/lib/api/orders";
import { OrderStatusBadge, STATUS_CONFIG, ALL_STATUSES } from "./order-status-badge";
import { OrderDetailModal } from "./order-detail-modal";
import {
  ChevronDown, ChevronUp, Loader2, RefreshCw,
  MapPin, Calendar, Package, Check, ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Status selector ─────────────────────────────────────── */
function StatusSelector({
  orderId, current, onUpdated,
}: { orderId: string; current: Order["status"]; onUpdated: (o: Order) => void }) {
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
    } catch {
      setSelected(current);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as Order["status"])}
        className="text-[13px] border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 transition-colors cursor-pointer"
      >
        {ALL_STATUSES.map(([value, cfg]) => (
          <option key={value} value={value}>{cfg.label}</option>
        ))}
      </select>

      {isDirty && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          {saving ? "Saving" : "Save"}
        </button>
      )}

      {saved && !isDirty && (
        <span className="text-xs text-primary flex items-center gap-1">
          <Check className="h-3 w-3" /> Saved
        </span>
      )}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<Order["status"] | "all">("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setOrders(await getOrders()); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to load"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  function handleUpdated(updated: Order) {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
  }

  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const filtered = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={fetchOrders} className="inline-flex items-center gap-1.5 text-sm text-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  /* ── Empty ── */
  if (orders.length === 0) {
    return (
      <div className="py-32 text-center space-y-2">
        <p className="text-sm font-medium text-foreground">No orders yet</p>
        <p className="text-xs text-muted-foreground">Orders placed will appear here.</p>
      </div>
    );
  }

  return (
    <div className="pb-16">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <h1 className="text-[22px] font-bold text-foreground tracking-tight">Orders</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{orders.length} total</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
        <button
          onClick={() => setFilterStatus("all")}
          className={cn(
            "shrink-0 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors",
            filterStatus === "all"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          All <span className="ml-1 opacity-60">{orders.length}</span>
        </button>
        {ALL_STATUSES.filter(([s]) => counts[s]).map(([value, cfg]) => (
          <button
            key={value}
            onClick={() => setFilterStatus(value)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors",
              filterStatus === value
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
            {cfg.label}
            <span className="opacity-50">{counts[value]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">No orders with this status.</p>
      )}

      {/* Order rows */}
      <div className="border border-border rounded-xl overflow-hidden divide-y divide-border/60">
        {filtered.map((order) => {
          const isExpanded = expandedId === order.id;
          const cfg = STATUS_CONFIG[order.status];

          return (
            <div key={order.id}>

              {/* Row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left bg-card"
              >
                <span className={cn("w-2 h-2 rounded-full shrink-0", cfg?.dot ?? "bg-muted-foreground/30")} />

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground truncate leading-none mb-1">
                    {order.order_name || "Untitled order"}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <span className="font-mono">{order.order_number}</span>
                    <span className="opacity-30">·</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString("en-AU", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    <span className="opacity-30">·</span>
                    <span>{order.items.reduce((s, i) => s + i.quantity, 0)} ctn</span>
                    <span className="opacity-30">·</span>
                    <span className="font-semibold text-foreground">${order.subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <OrderStatusBadge status={order.status} />

                {isExpanded
                  ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                  : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                }
              </button>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="bg-muted/20 border-t border-border/60">

                  {/* Status + full details link */}
                  <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border/40">
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-2">Update Status</p>
                      <StatusSelector orderId={order.id} current={order.status} onUpdated={handleUpdated} />
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Full details <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Meta grid */}
                  <div className="px-5 py-4 grid sm:grid-cols-3 gap-4 border-b border-border/40">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide font-semibold mb-0.5">Delivery</p>
                        <p className="text-[13px] text-foreground">{order.delivery_address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide font-semibold mb-0.5">Placed</p>
                        <p className="text-[13px] text-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-AU", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-3.5 w-3.5 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide font-semibold mb-0.5">Cartons</p>
                        <p className="text-[13px] text-foreground">{order.items.reduce((s, i) => s + i.quantity, 0)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items table */}
                  <div className="px-5 py-4">
                    <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-3">Items</p>
                    <div className="rounded-lg border border-border/60 overflow-hidden">
                      <table className="w-full text-[13px]">
                        <thead>
                          <tr className="border-b border-border/60 bg-muted/30">
                            <th className="text-left px-4 py-2 text-[11px] text-muted-foreground font-semibold">Product</th>
                            <th className="text-center px-3 py-2 text-[11px] text-muted-foreground font-semibold w-16">Qty</th>
                            <th className="text-right px-4 py-2 text-[11px] text-muted-foreground font-semibold w-24">Unit</th>
                            <th className="text-right px-4 py-2 text-[11px] text-muted-foreground font-semibold w-24">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 bg-background">
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3">
                                <p className="font-medium text-foreground">{item.productName}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{item.groupName} · {item.pack}</p>
                              </td>
                              <td className="px-3 py-3 text-center text-muted-foreground">×{item.quantity}</td>
                              <td className="px-4 py-3 text-right text-muted-foreground">${(item.customPrice ?? 0).toFixed(2)}</td>
                              <td className="px-4 py-3 text-right font-semibold text-foreground">${item.lineTotal.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-border/60 bg-muted/20">
                            <td colSpan={3} className="px-4 py-3 text-right text-[12px] font-semibold text-muted-foreground">Subtotal</td>
                            <td className="px-4 py-3 text-right font-bold text-foreground">${order.subtotal.toFixed(2)}</td>
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
    </div>
  );
}
