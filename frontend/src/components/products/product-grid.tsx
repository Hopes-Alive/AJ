"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlassWater, Coffee, Leaf, Cherry, Wheat, Flame, Citrus,
  Soup, ChefHat, Candy, Droplets, Home, Package,
  Layers, ChevronRight, ChevronDown, X,
} from "lucide-react";
import { categories } from "@/data/products";
import { ProductGroup, Product } from "@/types";
import { ProductCard } from "./product-card";

const iconMap: Record<string, React.ElementType> = {
  "glass-water": GlassWater,
  coffee: Coffee,
  leaf: Leaf,
  cherry: Cherry,
  wheat: Wheat,
  flame: Flame,
  citrus: Citrus,
  soup: Soup,
  "chef-hat": ChefHat,
  candy: Candy,
  droplets: Droplets,
  home: Home,
};

const categoryHues: Record<string, number> = {
  beverages: 176,
  "coffee-honey": 30,
  tea: 140,
  "dried-fruits-nuts": 50,
  rice: 85,
  charcoal: 15,
  "harris-juice": 160,
  noodles: 40,
  "shan-masala": 0,
  candies: 330,
  "salt-onion": 200,
  household: 220,
};

export function ProductCatalog() {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const activeCategory = categories.find((c) => c.id === activeCategoryId)!;
  const activeHue = categoryHues[activeCategoryId] ?? 176;
  const contentRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!pillsRef.current) return;
    const activeEl = pillsRef.current.querySelector(
      `[data-cat-id="${activeCategoryId}"]`,
    );
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategoryId]);

  return (
    <div>
      {/* ── Horizontal Category Strip (Mobile + Tablet) — outside flex row ── */}
      <div className="lg:hidden sticky top-[57px] sm:top-[80px] z-30 -mx-4 sm:-mx-6">
        <div className="bg-background/95 dark:bg-background/90 backdrop-blur-xl border-b border-border/50">
          <div
            ref={pillsRef}
            className="flex gap-2 px-3 sm:px-5 py-2 sm:py-2.5 overflow-x-auto no-scrollbar"
          >
            {categories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              const catHue = categoryHues[cat.id] ?? 176;
              const Icon = iconMap[cat.icon] || GlassWater;

              return (
                <button
                  key={cat.id}
                  data-cat-id={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-[12px] font-semibold transition-all duration-200 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground bg-muted/50 dark:bg-muted/30 hover:bg-muted/70"
                  }`}
                  style={
                    isActive
                      ? {
                          background: `linear-gradient(135deg, oklch(0.48 0.12 ${catHue}), oklch(0.4 0.1 ${catHue + 15}))`,
                          boxShadow: `0 2px 10px oklch(0.5 0.12 ${catHue} / 0.35)`,
                        }
                      : undefined
                  }
                >
                  <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Sidebar + Content row ── */}
      <div className="flex gap-8 relative">
        {/* Left Sidebar (Desktop only) */}
        <div className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24">
            <SidebarNav
              activeCategoryId={activeCategoryId}
              onSelect={handleCategoryChange}
            />
          </div>
        </div>

        {/* Main Content */}
        <div
          ref={contentRef}
          className="flex-1 min-w-0 scroll-mt-[100px] sm:scroll-mt-[130px] lg:scroll-mt-24"
        >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Desktop/Tablet: full image banner */}
            <div className="hidden sm:block">
              <CategoryBanner
                id={activeCategoryId}
                name={activeCategory.name}
                description={activeCategory.description}
                icon={activeCategory.icon}
                groups={activeCategory.groups}
                hue={activeHue}
              />
            </div>

            {/* Mobile: inline category title */}
            <div className="sm:hidden flex items-center gap-2 mb-2 mt-1">
              {(() => {
                const Icon = iconMap[activeCategory.icon] || GlassWater;
                return (
                  <div
                    className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.55 0.12 ${activeHue} / 0.15), oklch(0.55 0.12 ${activeHue} / 0.05))`,
                    }}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      style={{ color: `oklch(0.5 0.1 ${activeHue})` }}
                    />
                  </div>
                );
              })()}
              <h2 className="text-[15px] font-bold tracking-tight flex-1 truncate">
                {activeCategory.name}
              </h2>
              <span className="text-[11px] text-muted-foreground shrink-0">
                {activeCategory.groups.reduce(
                  (s, g) => s + g.products.length,
                  0,
                )}{" "}
                items
              </span>
            </div>

            {/* Negotiable pricing notice */}
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3 sm:mb-6 text-[11px] sm:text-xs"
              style={{
                background: `linear-gradient(135deg, oklch(0.55 0.12 ${activeHue} / 0.06), oklch(0.55 0.12 ${activeHue} / 0.02))`,
                border: `1px solid oklch(0.55 0.12 ${activeHue} / 0.1)`,
              }}
            >
              <span className="font-semibold" style={{ color: `oklch(0.5 0.12 ${activeHue})` }}>
                💬 All prices are negotiable
              </span>
              <span className="text-muted-foreground">
                — Contact us for your best wholesale rate
              </span>
            </div>

            {/* Groups */}
            <div className="space-y-3 sm:space-y-8 mt-0 sm:mt-8">
              {activeCategory.groups.map((group, i) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
                >
                  {/* Mobile: compact group */}
                  <div className="sm:hidden">
                    <MobileGroupSection
                      group={group}
                      hue={activeHue}
                      index={i}
                      showIndex={activeCategory.groups.length > 1}
                      onProductClick={setLightboxProduct}
                    />
                  </div>
                  {/* Tablet/Desktop: full group */}
                  <div className="hidden sm:block">
                    <DesktopGroupSection
                      group={group}
                      hue={activeHue}
                      index={i}
                      showIndex={activeCategory.groups.length > 1}
                      onProductClick={setLightboxProduct}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      </div>

      {/* Product Image Lightbox */}
      <ProductLightbox
        product={lightboxProduct}
        onClose={() => setLightboxProduct(null)}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MOBILE GROUP SECTION — compact, product-first
   ═══════════════════════════════════════════════════ */

function MobileGroupSection({
  group,
  hue,
  index,
  showIndex,
  onProductClick,
}: {
  group: ProductGroup;
  hue: number;
  index: number;
  showIndex: boolean;
  onProductClick: (product: Product) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      {/* Thin accent top */}
      <div
        className="h-[2px]"
        style={{
          background: `linear-gradient(90deg, oklch(0.55 0.12 ${hue}), oklch(0.6 0.1 ${hue + 25}) 50%, transparent)`,
        }}
      />

      {/* Tappable group header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2.5 active:bg-muted/30 transition-colors"
      >
        {showIndex && (
          <span
            className="h-5 w-5 rounded-md flex items-center justify-center text-[9px] font-bold shrink-0"
            style={{
              background: `oklch(0.55 0.12 ${hue} / 0.1)`,
              color: `oklch(var(--subtle-text-l) 0.12 ${hue})`,
            }}
          >
            {index + 1}
          </span>
        )}
        <span className="text-[13px] font-semibold flex-1 text-left truncate">
          {group.name}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {group.defaultPrice && (
            <span
              className="text-[10px] font-bold rounded-md px-1.5 py-0.5"
              style={{
                background: `oklch(0.55 0.12 ${hue} / 0.08)`,
                color: `oklch(var(--subtle-text-l) 0.12 ${hue})`,
              }}
            >
              {group.defaultPrice}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">
            {group.products.length}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Products */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2">
              <div className="grid grid-cols-2 gap-1.5">
                {group.products.map((product, i) => (
                  <MobileProductCard
                    key={`${product.name}-${i}`}
                    product={product}
                    groupPack={group.defaultPack}
                    groupPrice={group.defaultPrice}
                    hue={hue}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MOBILE PRODUCT CARD — small, clean, info-dense
   ═══════════════════════════════════════════════════ */

function MobileProductCard({
  product,
  groupPack,
  groupPrice,
  hue,
  onProductClick,
}: {
  product: Product;
  groupPack?: string;
  groupPrice?: string;
  hue: number;
  onProductClick?: (product: Product) => void;
}) {
  const pack = product.pack || groupPack;
  const price = product.price || groupPrice;

  return (
    <div
      onClick={() => product.image && onProductClick?.(product)}
      className={`rounded-lg overflow-hidden flex flex-col ${product.image ? "cursor-pointer active:scale-[0.97] transition-transform" : ""}`}
      style={{
        background: "var(--card)",
        border: "1px solid oklch(0.5 0 0 / 0.06)",
      }}
    >
      {/* Image / placeholder */}
      <div className="relative aspect-[3/2] overflow-hidden bg-muted/15">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-1.5"
            sizes="50vw"
          />
        ) : (
          <MobilePlaceholder name={product.name} hue={hue} />
        )}

        {price && (
          <div className="absolute top-1.5 right-1.5 z-10">
            <span
              className="rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, oklch(0.48 0.12 ${hue} / 0.9), oklch(0.4 0.1 ${hue + 15} / 0.9))`,
              }}
            >
              {price}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-2 py-1.5 flex-1 flex flex-col justify-between">
        <p className="text-[11px] font-semibold leading-tight line-clamp-2">
          {product.name}
        </p>
        {pack && (
          <p className="text-[9px] text-muted-foreground mt-1 truncate">
            {pack}
          </p>
        )}
      </div>
    </div>
  );
}

function MobilePlaceholder({
  name,
  hue,
}: {
  name: string;
  hue: number;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: `linear-gradient(145deg, oklch(var(--placeholder-l) var(--placeholder-c) ${hue}), oklch(calc(var(--placeholder-l) - 0.02) calc(var(--placeholder-c) + 0.003) ${hue + 10}))`,
      }}
    >
      <span
        className="text-[11px] font-bold"
        style={{
          color: `oklch(var(--subtle-text-l) 0.08 ${hue})`,
          opacity: 0.6,
        }}
      >
        {initials}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT LIGHTBOX — Full-screen image popup
   ═══════════════════════════════════════════════════ */

function ProductLightbox({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && product.image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 h-10 w-10 rounded-full flex items-center justify-center bg-white/10 border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image + Info */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex flex-col items-center max-w-lg w-full sm:max-w-xl md:max-w-2xl"
          >
            <div className="relative w-full aspect-square max-h-[70vh] rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4 sm:p-8"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 600px"
                priority
              />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {product.name}
              </h3>
              <div className="flex items-center justify-center gap-3 mt-2">
                {product.pack && (
                  <span className="text-xs text-white/50 bg-white/8 border border-white/10 rounded-lg px-3 py-1">
                    {product.pack}
                  </span>
                )}
                {product.price && (
                  <span className="text-xs font-bold text-white bg-white/10 border border-white/15 rounded-lg px-3 py-1">
                    {product.price}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════
   SIDEBAR NAV — Desktop only (unchanged)
   ═══════════════════════════════════════════════════ */

function SidebarNav({
  activeCategoryId,
  onSelect,
}: {
  activeCategoryId: string;
  onSelect: (id: string) => void;
}) {
  const totalProducts = categories.reduce(
    (sum, cat) =>
      sum + cat.groups.reduce((s, g) => s + g.products.length, 0),
    0,
  );
  const activeIdx = categories.findIndex((c) => c.id === activeCategoryId);

  return (
    <nav className="relative rounded-2xl overflow-hidden">
      <div
        className="absolute -inset-px rounded-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.55 0.12 176 / 0.15), oklch(0.55 0.12 176 / 0.03) 40%, transparent)",
        }}
      />
      <div className="relative rounded-2xl border border-border/50 bg-card/90 backdrop-blur-xl overflow-hidden shadow-lg shadow-primary/5">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeCategoryId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={`/images/categories/${activeCategoryId}.jpg`}
                  alt=""
                  fill
                  className="object-cover scale-110"
                  sizes="260px"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 80% 20%, oklch(0.55 0.15 ${categoryHues[activeCategoryId] ?? 176} / 0.5), transparent 60%)`,
              }}
            />
          </div>

          <div className="relative px-4 pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center border border-white/15 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.55 0.12 176 / 0.4), oklch(0.45 0.1 190 / 0.3))`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Package className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">
                    Catalogue
                  </p>
                  <p className="text-[10px] text-white/50">
                    {totalProducts} products
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-white/40 font-medium bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/10">
                <span className="text-white/70 font-bold">
                  {activeIdx + 1}
                </span>
                <span>/</span>
                <span>{categories.length}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={activeCategoryId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25 }}
                className="text-xs text-white/60 font-medium"
              >
                Viewing:{" "}
                <span className="text-white font-semibold">
                  {categories[activeIdx].name}
                </span>
              </motion.p>
            </AnimatePresence>

            <div className="flex items-center gap-1 mt-3">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  className="h-1 rounded-full cursor-pointer"
                  style={{ flex: 1 }}
                  animate={{
                    background:
                      i === activeIdx
                        ? `oklch(0.6 0.12 ${categoryHues[cat.id] ?? 176})`
                        : i < activeIdx
                          ? "oklch(1 0 0 / 0.25)"
                          : "oklch(1 0 0 / 0.1)",
                    boxShadow:
                      i === activeIdx
                        ? `0 0 8px oklch(0.55 0.12 ${categoryHues[cat.id] ?? 176} / 0.6)`
                        : "none",
                  }}
                  whileHover={{ background: "oklch(1 0 0 / 0.4)" }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onSelect(cat.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="p-1.5 space-y-0.5 min-h-0 max-h-[calc(100vh-280px)] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || GlassWater;
            const isActive = cat.id === activeCategoryId;
            const catHue = categoryHues[cat.id] ?? 176;
            const count = cat.groups.reduce(
              (s, g) => s + g.products.length,
              0,
            );

            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className="group relative w-full text-left"
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveBg"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.55 0.12 ${catHue} / 0.1), oklch(0.55 0.12 ${catHue} / 0.03))`,
                      border: `1px solid oklch(0.55 0.12 ${catHue} / 0.2)`,
                      boxShadow: `0 2px 16px oklch(0.55 0.12 ${catHue} / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.03)`,
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.5,
                    }}
                  />
                )}

                <div
                  className={`relative flex items-center gap-3 rounded-xl px-2.5 py-2 transition-all duration-300 ${
                    !isActive ? "hover:bg-muted/40" : ""
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveBar"
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                      style={{
                        background: `linear-gradient(180deg, oklch(0.55 0.12 ${catHue}), oklch(0.6 0.1 ${catHue + 20}))`,
                        boxShadow: `0 0 10px oklch(0.55 0.12 ${catHue} / 0.5)`,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5,
                      }}
                    />
                  )}

                  <div className="relative shrink-0">
                    <div
                      className={`relative h-10 w-10 rounded-xl overflow-hidden transition-all duration-300 ${
                        isActive ? "shadow-md" : "group-hover:shadow-sm"
                      }`}
                      style={{
                        boxShadow: isActive
                          ? `0 2px 10px oklch(0.55 0.12 ${catHue} / 0.2)`
                          : undefined,
                        border: isActive
                          ? `2px solid oklch(0.55 0.12 ${catHue} / 0.35)`
                          : "1px solid var(--border)",
                      }}
                    >
                      <Image
                        src={`/images/categories/${cat.id}.jpg`}
                        alt={cat.name}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          isActive
                            ? "scale-110 brightness-110"
                            : "group-hover:scale-110 group-hover:brightness-105"
                        }`}
                        sizes="40px"
                      />
                      {isActive && (
                        <div
                          className="absolute inset-0 opacity-15 mix-blend-overlay"
                          style={{
                            background: `oklch(0.55 0.2 ${catHue})`,
                          }}
                        />
                      )}
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-4.5 w-4.5 rounded-md flex items-center justify-center border transition-all duration-300 ${
                        isActive
                          ? "border-card bg-primary text-primary-foreground shadow-sm"
                          : "border-card bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-2.5 w-2.5" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[13px] font-medium truncate transition-colors duration-300 ${
                        isActive
                          ? "text-foreground font-semibold"
                          : "text-foreground/70 group-hover:text-foreground"
                      }`}
                    >
                      {cat.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="h-1 w-10 rounded-full bg-muted/60 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(count / 30) * 100}%`,
                            background: isActive
                              ? `oklch(0.55 0.12 ${catHue})`
                              : "oklch(0.55 0.05 178 / 0.25)",
                          }}
                        />
                      </div>
                      <span
                        className={`text-[10px] transition-colors duration-300 ${
                          isActive
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                  </div>

                  <motion.div
                    className={`flex items-center justify-center h-6 w-6 rounded-lg shrink-0 transition-all duration-300 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground/30 group-hover:text-muted-foreground/60"
                    }`}
                    animate={isActive ? { x: [0, 3, 0] } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </motion.div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORY BANNER — Tablet & Desktop
   ═══════════════════════════════════════════════════ */

function CategoryBanner({
  id,
  name,
  description,
  icon,
  groups,
  hue,
}: {
  id: string;
  name: string;
  description: string;
  icon: string;
  groups: ProductGroup[];
  hue: number;
}) {
  const Icon = iconMap[icon] || GlassWater;
  const totalProducts = groups.reduce((s, g) => s + g.products.length, 0);

  return (
    <div
      className="relative rounded-2xl lg:rounded-3xl overflow-hidden"
      style={{
        boxShadow: [
          `0 4px 20px oklch(0 0 0 / 0.08)`,
          `0 16px 48px oklch(0.55 0.12 ${hue} / 0.06)`,
        ].join(", "),
      }}
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.05] }}
          transition={{
            duration: 24,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Image
            src={`/images/categories/${id}.jpg`}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
            priority
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(ellipse at 10% 90%, oklch(0.55 0.15 ${hue} / 0.5), transparent 50%)`,
        }}
      />

      <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10 min-h-[130px] sm:min-h-[150px] lg:min-h-[180px] flex flex-col justify-end">
        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <div
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/15 shrink-0"
            style={{
              background: `linear-gradient(135deg, oklch(0.55 0.12 ${hue} / 0.35), oklch(0.45 0.1 ${hue + 15} / 0.2))`,
              backdropFilter: "blur(16px)",
              boxShadow: `0 4px 16px oklch(0.5 0.12 ${hue} / 0.2)`,
            }}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight"
              style={{ textShadow: "0 2px 16px oklch(0 0 0 / 0.5)" }}
            >
              {name}
            </h2>
            <p
              className="text-white/50 text-xs sm:text-sm max-w-lg leading-relaxed mt-0.5 hidden sm:block"
              style={{ textShadow: "0 1px 8px oklch(0 0 0 / 0.3)" }}
            >
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
          <div
            className="flex items-center gap-1.5 text-[11px] sm:text-xs text-white/80 font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10"
            style={{
              background: "oklch(1 0 0 / 0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/60" />
            <span className="font-bold text-white">{totalProducts}</span>
            <span className="text-white/50">products</span>
          </div>
          <div
            className="flex items-center gap-1.5 text-[11px] sm:text-xs text-white/80 font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10"
            style={{
              background: "oklch(1 0 0 / 0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/60" />
            <span className="font-bold text-white">{groups.length}</span>
            <span className="text-white/50">
              {groups.length === 1 ? "range" : "ranges"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DESKTOP GROUP SECTION — Tablet & Desktop
   ═══════════════════════════════════════════════════ */

function DesktopGroupSection({
  group,
  hue,
  index,
  showIndex,
  onProductClick,
}: {
  group: ProductGroup;
  hue: number;
  index: number;
  showIndex: boolean;
  onProductClick: (product: Product) => void;
}) {
  return (
    <div
      className="group/box relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl"
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
        boxShadow:
          "0 1px 4px oklch(0 0 0 / 0.03), 0 4px 16px oklch(0 0 0 / 0.02)",
      }}
    >
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover/box:opacity-100 transition-opacity duration-600 pointer-events-none -z-10 blur-2xl"
        style={{ background: `oklch(0.55 0.12 ${hue} / 0.06)` }}
      />

      <div className="relative h-[2px] overflow-hidden">
        <div
          className="h-full w-2/5 group-hover/box:w-3/4 transition-all duration-700"
          style={{
            background: `linear-gradient(90deg, oklch(0.55 0.12 ${hue}), oklch(0.6 0.1 ${hue + 25}) 60%, transparent)`,
          }}
        />
      </div>

      <div className="relative px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {showIndex && (
              <span
                className="flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center text-xs font-extrabold"
                style={{
                  background: `linear-gradient(135deg, oklch(0.55 0.12 ${hue} / 0.12), oklch(0.55 0.12 ${hue} / 0.05))`,
                  color: `oklch(var(--subtle-text-l) 0.12 ${hue})`,
                  border: `1px solid oklch(0.55 0.12 ${hue} / 0.1)`,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <div className="min-w-0">
              <h3 className="text-base lg:text-lg font-bold tracking-tight group-hover/box:text-primary transition-colors duration-300">
                {group.name}
              </h3>
              {group.features && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-md">
                  {group.features}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {group.defaultPack && (
              <span className="text-[11px] font-medium text-muted-foreground rounded-lg px-2.5 py-1 border border-border bg-muted/30">
                {group.defaultPack}
              </span>
            )}
            {group.defaultPrice && (
              <span
                className="text-[11px] font-bold rounded-lg px-2.5 py-1"
                style={{
                  background: `oklch(0.55 0.12 ${hue} / 0.1)`,
                  color: `oklch(var(--subtle-text-l) 0.12 ${hue})`,
                  border: `1px solid oklch(0.55 0.12 ${hue} / 0.12)`,
                }}
              >
                {group.defaultPrice}
              </span>
            )}
            <span className="text-[11px] text-muted-foreground/70">
              {group.products.length} item
              {group.products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-6 relative">
        <div className="h-px bg-border/40 dark:bg-border/20" />
        <div
          className="absolute top-0 left-0 h-px w-0 group-hover/box:w-1/3 transition-all duration-700"
          style={{
            background: `linear-gradient(90deg, oklch(0.55 0.12 ${hue} / 0.35), transparent)`,
          }}
        />
      </div>

      <div className="p-5 lg:p-6">
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {group.products.map((product, i) => (
            <ProductCard
              key={`${product.name}-${i}`}
              product={product}
              groupPack={group.defaultPack}
              index={i}
              accentHue={hue}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
