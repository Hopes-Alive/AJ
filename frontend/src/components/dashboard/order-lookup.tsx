"use client";

import { useState } from "react";
import { lookupOrderByNumber, type Order } from "@/lib/api/orders";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderDetailModal } from "./order-detail-modal";
import { Search, Loader2 } from "lucide-react";

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
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Order Lookup</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enter an order number to retrieve its full details
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. AJ-2025-0001"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm font-mono uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Look up
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 border border-border rounded-xl bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Order number</p>
              <p className="font-bold text-foreground text-lg font-mono">
                {result.order_number}
              </p>
            </div>
            <OrderStatusBadge status={result.status} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Date placed</p>
              <p className="text-foreground">
                {new Date(result.created_at).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Items</p>
              <p className="text-foreground">
                {result.items.reduce((s, i) => s + i.quantity, 0)} carton(s)
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Subtotal</p>
              <p className="font-semibold text-foreground">${result.subtotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Delivery to</p>
              <p className="text-foreground truncate">{result.delivery_address}</p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 w-full py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            View full order details
          </button>
        </div>
      )}

      {modalOpen && result && (
        <OrderDetailModal order={result} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
