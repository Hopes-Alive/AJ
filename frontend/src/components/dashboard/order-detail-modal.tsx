"use client";

import { type Order } from "@/lib/api/orders";
import { OrderStatusBadge } from "./order-status-badge";
import { X, Package, MapPin, FileText, Calendar } from "lucide-react";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-bold text-foreground text-base">{order.order_name || order.order_number}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground font-mono">{order.order_number}</span>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                <Calendar className="h-3 w-3" />
                Placed
              </div>
              <p className="font-medium text-foreground">
                {new Date(order.created_at).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                <Package className="h-3 w-3" />
                Items
              </div>
              <p className="font-medium text-foreground">
                {order.items.reduce((s, i) => s + i.quantity, 0)} carton(s)
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1.5">
              <MapPin className="h-3 w-3" />
              Delivery address
            </div>
            <p className="text-sm text-foreground bg-muted/40 rounded-lg px-3 py-2">
              {order.delivery_address}
            </p>
          </div>

          {order.notes && (
            <div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1.5">
                <FileText className="h-3 w-3" />
                Notes
              </div>
              <p className="text-sm text-foreground bg-muted/40 rounded-lg px-3 py-2">
                {order.notes}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground mb-2">Order items</p>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-3 py-2.5 text-xs text-muted-foreground font-medium">Product</th>
                    <th className="text-center px-3 py-2.5 text-xs text-muted-foreground font-medium">Qty</th>
                    <th className="text-center px-3 py-2.5 text-xs text-muted-foreground font-medium">Unit Price</th>
                    <th className="text-right px-3 py-2.5 text-xs text-muted-foreground font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-foreground">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.groupName} · {item.pack}
                        </p>
                      </td>
                      <td className="px-3 py-2.5 text-center text-muted-foreground">
                        ×{item.quantity}
                      </td>
                      <td className="px-3 py-2.5 text-center text-muted-foreground">
                        ${(item.customPrice ?? 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium">
                        ${item.lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30 border-t border-border">
                    <td colSpan={2} className="px-3 py-2.5 font-semibold text-foreground">
                      Subtotal
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-foreground">
                      ${order.subtotal.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              * Prices are indicative. Final pricing subject to confirmation. +GST where applicable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
