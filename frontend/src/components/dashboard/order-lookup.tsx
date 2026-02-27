"use client";

import { useState } from "react";
import { lookupOrderByNumber, type Order } from "@/lib/api/orders";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderDetailModal } from "./order-detail-modal";
import {
  Search, Loader2, MapPin, Calendar, Package, ArrowRight, Hash,
} from "lucide-react";

export function OrderLookup() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const order = await lookupOrderByNumber(trimmed);
      setResult(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Search className="h-4 w-4 text-purple-500" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Order Lookup</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-10">
          Enter an order number like <span className="font-mono text-foreground/70 bg-muted px-1.5 py-0.5 rounded text-xs">AJ-2025-0001</span> to retrieve its full details
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleLookup} className="flex gap-3">
        <div className="relative flex-1">
          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AJ-2025-0001"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all text-sm font-mono uppercase tracking-wider"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
            boxShadow: "0 4px 16px oklch(0.52 0.13 172 / 0.3)",
          }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="hidden sm:block">Look up</span>
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3.5">
          <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
          {/* Top bar */}
          <div className="px-5 pt-5 pb-4 border-b border-border flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Order</p>
              <p className="font-black text-foreground text-xl font-mono tracking-wide">
                {result.order_number}
              </p>
              {result.order_name && (
                <p className="text-sm text-muted-foreground mt-0.5">{result.order_name}</p>
              )}
            </div>
            <OrderStatusBadge status={result.status} />
          </div>

          {/* Details grid */}
          <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Date</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {new Date(result.created_at).toLocaleString("en-AU", {
                    timeZone: "Australia/Melbourne",
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit", hour12: true,
                  })} AEDT
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Cartons</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {result.items.reduce((s, i) => s + i.quantity, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground text-xs mt-0.5 shrink-0">$</span>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Subtotal</p>
                <p className="text-sm font-black text-foreground mt-0.5">${result.subtotal.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Delivery</p>
                <p className="text-sm text-foreground mt-0.5 line-clamp-2">{result.delivery_address}</p>
              </div>
            </div>
          </div>

          {/* View full button */}
          <div className="px-5 pb-5">
            <button
              onClick={() => setModalOpen(true)}
              className="group w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-muted/30 hover:bg-muted text-sm font-semibold text-foreground transition-all hover:border-border"
            >
              View full order details
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {modalOpen && result && (
        <OrderDetailModal order={result} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
