"use client";

import { useState } from "react";
import { lookupOrderByNumber, type Order } from "@/lib/api/orders";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderDetailModal } from "./order-detail-modal";
import { Search, Loader2, ArrowRight } from "lucide-react";

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
    <div className="max-w-xl mx-auto pt-2 pb-16 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-foreground tracking-tight">Order Lookup</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter an order number to retrieve its full details.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleLookup} className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AJ-2025-0001"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 transition-all text-sm font-mono tracking-widest uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? "Searching…" : "Find Order"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/6 border border-destructive/15 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="border border-border rounded-xl bg-card overflow-hidden">

          {/* Order identity */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-1">Order Number</p>
              <p className="text-lg font-bold text-foreground font-mono tracking-wide">{result.order_number}</p>
              {result.order_name && (
                <p className="text-[13px] text-muted-foreground mt-0.5">{result.order_name}</p>
              )}
            </div>
            <OrderStatusBadge status={result.status} />
          </div>

          {/* Data rows */}
          <div className="divide-y divide-border/60">
            {[
              {
                label: "Date placed",
                value: new Date(result.created_at).toLocaleDateString("en-AU", {
                  day: "numeric", month: "long", year: "numeric",
                }),
              },
              {
                label: "Cartons",
                value: `${result.items.reduce((s, i) => s + i.quantity, 0)} carton${result.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}`,
              },
              {
                label: "Subtotal",
                value: `$${result.subtotal.toFixed(2)}`,
                strong: true,
              },
              {
                label: "Delivery address",
                value: result.delivery_address,
              },
            ].map(({ label, value, strong }) => (
              <div key={label} className="flex items-start justify-between gap-4 px-5 py-3.5">
                <span className="text-[12px] text-muted-foreground shrink-0">{label}</span>
                <span className={`text-[13px] text-right ${strong ? "font-bold text-foreground" : "text-foreground"}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="px-5 py-4 border-t border-border">
            <button
              onClick={() => setModalOpen(true)}
              className="group w-full flex items-center justify-between py-2.5 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              View full order details
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
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
