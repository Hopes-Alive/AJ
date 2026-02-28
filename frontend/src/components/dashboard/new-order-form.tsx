"use client";

import {
  useState, useMemo, useRef, useEffect, useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categories } from "@/data/products";
import { createOrder, type OrderItem } from "@/lib/api/orders";
import {
  ShoppingCart, Plus, Minus, Trash2, Search,
  Loader2, CheckCircle2, MapPin, FileText, Tag,
  ClipboardEdit, PencilLine, Package, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────── types ────────────────────────── */
interface CartItem extends OrderItem {
  cartKey: string;
  priceEditing: boolean;
}

/* ─────────────────────── helpers ──────────────────────── */
function parsePrice(s: string) {
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
}

function cartKey(groupId: string, name: string) {
  return `${groupId}__${name}`;
}

/* ─────────────────────── sub-components ───────────────── */

function ImageZoomModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}
      >
        <Image src={src} alt={alt} fill className="object-contain p-6 bg-white" sizes="400px" />
      </div>
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xl"
      >✕</button>
    </div>
  );
}

function ProductCard({
  groupId, groupName, product, defaultPack, defaultPrice, cartItem,
  onAdd, onQtyChange, onSetQty,
}: {
  groupId: string;
  groupName: string;
  product: { name: string; image?: string; pack?: string; price?: string };
  defaultPack?: string;
  defaultPrice?: string;
  cartItem?: CartItem;
  onAdd: () => void;
  onQtyChange: (delta: number) => void;
  onSetQty: (qty: number) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [qtyInput, setQtyInput] = useState<string>("");
  const pack = product.pack ?? defaultPack ?? "—";
  const price = product.price ?? defaultPrice ?? "Contact";
  const hasImage = !!product.image && !imgError;

  return (
    <>
      {zoomed && hasImage && (
        <ImageZoomModal src={product.image!} alt={product.name} onClose={() => setZoomed(false)} />
      )}
      <div
        className={cn(
          "relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-default",
          "border bg-card",
          cartItem
            ? "border-primary/60 bg-gradient-to-b from-primary/5 to-card"
            : "border-border/80 hover:border-primary/40",
        )}
        style={cartItem ? {
          boxShadow: "0 4px 24px oklch(0.52 0.13 172 / 0.18), 0 1px 4px oklch(0.52 0.13 172 / 0.1)",
        } : {
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "perspective(800px) translateY(-4px) rotateX(2deg)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = cartItem
            ? "0 12px 40px oklch(0.52 0.13 172 / 0.28), 0 2px 8px oklch(0.52 0.13 172 / 0.12)"
            : "0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "";
          (e.currentTarget as HTMLDivElement).style.boxShadow = cartItem
            ? "0 4px 24px oklch(0.52 0.13 172 / 0.18), 0 1px 4px oklch(0.52 0.13 172 / 0.1)"
            : "0 2px 8px rgba(0,0,0,0.06)";
        }}
      >
        {/* Image area */}
        <div
          className={cn(
            "relative w-full aspect-square overflow-hidden",
            hasImage ? "bg-white cursor-zoom-in group/img" : "bg-muted/30"
          )}
          onClick={() => hasImage && setZoomed(true)}
        >
          {hasImage ? (
            <>
              <Image
                src={product.image!}
                alt={product.name}
                fill
                className="object-contain p-2 transition-transform duration-500 group-hover/img:scale-110"
                onError={() => setImgError(true)}
                sizes="(max-width: 640px) 50vw, 180px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground/20" />
            </div>
          )}

          {/* In-cart badge */}
          {cartItem && (
            <div
              className="absolute top-2 right-2 min-w-[24px] h-6 px-1.5 rounded-full text-xs font-black flex items-center justify-center text-white"
              style={{
                background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
                boxShadow: "0 2px 8px oklch(0.52 0.13 172 / 0.5)",
              }}
            >
              {cartItem.quantity}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-3 pt-2.5">
          <p className="font-bold text-foreground text-xs leading-snug line-clamp-2 flex-1 mb-1">
            {product.name}
          </p>
          <p className="text-[10px] text-muted-foreground/70">{pack}</p>
          <div className="flex items-center justify-between mt-1.5 mb-2.5">
            <p
              className="text-sm font-black"
              style={{
                background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >{price}</p>
          </div>

          {/* Always-visible quantity row — type directly, + adds, − removes */}
          {(() => {
            const qty = cartItem?.quantity ?? 0;
            const inCart = qty > 0;
            return (
              <div
                className="flex items-center justify-between rounded-xl px-1.5 py-1.5 border transition-all duration-200"
                style={inCart ? {
                  background: "oklch(0.52 0.13 172 / 0.09)",
                  borderColor: "oklch(0.52 0.13 172 / 0.3)",
                } : {
                  background: "rgba(0,0,0,0.025)",
                  borderColor: "rgba(0,0,0,0.08)",
                }}
              >
                {/* − button: removes one; hides when qty=0 */}
                <button
                  type="button"
                  onClick={() => inCart ? onQtyChange(-1) : undefined}
                  disabled={!inCart}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:enabled:bg-red-50 hover:enabled:border-red-200 hover:enabled:text-red-500 border border-border bg-background"
                >
                  <Minus className="h-3 w-3" />
                </button>

                {/* Qty input — always editable */}
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={qtyInput !== "" ? qtyInput : qty > 0 ? String(qty) : ""}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setQtyInput(raw);
                    const v = parseInt(raw, 10);
                    if (!isNaN(v)) {
                      if (v === 0) onQtyChange(-(qty)); // remove
                      else if (inCart) onSetQty(v);
                      else if (v >= 1) { onAdd(); onSetQty(v); }
                    }
                  }}
                  onFocus={e => { setQtyInput(qty > 0 ? String(qty) : ""); e.target.select(); }}
                  onBlur={() => {
                    const v = parseInt(qtyInput, 10);
                    if (!isNaN(v) && v >= 1) {
                      if (inCart) onSetQty(v); else { onAdd(); onSetQty(v); }
                    } else if (qtyInput === "0") {
                      if (inCart) onQtyChange(-qty);
                    }
                    setQtyInput("");
                  }}
                  onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                  className={`font-black text-sm w-10 text-center bg-transparent focus:outline-none transition-colors ${
                    inCart ? "text-foreground" : "text-muted-foreground placeholder:text-muted-foreground/40"
                  }`}
                />

                {/* + button */}
                <button
                  type="button"
                  onClick={() => inCart ? onQtyChange(1) : onAdd()}
                  className="w-7 h-7 rounded-xl text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
                  style={{ background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))" }}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}

/* ── cart qty input — isolated local state so typing doesn't fight controlled value ── */
function CartQtyInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [local, setLocal] = useState("");
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={local !== "" ? local : String(value)}
      onChange={e => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setLocal(raw);
        const v = parseInt(raw, 10);
        if (!isNaN(v) && v >= 1) onChange(v);
      }}
      onFocus={e => { setLocal(String(value)); e.target.select(); }}
      onBlur={() => {
        const v = parseInt(local, 10);
        if (isNaN(v) || v < 1) onChange(1);
        setLocal("");
      }}
      onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
      className="w-8 text-center text-xs font-black text-foreground bg-transparent focus:outline-none focus:bg-muted/50 rounded px-0.5 py-0.5 transition-colors"
    />
  );
}

/* ─────────────────────── main component ───────────────── */
export function NewOrderForm() {
  const router = useRouter();

  /* state */
  const [orderName, setOrderName] = useState("");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState(categories[0]?.id ?? "");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"payment_pending" | "paid">("payment_pending");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ orderNumber: string; orderName: string; placedAt: string } | null>(null);
  const [showCartMobile, setShowCartMobile] = useState(false);

  /* refs */
  const tabBarRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const suppressScrollspy = useRef(false);
  const suppressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* filtered categories */
  const displayCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      groups: cat.groups.map(grp => ({
        ...grp,
        products: grp.products.filter(p =>
          p.name.toLowerCase().includes(q) ||
          grp.name.toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q)
        ),
      })).filter(g => g.products.length > 0),
    })).filter(c => c.groups.length > 0);
  }, [search]);

  /* scrollspy — listen to window scroll, highlight active tab */
  useEffect(() => {
    function onScroll() {
      // Skip scrollspy while a tab-click scroll is in progress
      if (suppressScrollspy.current) return;
      const OFFSET = window.innerWidth >= 1024 ? 210 : 260;
      let current = displayCategories[0]?.id ?? "";
      for (const cat of displayCategories) {
        const el = sectionRefs.current[cat.id];
        if (el && el.getBoundingClientRect().top - OFFSET <= 0) current = cat.id;
      }
      setActiveCat(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [displayCategories]);

  /* click tab → scroll section into view below sticky block */
  function scrollToCategory(catId: string) {
    // Immediately lock the active tab and suppress scrollspy until scroll settles
    setActiveCat(catId);
    suppressScrollspy.current = true;
    if (suppressTimer.current) clearTimeout(suppressTimer.current);
    suppressTimer.current = setTimeout(() => {
      suppressScrollspy.current = false;
    }, 900);

    const el = sectionRefs.current[catId];
    if (el) {
      const OFFSET = window.innerWidth >= 1024 ? 210 : 260;
      const y = el.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    const tab = tabBarRef.current?.querySelector(`[data-tab="${catId}"]`) as HTMLElement;
    tab?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }

  /* cart helpers */
  function getCartItem(key: string) { return cart.find(i => i.cartKey === key); }

  function addToCart(groupId: string, groupName: string, product: { name: string; pack?: string; price?: string }, defaultPack?: string, defaultPrice?: string) {
    const key = cartKey(groupId, product.name);
    const priceStr = product.price ?? defaultPrice ?? "0";
    const pack = product.pack ?? defaultPack ?? "—";
    const cp = parsePrice(priceStr);

    setCart(prev => {
      const existing = prev.find(i => i.cartKey === key);
      if (existing) {
        return prev.map(i => i.cartKey === key
          ? { ...i, quantity: i.quantity + 1, lineTotal: (i.quantity + 1) * i.customPrice }
          : i
        );
      }
      return [...prev, {
        cartKey: key, productId: key, productName: product.name,
        groupName, pack, price: priceStr, customPrice: cp,
        quantity: 1, lineTotal: cp, priceEditing: false,
      }];
    });
  }

  function updateQuantity(key: string, delta: number) {
    setCart(prev =>
      prev.map(i => {
        if (i.cartKey !== key) return i;
        const q = i.quantity + delta;
        return q <= 0 ? null : { ...i, quantity: q, lineTotal: q * i.customPrice };
      }).filter(Boolean) as CartItem[]
    );
  }

  function setQuantityDirect(key: string, qty: number) {
    setCart(prev =>
      prev.map(i => i.cartKey === key
        ? { ...i, quantity: qty, lineTotal: qty * i.customPrice }
        : i
      )
    );
  }

  function updateCustomPrice(key: string, val: string) {
    const n = parseFloat(val) || 0;
    setCart(prev => prev.map(i => i.cartKey === key
      ? { ...i, customPrice: n, lineTotal: n * i.quantity }
      : i
    ));
  }

  function resetPrice(key: string) {
    setCart(prev => prev.map(i => {
      if (i.cartKey !== key) return i;
      const d = parsePrice(i.price);
      return { ...i, customPrice: d, lineTotal: d * i.quantity };
    }));
  }

  const subtotal = cart.reduce((s, i) => s + i.lineTotal, 0);
  const totalCartons = cart.reduce((s, i) => s + i.quantity, 0);

  /* submit */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderName.trim()) { setError("Order name is required"); return; }
    if (cart.length === 0) { setError("Add at least one product"); return; }
    if (!deliveryAddress.trim()) { setError("Delivery address is required"); return; }

    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({
        order_name: orderName.trim(),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        items: cart.map(({ cartKey: _ck, priceEditing: _pe, ...item }) => item),
        subtotal,
        notes: notes.trim() || undefined,
        delivery_address: deliveryAddress.trim(),
        status: paymentStatus,
      });
      const placedAt = new Date(order.created_at).toLocaleString("en-AU", {
        timeZone: "Australia/Melbourne",
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      });
      setSubmitted({ orderNumber: order.order_number, orderName: order.order_name, placedAt });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── success screen ── */
  if (submitted) {
    return (
      <div className="max-w-sm mx-auto mt-16 text-center px-4">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: "linear-gradient(135deg, oklch(0.6 0.15 160 / 0.15), oklch(0.55 0.14 170 / 0.1))",
            boxShadow: "0 8px 32px oklch(0.6 0.15 160 / 0.2)",
          }}
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-1">Order placed!</h2>
        <p className="text-muted-foreground text-sm mb-4">{submitted.orderName}</p>
        <p
          className="text-3xl font-black font-mono tracking-tight mb-4"
          style={{
            background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}
        >{submitted.orderNumber}</p>
        <div className="rounded-2xl border border-border p-4 text-left space-y-2 mb-6"
          style={{ background: "rgba(0,0,0,0.02)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Placed at</span>
            <span className="font-semibold text-foreground">{submitted.placedAt} AEDT</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment</span>
            <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {paymentStatus === "paid" ? "Paid" : "Payment Pending"}
            </span>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:scale-[1.01]"
          style={{
            background: "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))",
            boxShadow: "0 4px 16px oklch(0.52 0.13 172 / 0.3)",
          }}
        >
          View all orders
        </button>
      </div>
    );
  }

  /* ── cart panel (shared between desktop sidebar and mobile sheet) ── */
  const CartPanel = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Order details */}
      <div className="px-4 py-4 border-b border-border space-y-3">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
          <ClipboardEdit className="h-4 w-4 text-muted-foreground" />
          Order Details
        </h3>

        <div className="relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={orderName}
            onChange={e => setOrderName(e.target.value)}
            placeholder="Order name (e.g. Smith's IGA Weekly)"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
          <textarea
            value={deliveryAddress}
            onChange={e => setDeliveryAddress(e.target.value)}
            placeholder="Delivery address"
            rows={2}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
          />
        </div>

        <div className="relative">
          <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            rows={1}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
          />
        </div>

        {/* Payment status radio */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Payment Status</p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: "payment_pending", label: "Unpaid", sub: "Payment pending", color: "amber" },
              { value: "paid", label: "Paid", sub: "Already paid", color: "emerald" },
            ] as const).map(({ value, label, sub, color }) => (
              <label
                key={value}
                className={cn(
                  "flex flex-col gap-0.5 p-3 rounded-xl border-2 cursor-pointer transition-all",
                  paymentStatus === value
                    ? color === "amber"
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                      : "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-border bg-background hover:border-border/80"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm font-bold",
                    paymentStatus === value
                      ? color === "amber" ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
                      : "text-foreground"
                  )}>{label}</span>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    paymentStatus === value
                      ? color === "amber" ? "border-amber-500 bg-amber-500" : "border-emerald-500 bg-emerald-500"
                      : "border-muted-foreground/30"
                  )}>
                    {paymentStatus === value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">{sub}</span>
                <input
                  type="radio"
                  name="paymentStatus"
                  value={value}
                  checked={paymentStatus === value}
                  onChange={() => setPaymentStatus(value)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Your order is empty</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Tap + on any product to add it</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Column labels */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2 bg-muted/30">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Item</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-14 text-center">Qty</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-20 text-center flex items-center gap-1">
                Price <PencilLine className="h-2.5 w-2.5" />
              </p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-14 text-right">Total</p>
            </div>

            {cart.map(item => {
              const defaultPrice = parsePrice(item.price);
              const isCustom = Math.abs(item.customPrice - defaultPrice) > 0.001;
              return (
                <div key={item.cartKey} className="px-4 py-3">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.pack}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartKey, -item.quantity)}
                      className="p-1 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                    <div />
                    {/* qty */}
                    <div className="flex items-center gap-0.5 justify-center">
                      <button type="button" onClick={() => updateQuantity(item.cartKey, -1)}
                        className="w-5 h-5 rounded bg-muted flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors">
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <CartQtyInput
                        value={item.quantity}
                        onChange={v => setQuantityDirect(item.cartKey, v)}
                      />
                      <button type="button" onClick={() => updateQuantity(item.cartKey, 1)}
                        className="w-5 h-5 rounded bg-muted flex items-center justify-center hover:bg-primary/15 hover:text-primary transition-colors">
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    {/* price */}
                    <div className="w-20">
                      {item.priceEditing ? (
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">$</span>
                          <input
                            type="number" step="0.01" min="0"
                            value={item.customPrice || ""}
                            onChange={e => updateCustomPrice(item.cartKey, e.target.value)}
                            onBlur={() => setCart(p => p.map(i => i.cartKey === item.cartKey ? { ...i, priceEditing: false } : i))}
                            autoFocus
                            className="w-full pl-5 pr-1 py-1 text-xs rounded-lg border border-primary bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      ) : (
                        <button type="button"
                          onClick={() => setCart(p => p.map(i => i.cartKey === item.cartKey ? { ...i, priceEditing: true } : i))}
                          className={cn(
                            "w-full text-center text-xs py-1 rounded-lg border transition-colors",
                            isCustom
                              ? "border-amber-400/50 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                              : "border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
                          )}
                        >
                          ${item.customPrice.toFixed(2)}
                          {isCustom && (
                            <span
                              onClick={e => { e.stopPropagation(); resetPrice(item.cartKey); }}
                              className="ml-1 text-amber-500 hover:text-amber-700 font-bold"
                            >↺</span>
                          )}
                        </button>
                      )}
                      {!item.priceEditing && (
                        <p className="text-[9px] text-center text-muted-foreground/50 mt-0.5">
                          Default ${defaultPrice.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* line total */}
                    <div className="w-14 text-right">
                      <p className="text-sm font-bold">${item.lineTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer: subtotal + submit */}
      <div className="border-t border-border px-4 py-4 space-y-3 bg-card">
        {cart.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{totalCartons} carton{totalCartons !== 1 ? "s" : ""}</span>
            <span className="text-xl font-black text-foreground">${subtotal.toFixed(2)}</span>
          </div>
        )}
        {error && (
          <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting || cart.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Placing order…" : cart.length === 0 ? "Add products to order" : `Place Order  ·  $${subtotal.toFixed(2)}`}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">New Order</h1>
          <p className="text-sm text-muted-foreground mt-0.5 hidden sm:block">Select products, set prices, and submit</p>
        </div>
        {/* Tablet cart button (md only, not shown on mobile where bottom bar is used) */}
        <button
          type="button"
          onClick={() => setShowCartMobile(true)}
          className="hidden md:flex lg:hidden relative items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20"
        >
          <ShoppingCart className="h-4 w-4" />
          {cart.length > 0
            ? <><span>${subtotal.toFixed(2)}</span><span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{totalCartons}</span></>
            : "Cart"
          }
        </button>
      </div>

      <div className="flex gap-6 items-start">

        {/* ── Left: Product browser ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Sticky block: search bar + category tabs */}
          <div
            className="sticky top-[122px] sm:top-[136px] lg:top-[82px] z-20 bg-background/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-3 pb-2 border-b border-border/50"
          >
            {/* Search */}
            <div className="relative mb-2.5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
              />
            </div>

            {/* Category tabs */}
            <div
              ref={tabBarRef}
              className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5"
              style={{ scrollbarWidth: "none" }}
            >
              {displayCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  data-tab={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={cn(
                    "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border",
                    activeCat === cat.id
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40 hover:bg-muted/50"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product list — natural height, page scrolls */}
          <div ref={scrollAreaRef} className="pr-1 mt-4">
            {displayCategories.map(cat => (
              <section
                key={cat.id}
                ref={el => { sectionRefs.current[cat.id] = el; }}
                id={`cat-${cat.id}`}
                className="mb-8"
              >
                {/* Category heading */}
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-base font-black text-foreground">{cat.name}</h2>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {cat.groups.reduce((s, g) => s + g.products.length, 0)} items
                  </span>
                </div>

                {cat.groups.map(group => (
                  <div key={group.id} className="mb-6">
                    {/* Group subheading */}
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-bold text-foreground">{group.name}</h3>
                      {group.features && (
                        <p className="text-xs text-muted-foreground hidden sm:block truncate max-w-xs">
                          — {group.features}
                        </p>
                      )}
                    </div>

                    {/* Product cards grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {group.products.map((product, pIdx) => {
                        const key = `${cartKey(group.id, product.name)}-${pIdx}`;
                        return (
                          <ProductCard
                            key={key}
                            groupId={group.id}
                            groupName={group.name}
                            product={product}
                            defaultPack={group.defaultPack}
                            defaultPrice={group.defaultPrice}
                            cartItem={cart.find(i => i.cartKey === key)}
                            onAdd={() => addToCart(group.id, group.name, product, group.defaultPack, group.defaultPrice)}
                            onQtyChange={d => updateQuantity(key, d)}
                            onSetQty={qty => setQuantityDirect(key, qty)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>

        {/* ── Right: Cart + order details (desktop only, sticky below site header) ── */}
        <div className="hidden lg:flex flex-col w-[360px] shrink-0 border border-border rounded-2xl bg-card overflow-hidden sticky top-[90px]" style={{ maxHeight: "calc(100vh - 100px)" }}>
          {CartPanel}
        </div>
      </div>

      {/* ── Mobile sticky bottom cart bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
        <button
          type="button"
          onClick={() => setShowCartMobile(true)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-white font-bold shadow-2xl transition-all active:scale-[0.98]"
          style={{
            background: cart.length > 0
              ? "linear-gradient(135deg, oklch(0.52 0.13 172), oklch(0.44 0.11 192))"
              : "linear-gradient(135deg, oklch(0.45 0.05 172), oklch(0.4 0.04 192))",
            boxShadow: cart.length > 0
              ? "0 8px 32px oklch(0.52 0.13 172 / 0.45), 0 2px 8px rgba(0,0,0,0.2)"
              : "0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center relative">
              <ShoppingCart className="h-4 w-4" />
              {totalCartons > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black flex items-center justify-center">
                  {totalCartons}
                </span>
              )}
            </div>
            <span className="text-sm">
              {cart.length === 0 ? "View order" : `${cart.length} item${cart.length !== 1 ? "s" : ""} · ${totalCartons} carton${totalCartons !== 1 ? "s" : ""}`}
            </span>
          </div>
          <span className="text-lg font-black">
            {cart.length > 0 ? `$${subtotal.toFixed(2)}` : "Open cart →"}
          </span>
        </button>
      </div>

      {/* ── Mobile cart sheet ── */}
      {showCartMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowCartMobile(false)}
          />
          <div className="relative z-10 mt-auto bg-card rounded-t-3xl overflow-hidden flex flex-col"
            style={{ maxHeight: "88vh", paddingBottom: "env(safe-area-inset-bottom)" }}>
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div>
                <h2 className="font-black text-foreground">Your Order</h2>
                {cart.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">{cart.length} items · {totalCartons} cartons</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowCartMobile(false)}
                className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {CartPanel}
            </div>
          </div>
        </div>
      )}

      {/* bottom spacer so content isn't hidden behind fixed bar on mobile */}
      <div className="md:hidden h-20" />
    </div>
  );
}
