"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  groupPack?: string;
  groupPrice?: string;
  index: number;
  accentHue?: number;
}

export function ProductCard({
  product,
  groupPack,
  groupPrice,
  index,
  accentHue = 176,
}: ProductCardProps) {
  const pack = product.pack || groupPack;
  const price = product.price || groupPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.4, ease: "easeOut" }}
      className="group/card relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow:
          "0 1px 3px oklch(0 0 0 / 0.04), 0 4px 12px oklch(0 0 0 / 0.02)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
        style={{ background: `oklch(0.55 0.12 ${accentHue} / 0.1)` }}
      />

      {/* Hover border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-400"
        style={{
          border: `1px solid oklch(0.55 0.12 ${accentHue} / 0.25)`,
        }}
      />

      <div className="relative flex flex-col h-full transition-transform duration-400 group-hover/card:-translate-y-0.5">
        {/* Image area */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-all duration-600 group-hover/card:scale-108"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <ProductPlaceholder name={product.name} hue={accentHue} />
          )}

          {/* Top gradient */}
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

          {/* Price badge */}
          {price && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <div
                className="rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-bold text-white backdrop-blur-md"
                style={{
                  background: `linear-gradient(135deg, oklch(0.48 0.12 ${accentHue} / 0.92), oklch(0.4 0.1 ${accentHue + 15} / 0.92))`,
                  boxShadow: `0 2px 12px oklch(0.5 0.12 ${accentHue} / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.1)`,
                }}
              >
                {price}
              </div>
            </div>
          )}

          {/* Quick info overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover/card:translate-y-0 transition-transform duration-400 ease-out z-10 pointer-events-none">
            <div className="px-3 pb-2.5 pt-6 bg-gradient-to-t from-black/60 to-transparent">
              {pack && (
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-white/80 backdrop-blur-sm rounded-md px-2 py-0.5"
                  style={{
                    background: "oklch(1 0 0 / 0.08)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                  }}
                >
                  <Package className="h-2.5 w-2.5 text-white/60" />
                  {pack}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info area */}
        <div className="relative flex flex-col flex-1 px-3 sm:px-3.5 py-3 sm:py-3.5">
          {/* Accent top line */}
          <div
            className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-400"
            style={{
              background: `linear-gradient(90deg, oklch(0.55 0.12 ${accentHue} / 0.4), oklch(0.55 0.12 ${accentHue} / 0.08) 70%, transparent)`,
            }}
          />

          <h4 className="font-semibold text-[12px] sm:text-[13px] leading-snug group-hover/card:text-primary transition-colors duration-300 line-clamp-2">
            {product.name}
          </h4>

          {pack && (
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1.5 sm:hidden">
              <span
                className="inline-block h-1 w-1 rounded-full flex-shrink-0"
                style={{ background: `oklch(0.55 0.12 ${accentHue} / 0.4)` }}
              />
              {pack}
            </p>
          )}

          {/* Mobile price */}
          {price && (
            <p
              className="text-[11px] font-bold mt-2 sm:hidden"
              style={{ color: `oklch(var(--subtle-text-l) 0.12 ${accentHue})` }}
            >
              {price}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProductPlaceholder({
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
        background: `linear-gradient(145deg, oklch(var(--placeholder-l) var(--placeholder-c) ${hue}), oklch(calc(var(--placeholder-l) - 0.03) calc(var(--placeholder-c) + 0.005) ${hue + 12}))`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 25%, oklch(1 0 0 / var(--highlight-a)), transparent 55%)`,
        }}
      />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(oklch(0.55 0.12 ${hue} / 0.8) 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
        }}
      />

      {/* Initials */}
      <div
        className="relative flex items-center justify-center h-11 w-11 sm:h-14 sm:w-14 rounded-xl text-sm sm:text-lg font-bold transition-transform duration-300 group-hover/card:scale-110"
        style={{
          background: `linear-gradient(135deg, oklch(0.55 0.12 ${hue} / 0.18), oklch(0.55 0.12 ${hue} / 0.08))`,
          color: `oklch(var(--subtle-text-l) 0.1 ${hue})`,
          border: `1px solid oklch(0.55 0.12 ${hue} / 0.12)`,
          boxShadow: `inset 0 1px 0 oklch(1 0 0 / var(--highlight-a))`,
        }}
      >
        {initials}
      </div>
    </div>
  );
}
