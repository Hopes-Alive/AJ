"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlassWater, Coffee, Leaf, Cherry, Wheat, Flame, Citrus,
  Soup, ChefHat, Candy, Droplets, Home, Package,
  ChevronLeft, ChevronRight, ShoppingBag, Layers,
} from "lucide-react";
import { categories } from "@/data/products";
import { ProductGroup } from "@/types";
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
  const activeCategory = categories.find((c) => c.id === activeCategoryId)!;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const activeHue = categoryHues[activeCategoryId] ?? 176;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* ── Image-Tab Strip ── */}
      <div className="relative mb-10">
        {/* Glass container background */}
        <div
          className="absolute -inset-x-3 -inset-y-3 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(180deg, oklch(0.55 0.05 176 / 0.02), transparent 60%)",
          }}
        />

        {canScrollLeft && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none rounded-l-2xl" />
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/95 dark:bg-card/95 backdrop-blur-md border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:scale-110 transition-all duration-300"
              style={{
                boxShadow: "0 4px 20px oklch(0 0 0 / 0.08), 0 1px 4px oklch(0 0 0 / 0.05)",
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        )}
        {canScrollRight && (
          <>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none rounded-r-2xl" />
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/95 dark:bg-card/95 backdrop-blur-md border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:scale-110 transition-all duration-300"
              style={{
                boxShadow: "0 4px 20px oklch(0 0 0 / 0.08), 0 1px 4px oklch(0 0 0 / 0.05)",
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="relative flex gap-3 overflow-x-auto py-2 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || GlassWater;
            const isActive = cat.id === activeCategoryId;
            const catHue = categoryHues[cat.id] ?? 176;
            const productCount = cat.groups.reduce(
              (s, g) => s + g.products.length, 0,
            );

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className="group relative flex-shrink-0 text-left"
              >
                {/* Active glow shadow behind card */}
                {isActive && (
                  <div
                    className="absolute -inset-1 rounded-2xl blur-xl opacity-40 -z-10"
                    style={{
                      background: `oklch(0.55 0.12 ${catHue})`,
                    }}
                  />
                )}

                <div
                  className="relative w-[124px] sm:w-[142px] rounded-2xl overflow-hidden transition-all duration-400"
                  style={{
                    boxShadow: isActive
                      ? [
                          `0 4px 16px oklch(0.55 0.12 ${catHue} / 0.2)`,
                          `0 8px 32px oklch(0.55 0.12 ${catHue} / 0.12)`,
                          `0 1px 0 inset oklch(1 0 0 / 0.1)`,
                        ].join(", ")
                      : "0 2px 8px oklch(0 0 0 / 0.06), 0 1px 2px oklch(0 0 0 / 0.04)",
                    border: isActive
                      ? `2px solid oklch(0.55 0.12 ${catHue} / 0.5)`
                      : "1px solid var(--border)",
                    transform: isActive ? "scale(1.03)" : undefined,
                  }}
                >
                  {/* Image thumbnail */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image
                      src={`/images/categories/${cat.id}.jpg`}
                      alt={cat.name}
                      fill
                      className={`object-cover transition-all duration-600 ${
                        isActive
                          ? "scale-110 brightness-110"
                          : "group-hover:scale-110 group-hover:brightness-105"
                      }`}
                      sizes="150px"
                    />

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 transition-all duration-400 ${
                        isActive
                          ? "bg-gradient-to-t from-black/50 via-black/10 to-transparent"
                          : "bg-gradient-to-t from-black/60 via-black/30 to-black/15 group-hover:from-black/40 group-hover:via-black/15 group-hover:to-transparent"
                      }`}
                    />

                    {/* Active color tint */}
                    {isActive && (
                      <div
                        className="absolute inset-0 opacity-15 mix-blend-overlay"
                        style={{ background: `oklch(0.55 0.2 ${catHue})` }}
                      />
                    )}

                    {/* Product count badge */}
                    <div
                      className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : "bg-black/45 backdrop-blur-sm text-white/90"
                      }`}
                      style={isActive ? {
                        background: `oklch(0.5 0.12 ${catHue} / 0.75)`,
                        backdropFilter: "blur(8px)",
                        boxShadow: `0 2px 8px oklch(0.5 0.12 ${catHue} / 0.3)`,
                      } : undefined}
                    >
                      {productCount}
                    </div>

                    {/* Bottom text overlay (on image) */}
                    <div className="absolute bottom-0 inset-x-0 px-2.5 pb-1.5">
                      <span className="text-white/80 text-[10px] font-medium drop-shadow-sm">
                        {cat.name}
                      </span>
                    </div>
                  </div>

                  {/* Label bar */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-2 transition-all duration-300 ${
                      isActive
                        ? "bg-primary/8 dark:bg-primary/12"
                        : "bg-card dark:bg-card group-hover:bg-muted/30 dark:group-hover:bg-muted/20"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center h-5 w-5 rounded-md transition-all duration-300 ${
                        isActive ? "scale-105" : ""
                      }`}
                      style={{
                        background: isActive
                          ? `oklch(0.55 0.12 ${catHue} / 0.15)`
                          : `oklch(0.55 0.05 ${catHue} / 0.06)`,
                      }}
                    >
                      <Icon
                        className={`h-3 w-3 transition-colors duration-300 ${
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground/70"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold truncate transition-colors duration-300 ${
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                </div>

                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBar"
                    className="absolute -bottom-1.5 left-[20%] right-[20%] h-[3px] rounded-full"
                    style={{
                      background: `linear-gradient(90deg, oklch(0.55 0.12 ${catHue}), oklch(0.6 0.1 ${catHue + 20}))`,
                      boxShadow: `0 0 10px oklch(0.55 0.12 ${catHue} / 0.5), 0 0 20px oklch(0.55 0.12 ${catHue} / 0.2)`,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Category Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategoryId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <CategoryBanner
            id={activeCategoryId}
            name={activeCategory.name}
            description={activeCategory.description}
            icon={activeCategory.icon}
            groups={activeCategory.groups}
            hue={activeHue}
          />

          <div className="space-y-5 mt-7">
            {activeCategory.groups.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
              >
                <GroupSection
                  group={group}
                  hue={activeHue}
                  index={i}
                  showIndex={activeCategory.groups.length > 1}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── Category Banner ─────────────── */

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
      className="relative rounded-2xl overflow-hidden group/banner"
      style={{
        boxShadow: [
          `0 4px 16px oklch(0 0 0 / 0.1)`,
          `0 12px 40px oklch(0.55 0.12 ${hue} / 0.08)`,
        ].join(", "),
      }}
    >
      {/* Background image with Ken Burns */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.06],
          }}
          transition={{
            duration: 20,
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
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
        </motion.div>
      </div>

      {/* Multi-layer overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 15% 85%, oklch(0.55 0.15 ${hue} / 0.5), transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at 85% 15%, oklch(0.6 0.1 ${hue + 30} / 0.3), transparent 50%)`,
        }}
      />

      {/* Top highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.12), transparent)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 min-h-[180px] sm:min-h-[200px] flex flex-col justify-end">
        {/* Accent line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-[3px] rounded-full mb-5"
          style={{
            background: `linear-gradient(90deg, oklch(0.6 0.12 ${hue}), oklch(0.5 0.1 ${hue + 20}))`,
            boxShadow: `0 0 12px oklch(0.55 0.12 ${hue} / 0.4)`,
          }}
        />

        <div className="flex items-center gap-3.5 mb-3">
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center border border-white/15"
            style={{
              background: `linear-gradient(135deg, oklch(0.55 0.12 ${hue} / 0.3), oklch(0.45 0.1 ${hue + 15} / 0.2))`,
              backdropFilter: "blur(12px)",
              boxShadow: `0 4px 16px oklch(0.55 0.12 ${hue} / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.08)`,
            }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2
              className="text-2xl sm:text-3xl lg:text-[2.1rem] font-bold text-white tracking-tight"
              style={{ textShadow: "0 2px 16px oklch(0 0 0 / 0.5)" }}
            >
              {name}
            </h2>
          </div>
        </div>

        <p
          className="text-white/60 text-sm sm:text-[0.95rem] max-w-lg leading-relaxed"
          style={{ textShadow: "0 1px 8px oklch(0 0 0 / 0.3)" }}
        >
          {description}
        </p>

        {/* Stats pills */}
        <div className="flex items-center gap-3 mt-4">
          <div
            className="flex items-center gap-1.5 text-xs text-white/80 font-medium px-3 py-1.5 rounded-lg border border-white/10"
            style={{
              background: "oklch(1 0 0 / 0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Package className="h-3.5 w-3.5 text-white/60" />
            <span className="font-bold text-white">{totalProducts}</span>
            <span className="text-white/50">products</span>
          </div>
          <div
            className="flex items-center gap-1.5 text-xs text-white/80 font-medium px-3 py-1.5 rounded-lg border border-white/10"
            style={{
              background: "oklch(1 0 0 / 0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Layers className="h-3.5 w-3.5 text-white/60" />
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

/* ─────────────── Group Section ─────────────── */

function GroupSection({
  group,
  hue,
  index,
  showIndex,
}: {
  group: ProductGroup;
  hue: number;
  index: number;
  showIndex: boolean;
}) {
  return (
    <div
      className="group/box relative rounded-2xl overflow-hidden transition-all duration-400 hover:shadow-lg"
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
        boxShadow: "0 2px 8px oklch(0 0 0 / 0.04), 0 1px 2px oklch(0 0 0 / 0.03)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover/box:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
        style={{
          background: `oklch(0.55 0.12 ${hue} / 0.06)`,
          filter: "blur(20px)",
        }}
      />

      {/* Accent bar with gradient */}
      <div className="relative h-[2px] overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, oklch(0.55 0.12 ${hue}), oklch(0.6 0.1 ${hue + 25}) 40%, oklch(0.55 0.05 ${hue} / 0.1) 80%, transparent)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover/box:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, oklch(0.55 0.12 ${hue}), oklch(0.6 0.1 ${hue + 25}) 60%, oklch(0.55 0.05 ${hue} / 0.2))`,
            boxShadow: `0 1px 8px oklch(0.55 0.12 ${hue} / 0.3)`,
          }}
        />
      </div>

      {/* Subtle inner top glow */}
      <div
        className="absolute top-0 inset-x-0 h-20 pointer-events-none opacity-40"
        style={{
          background: `linear-gradient(180deg, oklch(1 0 0 / var(--highlight-a)), transparent)`,
        }}
      />

      {/* Header */}
      <div className="relative px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {showIndex && (
              <span
                className="flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-300 group-hover/box:scale-105"
                style={{
                  background: `linear-gradient(135deg, oklch(0.55 0.12 ${hue} / 0.12), oklch(0.55 0.12 ${hue} / 0.06))`,
                  color: `oklch(var(--subtle-text-l) 0.12 ${hue})`,
                  border: `1px solid oklch(0.55 0.12 ${hue} / 0.1)`,
                  boxShadow: `inset 0 1px 0 oklch(1 0 0 / var(--highlight-a))`,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold tracking-tight group-hover/box:text-primary transition-colors duration-300">
                {group.name}
              </h3>
              {group.features && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-lg">
                  {group.features}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {group.defaultPack && (
              <span
                className="hidden sm:inline-flex text-[11px] font-medium text-muted-foreground rounded-lg px-2.5 py-1"
                style={{
                  background: "oklch(0.55 0.05 178 / 0.04)",
                  border: "1px solid var(--border)",
                }}
              >
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
            <span
              className="text-[11px] font-semibold rounded-lg px-2 py-1"
              style={{
                color: "var(--muted-foreground)",
                background: "oklch(0.55 0.05 178 / 0.03)",
              }}
            >
              {group.products.length} item
              {group.products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 sm:mx-6 relative">
        <div className="h-px bg-border/40 dark:bg-border/25" />
        <div
          className="absolute top-0 left-0 h-px w-1/4 group-hover/box:w-1/2 transition-all duration-700"
          style={{
            background: `linear-gradient(90deg, oklch(0.55 0.12 ${hue} / 0.3), transparent)`,
          }}
        />
      </div>

      {/* Products grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-3.5">
          {group.products.map((product, i) => (
            <ProductCard
              key={`${product.name}-${i}`}
              product={product}
              groupPack={group.defaultPack}
              index={i}
              accentHue={hue}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
