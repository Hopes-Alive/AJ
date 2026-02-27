"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getOrders,
  updateOrderStatus,
  type Order,
} from "@/lib/api/orders";
import { OrderStatusBadge, STATUS_CONFIG, ALL_STATUSES } from "./order-status-badge";
import { OrderDetailModal } from "./order-detail-modal";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  ClipboardList,
  MapPin,
  FileText,
  Calendar,
  Package,
  Check,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

function StatusSelector({
  orderId,
  current,
  onUpdated,
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
    <div className="flex items-center gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as Order["status"])}
        className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors cursor-pointer"
      >
        {ALL_STATUSES.map(([value, cfg]) => (
          <option key={value} value={value}>{cfg.label}</option>
        ))}
      </select>

      {isDirty && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Check className="h-3.5 w-3.5" />
          }
          {saving ? "Saving…" : "Save"}
        </button>
      )}

      {saved && !isDirty && (
        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <Check className="h-3 w-3" /> Saved
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
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  function handleUpdated(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  const filtered = filterStatus === "all"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  // Status counts for filter tabs
  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive mb-4">{error}</p>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors mx-auto">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <ClipboardList className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-1">No orders yet</h3>
        <p className="text-muted-foreground text-sm">Orders will appear here once created.</p>
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* All filter */}
          <button
            onClick={() => setFilterStatus("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
              filterStatus === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            All <span className="ml-1 opacity-70">{orders.length}</span>
          </button>

          {/* Per-status filters */}
          {ALL_STATUSES.filter(([s]) => counts[s]).map(([value, cfg]) => (
            <button
              key={value}
              onClick={() => setFilterStatus(value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border flex items-center gap-1.5",
                filterStatus === value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />
              {cfg.label}
              <span className="opacity-70">{counts[value]}</span>
            </button>
          ))}
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No orders with this status.
        </div>
      )}

      {/* Order list */}
      <div className="space-y-2">
        {filtered.map((order) => {
          const isExpanded = expandedId === order.id;
          const cfg = STATUS_CONFIG[order.status];

          return (
            <div
              key={order.id}
              className={cn(
                "border rounded-xl bg-card overflow-hidden transition-all",
                isExpanded ? "border-primary/30 shadow-sm" : "border-border"
              )}
            >
              {/* Row header — clickable to expand */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/20 transition-colors text-left"
              >
                {/* Status dot */}
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", cfg?.dot ?? "bg-gray-400")} />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {order.order_name || "(Unnamed order)"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground flex-wrap">
                    <span className="font-mono">{order.order_number}</span>
                    <span className="opacity-40">·</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString("en-AU", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    <span className="opacity-40">·</span>
                    <span>{order.items.reduce((s, i) => s + i.quantity, 0)} cartons</span>
                    <span className="opacity-40">·</span>
                    <span className="font-medium text-foreground">${order.subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <OrderStatusBadge status={order.status} />

                {isExpanded
                  ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                }
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-border">

                  {/* Status editor */}
                  <div className="px-5 py-4 bg-muted/20 border-b border-border flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Update Status
                      </p>
                      <StatusSelector
                        orderId={order.id}
                        current={order.status}
                        onUpdated={handleUpdated}
                      />
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Full details
                    </button>
                  </div>

                  {/* Delivery + notes */}
                  <div className="px-5 py-4 grid sm:grid-cols-2 gap-4 border-b border-border">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" /> Delivery address
                      </p>
                      <p className="text-sm text-foreground">{order.delivery_address}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3" /> Placed
                        </p>
                        <p className="text-sm text-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-AU", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                          <Package className="h-3 w-3" /> Cartons
                        </p>
                        <p className="text-sm text-foreground">
                          {order.items.reduce((s, i) => s + i.quantity, 0)}
                        </p>
                      </div>
                    </div>
                    {order.notes && (
                      <div className="sm:col-span-2">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                          <FileText className="h-3 w-3" /> Notes
                        </p>
                        <p className="text-sm text-foreground">{order.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Product lines */}
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Order Items
                    </p>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/40 border-b border-border">
                            <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium">Product</th>
                            <th className="text-center px-3 py-2 text-xs text-muted-foreground font-medium">Qty</th>
                            <th className="text-center px-3 py-2 text-xs text-muted-foreground font-medium">Unit Price</th>
                            <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {order.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-muted/20">
                              <td className="px-3 py-2.5">
                                <p className="font-medium text-foreground">{item.productName}</p>
                                <p className="text-xs text-muted-foreground">{item.groupName} · {item.pack}</p>
                              </td>
                              <td className="px-3 py-2.5 text-center text-muted-foreground">×{item.quantity}</td>
                              <td className="px-3 py-2.5 text-center text-muted-foreground">
                                ${(item.customPrice ?? 0).toFixed(2)}
                              </td>
                              <td className="px-3 py-2.5 text-right font-semibold">${item.lineTotal.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-border bg-muted/20">
                            <td colSpan={3} className="px-3 py-2.5 font-semibold text-foreground text-right pr-4">Subtotal</td>
                            <td className="px-3 py-2.5 text-right font-bold text-foreground text-base">
                              ${order.subtotal.toFixed(2)}
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
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
