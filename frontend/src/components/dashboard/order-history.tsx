"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getOrders, updateOrderStatus, type Order } from "@/lib/api/orders";
import { OrderStatusBadge, STATUS_CONFIG, ALL_STATUSES } from "./order-status-badge";
import { OrderDetailModal } from "./order-detail-modal";
import {
  ChevronDown, Loader2, RefreshCw, ClipboardList,
  MapPin, FileText, Calendar, Package, Check,
  ExternalLink, TrendingUp, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const DATE_PRESETS = [
  { label: "All time", days: 0 },
  { label: "Today",    days: 1 },
  { label: "7 days",   days: 7 },
  { label: "14 days",  days: 14 },
  { label: "1 month",  days: 30 },
] as const;

function isWithinDays(iso: string, days: number): boolean {
  if (days === 0) return true;
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  from.setHours(0, 0, 0, 0);
  return new Date(iso) >= from;
}

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

const META_PHONE_PREFIX = "[PHONE]";
const META_ABN_PREFIX = "[ABN]";
const META_DELIVERY_DATE_PREFIX = "[DELIVERY_DATE]";

function parseOrderMeta(notes: string | null | undefined) {
  const text = (notes ?? "").trim();
  if (!text) return { deliveryDate: "", plainNotes: "" };
  const lines = text.split("\n");
  let deliveryDate = "";
  const plain: string[] = [];
  for (const line of lines) {
    if (line.startsWith(META_PHONE_PREFIX)) continue;
    if (line.startsWith(META_ABN_PREFIX)) continue;
    if (line.startsWith(META_DELIVERY_DATE_PREFIX)) {
      deliveryDate = line.slice(META_DELIVERY_DATE_PREFIX.length).trim();
      continue;
    }
    plain.push(line);
  }
  return { deliveryDate, plainNotes: plain.join("\n").trim() };
}

function formatDeliveryDate(value: string) {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
  useEffect(() => {
    setSelected(current);
  }, [current]);

  async function handleSave(nextStatus: Order["status"]) {
    if (saving || nextStatus === current) return;
    const previous = selected;
    setSelected(nextStatus);
    setSaving(true);
    try {
      const updated = await updateOrderStatus(orderId, nextStatus);
      onUpdated(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
      setSelected(previous);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <select
        value={selected}
        onChange={(e) => {
          const next = e.target.value as Order["status"];
          void handleSave(next);
        }}
        disabled={saving}
        className="text-sm md:text-base lg:text-sm border border-border rounded-xl px-3.5 py-2.5 md:py-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer font-medium"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        {ALL_STATUSES.filter(([v]) => ["payment_pending", "paid", "cancelled"].includes(v)).map(([value, cfg]) => (
          <option key={value} value={value}>{cfg.label}</option>
        ))}
      </select>

      {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}

      {saved && !saving && (
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
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<Order["status"] | "all">("all");
  const [datePreset, setDatePreset] = useState<number>(0); // 0 = all time
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);
  const orderCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const expandedPanelRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

  async function handleQuickPaymentChange(order: Order, nextStatus: Order["status"]) {
    if (order.status === nextStatus) return;
    setUpdatingOrderId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, nextStatus);
      handleUpdated(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update payment status");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  const dateFiltered = orders.filter(o => isWithinDays(o.created_at, datePreset));
  const filtered = dateFiltered.filter(o => filterStatus === "all" || o.status === filterStatus);
  const counts = dateFiltered.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const totalValue = dateFiltered.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.subtotal, 0);

  useEffect(() => {
    if (!expandedId) return;

    const run = () => {
      const cardEl = orderCardRefs.current[expandedId];
      const panelEl = expandedPanelRefs.current[expandedId];
      if (!cardEl || !panelEl) return;

      const stickyBottom = stickyHeaderRef.current?.getBoundingClientRect().bottom ?? 0;
      const topPadding = 12;
      const viewportTop = stickyBottom + topPadding;
      const viewportBottom = window.innerHeight - 12;
      const availableHeight = Math.max(120, viewportBottom - viewportTop);

      const cardRect = cardEl.getBoundingClientRect();
      window.scrollTo({
        top: Math.max(0, window.scrollY + cardRect.top - viewportTop),
        behavior: "smooth",
      });

      window.setTimeout(() => {
        const latestPanelRect = panelEl.getBoundingClientRect();
        if (latestPanelRect.height <= availableHeight && latestPanelRect.bottom > viewportBottom) {
          window.scrollBy({
            top: latestPanelRect.bottom - viewportBottom + 8,
            behavior: "smooth",
          });
        }
      }, 280);
    };

    const frame = window.requestAnimationFrame(run);
    return () => window.cancelAnimationFrame(frame);
  }, [expandedId]);

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
      <div ref={stickyHeaderRef} className="sticky top-[76px] md:top-[84px] lg:top-[88px] z-20 -mx-4 sm:mx-0 px-4 sm:px-0 pb-3 mb-4 bg-background/95 backdrop-blur-sm border-b border-border/50">
        {/* Page header */}
        <div className="flex items-start justify-between mb-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.18 250 / 0.15), oklch(0.5 0.16 260 / 0.1))", boxShadow: "0 2px 8px oklch(0.55 0.18 250 / 0.12)" }}>
              <ClipboardList className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">My Orders</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dateFiltered.length} order{dateFiltered.length !== 1 ? "s" : ""}
                {datePreset > 0 && <span className="ml-1 text-muted-foreground/60">· {datePreset === 1 ? "today" : datePreset === 30 ? "last month" : `last ${datePreset} days`}</span>}
                {" · "}<span className="font-semibold text-foreground">${totalValue.toFixed(2)}</span> revenue
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/dashboard/new-order"
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm md:text-base lg:text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
                boxShadow: "0 4px 14px oklch(0.52 0.13 172 / 0.32)",
              }}
            >
              <Plus className="h-4 w-4" />
              Start New Order
            </Link>
            <button onClick={fetchOrders}
              className="flex items-center gap-1.5 text-sm md:text-base lg:text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl px-3.5 py-2.5 hover:bg-muted transition-all"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Date range filter */}
        <div className="mb-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/70 mb-1.5 px-1">
            Date Range Tabs
          </p>
          <div className="flex items-center gap-1.5 mb-3 p-1.5 rounded-2xl border border-border/70 w-fit"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.48))", boxShadow: "0 4px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)" }}>
            {DATE_PRESETS.map(p => (
              <button
                key={p.days}
                onClick={() => setDatePreset(p.days)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border",
                  datePreset === p.days
                    ? "bg-background text-foreground border-primary/35 shadow-md shadow-primary/10"
                    : "bg-background/80 text-muted-foreground border-border/70 hover:text-foreground hover:border-primary/25 hover:bg-background"
                )}
              >
                {p.days > 0 && <Calendar className="h-3.5 w-3.5" />}
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter tabs — scrollable on mobile */}
        <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none" }}>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/70 mb-1.5 px-1">
            Status Tabs
          </p>
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-border/70 w-fit min-w-full sm:min-w-0"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.48))", boxShadow: "0 4px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)" }}>
            <button onClick={() => setFilterStatus("all")}
              className={cn("px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 border",
                filterStatus === "all" ? "bg-background text-foreground border-primary/35 shadow-md shadow-primary/10" : "bg-background/80 text-muted-foreground border-border/70 hover:text-foreground hover:border-primary/25 hover:bg-background")}>
              All
              <span className={cn(
                "ml-1.5 inline-flex min-w-[1.3rem] justify-center rounded-full px-1.5 text-xs font-bold",
                filterStatus === "all" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground/80"
              )}>{orders.length}</span>
            </button>
            {ALL_STATUSES.filter(([s]) => counts[s]).map(([value, cfg]) => (
              <button key={value} onClick={() => setFilterStatus(value)}
                className={cn("px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border",
                  filterStatus === value ? "bg-background text-foreground border-primary/35 shadow-md shadow-primary/10" : "bg-background/80 text-muted-foreground border-border/70 hover:text-foreground hover:border-primary/25 hover:bg-background")}>
                <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                {cfg.label}
                <span className={cn(
                  "inline-flex min-w-[1.3rem] justify-center rounded-full px-1.5 text-xs font-bold",
                  filterStatus === value ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground/80"
                )}>{counts[value]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: "Total Orders", value: dateFiltered.length, icon: ClipboardList, color: "text-blue-500", bg: "oklch(0.55 0.18 250 / 0.08)" },
          { label: "Total Value", value: `$${totalValue.toFixed(0)}`, icon: TrendingUp, color: "text-emerald-500", bg: "oklch(0.6 0.15 160 / 0.08)" },
          { label: "In Progress", value: counts.in_progress ?? 0, icon: Package, color: "text-primary", bg: "oklch(0.52 0.13 172 / 0.08)" },
          { label: "Payment Due", value: counts.payment_pending ?? 0, icon: RefreshCw, color: "text-orange-500", bg: "oklch(0.7 0.18 50 / 0.08)" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-border/80 p-4 md:p-5" style={{ background: bg, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <Icon className={cn("h-5 w-5 mb-2", color)} />
            <p className="text-xl font-black text-foreground">{value}</p>
            <p className="text-xs lg:text-[10px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm rounded-2xl border border-dashed border-border">
          No orders with this status.
        </div>
      )}

      {/* Order cards */}
      <div
        className="rounded-3xl border border-border/70 p-3 sm:p-4 md:p-5"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.56))",
          boxShadow: "0 10px 28px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.72)",
        }}
      >
        <div className="space-y-4 md:space-y-5">
          {filtered.map(order => {
            const isExpanded = expandedId === order.id;
            const cfg = STATUS_CONFIG[order.status];
            const totalCartons = order.items.reduce((s, i) => s + i.quantity, 0);
            const meta = parseOrderMeta(order.notes);
            const deliveryDateLabel = formatDeliveryDate(meta.deliveryDate);

            return (
              <div
                key={order.id}
                ref={(el) => {
                  orderCardRefs.current[order.id] = el;
                }}
                className="group rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-[1px]"
                style={{
                  borderColor: isExpanded ? cfg.border : "rgba(0,0,0,0.08)",
                  boxShadow: isExpanded
                    ? `0 14px 36px ${cfg.glow}, 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)`
                    : "0 10px 24px rgba(0,0,0,0.06), 0 3px 10px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.55)",
                  background: isExpanded
                    ? `radial-gradient(ellipse 120% 80% at 0% 0%, ${cfg.glow}, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88))`
                    : "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.9))",
                }}
              >
              {/* Status bar accent */}
              <div className={cn("h-1.5 w-full bg-gradient-to-r", cfg.bar)} />

              {/* Row header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 md:py-4.5 hover:bg-muted/25 transition-colors text-left bg-card/95"
              >
                {/* Order number + name */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-foreground text-sm md:text-base lg:text-sm truncate leading-tight">
                    {order.order_name || "(Unnamed order)"}
                  </p>
                  {/* Mobile: compact 2-line meta */}
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground sm:hidden flex-wrap">
                    <span className="font-mono font-semibold text-foreground/60 text-[10px] px-2 py-0.5 rounded-full bg-muted/50 border border-border/50">{order.order_number}</span>
                    {deliveryDateLabel ? (
                      <span className="px-2 py-0.5 rounded-full bg-muted/40 border border-border/50">Delivery {deliveryDateLabel}</span>
                    ) : null}
                    <span className="font-bold text-foreground/90 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">${order.subtotal.toFixed(2)}</span>
                  </div>
                  {/* Tablet/desktop: full meta */}
                  <div className="hidden sm:flex items-center gap-1.5 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span className="font-mono font-semibold text-foreground/60 px-2 py-0.5 rounded-full bg-muted/50 border border-border/50">{order.order_number}</span>
                    <span className="px-2 py-0.5 rounded-full bg-muted/40 border border-border/50">{melbDate(order.created_at)}</span>
                    {deliveryDateLabel ? (
                      <span className="px-2 py-0.5 rounded-full bg-muted/40 border border-border/50">Delivery {deliveryDateLabel}</span>
                    ) : null}
                    <span className="px-2 py-0.5 rounded-full bg-muted/40 border border-border/50">{totalCartons} carton{totalCartons !== 1 ? "s" : ""}</span>
                    <span className="font-bold text-foreground px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">${order.subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] uppercase tracking-wide font-bold text-muted-foreground">
                      Update
                    </span>
                    <div className="inline-flex items-center p-1 rounded-xl border border-border/70 bg-background shadow-sm">
                      {([
                        { value: "payment_pending", label: "Unpaid", active: "bg-amber-100 text-amber-800 border-amber-300/70" },
                        { value: "paid", label: "Paid", active: "bg-emerald-100 text-emerald-800 border-emerald-300/70" },
                        { value: "cancelled", label: "Cancelled", active: "bg-rose-100 text-rose-800 border-rose-300/70" },
                      ] as const).map(({ value, label, active }) => {
                        const selected = (order.status === "paid" ? "paid" : order.status === "cancelled" ? "cancelled" : "payment_pending") === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              void handleQuickPaymentChange(order, value);
                            }}
                            disabled={updatingOrderId === order.id}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[11px] md:text-xs font-semibold border transition-all disabled:opacity-60 disabled:cursor-not-allowed",
                              selected
                                ? active
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                            aria-label={`Set status to ${label}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    {updatingOrderId === order.id ? (
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    ) : null}
                  </div>
                </div>

                <div className={cn(
                  "w-8 h-8 md:w-9 md:h-9 lg:w-7 lg:h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
                  isExpanded ? "bg-primary border-primary text-primary-foreground rotate-180" : "border-border text-muted-foreground"
                )}>
                  <ChevronDown className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
                </div>
              </button>

              {/* Expanded panel */}
              {isExpanded && (
                <div
                  ref={(el) => {
                    expandedPanelRefs.current[order.id] = el;
                  }}
                  className="border-t border-border/60"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.012) 0%, rgba(0,0,0,0.006) 100%)" }}
                >
                  {/* Top action bar */}
                  <div className="flex items-center justify-between gap-4 px-5 py-3.5 flex-wrap border-b border-border/40 bg-background/70">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">Order Overview</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Review delivery, notes and line items</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusSelector orderId={order.id} current={order.status} onUpdated={handleUpdated} />
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground border border-border bg-background hover:bg-muted/30 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" /> Full view
                      </button>
                    </div>
                  </div>

                  {/* Info strip: 3 detail tiles */}
                  <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 px-4 pt-4">
                    {/* Delivery */}
                    <div
                      className="rounded-2xl p-4 border border-border/70 bg-card relative overflow-hidden"
                      style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-muted/60 flex items-center justify-center">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground">Delivery Address</p>
                      </div>
                      <p className="text-base text-foreground font-semibold leading-snug">{order.delivery_address}</p>
                    </div>

                    {/* Placed */}
                    <div
                      className="rounded-2xl p-4 border border-border/70 bg-card relative overflow-hidden"
                      style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-muted/60 flex items-center justify-center">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground">Placed On</p>
                      </div>
                      <p className="text-base font-semibold text-foreground leading-snug">{melbDateTime(order.created_at)}</p>
                      <p className="text-sm text-muted-foreground mt-1.5 font-medium">
                        {totalCartons} carton{totalCartons !== 1 ? "s" : ""} &middot; {order.items.length} product{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Delivery date */}
                    <div
                      className="rounded-2xl p-4 border border-border/70 bg-card relative overflow-hidden"
                      style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-muted/60 flex items-center justify-center">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground">Delivery Date</p>
                      </div>
                      <p className="text-base text-foreground font-semibold leading-snug">
                        {deliveryDateLabel || "Not specified"}
                      </p>
                    </div>

                    {/* Notes */}
                    <div
                      className="rounded-2xl p-4 border border-border/70 bg-card relative overflow-hidden"
                      style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-muted/60 flex items-center justify-center">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground">Notes</p>
                      </div>
                      {meta.plainNotes
                        ? <p className="text-base text-foreground font-medium leading-snug">{meta.plainNotes}</p>
                        : <p className="text-base text-muted-foreground/60 italic">No notes added</p>}
                    </div>
                  </div>

                  {/* Product table */}
                  <div className="px-4 pt-4 pb-5">
                    <div className="rounded-2xl border border-border/70 overflow-hidden bg-background/90"
                      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                      {/* Table header */}
                      <div
                        className="px-5 py-3 flex items-center justify-between border-b border-border/60"
                        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))" }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-xs font-semibold text-muted-foreground">
                            Order Items · <span className="text-foreground">{order.items.length}</span> product{order.items.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground">{totalCartons} cartons total</p>
                      </div>

                      <div className="p-3.5 space-y-3 bg-muted/[0.12]">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3.5 px-3.5 sm:px-4 py-3.5 rounded-2xl border border-border/80 bg-background transition-all group hover:-translate-y-[1px]"
                            style={{ boxShadow: "0 6px 14px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)" }}
                          >
                            <div className="h-10 w-[3px] rounded-full bg-primary/25 shrink-0" />

                            {/* Index bubble */}
                            <span className="w-6 h-6 rounded-lg text-[10px] font-bold text-muted-foreground bg-muted/80 flex items-center justify-center shrink-0 group-hover:bg-muted">
                              {idx + 1}
                            </span>

                            {/* Name + meta */}
                            <div className="flex-1 min-w-0">
                              <p className="text-base sm:text-lg font-semibold text-foreground truncate leading-tight">{item.productName}</p>
                              <p className="text-[11px] text-muted-foreground mt-1 truncate">{item.groupName} · {item.pack}</p>
                            </div>

                            {/* Qty badge */}
                            <span className="inline-flex items-center justify-center min-w-[3.2rem] h-7 px-2 rounded-xl text-xs font-semibold shrink-0 bg-primary/10 text-foreground border border-primary/20">
                              Qty {item.quantity}
                            </span>

                            {/* Price per unit — hidden on mobile */}
                            <div className="hidden sm:flex flex-col items-end shrink-0 min-w-[78px] rounded-xl border border-border/60 bg-muted/25 px-2.5 py-1.5">
                              <span className="text-[10px] text-muted-foreground">Unit</span>
                              <span className="text-xs text-foreground/85 font-medium">${(item.customPrice ?? 0).toFixed(2)}</span>
                            </div>

                            {/* Line total */}
                            <div className="flex flex-col items-end shrink-0 min-w-[90px] rounded-xl border border-border/70 bg-background px-2.5 py-1.5">
                              <span className="text-[10px] text-muted-foreground">Total</span>
                              <span className="text-base font-bold text-foreground">${item.lineTotal.toFixed(2)}</span>
                              {/* show unit price on mobile under total */}
                              <span className="text-[10px] text-muted-foreground sm:hidden">Unit ${(item.customPrice ?? 0).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Subtotal footer */}
                      <div className="flex items-center justify-between px-5 py-4 border-t border-border/60 bg-background/95">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-muted-foreground">{totalCartons} carton{totalCartons !== 1 ? "s" : ""}</span>
                          <span className="text-muted-foreground/30">·</span>
                          <span className="text-xs font-semibold text-muted-foreground">{order.items.length} product{order.items.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-muted-foreground">Order Total</span>
                          <span className="text-2xl font-black text-foreground">${order.subtotal.toFixed(2)}</span>
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
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  );
}
