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

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/40">
        <Package className="h-8 w-8 text-muted-foreground/30" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain p-2"
      onError={() => setErr(true)}
      sizes="(max-width: 640px) 50vw, 160px"
    />
  );
}

function ProductCard({
  groupId, groupName, product, defaultPack, defaultPrice, cartItem,
  onAdd, onQtyChange,
}: {
  groupId: string;
  groupName: string;
  product: { name: string; image?: string; pack?: string; price?: string };
  defaultPack?: string;
  defaultPrice?: string;
  cartItem?: CartItem;
  onAdd: () => void;
  onQtyChange: (delta: number) => void;
}) {
  const pack = product.pack ?? defaultPack ?? "—";
  const price = product.price ?? defaultPrice ?? "Contact";

  return (
    <div className={cn(
      "relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-200",
      cartItem
        ? "border-primary/40 shadow-md shadow-primary/10"
        : "border-border hover:border-border/60 hover:shadow-sm"
    )}>
      {/* Image */}
      <div className="relative w-full aspect-square bg-muted/20">
        <ProductImage src={product.image} alt={product.name} />
        {/* Cart badge */}
        {cartItem && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
            {cartItem.quantity}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3">
        <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2 flex-1">
          {product.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{pack}</p>
        <p className="text-sm font-bold text-primary mt-1">{price}</p>

        {/* Action */}
        <div className="mt-3">
          {cartItem ? (
            <div className="flex items-center justify-between bg-primary/10 rounded-xl px-2 py-1.5">
              <button
                type="button"
                onClick={() => onQtyChange(-1)}
                className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="font-bold text-foreground text-sm w-6 text-center">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() => onQtyChange(1)}
                className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors border border-primary/20 hover:border-primary/40"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ orderNumber: string; orderName: string } | null>(null);
  const [showCartMobile, setShowCartMobile] = useState(false);

  /* refs */
  const tabBarRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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
      // account for floating header (82px on desktop) + tab bar (~44px) + buffer
      const TAB_OFFSET = window.innerWidth >= 1024 ? 160 : 200;
      let current = displayCategories[0]?.id ?? "";
      for (const cat of displayCategories) {
        const el = sectionRefs.current[cat.id];
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top - TAB_OFFSET <= 0) current = cat.id;
        }
      }
      setActiveCat(current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [displayCategories]);

  /* click tab → scroll section into view below sticky header+tabs */
  function scrollToCategory(catId: string) {
    setActiveCat(catId);
    const el = sectionRefs.current[catId];
    if (el) {
      // floating header + tab bar + a little breathing room
      const TOP_OFFSET = window.innerWidth >= 1024 ? 160 : 200;
      const y = el.getBoundingClientRect().top + window.scrollY - TOP_OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    const tab = tabBarRef.current?.querySelector(`[data-tab="${catId}"]`) as HTMLElement;
    tab?.scrollIntoView({ inline: "center", behavior: "smooth" });
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
      });
      setSubmitted({ orderNumber: order.order_number, orderName: order.order_name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── success screen ── */
  if (submitted) {
    return (
      <div className="max-w-sm mx-auto mt-20 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Order created!</h2>
        <p className="text-muted-foreground mb-3">{submitted.orderName}</p>
        <p className="text-3xl font-black text-primary font-mono tracking-tight">{submitted.orderNumber}</p>
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="mt-8 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
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
                    <div className="flex items-center gap-1 w-14 justify-center">
                      <button type="button" onClick={() => updateQuantity(item.cartKey, -1)}
                        className="w-5 h-5 rounded bg-muted flex items-center justify-center hover:bg-muted/70">
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.cartKey, 1)}
                        className="w-5 h-5 rounded bg-muted flex items-center justify-center hover:bg-muted/70">
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
          <h1 className="text-2xl font-bold text-foreground">New Order</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Select products, set prices, and submit</p>
        </div>
        {/* Mobile: cart toggle */}
        <button
          type="button"
          onClick={() => setShowCartMobile(true)}
          className="lg:hidden relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20"
        >
          <ShoppingCart className="h-4 w-4" />
          {cart.length > 0
            ? <><span>${subtotal.toFixed(2)}</span><span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{totalCartons}</span></>
            : "Order"
          }
        </button>
      </div>

      <div className="flex gap-6 items-start">

        {/* ── Left: Product browser ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* Category tabs — sticky below floating site header (pt + nav height) + optional mobile dashboard header */}
          <div
            ref={tabBarRef}
            className="sticky top-[122px] sm:top-[136px] lg:top-[82px] z-20 bg-background/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-2 mb-1 border-b border-border/50 scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {displayCategories.map(cat => (
              <button
                key={cat.id}
                type="button"
                data-tab={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border",
                  activeCat === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
                )}
              >
                {cat.name}
              </button>
            ))}
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
                      {group.products.map(product => {
                        const key = cartKey(group.id, product.name);
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

      {/* ── Mobile cart sheet ── */}
      {showCartMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCartMobile(false)}
          />
          <div className="relative z-10 mt-auto bg-card rounded-t-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-foreground">Your Order</h2>
              <button
                type="button"
                onClick={() => setShowCartMobile(false)}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground"
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
    </div>
  );
}
